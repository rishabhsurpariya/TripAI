import { PhotoAttribution, Trip } from "@/types/trip";

export interface EnrichedImage {
  url: string;
  attribution?: PhotoAttribution;
}

// In-memory cache for Unsplash search queries across requests in Node server instance
const memoryImageCache = new Map<string, EnrichedImage>();

// Maximum Unsplash external API requests per single trip generation
export const MAX_UNSPLASH_REQUESTS_PER_TRIP = 10;

// Curated high-res default travel placeholders (valid Unsplash CDN images)
const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";
const DEFAULT_ACTIVITY_IMAGE =
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80";
const DEFAULT_STAY_IMAGE =
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80";

/**
 * Normalizes a query for caching and similarity reuse.
 */
export function normalizeImageQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks in-memory cache for an exact or closely similar query.
 */
function getMemoryCachedImage(normQuery: string): EnrichedImage | null {
  if (memoryImageCache.has(normQuery)) {
    return memoryImageCache.get(normQuery)!;
  }
  // Check for subset matches (reuse the same image for similar queries)
  for (const [key, val] of memoryImageCache.entries()) {
    if (key.length > 5 && (normQuery.includes(key) || key.includes(normQuery))) {
      return val;
    }
  }
  return null;
}

/**
 * Optional persistent cache lookup from Supabase image_cache table.
 */
async function getDbCachedImage(normQuery: string): Promise<EnrichedImage | null> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("image_cache")
      .select("*")
      .eq("query", normQuery)
      .maybeSingle();

    if (data && data.image_url) {
      const enriched: EnrichedImage = {
        url: data.image_url,
        attribution: data.photographer_name
          ? {
              photographerName: data.photographer_name,
              photographerUrl: data.photographer_url,
              unsplashUrl: data.unsplash_url || "https://unsplash.com",
              downloadLocation: data.download_location,
            }
          : undefined,
      };
      memoryImageCache.set(normQuery, enriched);
      return enriched;
    }
  } catch {
    // Database cache not available or table not migrated; catch silently
  }
  return null;
}

/**
 * Optional persistent cache write to Supabase image_cache table.
 */
async function saveDbCachedImage(
  normQuery: string,
  image: EnrichedImage
): Promise<void> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    await supabase.from("image_cache").upsert({
      query: normQuery,
      image_url: image.url,
      photographer_name: image.attribution?.photographerName || null,
      photographer_url: image.attribution?.photographerUrl || null,
      unsplash_url: image.attribution?.unsplashUrl || null,
      download_location: image.attribution?.downloadLocation || null,
    });
  } catch {
    // Catch silently
  }
}

/**
 * Fire-and-forget download tracking per Unsplash API Guidelines.
 */
function trackUnsplashDownload(downloadLocation: string, accessKey: string) {
  if (!downloadLocation || !accessKey) return;
  fetch(downloadLocation, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      "Accept-Version": "v1",
    },
    signal: AbortSignal.timeout(3000),
  }).catch(() => {
    // Non-blocking, ignore background tracking network issues
  });
}

/**
 * Fetches a single landscape photo from the Unsplash API with a short timeout.
 * Returns null on rate-limit, network error, or missing key (never throws).
 */
export async function searchUnsplashPhoto(
  query: string,
  timeoutMs = 3500
): Promise<EnrichedImage | null> {
  const norm = normalizeImageQuery(query);

  // 1. Check in-memory cache
  const cachedMem = getMemoryCachedImage(norm);
  if (cachedMem) {
    return cachedMem;
  }

  // 2. Check persistent DB cache
  const cachedDb = await getDbCachedImage(norm);
  if (cachedDb) {
    return cachedDb;
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return null;
  }

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&per_page=1&orientation=landscape`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      if (res.status === 429) {
        console.warn(
          "[Unsplash] Rate limit reached (HTTP 429). Falling back to destination photo/placeholders."
        );
      } else {
        console.warn(
          `[Unsplash] API responded with status ${res.status} for query "${query}".`
        );
      }
      return null;
    }

    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const photo = data.results[0];
      const enriched: EnrichedImage = {
        url: photo.urls?.regular || photo.urls?.small || DEFAULT_COVER_IMAGE,
        attribution: {
          photographerName: photo.user?.name || "Unsplash Photographer",
          photographerUrl:
            photo.user?.links?.html || "https://unsplash.com",
          unsplashUrl: "https://unsplash.com",
          downloadLocation: photo.links?.download_location,
        },
      };

      // Cache result in memory
      memoryImageCache.set(norm, enriched);

      // Async write to DB cache
      saveDbCachedImage(norm, enriched).catch(() => {});

      // Trigger Unsplash download endpoint asynchronously
      if (photo.links?.download_location) {
        trackUnsplashDownload(photo.links.download_location, accessKey);
      }

      return enriched;
    }

    return null;
  } catch (err: any) {
    console.warn(`[Unsplash] Fetch error for query "${query}":`, err?.message);
    return null;
  }
}

/**
 * Enriches a Trip object with cover, activity, and stay images.
 * Adheres strictly to low hourly request limits:
 * - Caches in memory and database
 * - Reuses same images for similar queries
 * - Limits external requests per trip to MAX_UNSPLASH_REQUESTS_PER_TRIP (10)
 * - Uses destination photo as fallback for the rest
 * - Runs requests in parallel with short timeout
 * - Never fails generation if Unsplash fails
 */
export async function enrichTripImages(
  trip: Trip,
  destination: string,
  country: string
): Promise<{ trip: Trip; unsplashRequestsMade: number }> {
  let unsplashRequestsMade = 0;

  // 1. Destination Cover Photo
  const destQuery = `${destination} ${country}`.trim();
  const normDestQuery = normalizeImageQuery(destQuery);
  let coverImage: EnrichedImage | null =
    getMemoryCachedImage(normDestQuery) ||
    (await getDbCachedImage(normDestQuery));

  if (!coverImage && unsplashRequestsMade < MAX_UNSPLASH_REQUESTS_PER_TRIP) {
    unsplashRequestsMade++;
    coverImage = await searchUnsplashPhoto(destQuery);
  }

  // If destination + country yielded nothing, fallback to just destination
  if (!coverImage && unsplashRequestsMade < MAX_UNSPLASH_REQUESTS_PER_TRIP) {
    unsplashRequestsMade++;
    coverImage = await searchUnsplashPhoto(destination);
  }

  // Fallback to placeholder if Unsplash failed or is rate-limited
  if (!coverImage) {
    coverImage = {
      url: trip.coverImageUrl || DEFAULT_COVER_IMAGE,
    };
  }

  trip.coverImageUrl = coverImage.url;
  trip.coverImageAttribution = coverImage.attribution;

  // 2. Prepare items (activities & stays) needing photos
  type TargetItem =
    | { type: "activity"; dayIndex: number; actIndex: number; query: string }
    | { type: "stay"; dayIndex: number; query: string };

  const targets: TargetItem[] = [];

  trip.days.forEach((day, dIdx) => {
    if (day.stay && day.stay.name) {
      targets.push({
        type: "stay",
        dayIndex: dIdx,
        query: `${day.stay.name} ${destination}`,
      });
    }

    day.activities.forEach((act, aIdx) => {
      targets.push({
        type: "activity",
        dayIndex: dIdx,
        actIndex: aIdx,
        query: `${act.name} ${destination}`,
      });
    });
  });

  // 3. First pass: resolve from in-memory cache (0 external API requests used)
  const pendingTargets: TargetItem[] = [];

  for (const target of targets) {
    const norm = normalizeImageQuery(target.query);
    const cached = getMemoryCachedImage(norm);
    if (cached) {
      if (target.type === "activity") {
        trip.days[target.dayIndex].activities[target.actIndex].imageUrl =
          cached.url;
        trip.days[target.dayIndex].activities[target.actIndex].imageAttribution =
          cached.attribution;
      } else {
        trip.days[target.dayIndex].stay.imageUrl = cached.url;
        trip.days[target.dayIndex].stay.imageAttribution = cached.attribution;
      }
    } else {
      pendingTargets.push(target);
    }
  }

  // 4. Second pass: fetch up to remaining budget in parallel
  const remainingBudget = Math.max(
    0,
    MAX_UNSPLASH_REQUESTS_PER_TRIP - unsplashRequestsMade
  );
  const itemsToFetch = pendingTargets.slice(0, remainingBudget);
  const overflowItems = pendingTargets.slice(remainingBudget);

  if (itemsToFetch.length > 0) {
    unsplashRequestsMade += itemsToFetch.length;

    const fetchPromises = itemsToFetch.map(async (target) => {
      const result = await searchUnsplashPhoto(target.query);
      return { target, result };
    });

    const results = await Promise.allSettled(fetchPromises);

    for (const res of results) {
      if (res.status === "fulfilled") {
        const { target, result } = res.value;
        const finalImage = result || coverImage;

        if (target.type === "activity") {
          trip.days[target.dayIndex].activities[target.actIndex].imageUrl =
            finalImage.url || DEFAULT_ACTIVITY_IMAGE;
          trip.days[target.dayIndex].activities[
            target.actIndex
          ].imageAttribution = finalImage.attribution;
        } else {
          trip.days[target.dayIndex].stay.imageUrl =
            finalImage.url || DEFAULT_STAY_IMAGE;
          trip.days[target.dayIndex].stay.imageAttribution =
            finalImage.attribution;
        }
      }
    }
  }

  // 5. Third pass: for items beyond request budget, use destination photo as fallback
  for (const target of overflowItems) {
    if (target.type === "activity") {
      trip.days[target.dayIndex].activities[target.actIndex].imageUrl =
        coverImage.url || DEFAULT_ACTIVITY_IMAGE;
      trip.days[target.dayIndex].activities[target.actIndex].imageAttribution =
        coverImage.attribution;
    } else {
      trip.days[target.dayIndex].stay.imageUrl =
        coverImage.url || DEFAULT_STAY_IMAGE;
      trip.days[target.dayIndex].stay.imageAttribution =
        coverImage.attribution;
    }
  }

  return { trip, unsplashRequestsMade };
}
