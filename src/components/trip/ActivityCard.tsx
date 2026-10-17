"use client";

import Image from "next/image";
import {
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Clock,
  Sparkles,
  Receipt,
  Plus,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Activity } from "@/types/trip";
import { easing } from "@/lib/motion";

export interface ActivityCardProps {
  activity: Activity;
  index?: number;
  className?: string;
  isEditMode?: boolean;
  onDelete?: (id: string) => void;
  onReplace?: (id: string) => void;
  onUpdateDuration?: (id: string, mins: number) => void;
  onUpdateCost?: (id: string, cost: number) => void;
  onUpdateNote?: (id: string, note: string) => void;
}

function getTimeSlotIcon(slot: string) {
  const s = slot.toLowerCase();
  if (s.includes("morning")) return <Sunrise className="w-4 h-4 text-amber-600" />;
  if (s.includes("afternoon") || s.includes("midday")) return <Sun className="w-4 h-4 text-amber-600" />;
  if (s.includes("golden") || s.includes("sunset") || s.includes("evening")) return <Sunset className="w-4 h-4 text-amber-700" />;
  return <Moon className="w-4 h-4 text-indigo-600" />;
}

export function ActivityCard({
  activity,
  index = 1,
  className = "",
}: ActivityCardProps) {
  const durationHours = (activity.durationMinutes / 60).toFixed(1);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.42, ease: easing }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -3,
              boxShadow:
                "0 10px 28px -4px rgba(0,0,0,0.13), 0 4px 10px -2px rgba(0,0,0,0.07)",
              transition: { duration: 0.2, ease: easing },
            }
      }
      className={`relative flex flex-col group my-5 ${className}`}
    >
      {/* Timeline Circle Number Step */}
      <motion.div
        initial={shouldReduceMotion ? false : { scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 500, damping: 22, delay: 0.1 }
        }
        className="absolute -left-6 md:-left-10 top-5 w-6 md:w-8 h-6 md:h-8 rounded-full bg-surface border-2 border-primary-container flex items-center justify-center text-xs font-bold text-primary-container shadow-xs z-10"
      >
        {index}
      </motion.div>

      {/* Main Card Body */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 shadow-sm relative border border-outline-variant/30 transition-shadow">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs text-secondary flex-wrap">
            {getTimeSlotIcon(activity.timeSlot)}
            <span className="font-semibold capitalize text-primary">
              {activity.timeSlot}
            </span>
            <span className="text-outline-variant">&bull;</span>
            <span className="flex items-center gap-1 text-on-surface-variant">
              <Clock className="w-3.5 h-3.5 text-outline" /> {durationHours} Hours
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-medium">
            {activity.category || "Sightseeing"}
          </span>
        </div>

        {/* Card Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Photo — image zooms slightly on card hover via CSS on the group */}
          <div className="md:col-span-5 h-44 sm:h-48 rounded-xl overflow-hidden shadow-xs relative bg-surface-container-highest">
            <Image
              src={
                activity.imageUrl ||
                "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80"
              }
              alt={activity.name}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {activity.category && (
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-surface/90 backdrop-blur-sm text-[10px] font-semibold text-on-surface shadow-xs">
                {activity.category}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-lg sm:text-xl text-primary font-medium">
                {activity.name}
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed font-light">
                {activity.description}
              </p>
            </div>

            {/* Bottom Meta & Action */}
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-outline-variant/30 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-primary-container font-semibold">
                  <Receipt className="w-3.5 h-3.5 text-secondary" />
                  {activity.estimatedCost > 0
                    ? `~$${activity.estimatedCost.toLocaleString()} est.`
                    : "Free entry"}
                </span>
              </div>

              {/* Visual Add Note button */}
              <button
                type="button"
                className="text-secondary hover:text-primary text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Note</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrapbook Floating Sticky Note — slight rotation that straightens on hover */}
        {activity.note && (
          <motion.div
            initial={{ rotate: -1.5 }}
            whileHover={
              shouldReduceMotion
                ? undefined
                : { rotate: -0.3, scale: 1.03, transition: { duration: 0.22, ease: easing } }
            }
            className="mt-4 sm:mt-0 sm:absolute -right-3 -bottom-5 w-full sm:w-64 bg-[#fdfbf7] p-3 rounded-md shadow-md border border-[#bba591]/35 z-20 cursor-pointer"
          >
            {/* Washi tape strip */}
            <div className="absolute -top-2 left-6 w-12 h-3.5 bg-secondary-fixed-dim/70 rounded-xs rotate-[-3deg] backdrop-blur-[1px]" />
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-tertiary flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#e9bf9a]" /> AI Discovery
              </span>
              <span className="w-2 h-2 rounded-full bg-primary-fixed-dim" />
            </div>
            <p className="font-handwriting text-base leading-snug text-tertiary">
              &ldquo;{activity.note}&rdquo;
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
