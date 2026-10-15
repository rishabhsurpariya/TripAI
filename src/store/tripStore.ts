import { create } from "zustand";
import { Trip, Activity, Day } from "@/types/trip";
import sampleItinerary from "@/data/sample-itinerary.json";

interface TripStoreState {
  currentTrip: Trip | null;
  isEditMode: boolean;
  history: Trip[];
  future: Trip[];
  setTrip: (trip: Trip) => void;
  setEditMode: (enabled: boolean) => void;
  undo: () => void;
  redo: () => void;
}

export const useTripStore = create<TripStoreState>((set) => ({
  currentTrip: sampleItinerary as unknown as Trip,
  isEditMode: false,
  history: [],
  future: [],
  setTrip: (trip) => set({ currentTrip: trip }),
  setEditMode: (enabled) => set({ isEditMode: enabled }),
  undo: () =>
    set((state) => {
      if (state.history.length === 0) return state;
      const previous = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, state.history.length - 1);
      return {
        currentTrip: previous,
        history: newHistory,
        future: state.currentTrip ? [state.currentTrip, ...state.future] : state.future,
      };
    }),
  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        currentTrip: next,
        history: state.currentTrip ? [...state.history, state.currentTrip] : state.history,
        future: newFuture,
      };
    }),
}));
