"use client";

import { useState, useRef } from "react";
import { Pin, PlusCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Day } from "@/types/trip";
import { easing } from "@/lib/motion";
import { ActivityCard } from "./ActivityCard";
import { StayCard } from "./StayCard";

interface DayTimelineProps {
  days: Day[];
}

// Single day section with scroll-driven timeline line drawing and collapsible height
function DaySection({
  day,
  dayIndex,
  isCollapsed,
  onToggleCollapse,
}: {
  day: Day;
  dayIndex: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 55%"],
  });

  // Timeline line draws down as user scrolls
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.section
      id={`day-${day.dayNumber}-section`}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: dayIndex * 0.04, ease: easing }}
      className={`flex flex-col space-y-6 ${
        dayIndex > 0 ? "pt-10 border-t border-outline-variant/40" : ""
      }`}
    >
      {/* Day Header Row with Title, Toggle and Scrapbook Note */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            {/* Pop-in Dot */}
            <motion.span
              initial={shouldReduceMotion ? false : { scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 450, damping: 20, delay: 0.1 }
              }
              className="inline-block w-2.5 h-2.5 rounded-full bg-primary-container shrink-0"
            />
            <div className="flex items-center gap-2 text-xs text-secondary uppercase tracking-widest font-bold">
              <span>
                Day {day.dayNumber} {day.date ? `· ${day.date}` : ""}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-secondary transition-transform duration-300 ${
                  isCollapsed ? "-rotate-90 text-tertiary" : "rotate-0"
                }`}
              />
              <span className="text-[10px] text-tertiary font-normal lowercase opacity-70 group-hover:opacity-100 transition-opacity">
                ({isCollapsed ? "click to expand" : "click to collapse"})
              </span>
            </div>
          </button>

          <h2
            onClick={onToggleCollapse}
            className="font-serif text-2xl sm:text-3xl text-primary font-medium mt-1 cursor-pointer hover:text-secondary transition-colors"
          >
            {day.title}
          </h2>

          {day.localTransport && day.localTransport.length > 0 && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[11px] text-outline uppercase font-semibold">
                Transit:
              </span>
              {day.localTransport.map((trans, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-secondary font-medium border border-outline-variant/30"
                >
                  {trans}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Freeform Day Sticky Note (slight rotation, straightens a little on hover) */}
        {day.notes && (
          <motion.div
            initial={{ rotate: 1.5 }}
            whileHover={
              shouldReduceMotion
                ? undefined
                : { rotate: -0.5, scale: 1.02, transition: { duration: 0.25, ease: easing } }
            }
            className="relative w-full sm:w-64 bg-surface-container-low p-3.5 sm:p-4 rounded-md shadow-md border border-[#bba591]/30 self-start cursor-pointer"
          >
            {/* Washi tape strip */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-outline-variant/60 rounded-xs backdrop-blur-[1px] rotate-[-1deg] opacity-75 shadow-xs pointer-events-none" />
            <div className="flex items-center justify-between text-on-surface-variant mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-secondary">
                Traveler&apos;s Memo
              </span>
              <Pin className="w-3.5 h-3.5 text-secondary" />
            </div>
            <p className="font-handwriting text-base leading-snug text-tertiary">
              &ldquo;{day.notes}&rdquo;
            </p>
          </motion.div>
        )}
      </div>

      {/* Collapse and Expand of a day with animated height */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key={`activities-content-${day.dayNumber}`}
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: easing }}
            className="overflow-hidden"
          >
            {/* Timeline Cards Container with Left Connecting Line */}
            <div ref={timelineRef} className="relative pl-6 md:pl-10 space-y-6 pt-2 pb-2">
              {/* Background Guide Line */}
              <div className="absolute left-3 md:left-4 top-3 bottom-6 w-[2px] bg-outline-variant/40" />

              {/* Animated Drawing Line on scroll */}
              <motion.div
                style={{
                  scaleY: shouldReduceMotion ? 1 : scaleY,
                  originY: 0,
                }}
                className="absolute left-3 md:left-4 top-3 bottom-6 w-[2px] bg-primary-container z-0"
              />

              {/* Activities */}
              {day.activities.map((activity, actIdx) => (
                <ActivityCard
                  key={activity.id || `act-${day.dayNumber}-${actIdx}`}
                  activity={activity}
                  index={actIdx + 1}
                />
              ))}

              {/* Tonight's Stay */}
              {day.stay && (
                <div className="pt-2">
                  <StayCard stay={day.stay} dayNumber={day.dayNumber} />
                </div>
              )}

              {/* Add Activity Button (Visual only) */}
              <button
                type="button"
                className="w-full py-3.5 rounded-2xl border-2 border-dashed border-outline-variant/80 hover:border-primary text-secondary hover:text-primary bg-surface/40 hover:bg-surface-container-low transition-all flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer group"
              >
                <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Add Custom Stop or Note to Day {day.dayNumber}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export function DayTimeline({ days }: DayTimelineProps) {
  const [collapsedDays, setCollapsedDays] = useState<Record<number, boolean>>({});

  const toggleDay = (dayNum: number) => {
    setCollapsedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  if (!days || days.length === 0) {
    return (
      <div className="p-8 text-center text-on-surface-variant bg-surface-container-low rounded-2xl border border-outline-variant/30">
        No itinerary days scheduled yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-12">
      {days.map((day, dayIndex) => (
        <DaySection
          key={day.id || `day-${day.dayNumber}`}
          day={day}
          dayIndex={dayIndex}
          isCollapsed={!!collapsedDays[day.dayNumber]}
          onToggleCollapse={() => toggleDay(day.dayNumber)}
        />
      ))}
    </div>
  );
}
