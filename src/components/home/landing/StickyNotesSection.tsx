"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion";

export default function StickyNotesSection() {
  return (
    <section className="py-16 lg:py-24 px-4 bg-[#efe7dc] rounded-3xl my-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-widest text-secondary font-medium">Bespoke</span>
            <h2
              className="text-3xl sm:text-4xl text-primary font-semibold mt-1 tracking-tight"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 500, letterSpacing: "-0.02em" }}
            >
              Plans that feel like yours.
            </h2>
          </div>
        </Reveal>

        <div className="relative max-w-4xl mx-auto min-h-[460px] flex items-center justify-center p-4">
          {/* Luggage tag accent */}
          <div className="absolute -top-4 left-6 sm:left-14 flex items-center gap-3 z-10">
            <div className="bg-[#54381d] text-[#dec1a9] px-4 py-1.5 rounded-md shadow-md text-xs font-mono tracking-wider rotate-[-5deg]">
              TRIPAI · TAG #402
            </div>
            <span className="text-secondary text-2xl rotate-45">📎</span>
          </div>

          {/* Central activity card */}
          <Reveal className="relative w-full max-w-md z-20">
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_20px_40px_-10px_rgba(110,79,50,0.16)]">
              <div className="washi-tape absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-6 rotate-1 rounded-sm" />
              <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 shadow-sm relative">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80"
                  alt="Sunset at Reis Magos Fort with ocean views"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-secondary">Sunset Session · Day 4</span>
                  <div className="text-lg font-semibold text-primary mt-0.5">Reis Magos Fort Cocktails</div>
                </div>
                <span className="w-8 h-8 rounded-full bg-[#f2ede7] flex items-center justify-center text-primary">❤️</span>
              </div>
              {/* Drag hint */}
              <div className="absolute -right-6 -bottom-6 bg-surface px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-medium text-primary border border-[#bba591]/30">
                👆 Drag to Day 3
              </div>
            </div>
          </Reveal>

          {/* Sticky note 1 — coral */}
          <div className="absolute -left-2 sm:left-6 top-16 sm:top-24 w-44 bg-[#ffebe6] p-4 rounded-sm shadow-md rotate-[-8deg] z-30 transition-transform duration-300 hover:rotate-0">
            <div className="washi-tape absolute -top-2 left-6 w-12 h-3.5 rounded-sm" />
            <p className="font-handwriting text-2xl text-primary leading-tight">Sunset at Reis Magos!</p>
            <p className="font-handwriting text-base text-secondary mt-1">Get table by west wall</p>
          </div>

          {/* Sticky note 2 — green */}
          <div className="absolute -right-2 sm:right-10 top-8 sm:top-14 w-44 bg-[#e8f5e9] p-4 rounded-sm shadow-md rotate-[6deg] z-30 transition-transform duration-300 hover:rotate-0">
            <div className="washi-tape absolute -top-2 right-6 w-12 h-3.5 rounded-sm" />
            <p className="font-handwriting text-2xl text-primary leading-tight">Pack linen shirts!</p>
            <p className="font-handwriting text-base text-secondary mt-1">Breezy afternoon walks</p>
          </div>

          {/* Sticky note 3 — yellow */}
          <div className="absolute right-4 sm:right-16 -bottom-4 sm:bottom-6 w-44 bg-[#fff9c4] p-4 rounded-sm shadow-md rotate-[-4deg] z-30 transition-transform duration-300 hover:rotate-0">
            <div className="washi-tape absolute -top-2 left-10 w-12 h-3.5 rounded-sm" />
            <p className="font-handwriting text-2xl text-primary leading-tight">Try cashew feni</p>
            <p className="font-handwriting text-base text-secondary mt-1">At Joseph Bar tavern</p>
          </div>
        </div>
      </div>
    </section>
  );
}
