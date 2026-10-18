"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion";
import { getCuratedTrips } from "@/lib/data/curated";

const sampleTrips = getCuratedTrips().slice(0, 4);

export default function SampleTrips() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="py-16 lg:py-24 px-2 sm:px-4" id="sample-trips">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Reveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-secondary font-medium">
                Inspiration
              </span>
              <h2
                className="text-3xl sm:text-4xl text-primary font-semibold mt-1 tracking-tight"
                style={{ fontFamily: "var(--font-serif)", fontWeight: 500, letterSpacing: "-0.02em" }}
              >
                Get inspired
              </h2>
            </div>
            <Link
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-secondary transition-colors"
              href="/explore"
            >
              Explore trips →
            </Link>
          </div>
        </Reveal>

        {/* Staggered Grid of 4 Destination Cards with Hover Zoom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sampleTrips.map((trip, idx) => {
            const daysCount = trip.days && trip.days.length > 0 ? trip.days.length : 5;
            const formattedBudget = `₹${trip.totalBudget.toLocaleString("en-IN")}`;
            const targetUrl = trip.shareId ? `/shared/${trip.shareId}` : `/explore`;

            return (
              <motion.div
                key={trip.id}
                initial={
                  prefersReduced
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 35, scale: 0.94 }
                }
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: prefersReduced ? 0 : idx * 0.12,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                whileHover={prefersReduced ? undefined : { y: -8, scale: 1.02 }}
                className="group relative rounded-2xl overflow-hidden bg-surface-container-lowest shadow-[0_12px_28px_-10px_rgba(110,79,50,0.12)] transition-shadow duration-300 hover:shadow-[0_20px_40px_-12px_rgba(110,79,50,0.22)] cursor-pointer"
              >
                <Link href={targetUrl} className="block relative h-64 overflow-hidden bg-[#efe7dc]">
                  <Image
                    src={trip.coverImageUrl || "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"}
                    alt={`${trip.destination}, ${trip.country}`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent transition-opacity duration-300 group-hover:from-primary/95" />

                  {/* Top Badges */}
                  <div className="absolute top-3 right-3 flex gap-1 z-10">
                    <span className="px-2 py-0.5 rounded-full bg-surface/90 text-primary text-[11px] font-medium backdrop-blur-xs shadow-xs">
                      {daysCount} Days
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface/90 text-primary text-[11px] font-medium backdrop-blur-xs shadow-xs">
                      {formattedBudget}
                    </span>
                  </div>

                  {/* Bottom Captions with slight hover lift */}
                  <div className="absolute bottom-3 left-3 text-white z-10 transition-transform duration-300 group-hover:-translate-y-1">
                    <h3
                      className="text-lg font-semibold leading-tight drop-shadow-xs"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {trip.destination}, {trip.country}
                    </h3>
                    <span className="text-xs text-white/90 drop-shadow-xs flex items-center gap-1 mt-0.5">
                      <span>{trip.interests.slice(0, 2).join(" & ")}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
