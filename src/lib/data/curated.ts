import tripsData from "@/data/trips.json";
import { Trip } from "@/types/trip";
import { USE_MOCK_DATA } from "./config";

export { USE_MOCK_DATA };

/**
 * Returns the curated trip catalog.
 * In mock mode, returns data from trips.json (static JSON).
 */
export function getCuratedTrips(): Trip[] {
  if (USE_MOCK_DATA) {
    return tripsData as Trip[];
  }
  return [];
}

/**
 * Async version of getCuratedTrips for future database/API compatibility.
 */
export async function getCuratedTripsAsync(): Promise<Trip[]> {
  return getCuratedTrips();
}
