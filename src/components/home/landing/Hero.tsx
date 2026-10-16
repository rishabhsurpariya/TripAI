"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Reveal } from "@/components/motion";

const HEADLINE_WORDS = [
  { text: "Your", italic: false },
  { text: "trip,", italic: false },
  { text: "planned", italic: false },
  { text: "in", italic: false },
  { text: "seconds.", italic: true },
];

export default function Hero() {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax mouse tracker
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 45, damping: 25 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Layer parallax depths
  const glowX = useTransform(smoothX, [-300, 300], [-15, 15]);
  const glowY = useTransform(smoothY, [-300, 300], [-15, 15]);

  const centerCardX = useTransform(smoothX, [-300, 300], [-8, 8]);
  const centerCardY = useTransform(smoothY, [-300, 300], [-8, 8]);

  const leftCardX = useTransform(smoothX, [-300, 300], [-18, 18]);
  const leftCardY = useTransform(smoothY, [-300, 300], [-18, 18]);

  const rightCardX = useTransform(smoothX, [-300, 300], [18, -18]);
  const rightCardY = useTransform(smoothY, [-300, 300], [18, -18]);

  const note1X = useTransform(smoothX, [-300, 300], [-26, 26]);
  const note1Y = useTransform(smoothY, [-300, 300], [-26, 26]);

  const note2X = useTransform(smoothX, [-300, 300], [24, -24]);
  const note2Y = useTransform(smoothY, [-300, 300], [24, -24]);

  const budgetX = useTransform(smoothX, [-300, 300], [-10, 10]);
  const budgetY = useTransform(smoothY, [-300, 300], [8, -8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-6 pb-20 lg:pb-32 px-2 sm:px-4 overflow-hidden"
    >
      {/* ── Headline ── */}
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <h1
          className="text-[40px] sm:text-[56px] lg:text-[64px] leading-[1.1] text-primary tracking-tight font-semibold flex flex-wrap justify-center gap-x-3 gap-y-1"
          style={{ fontFamily: "var(--font-serif)", fontWeight: 500, letterSpacing: "-0.02em" }}
        >
          {HEADLINE_WORDS.map((word, idx) => (
            <motion.span
              key={word.text}
              initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.6,
                delay: prefersReduced ? 0 : 0.08 * idx,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="inline-block"
            >
              {word.italic ? (
                <em className="italic font-normal" style={{ fontFamily: "var(--font-serif)" }}>
                  {word.text}
                </em>
              ) : (
                word.text
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.45 }}
          className="mt-4 text-secondary text-lg sm:text-xl font-sans"
        >
          Enter a place and a budget.
        </motion.p>

        {/* ── CTAs ── */}
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.6 }}
          className="mt-8 flex items-center gap-4 flex-wrap justify-center"
        >
          <Link
            href="/signup"
            className="px-8 py-3.5 rounded-full bg-primary-container text-white hover:bg-secondary font-medium transition-all duration-200 shadow-[0_12px_28px_-8px_rgba(110,79,50,0.22)] active:scale-95 text-sm"
          >
            Get started
          </Link>
          <Link
            href="/shared/goa-sun-2026"
            className="px-7 py-3.5 rounded-full bg-transparent border border-secondary text-primary hover:bg-[#d9c9ba]/30 font-medium transition-all duration-200 text-sm"
          >
            See a sample trip
          </Link>
        </motion.div>
      </div>

      {/* ── Corkboard Collage with Parallax & Floating Motion ── */}
      <div className="relative max-w-5xl mx-auto mt-14 sm:mt-18 min-h-[580px] sm:min-h-[640px] flex items-center justify-center select-none">
        {/* Ambient glow with subtle parallax */}
        <motion.div
          style={prefersReduced ? undefined : { x: glowX, y: glowY }}
          className="absolute inset-0 bg-gradient-to-tr from-[#d9c9ba]/30 via-[#fbddc4]/25 to-transparent rounded-[3rem] blur-2xl -z-10"
        />

        {/* Central dossier */}
        <motion.div
          style={prefersReduced ? undefined : { x: centerCardX, y: centerCardY }}
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 45, rotate: -4, scale: 0.94 }}
          animate={{
            opacity: 1,
            y: prefersReduced ? 0 : [0, -6, 0],
            rotate: prefersReduced ? -1.5 : [-1.5, -0.5, -1.5],
            scale: 1,
          }}
          transition={{
            opacity: { duration: 0.7, delay: 0.2 },
            scale: { duration: 0.7, delay: 0.2 },
            y: prefersReduced ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotate: prefersReduced ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative w-full max-w-lg sm:max-w-xl bg-surface-container-lowest rounded-[28px] p-5 sm:p-7 shadow-[0_22px_45px_-12px_rgba(110,79,50,0.18)] z-20 transition-shadow duration-300 hover:shadow-[0_28px_55px_-12px_rgba(110,79,50,0.25)]"
        >
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-lg text-primary font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
                Goa Heritage Escape
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#d9c9ba]/40 text-primary text-[11px] font-medium tracking-wide">
                5 Days · Curated
              </span>
            </div>
            <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
          </div>

          <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden shadow-inner group">
            <Image
              src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"
              alt="Sunlit Goa heritage villa with bougainvillea"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-3 left-3 px-3 py-1 bg-surface/90 backdrop-blur-sm rounded-full text-xs font-medium text-primary flex items-center gap-1.5 shadow-sm">
              🏨 Panaji & Reis Magos
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#bba591]/25">
            {[
              { label: "Pace", value: "Leisurely" },
              { label: "Vibe", value: "Architecture" },
              { label: "Transit", value: "Vintage Vespa" },
            ].map((item) => (
              <div key={item.label} className="bg-surface-container-low rounded-xl p-2.5 text-center">
                <div className="text-[11px] text-secondary font-medium uppercase tracking-wide">{item.label}</div>
                <div className="text-sm font-semibold text-primary mt-0.5">{item.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Overlapping card 1 — Latin Quarter stroll */}
        <motion.div
          style={prefersReduced ? undefined : { x: leftCardX, y: leftCardY }}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -40, y: 30, rotate: -12 }}
          animate={{
            opacity: 1,
            y: prefersReduced ? 0 : [0, -8, 0],
            rotate: prefersReduced ? -6 : [-6, -3, -6],
          }}
          transition={{
            opacity: { duration: 0.6, delay: 0.35 },
            x: { duration: 0.6, delay: 0.35 },
            y: prefersReduced ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.35 },
            rotate: prefersReduced ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.35 },
          }}
          className="absolute left-2 sm:-left-4 top-10 sm:top-16 w-56 sm:w-64 bg-surface-container-lowest rounded-2xl p-3.5 shadow-[0_16px_36px_-10px_rgba(110,79,50,0.14)] z-30 transition-shadow duration-300 hover:shadow-xl hover:scale-105"
        >
          <div className="washi-tape absolute -top-3 left-12 w-16 h-5 -rotate-2 rounded-sm" />
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#f2ede7] text-secondary font-medium">09:30 AM</span>
            <span className="text-xs font-semibold text-primary truncate">Latin Quarter Stroll</span>
          </div>
          <div className="w-full h-24 rounded-xl overflow-hidden mb-2 relative">
            <Image
              src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80"
              alt="Fontainhas Goa colourful Portuguese houses"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-[11px] text-secondary flex items-center justify-between">
            <span>Fontainhas Walk</span>
            <span className="flex items-center gap-0.5 text-primary font-medium">⭐ 4.9</span>
          </div>
        </motion.div>

        {/* Overlapping card 2 — Heritage dining */}
        <motion.div
          style={prefersReduced ? undefined : { x: rightCardX, y: rightCardY }}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: 40, y: 30, rotate: 12 }}
          animate={{
            opacity: 1,
            y: prefersReduced ? 0 : [0, -7, 0],
            rotate: prefersReduced ? 6 : [6, 3, 6],
          }}
          transition={{
            opacity: { duration: 0.6, delay: 0.45 },
            x: { duration: 0.6, delay: 0.45 },
            y: prefersReduced ? undefined : { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
            rotate: prefersReduced ? undefined : { duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
          }}
          className="absolute -right-2 sm:-right-8 top-12 sm:top-20 w-52 sm:w-60 bg-surface-container-lowest rounded-2xl p-3.5 shadow-[0_16px_36px_-10px_rgba(110,79,50,0.14)] z-[25] transition-shadow duration-300 hover:shadow-xl hover:scale-105"
        >
          <div className="washi-tape absolute -top-3 right-10 w-16 h-5 rotate-3 rounded-sm" />
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary-container text-primary font-medium">01:00 PM</span>
            <span className="text-xs font-semibold text-primary">Mum&apos;s Kitchen</span>
          </div>
          <div className="w-full h-20 rounded-xl overflow-hidden mb-2 relative">
            <Image
              src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80"
              alt="Traditional Goan lunch in clay pots"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-[11px] text-secondary flex items-center justify-between">
            <span>Heritage Dining</span>
            <span className="font-medium text-primary">₹1,800 for two</span>
          </div>
        </motion.div>

        {/* Floating sticky note 1 — Swaying gently */}
        <motion.div
          style={prefersReduced ? undefined : { x: note1X, y: note1Y }}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 35, rotate: -10 }}
          animate={{
            opacity: 1,
            y: prefersReduced ? 0 : [0, -6, 0],
            rotate: prefersReduced ? -3 : [-4, 1, -4],
          }}
          transition={{
            opacity: { duration: 0.5, delay: 0.55 },
            y: prefersReduced ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
            rotate: prefersReduced ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute left-6 sm:left-12 -bottom-4 sm:bottom-4 w-44 bg-[#fffae0] p-4 rounded-md shadow-[0_10px_20px_-6px_rgba(110,79,50,0.12)] z-[35]"
        >
          <div className="washi-tape absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 rotate-1 rounded-sm" />
          <span className="text-[#a28973] text-lg">☀️</span>
          <p className="font-handwriting text-xl text-primary leading-tight mt-1">Golden photo hour 9am!</p>
          <p className="font-handwriting text-base text-secondary mt-0.5">Light hits the yellow walls</p>
        </motion.div>

        {/* Floating sticky note 2 — Swaying gently */}
        <motion.div
          style={prefersReduced ? undefined : { x: note2X, y: note2Y }}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 35, rotate: 10 }}
          animate={{
            opacity: 1,
            y: prefersReduced ? 0 : [0, -7, 0],
            rotate: prefersReduced ? 4 : [3, -2, 3],
          }}
          transition={{
            opacity: { duration: 0.5, delay: 0.65 },
            y: prefersReduced ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
            rotate: prefersReduced ? undefined : { duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          }}
          className="absolute -right-2 sm:right-6 bottom-16 sm:bottom-24 w-40 bg-[#fde8d7] p-3.5 rounded-md shadow-[0_10px_20px_-6px_rgba(110,79,50,0.12)] z-[35]"
        >
          <div className="washi-tape absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 -rotate-2 rounded-sm" />
          <p className="font-handwriting text-2xl text-primary leading-none">Fresh poi bread!</p>
          <p className="font-handwriting text-base text-secondary mt-1">From local bakery cart</p>
        </motion.div>

        {/* Budget ring meter */}
        <motion.div
          style={prefersReduced ? undefined : { x: budgetX, y: budgetY }}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.75, type: "spring", stiffness: 220, damping: 20 }}
          className="absolute left-1/2 -translate-x-1/2 -bottom-10 sm:-bottom-8 bg-surface rounded-2xl px-5 py-3 shadow-[0_14px_30px_-8px_rgba(110,79,50,0.16)] flex items-center gap-4 z-40 border border-[#bba591]/30"
        >
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-[#d9c9ba]/50" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
              <motion.path
                className="text-primary-container"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="92, 100"
                strokeLinecap="round"
                strokeWidth="3.5"
                initial={prefersReduced ? undefined : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute text-base text-primary">💰</span>
          </div>
          <div>
            <div className="text-[11px] text-secondary font-medium uppercase tracking-wide">Smart Budget Bar</div>
            <div className="text-sm font-semibold text-primary flex items-center gap-1.5">
              <span>₹23,400</span>
              <span className="text-xs font-normal text-secondary">/ ₹25,000</span>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}
