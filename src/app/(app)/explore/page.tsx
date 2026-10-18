"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Compass,
  Waves,
  Mountain,
  Landmark,
  UtensilsCrossed,
  Flame,
  Sun,
  Snowflake,
  CloudRain,
  Flower2,
  TreePine,
  Moon,
  SlidersHorizontal,
  ChevronDown,
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
  LayoutGrid,
  Map as MapIcon,
  Check,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { easing } from "@/lib/motion";
import { getCuratedTrips } from "@/lib/data/curated";
import { Trip } from "@/types/trip";
import { Navbar } from "@/components/layout/Navbar";
import { TripCard } from "@/components/trips/TripCard";
import { INTERESTS, SEASONS } from "@/lib/constants";

// Helper to calculate approximate USD cost for filtering
function getTripCostUsd(trip: Trip): number {
  if (trip.totalBudget > 10000) {
    return Math.round(trip.totalBudget / 80);
  }
  return trip.totalBudget;
}

// Helper to determine trip duration in days
function getTripDuration(trip: Trip): number {
  if (trip.days && trip.days.length > 0) return trip.days.length;
  const knownDurations: Record<string, number> = {
    "trip-1": 5,
    "trip-2": 4,
    "trip-3": 6,
    "trip-4": 6,
    "trip-5": 3,
    "trip-6": 5,
    "trip-7": 7,
    "trip-8": 6,
    "trip-9": 5,
    "trip-10": 4,
    "trip-11": 7,
    "trip-12": 7,
  };
  return knownDurations[trip.id] || 5;
}

// Category overview metadata for atmospheric banner & editorial texts
const CATEGORY_META: Record<
  string,
  {
    title: string;
    description: string;
    overviewTitle: string;
    overviewSubtitle: string;
    icon: React.ReactNode;
  }
> = {
  Beaches: {
    title: "Beach getaways",
    description:
      "Curated journeys crafted to help you unwind along idyllic shores, secret coves, and warm coastal rhythms.",
    overviewTitle: "Average 5–8 days · Warm seas",
    overviewSubtitle: "Ideal for relaxation, coastal walks & golden sunsets",
    icon: <Waves className="w-5 h-5" />,
  },
  Mountains: {
    title: "Mountain escapes",
    description:
      "High-altitude trails, pine-scented valleys, and alpine lodges bathed in morning light.",
    overviewTitle: "Average 4–7 days · Crisp peaks",
    overviewSubtitle: "Ideal for trekking, panoramic views & fresh mountain air",
    icon: <Mountain className="w-5 h-5" />,
  },
  Heritage: {
    title: "Heritage & living history",
    description:
      "Timeless temples, medieval citadels, and centuries of artisan tradition.",
    overviewTitle: "Average 3–6 days · Ancient wonders",
    overviewSubtitle: "Ideal for historic architecture, monuments & cultural immersion",
    icon: <Landmark className="w-5 h-5" />,
  },
  Food: {
    title: "Culinary & wine journeys",
    description:
      "Epicurean trails through neighborhood markets, vineyard estates, and Michelin-starred taverns.",
    overviewTitle: "Average 4–7 days · Rich gastronomy",
    overviewSubtitle: "Ideal for tasting menus, cooking masterclasses & wine pairings",
    icon: <UtensilsCrossed className="w-5 h-5" />,
  },
  Adventure: {
    title: "Adventure expeditions",
    description:
      "Off-the-beaten-path expeditions, rugged coastlines, and outdoor adrenaline.",
    overviewTitle: "Average 5–8 days · Active paths",
    overviewSubtitle: "Ideal for kayaking, high mountain passes & remote nature",
    icon: <Flame className="w-5 h-5" />,
  },
  Spiritual: {
    title: "Spiritual sanctuaries",
    description:
      "Sacred rivers, Zen meditation gardens, and peaceful retreats for deep reflection.",
    overviewTitle: "Average 3–5 days · Contemplative spaces",
    overviewSubtitle: "Ideal for temple stays, sunrise rituals & serene contemplation",
    icon: <Sparkles className="w-5 h-5" />,
  },
  Wildlife: {
    title: "Wildlife & safari",
    description:
      "Vast savannahs, protected biosphere reserves, and intimate encounters with native fauna.",
    overviewTitle: "Average 5–8 days · Natural habitats",
    overviewSubtitle: "Ideal for game drives, birdwatching & pristine wilderness",
    icon: <TreePine className="w-5 h-5" />,
  },
  Nightlife: {
    title: "Vibrant nightlife & evening pulse",
    description:
      "Rooftop lounges, beachside evening sessions, and colorful night markets.",
    overviewTitle: "Average 3–5 days · Sunset to dawn",
    overviewSubtitle: "Ideal for evening dining, live music & lively social scenes",
    icon: <Moon className="w-5 h-5" />,
  },
  Summer: {
    title: "Summer journeys",
    description:
      "Sun-drenched coastlines, sapphire waters, and long warm golden evenings.",
    overviewTitle: "Long sunny days · Coastal breezes",
    overviewSubtitle: "Peak travel season across Mediterranean, islands & highlands",
    icon: <Sun className="w-5 h-5" />,
  },
  Winter: {
    title: "Winter wonderlands",
    description:
      "Snow-draped chalets, quiet cultural capitals, and warm tropical winter escapes.",
    overviewTitle: "Cozy chalets · Crisp mountain air",
    overviewSubtitle: "Ideal for skiing, thermal onsens & magical winter lights",
    icon: <Snowflake className="w-5 h-5" />,
  },
  Spring: {
    title: "Spring blossom escapes",
    description:
      "Mild breezes, cherry blossoms, and waking landscapes free of heavy crowds.",
    overviewTitle: "Gentle climate · Blooming scenery",
    overviewSubtitle: "Best shoulder season for relaxed walking & photography",
    icon: <Flower2 className="w-5 h-5" />,
  },
  Monsoon: {
    title: "Monsoon & lush foliage",
    description:
      "Mist-covered hills, cascading waterfalls, and vibrant emerald tea plantations.",
    overviewTitle: "Dramatic waterfalls · Verdant nature",
    overviewSubtitle: "Atmospheric rainforest trails, petrichor & quiet resorts",
    icon: <CloudRain className="w-5 h-5" />,
  },
};

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  // 1. Read query parameters
  const queryInterest = searchParams.get("interest");
  const querySeason = searchParams.get("season");
  const queryPreview = searchParams.get("preview"); // 'loading' | 'empty' | null

  // Determine active category mode and value
  const isSeasonMode = Boolean(querySeason && !queryInterest);
  const activeInterest = queryInterest || (isSeasonMode ? "" : "Beaches");
  const activeSeason = querySeason || (isSeasonMode ? "Summer" : "");
  const activeFilterName = isSeasonMode ? activeSeason : activeInterest;

  // 2. Filter & Sort state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<
    "recommended" | "budget-asc" | "duration-asc"
  >("recommended");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Secondary filters
  const [selectedDuration, setSelectedDuration] = useState<
    "all" | "1-3" | "4-7" | "8+"
  >("all");
  const [selectedPace, setSelectedPace] = useState<
    "all" | "relaxed" | "moderate" | "high"
  >("all");
  const [maxBudgetFilter, setMaxBudgetFilter] = useState<number>(4500);

  // Count active extra filters
  const activeExtraFilterCount =
    (selectedDuration !== "all" ? 1 : 0) +
    (selectedPace !== "all" ? 1 : 0) +
    (maxBudgetFilter < 4500 ? 1 : 0);

  // Category Metadata lookup
  const meta =
    CATEGORY_META[activeFilterName] ||
    CATEGORY_META["Beaches"];

  // 3. Update query parameters when clicking category chips
  const handleSelectInterest = (interest: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("season");
    params.set("interest", interest);
    router.push(`/explore?${params.toString()}`, { scroll: false });
  };

  const handleSelectSeason = (season: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("interest");
    params.set("season", season);
    router.push(`/explore?${params.toString()}`, { scroll: false });
  };

  const handleSwitchToInterests = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("season");
    params.set("interest", "Beaches");
    router.push(`/explore?${params.toString()}`, { scroll: false });
  };

  const handleSwitchToSeasons = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("interest");
    params.set("season", "Summer");
    router.push(`/explore?${params.toString()}`, { scroll: false });
  };

  // Reset secondary filters
  const handleResetFilters = () => {
    setSelectedDuration("all");
    setSelectedPace("all");
    setMaxBudgetFilter(4500);
  };

  // 4. Filter & sort trips
  const filteredTrips = useMemo(() => {
    const allTrips = getCuratedTrips();

    return allTrips
      .filter((trip) => {
        // Interest or Season match
        if (isSeasonMode) {
          if (
            activeSeason &&
            !trip.seasons?.some(
              (s) => s.toLowerCase() === activeSeason.toLowerCase()
            )
          ) {
            return false;
          }
        } else {
          if (
            activeInterest &&
            !trip.interests?.some((i) =>
              i.toLowerCase().includes(activeInterest.toLowerCase())
            )
          ) {
            return false;
          }
        }

        // Duration filter
        const duration = getTripDuration(trip);
        if (selectedDuration === "1-3" && duration > 3) return false;
        if (selectedDuration === "4-7" && (duration < 4 || duration > 7))
          return false;
        if (selectedDuration === "8+" && duration < 8) return false;

        // Budget filter
        const costUsd = getTripCostUsd(trip);
        if (costUsd > maxBudgetFilter) return false;

        // Tempo / Style filter
        if (selectedPace === "relaxed" && trip.style !== "comfort") return false;
        if (selectedPace === "high" && trip.style !== "adventure") return false;
        if (selectedPace === "moderate" && trip.style !== "budget") return false;

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === "budget-asc") {
          return getTripCostUsd(a) - getTripCostUsd(b);
        }
        if (selectedSort === "duration-asc") {
          return getTripDuration(a) - getTripDuration(b);
        }
        return 0; // "recommended" maintains curated order
      });
  }, [
    isSeasonMode,
    activeInterest,
    activeSeason,
    selectedDuration,
    maxBudgetFilter,
    selectedPace,
    selectedSort,
  ]);

  const isLoading = queryPreview === "loading";
  const isEmpty = queryPreview === "empty" || (!isLoading && filteredTrips.length === 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f2ec] text-[#1d1b18] antialiased">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Main Editorial Canvas */}
      <main className="w-full flex-1 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* ======================================================= */}
        {/* SECTION A: BREADCRUMB & EDITORIAL HEADER */}
        {/* ======================================================= */}
        <div className="flex flex-col gap-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-semibold text-[#75593e]"
          >
            <Link
              href="/home"
              className="hover:text-[#54381d] transition-colors"
            >
              Home
            </Link>
            <span className="text-[#d3c4b9] font-light">/</span>
            <Link
              href="/explore"
              className="hover:text-[#54381d] transition-colors"
            >
              Explore
            </Link>
            <span className="text-[#d3c4b9] font-light">/</span>
            <span className="text-[#54381d] font-bold">
              {activeFilterName}
            </span>
          </nav>

          {/* Title & Headline Block */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#75593e] mb-2">
                Curated Collection · 2026
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#54381d] font-medium tracking-tight">
                {meta.title}
              </h1>
              <p className="text-sm sm:text-base text-[#4f453c] mt-2 leading-relaxed">
                {meta.description}
              </p>
            </div>

            {/* Editorial Atmosphere Metric Banner */}
            <div className="bg-[#f8f3ed] p-5 rounded-2xl shadow-xs flex items-center gap-4 border border-[#d3c4b9]/40 max-w-sm shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#ffd9b7]/50 flex items-center justify-center text-[#54381d] shrink-0">
                {meta.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4f453c]">
                  ATMOSPHERE OVERVIEW
                </span>
                <span className="text-sm text-[#54381d] font-semibold">
                  {meta.overviewTitle}
                </span>
                <span className="text-xs text-[#75593e]">
                  {meta.overviewSubtitle}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* SECTION B: STICKY FILTER DECK & EXPANDED DRAWER */}
        {/* ======================================================= */}
        <div className="sticky top-16 z-30 flex flex-col gap-3 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-md border border-[#d3c4b9]/50 flex flex-wrap items-center justify-between gap-4">
            {/* Left: Categorical Switcher & Pill Stream */}
            <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap overflow-x-auto py-1">
              {/* Segmented Toggle (By interest / By season) with sliding pill */}
              <div className="inline-flex bg-[#f2ede7] p-1 rounded-full shrink-0 shadow-inner relative">
                <button
                  type="button"
                  onClick={handleSwitchToInterests}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer z-10 ${
                    !isSeasonMode
                      ? "text-[#54381d]"
                      : "text-[#4f453c] hover:text-[#54381d]"
                  }`}
                >
                  {!isSeasonMode && (
                    <motion.div
                      layoutId="active-category-toggle"
                      className="absolute inset-0 rounded-full bg-white shadow-xs -z-10"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 450, damping: 32 }
                      }
                    />
                  )}
                  By interest
                </button>
                <button
                  type="button"
                  onClick={handleSwitchToSeasons}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer z-10 ${
                    isSeasonMode
                      ? "text-[#54381d]"
                      : "text-[#4f453c] hover:text-[#54381d]"
                  }`}
                >
                  {isSeasonMode && (
                    <motion.div
                      layoutId="active-category-toggle"
                      className="absolute inset-0 rounded-full bg-white shadow-xs -z-10"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 450, damping: 32 }
                      }
                    />
                  )}
                  By season
                </button>
              </div>

              <div className="h-6 w-px bg-[#d3c4b9]/50 shrink-0 hidden sm:block" />

              {/* Chips Stream with sliding pill highlight */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                {!isSeasonMode
                  ? INTERESTS.map((interest) => {
                      const isSelected =
                        activeInterest.toLowerCase() === interest.toLowerCase();
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleSelectInterest(interest)}
                          className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 z-10 ${
                            isSelected
                              ? "text-white"
                              : "bg-[#f2ede7] text-[#4f453c] hover:bg-[#e6e2dc] hover:text-[#54381d]"
                          }`}
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="active-explore-chip"
                              className="absolute inset-0 rounded-full bg-[#6e4f32] shadow-xs -z-10"
                              transition={
                                shouldReduceMotion
                                  ? { duration: 0 }
                                  : { type: "spring", stiffness: 450, damping: 32 }
                              }
                            />
                          )}
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                          <span>
                            {interest === "Food" ? "Food & Wine" : interest}
                          </span>
                        </button>
                      );
                    })
                  : SEASONS.map((season) => {
                      const isSelected =
                        activeSeason.toLowerCase() === season.toLowerCase();
                      return (
                        <button
                          key={season}
                          type="button"
                          onClick={() => handleSelectSeason(season)}
                          className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 z-10 ${
                            isSelected
                              ? "text-white"
                              : "bg-[#f2ede7] text-[#4f453c] hover:bg-[#e6e2dc] hover:text-[#54381d]"
                          }`}
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="active-explore-chip"
                              className="absolute inset-0 rounded-full bg-[#6e4f32] shadow-xs -z-10"
                              transition={
                                shouldReduceMotion
                                  ? { duration: 0 }
                                  : { type: "spring", stiffness: 450, damping: 32 }
                              }
                            />
                          )}
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                          <span>{season}</span>
                        </button>
                      );
                    })}
              </div>
            </div>

            {/* Right: Sort & Filter Drawers */}
            <div className="flex items-center gap-3 ml-auto shrink-0">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-[#4f453c] bg-[#f2ede7] hover:bg-[#e6e2dc] transition-colors cursor-pointer"
                >
                  <span>
                    Sort:{" "}
                    <strong className="text-[#54381d] font-semibold">
                      {selectedSort === "recommended"
                        ? "Recommended"
                        : selectedSort === "budget-asc"
                        ? "Budget: Low to High"
                        : "Duration: Short to Long"}
                    </strong>
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-48 py-1.5 bg-white rounded-2xl border border-[#d3c4b9]/50 shadow-lg z-50 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSort("recommended");
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-[#f8f3ed] flex items-center justify-between ${
                        selectedSort === "recommended"
                          ? "text-[#54381d] font-semibold"
                          : "text-[#4f453c]"
                      }`}
                    >
                      <span>Recommended</span>
                      {selectedSort === "recommended" && (
                        <Check className="w-3.5 h-3.5 text-[#6e4f32]" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSort("budget-asc");
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-[#f8f3ed] flex items-center justify-between ${
                        selectedSort === "budget-asc"
                          ? "text-[#54381d] font-semibold"
                          : "text-[#4f453c]"
                      }`}
                    >
                      <span>Budget: Low to High</span>
                      {selectedSort === "budget-asc" && (
                        <Check className="w-3.5 h-3.5 text-[#6e4f32]" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSort("duration-asc");
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-[#f8f3ed] flex items-center justify-between ${
                        selectedSort === "duration-asc"
                          ? "text-[#54381d] font-semibold"
                          : "text-[#4f453c]"
                      }`}
                    >
                      <span>Duration: Short to Long</span>
                      {selectedSort === "duration-asc" && (
                        <Check className="w-3.5 h-3.5 text-[#6e4f32]" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Filters Popover Trigger */}
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                  filterDrawerOpen
                    ? "bg-[#54381d] text-white"
                    : "bg-[#6e4f32] text-white hover:bg-[#54381d]"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeExtraFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-[#54381d] text-[10px] font-bold flex items-center justify-center">
                    {activeExtraFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filter panel opens with an animated height */}
          <AnimatePresence>
            {filterDrawerOpen && (
              <motion.div
                key="filter-drawer-panel"
                initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.35, ease: easing }
                }
                className="overflow-hidden"
              >
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-[#d3c4b9]/50 flex flex-col md:flex-row gap-6 items-start justify-between">
                  {/* 1. Estimated Budget Filter */}
                  <div className="flex-1 w-full flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#75593e]">
                        Estimated Budget Cap
                      </span>
                      <span className="font-serif text-base text-[#54381d] font-semibold">
                        Up to ${maxBudgetFilter.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="4500"
                      step="250"
                      value={maxBudgetFilter}
                      onChange={(e) => setMaxBudgetFilter(Number(e.target.value))}
                      className="w-full accent-[#6e4f32] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-[#81756b]">
                      <span>$500</span>
                      <span>$2,500</span>
                      <span>$4,500+</span>
                    </div>
                  </div>

                  {/* 2. Duration Selection */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#75593e]">
                      Trip Duration
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedDuration("all")}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          selectedDuration === "all"
                            ? "bg-[#6e4f32] text-white"
                            : "bg-[#f2ede7] text-[#4f453c] hover:bg-[#e6e2dc]"
                        }`}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDuration("1-3")}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          selectedDuration === "1-3"
                            ? "bg-[#6e4f32] text-white"
                            : "bg-[#f2ede7] text-[#4f453c] hover:bg-[#e6e2dc]"
                        }`}
                      >
                        1–3 days
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDuration("4-7")}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          selectedDuration === "4-7"
                            ? "bg-[#6e4f32] text-white"
                            : "bg-[#f2ede7] text-[#4f453c] hover:bg-[#e6e2dc]"
                        }`}
                      >
                        4–7 days
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDuration("8+")}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          selectedDuration === "8+"
                            ? "bg-[#6e4f32] text-white"
                            : "bg-[#f2ede7] text-[#4f453c] hover:bg-[#e6e2dc]"
                        }`}
                      >
                        8+ days
                      </button>
                    </div>
                  </div>

                  {/* 3. Travel Tempo / Style */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#75593e]">
                      Travel Tempo
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedPace("all")}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          selectedPace === "all"
                            ? "bg-[#6e4f32] text-white"
                            : "bg-[#f2ede7] text-[#4f453c] hover:bg-[#e6e2dc]"
                        }`}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPace("relaxed")}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          selectedPace === "relaxed"
                            ? "bg-[#6e4f32] text-white"
                            : "bg-[#f2ede7] text-[#4f453c] hover:bg-[#e6e2dc]"
                        }`}
                      >
                        Relaxed
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPace("moderate")}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          selectedPace === "moderate"
                            ? "bg-[#6e4f32] text-white"
                            : "bg-[#f2ede7] text-[#4f453c] hover:bg-[#e6e2dc]"
                        }`}
                      >
                        Moderate
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPace("high")}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          selectedPace === "high"
                            ? "bg-[#6e4f32] text-white"
                            : "bg-[#f2ede7] text-[#4f453c] hover:bg-[#e6e2dc]"
                        }`}
                      >
                        High Pace
                      </button>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex items-center gap-3 self-end md:self-center shrink-0 pt-2 md:pt-0">
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-xs text-[#75593e] hover:text-[#54381d] underline underline-offset-4 cursor-pointer"
                    >
                      Reset all
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterDrawerOpen(false)}
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-[#6e4f32] text-white hover:bg-[#54381d] transition-colors shadow-xs cursor-pointer"
                    >
                      Apply filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ======================================================= */}
        {/* SECTION C: RESULTS HEADER & ACTIVE TAGS COUNTER */}
        {/* ======================================================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-serif text-lg text-[#54381d] font-semibold">
              Showing {filteredTrips.length} curated {filteredTrips.length === 1 ? "trip" : "trips"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d3c4b9]" />
            <div className="inline-flex items-center gap-1.5 bg-[#f2ede7] px-3 py-1 rounded-full text-xs text-[#54381d] font-medium">
              <span>
                {activeFilterName}
                {selectedDuration !== "all"
                  ? ` · ${selectedDuration === "8+" ? "8+ days" : `${selectedDuration} days`}`
                  : ""}
              </span>
              {(selectedDuration !== "all" || isSeasonMode) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDuration("all");
                    if (isSeasonMode) handleSwitchToInterests();
                  }}
                  aria-label="Clear filter tag"
                  className="text-[#75593e] hover:text-[#54381d] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* View mode toggle (visual only as designed) */}
          <div className="flex items-center gap-1 bg-[#ece7e1]/60 p-1 rounded-full">
            <button
              type="button"
              className="p-1.5 rounded-full bg-white text-[#54381d] shadow-xs cursor-default"
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-full text-[#75593e] hover:text-[#54381d] transition-colors cursor-pointer"
              title="Split map view"
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ======================================================= */}
        {/* SECTION D: CURATED TRIPS GRID / LOADING / EMPTY STATE */}
        {/* ======================================================= */}

        {/* 1. Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white p-5 rounded-2xl border border-[#d3c4b9]/40 flex flex-col gap-4 animate-pulse"
              >
                <div className="w-full h-48 bg-[#f2ede7] rounded-xl" />
                <div className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-[#f2ede7] rounded-full" />
                  <div className="h-4 w-16 bg-[#f2ede7] rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-[#f2ede7] rounded-md" />
                <div className="h-4 w-full bg-[#f2ede7] rounded-md" />
                <div className="h-4 w-2/3 bg-[#f2ede7] rounded-md" />
                <div className="h-9 w-full bg-[#f2ede7] rounded-full mt-2" />
              </div>
            ))}
          </div>
        )}

        {/* 2. Empty State: fades in with gentle floating compass illustration */}
        {isEmpty && (
          <motion.div
            key="empty-state-view"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: easing }}
            className="py-16 px-6 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-[#d3c4b9]/30 shadow-xs"
          >
            {/* Gentle floating compass illustration */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, -7, 0],
                      rotate: [0, 4, -4, 0],
                    }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
              className="w-16 h-16 rounded-full bg-[#f2ede7] flex items-center justify-center text-[#75593e] mb-4 shadow-xs"
            >
              <Compass className="w-8 h-8 text-[#75593e]" />
            </motion.div>
            <h3 className="font-serif text-2xl text-[#54381d] font-medium mb-1">
              No journeys match these specific filters yet
            </h3>
            <p className="text-sm text-[#4f453c] max-w-md mb-6 leading-relaxed">
              We couldn&apos;t find any trips combining these exact criteria. Try
              easing your budget cap or broadening the duration window.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#6e4f32] text-white hover:bg-[#54381d] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear all filters</span>
              </button>
              <Link
                href="/home"
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#f2ede7] text-[#54381d] hover:bg-[#e6e2dc] transition-colors cursor-pointer"
              >
                Plan custom trip with AI
              </Link>
            </div>
          </motion.div>
        )}

        {/* 3. Regular Grid of Results: cards stagger in on load & re-animate with layout animation */}
        {!isLoading && !isEmpty && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
          >
            <AnimatePresence mode="popLayout">
              {filteredTrips.map((trip, idx) => (
                <motion.div
                  layout
                  key={trip.id}
                  initial={
                    shouldReduceMotion
                      ? false
                      : { opacity: 0, y: 18, scale: 0.96 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={
                    shouldReduceMotion
                      ? undefined
                      : { opacity: 0, scale: 0.94 }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          opacity: {
                            duration: 0.35,
                            delay: Math.min(idx * 0.04, 0.25),
                          },
                          y: {
                            duration: 0.35,
                            delay: Math.min(idx * 0.04, 0.25),
                            ease: easing,
                          },
                          layout: { duration: 0.38, ease: easing },
                        }
                  }
                >
                  <TripCard
                    trip={trip}
                    variant="grid"
                    status="upcoming"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ======================================================= */}
        {/* SECTION E: "PLAN A CUSTOM TRIP" EDITORIAL ASSIST STRIP */}
        {/* ======================================================= */}
        <div className="w-full bg-gradient-to-r from-[#f2ede7] via-[#f8f3ed] to-[#f2ede7] rounded-2xl p-8 md:p-10 shadow-xs border border-[#d3c4b9]/50 flex flex-col md:flex-row items-center justify-between gap-8 mt-2">
          <div className="flex items-start gap-5 max-w-2xl">
            <div className="w-12 h-12 rounded-full bg-[#6e4f32] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-6 h-6 text-[#ffd9b7]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#75593e] mb-1">
                Tailored Concierge
              </span>
              <h2 className="font-serif text-2xl text-[#54381d] font-medium mb-2">
                Can&apos;t find your ideal {activeFilterName.toLowerCase()} escape?
              </h2>
              <p className="text-sm text-[#4f453c] leading-relaxed">
                Let our AI architect a bespoke voyage customized to your exact
                travel dates, secluded wishlist cravings, pace preferences, and
                realistic budget.
              </p>
            </div>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <Link
              href="/home"
              className="w-full md:w-auto px-7 py-3.5 rounded-full bg-[#6e4f32] hover:bg-[#54381d] text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
            >
              <span>Plan a custom trip with AI</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f2ec] flex items-center justify-center text-[#54381d] text-sm">
          Loading explore journeys...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
