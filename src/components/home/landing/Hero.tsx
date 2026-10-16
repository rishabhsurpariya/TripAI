"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, fadeIn } from "@/lib/motion";
import { Reveal } from "@/components/motion";

export default function Hero() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative pt-6 pb-20 lg:pb-32 px-2 sm:px-4">
      {/* ── Headline ── */}
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <Reveal>
          <h1
            className="text-[40px] sm:text-[56px] lg:text-[64px] leading-[1.1] text-primary tracking-tight font-semibold"
            style={{ fontFamily: "var(--font-serif)", fontWeight: 500, letterSpacing: "-0.02em" }}
          >
            Your trip, planned in{" "}
            <em className="italic font-normal" style={{ fontFamily: "var(--font-serif)" }}>
              seconds.
            </em>
          </h1>
        </Reveal>

        <Reveal>
          <p className="mt-4 text-secondary text-lg sm:text-xl font-sans">
            Enter a place and a budget.
          </p>
        </Reveal>

        {/* ── CTAs ── */}
        <Reveal>
          <div className="mt-8 flex items-center gap-4 flex-wrap justify-center">
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
          </div>
        </Reveal>
      </div>

      {/* ── Corkboard Collage ── */}
      <div className="relative max-w-5xl mx-auto mt-14 sm:mt-18 min-h-[580px] sm:min-h-[640px] flex items-center justify-center">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#d9c9ba]/30 via-[#fbddc4]/20 to-transparent rounded-[3rem] blur-2xl -z-10" />

        {/* Central dossier */}
        <motion.div
          variants={prefersReduced ? undefined : fadeIn}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-lg sm:max-w-xl bg-surface-container-lowest rounded-[28px] p-5 sm:p-7 shadow-[0_22px_45px_-12px_rgba(110,79,50,0.18)] rotate-[-1.5deg] z-20 transition-transform duration-300 hover:rotate-0"
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
        <div className="absolute left-2 sm:-left-4 top-10 sm:top-16 w-56 sm:w-64 bg-surface-container-lowest rounded-2xl p-3.5 shadow-[0_16px_36px_-10px_rgba(110,79,50,0.14)] -rotate-6 z-30 transition-transform duration-300 hover:rotate-0 hover:scale-105">
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
        </div>

        {/* Overlapping card 2 — Heritage dining */}
        <div className="absolute -right-2 sm:-right-8 top-12 sm:top-20 w-52 sm:w-60 bg-surface-container-lowest rounded-2xl p-3.5 shadow-[0_16px_36px_-10px_rgba(110,79,50,0.14)] rotate-6 z-[25] transition-transform duration-300 hover:rotate-0 hover:scale-105">
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
        </div>

        {/* Floating sticky note 1 */}
        <div className="absolute left-6 sm:left-12 -bottom-4 sm:bottom-4 w-44 bg-[#fffae0] p-4 rounded-md shadow-[0_10px_20px_-6px_rgba(110,79,50,0.12)] z-[35] animate-float-slow">
          <div className="washi-tape absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 rotate-1 rounded-sm" />
          <span className="text-[#a28973] text-lg">☀️</span>
          <p className="font-handwriting text-xl text-primary leading-tight mt-1">Golden photo hour 9am!</p>
          <p className="font-handwriting text-base text-secondary mt-0.5">Light hits the yellow walls</p>
        </div>

        {/* Floating sticky note 2 */}
        <div className="absolute -right-2 sm:right-6 bottom-16 sm:bottom-24 w-40 bg-[#fde8d7] p-3.5 rounded-md shadow-[0_10px_20px_-6px_rgba(110,79,50,0.12)] z-[35] animate-float-alt">
          <div className="washi-tape absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 -rotate-2 rounded-sm" />
          <p className="font-handwriting text-2xl text-primary leading-none">Fresh poi bread!</p>
          <p className="font-handwriting text-base text-secondary mt-1">From local bakery cart</p>
        </div>

        {/* Budget ring meter */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 sm:-bottom-8 bg-surface rounded-2xl px-5 py-3 shadow-[0_14px_30px_-8px_rgba(110,79,50,0.16)] flex items-center gap-4 z-40 border border-[#bba591]/30">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-[#d9c9ba]/50" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
              <path className="text-primary-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="92, 100" strokeLinecap="round" strokeWidth="3.5" />
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
          <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
        </div>
      </div>
    </section>
  );
}
