"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion";

export default function FinalCta() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/signup");
    }
  };

  const handlePillClick = (val: string) => {
    router.push(`/explore?q=${encodeURIComponent(val.replace(/^[^\w\s]+/, "").trim())}`);
  };

  return (
    <section className="py-16 lg:py-24 px-4 mb-12">
      <div className="max-w-5xl mx-auto bg-[#d9c9ba]/40 rounded-[2.5rem] p-6 sm:p-12 lg:p-16 text-center relative overflow-hidden shadow-[0_20px_45px_-12px_rgba(110,79,50,0.14)] border border-[#bba591]/30">
        {/* Paper plane drifting gently across the background */}
        {!prefersReduced && (
          <motion.div
            initial={{ left: "-10%", top: "25%", opacity: 0 }}
            animate={{
              left: ["-8%", "112%"],
              top: ["25%", "15%", "28%", "18%", "25%"],
              rotate: [8, 14, 6, 12, 10],
              opacity: [0, 0.45, 0.55, 0.45, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute pointer-events-none z-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl opacity-60">✈️</span>
              <div className="w-24 h-0.5 border-b-2 border-dashed border-[#8c6e52]/40" />
            </div>
          </motion.div>
        )}

        {/* Background decorative SVG */}
        <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none">
          <svg fill="none" height="280" viewBox="0 0 200 200" width="280">
            <circle cx="100" cy="100" r="80" stroke="#6e4f32" strokeDasharray="8 8" strokeWidth="2" />
            <path d="M 20 180 C 60 100 140 100 180 20" stroke="#6e4f32" strokeWidth="2.5" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Tag */}
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/90 text-primary text-[11px] uppercase tracking-widest mb-4 shadow-sm border border-[#bba591]/30 font-medium">
              <span>🧭</span>
              <span>Begin your next chapter</span>
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal>
            <h2
              className="text-4xl sm:text-5xl lg:text-[54px] text-primary font-semibold tracking-tight leading-tight max-w-3xl"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 500, letterSpacing: "-0.02em" }}
            >
              Where to next?
            </h2>
          </Reveal>

          {/* Description */}
          <Reveal>
            <p className="mt-4 max-w-2xl text-secondary text-base sm:text-lg leading-relaxed">
              Whether it&apos;s morning coffee on an alpine balcony, drifting through Provence&apos;s sunlit stone alleys,
              or lantern-lit temple walks at dusk — your bespoke journey is seconds away.
            </p>
          </Reveal>

          {/* Search bar */}
          <Reveal className="w-full max-w-2xl mt-8">
            <form
              onSubmit={handleSearch}
              className="bg-surface p-2 rounded-2xl sm:rounded-full shadow-[0_12px_28px_-8px_rgba(110,79,50,0.16)] border border-[#bba591]/30 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center gap-2.5 px-4 w-full flex-1 text-left">
                <span className="text-secondary text-lg">🔍</span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Where would you love to travel? (e.g. 5 days in Provence, Alpine cabin...)"
                  className="w-full bg-transparent text-primary placeholder-[#a28973] text-sm focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-xl sm:rounded-full bg-primary-container text-white hover:bg-secondary font-medium transition-all duration-200 shadow-sm shrink-0 flex items-center justify-center gap-1.5 text-sm cursor-pointer active:scale-95"
              >
                <span>Plan my trip</span>
                <span>→</span>
              </button>
            </form>
          </Reveal>

          {/* Suggested pills */}
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-secondary text-[11px]">Try exploring:</span>
              {[
                "🏔️ Italian Dolomites",
                "☕ Provence Cafes",
                "🏮 Kyoto Lanterns",
                "🌊 Amalfi Cliffside",
              ].map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => handlePillClick(pill)}
                  className="px-3 py-1 rounded-full bg-surface/70 hover:bg-surface text-primary border border-[#bba591]/25 cursor-pointer transition-colors active:scale-95"
                >
                  {pill}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Dual Polaroids */}
          <Reveal className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full max-w-4xl mt-12 text-left">
              {/* Card 1: Dolomites */}
              <div className="group relative bg-surface-container-lowest p-4 sm:p-5 rounded-2xl shadow-[0_16px_36px_-10px_rgba(110,79,50,0.18)] rotate-[-1.5deg] hover:rotate-0 hover:-translate-y-1 transition-all duration-300 border border-[#bba591]/30">
                <div className="washi-tape absolute -top-3 left-10 w-20 h-5 -rotate-2 z-20" />
                <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden mb-3.5 bg-[#efe7dc]">
                  <Image
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
                    alt="Warm alpine wooden chalet balcony overlooking mountain peaks"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-sm text-[11px] font-semibold text-primary shadow-sm flex items-center gap-1">
                    <span>🏔️</span> 4 Days · Curated
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className="text-lg font-semibold text-primary"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        Dolomite High Trails
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#f2ede7] text-secondary text-[10px] font-medium">
                        Scenic & Relaxed
                      </span>
                    </div>
                    <p className="font-handwriting text-lg text-[#6e4f32] mt-1">
                      Morning espresso with mountain fog 🏔️
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-xs font-bold text-primary block">€1,920</span>
                    <span className="text-[10px] text-secondary">2 travelers</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Provence */}
              <div className="group relative bg-surface-container-lowest p-4 sm:p-5 rounded-2xl shadow-[0_16px_36px_-10px_rgba(110,79,50,0.18)] rotate-[1.5deg] hover:rotate-0 hover:-translate-y-1 transition-all duration-300 border border-[#bba591]/30">
                <div className="washi-tape absolute -top-3 right-10 w-20 h-5 rotate-2 z-20" />
                <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden mb-3.5 bg-[#efe7dc]">
                  <Image
                    src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80"
                    alt="Sunlit European stone alleyway and sidewalk cafe in Provence"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-surface/90 border border-[#bba591]/30 text-[9px] font-mono tracking-widest text-[#8c6e52] shadow-sm uppercase">
                    EXPEDITION DISPATCH · NO. 842
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-sm text-[11px] font-semibold text-primary shadow-sm flex items-center gap-1">
                    <span>☕</span> 5 Days · Curated
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className="text-lg font-semibold text-primary"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        Provence Village Hideaway
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#ffd9b7] text-primary text-[10px] font-medium">
                        Food & Wine
                      </span>
                    </div>
                    <p className="font-handwriting text-lg text-[#6e4f32] mt-1">
                      Saturday market lavender & fresh brioche ☕
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-xs font-bold text-primary block">€2,150</span>
                    <span className="text-[10px] text-secondary">2 travelers</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Trust points */}
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-10 pt-8 border-t border-[#bba591]/30 w-full max-w-3xl text-secondary text-xs sm:text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-primary">⏱️</span>
                <span>Instant day-by-day pacing</span>
              </div>
              <span className="text-[#d3c4b9] hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-primary">💳</span>
                <span>Real-time budget tracking</span>
              </div>
              <span className="text-[#d3c4b9] hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-primary">📝</span>
                <span>100% customizable journal notes</span>
              </div>
            </div>
          </Reveal>

          {/* Action buttons */}
          <Reveal>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link
                href="/signup"
                className="px-9 py-4 rounded-full bg-primary-container text-white hover:bg-secondary font-medium transition-all duration-200 shadow-[0_12px_28px_-8px_rgba(110,79,50,0.25)] active:scale-95 text-base font-semibold"
              >
                Get started for free
              </Link>
              <Link
                href="/explore"
                className="px-8 py-4 rounded-full bg-surface border border-secondary text-primary hover:bg-[#d9c9ba]/30 font-medium transition-all duration-200 text-sm shadow-sm"
              >
                Browse community itineraries
              </Link>
            </div>
          </Reveal>

          <p className="mt-4 text-xs text-secondary/80 flex items-center justify-center gap-1.5">
            <span className="text-emerald-600 font-bold">✓</span>
            Joined by 18,400+ mindful travelers · Free to plan & share
          </p>
        </div>
      </div>
    </section>
  );
}
