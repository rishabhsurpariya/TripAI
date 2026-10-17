"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  DollarSign,
  Shield,
  RotateCw,
  Sparkles,
  Bookmark,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { easing } from "@/lib/motion";

interface StepConfig {
  id: number;
  label: string;
  activeStatus: string;
  completedStatus: string;
}

const STEPS: StepConfig[] = [
  {
    id: 1,
    label: "Finding the best way to get there",
    activeStatus: "Searching flights & transit...",
    completedStatus: "Synced",
  },
  {
    id: 2,
    label: "Planning your day-by-day itinerary",
    activeStatus: "Building...",
    completedStatus: "Curated",
  },
  {
    id: 3,
    label: "Picking hotels near each day's spots",
    activeStatus: "Matching stays...",
    completedStatus: "Selected",
  },
  {
    id: 4,
    label: "Estimating local transport",
    activeStatus: "Calculating routes...",
    completedStatus: "Mapped",
  },
  {
    id: 5,
    label: "Balancing your budget",
    activeStatus: "Finalizing ledger...",
    completedStatus: "Balanced",
  },
];

const TIPS = [
  "Tip: Book trains 60 days ahead for the best fares & panoramic window seats.",
  "Tip: Early mornings in Arashiyama bamboo grove offer serene, uncrowded paths.",
  "Tip: Keeping an offline digital transit card speeds up local subway hopping.",
];

// Animated Checkmark: draws itself with an SVG path when completed
function AnimatedCheck({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
  return (
    <div className="w-6 h-6 rounded-full bg-[#8c6e52] text-white flex items-center justify-center shadow-xs shrink-0">
      <svg
        className="w-3.5 h-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M20 6L9 17L4 12"
          initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.38, ease: "easeOut" }
          }
        />
      </svg>
    </div>
  );
}

function GeneratingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  // Read submitted form values from query parameters
  const destination = searchParams.get("destination") || "Kyoto";
  const days = searchParams.get("days") || "5";
  const budgetParam = searchParams.get("budget") || "2500";
  const style = searchParams.get("style") || "comfort";
  const travelers = searchParams.get("travelers") || "2";
  const startCity = searchParams.get("startCity") || "";

  // Format budget display
  const numericBudget = parseInt(budgetParam.replace(/[^0-9]/g, ""), 10) || 2500;
  const formattedBudget = `$${numericBudget.toLocaleString()}`;

  // State variant: 'progress' | 'slow' | 'error'
  const queryState = searchParams.get("state");
  const [internalState, setInternalState] = useState<"progress" | "slow" | "error" | null>(null);
  const activeState: "progress" | "slow" | "error" =
    internalState ??
    (queryState === "slow" ? "slow" : queryState === "error" ? "error" : "progress");
  const setActiveState = setInternalState;

  // Simulation state
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0 to 4
  const [progressPercent, setProgressPercent] = useState(18);
  const [isDone, setIsDone] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  // Rotate tips every 6 seconds
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 6000);
    return () => clearInterval(tipInterval);
  }, []);

  // Clear all running simulation timeouts
  const clearTimers = () => {
    timerRef.current.forEach((t) => clearTimeout(t));
    timerRef.current = [];
  };

  // Start 8-second generation simulation
  const startSimulation = () => {
    clearTimers();
    setIsDone(false);
    setCurrentStepIndex(0);
    setProgressPercent(18);

    // TODO: Replace simulation timer with real AI generation call (e.g. streaming LLM endpoint or SSE generating transport, itinerary, hotels, budget in stages)
    const t1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setProgressPercent(38);
    }, 1600);

    const t2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setProgressPercent(58);
    }, 3200);

    const t3 = setTimeout(() => {
      setCurrentStepIndex(3);
      setProgressPercent(78);
    }, 4800);

    const t4 = setTimeout(() => {
      // Step 5 active: keep the last step active until the timer ends
      setCurrentStepIndex(4);
      setProgressPercent(94);
    }, 6400);

    const tEnd = setTimeout(() => {
      // Complete step 5, advance to 100%, and trigger finish transition
      setProgressPercent(100);
      setIsDone(true);
      setTimeout(() => {
        router.push("/trip/sample");
      }, 700);
    }, 8200);

    timerRef.current = [t1, t2, t3, t4, tEnd];
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeState === "progress") {
        startSimulation();
      } else if (activeState === "slow") {
        clearTimers();
        // Simulate slow delay at step 3 with 62% progress and warning notice
        setCurrentStepIndex(2);
        setProgressPercent(62);
        setIsDone(false);
      } else if (activeState === "error") {
        clearTimers();
        setIsDone(false);
      }
    }, 0);

    return () => {
      clearTimeout(timer);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeState]);

  // "Try again" restarts the simulation
  const handleTryAgain = () => {
    setActiveState("progress");
    startSimulation();
  };

  // "Edit my details" returns to /home with values kept
  const handleEditDetails = () => {
    const params = new URLSearchParams({
      destination,
      days,
      budget: numericBudget.toString(),
      style,
      travelers,
      startCity,
    });
    router.push(`/home?${params.toString()}`);
  };

  return (
    <div className="bg-[#f7f2ec] text-[#6e4f32] font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-[#d9c9ba] selection:text-[#6e4f32]">
      {/* Calm Motion & Shimmer Keyframes */}
      <style jsx global>{`
        @keyframes radarPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.15;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.6;
          }
        }
        @keyframes shimmerMove {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        @keyframes flightPath {
          0% {
            stroke-dashoffset: 240;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .animate-radar {
          animation: radarPulse 4s ease-in-out infinite;
        }
        .flight-dash {
          stroke-dasharray: 6 6;
          animation: flightPath 5s linear infinite;
        }
        .shimmer-box {
          position: relative;
          overflow: hidden;
          background-color: #d9c9ba;
        }
        .shimmer-box::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmerMove 1.9s infinite;
          content: "";
        }
        .shimmer-box-delay-1::after {
          animation-delay: 0.25s;
        }
        .shimmer-box-delay-2::after {
          animation-delay: 0.5s;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-radar,
          .flight-dash,
          .shimmer-box::after {
            animation: none !important;
          }
        }
      `}</style>

      {/* ========================================== */}
      {/* 1. MINIMAL NAVBAR (Sticky, Focused, No Distractions) */}
      {/* ========================================== */}
      <header className="w-full bg-[#f7f2ec]/90 backdrop-blur-sm border-b border-[#bba591]/30 sticky top-0 z-30 transition-colors">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: TripAi Brand Wordmark + Minimal Compass Icon */}
          <Link href="/home" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full border border-[#bba591]/40 bg-[#d9c9ba]/30 flex items-center justify-center text-[#6e4f32] group-hover:bg-[#d9c9ba]/60 transition-colors">
              <svg
                className="w-4 h-4 text-[#6e4f32]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polygon
                  points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
                  fill="#8c6e52"
                ></polygon>
              </svg>
            </div>
            <span className="font-serif text-xl tracking-tight font-semibold text-[#6e4f32]">
              TripAi
            </span>
          </Link>

          {/* Right: Discrete Cancel Action */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleEditDetails}
              className="text-xs font-medium text-[#a28973] hover:text-[#6e4f32] transition-colors px-3.5 py-1.5 rounded-full hover:bg-[#d9c9ba]/30 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* 2. MAIN VIEWPORT CENTER STAGE */}
      {/* ========================================== */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-[640px] w-full mx-auto relative z-10">
        {/* ========================================== */}
        {/* STATE A & B: IN PROGRESS / SLOW */}
        {/* ========================================== */}
        {activeState !== "error" && (
          <motion.div
            animate={
              isDone
                ? shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                      scale: [1, 1.015, 0.98],
                      opacity: [1, 1, 0.25],
                      transition: { duration: 0.65, ease: easing },
                    }
                : { opacity: 1, scale: 1 }
            }
            className="w-full flex flex-col items-center text-center transition-all duration-300"
          >
            {/* MOTION ELEMENT: Rotating Compass & Paper Plane Drifting along dotted path */}
            <div className="relative w-28 h-28 mb-5 flex items-center justify-center">
              {/* Radar Ring Pulse Effect */}
              <div className="absolute inset-0 rounded-full border border-[#bba591]/30 bg-[#d9c9ba]/20 animate-radar" />

              {/* Rotating outer compass rose */}
              <motion.svg
                animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { duration: 28, repeat: Infinity, ease: "linear" }
                }
                className="absolute inset-1 w-[104px] h-[104px] text-[#bba591]/40 pointer-events-none"
                viewBox="0 0 100 100"
                fill="none"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeDasharray="2 4"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="0.6"
                ></circle>
                <line
                  x1="50"
                  y1="2"
                  x2="50"
                  y2="8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                ></line>
                <line
                  x1="50"
                  y1="92"
                  x2="50"
                  y2="98"
                  stroke="currentColor"
                  strokeWidth="1.5"
                ></line>
                <line
                  x1="2"
                  y1="50"
                  x2="8"
                  y2="50"
                  stroke="currentColor"
                  strokeWidth="1.5"
                ></line>
                <line
                  x1="92"
                  y1="50"
                  x2="98"
                  y2="50"
                  stroke="currentColor"
                  strokeWidth="1.5"
                ></line>
                <path
                  d="M 20 20 Q 50 10 80 20"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                ></path>
                <path
                  d="M 15 75 Q 50 90 85 75"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                ></path>
              </motion.svg>

              {/* Dynamic Counter-Rotating Astrolabe/Orbit Ring */}
              <motion.svg
                animate={shouldReduceMotion ? undefined : { rotate: -360 }}
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { duration: 38, repeat: Infinity, ease: "linear" }
                }
                className="absolute inset-3 w-[88px] h-[88px] text-[#a28973]/50 pointer-events-none"
                viewBox="0 0 80 80"
                fill="none"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeDasharray="4 6"
                ></circle>
                <circle cx="40" cy="6" r="2.5" fill="#a28973"></circle>
                <circle cx="74" cy="40" r="2.5" fill="#8c6e52"></circle>
              </motion.svg>

              {/* Paper plane dotted airway path loop */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 112 112"
              >
                <path
                  d="M 24 88 C 28 32, 84 32, 88 24"
                  fill="none"
                  stroke="#8c6e52"
                  strokeWidth="1.2"
                  className="flight-dash opacity-70"
                ></path>
              </svg>

              {/* Center Paper Plane: drifting in a loop */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: [0, -6, 2, 0],
                        x: [0, 2.5, -2.5, 0],
                        rotate: [12, 17, 7, 12],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
                className="relative z-10 w-14 h-14 rounded-full bg-white shadow-[0_8px_30px_-4px_rgba(110,79,50,0.06),0_2px_10px_-2px_rgba(110,79,50,0.04)] border border-[#d9c9ba] flex items-center justify-center"
              >
                <svg
                  className="w-6 h-6 text-[#6e4f32]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z"></path>
                  <path d="M22 2 11 13" stroke="#8c6e52"></path>
                </svg>
              </motion.div>
            </div>

            {/* HEADLINE & USER INPUT REFLECTION */}
            <motion.h1
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: easing }}
              className="font-serif text-2xl sm:text-3xl text-[#6e4f32] font-medium tracking-tight mb-2"
            >
              Crafting your trip to{" "}
              <span className="italic text-[#8c6e52]">{destination}</span>...
            </motion.h1>
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: easing }}
              className="text-xs sm:text-sm text-[#a28973] font-normal tracking-wide mb-6 flex items-center justify-center gap-2 flex-wrap"
            >
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#a28973]" />
                {days} days
              </span>
              <span className="text-[#bba591]">·</span>
              <span className="inline-flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#a28973]" />
                {formattedBudget} budget
              </span>
              <span className="text-[#bba591]">·</span>
              <span className="inline-flex items-center gap-1.5 capitalize">
                <Shield className="w-3.5 h-3.5 text-[#a28973]" />
                {style} style
              </span>
            </motion.p>

            {/* ========================================== */}
            {/* 3. PROGRESS STEPS CARD */}
            {/* ========================================== */}
            <div className="w-full bg-white rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_-4px_rgba(110,79,50,0.06),0_2px_10px_-2px_rgba(110,79,50,0.04)] border border-[#d9c9ba]/50 text-left mb-6 transition-all">
              {/* Header with percentage & animated progress bar */}
              <div className="mb-5">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-[#a28973] font-medium tracking-wide">
                    Itinerary Assembly
                  </span>
                  <span className="font-serif italic text-[#8c6e52] font-semibold text-sm">
                    {activeState === "slow"
                      ? "62% (calibrating)..."
                      : `${progressPercent}% complete`}
                  </span>
                </div>
                {/* Progress Track: fills smoothly between steps */}
                <div className="w-full h-1.5 bg-[#d9c9ba]/40 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#8c6e52] rounded-full"
                    initial={false}
                    animate={{
                      width:
                        activeState === "slow" ? "62%" : `${progressPercent}%`,
                    }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.75, ease: easing }
                    }
                  />
                </div>
              </div>

              {/* Vertical 5-Step Checklist: each step animates in, active pulses softly, check draws itself */}
              <ul className="space-y-3.5">
                {STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStepIndex || isDone;
                  const isActive = idx === currentStepIndex && !isDone;

                  return (
                    <motion.li
                      key={step.id}
                      initial={
                        shouldReduceMotion ? false : { opacity: 0, y: 10 }
                      }
                      animate={
                        isActive
                          ? shouldReduceMotion
                            ? { opacity: 1, y: 0 }
                            : {
                                opacity: 1,
                                y: 0,
                                scale: [1, 1.012, 1],
                                transition: {
                                  scale: {
                                    duration: 2.2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  },
                                  opacity: { duration: 0.35 },
                                  y: { duration: 0.35 },
                                },
                              }
                          : {
                              opacity: isCompleted ? 1 : 0.75,
                              y: 0,
                              scale: 1,
                              transition: { duration: 0.35 },
                            }
                      }
                      className={`flex items-center justify-between group transition-colors duration-300 ${
                        isActive
                          ? "bg-[#d9c9ba]/20 -mx-2 px-2 py-1.5 rounded-lg border border-[#d9c9ba]/40 shadow-xs"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          /* Completed step with self-drawing checkmark SVG path */
                          <AnimatedCheck
                            shouldReduceMotion={shouldReduceMotion}
                          />
                        ) : isActive ? (
                          /* Active step with soft pulsing spinner */
                          <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                            <motion.div
                              animate={
                                shouldReduceMotion
                                  ? undefined
                                  : { rotate: 360 }
                              }
                              transition={
                                shouldReduceMotion
                                  ? undefined
                                  : {
                                      duration: 1.2,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }
                              }
                              className="absolute inset-0 rounded-full border-2 border-[#d9c9ba] border-t-[#8c6e52]"
                            />
                            <motion.div
                              animate={
                                shouldReduceMotion
                                  ? undefined
                                  : { scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }
                              }
                              transition={
                                shouldReduceMotion
                                  ? undefined
                                  : {
                                      duration: 1.6,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    }
                              }
                              className="w-2 h-2 rounded-full bg-[#8c6e52]"
                            />
                          </div>
                        ) : (
                          /* Pending step */
                          <div className="w-6 h-6 rounded-full border border-[#bba591]/70 bg-transparent flex items-center justify-center shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#bba591]/40" />
                          </div>
                        )}

                        <span
                          className={`text-xs sm:text-sm tracking-tight ${
                            isActive
                              ? "font-semibold text-[#6e4f32] flex items-center gap-2"
                              : isCompleted
                              ? "font-medium text-[#6e4f32]"
                              : "font-normal text-[#bba591]"
                          }`}
                        >
                          {step.label}
                          {isActive && (
                            <motion.span
                              animate={
                                shouldReduceMotion
                                  ? undefined
                                  : { opacity: [0.4, 1, 0.4] }
                              }
                              transition={
                                shouldReduceMotion
                                  ? undefined
                                  : {
                                      duration: 1.5,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    }
                              }
                              className="inline-block w-1.5 h-1.5 rounded-full bg-[#8c6e52]"
                            />
                          )}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-sans ${
                          isActive
                            ? "text-[#8c6e52] font-semibold"
                            : isCompleted
                            ? "text-[#a28973]/80"
                            : "text-[#bba591]"
                        }`}
                      >
                        {isCompleted
                          ? step.completedStatus
                          : isActive
                          ? step.activeStatus
                          : "Pending"}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>

              {/* SLOW STATE NOTICE (Toggleable when activeState === 'slow') */}
              {activeState === "slow" && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: easing }}
                  className="mt-4 pt-3.5 border-t border-[#d9c9ba]/40 flex items-center gap-2.5 text-xs text-[#8c6e52] bg-[#d9c9ba]/20 -mx-2 -mb-2 px-3 py-2 rounded-b-xl"
                >
                  <RotateCw className="w-4 h-4 text-[#8c6e52] shrink-0 animate-spin" />
                  <span className="font-normal text-[#6e4f32]">
                    Taking a little longer than usual. Hang tight, we&apos;re
                    curating authentic local spots...
                  </span>
                </motion.div>
              )}
            </div>

            {/* ========================================== */}
            {/* 4. TRIP PREVIEW SKELETON (Shimmering Cards) */}
            {/* ========================================== */}
            <div className="w-full mb-6 text-left">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <span className="text-[11px] uppercase tracking-wider text-[#bba591] font-semibold">
                  Itinerary Draft In Flow
                </span>
                <span className="text-[11px] text-[#a28973] italic">
                  Days 1–3 Preview
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
                {/* Day 1 Skeleton Card with Shimmer */}
                <div className="bg-white/90 rounded-xl p-3 border border-[#d9c9ba]/60 shadow-[0_4px_16px_-2px_rgba(110,79,50,0.04)] flex flex-col justify-between h-28 relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-3 w-10 shimmer-box rounded" />
                      <div className="h-2 w-6 shimmer-box rounded-full" />
                    </div>
                    <div className="h-3.5 w-4/5 shimmer-box rounded mb-1.5" />
                    <div className="h-2.5 w-3/5 shimmer-box rounded" />
                  </div>
                  <div className="flex items-center gap-1.5 pt-2 border-t border-[#d9c9ba]/30">
                    <div className="w-2.5 h-2.5 rounded-full shimmer-box" />
                    <div className="h-2 w-14 shimmer-box rounded" />
                  </div>
                </div>

                {/* Day 2 Skeleton Card with Shimmer (offset delay) */}
                <div className="bg-white/90 rounded-xl p-3 border border-[#d9c9ba]/60 shadow-[0_4px_16px_-2px_rgba(110,79,50,0.04)] flex flex-col justify-between h-28 relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-3 w-10 shimmer-box shimmer-box-delay-1 rounded" />
                      <div className="h-2 w-6 shimmer-box shimmer-box-delay-1 rounded-full" />
                    </div>
                    <div className="h-3.5 w-3/4 shimmer-box shimmer-box-delay-1 rounded mb-1.5" />
                    <div className="h-2.5 w-1/2 shimmer-box shimmer-box-delay-1 rounded" />
                  </div>
                  <div className="flex items-center gap-1.5 pt-2 border-t border-[#d9c9ba]/30">
                    <div className="w-2.5 h-2.5 rounded-full shimmer-box shimmer-box-delay-1" />
                    <div className="h-2 w-12 shimmer-box shimmer-box-delay-1 rounded" />
                  </div>
                </div>

                {/* Day 3 Skeleton Card with Shimmer (offset delay) */}
                <div className="bg-white/90 rounded-xl p-3 border border-[#d9c9ba]/60 shadow-[0_4px_16px_-2px_rgba(110,79,50,0.04)] flex flex-col justify-between h-28 relative overflow-hidden opacity-90">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-3 w-10 shimmer-box shimmer-box-delay-2 rounded" />
                      <div className="h-2 w-6 shimmer-box shimmer-box-delay-2 rounded-full" />
                    </div>
                    <div className="h-3.5 w-4/6 shimmer-box shimmer-box-delay-2 rounded mb-1.5" />
                    <div className="h-2.5 w-2/3 shimmer-box shimmer-box-delay-2 rounded" />
                  </div>
                  <div className="flex items-center gap-1.5 pt-2 border-t border-[#d9c9ba]/30">
                    <div className="w-2.5 h-2.5 rounded-full shimmer-box shimmer-box-delay-2" />
                    <div className="h-2 w-10 shimmer-box shimmer-box-delay-2 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* 5. ROTATING TRAVEL TIP (Fade & Rotate every few seconds) */}
            {/* ========================================== */}
            <div className="w-full flex flex-col items-center justify-center text-center px-4">
              <div className="min-h-[26px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tipIndex}
                    initial={
                      shouldReduceMotion ? false : { opacity: 0, y: 6 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      shouldReduceMotion ? undefined : { opacity: 0, y: -6 }
                    }
                    transition={{ duration: 0.35, ease: easing }}
                    className="flex items-center gap-1.5 text-xs text-[#a28973] italic"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#8c6e52] not-italic shrink-0" />
                    <span>{TIPS[tipIndex]}</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Faint dot indicator */}
              <div className="flex items-center gap-1.5 mt-2.5">
                {TIPS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTipIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                      i === tipIndex
                        ? "bg-[#8c6e52] scale-125"
                        : "bg-[#bba591]/40 hover:bg-[#bba591]"
                    }`}
                    aria-label={`Show tip ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* 6. ERROR STATE VARIANT */}
        {/* ========================================== */}
        {activeState === "error" && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: easing }}
            className="w-full flex flex-col items-center text-center transition-all duration-300"
          >
            {/* Gentle Earthy Error Illustration */}
            <div className="w-20 h-20 rounded-full bg-white border border-[#d9c9ba] shadow-[0_8px_30px_-4px_rgba(110,79,50,0.06),0_2px_10px_-2px_rgba(110,79,50,0.04)] flex items-center justify-center mb-5 text-[#8c6e52]">
              <svg
                className="w-10 h-10 text-[#a28973]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5"></line>
              </svg>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#6e4f32] font-medium tracking-tight mb-2">
              Something went wrong
            </h2>
            <p className="text-xs sm:text-sm text-[#a28973] max-w-sm mb-6 leading-relaxed">
              We couldn&apos;t build your trip this time. Your destination details
              and travel preferences are safely saved.
            </p>

            {/* Reassurance Card */}
            <div className="w-full bg-white rounded-2xl p-5 shadow-[0_8px_30px_-4px_rgba(110,79,50,0.06),0_2px_10px_-2px_rgba(110,79,50,0.04)] border border-[#d9c9ba]/50 text-left mb-6">
              <div className="flex items-center gap-3 text-xs text-[#a28973]">
                <div className="w-8 h-8 rounded-full bg-[#d9c9ba]/30 flex items-center justify-center text-[#8c6e52] shrink-0">
                  <Bookmark className="w-4 h-4 text-[#8c6e52]" />
                </div>
                <div>
                  <div className="font-medium text-[#6e4f32] text-sm">
                    Saved Query: {destination} ({days} Days · {formattedBudget})
                  </div>
                  <div className="text-[12px] text-[#a28973]">
                    All preferences preserved. You will not need to retype your
                    inputs.
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
              <button
                type="button"
                onClick={handleTryAgain}
                className="w-full py-3 px-5 rounded-full bg-[#6e4f32] hover:bg-[#8c6e52] text-white text-sm font-medium transition-colors shadow-soft flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
                Try again
              </button>
              <button
                type="button"
                onClick={handleEditDetails}
                className="w-full py-3 px-5 rounded-full bg-[#d9c9ba]/30 hover:bg-[#d9c9ba]/60 text-[#6e4f32] text-sm font-medium border border-[#bba591]/40 transition-colors cursor-pointer"
              >
                Edit my details
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* ANNOTATION BADGE (Design Clarity Note) */}
        {/* ========================================== */}
        <div className="mt-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d9c9ba]/30 border border-[#bba591]/20 text-[11px] text-[#a28973]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8c6e52]"></span>
            Calm motion applied: 28s compass rotation, shimmer skeletons, and
            pulsing active step
          </span>
        </div>
      </main>

      {/* Discreet footer spacing */}
      <footer className="w-full py-4 text-center text-xs text-[#bba591]">
        <span>TripAi Intelligent Travel Architect</span>
      </footer>
    </div>
  );
}

export default function GeneratingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f2ec] flex items-center justify-center text-[#6e4f32] text-sm">
          Preparing your journey...
        </div>
      }
    >
      <GeneratingContent />
    </Suspense>
  );
}
