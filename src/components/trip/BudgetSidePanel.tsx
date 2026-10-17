"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  PieChart,
  PenTool,
  Clock,
  Compass,
  Plus,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";
import { Trip } from "@/types/trip";
import { easing } from "@/lib/motion";

// Smoothly counts up/down whenever the numeric value changes
function AnimatedValue({ value, prefix = "$" }: { value: number; prefix?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(value);
  const springVal = useSpring(motionVal, { stiffness: 90, damping: 18 });

  useEffect(() => {
    if (shouldReduceMotion) {
      if (ref.current) ref.current.textContent = `${prefix}${value.toLocaleString()}`;
      return;
    }

    const unsub = springVal.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${prefix}${Math.round(v).toLocaleString()}`;
    });

    const ctrl = animate(motionVal, value, {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    });

    return () => {
      ctrl.stop?.();
      unsub();
    };
  }, [value, prefix, shouldReduceMotion, motionVal, springVal]);

  return <span ref={ref}>{prefix}{value.toLocaleString()}</span>;
}

interface BudgetSidePanelProps {
  trip: Trip;
  onOpenBudgetTab?: () => void;
}

export function BudgetSidePanel({
  trip,
  onOpenBudgetTab,
}: BudgetSidePanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedDay, setSelectedDay] = useState(1);

  const budget = trip.budget || {
    stay: 35000,
    transport: 18000,
    activities: 15000,
    food: 22000,
    misc: 5000,
  };

  const totalSpent =
    budget.stay +
    budget.transport +
    budget.activities +
    budget.food +
    (budget.misc || 0);

  const maxBudget = trip.totalBudget || 95000;
  const bufferLeft = Math.max(0, maxBudget - totalSpent);
  const percentAllocated = Math.min(100, Math.round((totalSpent / maxBudget) * 100));

  // Compute percentages for the stacked bar
  const stayPct = totalSpent ? (budget.stay / totalSpent) * 100 : 40;
  const transPct = totalSpent ? (budget.transport / totalSpent) * 100 : 20;
  const actPct = totalSpent ? (budget.activities / totalSpent) * 100 : 20;
  const foodPct = totalSpent ? (budget.food / totalSpent) * 100 : 20;

  const daysCount = trip.days?.length || 5;
  const isOverBudget = totalSpent > maxBudget;
  const overAmount = isOverBudget ? totalSpent - maxBudget : 0;

  return (
    <aside className="lg:col-span-4 flex flex-col space-y-6 lg:sticky lg:top-36">
      {/* SIDE CARD 1: LIVE BUDGET BREAKDOWN */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
              Financial Overview
            </span>
            <h3 className="font-serif text-lg font-medium text-primary">
              Live Budget Planner
            </h3>
          </div>
          <span className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
            <PieChart className="w-4 h-4" />
          </span>
        </div>

        {/* Over-budget advisory banner */}
        <AnimatePresence>
          {isOverBudget && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.35, ease: easing }}
              className="p-3.5 rounded-xl bg-[#f5ede4] border border-[#d3c4b9]/70 flex flex-col space-y-1 mb-4 transition-all shadow-2xs overflow-hidden"
              id="budget-advisory-box"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">warning</span>
                  You&apos;re <AnimatedValue value={overAmount} /> over budget
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary text-[10px] font-bold">
                  Live Draft
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Total planned spend is ${totalSpent.toLocaleString()} against your ${maxBudget.toLocaleString()} cap. Consider swapping high-cost activities.
              </p>
              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onOpenBudgetTab}
                  className="text-xs font-semibold text-primary underline underline-offset-2 hover:text-secondary flex items-center gap-0.5 cursor-pointer"
                >
                  <span>See ways to save</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Total Ring / Bar Indicator */}
        <div className="space-y-2 mb-4 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl text-primary font-bold">
              <AnimatedValue value={totalSpent} />
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              of ${maxBudget.toLocaleString()} max
            </span>
          </div>

          {/* Stacked Budget Bar Chart — animated on mount */}
          <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden flex shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stayPct}%` }}
              transition={{ duration: 0.7, delay: 0.05, ease: easing }}
              className="bg-primary-container"
              title={`Hotels: ${stayPct.toFixed(0)}%`}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${transPct}%` }}
              transition={{ duration: 0.7, delay: 0.18, ease: easing }}
              className="bg-secondary"
              title={`Transport: ${transPct.toFixed(0)}%`}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${actPct}%` }}
              transition={{ duration: 0.7, delay: 0.30, ease: easing }}
              className="bg-tertiary"
              title={`Activities: ${actPct.toFixed(0)}%`}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${foodPct}%` }}
              transition={{ duration: 0.7, delay: 0.42, ease: easing }}
              className="bg-primary-fixed-dim"
              title={`Dining & Food: ${foodPct.toFixed(0)}%`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-secondary pt-0.5">
            <span className="font-semibold">{percentAllocated}% allocated ({daysCount} Days)</span>
            {isOverBudget ? (
              <span className="text-primary font-bold bg-[#dec1a9]/50 px-2 py-0.5 rounded-full">
                + ${overAmount.toLocaleString()} overage
              </span>
            ) : bufferLeft > 0 ? (
              <span className="text-primary font-semibold text-emerald-800 bg-secondary-container/50 px-2 py-0.5 rounded-full">
                +<AnimatedValue value={bufferLeft} /> buffer left
              </span>
            ) : null}
          </div>
        </div>

        {/* Category Breakdown List */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-outline-variant/15">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
              <span className="text-on-surface-variant font-medium">
                Boutique Stays ({daysCount} nights)
              </span>
            </div>
            <span className="font-bold text-on-surface">
              <AnimatedValue value={budget.stay} />
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-outline-variant/15">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              <span className="text-on-surface-variant font-medium">
                Transport & Transit
              </span>
            </div>
            <span className="font-bold text-on-surface">
              <AnimatedValue value={budget.transport} />
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-outline-variant/15">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
              <span className="text-on-surface-variant font-medium">
                Activities & Experiences
              </span>
            </div>
            <span className="font-bold text-on-surface">
              <AnimatedValue value={budget.activities} />
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim" />
              <span className="text-on-surface-variant font-medium">
                Dining, Food & Cafes
              </span>
            </div>
            <span className="font-bold text-on-surface">
              <AnimatedValue value={budget.food} />
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenBudgetTab}
          className="w-full mt-4 py-2 text-center rounded-full border border-outline-variant hover:bg-surface-container text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
        >
          Detailed Cost Spreadsheet
        </button>
      </div>

      {/* SIDE CARD 2: DAY ROUTE MAP PREVIEW WITH DAY SELECTOR */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
              Route Geography
            </span>
            <h3 className="font-serif text-lg font-medium text-primary">
              Day {selectedDay} Trail Map
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-[11px] font-semibold text-tertiary">
            ~14.2 km total
          </span>
        </div>

        {/* Day Switcher Pills */}
        <div className="flex items-center justify-between gap-1 bg-surface-container-low p-1 rounded-full border border-outline-variant/20">
          {Array.from({ length: daysCount }).map((_, i) => {
            const d = i + 1;
            const isActive = selectedDay === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDay(d)}
                className={`flex-1 py-1 text-center text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  isActive
                    ? "bg-surface text-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                D{d}
              </button>
            );
          })}
        </div>

        {/* Static Map Preview with Interactive Marker Overlays */}
        <div className="relative w-full h-52 rounded-xl overflow-hidden shadow-inner group bg-surface-container-highest">
          <Image
            src="https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?auto=format&fit=crop&w=600&q=80"
            alt="Route map satellite preview"
            fill
            sizes="360px"
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
          />

          {/* Stylized Overlay */}
          <div className="absolute inset-0 bg-primary-container/10 pointer-events-none" />

          {/* Map Pin 1 */}
          <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/pin">
            <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[11px] shadow-lg ring-2 ring-surface">
              1
            </div>
            <span className="px-2 py-0.5 mt-1 rounded bg-surface/90 text-[10px] font-semibold text-primary shadow-xs opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap">
              Stop 1
            </span>
          </div>

          {/* Dashed Path SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 85 75 Q 140 100 170 120 T 260 90"
              fill="none"
              stroke="#6e4f32"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeWidth="2.5"
            />
          </svg>

          {/* Map Pin 2 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/pin">
            <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-[11px] shadow-lg ring-2 ring-surface">
              2
            </div>
            <span className="px-2 py-0.5 mt-1 rounded bg-surface/90 text-[10px] font-semibold text-primary shadow-xs opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap">
              Stop 2
            </span>
          </div>

          {/* Map Pin 3 */}
          <div className="absolute top-1/3 right-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/pin">
            <div className="w-6 h-6 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-bold text-[11px] shadow-lg ring-2 ring-surface">
              3
            </div>
            <span className="px-2 py-0.5 mt-1 rounded bg-surface/90 text-[10px] font-semibold text-primary shadow-xs opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap">
              Stop 3
            </span>
          </div>

          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-1 rounded bg-surface/90 backdrop-blur-md text-[10px] font-semibold text-tertiary flex items-center gap-1 shadow-xs">
              <Clock className="w-3 h-3 text-secondary" /> 28 min transit
            </span>
          </div>
        </div>

        <button
          type="button"
          className="w-full py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Open High-Res Navigation Trail</span>
        </button>
      </div>

      {/* SIDE CARD 3: SCRAPBOOK EDITORIAL TOOLS */}
      <div className="bg-[#f7f2ec] rounded-2xl p-4 border border-outline-variant/40 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-primary font-serif">
          <PenTool className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm">Scrapbook Accents</span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed font-light">
          Personalize your journal with vintage stamps, Polaroid borders, and custom dining receipts before export.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-primary text-[11px] font-semibold shadow-xs hover:bg-surface flex items-center gap-1 cursor-pointer border border-outline-variant/30"
          >
            <Plus className="w-3 h-3" /> Sticky Note
          </button>
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-primary text-[11px] font-semibold shadow-xs hover:bg-surface flex items-center gap-1 cursor-pointer border border-outline-variant/30"
          >
            <Plus className="w-3 h-3" /> Add Photo
          </button>
        </div>
      </div>
    </aside>
  );
}
