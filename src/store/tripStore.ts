import { create } from "zustand";
import { Trip, Activity, Stay } from "@/types/trip";
import { getSampleTrip } from "@/lib/data/trips";

export function recalculateBudget(trip: Trip): Trip {
  const days = trip.days || [];
  let activitiesCost = 0;
  let stayCost = 0;
  for (const day of days) {
    if (day.stay?.pricePerNight) {
      stayCost += day.stay.pricePerNight;
    }
    for (const act of day.activities || []) {
      activitiesCost += Number(act.estimatedCost) || 0;
    }
  }
  const transport = trip.budget?.transport ?? 18000;
  const food = trip.budget?.food ?? 22000;
  const misc = trip.budget?.misc ?? 5000;

  return {
    ...trip,
    budget: {
      transport,
      stay: stayCost,
      food,
      activities: activitiesCost,
      misc,
    },
  };
}

interface TripStoreState {
  currentTrip: Trip;
  initialTrip: Trip;
  isEditMode: boolean;
  history: Trip[];
  future: Trip[];

  // Mode toggles
  setTrip: (trip: Trip) => void;
  setEditMode: (enabled: boolean) => void;
  toggleEditMode: (enabled?: boolean) => void;
  undo: () => void;
  redo: () => void;
  discardChanges: () => void;
  commitChanges: () => void;

  // Edit actions
  reorderActivities: (dayNumber: number, sourceIndex: number, destIndex: number) => void;
  moveActivityBetweenDays: (
    sourceDayNumber: number,
    destDayNumber: number,
    activityIdOrSourceIndex: string | number,
    destIndex?: number
  ) => void;
  updateActivity: (
    dayNumber: number,
    activityId: string,
    updates: Partial<Activity>
  ) => void;
  removeActivity: (
    dayNumber: number,
    activityId: string
  ) => { removedActivity: Activity; dayNumber: number; index: number } | null;
  restoreActivity: (
    dayNumber: number,
    activity: Activity,
    index: number
  ) => void;
  duplicateActivity: (dayNumber: number, activityId: string) => void;
  addActivity: (dayNumber: number, activity: Activity) => void;
  updateStay: (dayNumber: number, stay: Stay, applyToAllDays?: boolean) => void;
  updateDayNotes: (dayNumber: number, notes: string, noteColor?: string) => void;
  updateActivityNote: (
    dayNumber: number,
    activityId: string,
    note: string,
    noteColor?: string
  ) => void;
}

const defaultTrip = recalculateBudget(getSampleTrip());

export const useTripStore = create<TripStoreState>((set, get) => ({
  currentTrip: defaultTrip,
  initialTrip: defaultTrip,
  isEditMode: false,
  history: [],
  future: [],

  setTrip: (trip) => {
    const recalculated = recalculateBudget(trip);
    set({
      currentTrip: recalculated,
      initialTrip: recalculated,
      history: [],
      future: [],
    });
  },

  setEditMode: (enabled) => set({ isEditMode: enabled }),

  toggleEditMode: (enabled) =>
    set((state) => ({ isEditMode: enabled !== undefined ? enabled : !state.isEditMode })),

  undo: () =>
    set((state) => {
      if (state.history.length === 0) return state;
      const previous = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, state.history.length - 1);
      return {
        currentTrip: previous,
        history: newHistory,
        future: [state.currentTrip, ...state.future],
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        currentTrip: next,
        history: [...state.history, state.currentTrip],
        future: newFuture,
      };
    }),

  discardChanges: () => {
    set((state) => ({
      currentTrip: state.initialTrip,
      history: [],
      future: [],
      isEditMode: false,
    }));
  },

  commitChanges: () => {
    set((state) => ({
      initialTrip: state.currentTrip,
      history: [],
      future: [],
      isEditMode: false,
    }));
  },

  reorderActivities: (dayNumber, sourceIndex, destIndex) => {
    const { currentTrip, history } = get();
    if (sourceIndex === destIndex) return;

    const days = currentTrip.days.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      const acts = [...day.activities];
      const [moved] = acts.splice(sourceIndex, 1);
      acts.splice(destIndex, 0, moved);
      return { ...day, activities: acts };
    });

    const newTrip = recalculateBudget({ ...currentTrip, days });
    set({
      history: [...history.slice(-25), currentTrip],
      future: [],
      currentTrip: newTrip,
    });
  },

  moveActivityBetweenDays: (
    sourceDayNumber,
    destDayNumber,
    activityIdOrSourceIndex,
    destIndex
  ) => {
    const { currentTrip, history } = get();
    let movedAct: Activity | undefined;

    const days = currentTrip.days.map((day) => {
      if (day.dayNumber === sourceDayNumber) {
        const acts = [...day.activities];
        const idx =
          typeof activityIdOrSourceIndex === "number"
            ? activityIdOrSourceIndex
            : acts.findIndex((a) => a.id === activityIdOrSourceIndex);
        if (idx >= 0 && idx < acts.length) {
          [movedAct] = acts.splice(idx, 1);
        }
        return { ...day, activities: acts };
      }
      return day;
    });

    if (!movedAct) return;

    const updatedDays = days.map((day) => {
      if (day.dayNumber === destDayNumber) {
        const acts = [...day.activities];
        const targetIdx =
          destIndex !== undefined && destIndex >= 0 && destIndex <= acts.length
            ? destIndex
            : acts.length;
        acts.splice(targetIdx, 0, movedAct!);
        return { ...day, activities: acts };
      }
      return day;
    });

    const newTrip = recalculateBudget({ ...currentTrip, days: updatedDays });
    set({
      history: [...history.slice(-25), currentTrip],
      future: [],
      currentTrip: newTrip,
    });
  },

  updateActivity: (dayNumber, activityId, updates) => {
    const { currentTrip, history } = get();

    const days = currentTrip.days.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      const activities = day.activities.map((act) =>
        act.id === activityId ? { ...act, ...updates } : act
      );
      return { ...day, activities };
    });

    const newTrip = recalculateBudget({ ...currentTrip, days });
    set({
      history: [...history.slice(-25), currentTrip],
      future: [],
      currentTrip: newTrip,
    });
  },

  removeActivity: (dayNumber, activityId) => {
    const { currentTrip, history } = get();
    let removedData: { removedActivity: Activity; dayNumber: number; index: number } | null = null;

    const days = currentTrip.days.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      const index = day.activities.findIndex((a) => a.id === activityId);
      if (index === -1) return day;
      const removedActivity = day.activities[index];
      removedData = { removedActivity, dayNumber, index };
      const activities = day.activities.filter((a) => a.id !== activityId);
      return { ...day, activities };
    });

    if (!removedData) return null;

    const newTrip = recalculateBudget({ ...currentTrip, days });
    set({
      history: [...history.slice(-25), currentTrip],
      future: [],
      currentTrip: newTrip,
    });

    return removedData;
  },

  restoreActivity: (dayNumber, activity, index) => {
    const { currentTrip, history } = get();

    const days = currentTrip.days.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      const activities = [...day.activities];
      activities.splice(Math.min(index, activities.length), 0, activity);
      return { ...day, activities };
    });

    const newTrip = recalculateBudget({ ...currentTrip, days });
    set({
      history: [...history.slice(-25), currentTrip],
      future: [],
      currentTrip: newTrip,
    });
  },

  duplicateActivity: (dayNumber, activityId) => {
    const { currentTrip, history } = get();

    const days = currentTrip.days.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      const index = day.activities.findIndex((a) => a.id === activityId);
      if (index === -1) return day;
      const original = day.activities[index];
      const duplicated: Activity = {
        ...original,
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: `${original.name} (Copy)`,
      };
      const activities = [...day.activities];
      activities.splice(index + 1, 0, duplicated);
      return { ...day, activities };
    });

    const newTrip = recalculateBudget({ ...currentTrip, days });
    set({
      history: [...history.slice(-25), currentTrip],
      future: [],
      currentTrip: newTrip,
    });
  },

  addActivity: (dayNumber, activity) => {
    const { currentTrip, history } = get();

    const days = currentTrip.days.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        activities: [...day.activities, activity],
      };
    });

    const newTrip = recalculateBudget({ ...currentTrip, days });
    set({
      history: [...history.slice(-25), currentTrip],
      future: [],
      currentTrip: newTrip,
    });
  },

  updateStay: (dayNumber, stay, applyToAllDays = false) => {
    const { currentTrip, history } = get();

    const days = currentTrip.days.map((day) => {
      if (applyToAllDays || day.dayNumber === dayNumber) {
        return { ...day, stay };
      }
      return day;
    });

    const newTrip = recalculateBudget({ ...currentTrip, days });
    set({
      history: [...history.slice(-25), currentTrip],
      future: [],
      currentTrip: newTrip,
    });
  },

  updateDayNotes: (dayNumber, notes, noteColor) => {
    const { currentTrip, history } = get();

    const days = currentTrip.days.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        notes,
        ...(noteColor ? { noteColor } : {}),
      };
    });

    set({
      history: [...history.slice(-25), currentTrip],
      future: [],
      currentTrip: { ...currentTrip, days },
    });
  },

  updateActivityNote: (dayNumber, activityId, note, noteColor) => {
    const { currentTrip, history } = get();

    const days = currentTrip.days.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      const activities = day.activities.map((act) =>
        act.id === activityId
          ? {
              ...act,
              note,
              ...(noteColor ? { noteColor } : {}),
            }
          : act
      );
      return { ...day, activities };
    });

    set({
      history: [...history.slice(-25), currentTrip],
      future: [],
      currentTrip: { ...currentTrip, days },
    });
  },
}));
