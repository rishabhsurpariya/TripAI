"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Compass,
  Calendar,
  Sparkles,
  Link2,
  Share2,
  Bookmark,
  CalendarDays,
  Plane,
  Car,
  Building2,
  PieChart,
  Map as MapIcon,
  Eye,
  Check,
  Clock,
  MapPin,
  Heart,
  Info,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { Trip } from "@/types/trip";
import { easing } from "@/lib/motion";
import { useCurrentUser } from "@/lib/data/auth";
import { createTrip } from "@/lib/data/trips";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Navbar } from "@/components/layout/Navbar";
import { DayTimeline } from "@/components/trip/DayTimeline";
import { GettingThereTab } from "@/components/trip/GettingThereTab";
import { LocalTransportTab } from "@/components/trip/LocalTransportTab";
import { HotelsTab } from "@/components/trip/HotelsTab";
import { BudgetTab } from "@/components/trip/BudgetTab";
import { TripMapTab } from "@/components/trip/TripMapTab";
import {
  NotFoundErrorContent,
  TripUnavailableError,
} from "@/components/common/error-variants";

interface SharedTripViewProps {
  trip: Trip | null;
  isShared: boolean;
  sharedBy?: string;
  lastUpdated?: string;
  shareId: string;
}

type TabKey =
  | "itinerary"
  | "getting-there"
  | "local-transport"
  | "hotels"
  | "budget"
  | "map";

export function SharedTripView({
  trip,
  isShared,
  sharedBy = "Aarav",
  lastUpdated = "Nov 18, 2024",
}: SharedTripViewProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  // Auth state from data access layer
  const currentUser = useCurrentUser();
  const isLoggedIn = Boolean(currentUser);

  // Active tab state
  const [activeTab, setActiveTab] = useState<TabKey>("itinerary");

  // Mobile bottom bar visibility: slides in after user scrolls past 80px
  const [showMobileBottomBar, setShowMobileBottomBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowMobileBottomBar(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax on hero section scroll
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(heroScrollYProgress, [0, 1], ["0%", "16%"]);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Action: Copy link to clipboard
  const handleCopyLink = useCallback(async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      if (navigator.clipboard && url) {
        await navigator.clipboard.writeText(url);
      }
      showToast("Link copied to clipboard!");
    } catch {
      showToast("Link copied to clipboard!");
    }
  }, [showToast]);

  // Action: Share via native dialog or copy
  const handleShareVia = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share && url) {
      try {
        await navigator.share({
          title: trip?.destination || "Trip Plan",
          text: `Check out this trip plan on TripAi!`,
          url,
        });
        return;
      } catch {
        // User cancelled or not supported, fall back to copy
      }
    }
    handleCopyLink();
  }, [trip, handleCopyLink]);

  // Action: Save a copy to my trips
  const handleSaveCopy = useCallback(() => {
    if (!isLoggedIn) {
      // Redirect to /login as per task instructions
      router.push("/login");
      return;
    }

    if (trip) {
      createTrip(trip);
      showToast("Saved a copy of this itinerary to My Trips!");
    }
  }, [isLoggedIn, trip, router, showToast]);

  // Render proper navbar based on auth state
  const renderedNavbar = isLoggedIn ? <Navbar /> : <PublicNavbar />;

  // 1. STATE: Trip Not Found (404)
  if (!trip) {
    return <NotFoundErrorContent fullScreen={true} />;
  }

  // 2. STATE: Link Unavailable (trip exists but isShared is false)
  if (!isShared) {
    return <TripUnavailableError fullScreen={true} />;
  }

  // Calculate budget statistics
  const daysCount = trip.days?.length || 5;
  const budgetSpent = Object.values(trip.budget || {}).reduce((a, b) => a + b, 0);
  const maxBudget = trip.totalBudget || 25000;
  const bufferAmount = Math.max(0, maxBudget - budgetSpent);
  const percentAllocated = Math.min(100, Math.round((budgetSpent / maxBudget) * 100));

  const tabs: {
    key: TabKey;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      key: "itinerary",
      label: "Itinerary",
      icon: <CalendarDays className="w-3.5 h-3.5" />,
      badge: `${daysCount} Days`,
    },
    {
      key: "getting-there",
      label: "Getting there",
      icon: <Plane className="w-3.5 h-3.5" />,
    },
    {
      key: "local-transport",
      label: "Local transport",
      icon: <Car className="w-3.5 h-3.5" />,
    },
    {
      key: "hotels",
      label: "Hotels",
      icon: <Building2 className="w-3.5 h-3.5" />,
      badge: `${Math.min(daysCount, 3)} Selected`,
    },
    {
      key: "budget",
      label: "Budget",
      icon: <PieChart className="w-3.5 h-3.5" />,
    },
    {
      key: "map",
      label: "Map",
      icon: <MapIcon className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f2ec] text-[#6e4f32] antialiased selection:bg-[#d9c9ba] selection:text-[#6e4f32]">
      {/* Dynamic Navbar: PublicNavbar when logged out, Navbar when logged in */}
      {renderedNavbar}

      {/* Interactive Toast Notification (Animated with Framer Motion) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { y: -24, opacity: 0, scale: 0.95 }
            }
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { y: -24, opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.25, ease: easing }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#6e4f32] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#8c6e52]"
            id="toastNotification"
          >
            <div className="w-6 h-6 rounded-full bg-[#8c6e52] flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SHARED BY BANNER (Slides down gently) */}
      <motion.section
        id="sharedByBanner"
        initial={shouldReduceMotion ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.5, ease: easing }
        }
        className="w-full bg-[#d9c9ba]/50 border-b border-[#bba591]/40 py-2.5 px-4"
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between flex-wrap gap-2 text-xs text-[#6e4f32]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#8c6e52] text-[#fbf7f2] font-medium flex items-center justify-center text-[10px] shadow-xs">
              {sharedBy ? sharedBy.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <span className="font-semibold text-[#6e4f32]">
                Shared by {sharedBy}
              </span>
              <span className="text-[#a28973] ml-1.5 hidden sm:inline">
                · This is a read-only view of their trip plan.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#a28973]">
            <span className="inline-flex items-center gap-1 bg-[#fbf7f2]/80 px-2 py-0.5 rounded-full border border-[#bba591]/40">
              <Lock className="w-3 h-3 text-[#a28973]" /> Read-only mode
            </span>
            <span className="hidden md:inline">Last updated {lastUpdated}</span>
          </div>
        </div>
      </motion.section>

      {/* MAIN TRIP CONTENT AREA */}
      <main
        id="mainTripContent"
        className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-20"
      >
        {/* 3. TRIP HEADER HERO (Read-only Hero Card with Parallax and Staggered Reveal) */}
        <section
          ref={heroRef}
          className="relative w-full rounded-3xl overflow-hidden bg-[#2d2218] text-[#fbf7f2] shadow-sm mb-6 border border-[#bba591]/30"
        >
          {/* Background Photo with Scroll Parallax and Warm Brown Gradient Overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div
              style={{ y: shouldReduceMotion ? 0 : heroImageY }}
              className="relative w-full h-[118%] -top-[9%]"
            >
              <Image
                src={
                  trip.coverImageUrl ||
                  "https://lh3.googleusercontent.com/aida/AEtjO1VWdFv1ysxzCUc21vKtlvs1ysbpz3SVAG2drwz56KIudH4fc5O-Jxuo2z0fiMF4KMD349DhRspkkXavGKRfk6K0KSHW-hSDJwXcXK2JZ-cAgghrc5qeTSNDlFX0DS83gpfg5jA8P8pB330Bm0-51CwC7CAciYmXFxy2wG7ISC9TGZPGqVpyS87AvbB6lmj86ajnza7kBviQsKFXNocjZ0qBxColW3IzgxdtNnsuHewvLR5YN-GvtaN6Sdw"
                }
                alt={trip.destination}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center opacity-45 transform scale-105 filter blur-[0.5px]"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#201710] via-[#3a2c1f]/85 to-[#3a2c1f]/60" />
          </div>

          <div className="relative z-10 p-6 sm:p-9 flex flex-col justify-between min-h-[290px]">
            {/* Breadcrumb & Badge Row (Fade down) */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.45, ease: easing }
              }
              className="flex items-center justify-between gap-3 flex-wrap"
            >
              <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-[#d9c9ba]">
                <span>Shared Plan</span>
                <span>•</span>
                <span className="font-semibold text-white">
                  {trip.destination}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#fbf7f2]/15 backdrop-blur-sm border border-white/20 text-xs font-medium text-[#fbf7f2] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#d9c9ba]" />
                  <span>
                    {trip.startDate && trip.endDate
                      ? `${trip.startDate} – ${trip.endDate}`
                      : "Nov 14 – Nov 18, 2024"}
                  </span>
                </span>
                <span className="px-3 py-1 rounded-full bg-[#fbf7f2]/15 backdrop-blur-sm border border-white/20 text-xs font-medium text-[#fbf7f2] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#d9c9ba]" />
                  <span>Curated by TripAi</span>
                </span>
              </div>
            </motion.div>

            {/* Hero Destination Title & Subtitle (Fade up) */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.6, delay: 0.08, ease: easing }
              }
              className="my-4"
            >
              <div className="text-xs uppercase tracking-widest text-[#d9c9ba] font-medium mb-1.5">
                {trip.country === "India"
                  ? "Western Coast · Arabian Sea"
                  : `${trip.country} · Curated Passage`}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 leading-tight">
                {trip.destination}, {trip.country} · Sun, Spice &amp; Heritage
              </h1>
              <p className="text-sm sm:text-base text-[#d9c9ba] max-w-2xl font-light leading-relaxed">
                An intimate {daysCount}-day journey through tranquil heritage
                architecture, authentic artisan dining, scenic walking paths, and
                slow evening sunsets.
              </p>
            </motion.div>

            {/* Summary Chips, Budget Ring & Actions (Fade up chips & animate budget gauge) */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.55, delay: 0.18, ease: easing }
              }
              className="pt-4 border-t border-white/15 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Left: Metadata chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-full bg-[#fbf7f2]/15 backdrop-blur-sm border border-white/15 text-white font-medium">
                  {daysCount} Days
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#fbf7f2]/15 backdrop-blur-sm border border-white/15 text-white font-medium">
                  {trip.travelers} Travelers
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#fbf7f2]/15 backdrop-blur-sm border border-white/15 text-white font-medium capitalize">
                  {trip.style} Style
                </span>
                {trip.startCity && (
                  <span className="px-3 py-1.5 rounded-full bg-[#fbf7f2]/15 backdrop-blur-sm border border-white/15 text-white font-medium">
                    Ex-{trip.startCity}
                  </span>
                )}

                {/* Budget Chip with animated gauge */}
                <div className="flex items-center gap-2 pl-3 ml-1 border-l border-white/20 py-0.5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#d9c9ba] leading-none uppercase">
                      Est. Budget
                    </span>
                    <span className="text-sm font-semibold text-white">
                      ₹{budgetSpent.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-[#d9c9ba]">
                        / ₹{Math.round(maxBudget / 1000)}k
                      </span>
                    </span>
                  </div>
                  <div className="px-2 py-0.5 rounded-md bg-[#d9c9ba]/20 text-[#d9c9ba] text-[11px] font-medium border border-[#d9c9ba]/30">
                    Comfortably within budget
                  </div>
                </div>
              </div>

              {/* Right: Actions for Visitor (NO Edit, Regenerate, or Delete) */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#fbf7f2]/15 hover:bg-[#fbf7f2]/25 backdrop-blur-sm border border-white/20 text-xs font-medium text-white transition cursor-pointer active:scale-95"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Copy link</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareVia}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#fbf7f2]/15 hover:bg-[#fbf7f2]/25 backdrop-blur-sm border border-white/20 text-white transition cursor-pointer active:scale-95"
                  title="Share via..."
                  aria-label="Share via"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleSaveCopy}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6e4f32] hover:bg-[#8c6e52] text-[#fbf7f2] text-xs font-semibold shadow-sm transition border border-[#bba591]/40 cursor-pointer active:scale-95"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save a copy to my trips</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4. SECTION TABS (Sticky tab bar with sliding mocha underline for active tab) */}
        <nav
          aria-label="Trip tabs"
          className="sticky top-16 z-30 bg-[#f7f2ec]/95 backdrop-blur-md py-2 border-b border-[#bba591]/40 mb-8 flex items-center justify-between gap-4 overflow-x-auto hide-scrollbar"
        >
          <div className="flex items-center gap-1 sm:gap-2 relative">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs transition-all relative flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "font-semibold text-[#6e4f32] bg-[#d9c9ba]/45 border border-[#bba591]/50"
                      : "font-medium text-[#8c6e52] hover:text-[#6e4f32] hover:bg-[#d9c9ba]/20"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-[#6e4f32] text-white"
                          : "bg-[#d9c9ba] text-[#6e4f32]"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="shared-tab-underline"
                      className="absolute -bottom-2 left-4 right-4 h-0.5 bg-[#8c6e52] rounded-full"
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
          </div>

          {/* Read-only secondary view badge */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#a28973]">
            <span className="inline-flex items-center gap-1 bg-[#fbf7f2] border border-[#bba591]/40 px-2.5 py-1 rounded-full text-[11px]">
              <Eye className="w-3 h-3 text-[#8c6e52]" /> Public guest view
            </span>
          </div>
        </nav>

        {/* TWO-COLUMN WORKSPACE: LEFT ITINERARY TIMELINE (8 cols) + RIGHT READ-ONLY PANEL (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (8 cols) WITH CROSSFADE ANIMATION */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: easing }}
                className="w-full flex flex-col gap-10"
              >
                {activeTab === "itinerary" && (
                  <>
                    {/* 5. ITINERARY TAB (Vertical timeline in read-only scrapbook style with DayTimeline animations) */}
                    <DayTimeline
                      days={trip.days || []}
                      readOnly={true}
                      onToast={showToast}
                    />

                    {/* 8. SIGN-UP CALL TO ACTION BANNER (Fades up when scrolled into view) */}
                    <motion.section
                      initial={
                        shouldReduceMotion ? false : { opacity: 0, y: 32 }
                      }
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { duration: 0.55, ease: easing }
                      }
                      className="mt-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#f1eae2] via-[#d9c9ba]/60 to-[#f1eae2] border border-[#bba591]/70 shadow-sm relative overflow-hidden"
                    >
                      {/* Decorative scrapbook corner accent */}
                      <div className="absolute top-3 right-6 w-20 h-5 bg-[#d9c9ba]/65 rounded-xs transform rotate-12 opacity-70 pointer-events-none" />

                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Sparkles Graphic Icon */}
                        <div className="w-16 h-16 rounded-2xl bg-[#6e4f32] text-[#fbf7f2] flex items-center justify-center shrink-0 shadow-md">
                          <Sparkles className="w-8 h-8 text-[#d9c9ba]" />
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="font-serif text-2xl font-bold text-[#6e4f32] mb-1">
                            Love this plan? Make it yours.
                          </h3>
                          <p className="text-xs sm:text-sm text-[#6e4f32]/85 mb-4 leading-relaxed font-light">
                            Save a copy, tweak it your way, or let TripAi plan a
                            brand new trip in seconds with custom budgets,
                            interactive corkboard memos, and local discoveries.
                          </p>

                          {/* Actions */}
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                            <button
                              type="button"
                              onClick={handleSaveCopy}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6e4f32] hover:bg-[#8c6e52] text-white text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer active:scale-95"
                            >
                              <Bookmark className="w-4 h-4" />
                              <span>Save a copy to my trips</span>
                            </button>
                            <Link
                              href={isLoggedIn ? "/home" : "/signup"}
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#fbf7f2] text-[#6e4f32] text-xs sm:text-sm font-medium transition border border-[#bba591]/60 cursor-pointer active:scale-95"
                            >
                              <Compass className="w-4 h-4 text-[#8c6e52]" />
                              <span>Plan my own trip</span>
                            </Link>
                          </div>

                          <p className="text-[11px] text-[#a28973] mt-2.5 flex items-center justify-center sm:justify-start gap-1">
                            <Info className="w-3 h-3 text-[#a28973]" />
                            <span>
                              You&apos;ll be asked to sign up or log in first.
                            </span>
                          </p>
                        </div>
                      </div>
                    </motion.section>
                  </>
                )}

                {activeTab === "getting-there" && (
                  <GettingThereTab trip={trip} />
                )}
                {activeTab === "local-transport" && (
                  <LocalTransportTab trip={trip} />
                )}
                {activeTab === "hotels" && <HotelsTab trip={trip} />}
                {activeTab === "budget" && <BudgetTab trip={trip} />}
                {activeTab === "map" && <TripMapTab trip={trip} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 7. SIDE PANEL (Desktop Only, Read-Only Budget Summary & Route Map) */}
          <aside className="hidden lg:flex lg:col-span-4 flex-col gap-6 sticky top-24">
            {/* Read-only Live Budget Summary Card (Fade in on scroll with animated gauge) */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.45, ease: easing }
              }
              className="bg-white rounded-3xl p-5 border border-[#bba591]/40 shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#bba591]/30">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#a28973]">
                    Financial Overview
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#6e4f32]">
                    Estimated Trip Budget
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#d9c9ba]/30 text-[#6e4f32] text-[10px] font-semibold border border-[#bba591]/40 capitalize">
                  {trip.style} Tier
                </span>
              </div>

              {/* Big Stat & Progress Bar */}
              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="font-serif text-2xl font-bold text-[#6e4f32]">
                    ₹{budgetSpent.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#a28973]">
                    of ₹{maxBudget.toLocaleString()} target
                  </span>
                </div>
                {/* Progress Bar with width animation */}
                <div className="w-full h-2.5 bg-[#f1eae2] rounded-full overflow-hidden p-0.5 border border-[#bba591]/30">
                  <motion.div
                    initial={
                      shouldReduceMotion
                        ? { width: `${percentAllocated}%` }
                        : { width: 0 }
                    }
                    whileInView={{ width: `${percentAllocated}%` }}
                    viewport={{ once: true }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.85, delay: 0.2, ease: easing }
                    }
                    className="h-full bg-[#8c6e52] rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#a28973] mt-1.5">
                  <span>{percentAllocated}% allocated</span>
                  <span className="text-[#6e4f32] font-medium">
                    +{`₹${bufferAmount.toLocaleString()}`} buffer left
                  </span>
                </div>
              </div>

              {/* Category Breakdown Rows (Read-only) */}
              <div className="space-y-2.5 pt-2 border-t border-[#bba591]/25 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6e4f32]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6e4f32]" />
                    <span>Boutique Stays ({daysCount - 1} nights)</span>
                  </div>
                  <span className="font-semibold text-[#6e4f32]">
                    ₹{(trip.budget?.stay || 11200).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6e4f32]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8c6e52]" />
                    <span>Transport &amp; Scooter</span>
                  </div>
                  <span className="font-semibold text-[#6e4f32]">
                    ₹{(trip.budget?.transport || 5100).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6e4f32]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#a28973]" />
                    <span>Activities &amp; Farm Tours</span>
                  </div>
                  <span className="font-semibold text-[#6e4f32]">
                    ₹{(trip.budget?.activities || 3800).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6e4f32]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#d9c9ba]" />
                    <span>Food, Cafes &amp; Drinks</span>
                  </div>
                  <span className="font-semibold text-[#6e4f32]">
                    ₹{(trip.budget?.food || 3300).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Prompt to save for detailed spreadsheets */}
              <div className="p-3 rounded-xl bg-[#f7f2ec] border border-[#bba591]/30 text-center">
                <span className="text-[11px] text-[#8c6e52]">
                  Want to adjust budgets or currencies?
                </span>
                <button
                  type="button"
                  onClick={handleSaveCopy}
                  className="block w-full text-center text-xs font-semibold text-[#6e4f32] hover:text-[#8c6e52] mt-1 underline underline-offset-2 cursor-pointer"
                >
                  Save a copy to customize →
                </button>
              </div>
            </motion.div>

            {/* Day 1 Trail Map Mini Preview (Fade in on scroll) */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.45, delay: 0.08, ease: easing }
              }
              className="bg-white rounded-3xl p-5 border border-[#bba591]/40 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#a28973]">
                    Route Geography
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#6e4f32]">
                    Day 1 Trail Map
                  </h3>
                </div>
                <span className="text-xs text-[#8c6e52] font-medium bg-[#f1eae2] px-2 py-0.5 rounded-md border border-[#bba591]/30">
                  14.2 km total
                </span>
              </div>

              {/* Cartographic SVG Mockup Map */}
              <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-[#e8e2d8] border border-[#bba591]/40 flex items-center justify-center">
                <svg
                  className="w-full h-full object-cover"
                  viewBox="0 0 320 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Ocean background */}
                  <rect width="320" height="180" fill="#cbdad5" />
                  {/* Land Mass */}
                  <path
                    d="M70,0 C120,40 100,90 140,110 C180,130 190,160 210,180 L320,180 L320,0 Z"
                    fill="#e8decb"
                  />
                  <path
                    d="M120,30 C150,50 170,40 220,55 C270,70 290,60 320,80 L320,0 Z"
                    fill="#ded2bc"
                  />
                  {/* River channel (Mandovi) */}
                  <path
                    d="M80,85 C140,88 180,75 250,90 C290,100 320,95 320,95"
                    stroke="#cbdad5"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Dashed Trail Route */}
                  <path
                    d="M95,78 Q 140,82 175,95 Q 210,110 235,90"
                    stroke="#8c6e52"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                  />
                  {/* Pin 1: Panjim Fontainhas */}
                  <circle
                    cx="140"
                    cy="85"
                    r="7"
                    fill="#6e4f32"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x="140"
                    y="88"
                    fill="#ffffff"
                    fontSize="8"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    1
                  </text>
                  {/* Pin 2: Mum's Kitchen */}
                  <circle
                    cx="175"
                    cy="95"
                    r="7"
                    fill="#6e4f32"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x="175"
                    y="98"
                    fill="#ffffff"
                    fontSize="8"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    2
                  </text>
                  {/* Pin 3: Reis Magos */}
                  <circle
                    cx="95"
                    cy="78"
                    r="7"
                    fill="#8c6e52"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x="95"
                    y="81"
                    fill="#ffffff"
                    fontSize="8"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    3
                  </text>
                </svg>
                {/* Ride duration chip */}
                <div className="absolute bottom-2.5 right-2.5 bg-[#fbf7f2]/95 backdrop-blur-xs text-[10px] text-[#6e4f32] font-semibold px-2 py-0.5 rounded-full shadow-xs border border-[#bba591]/40 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#8c6e52]" />
                  <span>28 min ride time</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("map")}
                className="w-full py-2 px-3 rounded-xl bg-[#f7f2ec] hover:bg-[#d9c9ba]/40 border border-[#bba591]/40 text-xs font-semibold text-[#6e4f32] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#8c6e52]" />
                <span>Open full interactive route map</span>
              </button>
            </motion.div>

            {/* TripAi Brand Card */}
            <div className="p-4 rounded-2xl bg-[#d9c9ba]/30 border border-[#bba591]/40 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#6e4f32] text-white flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 text-[#d9c9ba]" />
              </div>
              <div className="text-[11px] text-[#6e4f32]/90 leading-tight">
                <strong>Crafted with TripAi:</strong> Personalized AI journeys
                that balance cultural depth, relaxation, and local heritage.
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* MOBILE STICKY BOTTOM ACTION BAR (Slides in after user scrolls on mobile) */}
      <AnimatePresence>
        {showMobileBottomBar && (
          <motion.div
            id="mobileBottomBar"
            initial={shouldReduceMotion ? { opacity: 0 } : { y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: 80, opacity: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.1 }
                : { type: "spring", stiffness: 450, damping: 30 }
            }
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fbf7f2]/95 backdrop-blur-md border-t border-[#bba591]/40 p-3 px-4 flex items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex flex-col">
              <span className="text-[10px] text-[#a28973] uppercase font-semibold">
                Shared by {sharedBy}
              </span>
              <span className="font-serif text-sm font-bold text-[#6e4f32]">
                {trip.destination}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSaveCopy}
              className="px-5 py-2.5 rounded-full bg-[#6e4f32] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save to my trips</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 9. MINIMAL PUBLIC FOOTER ("Made with TripAi" acceptable on public page only) */}
      <footer className="w-full border-t border-[#bba591]/30 py-6 px-4 bg-[#fbf7f2]/60 text-center text-xs text-[#a28973] mb-14 lg:mb-0">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#8c6e52]" />
            <span>
              Made with <strong>TripAi</strong> — The AI Travel Itinerary
              Planner
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/" className="hover:text-[#6e4f32] transition">
              Privacy
            </Link>
            <Link href="/" className="hover:text-[#6e4f32] transition">
              Terms
            </Link>
            <Link
              href={isLoggedIn ? "/home" : "/signup"}
              className="hover:text-[#6e4f32] transition"
            >
              Create your own trip
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
