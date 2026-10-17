"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Star,
  Check,
  PlusCircle,
  MapPin,
  Calendar,
  Sparkles,
  Bed,
} from "lucide-react";
import { Trip } from "@/types/trip";

interface HotelsTabProps {
  trip: Trip;
}

export function HotelsTab({ trip }: HotelsTabProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const stayBudget = trip.budget?.stay || 35000;
  const daysCount = trip.days?.length || 5;

  const primaryStay = trip.days?.[0]?.stay || {
    id: "stay-1",
    name: "Noku Kyoto Boutique Hotel",
    pricePerNight: 7000,
    distanceFromStopsKm: 1.2,
    imageUrl:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
  };

  const handleAction = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="flex flex-col space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <span className="text-xs uppercase tracking-widest text-secondary font-bold">
            Selected Stays
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-primary mt-0.5">
            Heritage Boutique &amp; Ryokan Collection
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Curated accommodations positioned within walking distance of key trail stops.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg sm:text-xl text-primary font-bold">
            Total Stay Budget: ${stayBudget.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-primary-container text-on-primary text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <span>{toastMessage}</span>
          <span className="text-[11px] opacity-80">Updated</span>
        </div>
      )}

      {/* 3 HOTEL CARDS GRID (Stitch Design) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Primary Confirmed Stay */}
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/40 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="h-48 relative w-full overflow-hidden">
              <Image
                src={primaryStay.imageUrl}
                alt={primaryStay.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-xs text-primary text-xs font-bold shadow-xs">
                Nights 1 to {daysCount}
              </span>
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-secondary-container" />
                <span>Primary Stay</span>
              </div>
            </div>

            <div className="p-5">
              <h4 className="font-serif text-lg text-primary font-medium">
                {primaryStay.name}
              </h4>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-secondary" />
                <span>Central {trip.destination} · {primaryStay.distanceFromStopsKm} km to stops ·</span>
                <span className="flex items-center text-amber-700 font-semibold">
                  <Star className="w-3 h-3 fill-amber-700 text-amber-700 ml-0.5" /> 4.9
                </span>
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] text-secondary font-medium">
                  Breakfast included
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] text-secondary font-medium">
                  Courtyard garden
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] text-secondary font-medium">
                  Free Wi-Fi
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between pt-3 border-t border-outline-variant/30">
                <div>
                  <span className="font-serif text-xl text-primary font-bold">
                    ${primaryStay.pricePerNight.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-secondary font-normal ml-1">
                    / night
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Confirmed
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 pt-0">
            <button
              type="button"
              onClick={() => handleAction(`Viewing details for ${primaryStay.name}`)}
              className="w-full py-2.5 rounded-full border border-secondary text-primary hover:bg-surface-container font-semibold text-xs transition-colors cursor-pointer"
            >
              View Booking Details
            </button>
          </div>
        </div>

        {/* Card 2: Alternative Hold Reserved Stay */}
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/40 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="h-48 relative w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80"
                alt="Machiya Heritage Ryokan"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-xs text-primary text-xs font-bold shadow-xs">
                Alternative Option
              </span>
            </div>

            <div className="p-5">
              <h4 className="font-serif text-lg text-primary font-medium">
                Traditional Machiya Heritage Villa
              </h4>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-secondary" />
                <span>Historic District · Riverside canal view ·</span>
                <span className="flex items-center text-amber-700 font-semibold">
                  <Star className="w-3 h-3 fill-amber-700 text-amber-700 ml-0.5" /> 4.9
                </span>
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] text-secondary font-medium">
                  Private onsen bath
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] text-secondary font-medium">
                  Tatami floors
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] text-secondary font-medium">
                  Tea master host
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between pt-3 border-t border-outline-variant/30">
                <div>
                  <span className="font-serif text-xl text-primary font-bold">
                    $8,500
                  </span>
                  <span className="text-[11px] text-secondary font-normal ml-1">
                    / night
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                  Hold Reserved
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 pt-0">
            <button
              type="button"
              onClick={() => handleAction("Swapped stay to Traditional Machiya Heritage Villa")}
              className="w-full py-2.5 rounded-full bg-primary-container text-on-primary hover:bg-primary font-semibold text-xs transition-colors cursor-pointer"
            >
              Swap to this Ryokan
            </button>
          </div>
        </div>

        {/* Card 3: Add Night Stay (Dashed card from Stitch line 673) */}
        <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-outline-variant hover:border-primary transition-colors min-h-[360px]">
          <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-secondary mb-3">
            <PlusCircle className="w-7 h-7" />
          </div>
          <h4 className="font-serif text-lg text-primary font-medium">
            Add Extension or Custom Stay
          </h4>
          <p className="text-xs text-on-surface-variant mt-2 max-w-xs leading-relaxed font-light">
            Explore authentic machiya townhouses in Gion or serene mountaintop temple lodgings (shukubo) along your journey.
          </p>
          <button
            type="button"
            onClick={() => handleAction("Hotel search catalog opened")}
            className="mt-6 px-5 py-2.5 rounded-full bg-surface-container-lowest text-primary hover:bg-surface font-semibold text-xs shadow-xs border border-outline-variant/40 transition-all cursor-pointer"
          >
            Browse Accommodations
          </button>
        </div>
      </div>

      {/* NIGHT-BY-NIGHT ASSIGNMENT BREAKDOWN */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/40">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-4">
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-secondary" />
            <h3 className="font-serif text-lg text-primary font-medium">
              Night-by-Night Accommodation Schedule
            </h3>
          </div>
          <span className="text-xs text-secondary font-medium">
            {daysCount} Nights Confirmed
          </span>
        </div>

        <div className="divide-y divide-outline-variant/20">
          {trip.days?.map((day) => (
            <div
              key={day.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-surface-container-low/30 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-surface-container text-primary font-bold text-xs flex items-center justify-center shrink-0">
                  N{day.dayNumber}
                </span>
                <div>
                  <p className="font-serif text-sm font-medium text-primary">
                    {day.stay?.name || primaryStay.name}
                  </p>
                  <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-secondary" />
                    <span>Night of {day.date || `Day ${day.dayNumber}`}</span>
                    <span>· {day.stay?.distanceFromStopsKm || primaryStay.distanceFromStopsKm} km from day stops</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs font-serif font-bold text-primary">
                  ${(day.stay?.pricePerNight || primaryStay.pricePerNight).toLocaleString()}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Booked
                </span>
                <button
                  type="button"
                  onClick={() => handleAction(`Modify Night ${day.dayNumber} accommodation`)}
                  className="text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
