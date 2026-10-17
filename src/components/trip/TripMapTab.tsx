"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Compass, Info } from "lucide-react";
import { Trip } from "@/types/trip";

// Dynamic import with SSR disabled so Leaflet never touches server execution
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] rounded-2xl bg-surface-container-low flex flex-col items-center justify-center p-8 border border-outline-variant/40 animate-pulse text-center">
      <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-secondary mb-3 shadow-xs">
        <Compass className="w-7 h-7 text-primary animate-spin" />
      </div>
      <p className="font-serif text-lg text-primary font-medium">
        Loading Interactive Trail Map...
      </p>
      <p className="text-xs text-on-surface-variant mt-1 font-light">
        Connecting to OpenStreetMap geospatial tiles &amp; routes
      </p>
    </div>
  ),
});

interface TripMapTabProps {
  trip: Trip;
}

export function TripMapTab({ trip }: TripMapTabProps) {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | "all">(1);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  const days = useMemo(() => trip.days || [], [trip.days]);

  // Filter activities based on day filter
  const displayedActivities = useMemo(() => {
    if (selectedDayNumber === "all") {
      let counter = 1;
      return days.flatMap((day) =>
        day.activities.map((act) => ({
          ...act,
          dayNumber: day.dayNumber,
          stopIndex: counter++,
        }))
      );
    }

    const currentDay = days.find((d) => d.dayNumber === selectedDayNumber);
    if (!currentDay) return [];

    return currentDay.activities.map((act, index) => ({
      ...act,
      dayNumber: currentDay.dayNumber,
      stopIndex: index + 1,
    }));
  }, [days, selectedDayNumber]);

  const activeDayObj = useMemo(() => {
    if (selectedDayNumber === "all") return null;
    return days.find((d) => d.dayNumber === selectedDayNumber);
  }, [days, selectedDayNumber]);

  return (
    <div className="flex flex-col space-y-8">
      {/* Header and Day Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <span className="text-xs uppercase tracking-widest text-secondary font-bold">
            Route Geography &amp; Trail
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-primary mt-0.5">
            {selectedDayNumber === "all"
              ? "All 5 Days Complete Exploration Trail"
              : `Day ${selectedDayNumber}: ${activeDayObj?.title || "Daily Route"}`}
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            OpenStreetMap live GPS coordinates with connecting routes and numbered stop locations.
          </p>
        </div>

        {/* Day Switcher Pills (Stitch lines 1241-1246) */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1.5 rounded-full border border-outline-variant/30 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => {
              setSelectedDayNumber("all");
              setSelectedActivityId(null);
            }}
            className={`px-3 py-1 text-center text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
              selectedDayNumber === "all"
                ? "bg-primary-container text-on-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            All Days
          </button>
          {days.map((day) => {
            const isSelected = selectedDayNumber === day.dayNumber;
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => {
                  setSelectedDayNumber(day.dayNumber);
                  setSelectedActivityId(null);
                }}
                className={`w-9 py-1 text-center text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary-container text-on-primary shadow-xs font-bold"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                D{day.dayNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Workspace: Interactive Map (Left 8 cols) + Stop Sequence Directory (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEAFLET MAP CONTAINER (8 COLUMNS) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="h-[520px] sm:h-[580px] w-full rounded-2xl overflow-hidden shadow-sm border border-outline-variant/40 bg-surface-container-low relative">
            <LeafletMap
              activities={displayedActivities}
              selectedActivityId={selectedActivityId}
              onSelectActivity={(id) => setSelectedActivityId(id)}
            />

            {/* Floating Top Map Legend */}
            <div className="absolute top-3 right-3 z-[400] bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-outline-variant/30 shadow-sm flex items-center gap-2 pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container inline-block" />
              <span className="text-[11px] font-semibold text-primary">
                {displayedActivities.length} Waypoints
              </span>
              <span className="text-outline-variant">•</span>
              <span className="text-[11px] text-secondary font-medium">
                {selectedDayNumber === "all" ? "Whole City Route" : "Daily Trail"}
              </span>
            </div>
          </div>

          {/* Quick Map Tips Footer Banner */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
            <span className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>
                Click any numbered pin to inspect spot timings, category, and admissions.
              </span>
            </span>
            <span className="text-[11px] text-secondary font-medium hidden sm:inline">
              Powered by OpenStreetMap
            </span>
          </div>
        </div>

        {/* STOP SEQUENCE & WAYPOINT DIRECTORY (4 COLUMNS) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/40">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                  Waypoint Itinerary
                </span>
                <h4 className="font-serif text-base text-primary font-medium mt-0.5">
                  {selectedDayNumber === "all"
                    ? "Full Schedule Sequence"
                    : `Day ${selectedDayNumber} Stops`}
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-xs font-bold text-primary">
                {displayedActivities.length} Stops
              </span>
            </div>

            {/* List of interactive stop cards */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 no-scrollbar">
              {displayedActivities.map((act) => {
                const isSelected = selectedActivityId === act.id;

                return (
                  <div
                    key={act.id}
                    onClick={() => setSelectedActivityId(act.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? "bg-surface-container border-primary-container shadow-xs ring-1 ring-primary-container"
                        : "bg-surface-container-low/50 hover:bg-surface-container-low border-outline-variant/20"
                    }`}
                  >
                    {/* Number Badge */}
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 font-serif shadow-xs ${
                        isSelected
                          ? "bg-primary-container text-on-primary ring-2 ring-surface"
                          : "bg-surface-container-high text-primary"
                      }`}
                    >
                      {act.stopIndex}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-secondary">
                          {act.category}
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-medium">
                          {act.durationMinutes} min
                        </span>
                      </div>
                      <h5 className="font-serif text-xs font-semibold text-primary truncate mt-0.5">
                        {act.name}
                      </h5>
                      <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5 font-light">
                        {act.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Day note memo if present */}
            {activeDayObj?.notes && (
              <div className="mt-4 pt-3 border-t border-outline-variant/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                  Local Trail Note:
                </span>
                <p className="text-xs text-on-surface-variant mt-1 italic font-light">
                  &ldquo;{activeDayObj.notes}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
