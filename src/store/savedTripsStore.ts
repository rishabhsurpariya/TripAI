import { create } from "zustand";
import { Trip } from "@/types/trip";
import initialTripsData from "@/data/trips.json";

export type FilterCategory = "all" | "upcoming" | "past" | "shared";
export type SortOption = "recent" | "date" | "budget" | "title";
export type ViewMode = "grid" | "list";

export interface SavedTripsState {
  trips: Trip[];
  searchQuery: string;
  filter: FilterCategory;
  sortBy: SortOption;
  viewMode: ViewMode;
  editingTripId: string | null;

  // Actions
  setSearchQuery: (query: string) => void;
  setFilter: (filter: FilterCategory) => void;
  setSortBy: (sort: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setEditingTripId: (id: string | null) => void;
  renameTrip: (id: string, newTitle: string) => void;
  duplicateTrip: (id: string) => Trip | null;
  deleteTrip: (id: string) => void;
  toggleShare: (id: string, isShared?: boolean) => void;
  clearAllTrips: () => void;
  resetTrips: () => void;
}

// Dynamically seed dates relative to current time so Upcoming & Past compute accurately anywhere
function createInitialTrips(): Trip[] {
  const now = new Date();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  return (initialTripsData as Trip[]).map((trip, idx) => {
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

export function computeTripStatus(trip: Trip): "upcoming" | "past" {
  const now = new Date();
  if (trip.endDate) {
    return new Date(trip.endDate) < now ? "past" : "upcoming";
  }
  if (trip.startDate) {
    return new Date(trip.startDate) < now ? "past" : "upcoming";
  }
  return "upcoming";
}

export const useSavedTripsStore = create<SavedTripsState>((set, get) => ({
  trips: createInitialTrips(),
  searchQuery: "",
  filter: "all",
  sortBy: "recent",
  viewMode: "grid",
  editingTripId: null,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilter: (filter) => set({ filter }),
  setSortBy: (sortBy) => set({ sortBy }),
  setViewMode: (viewMode) => set({ viewMode }),
  setEditingTripId: (editingTripId) => set({ editingTripId }),

  renameTrip: (id, newTitle) => {
    set((state) => ({
      trips: state.trips.map((t) =>
        t.id === id ? { ...t, destination: newTitle } : t
      ),
      editingTripId: null,
    }));
  },

  duplicateTrip: (id) => {
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
  },

  deleteTrip: (id) => {
    set((state) => ({
      trips: state.trips.filter((t) => t.id !== id),
      editingTripId: state.editingTripId === id ? null : state.editingTripId,
    }));
  },

  toggleShare: (id, isShared) => {
    set((state) => ({
      trips: state.trips.map((t) => {
        if (t.id !== id) return t;
        const newSharedState = isShared !== undefined ? isShared : !t.isShared;
        return {
          ...t,
          isShared: newSharedState,
          shareId: newSharedState ? t.shareId || `share-${t.id}` : undefined,
        };
      }),
    }));
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
