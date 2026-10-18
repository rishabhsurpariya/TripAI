import { createClient } from "@/lib/supabase/server";
import {
  getTrip as getTripBase,
  listTrips as listTripsBase,
  createTrip as createTripBase,
  updateTrip as updateTripBase,
  deleteTrip as deleteTripBase,
  duplicateTrip as duplicateTripBase,
} from "./trips";
import type { Trip } from "@/types/trip";

/**
 * Server-side getTrip resolver using Next.js request cookies.
 */
export async function getTripServer(id: string): Promise<Trip | null> {
  const supabase = await createClient();
  return getTripBase(id, supabase);
}

/**
 * Server-side listTrips resolver using Next.js request cookies.
 */
export async function listTripsServer(): Promise<Trip[]> {
  const supabase = await createClient();
  return listTripsBase(supabase);
}

/**
 * Server-side createTrip resolver using Next.js request cookies.
 */
export async function createTripServer(trip: Trip): Promise<Trip> {
  const supabase = await createClient();
  return createTripBase(trip, supabase);
}

/**
 * Server-side updateTrip resolver using Next.js request cookies.
 */
export async function updateTripServer(
  id: string,
  updates: Partial<Trip>
): Promise<Trip | null> {
  const supabase = await createClient();
  return updateTripBase(id, updates, supabase);
}

/**
 * Server-side deleteTrip resolver using Next.js request cookies.
 */
export async function deleteTripServer(id: string): Promise<boolean> {
  const supabase = await createClient();
  return deleteTripBase(id, supabase);
}

/**
 * Server-side duplicateTrip resolver using Next.js request cookies.
 */
export async function duplicateTripServer(id: string): Promise<Trip | null> {
  const supabase = await createClient();
  return duplicateTripBase(id, supabase);
}
