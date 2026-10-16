"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { Reveal } from "@/components/motion";

const CALLOUTS = [
  { id: "timeline", label: "Day-by-day plan", icon: "📅" },
  { id: "transit",  label: "Transport",       icon: "🚢" },
  { id: "hotels",   label: "Hotels",           icon: "🏨" },
  { id: "budget",   label: "Budget",           icon: "💰" },
  { id: "map",      label: "Map",              icon: "🗺️" },
] as const;

type CalloutId = (typeof CALLOUTS)[number]["id"];

export default function FeatureShowcase() {
  const [active, setActive] = useState<CalloutId>("timeline");
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.3 });
  const prefersReduced = useReducedMotion();

  // Auto-cycle callouts sequentially when in view
  useEffect(() => {
    if (prefersReduced || !inView || isPaused) return;

    const interval = setInterval(() => {
      setActive((prev) => {
        const currentIndex = CALLOUTS.findIndex((c) => c.id === prev);
        const nextIndex = (currentIndex + 1) % CALLOUTS.length;
        return CALLOUTS[nextIndex].id;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [inView, isPaused, prefersReduced]);

  const highlight = (id: CalloutId) =>
    active === id
      ? "ring-2 ring-primary bg-[#ffdcbe]/25 scale-[1.015] shadow-md transition-all duration-300"
      : "transition-all duration-300 opacity-90";

  return (
    <section ref={containerRef} className="py-16 lg:py-24 px-2 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-secondary font-medium">Comprehensive</span>
            <h2
              className="text-3xl sm:text-4xl text-primary font-semibold mt-1 tracking-tight"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 500, letterSpacing: "-0.02em" }}
            >
              Everything in one plan
            </h2>
          </div>
        </Reveal>

        {/* Callout pills appearing one after another */}
        <div
          className="flex flex-wrap items-center justify-center gap-2.5 mb-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {CALLOUTS.map((c, idx) => (
            <motion.button
              key={c.id}
              initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 15, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: prefersReduced ? 0 : idx * 0.1,
                duration: 0.4,
                ease: "easeOut",
              }}
              onClick={() => {
                setActive(c.id);
                setIsPaused(true);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                active === c.id
                  ? "bg-primary text-white shadow-sm ring-2 ring-primary/30"
                  : "bg-surface-container text-primary hover:bg-primary hover:text-white"
              }`}
            >
              <span>{c.icon}</span> {c.label}
            </motion.button>
          ))}
        </div>

        {/* Browser mockup */}
        <Reveal>
          <div
            className="bg-surface-container-lowest rounded-3xl p-4 sm:p-7 shadow-[0_25px_60px_-15px_rgba(110,79,50,0.14)] border border-[#bba591]/30"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Window bar */}
            <div className="flex items-center justify-between pb-5 border-b border-[#bba591]/20">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#d3c4b9]" />
                <span className="w-3 h-3 rounded-full bg-[#d3c4b9]" />
                <span className="w-3 h-3 rounded-full bg-[#d3c4b9]" />
                <span className="ml-3 text-xs font-mono text-secondary">tripai.com/plan/goa-heritage-5d</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#d9c9ba]/30 text-xs font-medium text-primary">PDF Export</span>
                <span className="text-secondary text-lg">↗</span>
              </div>
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              {/* Left: itinerary */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex gap-2 border-b border-[#bba591]/20 pb-3 overflow-x-auto">
                  {["Day 1 · Old Goa", "Day 2 · Fontainhas", "Day 3 · Divar Island", "Day 4 · Spice Route"].map((d, i) => (
                    <button
                      key={d}
                      className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                        i === 0 ? "bg-primary text-white" : "bg-[#f2ede7] text-primary"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                {/* Timeline */}
                <div className={`p-4 rounded-2xl bg-surface ${highlight("timeline")}`} id="mockup-timeline">
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#bba591]">
                    {[
                      { time: "09:00 AM · Architecture", title: "Basilica of Bom Jesus", desc: "Baroque architecture tour with certified guide" },
                      { time: "11:30 AM · Island Life",   title: "Divar Island Cycling Trail", desc: null, transit: "Mandovi River Ferry · 15m" },
                      { time: "06:00 PM · Sunset Highlight", title: "Reis Magos Fort Cocktails", desc: null },
                    ].map((node, i) => (
                      <div key={i} className="relative">
                        <span className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ring-4 ring-surface ${i === 1 ? "bg-secondary" : "bg-primary"}`} />
                        {node.transit && (
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffdcbe] text-primary text-[11px] font-medium my-1 ${highlight("transit")}`} id="mockup-transit">
                            ⬇ {node.transit}
                          </div>
                        )}
                        <div className="text-xs font-medium text-secondary">{node.time}</div>
                        <div className="text-sm font-semibold text-primary">{node.title}</div>
                        {node.desc && <div className="text-xs text-secondary mt-0.5">{node.desc}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hotel card */}
                <div className={`p-4 rounded-2xl bg-surface-container-low flex items-center justify-between ${highlight("hotels")}`} id="mockup-hotels">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface overflow-hidden shrink-0 relative">
                      <Image
                        src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=100&q=80"
                        alt="Boutique stay"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-medium tracking-wide text-secondary">Boutique Stay</span>
                      <div className="text-sm font-semibold text-primary">Ahilya by the Sea</div>
                      <div className="text-xs text-secondary">Dolphin Bay, Nerul · ₹9,200/night</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary-container text-white text-xs font-medium shrink-0">Reserved</span>
                </div>
              </div>

              {/* Right: budget + map */}
              <div className="lg:col-span-5 space-y-4">
                {/* Budget */}
                <div className={`p-4 rounded-2xl bg-[#f2ede7] ${highlight("budget")}`} id="mockup-budget">
                  <div className="flex items-center justify-between text-xs font-medium mb-2">
                    <span className="text-primary font-semibold">Live Budget Tracker</span>
                    <span className="text-secondary">₹23,400 of ₹25,000</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: "88%" }} />
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[11px] text-center">
                    <div className="bg-surface/80 rounded py-1">₹11k Stays</div>
                    <div className="bg-surface/80 rounded py-1">₹7.2k Food</div>
                    <div className="bg-surface/80 rounded py-1">₹5.2k Tours</div>
                  </div>
                </div>

                {/* Map */}
                <div className={`relative rounded-2xl overflow-hidden shadow-sm h-52 ${highlight("map")}`} id="mockup-map">
                  <Image
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                    alt="Map view of Goa"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                  <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-semibold text-primary shadow flex items-center gap-1">
                    📍 4 stops · 18 km total
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
