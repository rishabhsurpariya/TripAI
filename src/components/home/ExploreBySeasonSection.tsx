"use client";

import Link from "next/link";
import { Sun, CloudRain, Snowflake, Flower2, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { easing } from "@/lib/motion";

interface SeasonItem {
  id: string;
  name: string;
  months: string;
  icon: typeof Sun;
  description: string;
  spots: string;
}

const SEASON_ITEMS: SeasonItem[] = [
  {
    id: "Summer",
    name: "Summer",
    months: "Jun – Aug",
    icon: Sun,
    description: "Ideal for alpine high-meadow hikes, endless twilight Nordic fjords, and clear blue water lagoons.",
    spots: "Lofoten Islands • Swiss Alps • Vancouver Island",
  },
  {
    id: "Monsoon",
    name: "Monsoon",
    months: "Jul – Sep",
    icon: CloudRain,
    description: "Verdant misty rainforests, roaring jungle waterfalls, and meditative quiet in emerald tea plantations.",
    spots: "Kerala Backwaters • Chiang Mai • Costa Rica",
  },
  {
    id: "Winter",
    name: "Winter",
    months: "Dec – Feb",
    icon: Snowflake,
    description: "Snow-dusted historic hamlets, thermal outdoor onsen soaks, and tranquil northern fireside retreats.",
    spots: "Hokkaido • Dolomite Valleys • Banff & Lake Louise",
  },
  {
    id: "Spring",
    name: "Spring",
    months: "Mar – May",
    icon: Flower2,
    description: "Vibrant wildflower blooms, bustling sunlit open-air cafes, citrus blossoms, and mild walking weather.",
    spots: "Provence Valleys • Kyoto Cherry Paths • Seville",
  },
];

export function ExploreBySeasonSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="py-12 pb-24 border-t border-[#d3c4b9]/30">
      <div className="max-w-xl mb-8">
        <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
          Seasonal Synchronicity
        </span>
        <h2
          className="text-2xl sm:text-3xl text-primary font-semibold tracking-tight mt-1"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Explore by season
        </h2>
        <p className="text-sm text-on-surface-variant mt-1.5">
          The right destination at the ideal moment of the year, harmonized with weather patterns and seasonal festivals.
        </p>
      </div>

      {/* 4 Wide Cards Grid with staggered scroll reveal & hover lift */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SEASON_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
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
              className="h-full rounded-2xl"
            >
              <Link
                href={`/explore?season=${encodeURIComponent(item.name)}`}
                className="group bg-surface-container-high rounded-2xl p-6 flex flex-col justify-between h-full shadow-xs hover:shadow-md transition-shadow duration-300 border border-[#d3c4b9]/30 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-xs group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">
                      {item.months}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-medium text-primary mt-5 flex items-center justify-between"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    <span>{item.name}</span>
                    <ArrowRight className="w-4 h-4 text-secondary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </h3>
                  <p className="text-xs text-secondary mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 bg-white/70 rounded-xl p-3 border border-[#d3c4b9]/20">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1 font-semibold">
                    Recommended spots
                  </span>
                  <p className="text-xs text-primary font-medium">
                    {item.spots}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
