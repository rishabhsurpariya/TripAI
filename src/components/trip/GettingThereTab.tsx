"use client";

import { Plane, Train, Bus, Clock, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Trip, TransportOption } from "@/types/trip";

interface GettingThereTabProps {
  trip: Trip;
}

function getModeIcon(mode: TransportOption["mode"]) {
  switch (mode) {
    case "flight":
      return <Plane className="w-6 h-6 text-primary" />;
    case "train":
      return <Train className="w-6 h-6 text-primary" />;
    case "bus":
      return <Bus className="w-6 h-6 text-primary" />;
    default:
      return <Plane className="w-6 h-6 text-primary" />;
  }
}

export function GettingThereTab({ trip }: GettingThereTabProps) {
  const options = trip.gettingThere && trip.gettingThere.length > 0
    ? trip.gettingThere
    : [
        {
          mode: "train" as const,
          durationHours: 2.2,
          estimatedCost: 140,
          tag: "fastest" as const,
          tip: "Tokaido Shinkansen bullet train directly to destination station.",
        },
        {
          mode: "flight" as const,
          durationHours: 3.5,
          estimatedCost: 110,
          tip: "Fly into nearest regional airport, then 40-minute airport express bus.",
        },
        {
          mode: "bus" as const,
          durationHours: 7.5,
          estimatedCost: 45,
          tag: "best value" as const,
          tip: "Overnight highway bus saves one night of accommodation.",
        },
      ];

  const startCity = trip.startCity || "Tokyo";
  const destination = trip.destination || "Kyoto";
  const firstDayDate = trip.days?.[0]?.date || "Day 1 Arrival";

  return (
    <div className="flex flex-col space-y-8">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <span className="text-xs uppercase tracking-widest text-secondary font-bold">
            Transit Route
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-primary mt-0.5">
            From {startCity} to {destination}
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Carefully paced arrival options designed to maximize your first day.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-surface-container font-semibold text-xs text-primary border border-outline-variant/30">
            Travel Date: {firstDayDate}
          </span>
        </div>
      </div>

      {/* Transit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((option, idx) => {
          const isRecommended = option.tag === "fastest" || idx === 0;

          return (
            <div
              key={`${option.mode}-${idx}`}
              className={`bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between relative transition-all border ${
                isRecommended
                  ? "border-2 border-primary-container shadow-md"
                  : "border-outline-variant/40 hover:border-secondary"
              }`}
            >
              {/* Tag pill */}
              {option.tag && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-primary-container text-on-primary text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-secondary-container" />
                  <span>
                    {option.tag === "fastest"
                      ? "Recommended · Fastest"
                      : "Best Value"}
                  </span>
                </div>
              )}

              <div>
                {/* Title & Mode */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                      {getModeIcon(option.mode)}
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-primary font-medium capitalize">
                        {option.mode === "train"
                          ? "Express Shinkansen"
                          : option.mode === "flight"
                          ? "Direct Flight"
                          : "Highway Coach"}
                      </h4>
                      <p className="text-xs text-on-surface-variant capitalize">
                        {option.mode} Transit
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-xl sm:text-2xl text-primary font-bold">
                      ${option.estimatedCost.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-secondary font-medium">per traveler</p>
                  </div>
                </div>

                {/* Timings / Route Graphic */}
                <div className="my-5 p-4 rounded-xl bg-surface-container-low flex items-center justify-between text-center border border-outline-variant/20">
                  <div>
                    <p className="font-serif text-lg font-bold text-primary">
                      {option.mode === "flight"
                        ? "07:30"
                        : option.mode === "train"
                        ? "08:15"
                        : "22:30"}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">{startCity}</p>
                  </div>

                  <div className="flex flex-col items-center px-3">
                    <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {option.durationHours}h
                    </span>
                    <div className="w-20 sm:w-24 h-[2px] bg-outline-variant my-1 relative">
                      <ArrowRight className="w-3.5 h-3.5 text-primary absolute right-0 -top-1.5" />
                    </div>
                    <span className="text-[10px] text-emerald-800 font-medium">
                      On Time
                    </span>
                  </div>

                  <div>
                    <p className="font-serif text-lg font-bold text-primary">
                      {option.mode === "flight"
                        ? "10:45"
                        : option.mode === "train"
                        ? "10:30"
                        : "06:00"}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">{destination}</p>
                  </div>
                </div>

                {/* Tip note */}
                <p className="text-xs text-on-surface-variant leading-relaxed font-light">
                  {option.tip}
                </p>
              </div>

              {/* Card Footer Action */}
              <div className="mt-5 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-[11px] text-secondary font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Baggage included
                </span>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isRecommended
                      ? "bg-primary-container text-on-primary hover:bg-primary"
                      : "border border-secondary text-primary hover:bg-surface-container"
                  }`}
                >
                  Select Option
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
