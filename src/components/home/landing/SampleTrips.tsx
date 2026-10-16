"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal, StaggerList } from "@/components/motion";
import rawTrips from "@/data/trips.json";
import type { Trip } from "@/types/trip";

const sampleTrips = (rawTrips as Trip[]).slice(0, 4);

export default function SampleTrips() {
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

        {/* Dense Grid of 4 Destination Cards */}
        <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sampleTrips.map((trip) => {
            const daysCount = trip.days && trip.days.length > 0 ? trip.days.length : 5;
            const formattedBudget = `₹${trip.totalBudget.toLocaleString("en-IN")}`;
            const targetUrl = trip.shareId ? `/shared/${trip.shareId}` : `/explore`;

            return (
              <Link
                key={trip.id}
                href={targetUrl}
                className="group relative rounded-2xl overflow-hidden bg-surface-container-lowest shadow-[0_12px_28px_-10px_rgba(110,79,50,0.12)] transition-all duration-300 hover:-translate-y-1.5 block cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden bg-[#efe7dc]">
                  <Image
                    src={trip.coverImageUrl || "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"}
                    alt={`${trip.destination}, ${trip.country}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 right-3 flex gap-1 z-10">
                    <span className="px-2 py-0.5 rounded-full bg-surface/90 text-primary text-[11px] font-medium backdrop-blur-xs">
                      {daysCount} Days
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface/90 text-primary text-[11px] font-medium backdrop-blur-xs">
                      {formattedBudget}
                    </span>
                  </div>

                  {/* Bottom Captions */}
                  <div className="absolute bottom-3 left-3 text-white z-10">
                    <h3
                      className="text-lg font-semibold leading-tight drop-shadow-xs"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {trip.destination}, {trip.country}
                    </h3>
                    <span className="text-xs text-white/90 drop-shadow-xs">
                      {trip.interests.slice(0, 2).join(" & ")}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </StaggerList>
      </div>
    </section>
  );
}
