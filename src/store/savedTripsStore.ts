import { create } from "zustand";
import { Trip } from "@/types/trip";
import { getCuratedTrips } from "@/lib/data/curated";
import {
  listTrips,
  updateTrip as updateTripInDb,
  deleteTrip as deleteTripInDb,
  duplicateTrip as duplicateTripInDb,
  createTrip as createTripInDb,
  USE_MOCK_DATA,
} from "@/lib/data/trips";
import { setShared } from "@/lib/data/sharing";

export type FilterCategory = "all" | "upcoming" | "past" | "shared";
export type SortOption = "recent" | "date" | "budget" | "title";
export type ViewMode = "grid" | "list";

export interface SavedTripsState {
  trips: Trip[];
  isLoading: boolean;
  searchQuery: string;
  filter: FilterCategory;
  sortBy: SortOption;
  viewMode: ViewMode;
  editingTripId: string | null;

  // Actions
  fetchTrips: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: FilterCategory) => void;
  setSortBy: (sort: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setEditingTripId: (id: string | null) => void;
  renameTrip: (id: string, newTitle: string) => Promise<void>;
  duplicateTrip: (id: string) => Promise<Trip | null>;
  deleteTrip: (id: string) => Promise<void>;
  toggleShare: (id: string, isShared?: boolean, revoke?: boolean) => Promise<void>;
  addTrip: (trip: Trip) => Promise<Trip>;
  clearAllTrips: () => void;
  resetTrips: () => void;
}

// Dynamically seed dates relative to current time so Upcoming & Past compute accurately anywhere
function createInitialTrips(): Trip[] {
  const now = new Date();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const initialTripsData = getCuratedTrips();

  return initialTripsData.map((trip, idx) => {
    let startDate: string;
    let endDate: string;
    let isShared = trip.isShared ?? false;

    if (idx === 0) {
      // Goa / Kyoto (Upcoming)
      startDate = formatDate(new Date(now.getTime() + 15 * DAY_MS));
      endDate = formatDate(new Date(now.getTime() + 20 * DAY_MS));
      isShared = true;
    } else if (idx === 1) {
      // Upcoming
      startDate = formatDate(new Date(now.getTime() + 30 * DAY_MS));
      endDate = formatDate(new Date(now.getTime() + 36 * DAY_MS));
      isShared = false;
    } else if (idx === 2) {
      // Upcoming
      startDate = formatDate(new Date(now.getTime() + 60 * DAY_MS));
      endDate = formatDate(new Date(now.getTime() + 67 * DAY_MS));
      isShared = true;
    } else if (idx === 3) {
      // Past & Shared
      startDate = formatDate(new Date(now.getTime() - 45 * DAY_MS));
      endDate = formatDate(new Date(now.getTime() - 38 * DAY_MS));
      isShared = true;
    } else if (idx === 4) {
      // Past
      startDate = formatDate(new Date(now.getTime() - 120 * DAY_MS));
      endDate = formatDate(new Date(now.getTime() - 114 * DAY_MS));
      isShared = false;
    } else {
      // Past
      startDate = formatDate(new Date(now.getTime() - 180 * DAY_MS));
      endDate = formatDate(new Date(now.getTime() - 174 * DAY_MS));
      isShared = false;
    }

    return {
      ...trip,
      startDate,
      endDate,
      isShared,
    };
  });
}

/**
 * Computes whether a trip is 'upcoming' or 'past' based on start_date.
 */
export function computeTripStatus(trip: Trip): "upcoming" | "past" {
  if (!trip.startDate) {
    return "upcoming";
  }
  const today = new Date().toISOString().split("T")[0];
  const tripStartDate = trip.startDate.split("T")[0];
  return tripStartDate < today ? "past" : "upcoming";
}

export const useSavedTripsStore = create<SavedTripsState>((set, get) => ({
  trips: USE_MOCK_DATA ? createInitialTrips() : [],
  isLoading: !USE_MOCK_DATA,
  searchQuery: "",
  filter: "all",
  sortBy: "recent",
  viewMode: "grid",
  editingTripId: null,

  fetchTrips: async () => {
    if (USE_MOCK_DATA) {
      const current = get().trips;
      if (current.length === 0) {
        set({ trips: createInitialTrips(), isLoading: false });
      } else {
        set({ isLoading: false });
      }
      return;
    }

    set({ isLoading: true });
    try {
      const liveTrips = await listTrips();
      set({ trips: liveTrips, isLoading: false });
    } catch (err) {
      console.error("[useSavedTripsStore.fetchTrips] Error:", err);
      set({ isLoading: false });
    }
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilter: (filter) => set({ filter }),
  setSortBy: (sortBy) => set({ sortBy }),
  setViewMode: (viewMode) => set({ viewMode }),
  setEditingTripId: (editingTripId) => set({ editingTripId }),

  renameTrip: async (id, newTitle) => {
    // Optimistic UI update
    set((state) => ({
      trips: state.trips.map((t) =>
        t.id === id ? { ...t, destination: newTitle } : t
      ),
      editingTripId: null,
    }));

    try {
      await updateTripInDb(id, { destination: newTitle });
    } catch (err) {
      console.error("[useSavedTripsStore.renameTrip] Error:", err);
    }
  },

  duplicateTrip: async (id) => {
    if (USE_MOCK_DATA) {
      const tripToDuplicate = get().trips.find((t) => t.id === id);
      if (!tripToDuplicate) return null;

      const duplicated: Trip = {
        ...tripToDuplicate,
        id: `trip-copy-${Date.now()}`,
        destination: `${tripToDuplicate.destination} (Copy)`,
        shareId: undefined,
        isShared: false,
      };

      set((state) => ({
        trips: [duplicated, ...state.trips],
      }));

      return duplicated;
    }

    try {
      const duplicated = await duplicateTripInDb(id);
      if (duplicated) {
        set((state) => ({
          trips: [
            duplicated,
            ...state.trips.filter((t) => t.id !== duplicated.id),
          ],
        }));
      }
      return duplicated;
    } catch (err) {
      console.error("[useSavedTripsStore.duplicateTrip] Error:", err);
      return null;
    }
  },

  deleteTrip: async (id) => {
    // Optimistic UI update
    set((state) => ({
      trips: state.trips.filter((t) => t.id !== id),
      editingTripId: state.editingTripId === id ? null : state.editingTripId,
    }));

    try {
      await deleteTripInDb(id);
    } catch (err) {
      console.error("[useSavedTripsStore.deleteTrip] Error:", err);
    }
  },

  toggleShare: async (id, isShared, revoke) => {
    if (USE_MOCK_DATA) {
      set((state) => ({
        trips: state.trips.map((t) => {
          if (t.id !== id) return t;
          const newSharedState =
            isShared !== undefined ? isShared : !t.isShared;
          return {
            ...t,
            isShared: newSharedState,
            shareId: newSharedState ? t.shareId || `share-${t.id}` : undefined,
          };
        }),
      }));
      return;
    }

    try {
      const res = await setShared(id, isShared, revoke);
      if (res) {
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === id
              ? { ...t, isShared: res.isShared, shareId: res.shareId }
              : t
          ),
        }));
      }
    } catch (err) {
      console.error("[useSavedTripsStore.toggleShare] Error:", err);
    }
  },

  addTrip: async (trip) => {
    if (USE_MOCK_DATA) {
      const newTrip: Trip = {
        ...trip,
        id: `saved-trip-${Date.now()}`,
        destination: trip.destination.includes("(Copy)")
          ? trip.destination
          : `${trip.destination} (Saved)`,
        shareId: undefined,
        isShared: false,
      };
      set((state) => ({
        trips: [newTrip, ...state.trips],
      }));
      return newTrip;
    }

    try {
      const saved = await createTripInDb(trip);
      set((state) => ({
        trips: [saved, ...state.trips.filter((t) => t.id !== saved.id)],
      }));
      return saved;
    } catch (err) {
      console.error("[useSavedTripsStore.addTrip] Error:", err);
      throw err;
    }
  },

  clearAllTrips: () => set({ trips: [] }),
  resetTrips: () =>
    set({
      trips: createInitialTrips(),
      searchQuery: "",
      filter: "all",
      sortBy: "recent",
      editingTripId: null,
    }),
}));
