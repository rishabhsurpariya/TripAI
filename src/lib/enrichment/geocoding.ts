import { Trip } from "@/types/trip";

export interface LatLng {
  lat: number;
  lng: number;
}

// In-memory cache for Nominatim geocoding results
const memoryGeocodingCache = new Map<string, LatLng | null>();

// Maximum external requests to Nominatim per single trip generation
export const MAX_NOMINATIM_LOOKUPS_PER_TRIP = 5;

// Max allowable distance (km) between an activity and the destination center
export const MAX_DISTANCE_KM_FROM_DESTINATION = 100;

// Rate-limiting throttle state: strictly at least 1100ms between calls
let lastNominatimTimestamp = 0;

/**
 * Calculates great-circle distance between two coordinates in kilometers using Haversine formula.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Normalizes geocoding search queries for cache lookups.
 */
export function normalizeGeoQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Optional persistent cache lookup from Supabase geocoding_cache table.
 */
async function getDbCachedCoords(normQuery: string): Promise<LatLng | null> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("geocoding_cache")
      .select("lat, lng")
      .eq("query", normQuery)
      .maybeSingle();

    if (data && data.lat !== null && data.lng !== null) {
      const coords: LatLng = { lat: Number(data.lat), lng: Number(data.lng) };
      memoryGeocodingCache.set(normQuery, coords);
      return coords;
    }
  } catch {
    // Catch silently
  }
  return null;
}

/**
 * Optional persistent cache write to Supabase geocoding_cache table.
 */
async function saveDbCachedCoords(
  normQuery: string,
  coords: LatLng
): Promise<void> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    await supabase.from("geocoding_cache").upsert({
      query: normQuery,
      lat: coords.lat,
      lng: coords.lng,
    });
  } catch {
    // Catch silently
  }
}

/**
 * Guarantees at least 1100ms interval between requests to satisfy Nominatim usage policy.
 */
async function throttleNominatimRequest(): Promise<void> {
  const now = Date.now();
  const timeSinceLast = now - lastNominatimTimestamp;
  if (timeSinceLast < 1100) {
    const waitTime = 1100 - timeSinceLast;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }
  lastNominatimTimestamp = Date.now();
}

/**
 * Queries Nominatim for a place query. Returns LatLng or null. Never throws.
 */
export async function queryNominatim(
  query: string,
  timeoutMs = 4000
): Promise<LatLng | null> {
  const norm = normalizeGeoQuery(query);

  // 1. Check in-memory cache
  if (memoryGeocodingCache.has(norm)) {
    return memoryGeocodingCache.get(norm) || null;
  }

  // 2. Check persistent DB cache
  const cachedDb = await getDbCachedCoords(norm);
  if (cachedDb) {
    return cachedDb;
  }

  try {
    await throttleNominatimRequest();

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=1`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "TripAi-TravelPlanner/1.0 (https://github.com/rishabhsurpariya/TripAI; contact: travel@tripai.app)",
        "Accept-Language": "en",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      if (res.status === 429) {
        console.warn(
          "[Nominatim] Rate limit encountered (HTTP 429). Using AI coordinates/destination center."
        );
      } else {
        console.warn(
          `[Nominatim] Lookup returned HTTP ${res.status} for "${query}".`
        );
      }
      memoryGeocodingCache.set(norm, null);
      return null;
    }

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
      const coords: LatLng = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
      memoryGeocodingCache.set(norm, coords);
      saveDbCachedCoords(norm, coords).catch(() => {});
      return coords;
    }

    memoryGeocodingCache.set(norm, null);
    return null;
  } catch (err: unknown) {
    console.warn(
      `[Nominatim] Lookup failed for "${query}":`,
      (err as Error)?.message || err
    );
    memoryGeocodingCache.set(norm, null);
    return null;
  }
}

/**
 * Enriches and validates coordinates for all activities in a trip.
 * 1. Resolves destination center coordinates
 * 2. Validates AI coordinates vs Nominatim (capped to MAX_NOMINATIM_LOOKUPS_PER_TRIP)
 * 3. Enforces 100km distance threshold
 * 4. Ensures map tab pins and route lines receive valid, localized coordinates
 */
export async function enrichTripCoordinates(
  trip: Trip,
  destination: string,
  country: string
): Promise<{ trip: Trip; nominatimLookupsMade: number }> {
  let nominatimLookupsMade = 0;

  // 1. Resolve Destination Center
  const destQuery = `${destination}, ${country}`.trim();
  const normDestQuery = normalizeGeoQuery(destQuery);
  let destCenter: LatLng | null =
    memoryGeocodingCache.get(normDestQuery) ||
    (await getDbCachedCoords(normDestQuery)) ||
    null;

  if (!destCenter && nominatimLookupsMade < MAX_NOMINATIM_LOOKUPS_PER_TRIP) {
    nominatimLookupsMade++;
    destCenter = await queryNominatim(destQuery);
  }

  // If destination center is still null, compute centroid of AI's activity coordinates
  if (!destCenter) {
    const aiPoints: LatLng[] = [];
    trip.days.forEach((day) => {
      day.activities.forEach((act) => {
        if (
          typeof act.lat === "number" &&
          typeof act.lng === "number" &&
          (act.lat !== 0 || act.lng !== 0)
        ) {
          aiPoints.push({ lat: act.lat, lng: act.lng });
        }
      });
    });

    if (aiPoints.length > 0) {
      const avgLat =
        aiPoints.reduce((sum, p) => sum + p.lat, 0) / aiPoints.length;
      const avgLng =
        aiPoints.reduce((sum, p) => sum + p.lng, 0) / aiPoints.length;
      destCenter = { lat: avgLat, lng: avgLng };
    } else {
      // Ultimate fallback: standard coordinates (Kyoto default / generic)
      destCenter = { lat: 35.0116, lng: 135.7681 };
    }
  }

  // 2. Validate and adjust each activity
  for (const day of trip.days) {
    for (const activity of day.activities) {
      let finalCoords: LatLng | null = null;

      // Check if Nominatim lookups remain under the trip cap
      const actQuery = `${activity.name}, ${destination}`;
      const norm = normalizeGeoQuery(actQuery);
      const cachedCoords =
        memoryGeocodingCache.get(norm) || (await getDbCachedCoords(norm));

      if (cachedCoords) {
        // Cached coordinates available without an external API request
        const dist = calculateHaversineDistanceKm(
          destCenter.lat,
          destCenter.lng,
          cachedCoords.lat,
          cachedCoords.lng
        );
        if (dist <= MAX_DISTANCE_KM_FROM_DESTINATION) {
          finalCoords = cachedCoords;
        }
      } else if (nominatimLookupsMade < MAX_NOMINATIM_LOOKUPS_PER_TRIP) {
        nominatimLookupsMade++;
        const geocoded = await queryNominatim(actQuery);

        if (geocoded) {
          const dist = calculateHaversineDistanceKm(
            destCenter.lat,
            destCenter.lng,
            geocoded.lat,
            geocoded.lng
          );

          if (dist <= MAX_DISTANCE_KM_FROM_DESTINATION) {
            finalCoords = geocoded;
          } else {
            console.log(
              `[Nominatim] Geocoded spot "${activity.name}" was ${dist.toFixed(
                1
              )}km from destination center. Discarding.`
            );
          }
        }
      }

      // If geocoded is not usable or lookup was capped/failed, check AI's coordinates
      if (!finalCoords) {
        const aiLat = activity.lat;
        const aiLng = activity.lng;
        const hasAiCoords =
          typeof aiLat === "number" &&
          typeof aiLng === "number" &&
          (aiLat !== 0 || aiLng !== 0);

        if (hasAiCoords) {
          const aiDist = calculateHaversineDistanceKm(
            destCenter.lat,
            destCenter.lng,
            aiLat,
            aiLng
          );
          if (aiDist <= MAX_DISTANCE_KM_FROM_DESTINATION) {
            // Keep AI coordinates as they are near the destination
            finalCoords = { lat: aiLat, lng: aiLng };
          }
        }
      }

      // If still no valid coords, use destination center with micro-jitter
      if (!finalCoords) {
        const jitterLat = (Math.random() - 0.5) * 0.015;
        const jitterLng = (Math.random() - 0.5) * 0.015;
        finalCoords = {
          lat: destCenter.lat + jitterLat,
          lng: destCenter.lng + jitterLng,
        };
      }

      // Write final coordinates formatted to 5 decimal places (~1m precision)
      activity.lat = Number(finalCoords.lat.toFixed(5));
      activity.lng = Number(finalCoords.lng.toFixed(5));
    }
  }

  return { trip, nominatimLookupsMade };
}
