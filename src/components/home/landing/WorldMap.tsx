"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion";

export default function WorldMap() {
  return (
    <section className="py-16 lg:py-24 px-4 bg-[#f2ede7]/50 rounded-3xl my-6">
      <div className="max-w-5xl mx-auto">
        {/* Header with clean metadata tag and concise headline */}
        <Reveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d9c9ba]/40 text-secondary text-[11px] uppercase tracking-widest mb-2 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Global Reach · 120+ Countries
            </div>
            <h2
              className="text-3xl sm:text-4xl text-primary font-semibold mt-1 tracking-tight"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 500, letterSpacing: "-0.02em" }}
            >
              Anywhere in the world
            </h2>
            <p className="mt-2 font-handwriting text-xl text-secondary">
              From coastal villages to volcanic highlands, planned to your taste.
            </p>
          </div>
        </Reveal>

        {/* Rich Illustrated World Map & Scrapbook Canvas */}
        <div className="relative w-full min-h-[580px] sm:min-h-[640px] rounded-3xl bg-[#f8f3ed] p-4 sm:p-8 shadow-[0_20px_40px_-10px_rgba(110,79,50,0.12)] border border-[#bba591]/30 overflow-hidden select-none">
          {/* Vintage Map Grid & Contour Lines */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#bba591 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Detailed Stylized Illustrated Continents Background SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 1000 580"
            fill="none"
          >
            {/* Stylized Continent Landmasses */}
            <g fill="#e8decb" opacity="0.85" stroke="#d3c4b9" strokeWidth="1.5" strokeLinejoin="round">
              {/* North America */}
              <path d="M 100 90 Q 140 70 190 75 Q 240 85 240 120 Q 230 150 200 170 Q 210 200 180 230 Q 160 250 140 230 Q 110 200 90 150 Z" />
              <path d="M 180 50 Q 220 40 240 60 Q 220 80 180 70 Z" />
              {/* South America */}
              <path d="M 190 270 Q 250 270 260 310 Q 270 370 230 440 Q 200 480 185 450 Q 170 380 180 320 Z" />
              {/* Europe & Scandinavia */}
              <path d="M 450 90 Q 480 70 510 90 Q 500 130 460 140 Q 430 130 435 105 Z" />
              <path d="M 420 130 Q 480 130 490 170 Q 470 210 420 190 Q 410 160 420 130 Z" />
              {/* Africa */}
              <path d="M 430 210 Q 520 200 540 260 Q 550 330 500 390 Q 470 420 450 370 Q 420 310 410 250 Z" />
              {/* Asia & Eurasia */}
              <path d="M 520 110 Q 640 80 780 100 Q 820 130 840 170 Q 820 220 760 230 Q 720 220 680 260 Q 630 250 600 210 Q 540 180 520 110 Z" />
              {/* India Subcontinent */}
              <path d="M 610 230 Q 660 240 655 285 Q 635 320 625 295 Q 615 260 610 230 Z" />
              {/* Japan Archipelago */}
              <path d="M 820 160 Q 835 155 845 170 Q 830 195 815 190 Z" />
              {/* Australia */}
              <path d="M 740 340 Q 820 330 835 380 Q 810 430 750 420 Q 720 380 740 340 Z" />
            </g>

            {/* Dashed Navigation & Flight Route Trajectories */}
            <g stroke="#a28973" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.75">
              <path d="M 380 120 Q 430 150 465 215" />
              <path d="M 475 225 Q 540 235 625 285" />
              <path d="M 635 280 Q 710 230 805 180" />
              <path d="M 825 175 Q 920 140 980 160" />
            </g>
          </svg>

          {/* Scrapbook Vignette & Stamp: Top Left Vintage Postmark */}
          <div className="absolute left-4 sm:left-8 top-6 opacity-60 rotate-[-12deg] pointer-events-none hidden sm:block">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#8c6e52] flex flex-col items-center justify-center text-[#8c6e52] text-[9px] font-mono tracking-widest text-center leading-tight p-2">
              <span>AIR MAIL</span>
              <span className="font-bold text-[11px] my-0.5">GLOBAL · EXP</span>
              <span>NO. 4882-TRIP</span>
            </div>
          </div>

          {/* Vintage Compass Rose Accent */}
          <div className="absolute right-6 top-6 opacity-45 pointer-events-none hidden md:flex items-center flex-col text-secondary">
            <span className="text-[36px]">🧭</span>
            <span className="text-[9px] font-mono tracking-widest uppercase mt-0.5">Wanderlust Index</span>
          </div>

          {/* DESTINATION 1: REYKJAVIK (ICELAND) POLAROID */}
          <Link
            href="/shared/reykjavik-glaciers-2026"
            className="absolute left-[8%] sm:left-[16%] top-12 sm:top-14 w-44 sm:w-52 bg-surface-container-lowest p-3 rounded-2xl shadow-[0_12px_28px_-8px_rgba(110,79,50,0.22)] -rotate-6 transition-all duration-300 hover:rotate-0 hover:scale-105 hover:z-40 group cursor-pointer z-20 border border-[#bba591]/30 block"
          >
            {/* Brass Push Pin */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-tr from-[#75593e] to-[#ffdcbe] border-2 border-surface shadow-md flex items-center justify-center z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2c1601]" />
            </div>
            <div className="w-full h-28 sm:h-32 rounded-xl overflow-hidden mb-2.5 relative bg-[#efe7dc]">
              <Image
                src="https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=600&q=80"
                alt="Iceland majestic waterfalls and volcanic canyons"
                fill
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-surface/90 backdrop-blur-sm text-[10px] font-semibold text-primary">
                Iceland
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-sm font-semibold text-primary leading-tight"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Reykjavik
                </div>
                <span className="text-[11px] text-secondary">6 Days · Glaciers & Thermal</span>
              </div>
              <span className="w-6 h-6 rounded-full bg-[#f2ede7] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-colors text-xs">
                ↗
              </span>
            </div>
          </Link>

          {/* Handwritten Tape Note near Reykjavik */}
          <div className="absolute left-[2%] sm:left-[8%] top-56 sm:top-60 w-36 bg-[#fffae0] p-2.5 rounded-md shadow-sm rotate-[-4deg] z-25 pointer-events-none hidden sm:block border border-[#bba591]/20">
            <div className="washi-tape absolute -top-2 left-6 w-10 h-3.5" />
            <p className="font-handwriting text-base text-primary leading-tight">Fjords & hot springs</p>
            <p className="font-handwriting text-xs text-secondary">Pack thermal layers!</p>
          </div>

          {/* DESTINATION 2: AMALFI COAST (ITALY) POLAROID */}
          <Link
            href="/shared/amalfi-coast-2026"
            className="absolute left-[28%] sm:left-[35%] top-[42%] sm:top-[38%] w-48 sm:w-56 bg-surface-container-lowest p-3 rounded-2xl shadow-[0_16px_36px_-10px_rgba(110,79,50,0.22)] rotate-3 transition-all duration-300 hover:rotate-0 hover:scale-105 hover:z-40 group cursor-pointer z-30 border border-[#bba591]/30 block"
          >
            {/* Mini Washi Tape on top */}
            <div className="washi-tape absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 rotate-[-2deg]" />
            <div className="w-full h-28 sm:h-32 rounded-xl overflow-hidden mb-2.5 relative bg-[#efe7dc]">
              <Image
                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80"
                alt="Amalfi coast cliffside village over turquoise waters"
                fill
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-surface/95 text-[10px] font-bold text-primary shadow-sm flex items-center gap-1">
                <span className="text-emerald-700 text-xs">✓</span> 7 Days
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-sm font-semibold text-primary leading-tight"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Amalfi Coast
                </div>
                <span className="text-[11px] text-secondary">Positano & Capri Ferries</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ffdcbe] text-[10px] font-semibold text-primary">
                €2,400
              </span>
            </div>
          </Link>

          {/* Travel Stamp Sticker: Positano */}
          <div className="absolute left-[22%] sm:left-[28%] bottom-16 sm:bottom-20 rotate-[-10deg] z-20 pointer-events-none hidden sm:block">
            <div className="px-3 py-1.5 rounded-lg border-2 border-[#8c6e52] bg-[#f8f3ed]/90 text-[#8c6e52] text-[10px] font-mono tracking-widest flex items-center gap-1.5 shadow-sm">
              <span>⛵</span>
              <span>MEDITERRANEAN · 2026</span>
            </div>
          </div>

          {/* DESTINATION 3: GOA (INDIA) POLAROID */}
          <Link
            href="/shared/goa-sun-2026"
            className="absolute left-[45%] sm:left-[52%] bottom-6 sm:bottom-12 w-48 sm:w-56 bg-surface-container-lowest p-3.5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(110,79,50,0.22)] -rotate-2 transition-all duration-300 hover:rotate-0 hover:scale-105 hover:z-40 group cursor-pointer z-35 border-2 border-primary-container/30 block"
          >
            {/* Golden Pin Badge */}
            <div className="absolute -top-3 left-8 w-7 h-7 rounded-full bg-primary text-surface shadow-md flex items-center justify-center z-10 text-xs">
              ★
            </div>
            <div className="w-full h-32 sm:h-36 rounded-xl overflow-hidden mb-2.5 relative bg-[#efe7dc]">
              <Image
                src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80"
                alt="Sunlit Goan Portuguese heritage villa veranda and bougainvillea"
                fill
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-surface/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-primary flex items-center gap-1">
                <span>🏡</span> Goa · 5 Days
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-sm font-semibold text-primary leading-tight"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Goa Heritage
                </div>
                <span className="text-[11px] text-secondary">Latin Quarter & Estuary</span>
              </div>
              <span className="text-xs font-bold text-primary">₹23,400</span>
            </div>
          </Link>

          {/* DESTINATION 4: KYOTO (JAPAN) POLAROID */}
          <Link
            href="/shared/kyoto-spring-2026"
            className="absolute right-[4%] sm:right-[10%] top-16 sm:top-20 w-48 sm:w-56 bg-surface-container-lowest p-3 rounded-2xl shadow-[0_16px_36px_-10px_rgba(110,79,50,0.22)] rotate-4 transition-all duration-300 hover:rotate-0 hover:scale-105 hover:z-40 group cursor-pointer z-30 border border-[#bba591]/30 block"
          >
            {/* Mini washi tape */}
            <div className="washi-tape absolute -top-3 right-8 w-16 h-5 rotate-[3deg]" />
            <div className="w-full h-32 sm:h-36 rounded-xl overflow-hidden mb-2.5 relative bg-[#efe7dc]">
              <Image
                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80"
                alt="Kyoto pagoda surrounded by foliage"
                fill
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-surface/90 text-[10px] font-bold text-primary shadow-sm">
                Kyoto · 6d
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-sm font-semibold text-primary leading-tight"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Kyoto & Nara
                </div>
                <span className="text-[11px] text-secondary">Autumn Temple Walk</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#f2ede7] text-[10px] font-semibold text-primary">
                $1,850
              </span>
            </div>
          </Link>

          {/* Handwritten Note tag near Kyoto */}
          <div className="absolute right-[2%] sm:right-[6%] bottom-16 sm:bottom-24 w-40 bg-[#ffebe6] p-3 rounded-md shadow-sm rotate-[-3deg] z-25 pointer-events-none hidden sm:block border border-[#bba591]/20">
            <div className="washi-tape absolute -top-2 left-10 w-10 h-3.5" />
            <p className="font-handwriting text-base text-primary leading-tight">Autumn foliage season!</p>
            <p className="font-handwriting text-xs text-secondary mt-0.5">Night lantern illuminations</p>
          </div>

          {/* Floating Little Airplane Icon on Flight Path */}
          <div className="flight-path-airplane-container absolute inset-0 pointer-events-none z-20">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 1000 580"
              fill="none"
            >
              <path
                id="airplane-flight-route"
                d="M 380 120 Q 430 150 465 215 L 475 225 Q 540 235 625 285 L 635 280 Q 710 230 805 180 L 825 175 Q 920 140 980 160"
                fill="none"
                stroke="#8c6e52"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                className="airplane-contrail-trail"
                opacity="0.55"
              />
              <path
                d="M 380 120 Q 430 150 465 215 L 475 225 Q 540 235 625 285 L 635 280 Q 710 230 805 180 L 825 175 Q 920 140 980 160"
                fill="none"
                stroke="#75593e"
                strokeWidth="1.5"
                strokeDasharray="3 5"
                className="airplane-contrail-pulse"
                opacity="0.7"
              />
            </svg>
            <div className="animated-airplane-tracker absolute left-0 top-0">
              <div className="-translate-x-1/2 -translate-y-1/2 bg-surface p-2 rounded-full shadow-md border border-[#bba591]/30 flex items-center justify-center text-primary">
                <span className="text-[18px]">✈️</span>
              </div>
            </div>
          </div>

          {/* Floating Mini Compass Legend Pill */}
          <div className="absolute left-4 sm:left-8 bottom-4 sm:bottom-8 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#bba591]/30 shadow-md flex items-center gap-3 z-30 text-xs font-medium text-primary">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Curated Trails</span>
            </div>
            <span className="text-[#d3c4b9]">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Live Optimized</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
