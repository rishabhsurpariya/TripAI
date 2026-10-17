"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Compass, RefreshCw, Home, Sparkles } from "lucide-react";
import { fadeUp, staggerContainer, hoverLift, tapPress } from "@/lib/motion";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const prefersReduced = useReducedMotion();
  const [illustrationMode, setIllustrationMode] = useState<"compass" | "balloon">("compass");

  useEffect(() => {
    console.error("TripAi runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-[#eee7df]/60 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Centered Error Container */}
      <div className="w-full max-w-[680px] bg-[#f7f2ec] border border-[#bba591]/35 rounded-3xl shadow-xl overflow-hidden flex flex-col justify-between">
        {/* Top Slim Brand Nav */}
        <div className="h-14 border-b border-[#bba591]/25 px-6 flex items-center justify-between bg-[#f7f2ec]/90 backdrop-blur-sm">
          <Link href="/" className="flex items-center gap-2 text-[#6e4f32] hover:opacity-85 transition-opacity">
            <Compass className="w-5 h-5" />
            <span className="font-serif text-lg font-medium tracking-tight text-[#6e4f32]">
              TripAi
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIllustrationMode(illustrationMode === "compass" ? "balloon" : "compass")}
              className="text-[11px] font-medium text-[#8c6e52] hover:text-[#6e4f32] transition-colors px-2 py-0.5 rounded-md hover:bg-[#d9c9ba]/30 cursor-pointer"
              title="Toggle illustration theme"
            >
              {illustrationMode === "compass" ? "Show Balloon" : "Show Compass"}
            </button>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#93000a] bg-[#ffdad6] px-2.5 py-0.5 rounded-full border border-[#ba1a1a]/20">
              System Alert
            </span>
          </div>
        </div>

        {/* Centered Error Core */}
        <div className="w-full px-6 py-10 sm:py-14 flex flex-col items-center text-center">
          {/* Animated Illustration: Compass Needle Wobbling or Balloon Swaying */}
          <div className="relative w-72 h-56 mb-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {illustrationMode === "compass" ? (
                /* Illustration 1: Compass with Wobbling Needle over Blank Itinerary Card */
                <motion.div
                  key="compass-view"
                  initial={prefersReduced ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  {/* Blank itinerary card background with delicate lines */}
                  <div className="absolute w-52 h-36 bg-white border border-[#bba591]/50 rounded-2xl shadow-sm rotate-[-3deg] p-4 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between border-b border-[#bba591]/20 pb-2">
                      <div className="w-20 h-2 bg-[#d9c9ba] rounded-full" />
                      <div className="w-8 h-2 bg-[#d9c9ba]/60 rounded-full" />
                    </div>
                    <div className="w-3/4 h-2 bg-[#d9c9ba]/40 rounded-full" />
                    <div className="w-1/2 h-2 bg-[#d9c9ba]/30 rounded-full" />
                    <div className="mt-auto flex gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#d9c9ba]/40" />
                      <div className="flex-1 flex flex-col justify-center gap-1">
                        <div className="w-24 h-1.5 bg-[#d9c9ba]/50 rounded-full" />
                        <div className="w-16 h-1.5 bg-[#d9c9ba]/30 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Compass sitting in foreground */}
                  <div className="relative z-10 w-32 h-32 rounded-full bg-[#f7f2ec] border-2 border-[#6e4f32] shadow-md flex items-center justify-center">
                    {/* Compass dial marks */}
                    <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="42" stroke="#bba591" strokeWidth="1" strokeDasharray="2 3" />
                      <text x="50" y="16" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="7" fontWeight="600" fill="#6e4f32" textAnchor="middle">
                        N
                      </text>
                      <text x="86" y="52" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="7" fontWeight="600" fill="#a28973" textAnchor="middle">
                        E
                      </text>
                      <text x="50" y="90" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="7" fontWeight="600" fill="#a28973" textAnchor="middle">
                        S
                      </text>
                      <text x="14" y="52" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="7" fontWeight="600" fill="#a28973" textAnchor="middle">
                        W
                      </text>
                    </svg>

                    {/* Wobbling Needle (Gentle Wobble Animation) */}
                    <motion.div
                      animate={
                        prefersReduced
                          ? {}
                          : {
                              rotate: [-8, 14, -4, 8, -8],
                            }
                      }
                      transition={
                        prefersReduced
                          ? {}
                          : {
                              duration: 4.0,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }
                      }
                      style={{ transformOrigin: "50% 50%" }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      <svg className="w-12 h-20" viewBox="0 0 24 50" fill="none">
                        <polygon points="12,2 17,25 7,25" fill="#6e4f32" stroke="#6e4f32" strokeWidth="1" />
                        <polygon points="12,48 17,25 7,25" fill="#d9c9ba" stroke="#a28973" strokeWidth="1" />
                        <circle cx="12" cy="25" r="2.5" fill="#faf6f0" stroke="#6e4f32" strokeWidth="1.5" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Sticky Note */}
                  <div className="absolute -bottom-2 right-4 rotate-[6deg] bg-[#f8e7cb] border border-[#e4ccab] rounded-sm px-3 py-1.5 shadow-md z-20">
                    <p className="font-handwriting text-[#6e4f32] text-sm leading-none">
                      let&apos;s recalibrate
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* Illustration 2: Tethered Hot-air Balloon Swaying */
                <motion.div
                  key="balloon-view"
                  initial={prefersReduced ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <motion.div
                    animate={
                      prefersReduced
                        ? {}
                        : {
                            rotate: [-2.5, 3.5, -2.5],
                            y: [0, -6, 0],
                          }
                    }
                    transition={
                      prefersReduced
                        ? {}
                        : {
                            duration: 5.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                    }
                    style={{ transformOrigin: "50% 90%" }}
                    className="relative"
                  >
                    <svg className="w-48 h-48" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Balloon Envelope */}
                      <path
                        d="M80 15 C50 15 30 38 30 65 C30 88 50 108 72 118 L88 118 C110 108 130 88 130 65 C130 38 110 15 80 15 Z"
                        fill="#d9c9ba"
                        stroke="#6e4f32"
                        strokeWidth="2"
                      />
                      {/* Vertical Gores */}
                      <path
                        d="M80 15 C65 15 52 40 52 65 C52 92 68 115 76 118"
                        stroke="#bba591"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <path
                        d="M80 15 C95 15 108 40 108 65 C108 92 92 115 84 118"
                        stroke="#bba591"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      {/* Ropes */}
                      <line x1="72" y1="118" x2="70" y2="132" stroke="#8c6e52" strokeWidth="1.2" />
                      <line x1="88" y1="118" x2="90" y2="132" stroke="#8c6e52" strokeWidth="1.2" />
                      {/* Wicker Basket */}
                      <rect x="68" y="132" width="24" height="18" rx="3" fill="#bba591" stroke="#6e4f32" strokeWidth="1.8" />
                    </svg>

                    {/* Sticky Note */}
                    <div className="absolute -bottom-2 -left-2 rotate-[-5deg] bg-[#f8e7cb] border border-[#e4ccab] rounded-sm px-3 py-1.5 shadow-md z-20">
                      <p className="font-handwriting text-[#6e4f32] text-sm leading-none">
                        off grid
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Staggered Text and Buttons */}
          <motion.div
            variants={staggerContainer(0.09, 0.15)}
            initial={prefersReduced ? false : "hidden"}
            animate="visible"
            className="flex flex-col items-center max-w-md"
          >
            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-serif text-3xl sm:text-4xl text-[#6e4f32] font-normal mb-3 tracking-tight"
            >
              Something went wrong.
            </motion.h1>

            {/* Caption */}
            <motion.p
              variants={fadeUp}
              className="text-[#a28973] text-base mb-8 max-w-sm font-normal"
            >
              It&apos;s not you — our journey engine hit a small bump. Please try again.
            </motion.p>

            {/* Action Buttons fading up in sequence */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
            >
              <motion.button
                type="button"
                onClick={() => reset()}
                {...(prefersReduced ? {} : { ...hoverLift, ...tapPress })}
                className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#6e4f32] text-white text-sm font-medium hover:bg-[#54381d] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try again</span>
              </motion.button>
              <Link
                href="/home"
                className="w-full sm:w-auto"
              >
                <motion.div
                  {...(prefersReduced ? {} : { ...hoverLift, ...tapPress })}
                  className="px-7 py-3 rounded-2xl bg-[#d9c9ba]/35 text-[#6e4f32] border border-[#bba591]/40 text-sm font-medium hover:bg-[#d9c9ba]/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  <span>Go home</span>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
