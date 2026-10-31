import { PhotoAttribution, Trip } from "@/types/trip";

export interface EnrichedImage {
  url: string;
  attribution?: PhotoAttribution;
}

export interface UnsplashRawPhoto {
  id: string;
  url: string;
  description?: string;
  alt_description?: string;
  tags?: string[];
  attribution: PhotoAttribution;
  width?: number;
  height?: number;
}

// In-memory cache for search query pools (query -> array of raw photos)
const memoryPoolCache = new Map<string, UnsplashRawPhoto[]>();

// Maximum Unsplash searches per trip (1 destination + up to 4 categories + 1 stay)
export const MAX_UNSPLASH_SEARCHES_PER_TRIP = 6;
export const PHOTOS_PER_SEARCH = 30;

// Curated high-res default travel placeholders (valid Unsplash CDN images)
const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";
const DEFAULT_ACTIVITY_IMAGE =
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80";
const DEFAULT_STAY_IMAGE =
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80";

/**
 * Normalizes a query for caching.
 */
export function normalizeImageQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Optional persistent cache lookup from Supabase image_cache table.
 */
async function getDbCachedPool(normQuery: string): Promise<UnsplashRawPhoto[] | null> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("image_cache")
      .select("image_url")
      .eq("query", normQuery)
      .maybeSingle();

    if (data && data.image_url && data.image_url.startsWith("[")) {
      const photos: UnsplashRawPhoto[] = JSON.parse(data.image_url);
      if (Array.isArray(photos) && photos.length > 0) {
        memoryPoolCache.set(normQuery, photos);
        return photos;
      }
    }
  } catch {
    // Database cache not available or table not migrated; catch silently
  }
  return null;
}

/**
 * Optional persistent cache write to Supabase image_cache table.
 */
async function saveDbCachedPool(
  normQuery: string,
  photos: UnsplashRawPhoto[]
): Promise<void> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    await supabase.from("image_cache").upsert({
      query: normQuery,
      image_url: JSON.stringify(photos),
      photographer_name: photos[0]?.attribution?.photographerName || null,
      photographer_url: photos[0]?.attribution?.photographerUrl || null,
      unsplashUrl: photos[0]?.attribution?.unsplashUrl || null,
      download_location: photos[0]?.attribution?.downloadLocation || null,
    });
  } catch {
    // Catch silently
  }
}

/**
 * Fire-and-forget download tracking per Unsplash API Guidelines.
 * Only called for photos actually assigned to trip cards.
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
 * Fetches up to `per_page` landscape photos from Unsplash for a given query.
 * Checks memory and DB cache first. Returns array of parsed UnsplashRawPhoto.
 * Never throws.
 */
export async function searchUnsplashPool(
  query: string,
  perPage = PHOTOS_PER_SEARCH,
  timeoutMs = 3500
): Promise<{ photos: UnsplashRawPhoto[]; fromCache: boolean }> {
  const norm = normalizeImageQuery(query);

  // 1. Check in-memory cache
  if (memoryPoolCache.has(norm)) {
    return { photos: memoryPoolCache.get(norm)!, fromCache: true };
  }

  // 2. Check persistent DB cache
  const dbPhotos = await getDbCachedPool(norm);
  if (dbPhotos && dbPhotos.length > 0) {
    return { photos: dbPhotos, fromCache: true };
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return { photos: [], fromCache: false };
  }

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&per_page=${perPage}&orientation=landscape`;

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
          "[Unsplash] Rate limit reached (HTTP 429). Falling back to destination pool / placeholders."
        );
      } else {
        console.warn(
          `[Unsplash] API responded with HTTP ${res.status} for query "${query}".`
        );
      }
      return { photos: [], fromCache: false };
    }

    const data = await res.json();
    if (data.results && Array.isArray(data.results)) {
      const photos: UnsplashRawPhoto[] = data.results.map((p: any) => ({
        id: p.id,
        url: p.urls?.regular || p.urls?.small || DEFAULT_COVER_IMAGE,
        description: p.description || undefined,
        alt_description: p.alt_description || undefined,
        tags: Array.isArray(p.tags)
          ? p.tags.map((t: any) => (typeof t === "string" ? t : t.title || "")).filter(Boolean)
          : undefined,
        attribution: {
          photographerName: p.user?.name || "Unsplash Photographer",
          photographerUrl: p.user?.links?.html || "https://unsplash.com",
          unsplashUrl: "https://unsplash.com",
          downloadLocation: p.links?.download_location,
        },
        width: p.width,
        height: p.height,
      }));

      // Cache result in memory
      memoryPoolCache.set(norm, photos);

      // Async write to DB cache
      saveDbCachedPool(norm, photos).catch(() => {});

      return { photos, fromCache: false };
    }

    return { photos: [], fromCache: false };
  } catch (err: any) {
    console.warn(`[Unsplash] Fetch error for query "${query}":`, err?.message);
    return { photos: [], fromCache: false };
  }
}

/**
 * Computes a keyword match score between an activity/stay name and a photo's metadata.
 */
function scorePhotoMatch(photo: UnsplashRawPhoto, name: string): number {
  if (!name) return 0;
  const words = name
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (words.length === 0) return 0;

  const corpus = `${photo.description || ""} ${photo.alt_description || ""} ${(
    photo.tags || []
  ).join(" ")}`.toLowerCase();

  let score = 0;
  for (const word of words) {
    if (corpus.includes(word)) {
      score += 1;
    }
  }
  return score;
}

/**
 * Finds and marks the best unused photo from a primary pool, with fallback to destination pool,
 * and finally to any unused photo across all pools before resorting to default placeholder.
 */
function pickUnusedPhoto(
  primaryPool: UnsplashRawPhoto[],
  fallbackPool: UnsplashRawPhoto[],
  allPools: UnsplashRawPhoto[][],
  matchName: string,
  usedIds: Set<string>
): UnsplashRawPhoto | null {
  // 1. Try primary pool
  let bestPhoto: UnsplashRawPhoto | null = null;
  let bestScore = -1;

  for (const photo of primaryPool) {
    if (usedIds.has(photo.id)) continue;
    const score = scorePhotoMatch(photo, matchName);
    if (score > bestScore) {
      bestScore = score;
      bestPhoto = photo;
    }
  }

  if (bestPhoto) {
    usedIds.add(bestPhoto.id);
    return bestPhoto;
  }

  // 2. Try fallback pool (destination pool)
  bestScore = -1;
  bestPhoto = null;

  for (const photo of fallbackPool) {
    if (usedIds.has(photo.id)) continue;
    const score = scorePhotoMatch(photo, matchName);
    if (score > bestScore) {
      bestScore = score;
      bestPhoto = photo;
    }
  }

  if (bestPhoto) {
    usedIds.add(bestPhoto.id);
    return bestPhoto;
  }

  // 3. Try any unused photo in any pool
  for (const pool of allPools) {
    for (const photo of pool) {
      if (!usedIds.has(photo.id)) {
        usedIds.add(photo.id);
        return photo;
      }
    }
  }

  // All pools exhausted
  return null;
}

/**
 * Enriches a Trip object with cover, activity, and stay images using a Pool-Based Approach:
 * 1. Runs at most 6 Unsplash searches with per_page=30 in parallel with a short timeout:
 *    - 1 for destination (cover image & fallback pool)
 *    - up to 4 for most distinct activity categories ("[destination] [category]")
 *    - 1 for stays ("[destination] hotel")
 * 2. Deduplicates photo IDs across all pools.
 * 3. Assigns photos so no photo ID is used more than once in the same trip.
 * 4. Only fires download tracking for photos actually assigned.
 * 5. Falls back gracefully and never fails generation.
 */
export async function enrichTripImages(
  trip: Trip,
  destination: string,
  country: string
): Promise<{ trip: Trip; unsplashRequestsMade: number }> {
  let unsplashRequestsMade = 0;
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  // 1. Identify distinct activity categories and take the top 4 most common
  const categoryCounts = new Map<string, number>();
  for (const day of trip.days) {
    for (const act of day.activities) {
      if (act.category) {
        const cat = act.category.trim();
        categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
      }
    }
  }

  const topCategories = Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([cat]) => cat);

  // 2. Prepare search queries (at most 6)
  const destQuery = destination.trim();
  const staysQuery = `${destination} hotel`.trim();
  const categoryQueries = topCategories.map((cat) => `${destination} ${cat}`.trim());

  // All queries to run in parallel
  const searchPlan: { type: "dest" | "stays" | "category"; query: string; category?: string }[] = [
    { type: "dest", query: destQuery },
    { type: "stays", query: staysQuery },
    ...categoryQueries.map((q, idx) => ({
      type: "category" as const,
      query: q,
      category: topCategories[idx],
    })),
  ];

  // 3. Execute searches in parallel
  const searchPromises = searchPlan.map(async (item) => {
    const result = await searchUnsplashPool(item.query, PHOTOS_PER_SEARCH);
    return { ...item, photos: result.photos, fromCache: result.fromCache };
  });

  const searchResults = await Promise.allSettled(searchPromises);

  // Count actual external API requests made (excluding cache hits)
  for (const res of searchResults) {
    if (res.status === "fulfilled" && !res.value.fromCache && accessKey) {
      unsplashRequestsMade++;
    }
  }

  // 4. Build deduplicated pools
  const seenGlobalPhotoIds = new Set<string>();

  let destinationPool: UnsplashRawPhoto[] = [];
  let staysPool: UnsplashRawPhoto[] = [];
  const categoryPools = new Map<string, UnsplashRawPhoto[]>();

  for (const res of searchResults) {
    if (res.status !== "fulfilled") continue;
    const { type, photos, category } = res.value;

    const uniquePhotos: UnsplashRawPhoto[] = [];
    for (const photo of photos) {
      if (!seenGlobalPhotoIds.has(photo.id)) {
        seenGlobalPhotoIds.add(photo.id);
        uniquePhotos.push(photo);
      }
    }

    if (type === "dest") {
      destinationPool = uniquePhotos;
    } else if (type === "stays") {
      staysPool = uniquePhotos;
    } else if (type === "category" && category) {
      categoryPools.set(category.toLowerCase().trim(), uniquePhotos);
    }
  }

  const allPoolsList: UnsplashRawPhoto[][] = [
    destinationPool,
    staysPool,
    ...Array.from(categoryPools.values()),
  ];

  // 5. Track used photos in this trip and download locations to fire
  const usedPhotoIds = new Set<string>();
  const assignedDownloadLocations = new Set<string>();

  // A. Assign Cover Image (unique, prefers landscape)
  let coverPhoto: UnsplashRawPhoto | null = null;
  for (const photo of destinationPool) {
    if (!usedPhotoIds.has(photo.id)) {
      coverPhoto = photo;
      usedPhotoIds.add(photo.id);
      break;
    }
  }

  // If destination pool was empty, pick from any pool
  if (!coverPhoto) {
    for (const pool of allPoolsList) {
      for (const photo of pool) {
        if (!usedPhotoIds.has(photo.id)) {
          coverPhoto = photo;
          usedPhotoIds.add(photo.id);
          break;
        }
      }
      if (coverPhoto) break;
    }
  }

  if (coverPhoto) {
    trip.coverImageUrl = coverPhoto.url;
    trip.coverImageAttribution = coverPhoto.attribution;
    if (coverPhoto.attribution.downloadLocation) {
      assignedDownloadLocations.add(coverPhoto.attribution.downloadLocation);
    }
  } else {
    trip.coverImageUrl = DEFAULT_COVER_IMAGE;
  }

  // B. Assign Stays (one different photo per day)
  trip.days.forEach((day) => {
    if (day.stay) {
      const stayPhoto = pickUnusedPhoto(
        staysPool,
        destinationPool,
        allPoolsList,
        day.stay.name,
        usedPhotoIds
      );

      if (stayPhoto) {
        day.stay.imageUrl = stayPhoto.url;
        day.stay.imageAttribution = stayPhoto.attribution;
        if (stayPhoto.attribution.downloadLocation) {
          assignedDownloadLocations.add(stayPhoto.attribution.downloadLocation);
        }
      } else {
        day.stay.imageUrl = DEFAULT_STAY_IMAGE;
      }
    }
  });

  // C. Assign Activities
  trip.days.forEach((day) => {
    day.activities.forEach((activity) => {
      const normCat = (activity.category || "").toLowerCase().trim();
      const primaryCatPool = categoryPools.get(normCat) || [];

      const actPhoto = pickUnusedPhoto(
        primaryCatPool,
        destinationPool,
        allPoolsList,
        activity.name,
        usedPhotoIds
      );

      if (actPhoto) {
        activity.imageUrl = actPhoto.url;
        activity.imageAttribution = actPhoto.attribution;
        if (actPhoto.attribution.downloadLocation) {
          assignedDownloadLocations.add(actPhoto.attribution.downloadLocation);
        }
      } else {
        activity.imageUrl = DEFAULT_ACTIVITY_IMAGE;
      }
    });
  });

  // 6. Fire download tracking only for photos actually assigned to cards
  if (accessKey && assignedDownloadLocations.size > 0) {
    for (const loc of assignedDownloadLocations) {
      trackUnsplashDownload(loc, accessKey);
    }
  }

  return { trip, unsplashRequestsMade };
}
