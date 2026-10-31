"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Building2,
  Star,
  Check,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Stay } from "@/types/trip";
import { formatCurrency } from "@/lib/currency";

export interface ChangeHotelDrawerProps {
  isOpen: boolean;
  dayNumber: number;
  currentStay?: Stay;
  currency?: string;
  onClose: () => void;
  onSelectStay: (stay: Stay, applyToAllDays: boolean) => void;
}

// Mock curated alternative boutique hotels
const ALTERNATIVE_HOTELS: Stay[] = [
  {
    id: "stay-alt-1",
    name: "WelcomHeritage Panjim Inn & Latin Mansion",
    pricePerNight: 4400,
    distanceFromStopsKm: 0.8,
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "stay-alt-2",
    name: "Ahilya by the Sea (Dolphin Bay Estate)",
    pricePerNight: 6800,
    distanceFromStopsKm: 1.5,
    imageUrl:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "stay-alt-3",
    name: "The Postcard Cuelim (Historic Chapel View)",
    pricePerNight: 5200,
    distanceFromStopsKm: 2.1,
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "stay-alt-4",
    name: "Cabo Serai Oceanfront Eco Resort",
    pricePerNight: 7800,
    distanceFromStopsKm: 3.2,
    imageUrl:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
  },
];

export function ChangeHotelDrawer({
  isOpen,
  dayNumber,
  currentStay,
  currency = "INR",
  onClose,
  onSelectStay,
}: ChangeHotelDrawerProps) {
  const shouldReduceMotion = useReducedMotion();
  const [applyAllNights, setApplyAllNights] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
            className="fixed inset-0 bg-[#54381d]/35 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />

          {/* Drawer Container */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={{ x: 0, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#d3c4b9]/60"
          >
            {/* Top Bar */}
            <div className="p-5 border-b border-[#d3c4b9]/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#54381d]">
                <Building2 className="w-5 h-5 text-[#75593e]" />
                <h3 className="font-serif text-xl font-bold">
                  Switch Hotel for Night {dayNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#f8f3ed] hover:bg-[#ece7e1] flex items-center justify-center text-[#54381d] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {/* Apply to all nights checkbox */}
              <div className="p-3.5 rounded-xl bg-[#f8f3ed] border border-[#d3c4b9]/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#6e4f32]" />
                  <span className="text-[#54381d] font-semibold">
                    Apply switch to all trip nights?
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={applyAllNights}
                  onChange={(e) => setApplyAllNights(e.target.checked)}
                  className="w-4 h-4 accent-[#6e4f32] rounded cursor-pointer"
                />
              </div>

              {/* Current Stay Card */}
              {currentStay && (
                <div className="p-4 rounded-2xl bg-[#f8f3ed] border-2 border-[#6e4f32] relative shadow-xs">
                  <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-[#6e4f32] text-white text-[10px] font-bold">
                    Current Stay
                  </div>
                  <div className="h-32 rounded-xl overflow-hidden mb-3 relative bg-[#ece7e1]">
                    <Image
                      src={
                        currentStay.imageUrl ||
                        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={currentStay.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#54381d]">
                    {currentStay.name}
                  </h4>
                  <p className="text-xs text-[#81756b] mt-0.5 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>4.9 &bull; {currentStay.distanceFromStopsKm} km from stops</span>
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#d3c4b9]/40">
                    <span className="font-serif text-lg text-[#54381d] font-bold">
                      ${currentStay.pricePerNight.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-[#81756b]">/ night</span>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white text-[#54381d] text-xs font-semibold border border-[#d3c4b9]/50 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Selected
                    </span>
                  </div>
                </div>
              )}

              {/* Alternative Hotel Choices */}
              <div className="space-y-4 pt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#75593e]">
                  Alternative Stays with Same Standards
                </p>

                {ALTERNATIVE_HOTELS.map((hotel) => {
                  const isCurrent = currentStay?.id === hotel.id || currentStay?.name === hotel.name;
                  const priceDiff = currentStay
                    ? hotel.pricePerNight - currentStay.pricePerNight
                    : 0;

                  return (
                    <div
                      key={hotel.id}
                      className={`p-4 rounded-2xl bg-white border transition-all shadow-xs ${
                        isCurrent
                          ? "border-[#6e4f32] bg-[#f8f3ed]/50"
                          : "border-[#d3c4b9]/60 hover:border-[#6e4f32]/60"
                      }`}
                    >
                      <div className="h-32 rounded-xl overflow-hidden mb-3 relative bg-[#ece7e1]">
                        <Image
                          src={hotel.imageUrl}
                          alt={hotel.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-base font-bold text-[#54381d]">
                          {hotel.name}
                        </h4>
                        {priceDiff !== 0 && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                              priceDiff < 0
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {priceDiff < 0
                              ? `${formatCurrency(Math.abs(priceDiff), currency)} cheaper`
                              : `+${formatCurrency(priceDiff, currency)}/night`}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#81756b] mt-1 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>4.8 &bull; {hotel.distanceFromStopsKm} km to itinerary spots</span>
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#d3c4b9]/30">
                        <span className="font-serif text-lg text-[#54381d] font-bold">
                          {formatCurrency(hotel.pricePerNight, currency)}{" "}
                          <span className="text-xs font-normal text-[#81756b]">/ night</span>
                        </span>

                        {isCurrent ? (
                          <span className="px-3 py-1.5 rounded-full bg-[#ece7e1] text-[#54381d] text-xs font-semibold">
                            Current Stay
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSelectStay(hotel, applyAllNights)}
                            className="px-4 py-1.5 rounded-full bg-[#6e4f32] hover:bg-[#54381d] text-white text-xs font-semibold transition-transform active:scale-95 shadow-xs cursor-pointer"
                          >
                            Select &amp; Swap
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="p-4 border-t border-[#d3c4b9]/40 bg-[#f8f3ed] flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full border border-[#d3c4b9] hover:bg-white text-xs font-semibold text-[#54381d] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
