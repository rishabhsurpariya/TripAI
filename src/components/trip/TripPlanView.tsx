"use client";

import { useState } from "react";
import {
  CalendarDays,
  Plane,
  Bus,
  Building2,
  Wallet,
  Map,
  Edit2,
  Printer,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Trip } from "@/types/trip";
import { easing } from "@/lib/motion";
import { TripHeader } from "./TripHeader";
import { DayTimeline } from "./DayTimeline";
import { BudgetSidePanel } from "./BudgetSidePanel";
import { GettingThereTab } from "./GettingThereTab";
import { LocalTransportTab } from "./LocalTransportTab";
import { HotelsTab } from "./HotelsTab";
import { BudgetTab } from "./BudgetTab";
import { TripMapTab } from "./TripMapTab";

interface TripPlanViewProps {
  trip: Trip;
}

type TabKey =
  | "itinerary"
  | "getting-there"
  | "local-transport"
  | "hotels"
  | "budget"
  | "map";

export function TripPlanView({ trip }: TripPlanViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("itinerary");
  const shouldReduceMotion = useReducedMotion();

  const daysCount = trip.days?.length || 5;
  const totalBudgetSpent = Object.values(trip.budget || {}).reduce((a, b) => a + b, 0);

  const tabs: {
    key: TabKey;
    label: string;
    icon: React.ReactNode;
    badge: string;
  }[] = [
    {
      key: "itinerary",
      label: "Itinerary",
      icon: <CalendarDays className="w-4 h-4" />,
      badge: `${daysCount} Days`,
    },
    {
      key: "getting-there",
      label: "Getting There",
      icon: <Plane className="w-4 h-4" />,
      badge: "Flights & Train",
    },
    {
      key: "local-transport",
      label: "Local Transport",
      icon: <Bus className="w-4 h-4" />,
      badge: "Transit & Cabs",
    },
    {
      key: "hotels",
      label: "Hotels",
      icon: <Building2 className="w-4 h-4" />,
      badge: `${daysCount} Stays`,
    },
    {
      key: "budget",
      label: "Budget",
      icon: <Wallet className="w-4 h-4" />,
      badge: `$${totalBudgetSpent.toLocaleString()}`,
    },
    {
      key: "map",
      label: "Map",
      icon: <Map className="w-4 h-4" />,
      badge: "Routes",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-[1240px] mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-8 text-on-surface">
      {/* 1. TRIP HEADER HERO */}
      <TripHeader trip={trip} />

      {/* 2. STICKY SECTION TABS BAR */}
      <section className="sticky top-16 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/50 -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-2.5">
          {/* Primary Tabs */}
          <nav
            aria-label="Trip plan tabs"
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 relative"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex items-center gap-1.5 py-2 px-3.5 sm:px-4 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-primary-container text-on-primary shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-on-primary/20 text-on-primary"
                        : "bg-surface-container-highest text-tertiary"
                    }`}
                  >
                    {tab.badge}
                  </span>

                  {/* Animated underline that slides between tabs */}
                  {isActive && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute -bottom-2.5 left-2 right-2 h-[2.5px] bg-primary rounded-full z-10"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 450, damping: 32 }
                      }
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* View Controls & Scrapbook Toggles */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            {/* View / Edit Mode Switcher (Visual only for now) */}
            <div className="flex items-center bg-surface-container-low p-1 rounded-full shadow-inner border border-outline-variant/20">
              <button
                type="button"
                className="px-3.5 py-1 rounded-full text-xs bg-surface-container-lowest shadow-xs text-primary font-bold transition-all cursor-default"
              >
                View
              </button>
              <button
                type="button"
                className="px-3.5 py-1 rounded-full text-xs text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-1 cursor-pointer"
                title="Edit mode coming in next phase"
              >
                <Edit2 className="w-3 h-3 text-secondary" />
                <span>Rearrange</span>
              </button>
            </div>

            {/* Print / Export Scrapbook Button */}
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer border border-outline-variant/30"
              title="Export journal"
              aria-label="Export journal"
            >
              <Printer className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE CONTENT: TAB PANELS (Animated Crossfade) */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: easing }}
            className="w-full"
          >
            {activeTab === "itinerary" && (
              /* TAB 1: ITINERARY VIEW (2 COLUMNS: Scrapbook Timeline + Sticky Side Info) */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                {/* LEFT 67% (8 COLUMNS): TIMELINE & ALL DAYS */}
                <div className="lg:col-span-8 flex flex-col space-y-10">
                  <DayTimeline days={trip.days || []} />
                </div>

                {/* RIGHT 33% (4 COLUMNS): STICKY SCRAPBOOK SIDE PANEL */}
                <BudgetSidePanel
                  trip={trip}
                  onOpenBudgetTab={() => setActiveTab("budget")}
                />
              </div>
            )}

            {activeTab === "getting-there" && (
              /* TAB 2: GETTING THERE */
              <GettingThereTab trip={trip} />
            )}

            {activeTab === "local-transport" && (
              /* TAB 3: LOCAL TRANSPORT */
              <LocalTransportTab trip={trip} />
            )}

            {activeTab === "hotels" && (
              /* TAB 4: HOTELS */
              <HotelsTab trip={trip} />
            )}

            {activeTab === "budget" && (
              /* TAB 5: BUDGET DETAILED VIEW */
              <BudgetTab trip={trip} />
            )}

            {activeTab === "map" && (
              /* TAB 6: INTERACTIVE ROUTE MAP */
              <TripMapTab trip={trip} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
