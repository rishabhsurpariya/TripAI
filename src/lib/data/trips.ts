import { Trip } from "@/types/trip";
import sampleItinerary from "@/data/sample-itinerary.json";
import { getCuratedTrips } from "./curated";
import { useSavedTripsStore } from "@/store/savedTripsStore";
import { GOA_SHARED_TRIP } from "./sharing";
import { USE_MOCK_DATA } from "./config";

export { USE_MOCK_DATA };

/**
 * Returns the canonical sample trip from mock data.
 */
export function getSampleTrip(): Trip {
  return sampleItinerary as unknown as Trip;
}

/**
 * Synchronous trip resolver for mock mode.
 */
export function getTripSync(id: string): Trip | null {
  if (!USE_MOCK_DATA) return null;

  // 1. If id matches sample-itinerary, use it directly
  if (id === sampleItinerary.id || id === "sample") {
    return sampleItinerary as unknown as Trip;
  }

  // 2. Check savedTripsStore
  if (typeof window !== "undefined") {
    try {
      const saved = useSavedTripsStore.getState().trips.find((t) => t.id === id);
      if (saved) return saved;
    } catch {
      // ignore
    }
  }

  // 3. Check Goa shared trip
  if (id === GOA_SHARED_TRIP.id || id === GOA_SHARED_TRIP.shareId) {
    return GOA_SHARED_TRIP;
  }

  // 4. Check curated trips
  const curated = getCuratedTrips();
  const matchedTrip = curated.find((t) => t.id === id);
  if (matchedTrip) {
    if (matchedTrip.days && matchedTrip.days.length > 0) {
      return matchedTrip;
    }
    return {
      ...sampleItinerary,
      id: matchedTrip.id,
      destination: matchedTrip.destination,
      country: matchedTrip.country,
      coverImageUrl: matchedTrip.coverImageUrl || sampleItinerary.coverImageUrl,
      style: matchedTrip.style || sampleItinerary.style,
      startCity: matchedTrip.startCity || sampleItinerary.startCity,
      totalBudget: matchedTrip.totalBudget || sampleItinerary.totalBudget,
    } as unknown as Trip;
  }

  // 5. Default to sample itinerary
  return sampleItinerary as unknown as Trip;
}

/**
 * List trips for current user.
 */
export async function listTrips(): Promise<Trip[]> {
  if (USE_MOCK_DATA) {
    return useSavedTripsStore.getState().trips;
  }
  return [];
}

/**
 * Synchronous getter for saved trips in mock store.
 */
export function getSavedTrips(): Trip[] {
  if (USE_MOCK_DATA) {
    return useSavedTripsStore.getState().trips;
  }
  return [];
}

/**
 * Get a single trip by ID.
 */
export async function getTrip(id: string): Promise<Trip | null> {
  return getTripSync(id);
}

/**
 * Create a new trip.
 */
export async function createTrip(trip: Trip): Promise<Trip> {
  if (USE_MOCK_DATA) {
    return useSavedTripsStore.getState().addTrip(trip);
  }
  throw new Error("Real database service not connected yet.");
}

/**
 * Update an existing trip.
 */
export async function updateTrip(
  id: string,
  updates: Partial<Trip>
): Promise<Trip | null> {
  if (USE_MOCK_DATA) {
    let updated: Trip | null = null;
    useSavedTripsStore.setState((state) => {
      const nextTrips = state.trips.map((t) => {
        if (t.id === id) {
          updated = { ...t, ...updates };
          return updated;
        }
        return t;
      });
      return { trips: nextTrips };
    });
    return updated;
  }
  throw new Error("Real database service not connected yet.");
}

/**
 * Delete a trip by ID.
 */
export async function deleteTrip(id: string): Promise<boolean> {
  if (USE_MOCK_DATA) {
    useSavedTripsStore.getState().deleteTrip(id);
    return true;
  }
  throw new Error("Real database service not connected yet.");
}

/**
 * Duplicate a trip by ID.
 */
export async function duplicateTrip(id: string): Promise<Trip | null> {
  if (USE_MOCK_DATA) {
    return useSavedTripsStore.getState().duplicateTrip(id);
  }
  throw new Error("Real database service not connected yet.");
}
