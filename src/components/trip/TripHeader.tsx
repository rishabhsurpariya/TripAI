"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Calendar,
  CheckCircle2,
  Share2,
  Sparkles,
  Bookmark,
} from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Trip } from "@/types/trip";
import { easing } from "@/lib/motion";
import { formatCurrency } from "@/lib/currency";

interface TripHeaderProps {
  trip: Trip;
  onShare?: () => void;
}

export function TripHeader({ trip, onShare }: TripHeaderProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Slow parallax on scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const daysCount = trip.days?.length || 5;
  const budgetSpent = Object.values(trip.budget || {}).reduce((a, b) => a + b, 0);
  const maxBudget = trip.totalBudget || 95000;
  const bufferAmount = Math.max(0, maxBudget - budgetSpent);
  const percentAllocated = Math.min(100, Math.round((budgetSpent / maxBudget) * 100));

  return (
    <section
      ref={sectionRef}
      className="relative rounded-3xl overflow-hidden shadow-xl bg-primary-container text-on-primary border border-outline-variant/30"
    >
      {/* Background Image with Slow Parallax and Ambient Scrim */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: shouldReduceMotion ? 0 : imageY }}
          className="relative w-full h-[120%] -top-[10%]"
        >
          <Image
            src={
              trip.coverImageUrl ||
              "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80"
            }
            alt={trip.destination}
            fill
            priority
            sizes="100vw"
            className="object-cover mix-blend-overlay opacity-40 scale-105"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary-container/85 to-primary/45" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-[300px]">
        {/* Top Row: Breadcrumbs & Meta Badges */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easing }}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-1.5 text-on-primary-container text-xs font-semibold tracking-wider uppercase">
            <Link href="/trips" className="opacity-80 hover:opacity-100 hover:underline">
              My Trips
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            <span className="text-on-primary font-bold">
              {trip.destination} Journey
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-surface/15 backdrop-blur-md text-xs text-on-primary flex items-center gap-1.5 border border-white/10 font-medium">
              <Calendar className="w-3.5 h-3.5 text-primary-fixed-dim" />
              <span>{daysCount} Days Itinerary</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-surface/15 backdrop-blur-md text-xs text-on-primary flex items-center gap-1.5 border border-white/10 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary-fixed-dim" />
              <span>Curated by TripAi</span>
            </span>
          </div>
        </motion.div>

        {/* Mid Row: Editorial Headline (Fade Up) */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: easing }}
          className="space-y-1.5 my-6 max-w-3xl"
        >
          <p className="text-xs uppercase tracking-widest text-primary-fixed-dim font-bold">
            {trip.country} &bull; Curated Passage
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-on-primary tracking-tight font-medium drop-shadow-xs">
            {trip.destination}, {trip.country} &bull; Bespoke Itinerary
          </h1>
          <p className="text-sm sm:text-base text-on-primary-container leading-relaxed font-light line-clamp-2">
            An intimate {daysCount}-day journey through tranquil heritage architecture, authentic artisan dining, scenic walking paths, and slow evening sunsets.
          </p>
        </motion.div>

        {/* Bottom Row: Meta summary, Budget widget & Action Buttons (Fade Up Chips) */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: easing }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-5 border-t border-on-primary/15"
        >
          {/* Chips & Micro Budget Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
            {/* Summary Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-on-primary text-xs font-medium border border-white/10">
                {daysCount} Days
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-on-primary text-xs font-medium border border-white/10">
                {trip.travelers} Travelers
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-on-primary text-xs font-medium border border-white/10 capitalize">
                {trip.style} Style
              </span>
              {trip.startCity && (
                <span className="px-3 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-on-primary text-xs font-medium border border-white/10">
                  Ex-{trip.startCity}
                </span>
              )}
            </div>

            {/* Micro Budget Gauge */}
            <div className="flex items-center gap-3 bg-surface/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-on-primary-container text-[11px]">Budget</span>
                  <span className="text-on-primary font-bold">
                    {formatCurrency(budgetSpent, trip.currency || "INR")}{" "}
                    <span className="opacity-60 text-[11px] font-normal">
                      / {formatCurrency(maxBudget, trip.currency || "INR")}
                    </span>
                  </span>
                </div>
                <div className="w-28 sm:w-36 h-1.5 bg-on-primary/20 rounded-full overflow-hidden mt-1">
                  <motion.div
                    initial={shouldReduceMotion ? { width: `${percentAllocated}%` } : { width: 0 }}
                    animate={{ width: `${percentAllocated}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: easing }}
                    className="h-full bg-primary-fixed-dim rounded-full"
                  />
                </div>
              </div>
              {bufferAmount > 0 && (
                <span className="text-[10px] text-secondary-container bg-primary/40 px-2 py-0.5 rounded-full font-medium">
                  +{formatCurrency(bufferAmount, trip.currency || "INR")} buffer
                </span>
              )}
            </div>
          </div>

          {/* Visual Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={onShare}
              className="px-3.5 py-2 rounded-full bg-surface/15 hover:bg-surface/25 backdrop-blur-sm text-on-primary text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border border-white/10 active:scale-95"
              title="Share Trip Plan"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              type="button"
              className="px-3.5 py-2 rounded-full bg-surface/15 hover:bg-surface/25 backdrop-blur-sm text-on-primary text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border border-white/10 active:scale-95"
              title="Regenerate Day"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Regenerate Day</span>
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-full bg-surface text-primary hover:bg-surface-container-low text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Bookmark className="w-3.5 h-3.5 fill-primary text-primary" />
              <span>Saved</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Unsplash Photo Attribution */}
      {trip.coverImageAttribution && (
        <div className="absolute bottom-2 right-4 z-20 text-[10px] text-on-primary/50 hover:text-on-primary/90 transition-colors pointer-events-auto hidden sm:block">
          <span>Photo by </span>
          <a
            href={`${trip.coverImageAttribution.photographerUrl}?utm_source=tripai&utm_medium=referral`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-on-primary font-medium"
          >
            {trip.coverImageAttribution.photographerName}
          </a>
          <span> on </span>
          <a
            href="https://unsplash.com/?utm_source=tripai&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-on-primary font-medium"
          >
            Unsplash
          </a>
        </div>
      )}
    </section>
  );
}
