"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion";

export default function StickyNotesSection() {
  const prefersReduced = useReducedMotion();

  // Bouncy spring transition for dropping notes
  const noteDropSpring = (delay: number) => ({
    type: "spring" as const,
    stiffness: 320,
    damping: 14,
    mass: 0.8,
    delay: prefersReduced ? 0 : delay,
  });

  return (
    <section className="py-16 lg:py-24 px-4 bg-[#efe7dc] rounded-3xl my-6 overflow-hidden">
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

        <div className="relative max-w-4xl mx-auto min-h-[460px] flex items-center justify-center p-4 select-none">
          {/* Luggage tag accent dropping in */}
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -40, rotate: -15 }}
            whileInView={{ opacity: 1, y: 0, rotate: -5 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={noteDropSpring(0.1)}
            className="absolute -top-4 left-6 sm:left-14 flex items-center gap-3 z-10"
          >
            <div className="bg-[#54381d] text-[#dec1a9] px-4 py-1.5 rounded-md shadow-md text-xs font-mono tracking-wider">
              TRIPAI · TAG #402
            </div>
            <span className="text-secondary text-2xl rotate-45">📎</span>
          </motion.div>

          {/* Central activity card */}
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.92, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full max-w-md z-20"
          >
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
              <motion.div
                initial={prefersReduced ? undefined : { scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
                className="absolute -right-6 -bottom-6 bg-surface px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-medium text-primary border border-[#bba591]/30"
              >
                👆 Drag to Day 3
              </motion.div>
            </div>
          </motion.div>

          {/* Sticky note 1 — coral (drops in from top with bounce) */}
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -90, rotate: -18, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, rotate: -8, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={noteDropSpring(0.25)}
            whileHover={prefersReduced ? undefined : { rotate: 0, scale: 1.05, y: -4 }}
            className="absolute -left-2 sm:left-6 top-16 sm:top-24 w-44 bg-[#ffebe6] p-4 rounded-sm shadow-md z-30 cursor-pointer"
          >
            <div className="washi-tape absolute -top-2 left-6 w-12 h-3.5 rounded-sm" />
            <p className="font-handwriting text-2xl text-primary leading-tight">Sunset at Reis Magos!</p>
            <p className="font-handwriting text-base text-secondary mt-1">Get table by west wall</p>
          </motion.div>

          {/* Sticky note 2 — green (drops in from top with bounce) */}
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -95, rotate: 16, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, rotate: 6, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={noteDropSpring(0.4)}
            whileHover={prefersReduced ? undefined : { rotate: 0, scale: 1.05, y: -4 }}
            className="absolute -right-2 sm:right-10 top-8 sm:top-14 w-44 bg-[#e8f5e9] p-4 rounded-sm shadow-md z-30 cursor-pointer"
          >
            <div className="washi-tape absolute -top-2 right-6 w-12 h-3.5 rounded-sm" />
            <p className="font-handwriting text-2xl text-primary leading-tight">Pack linen shirts!</p>
            <p className="font-handwriting text-base text-secondary mt-1">Breezy afternoon walks</p>
          </motion.div>

          {/* Sticky note 3 — yellow (drops in from top with bounce) */}
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -80, rotate: -12, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, rotate: -4, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={noteDropSpring(0.55)}
            whileHover={prefersReduced ? undefined : { rotate: 0, scale: 1.05, y: -4 }}
            className="absolute right-4 sm:right-16 -bottom-4 sm:bottom-6 w-44 bg-[#fff9c4] p-4 rounded-sm shadow-md z-30 cursor-pointer"
          >
            <div className="washi-tape absolute -top-2 left-10 w-12 h-3.5 rounded-sm" />
            <p className="font-handwriting text-2xl text-primary leading-tight">Try cashew feni</p>
            <p className="font-handwriting text-base text-secondary mt-1">At Joseph Bar tavern</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
