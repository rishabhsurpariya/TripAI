"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { TripCard } from "@/components/trips/TripCard";
import rawTrips from "@/data/trips.json";
import { easing } from "@/lib/motion";
import type { Trip } from "@/types/trip";

const curatedTrips = (rawTrips as Trip[]).slice(0, 4);

export function CuratedTripsSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="py-12 border-t border-[#d3c4b9]/30">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
            Handpicked Collections
          </span>
          <h2
            className="text-2xl sm:text-3xl text-primary font-semibold tracking-tight mt-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Curated trips
          </h2>
          <p className="text-sm text-on-surface-variant mt-1.5">
            Handcrafted, AI-adapted itineraries tailored for slow and immersive travel.
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-1.5 text-secondary hover:text-primary text-sm font-medium transition-colors group"
          href="/explore"
        >
          <span>View all curated journeys</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
        </Link>
      </div>

      {/* 4 Card Grid with staggered reveal on scroll */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {curatedTrips.map((trip, idx) => (
          <motion.div
            key={trip.id}
            initial={
              prefersReduced
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.45,
              delay: prefersReduced ? 0 : idx * 0.08,
              ease: easing,
            }}
            whileHover={
              prefersReduced
                ? undefined
                : { y: -4, transition: { duration: 0.2, ease: easing } }
            }
            className="h-full"
          >
            <TripCard trip={trip} variant="grid" status="upcoming" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
