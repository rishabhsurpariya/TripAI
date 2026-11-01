"use client";

import { useState, useRef } from "react";
import { Pin, PlusCircle, ChevronDown } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Day, Activity, Trip } from "@/types/trip";
import { easing } from "@/lib/motion";
import { useTripStore } from "@/store/tripStore";
import { ActivityCard } from "./ActivityCard";
import { StayCard } from "./StayCard";
import { AffiliateDisclosure } from "./BookingButton";

interface DayTimelineProps {
  days: Day[];
  currency?: string;
  onOpenAddDrawer?: (dayNumber: number) => void;
  onOpenHotelDrawer?: (dayNumber: number) => void;
  onToast?: (message: string, action?: { label: string; onClick: () => void }) => void;
  readOnly?: boolean;
  trip?: Trip;
}

// Traveler's memo sticky note with color choice in edit mode
function DayStickyMemo({
  notes,
  isEditMode,
  onSave,
}: {
  notes: string;
  isEditMode: boolean;
  onSave: (note: string) => void;
}) {
  const [color, setColor] = useState("#fdfbf7");
  const [text, setText] = useState(notes);

  const colors = [
    { name: "Pale Cream", hex: "#fdfbf7" },
    { name: "Soft Sand", hex: "#d9c9ba" },
    { name: "Light Taupe", hex: "#bba591" },
    { name: "Muted Warmth", hex: "#ece3da" },
  ];

  return (
    <div
      style={{ backgroundColor: color }}
      className="relative w-full sm:w-64 p-3.5 sm:p-4 rounded-md shadow-md border border-[#bba591]/30 self-start transition-all transform sm:rotate-1 hover:rotate-0"
    >
      {/* Washi tape strip */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-outline-variant/60 rounded-xs backdrop-blur-[1px] rotate-[-1deg] opacity-75 shadow-xs pointer-events-none" />
      <div className="flex items-center justify-between text-on-surface-variant mb-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-secondary">
          Traveler&apos;s Memo
        </span>
        {isEditMode ? (
          <div className="flex items-center gap-1">
            {colors.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                className={`w-3.5 h-3.5 rounded-full border border-outline-variant/60 cursor-pointer ${
                  color === c.hex ? "ring-1 ring-primary" : ""
                }`}
                title={c.name}
              />
            ))}
          </div>
        ) : (
          <Pin className="w-3.5 h-3.5 text-secondary" />
        )}
      </div>

      {isEditMode ? (
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onSave(e.target.value);
          }}
          placeholder="Add memo for this day..."
          rows={3}
          className="w-full bg-transparent border-0 font-handwriting text-lg leading-snug text-tertiary focus:outline-none resize-none placeholder:text-outline/60"
        />
      ) : (
        <p className="font-handwriting text-base leading-snug text-tertiary">
          &ldquo;{notes}&rdquo;
        </p>
      )}
    </div>
  );
}

// Sortable item wrapper for each activity card
function SortableActivityItem({
  activity,
  index,
  dayNumber,
  allDayNumbers,
  isEditMode,
  currency = "INR",
  onDelete,
  onDuplicate,
  onMoveToDay,
  onUpdateDuration,
  onUpdateCost,
  onUpdateTimeSlot,
  onUpdateNote,
  readOnly = false,
}: {
  activity: Activity;
  index: number;
  dayNumber: number;
  allDayNumbers: number[];
  isEditMode: boolean;
  currency?: string;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMoveToDay: (id: string, targetDayNumber: number) => void;
  onUpdateDuration: (id: string, mins: number) => void;
  onUpdateCost: (id: string, cost: number) => void;
  onUpdateTimeSlot: (id: string, slot: string) => void;
  onUpdateNote: (id: string, note: string, color?: string) => void;
  readOnly?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id, disabled: readOnly });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ActivityCard
        activity={activity}
        index={index}
        dayNumber={dayNumber}
        allDayNumbers={allDayNumbers}
        isEditMode={isEditMode && !readOnly}
        isDragging={isDragging}
        readOnly={readOnly}
        currency={currency}
        dragHandleProps={{ ...attributes, ...listeners }}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onMoveToDay={onMoveToDay}
        onUpdateDuration={onUpdateDuration}
        onUpdateCost={onUpdateCost}
        onUpdateTimeSlot={onUpdateTimeSlot}
        onUpdateNote={onUpdateNote}
      />
    </div>
  );
}

// Single day section with scroll-driven timeline line drawing and collapsible height
function DaySection({
  day,
  dayIndex,
  allDayNumbers,
  isCollapsed,
  isEditMode,
  isDraggingActive,
  onToggleCollapse,
  onOpenAddDrawer,
  onOpenHotelDrawer,
  onDeleteActivity,
  onDuplicateActivity,
  onMoveToDay,
  onUpdateDuration,
  onUpdateCost,
  onUpdateTimeSlot,
  onUpdateNote,
  onSaveDayNotes,
  readOnly = false,
  currency,
  trip,
}: {
  day: Day;
  dayIndex: number;
  allDayNumbers: number[];
  isCollapsed: boolean;
  isEditMode: boolean;
  isDraggingActive: boolean;
  currency?: string;
  trip?: Trip;
  onToggleCollapse: () => void;
  onOpenAddDrawer?: (dayNumber: number) => void;
  onOpenHotelDrawer?: (dayNumber: number) => void;
  onToast?: (message: string) => void;
  onDeleteActivity: (act: Activity, dayNum: number, index: number) => void;
  onDuplicateActivity: (dayNum: number, actId: string) => void;
  onMoveToDay: (fromDayNum: number, actId: string, toDayNum: number) => void;
  onUpdateDuration: (dayNum: number, actId: string, mins: number) => void;
  onUpdateCost: (dayNum: number, actId: string, cost: number) => void;
  onUpdateTimeSlot: (dayNum: number, actId: string, slot: string) => void;
  onUpdateNote: (dayNum: number, actId: string, note: string, color?: string) => void;
  onSaveDayNotes: (dayNum: number, note: string) => void;
  readOnly?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [warningDismissed, setWarningDismissed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 55%"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Drop target registration for the day
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `day-${day.dayNumber}`,
  });

  const hasPacingWarning = day.activities.length > 5 && !warningDismissed;

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
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-semibold text-secondary ml-1 lowercase">
                {day.activities.length} Stops
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-secondary transition-transform duration-300 ${
                  isCollapsed ? "-rotate-90 text-tertiary" : "rotate-0"
                }`}
              />
            </div>
          </button>

          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h2
              onClick={onToggleCollapse}
              className="font-serif text-2xl sm:text-3xl text-primary font-medium cursor-pointer hover:text-secondary transition-colors"
            >
              {day.title}
            </h2>
          </div>

        </div>

        {/* Freeform Day Sticky Note */}
        {(day.notes || isEditMode) && (
          <DayStickyMemo
            notes={day.notes || ""}
            isEditMode={isEditMode}
            onSave={(note) => onSaveDayNotes(day.dayNumber, note)}
          />
        )}
      </div>

      {/* Pacing Warning: when day has > 5 activities */}
      <AnimatePresence>
        {hasPacingWarning && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.3, ease: easing }}
            className="overflow-hidden"
          >
            <div
              className="p-3.5 rounded-xl bg-[#f5ede4] border border-[#d3c4b9]/70 flex items-center justify-between gap-3 text-secondary text-xs shadow-2xs"
              id={`warning-packed-day${day.dayNumber}`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                  schedule
                </span>
                <span>
                  <strong>Itinerary Pacing Warning:</strong> Day {day.dayNumber} looks very packed ({day.activities.length} activities). Consider moving a stop to another day for a more relaxed tempo.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setWarningDismissed(true)}
                className="text-secondary hover:text-primary p-1 rounded-full hover:bg-surface-container cursor-pointer shrink-0"
                title="Dismiss notice"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            {/* Droppable timeline container */}
            <div
              ref={(node) => {
                timelineRef.current = node;
                setDroppableRef(node);
              }}
              className={`relative pl-6 md:pl-10 space-y-6 pt-2 pb-2 rounded-2xl transition-all ${
                isOver ? "bg-surface-container-low/30 ring-2 ring-primary/30" : ""
              }`}
            >
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

              {/* Sortable Activities list with Add/Remove and Layout animations */}
              <SortableContext
                items={day.activities.map((a) => a.id)}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {day.activities.map((activity, actIdx) => (
                    <motion.div
                      key={activity.id || `act-${day.dayNumber}-${actIdx}`}
                      layout={!shouldReduceMotion ? "position" : false}
                      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: 18 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              scale: 0.85,
                              y: -12,
                              transition: { duration: 0.22, ease: easing },
                            }
                      }
                      transition={{
                        duration: 0.3,
                        ease: easing,
                        layout: { duration: 0.28, ease: easing },
                      }}
                    >
                      <SortableActivityItem
                        activity={activity}
                        index={actIdx + 1}
                        dayNumber={day.dayNumber}
                        allDayNumbers={allDayNumbers}
                        isEditMode={isEditMode}
                        readOnly={readOnly}
                        currency={currency}
                        onDelete={() => onDeleteActivity(activity, day.dayNumber, actIdx)}
                        onDuplicate={() => onDuplicateActivity(day.dayNumber, activity.id)}
                        onMoveToDay={(_id, targetDay) =>
                          onMoveToDay(day.dayNumber, activity.id, targetDay)
                        }
                        onUpdateDuration={(_id, mins) =>
                          onUpdateDuration(day.dayNumber, activity.id, mins)
                        }
                        onUpdateCost={(_id, cost) =>
                          onUpdateCost(day.dayNumber, activity.id, cost)
                        }
                        onUpdateTimeSlot={(_id, slot) =>
                          onUpdateTimeSlot(day.dayNumber, activity.id, slot)
                        }
                        onUpdateNote={(_id, note, color) =>
                          onUpdateNote(day.dayNumber, activity.id, note, color)
                        }
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </SortableContext>

              {/* Drop Target Slot when dragging is active */}
              {isEditMode && isDraggingActive && !readOnly && (
                <div
                  className="p-4 rounded-2xl border-2 border-dashed border-[#bba591] bg-surface-container-low/60 text-center text-secondary text-xs font-semibold flex items-center justify-center gap-2 shadow-inner"
                  id={`drop-target-slot-day-${day.dayNumber}`}
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    move_to_inbox
                  </span>
                  <span>Drop activity here to move to Day {day.dayNumber}</span>
                </div>
              )}

              {/* Tonight's Stay */}
              {day.stay && (
                <div className="pt-2">
                  <StayCard
                    stay={day.stay}
                    dayNumber={day.dayNumber}
                    currency={currency}
                    readOnly={readOnly}
                    trip={trip}
                    isEditMode={isEditMode}
                    onChangeHotel={readOnly ? undefined : () => onOpenHotelDrawer?.(day.dayNumber)}
                  />
                </div>
              )}

              {/* Add Activity Button (hidden in readOnly) */}
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => onOpenAddDrawer?.(day.dayNumber)}
                  className="w-full py-3.5 rounded-2xl border-2 border-dashed border-outline-variant/80 hover:border-primary text-secondary hover:text-primary bg-surface/40 hover:bg-surface-container-low transition-all flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer group"
                >
                  <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Add Custom Stop or Note to Day {day.dayNumber}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export function DayTimeline({
  days,
  currency = "INR",
  onOpenAddDrawer,
  onOpenHotelDrawer,
  onToast,
  readOnly = false,
  trip,
}: DayTimelineProps) {
  const storeTrip = useTripStore((state) => state.currentTrip);
  const activeTrip = trip || storeTrip || undefined;
  const [collapsedDays, setCollapsedDays] = useState<Record<number, boolean>>({});
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const storeEditMode = useTripStore((state) => state.isEditMode);
  const isEditMode = !readOnly && storeEditMode;
  const reorderActivities = useTripStore((state) => state.reorderActivities);
  const moveActivityBetweenDays = useTripStore((state) => state.moveActivityBetweenDays);
  const removeActivity = useTripStore((state) => state.removeActivity);
  const restoreActivity = useTripStore((state) => state.restoreActivity);
  const duplicateActivity = useTripStore((state) => state.duplicateActivity);
  const updateActivity = useTripStore((state) => state.updateActivity);
  const updateDayNotes = useTripStore((state) => state.updateDayNotes);
  const updateActivityNote = useTripStore((state) => state.updateActivityNote);

  const allDayNumbers = days.map((d) => d.dayNumber);

  // Setup dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleDay = (dayNum: number) => {
    setCollapsedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Source day contains activeId
    const sourceDay = days.find((d) => d.activities.some((a) => a.id === activeId));
    if (!sourceDay) return;

    // Target could be a day droppable (day-1, day-2, ...) or an activity in a day
    let targetDay = days.find((d) => `day-${d.dayNumber}` === overId);
    let targetIndex = targetDay ? targetDay.activities.length : -1;

    if (!targetDay) {
      targetDay = days.find((d) => d.activities.some((a) => a.id === overId));
      if (targetDay) {
        targetIndex = targetDay.activities.findIndex((a) => a.id === overId);
      }
    }

    if (!targetDay) return;

    if (sourceDay.dayNumber === targetDay.dayNumber) {
      // Reordering within same day
      const sourceIndex = sourceDay.activities.findIndex((a) => a.id === activeId);
      if (sourceIndex !== -1 && targetIndex !== -1 && sourceIndex !== targetIndex) {
        reorderActivities(sourceDay.dayNumber, sourceIndex, targetIndex);
        onToast?.("Activities reordered");
      }
    } else {
      // Moving between days
      moveActivityBetweenDays(
        sourceDay.dayNumber,
        targetDay.dayNumber,
        activeId,
        targetIndex >= 0 ? targetIndex : undefined
      );
      onToast?.(`Moved activity to Day ${targetDay.dayNumber}`);
    }
  };

  const handleDeleteActivity = (act: Activity, dayNum: number, index: number) => {
    removeActivity(dayNum, act.id);
    onToast?.(`Removed "${act.name}"`, {
      label: "Undo",
      onClick: () => {
        restoreActivity(dayNum, act, index);
        onToast?.(`Restored "${act.name}"`);
      },
    });
  };

  const handleDuplicateActivity = (dayNum: number, actId: string) => {
    duplicateActivity(dayNum, actId);
    onToast?.("Activity duplicated");
  };

  const handleMoveToDay = (fromDayNum: number, actId: string, toDayNum: number) => {
    moveActivityBetweenDays(fromDayNum, toDayNum, actId);
    onToast?.(`Moved activity to Day ${toDayNum}`);
  };

  const handleUpdateDuration = (dayNum: number, actId: string, mins: number) => {
    updateActivity(dayNum, actId, { durationMinutes: mins });
  };

  const handleUpdateCost = (dayNum: number, actId: string, cost: number) => {
    updateActivity(dayNum, actId, { estimatedCost: cost });
  };

  const handleUpdateTimeSlot = (dayNum: number, actId: string, slot: string) => {
    updateActivity(dayNum, actId, { timeSlot: slot });
  };

  const handleUpdateNote = (
    dayNum: number,
    actId: string,
    note: string,
    color?: string
  ) => {
    updateActivityNote(dayNum, actId, note, color);
  };

  // Find dragged activity for DragOverlay
  let draggedActivity: Activity | null = null;
  if (activeDragId) {
    for (const d of days) {
      const found = d.activities.find((a) => a.id === activeDragId);
      if (found) {
        draggedActivity = found;
        break;
      }
    }
  }

  if (!days || days.length === 0) {
    return (
      <div className="p-8 text-center text-on-surface-variant bg-surface-container-low rounded-2xl border border-outline-variant/30">
        No itinerary days scheduled yet.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveDragId(null)}
    >
      <div className="flex flex-col space-y-12">
        {days.map((day, dayIndex) => (
          <DaySection
            key={day.id || `day-${day.dayNumber}`}
            day={day}
            dayIndex={dayIndex}
            allDayNumbers={allDayNumbers}
            isCollapsed={!!collapsedDays[day.dayNumber]}
            isEditMode={isEditMode}
            isDraggingActive={Boolean(activeDragId)}
            currency={currency}
            onToggleCollapse={() => toggleDay(day.dayNumber)}
            onOpenAddDrawer={onOpenAddDrawer}
            onOpenHotelDrawer={onOpenHotelDrawer}
            onDeleteActivity={handleDeleteActivity}
            onDuplicateActivity={handleDuplicateActivity}
            onMoveToDay={handleMoveToDay}
            onUpdateDuration={handleUpdateDuration}
            onUpdateCost={handleUpdateCost}
            onUpdateTimeSlot={handleUpdateTimeSlot}
            onUpdateNote={handleUpdateNote}
            onSaveDayNotes={(dayNum, note) => updateDayNotes(dayNum, note)}
            readOnly={readOnly}
            trip={activeTrip}
          />
        ))}
      </div>

      {/* Outbound Booking Disclosure */}
      <div className="pt-4 pb-1 text-center">
        <AffiliateDisclosure />
      </div>

      {/* Drag Overlay with Stitch Design lifted and tilted dragging state */}
      <DragOverlay
        dropAnimation={{
          duration: 250,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {draggedActivity ? (
          <motion.div
            initial={shouldReduceMotion ? false : { scale: 1, rotate: 0 }}
            animate={
              shouldReduceMotion
                ? false
                : {
                    scale: 1.035,
                    rotate: 2,
                  }
            }
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className="shadow-[0_28px_50px_-10px_rgba(110,79,50,0.28)] border-2 border-[#6e4f32] rounded-2xl bg-surface-container-lowest overflow-hidden cursor-grabbing"
          >
            <ActivityCard
              activity={draggedActivity}
              index={1}
              isDragging={true}
            />
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
