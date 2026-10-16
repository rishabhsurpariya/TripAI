"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { easing } from "@/lib/motion";

interface InterestItem {
  id: string;
  name: string;
  subtitle: string;
  queryValue: string;
  imageUrl: string;
}

const INTEREST_ITEMS: InterestItem[] = [
  {
    id: "beaches",
    name: "Beaches",
    subtitle: "Coastal Calm",
    queryValue: "Beaches",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mountains",
    name: "Mountains",
    subtitle: "High Altitudes",
    queryValue: "Mountains",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "heritage",
    name: "Heritage",
    subtitle: "Living History",
    queryValue: "Heritage",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "food",
    name: "Food & Wine",
    subtitle: "Epicurean",
    queryValue: "Food",
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "adventure",
    name: "Adventure",
    subtitle: "Active Paths",
    queryValue: "Adventure",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "spiritual",
    name: "Spiritual",
    subtitle: "Sanctuaries",
    queryValue: "Spiritual",
    imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "wildlife",
    name: "Wildlife",
    subtitle: "Expeditions",
    queryValue: "Wildlife",
    imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "nightlife",
    name: "Nightlife",
    subtitle: "Nocturne",
    queryValue: "Nightlife",
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80",
  },
];

export function ExploreByInterestSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="py-12 border-t border-[#d3c4b9]/30">
      <div className="max-w-xl mb-8">
        <span className="text-xs uppercase tracking-wider text-secondary font-semibold">
          Thematic Gateways
        </span>
        <h2
          className="text-2xl sm:text-3xl text-primary font-semibold tracking-tight mt-1"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Explore by interest
        </h2>
        <p className="text-sm text-on-surface-variant mt-1.5">
          Follow your personal rhythm and passions across destinations designed for deep engagement.
        </p>
      </div>

      {/* 8 Card Grid with staggered reveal on scroll */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {INTEREST_ITEMS.map((item, idx) => (
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
              delay: prefersReduced ? 0 : (idx % 4) * 0.08,
              ease: easing,
            }}
            whileHover={
              prefersReduced
                ? undefined
                : { y: -4, transition: { duration: 0.2, ease: easing } }
            }
            className="rounded-2xl overflow-hidden"
          >
            <Link
              href={`/explore?interest=${encodeURIComponent(item.queryValue)}`}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 block bg-[#efe7dc]"
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent transition-opacity group-hover:opacity-90" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white z-10">
                <div>
                  <span className="text-[11px] text-[#ffdcbf] uppercase tracking-wider block font-medium">
                    {item.subtitle}
                  </span>
                  <h3
                    className="text-lg font-medium tracking-tight mt-0.5"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {item.name}
                  </h3>
                </div>
                <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-200">
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
