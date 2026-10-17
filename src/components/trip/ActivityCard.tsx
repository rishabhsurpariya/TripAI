"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Clock,
  Receipt,
  Plus,
  GripVertical,
  MoreVertical,
  Trash2,
  Copy,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Activity } from "@/types/trip";
import { easing } from "@/lib/motion";
import { StickyNote } from "./StickyNote";

export interface ActivityCardProps {
  activity: Activity;
  index?: number;
  dayNumber?: number;
  allDayNumbers?: number[];
  className?: string;
  isEditMode?: boolean;
  isDragging?: boolean;
  dragHandleProps?: Record<string, unknown>;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onMoveToDay?: (id: string, targetDayNumber: number) => void;
  onUpdateDuration?: (id: string, mins: number) => void;
  onUpdateCost?: (id: string, cost: number) => void;
  onUpdateTimeSlot?: (id: string, slot: string) => void;
  onUpdateNote?: (id: string, note: string, color?: string) => void;
  onReplace?: (id: string) => void;
  readOnly?: boolean;
}

function getTimeSlotIcon(slot: string) {
  const s = slot.toLowerCase();
  if (s.includes("morning")) return <Sunrise className="w-4 h-4 text-amber-600 shrink-0" />;
  if (s.includes("afternoon") || s.includes("midday")) return <Sun className="w-4 h-4 text-amber-600 shrink-0" />;
  if (s.includes("golden") || s.includes("sunset") || s.includes("evening")) return <Sunset className="w-4 h-4 text-amber-700 shrink-0" />;
  return <Moon className="w-4 h-4 text-indigo-600 shrink-0" />;
}

const TIME_SLOT_OPTIONS = [
  "Morning · 09:30 AM",
  "Morning · 10:30 AM",
  "Afternoon · 01:30 PM",
  "Late Afternoon · 04:00 PM",
  "Golden Hour · 05:00 PM",
  "Evening · 06:30 PM",
  "Night · 08:30 PM",
];

export function ActivityCard({
  activity,
  index = 1,
  dayNumber = 1,
  allDayNumbers = [1, 2, 3, 4, 5],
  className = "",
  isEditMode = false,
  isDragging = false,
  dragHandleProps,
  onDelete,
  onDuplicate,
  onMoveToDay,
  onUpdateDuration,
  onUpdateCost,
  onUpdateTimeSlot,
  onUpdateNote,
  readOnly = false,
}: ActivityCardProps) {
  const durationHours = (activity.durationMinutes / 60).toFixed(1);
  const shouldReduceMotion = useReducedMotion();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [prevCost, setPrevCost] = useState(activity.estimatedCost);
  const [costInput, setCostInput] = useState(String(activity.estimatedCost || 0));
  if (activity.estimatedCost !== prevCost) {
    setPrevCost(activity.estimatedCost);
    setCostInput(String(activity.estimatedCost || 0));
  }
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAdjustDuration = (deltaHours: number) => {
    const currentMins = activity.durationMinutes || 60;
    const nextMins = Math.max(30, currentMins + Math.round(deltaHours * 60));
    onUpdateDuration?.(activity.id, nextMins);
  };

  const handleCostBlur = () => {
    const parsed = parseInt(costInput.replace(/[^0-9]/g, ""), 10) || 0;
    onUpdateCost?.(activity.id, parsed);
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.42, ease: easing }}
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
      <div
        className={`bg-surface-container-lowest rounded-2xl p-4 sm:p-6 shadow-sm relative border transition-all duration-200 ${
          isDragging
            ? "scale-[1.02] rotate-[1.5deg] shadow-[0_20px_35px_-8px_rgba(110,79,50,0.18)] border-[#6e4f32] z-30"
            : isEditMode
            ? "border-dashed border-outline-variant/70 hover:border-primary-container"
            : "border-outline-variant/30"
        }`}
      >
        {/* Top Header Row with Time Slot, Duration & Controls */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-secondary flex-wrap">
            {/* Drag Handle in Edit Mode (fades in) */}
            <AnimatePresence>
              {isEditMode && (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, width: 0 }}
                  animate={{ opacity: 1, scale: 1, width: "auto" }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, width: 0 }}
                  transition={{ duration: 0.2 }}
                  {...dragHandleProps}
                  className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-[#81756b] hover:text-[#54381d] rounded hover:bg-[#f2ede7] transition-colors overflow-hidden"
                  title="Drag to reorder activity or move between days"
                >
                  <GripVertical className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Time Slot Display / Dropdown */}
            <AnimatePresence mode="wait">
              {isEditMode ? (
                <motion.div
                  key="edit-timeslot"
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="relative inline-block"
                >
                  <select
                    value={activity.timeSlot}
                    onChange={(e) => onUpdateTimeSlot?.(activity.id, e.target.value)}
                    className="appearance-none bg-[#f8f3ed] hover:bg-[#f2ede7] pl-2.5 pr-6 py-1 rounded-full text-xs font-semibold text-[#54381d] border border-[#d3c4b9]/60 focus:outline-none focus:ring-1 focus:ring-[#6e4f32] cursor-pointer"
                  >
                    {TIME_SLOT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    {!TIME_SLOT_OPTIONS.includes(activity.timeSlot) && (
                      <option value={activity.timeSlot}>{activity.timeSlot}</option>
                    )}
                  </select>
                  <ChevronDown className="w-3 h-3 text-[#81756b] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </motion.div>
              ) : (
                <motion.div
                  key="view-timeslot"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1.5"
                >
                  {getTimeSlotIcon(activity.timeSlot)}
                  <span className="font-semibold capitalize text-primary">
                    {activity.timeSlot}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <span className="text-outline-variant">&bull;</span>

            {/* Duration Display / Stepper */}
            <AnimatePresence mode="wait">
              {isEditMode ? (
                <motion.div
                  key="edit-duration"
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex items-center rounded-full bg-[#f8f3ed] border border-[#d3c4b9]/60 px-1 py-0.5 text-[#54381d]"
                >
                  <button
                    type="button"
                    onClick={() => handleAdjustDuration(-0.5)}
                    className="w-5 h-5 rounded-full hover:bg-white flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Decrease duration by 30 mins"
                  >
                    &minus;
                  </button>
                  <span className="px-1.5 text-xs font-semibold">
                    {durationHours}h
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdjustDuration(0.5)}
                    className="w-5 h-5 rounded-full hover:bg-white flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Increase duration by 30 mins"
                  >
                    +
                  </button>
                </motion.div>
              ) : (
                <motion.span
                  key="view-duration"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1 text-on-surface-variant"
                >
                  <Clock className="w-3.5 h-3.5 text-outline" /> {durationHours} Hours
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Right Action Icons in Header */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-medium">
              {activity.category || "Sightseeing"}
            </span>

            {/* Context Actions & Delete Button in Edit Mode (fades in) */}
            <AnimatePresence>
              {isEditMode && (
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1"
                >
                  <div className="relative" ref={menuRef}>
                    <button
                      type="button"
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="p-1.5 text-[#75593e] hover:text-[#54381d] rounded-full hover:bg-[#f8f3ed] transition-colors cursor-pointer"
                      title="Stop actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {menuOpen && (
                        <motion.div
                          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -4 }}
                          transition={{ duration: 0.16 }}
                          className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-[#d3c4b9]/60 p-1.5 z-30 text-xs origin-top-right"
                        >
                          {/* Duplicate Stop */}
                          {onDuplicate && (
                            <button
                              type="button"
                              onClick={() => {
                                onDuplicate(activity.id);
                                setMenuOpen(false);
                              }}
                              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f8f3ed] flex items-center gap-2 text-[#54381d] cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5 text-[#81756b]" />
                              <span>Duplicate stop</span>
                            </button>
                          )}

                          {/* Move to another Day */}
                          {onMoveToDay && allDayNumbers.length > 1 && (
                            <div className="py-1 border-t border-[#d3c4b9]/30 my-1">
                              <p className="px-3 text-[10px] uppercase font-bold text-[#81756b] mb-1">
                                Move to Day:
                              </p>
                              <div className="flex items-center gap-1 px-3 flex-wrap">
                                {allDayNumbers
                                  .filter((d) => d !== dayNumber)
                                  .map((d) => (
                                    <button
                                      key={d}
                                      type="button"
                                      onClick={() => {
                                        onMoveToDay(activity.id, d);
                                        setMenuOpen(false);
                                      }}
                                      className="px-2 py-0.5 rounded-md bg-[#f8f3ed] hover:bg-[#6e4f32] hover:text-white text-[11px] font-semibold text-[#54381d] transition-colors cursor-pointer"
                                    >
                                      Day {d}
                                    </button>
                                  ))}
                              </div>
                            </div>
                          )}

                          {/* Remove Stop */}
                          {onDelete && (
                            <div className="pt-1 border-t border-[#d3c4b9]/30">
                              <button
                                type="button"
                                onClick={() => {
                                  onDelete(activity.id);
                                  setMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#ffdad6]/40 flex items-center gap-2 text-[#ba1a1a] cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove stop</span>
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Direct Delete Button in Edit Mode */}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(activity.id)}
                      className="p-1.5 text-[#ba1a1a]/80 hover:text-[#ba1a1a] rounded-full hover:bg-[#ffdad6]/40 transition-colors cursor-pointer"
                      title="Remove stop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Card Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Photo */}
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

            {/* Bottom Meta: Cost & Note Button */}
            <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/30 text-xs text-on-surface-variant">
              {/* Cost estimate (inline editable in edit mode) */}
              <div className="flex items-center gap-2">
                <Receipt className="w-3.5 h-3.5 text-secondary" />
                <span className="text-[#54381d] font-semibold text-xs">Cost est:</span>
                <AnimatePresence mode="wait">
                  {isEditMode ? (
                    <motion.div
                      key="edit-cost"
                      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-1"
                    >
                      <span className="text-xs font-semibold text-[#54381d]">$</span>
                      <input
                        type="number"
                        value={costInput}
                        onChange={(e) => setCostInput(e.target.value)}
                        onBlur={handleCostBlur}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCostBlur();
                        }}
                        className="w-20 px-2 py-0.5 bg-[#f8f3ed] rounded-lg border border-[#d3c4b9]/50 font-semibold text-[#54381d] text-xs focus:outline-none focus:ring-1 focus:ring-[#6e4f32]"
                        placeholder="0"
                      />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="view-cost"
                      initial={shouldReduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="text-primary-container font-semibold"
                    >
                      {activity.estimatedCost > 0
                        ? `~$${activity.estimatedCost.toLocaleString()} est.`
                        : "Free entry"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Add / Edit Note Button (hidden in readOnly mode) */}
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => setIsEditingNote(!isEditingNote)}
                  className="text-secondary hover:text-primary text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>{activity.note ? "Edit Note" : "Add Note"}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrapbook Floating Sticky Note */}
        {(activity.note || (!readOnly && isEditingNote)) && (
          <div className="mt-4 sm:mt-0 sm:absolute -right-3 -bottom-5 w-full sm:w-64 z-20">
            <StickyNote
              note={activity.note || ""}
              title="AI Discovery"
              defaultColor={activity.noteColor || "#fdfbf7"}
              isAiNote={true}
              isEditable={!readOnly && (isEditMode || isEditingNote)}
              onUpdateNote={(newText) => onUpdateNote?.(activity.id, newText, activity.noteColor)}
              onUpdateColor={(newColor) => onUpdateNote?.(activity.id, activity.note || "", newColor)}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
