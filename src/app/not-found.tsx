"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Compass, Home, Sparkles } from "lucide-react";
import { fadeUp, staggerContainer, hoverLift, tapPress } from "@/lib/motion";

export default function NotFound() {
  const prefersReduced = useReducedMotion();

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
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#a28973] bg-[#d9c9ba]/30 px-2.5 py-0.5 rounded-full border border-[#bba591]/30">
            Error 404
          </span>
        </div>

        {/* Centered Error Core */}
        <div className="w-full px-6 py-10 sm:py-14 flex flex-col items-center text-center">
          {/* Animated Illustration: Folded Map with Drifting Paper Plane */}
          <div className="relative w-72 h-56 mb-8 flex items-center justify-center">
            {/* Folded Map SVG */}
            <svg
              className="w-56 h-40 filter drop-shadow-sm"
              viewBox="0 0 240 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Folded map panels */}
              <polygon
                points="20,30 90,18 90,140 20,150"
                fill="#d9c9ba"
                stroke="#bba591"
                strokeWidth="1.75"
              />
              <polygon
                points="90,18 160,32 160,152 90,140"
                fill="#e7ded4"
                stroke="#bba591"
                strokeWidth="1.75"
              />
              <polygon
                points="160,32 220,20 220,138 160,152"
                fill="#d9c9ba"
                stroke="#bba591"
                strokeWidth="1.75"
              />
              {/* Terrain contour lines */}
              <path
                d="M35,60 Q60,75 80,50"
                stroke="#bba591"
                strokeWidth="1.2"
                strokeDasharray="2 3"
                fill="none"
              />
              <path
                d="M100,55 Q125,40 150,65"
                stroke="#bba591"
                strokeWidth="1.2"
                strokeDasharray="2 3"
                fill="none"
              />
              <path
                d="M170,70 Q195,50 210,80"
                stroke="#bba591"
                strokeWidth="1.2"
                strokeDasharray="2 3"
                fill="none"
              />
              {/* Compass rose watermark */}
              <circle
                cx="60"
                cy="115"
                r="14"
                stroke="#bba591"
                strokeWidth="1"
                strokeDasharray="2 2"
                fill="none"
                opacity="0.6"
              />
              <line
                x1="60"
                y1="97"
                x2="60"
                y2="133"
                stroke="#bba591"
                strokeWidth="1"
                opacity="0.6"
              />
              <line
                x1="42"
                y1="115"
                x2="78"
                y2="115"
                stroke="#bba591"
                strokeWidth="1"
                opacity="0.6"
              />
              {/* Dotted flight route escaping the map */}
              <path
                d="M110,105 Q145,85 155,50 T220,35 T250,20"
                stroke="#a28973"
                strokeWidth="2"
                strokeDasharray="4 4"
                fill="none"
              />
            </svg>

            {/* Floating Paper Plane (Gentle Drift Animation) */}
            <motion.div
              animate={
                prefersReduced
                  ? {}
                  : {
                      y: [0, -9, 0],
                      rotate: [0, 2.5, 0],
                      x: [0, 3, 0],
                    }
              }
              transition={
                prefersReduced
                  ? {}
                  : {
                      duration: 4.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
              className="absolute -top-1 -right-2"
            >
              <svg
                className="w-14 h-14 text-[#6e4f32] filter drop-shadow-md"
                viewBox="0 0 64 64"
                fill="none"
              >
                <path
                  d="M12 48 L56 12 L34 54 L26 36 L12 48 Z"
                  fill="#ffffff"
                  stroke="#6e4f32"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M26 36 L56 12"
                  stroke="#6e4f32"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M26 36 L30 46 L34 38"
                  fill="#d9c9ba"
                  stroke="#6e4f32"
                  strokeWidth="1.5"
                />
              </svg>
            </motion.div>

            {/* Gentle question mark */}
            <span className="absolute top-4 right-14 text-[#a28973] text-lg font-serif italic select-none">
              ?
            </span>

            {/* Tactile Sticky Note: "Wrong turn?" */}
            <div className="absolute -bottom-2 -left-3 rotate-[-6deg] bg-[#f8e7cb] border border-[#e4ccab] rounded-sm px-3.5 py-2 shadow-md filter drop-shadow-xs">
              <div className="w-5 h-1.5 bg-[#bba591]/40 mx-auto -mt-3 mb-1 rounded-full opacity-60" />
              <p className="font-handwriting text-[#6e4f32] text-base leading-none">
                Wrong turn?
              </p>
            </div>
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
              We lost this page.
            </motion.h1>

            {/* Caption */}
            <motion.p
              variants={fadeUp}
              className="text-[#a28973] text-base mb-8 max-w-sm font-normal"
            >
              The link may be old or mistyped. Let&apos;s guide you back onto the trail.
            </motion.p>

            {/* Action Buttons fading up in sequence */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
            >
              <Link
                href="/home"
                className="w-full sm:w-auto"
              >
                <motion.div
                  {...(prefersReduced ? {} : { ...hoverLift, ...tapPress })}
                  className="px-7 py-3 rounded-2xl bg-[#6e4f32] text-white text-sm font-medium hover:bg-[#54381d] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  <span>Go home</span>
                </motion.div>
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto"
              >
                <motion.div
                  {...(prefersReduced ? {} : { ...hoverLift, ...tapPress })}
                  className="px-7 py-3 rounded-2xl bg-[#d9c9ba]/35 text-[#6e4f32] border border-[#bba591]/40 text-sm font-medium hover:bg-[#d9c9ba]/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Plan a trip</span>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
