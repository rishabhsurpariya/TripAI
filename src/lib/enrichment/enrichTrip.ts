import { Trip } from "@/types/trip";
import { enrichTripImages } from "./unsplash";
import { enrichTripCoordinates } from "./geocoding";

export interface EnrichmentMetrics {
  unsplashRequests: number;
  nominatimLookups: number;
}

/**
 * Enrichment stage executed deterministically after AI generation and budget balancing.
 * 1. Fetches real Unsplash photos for destination cover, stays, and activities.
 * 2. Validates and geocodes activity coordinates via Nominatim with 100km perimeter enforcement.
 * 3. Never adds AI model calls, never throws to avoid failing generation.
 */
export async function enrichTrip(
  trip: Trip,
  destination: string,
  country: string
): Promise<{ trip: Trip; enrichmentMetrics: EnrichmentMetrics }> {
  console.log(
    `[Enrichment] Starting post-generation enrichment for destination "${destination}", ${country}...`
  );

  let unsplashRequests = 0;
  let nominatimLookups = 0;

  try {
    // 1. Image enrichment (Unsplash API, capped, cached, parallel)
    const imageResult = await enrichTripImages(trip, destination, country);
    trip = imageResult.trip;
    unsplashRequests = imageResult.unsplashRequestsMade;
  } catch (imgErr: unknown) {
    console.warn(
      "[Enrichment] Unsplash enrichment encountered error:",
      (imgErr as Error)?.message || imgErr
    );
  }

  try {
    // 2. Coordinate validation (Nominatim geocoder, throttled, capped, cached)
    const geoResult = await enrichTripCoordinates(trip, destination, country);
    trip = geoResult.trip;
    nominatimLookups = geoResult.nominatimLookupsMade;
  } catch (geoErr: unknown) {
    console.warn(
      "[Enrichment] Geocoding validation encountered error:",
      (geoErr as Error)?.message || geoErr
    );
  }

  console.log(
    `[Enrichment] Completed enrichment: ${unsplashRequests} Unsplash requests, ${nominatimLookups} Nominatim lookups.`
  );

  return {
    trip,
    enrichmentMetrics: {
      unsplashRequests,
      nominatimLookups,
    },
  };
}

