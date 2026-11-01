"use client";

import { useState } from "react";
import {
  Bike,
  Compass,
  Car,
  CheckCircle2,
  Ticket,
  Clock,
  Sparkles,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { Trip } from "@/types/trip";
import { formatCurrency } from "@/lib/currency";

interface LocalTransportTabProps {
  trip: Trip;
}

interface MobilityOption {
  id: string;
  title: string;
  category: string;
  description: string;
  pricePerDay: number;
  perks: string;
  badge?: string;
  icon: "scooter" | "cruiser" | "sedan";
}

export function LocalTransportTab({ trip }: LocalTransportTabProps) {
  const [selectedRental, setSelectedRental] = useState<string | null>("scooter");
  const [reservedMessage, setReservedMessage] = useState<string | null>(null);

  const destination = trip.destination || "Destination";
  const daysCount = trip.days?.length || 5;
  const currencyCode = trip.currency || "INR";

  const mobilityOptions: MobilityOption[] = [
    {
      id: "scooter",
      title: "Honda Activa 6G / Vespa Scooter",
      category: "Lightweight Mobility",
      description:
        "The true traveler classic. Seamless maneuvering through narrow historic quarter lanes, river paths, and breezy avenues.",
      pricePerDay: 18,
      perks: "Includes 2 helmets + central station drop-off",
      badge: "Most Popular",
      icon: "scooter",
    },
    {
      id: "cruiser",
      title: "Royal Enfield Hunter 350 Cruiser",
      category: "Retro Highway Ride",
      description:
        "Thumping retro cruiser ideal for scenic mountain gorge passes, coastal highways, and sunset ridge viewpoints.",
      pricePerDay: 42,
      perks: "Includes roadside assist & full insurance",
      icon: "cruiser",
    },
    {
      id: "sedan",
      title: "Private AC Chauffeur Sedan",
      category: "All-Day Comfort",
      description:
        "Air-conditioned executive comfort for temple routes, luggage transfers between boutique stays, and airport transit.",
      pricePerDay: 85,
      perks: "8 hours / 80 km package daily with local driver",
      icon: "sedan",
    },
  ];

  const handleReserve = (option: MobilityOption) => {
    setSelectedRental(option.id);
    setReservedMessage(
      `${option.title} selected for ${daysCount} days: ${formatCurrency(option.pricePerDay * daysCount, currencyCode)}`
    );
    setTimeout(() => {
      setReservedMessage(null);
    }, 4000);
  };

  return (
    <div className="flex flex-col space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <span className="text-xs uppercase tracking-widest text-secondary font-bold">
            On-Ground Mobility
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-primary mt-0.5">
            Recommended Wheels & Local Transit in {destination}
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Choose between dedicated personal wheels or explore curated day-by-day public transit passes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-surface-container font-semibold text-xs text-primary border border-outline-variant/30 flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-secondary" />
            <span>{daysCount}-Day Mobility Plan</span>
          </span>
        </div>
      </div>

      {/* Reservation confirmation toast banner */}
      {reservedMessage && (
        <div className="p-3.5 rounded-xl bg-primary-container text-on-primary text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-secondary-container" />
            <span>{reservedMessage}</span>
          </div>
          <span className="text-[11px] opacity-80">Saved to draft</span>
        </div>
      )}

      {/* 3 VEHICLE CARDS GRID (Stitch Design) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mobilityOptions.map((opt) => {
          const isSelected = selectedRental === opt.id;

          return (
            <div
              key={opt.id}
              className={`bg-surface-container-lowest rounded-2xl p-6 shadow-sm border flex flex-col justify-between relative transition-all ${
                isSelected
                  ? "border-2 border-primary-container shadow-md"
                  : "border-outline-variant/40 hover:border-secondary"
              }`}
            >
              {opt.badge && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-primary-container text-on-primary text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-secondary-container" />
                  <span>{opt.badge}</span>
                </div>
              )}

              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-4">
                  {opt.icon === "scooter" && <Bike className="w-6 h-6" />}
                  {opt.icon === "cruiser" && <Compass className="w-6 h-6" />}
                  {opt.icon === "sedan" && <Car className="w-6 h-6" />}
                </div>

                <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  {opt.category}
                </span>
                <h4 className="font-serif text-lg text-primary font-medium mt-0.5">
                  {opt.title}
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-2 font-light">
                  {opt.description}
                </p>

                {/* Pricing Box */}
                <div className="mt-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif text-xl sm:text-2xl text-primary font-bold">
                      ${opt.pricePerDay}
                    </span>
                    <span className="text-xs text-secondary font-medium">/ day</span>
                  </div>
                  <p className="text-[11px] text-secondary mt-1 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3 h-3 text-secondary" />
                    {opt.perks}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleReserve(opt)}
                className={`w-full mt-5 py-2.5 rounded-full font-semibold text-xs transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary-container text-on-primary hover:bg-primary shadow-xs"
                    : "border border-secondary text-primary hover:bg-surface-container"
                }`}
              >
                {isSelected ? "Option Selected ✓" : `Reserve ${opt.title.split(" ")[0]}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* REGIONAL TRANSIT CARD ADVISORY */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
            <Ticket className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h4 className="font-serif text-base text-primary font-medium">
              Smart Transit &amp; Contactless IC Pass Recommendation
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5 font-light">
              Tap-and-ride contactless cards (e.g. Suica, Pasmo, ICOCA) work across all municipal subways, regional rail lines, and city loop buses with automated fare capping.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-surface-container text-primary text-[11px] font-semibold border border-outline-variant/30 shrink-0 self-start sm:self-center">
          Tap &amp; Ride Ready
        </span>
      </div>

      {/* DAY-BY-DAY LOCAL TRANSIT DIRECTORY (Driven by trip.days) */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/40">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
              Daily Itinerary Transit
            </span>
            <h3 className="font-serif text-xl text-primary font-medium mt-0.5">
              Hop-On Transit per Day
            </h3>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            Included in Day Schedules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trip.days?.map((day) => (
            <div
              key={day.id}
              className="p-4 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary text-[10px] font-bold">
                    Day {day.dayNumber}
                  </span>
                  <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-secondary" />
                    {day.activities?.length || 0} stops
                  </span>
                </div>
                <h5 className="font-serif text-sm font-medium text-primary mt-2 line-clamp-1">
                  {day.title}
                </h5>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-secondary">
                  Recommended lines:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {day.localTransport && day.localTransport.length > 0 ? (
                    day.localTransport.map((trans, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-md bg-surface-container text-primary text-[11px] font-medium border border-outline-variant/30 flex items-center gap-1"
                      >
                        <MapPin className="w-2.5 h-2.5 text-secondary" />
                        {trans}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-on-surface-variant">
                      Walking &amp; Local Shuttles
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
