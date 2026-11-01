interface UnsplashApiResponsePhoto {
  id: string;
  urls?: { regular?: string; small?: string };
  description?: string | null;
  alt_description?: string | null;
  slug?: string;
  tags?: Array<string | { title?: string }>;
  location?: { title?: string; name?: string; city?: string; country?: string };
  user?: { name?: string; links?: { html?: string } };
  links?: { download_location?: string };
  width?: number;
  height?: number;
}
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
  location?: string;
  slug?: string;
  attribution: PhotoAttribution;
  width?: number;
  height?: number;
  passedFilter?: boolean;
  matchedFilterTerm?: string;
}

// In-memory cache for search query pools (query -> array of raw photos)
const memoryPoolCache = new Map<string, UnsplashRawPhoto[]>();

// Maximum Unsplash searches per trip (1 destination + 1 stay + up to 4 categories)
export const MAX_UNSPLASH_SEARCHES_PER_TRIP = 6;
export const PHOTOS_PER_SEARCH = 30;

// Curated high-res neutral travel placeholders (never depict wrong cities/monuments)
export const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";
export const DEFAULT_ACTIVITY_IMAGE =
  "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80";
export const DEFAULT_STAY_IMAGE =
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80";

export const NEUTRAL_COVER_ATTRIBUTION: PhotoAttribution = {
  photographerName: "Francesca Tirico",
  photographerUrl: "https://unsplash.com/@francesca_tirico",
  unsplashUrl: "https://unsplash.com",
};

export const NEUTRAL_ACTIVITY_ATTRIBUTION: PhotoAttribution = {
  photographerName: "Dariusz Sankowski",
  photographerUrl: "https://unsplash.com/@dariuszsankowski",
  unsplashUrl: "https://unsplash.com",
};

export const NEUTRAL_STAY_ATTRIBUTION: PhotoAttribution = {
  photographerName: "Visual Stories",
  photographerUrl: "https://unsplash.com",
  unsplashUrl: "https://unsplash.com",
};

/**
 * Normalizes text in a case-insensitive way and strips diacritics/accents.
 */
export function normalizeForRelevance(text: string): string {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks if a corpus contains a term.
 * For short words (length <= 3), requires word boundaries to prevent false positives like "goa" in "goal".
 */
export function matchesRelevanceTerm(corpus: string, term: string): boolean {
  if (!term || term.length < 2) return false;
  if (term.length <= 3) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|\\s|[_-])${escaped}([ns]?|[_-]*)(\\s|[_-]|$)`, "i");
    return regex.test(corpus);
  }
  return corpus.includes(term);
}

export interface RelevanceTerms {
  destination: string;
  country: string;
  placeTerms: string[];
}

/**
 * Extracts destination, country, and well-known place/activity names from the itinerary.
 */
export function buildRelevanceTerms(
  destination: string,
  country: string,
  trip: Trip
): RelevanceTerms {
  const normDest = normalizeForRelevance(destination);
  const normCountry = normalizeForRelevance(country);

  const stopWords = new Set([
    "visit", "tour", "explore", "day", "walk", "walking", "morning",
    "afternoon", "evening", "dinner", "lunch", "breakfast", "hotel",
    "resort", "the", "and", "in", "at", "to", "of", "for", "with",
    "around", "near", "view", "trip", "center", "centre", "city",
    "street", "road", "park", "garden", "market", "experience",
    "discovery", "session", "stop", "relax", "relaxation", "check",
    "arrival", "departure", "stay", "night", "spa", "inn", "hostel",
    "authentic", "local", "best", "great", "famous"
  ]);

  const placeTermsSet = new Set<string>();

  for (const day of trip.days) {
    if (day.stay?.name) {
      const normStay = normalizeForRelevance(day.stay.name);
      if (normStay.length >= 3 && !stopWords.has(normStay)) {
        placeTermsSet.add(normStay);
      }
      for (const word of normStay.split(/\s+/)) {
        if (word.length >= 4 && !stopWords.has(word)) {
          placeTermsSet.add(word);
        }
      }
    }

    for (const act of day.activities) {
      if (act.name) {
        const normAct = normalizeForRelevance(act.name);
        if (normAct.length >= 3 && !stopWords.has(normAct)) {
          placeTermsSet.add(normAct);
        }
        for (const word of normAct.split(/\s+/)) {
          if (word.length >= 4 && !stopWords.has(word)) {
            placeTermsSet.add(word);
          }
        }
      }
    }
  }

  return {
    destination: normDest,
    country: normCountry,
    placeTerms: Array.from(placeTermsSet),
  };
}

/**
 * Relevance filter: checks whether the photo's alt_description, description,
 * tags, location, or slug mention destination name, country, or itinerary place name.
 */
export function isVerifiedPhoto(
  photo: UnsplashRawPhoto,
  terms: RelevanceTerms
): { verified: boolean; matchedTerm?: string } {
  const corpus = normalizeForRelevance(
    [
      photo.alt_description,
      photo.description,
      (photo.tags || []).join(" "),
      photo.location,
      photo.slug,
    ]
      .filter(Boolean)
      .join(" ")
  );

  if (!corpus) return { verified: false };

  // 1. Destination check
  if (terms.destination && matchesRelevanceTerm(corpus, terms.destination)) {
    return { verified: true, matchedTerm: terms.destination };
  }
  const destWords = terms.destination.split(/\s+/).filter((w) => w.length >= 3);
  for (const dw of destWords) {
    if (matchesRelevanceTerm(corpus, dw)) {
      return { verified: true, matchedTerm: dw };
    }
  }

  // 2. Country check
  if (terms.country && matchesRelevanceTerm(corpus, terms.country)) {
    return { verified: true, matchedTerm: terms.country };
  }

  // 3. Itinerary place names
  for (const pt of terms.placeTerms) {
    if (matchesRelevanceTerm(corpus, pt)) {
      return { verified: true, matchedTerm: pt };
    }
  }

  return { verified: false };
}

/**
 * Computes a keyword match score between an activity/stay name and a photo's metadata.
 */
function scorePhotoMatch(photo: UnsplashRawPhoto, name: string): number {
  if (!name) return 0;
  const words = normalizeForRelevance(name)
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (words.length === 0) return 0;

  const corpus = normalizeForRelevance(
    [
      photo.alt_description,
      photo.description,
      (photo.tags || []).join(" "),
      photo.location,
      photo.slug,
    ]
      .filter(Boolean)
      .join(" ")
  );

  let score = 0;
  for (const word of words) {
    if (corpus.includes(word)) {
      score += 1;
    }
  }
  return score;
}


/**
 * Persistent cache lookup from Supabase image_cache table.
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
    // Database cache not available; catch silently
  }
  return null;
}

/**
 * Persistent cache write to Supabase image_cache table.
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
      unsplash_url: photos[0]?.attribution?.unsplashUrl || null,
      download_location: photos[0]?.attribution?.downloadLocation || null,
    });
  } catch {
    // Catch silently
  }
}

/**
 * Fire-and-forget download tracking per Unsplash API Guidelines.
 * Only fired for photos actually assigned to trip cards.
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
    // Non-fatal, ignore background tracking network issues
  });
}

/**
 * Fetches up to `per_page` landscape photos from Unsplash for a given query.
 * Checks memory and DB cache first.
 * Never throws.
 */
export async function searchUnsplashPool(
  query: string,
  perPage = PHOTOS_PER_SEARCH,
  timeoutMs = 3500
): Promise<{ photos: UnsplashRawPhoto[]; fromCache: boolean }> {
  const norm = normalizeForRelevance(query);

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
      if (res.status === 429 || res.status === 403) {
        console.warn(
          `[Unsplash] Rate limit hit (HTTP ${res.status}). Using verified cached pools or neutral placeholders.`
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
      const photos: UnsplashRawPhoto[] = (data.results as UnsplashApiResponsePhoto[]).map((p) => ({
        id: p.id,
        url: p.urls?.regular || p.urls?.small || DEFAULT_COVER_IMAGE,
        description: p.description || undefined,
        alt_description: p.alt_description || undefined,
        slug: p.slug || undefined,
        tags: Array.isArray(p.tags)
          ? p.tags
              .map((t) => (typeof t === "string" ? t : t.title || ""))
              .filter(Boolean)
          : undefined,
        location: [
          p.location?.title,
          p.location?.name,
          p.location?.city,
          p.location?.country,
        ]
          .filter(Boolean)
          .join(" ") || undefined,
        attribution: {
          photographerName: p.user?.name || "Unsplash Photographer",
          photographerUrl: p.user?.links?.html || "https://unsplash.com",
          unsplashUrl: "https://unsplash.com",
          downloadLocation: p.links?.download_location,
        },
        width: p.width,
        height: p.height,
      }));

      // Cache raw search result
      memoryPoolCache.set(norm, photos);
      saveDbCachedPool(norm, photos).catch(() => {});

      return { photos, fromCache: false };
    }

    return { photos: [], fromCache: false };
  } catch (err: unknown) {
    console.warn(`[Unsplash] Fetch error for query "${query}":`, (err as Error)?.message);
    return { photos: [], fromCache: false };
  }
}

/**
 * Assigns photos following the strict priority rules:
 * a. Best match: a verified photo whose text mentions specific activity or place name.
 * b. A verified photo from matching category pool.
 * c. A verified photo from destination pool.
 * d. If no verified photo exists, use neutral placeholder. Never use unverified photo.
 * Uniqueness preference: avoid repeating within trip while unused verified photos remain,
 * but reuse verified photos instead of using unverified ones.
 */
function pickVerifiedPhotoForCard(params: {
  cardTitle?: string;
  query?: string;
  itemName: string;
  preferredCategoryPool: UnsplashRawPhoto[];
  destinationPool: UnsplashRawPhoto[];
  allVerifiedPools: UnsplashRawPhoto[][];
  usedPhotoIds: Set<string>;
  usedCounts: Map<string, number>;
  defaultImage: string;
  defaultAttribution: PhotoAttribution;
  preferLandscape?: boolean;
}): {
  url: string;
  attribution: PhotoAttribution;
  downloadLocation?: string;
  isPlaceholder: boolean;
} {
  const {
    itemName,
    preferredCategoryPool,
    destinationPool,
    allVerifiedPools,
    usedPhotoIds,
    usedCounts,
    defaultImage,
    defaultAttribution,
    preferLandscape,
  } = params;

  // Helper to test if photo is landscape
  const isLandscape = (p: UnsplashRawPhoto) =>
    p.width && p.height ? p.width >= p.height : true;

  // Flatten all verified pools for candidate search
  const allVerifiedPhotos: UnsplashRawPhoto[] = [];
  const seenIds = new Set<string>();
  for (const pool of allVerifiedPools) {
    for (const p of pool) {
      if (!seenIds.has(p.id)) {
        seenIds.add(p.id);
        allVerifiedPhotos.push(p);
      }
    }
  }

  // --- Priority 3a: Best match among UNUSED verified photos ---
  if (itemName) {
    let bestUnused: UnsplashRawPhoto | null = null;
    let bestScore = 0;

    for (const p of allVerifiedPhotos) {
      if (usedPhotoIds.has(p.id)) continue;
      const score = scorePhotoMatch(p, itemName);
      if (score > bestScore) {
        bestScore = score;
        bestUnused = p;
      }
    }

    if (bestUnused && bestScore > 0) {
      usedPhotoIds.add(bestUnused.id);
      usedCounts.set(bestUnused.id, (usedCounts.get(bestUnused.id) || 0) + 1);
      return {
        url: bestUnused.url,
        attribution: bestUnused.attribution,
        downloadLocation: bestUnused.attribution.downloadLocation,
        isPlaceholder: false,
      };
    }
  }

  // --- Priority 3b: Matching category pool among UNUSED verified photos ---
  let chosenCategoryUnused: UnsplashRawPhoto | null = null;
  if (preferLandscape) {
    chosenCategoryUnused =
      preferredCategoryPool.find((p) => !usedPhotoIds.has(p.id) && isLandscape(p)) ||
      preferredCategoryPool.find((p) => !usedPhotoIds.has(p.id)) ||
      null;
  } else {
    chosenCategoryUnused = preferredCategoryPool.find((p) => !usedPhotoIds.has(p.id)) || null;
  }

  if (chosenCategoryUnused) {
    usedPhotoIds.add(chosenCategoryUnused.id);
    usedCounts.set(chosenCategoryUnused.id, (usedCounts.get(chosenCategoryUnused.id) || 0) + 1);
    return {
      url: chosenCategoryUnused.url,
      attribution: chosenCategoryUnused.attribution,
      downloadLocation: chosenCategoryUnused.attribution.downloadLocation,
      isPlaceholder: false,
    };
  }

  // --- Priority 3c: Destination pool among UNUSED verified photos ---
  let chosenDestUnused: UnsplashRawPhoto | null = null;
  if (preferLandscape) {
    chosenDestUnused =
      destinationPool.find((p) => !usedPhotoIds.has(p.id) && isLandscape(p)) ||
      destinationPool.find((p) => !usedPhotoIds.has(p.id)) ||
      null;
  } else {
    chosenDestUnused = destinationPool.find((p) => !usedPhotoIds.has(p.id)) || null;
  }

  if (chosenDestUnused) {
    usedPhotoIds.add(chosenDestUnused.id);
    usedCounts.set(chosenDestUnused.id, (usedCounts.get(chosenDestUnused.id) || 0) + 1);
    return {
      url: chosenDestUnused.url,
      attribution: chosenDestUnused.attribution,
      downloadLocation: chosenDestUnused.attribution.downloadLocation,
      isPlaceholder: false,
    };
  }

  // --- Fallback among any remaining UNUSED verified photos ---
  const anyUnused = allVerifiedPhotos.find((p) => !usedPhotoIds.has(p.id));
  if (anyUnused) {
    usedPhotoIds.add(anyUnused.id);
    usedCounts.set(anyUnused.id, (usedCounts.get(anyUnused.id) || 0) + 1);
    return {
      url: anyUnused.url,
      attribution: anyUnused.attribution,
      downloadLocation: anyUnused.attribution.downloadLocation,
      isPlaceholder: false,
    };
  }

  // --- Priority 4: Reusing verified photos (Uniqueness preference: reuse rather than placeholder) ---
  if (allVerifiedPhotos.length > 0) {
    // Sort candidate pools by least reused
    const sortByReuse = (a: UnsplashRawPhoto, b: UnsplashRawPhoto) =>
      (usedCounts.get(a.id) || 0) - (usedCounts.get(b.id) || 0);

    let reusedPhoto: UnsplashRawPhoto | null = null;

    // 4a. Try best match reused
    if (itemName) {
      const matchReused = allVerifiedPhotos
        .filter((p) => scorePhotoMatch(p, itemName) > 0)
        .sort(sortByReuse);
      if (matchReused.length > 0) {
        reusedPhoto = matchReused[0];
      }
    }

    // 4b. Try category pool reused
    if (!reusedPhoto && preferredCategoryPool.length > 0) {
      const sortedCat = [...preferredCategoryPool].sort(sortByReuse);
      reusedPhoto = sortedCat[0];
    }

    // 4c. Try destination pool reused
    if (!reusedPhoto && destinationPool.length > 0) {
      const sortedDest = [...destinationPool].sort(sortByReuse);
      reusedPhoto = sortedDest[0];
    }

    // 4d. Any verified photo reused
    if (!reusedPhoto) {
      const sortedAll = [...allVerifiedPhotos].sort(sortByReuse);
      reusedPhoto = sortedAll[0];
    }

    if (reusedPhoto) {
      const count = (usedCounts.get(reusedPhoto.id) || 0) + 1;
      usedCounts.set(reusedPhoto.id, count);
      return {
        url: reusedPhoto.url,
        attribution: reusedPhoto.attribution,
        downloadLocation: reusedPhoto.attribution.downloadLocation,
        isPlaceholder: false,
      };
    }
  }

  // --- Priority 3d: Neutral placeholder (No verified photo exists, never use unverified) ---

  return {
    url: defaultImage,
    attribution: defaultAttribution,
    downloadLocation: undefined,
    isPlaceholder: true,
  };
}

/**
 * Enriches a Trip object with verified destination, stay, and activity photos.
 * 1. Specific queries: destination and country in every search.
 * 2. Relevance filter: strictly discards unverified photos.
 * 3. Priority assignment: Best match -> Category pool -> Destination pool -> Reuse verified -> Neutral placeholder.
 * 5. Download tracking only for photos actually assigned.
 * 6. Non-fatal fallback.
 */
export async function enrichTripImages(
  trip: Trip,
  destination: string,
  country: string
): Promise<{ trip: Trip; unsplashRequestsMade: number; placeholderCardsCount: number }> {
  let unsplashRequestsMade = 0;
  let placeholderCardsCount = 0;
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  // 1. Build destination & country base query
  const cleanDest = (destination || "").trim();
  const cleanCountry = (country || "").trim();

  // Ensure query includes both destination and country (e.g. "Goa India")
  const baseLocation =
    cleanCountry && !cleanDest.toLowerCase().includes(cleanCountry.toLowerCase())
      ? `${cleanDest} ${cleanCountry}`
      : cleanDest;

  // 2. Identify top distinct activity categories (up to 4)
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

  // 3. Prepare specific search queries
  const destQuery = baseLocation;
  const staysQuery = `${baseLocation} hotel`;
  const categoryQueries = topCategories.map((cat) => `${baseLocation} ${cat}`);

  const searchPlan: {
    type: "dest" | "stays" | "category";
    query: string;
    category?: string;
  }[] = [
    { type: "dest", query: destQuery },
    { type: "stays", query: staysQuery },
    ...categoryQueries.map((q, idx) => ({
      type: "category" as const,
      query: q,
      category: topCategories[idx],
    })),
  ];

  // 4. Execute searches in parallel (at most 6)
  const searchPromises = searchPlan.map(async (item) => {
    const result = await searchUnsplashPool(item.query, PHOTOS_PER_SEARCH);
    return { ...item, photos: result.photos, fromCache: result.fromCache };
  });

  const searchResults = await Promise.allSettled(searchPromises);

  // Count external requests (excluding cache hits)
  for (const res of searchResults) {
    if (res.status === "fulfilled" && !res.value.fromCache && accessKey) {
      unsplashRequestsMade++;
    }
  }

  // 5. Build relevance filter terms from destination, country, and itinerary
  const relevanceTerms = buildRelevanceTerms(destination, country, trip);

  // 6. Build verified pools: discard every result that doesn't pass relevance filter
  const seenGlobalPhotoIds = new Set<string>();

  let destinationPool: UnsplashRawPhoto[] = [];
  let staysPool: UnsplashRawPhoto[] = [];
  const categoryPools = new Map<string, UnsplashRawPhoto[]>();

  for (const res of searchResults) {
    if (res.status !== "fulfilled") continue;
    const { type, photos, category } = res.value;

    const verifiedList: UnsplashRawPhoto[] = [];
    for (const photo of photos) {
      if (seenGlobalPhotoIds.has(photo.id)) continue;

      const check = isVerifiedPhoto(photo, relevanceTerms);
      if (check.verified) {
        photo.passedFilter = true;
        photo.matchedFilterTerm = check.matchedTerm;
        seenGlobalPhotoIds.add(photo.id);
        verifiedList.push(photo);
      }
      // If !check.verified, DISCARD completely! Never enters any pool.
    }

    if (type === "dest") {
      destinationPool = verifiedList;
    } else if (type === "stays") {
      staysPool = verifiedList;
    } else if (type === "category" && category) {
      categoryPools.set(normalizeForRelevance(category), verifiedList);
    }
  }

  const allVerifiedPoolsList: UnsplashRawPhoto[][] = [
    destinationPool,
    staysPool,
    ...Array.from(categoryPools.values()),
  ];

  // 7. Track photo usage and download locations to fire
  const usedPhotoIds = new Set<string>();
  const usedCounts = new Map<string, number>();
  const assignedDownloadLocations = new Set<string>();

  // A. Cover image: must be a verified destination photo, prefer landscape
  const coverResult = pickVerifiedPhotoForCard({
    cardTitle: `Cover: ${destination}`,
    query: destQuery,
    itemName: destination,
    preferredCategoryPool: destinationPool,
    destinationPool,
    allVerifiedPools: allVerifiedPoolsList,
    usedPhotoIds,
    usedCounts,
    defaultImage: DEFAULT_COVER_IMAGE,
    defaultAttribution: NEUTRAL_COVER_ATTRIBUTION,
    preferLandscape: true,
  });

  trip.coverImageUrl = coverResult.url;
  trip.coverImageAttribution = coverResult.attribution;
  if (coverResult.downloadLocation) {
    assignedDownloadLocations.add(coverResult.downloadLocation);
  }
  if (coverResult.isPlaceholder) {
    placeholderCardsCount++;
  }

  // B. Stays (one different photo per day)
  trip.days.forEach((day) => {
    if (day.stay) {
      const stayResult = pickVerifiedPhotoForCard({
        cardTitle: `Day ${day.dayNumber} Stay: ${day.stay.name}`,
        query: staysQuery,
        itemName: day.stay.name,
        preferredCategoryPool: staysPool,
        destinationPool,
        allVerifiedPools: allVerifiedPoolsList,
        usedPhotoIds,
        usedCounts,
        defaultImage: DEFAULT_STAY_IMAGE,
        defaultAttribution: NEUTRAL_STAY_ATTRIBUTION,
      });

      day.stay.imageUrl = stayResult.url;
      day.stay.imageAttribution = stayResult.attribution;
      if (stayResult.downloadLocation) {
        assignedDownloadLocations.add(stayResult.downloadLocation);
      }
      if (stayResult.isPlaceholder) {
        placeholderCardsCount++;
      }
    }
  });

  // C. Activities
  trip.days.forEach((day) => {
    day.activities.forEach((activity) => {
      const normCat = normalizeForRelevance(activity.category || "");
      const primaryCatPool = categoryPools.get(normCat) || [];
      const actQuery = `${baseLocation} ${activity.category || "activity"}`;

      const actResult = pickVerifiedPhotoForCard({
        cardTitle: `Day ${day.dayNumber} Activity: ${activity.name}`,
        query: actQuery,
        itemName: activity.name,
        preferredCategoryPool: primaryCatPool,
        destinationPool,
        allVerifiedPools: allVerifiedPoolsList,
        usedPhotoIds,
        usedCounts,
        defaultImage: DEFAULT_ACTIVITY_IMAGE,
        defaultAttribution: NEUTRAL_ACTIVITY_ATTRIBUTION,
      });

      activity.imageUrl = actResult.url;
      activity.imageAttribution = actResult.attribution;
      if (actResult.downloadLocation) {
        assignedDownloadLocations.add(actResult.downloadLocation);
      }
      if (actResult.isPlaceholder) {
        placeholderCardsCount++;
      }
    });
  });

  // 8. Fire download tracking only for photos actually assigned to cards
  if (accessKey && assignedDownloadLocations.size > 0) {
    for (const loc of assignedDownloadLocations) {
      trackUnsplashDownload(loc, accessKey);
    }
  }

  return { trip, unsplashRequestsMade, placeholderCardsCount };
}
