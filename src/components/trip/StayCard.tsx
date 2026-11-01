"use client";

import Image from "next/image";
import { Bed, Star, Navigation } from "lucide-react";
import { Stay, Trip } from "@/types/trip";
import { formatCurrency } from "@/lib/currency";
import { BookingButton } from "./BookingButton";

interface StayCardProps {
  stay: Stay;
  dayNumber?: number;
  currency?: string;
  onChangeHotel?: () => void;
  readOnly?: boolean;
  trip?: Trip;
  isEditMode?: boolean;
}

export function StayCard({
  stay,
  dayNumber,
  currency = "INR",
  onChangeHotel,
  readOnly = false,
  trip,
  isEditMode = false,
}: StayCardProps) {
  return (
    <div className="bg-surface-container rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-xs shrink-0 relative bg-surface-container-highest">
            <Image
              src={stay.imageUrl || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80"}
              alt={stay.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-secondary">
              <Bed className="w-3.5 h-3.5 text-primary" />
              <span className="font-bold uppercase tracking-wider text-[11px]">
                Tonight&apos;s Stay {dayNumber ? `· Night ${dayNumber}` : ""}
              </span>
              <span className="text-outline-variant">&bull;</span>
              <span className="flex items-center text-primary font-bold gap-0.5">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 4.9
              </span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-medium text-primary mt-0.5">
              {stay.name}
            </h4>
            <p className="text-xs text-on-surface-variant">
              {formatCurrency(stay.pricePerNight, currency)} / night (est.) &bull; {stay.distanceFromStopsKm} km from today&apos;s stops
            </p>
            {stay.imageAttribution && (
              <p className="text-[10px] text-on-surface-variant/70 mt-0.5">
                Photo:{" "}
                <a
                  href={`${stay.imageAttribution.photographerUrl}?utm_source=tripai&utm_medium=referral`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  {stay.imageAttribution.photographerName}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Action button / Status badge */}
        {readOnly ? (
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-right">
              <div className="text-xs font-semibold text-[#6e4f32]">
                {formatCurrency(stay.pricePerNight || 0, currency)}{" "}
                <span className="text-[11px] font-normal text-[#a28973]">/ night (est.)</span>
              </div>
              <div className="text-[10px] text-[#8c6e52] font-medium bg-white/70 px-2 py-0.5 rounded border border-[#bba591]/30 mt-0.5 inline-block">
                Confirmed Stay
              </div>
            </div>
            {trip && (
              <BookingButton
                category="hotel"
                label="Check availability"
                trip={trip}
                dayNumber={dayNumber}
                hotelName={stay.name}
                isEditMode={false}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0 flex-wrap justify-end">
            {trip && !isEditMode && (
              <BookingButton
                category="hotel"
                label="Check availability"
                trip={trip}
                dayNumber={dayNumber}
                hotelName={stay.name}
                isEditMode={isEditMode}
              />
            )}
            {onChangeHotel && (
              <button
                type="button"
                onClick={onChangeHotel}
                className="px-4 py-2 rounded-full border border-secondary text-primary hover:bg-surface-container-high text-xs font-semibold transition-colors cursor-pointer"
              >
                Change Hotel
              </button>
            )}
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center hover:bg-surface transition-colors shadow-xs cursor-pointer border border-outline-variant/30"
              title="Directions"
              aria-label="Get directions to hotel"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
