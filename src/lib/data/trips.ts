import { Trip } from "@/types/trip";
import sampleItinerary from "@/data/sample-itinerary.json";
import { getCuratedTrips } from "./curated";
import { useSavedTripsStore } from "@/store/savedTripsStore";
import { GOA_SHARED_TRIP } from "./sharing";
import { USE_MOCK_DATA } from "./config";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export { USE_MOCK_DATA };

/**
 * Validates whether a string is a standard UUID.
 */
export function isUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    str
  );
}

/**
 * Returns the canonical sample trip from mock data.
 */
export function getSampleTrip(): Trip {
  return sampleItinerary as unknown as Trip;
}

/**
 * Returns the browser-side Supabase client or a custom provided client.
 */
function getClient(client?: SupabaseClient): SupabaseClient {
  return client || createBrowserClient();
}

/**
 * Maps a Postgres row from `trips` table to the frontend `Trip` interface.
 */
export interface TripDatabaseRow {
  id: string;
  destination?: string | null;
  country?: string | null;
  cover_image_url?: string | null;
  start_date?: string | null;
  num_days?: number | null;
  travelers?: number | null;
  style?: string | null;
  currency?: string | null;
  total_budget?: number | string | null;
  share_id?: string | null;
  is_shared?: boolean | null;
  plan?: Partial<Trip> | null;
  [key: string]: unknown;
}

export function mapRowToTrip(row: TripDatabaseRow): Trip {
  const plan: Partial<Trip> =
    typeof row.plan === "object" && row.plan !== null ? row.plan : {};

  return {
    ...plan,
    id: row.id,
    destination: row.destination ?? plan.destination ?? "",
    country: row.country ?? plan.country ?? "",
    coverImageUrl: row.cover_image_url ?? plan.coverImageUrl ?? "",
    startDate: row.start_date ?? plan.startDate,
    travelers: row.travelers ?? plan.travelers ?? 1,
    style: (row.style ?? plan.style ?? "comfort") as Trip["style"],
    currency: row.currency ?? plan.currency ?? "INR",
    totalBudget:
      row.total_budget !== null && row.total_budget !== undefined
        ? Number(row.total_budget)
        : plan.totalBudget ?? 0,
    shareId: (row.share_id ?? plan.shareId) || undefined,
    isShared: row.is_shared ?? plan.isShared ?? false,
    days: plan.days || [],
    gettingThere: plan.gettingThere || [],
    budget: plan.budget || {
      transport: 0,
      stay: 0,
      food: 0,
      activities: 0,
      misc: 0,
    },
    interests: plan.interests || [],
    seasons: plan.seasons || [],
  };
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
      const saved = useSavedTripsStore
        .getState()
        .trips.find((t) => t.id === id);
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
 * List all trips for current authenticated user.
 */
export async function listTrips(client?: SupabaseClient): Promise<Trip[]> {
  if (USE_MOCK_DATA) {
    return useSavedTripsStore.getState().trips;
  }

  try {
    const supabase = getClient(client);
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[listTrips] Error querying Supabase:", error.message);
      return [];
    }

    return (data || []).map(mapRowToTrip);
  } catch (err) {
    console.error("[listTrips] Unexpected error:", err);
    return [];
  }
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
 * Under RLS, returns null if the trip doesn't exist or belongs to another user.
 */
export async function getTrip(
  id: string,
  client?: SupabaseClient
): Promise<Trip | null> {
  if (USE_MOCK_DATA) {
    return getTripSync(id);
  }

  // Non-UUID IDs do not match database rows and would cause a Postgres syntax error
  if (!isUuid(id)) {
    return null;
  }

  try {
    const supabase = getClient(client);
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapRowToTrip(data);
  } catch (err) {
    console.error("[getTrip] Unexpected error:", err);
    return null;
  }
}

/**
 * Create a new trip in the database for the signed-in user.
 */
export async function createTrip(
  trip: Trip,
  client?: SupabaseClient
): Promise<Trip> {
  if (USE_MOCK_DATA) {
    return useSavedTripsStore.getState().addTrip(trip);
  }

  const supabase = getClient(client);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthenticated: Must be logged in to create trips");
  }

  const planCopy = { ...trip };
  const payload: Record<string, unknown> = {
    user_id: user.id,
    destination: trip.destination,
    country: trip.country || "",
    cover_image_url: trip.coverImageUrl || "",
    start_date: trip.startDate || null,
    num_days: trip.days?.length || 0,
    travelers: trip.travelers || 1,
    style: trip.style || "comfort",
    currency: trip.currency || "INR",
    total_budget: trip.totalBudget || 0,
    plan: planCopy,
    is_shared: trip.isShared ?? false,
    share_id: trip.shareId || null,
  };

  if (trip.id && isUuid(trip.id)) {
    payload.id = trip.id;
  }

  const { data, error } = await supabase
    .from("trips")
    .insert(payload)
    .select()
    .single();

  if (error || !data) {
    console.error("[createTrip] Error inserting trip:", error?.message);
    throw error || new Error("Failed to save trip to database");
  }

  return mapRowToTrip(data);
}

/**
 * Update an existing trip owned by current user.
 */
export async function updateTrip(
  id: string,
  updates: Partial<Trip>,
  client?: SupabaseClient
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

  if (!isUuid(id)) {
    return null;
  }

  try {
    const supabase = getClient(client);

    // Fetch existing trip to safely merge into plan
    const { data: existing, error: fetchErr } = await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr || !existing) {
      console.error(
        "[updateTrip] Trip not found or unauthorized:",
        fetchErr?.message
      );
      return null;
    }

    const existingPlan =
      typeof existing.plan === "object" && existing.plan !== null
        ? existing.plan
        : {};

    const mergedPlan: Trip = {
      ...existingPlan,
      ...updates,
      id: existing.id,
    };

    const updatePayload: Record<string, unknown> = {
      plan: mergedPlan,
      updated_at: new Date().toISOString(),
    };

    if (updates.destination !== undefined)
      updatePayload.destination = updates.destination;
    if (updates.country !== undefined)
      updatePayload.country = updates.country;
    if (updates.coverImageUrl !== undefined)
      updatePayload.cover_image_url = updates.coverImageUrl;
    if (updates.startDate !== undefined)
      updatePayload.start_date = updates.startDate || null;
    if (updates.days !== undefined)
      updatePayload.num_days = updates.days.length;
    if (updates.travelers !== undefined)
      updatePayload.travelers = updates.travelers;
    if (updates.style !== undefined)
      updatePayload.style = updates.style;
    if (updates.totalBudget !== undefined)
      updatePayload.total_budget = updates.totalBudget;
    if (updates.currency !== undefined)
      updatePayload.currency = updates.currency;
    if (updates.shareId !== undefined)
      updatePayload.share_id = updates.shareId;
    if (updates.isShared !== undefined)
      updatePayload.is_shared = updates.isShared;

    const { data: updatedRow, error: updateErr } = await supabase
      .from("trips")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updateErr || !updatedRow) {
      console.error("[updateTrip] Failed to update row:", updateErr?.message);
      return null;
    }

    return mapRowToTrip(updatedRow);
  } catch (err) {
    console.error("[updateTrip] Unexpected error:", err);
    return null;
  }
}

/**
 * Delete a trip by ID (restricted to row owner via RLS).
 */
export async function deleteTrip(
  id: string,
  client?: SupabaseClient
): Promise<boolean> {
  if (USE_MOCK_DATA) {
    useSavedTripsStore.getState().deleteTrip(id);
    return true;
  }

  if (!isUuid(id)) {
    return false;
  }

  try {
    const supabase = getClient(client);
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) {
      console.error("[deleteTrip] Failed to delete trip:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[deleteTrip] Unexpected error:", err);
    return false;
  }
}

/**
 * Duplicate a trip by ID for the current user.
 */
export async function duplicateTrip(
  id: string,
  client?: SupabaseClient
): Promise<Trip | null> {
  if (USE_MOCK_DATA) {
    return useSavedTripsStore.getState().duplicateTrip(id);
  }

  if (!isUuid(id)) {
    return null;
  }

  try {
    const supabase = getClient(client);
    const original = await getTrip(id, supabase);
    if (!original) {
      return null;
    }

    const copyData: Trip = {
      ...original,
      id: "", // cleared — Postgres generates a fresh UUID via gen_random_uuid()
      destination: `${original.destination} (Copy)`,
      isShared: false,
      shareId: undefined,
    };

    return await createTrip(copyData, supabase);
  } catch (err) {
    console.error("[duplicateTrip] Unexpected error:", err);
    return null;
  }
}
