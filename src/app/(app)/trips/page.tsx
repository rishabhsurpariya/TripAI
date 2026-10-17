"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  LayoutGrid,
  List,
  Sparkles,
  Plus,
  Luggage,
  X,
  ChevronDown,
  Share2,
  Trash2,
  Copy,
  CheckCircle2,
  Check,
  Globe,
  Lock,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { easing } from "@/lib/motion";
import { Trip } from "@/types/trip";
import { TripCard } from "@/components/trips/TripCard";
import {
  useSavedTripsStore,
  computeTripStatus,
  type SortOption,
} from "@/store/savedTripsStore";

export default function MyTripsPage() {
  const {
    trips,
    searchQuery,
    filter,
    sortBy,
    viewMode,
    editingTripId,
    setSearchQuery,
    setFilter,
    setSortBy,
    setViewMode,
    setEditingTripId,
    renameTrip,
    duplicateTrip,
    deleteTrip,
    toggleShare,
    resetTrips,
  } = useSavedTripsStore();

  const shouldReduceMotion = useReducedMotion();

  // Modals state
  const [shareTrip, setShareTrip] = useState<Trip | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [deleteTargetTrip, setDeleteTargetTrip] = useState<Trip | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimeout, setToastTimeout] = useState<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeout) clearTimeout(toastTimeout);
    setToastMessage(msg);
    const t = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    setToastTimeout(t);
  };

  // Compute status & counts
  const totalCount = trips.length;
  const upcomingCount = useMemo(
    () => trips.filter((t) => computeTripStatus(t) === "upcoming").length,
    [trips]
  );
  const pastCount = useMemo(
    () => trips.filter((t) => computeTripStatus(t) === "past").length,
    [trips]
  );
  const sharedCount = useMemo(
    () => trips.filter((t) => Boolean(t.isShared)).length,
    [trips]
  );

  // Filtered & Sorted trips
  const displayedTrips = useMemo(() => {
    let result = [...trips];

    // Filter chip
    if (filter === "upcoming") {
      result = result.filter((t) => computeTripStatus(t) === "upcoming");
    } else if (filter === "past") {
      result = result.filter((t) => computeTripStatus(t) === "past");
    } else if (filter === "shared") {
      result = result.filter((t) => Boolean(t.isShared));
    }

    // Search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (t) =>
          t.destination.toLowerCase().includes(q) ||
          t.country.toLowerCase().includes(q) ||
          t.interests?.some((i) => i.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "title") {
        return a.destination.localeCompare(b.destination);
      }
      if (sortBy === "budget") {
        return (b.totalBudget || 0) - (a.totalBudget || 0);
      }
      if (sortBy === "date") {
        const dateA = new Date(a.startDate || "2099-01-01").getTime();
        const dateB = new Date(b.startDate || "2099-01-01").getTime();
        return dateA - dateB;
      }
      // default: "recent"
      return 0;
    });

    return result;
  }, [trips, filter, searchQuery, sortBy]);

  // Handler for duplicating
  const handleDuplicate = (trip: Trip) => {
    const duplicated = duplicateTrip(trip.id);
    if (duplicated) {
      showToast(`✓ Trip "${trip.destination}" duplicated to drafts`);
    }
  };

  // Handler for sharing
  const handleOpenShare = (trip: Trip) => {
    setShareTrip(trip);
    setIsCopied(false);
  };

  const handleCopyLink = () => {
    if (!shareTrip) return;
    const url = `https://tripai.com/p/${shareTrip.shareId || shareTrip.id}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setIsCopied(true);
    showToast("✓ Secret link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleToggleSharePrivacy = () => {
    if (!shareTrip) return;
    const newState = !shareTrip.isShared;
    toggleShare(shareTrip.id, newState);
    setShareTrip({ ...shareTrip, isShared: newState });
    showToast(
      newState ? "Public link re-enabled" : "Public link disabled (private)"
    );
  };

  const handleRevokeShare = () => {
    if (!shareTrip) return;
    toggleShare(shareTrip.id, false);
    setShareTrip({ ...shareTrip, isShared: false, shareId: undefined });
    showToast("Secret link revoked");
  };

  // Handler for deletion
  const handleOpenDelete = (trip: Trip) => {
    setDeleteTargetTrip(trip);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetTrip) return;
    deleteTrip(deleteTargetTrip.id);
    showToast(`Trip plan "${deleteTargetTrip.destination}" deleted`);
    setDeleteTargetTrip(null);
  };

  // Handler for rename
  const handleSaveRename = (id: string, newTitle: string) => {
    renameTrip(id, newTitle);
    showToast(`Renamed trip to "${newTitle}"`);
  };

  // Framer Motion Variants
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.92, y: 16 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.32,
        ease: easing,
      },
    },
    exit: shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          scale: 0.82,
          transition: { duration: 0.22, ease: "easeInOut" },
        },
  };

  return (
    <div className="w-full bg-[#f7f2ec] min-h-[calc(100vh-4rem)] text-[#54381d] pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* PAGE HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#54381d]">
              My Trips
            </h1>
            <p className="text-xs sm:text-sm text-[#4d3a28] mt-1 flex items-center gap-2 flex-wrap">
              <span>{totalCount} saved trips</span>
              <span className="inline-block w-1 h-1 rounded-full bg-[#d3c4b9]" />
              <span>{upcomingCount} upcoming</span>
              <span className="inline-block w-1 h-1 rounded-full bg-[#d3c4b9]" />
              <span>{sharedCount} shared</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/home"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#6e4f32] text-white text-xs sm:text-sm font-semibold transition-transform hover:opacity-95 active:scale-95 shadow-sm"
              id="header-new-trip"
            >
              <Plus className="w-4 h-4" />
              <span>+ New trip</span>
            </Link>
          </div>
        </header>

        {/* TOOLBAR */}
        <section className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-[#d3c4b9]/40 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81756b] w-4 h-4" />
            <input
              type="text"
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by destination..."
              className="w-full h-11 pl-10 pr-9 rounded-full bg-[#f8f3ed] text-xs sm:text-sm text-[#54381d] placeholder-[#81756b] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6e4f32]/20 transition-all border border-transparent focus:border-[#d3c4b9]/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#81756b] hover:text-[#54381d]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`filter-chip flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                filter === "all"
                  ? "bg-[#6e4f32] text-white shadow-xs"
                  : "bg-[#ece7e1] text-[#4d3a28] hover:bg-[#ded9d4]"
              }`}
            >
              <span>All</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  filter === "all"
                    ? "bg-[#54381d]/50 text-white"
                    : "bg-[#d3c4b9]/50 text-[#54381d]"
                }`}
              >
                {totalCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilter("upcoming")}
              className={`filter-chip flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                filter === "upcoming"
                  ? "bg-[#6e4f32] text-white shadow-xs"
                  : "bg-[#ece7e1] text-[#4d3a28] hover:bg-[#ded9d4]"
              }`}
            >
              <span>Upcoming</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  filter === "upcoming"
                    ? "bg-[#54381d]/50 text-white"
                    : "bg-[#d3c4b9]/50 text-[#54381d]"
                }`}
              >
                {upcomingCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilter("past")}
              className={`filter-chip flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                filter === "past"
                  ? "bg-[#6e4f32] text-white shadow-xs"
                  : "bg-[#ece7e1] text-[#4d3a28] hover:bg-[#ded9d4]"
              }`}
            >
              <span>Past</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  filter === "past"
                    ? "bg-[#54381d]/50 text-white"
                    : "bg-[#d3c4b9]/50 text-[#54381d]"
                }`}
              >
                {pastCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilter("shared")}
              className={`filter-chip flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                filter === "shared"
                  ? "bg-[#6e4f32] text-white shadow-xs"
                  : "bg-[#ece7e1] text-[#4d3a28] hover:bg-[#ded9d4]"
              }`}
            >
              <span>Shared</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  filter === "shared"
                    ? "bg-[#54381d]/50 text-white"
                    : "bg-[#d3c4b9]/50 text-[#54381d]"
                }`}
              >
                {sharedCount}
              </span>
            </button>
          </div>

          {/* Controls: Sort & Layout Toggle */}
          <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none h-10 pl-3.5 pr-8 rounded-full bg-[#f8f3ed] text-xs font-semibold text-[#54381d] focus:outline-none focus:ring-2 focus:ring-[#6e4f32]/20 cursor-pointer border border-[#d3c4b9]/40"
              >
                <option value="recent">Recently edited</option>
                <option value="date">Date of trip</option>
                <option value="budget">Budget remaining</option>
                <option value="title">Destination A–Z</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#81756b] w-4 h-4" />
            </div>

            {/* View Switch */}
            <div className="inline-flex p-1 rounded-full bg-[#f8f3ed] border border-[#d3c4b9]/40">
              <button
                type="button"
                id="view-btn-grid"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-[#54381d] shadow-xs"
                    : "text-[#81756b] hover:text-[#54381d]"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4 block" />
              </button>
              <button
                type="button"
                id="view-btn-list"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-[#54381d] shadow-xs"
                    : "text-[#81756b] hover:text-[#54381d]"
                }`}
                title="List view"
              >
                <List className="w-4 h-4 block" />
              </button>
            </div>
          </div>
        </section>

        {/* TRIPS CONTENT */}
        {displayedTrips.length === 0 ? (
          /* EMPTY STATE OR NO-RESULTS STATE */
          <motion.div
            id="empty-state-view"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.3 }}
            className="flex flex-col items-center justify-center text-center p-10 sm:p-14 bg-white rounded-2xl shadow-sm border border-[#d3c4b9]/50 my-4"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f8f3ed] flex items-center justify-center text-[#75593e] mb-4">
              <Luggage className="w-8 h-8 sm:w-10 sm:h-10 text-[#6e4f32]" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#54381d]">
              {totalCount === 0
                ? "Your library is empty"
                : searchQuery
                ? "No trips found"
                : "No matching trips"}
            </h2>
            <p className="text-xs sm:text-sm text-[#75593e] max-w-md mt-1 mb-6 leading-relaxed">
              {totalCount === 0
                ? "Your library is empty. Let TripAi compose your first bespoke travel itinerary."
                : searchQuery
                ? `No planned journeys match "${searchQuery}". Start a new bespoke trip or explore our curated collections.`
                : "There are no journeys in this category. You can plan a new itinerary anytime."}
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Link
                href="/home"
                className="px-6 py-3 rounded-full bg-[#6e4f32] text-white text-xs font-semibold shadow-sm hover:opacity-95 active:scale-95 transition-all"
              >
                Plan my first trip
              </Link>
              {totalCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setFilter("all");
                  }}
                  className="px-6 py-3 rounded-full bg-[#f2ede7] text-[#54381d] text-xs font-semibold hover:bg-[#ded9d4] transition-colors cursor-pointer"
                >
                  Clear filters
                </button>
              )}
              {totalCount === 0 && (
                <button
                  type="button"
                  onClick={resetTrips}
                  className="px-6 py-3 rounded-full bg-[#f2ede7] text-[#54381d] text-xs font-semibold hover:bg-[#ded9d4] transition-colors cursor-pointer"
                >
                  Restore sample trips
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          /* TRIPS CONTAINER WITH LAYOUT ANIMATION BETWEEN GRID & LIST */
          <motion.div
            layout={!shouldReduceMotion}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-3"
            }
          >
            <AnimatePresence mode="popLayout">
              {displayedTrips.map((trip) => (
                <motion.div
                  key={trip.id}
                  layout={!shouldReduceMotion}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    layout: {
                      duration: shouldReduceMotion ? 0 : 0.35,
                      ease: easing,
                    },
                  }}
                  className="w-full"
                >
                  <TripCard
                    trip={trip}
                    variant={viewMode}
                    status={computeTripStatus(trip)}
                    isEditing={editingTripId === trip.id}
                    onShare={handleOpenShare}
                    onDuplicate={handleDuplicate}
                    onDelete={handleOpenDelete}
                    onRename={(t) => setEditingTripId(t.id)}
                    onSaveRename={handleSaveRename}
                    onCancelRename={() => setEditingTripId(null)}
                  />
                </motion.div>
              ))}

              {/* "+ Plan with AI" Action Card (Grid mode only) */}
              {viewMode === "grid" && (
                <motion.div
                  key="plan-new-journey-action-card"
                  layout={!shouldReduceMotion}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    layout: {
                      duration: shouldReduceMotion ? 0 : 0.35,
                      ease: easing,
                    },
                  }}
                  className="trip-card rounded-2xl p-6 bg-[#ece7e1] flex flex-col items-center justify-center text-center group hover:bg-[#e4ded6] transition-colors min-h-[380px] border border-dashed border-[#d3c4b9]"
                >
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-[#54381d] mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-7 h-7 text-[#6e4f32]" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-[#54381d]">
                    Start a new journey
                  </h2>
                  <p className="text-xs sm:text-sm text-[#75593e] max-w-[240px] mt-2 mb-6 leading-relaxed">
                    Let TripAi draft your bespoke daily itinerary in seconds with tailored suggestions.
                  </p>
                  <Link
                    href="/home"
                    className="px-6 py-3 rounded-full bg-[#6e4f32] text-white text-xs font-semibold shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>+ Plan with AI</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* SHARE MODAL DIALOG */}
      <AnimatePresence>
        {shareTrip && (
          <motion.div
            id="share-modal"
            key="share-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#54381d]/30 backdrop-blur-sm"
            onClick={() => setShareTrip(null)}
          >
            <motion.div
              key="share-modal-dialog"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.92, y: 12 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.92, y: 12 }
              }
              transition={{
                duration: shouldReduceMotion ? 0.05 : 0.22,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl relative border border-[#d3c4b9]/40"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShareTrip(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f8f3ed] text-[#54381d] flex items-center justify-center hover:bg-[#ece7e1] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-1 text-[#54381d]">
                <Share2 className="w-5 h-5 text-[#75593e]" />
                <h3 className="font-serif text-xl font-bold">Share Itinerary</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#75593e] mb-5">
                Anyone with this link can view your curated itinerary, notes, and interactive map.
              </p>

              {/* Mini Preview Card */}
              <div className="bg-[#f8f3ed] rounded-xl p-3 mb-5 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg bg-[#ece7e1] overflow-hidden shrink-0">
                  <Image
                    src={
                      shareTrip.coverImageUrl ||
                      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&q=80"
                    }
                    alt={shareTrip.destination}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#54381d] truncate">
                    {shareTrip.destination}, {shareTrip.country}
                  </p>
                  <p className="text-xs text-[#81756b] flex items-center gap-1 mt-0.5">
                    {shareTrip.isShared ? (
                      <>
                        <Globe className="w-3 h-3 text-emerald-600" />
                        <span>Public read-only journal</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-[#81756b]" />
                        <span>Private (Only you)</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Toggle row: Public / Private */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#ece7e1]/70 mb-4">
                <div>
                  <span className="text-sm font-semibold text-[#54381d] block">
                    Public link {shareTrip.isShared ? "enabled" : "disabled"}
                  </span>
                  <span className="text-xs text-[#81756b]">
                    {shareTrip.isShared
                      ? "Unlisted; anyone with the secret link can view"
                      : "Only accessible by you when logged in"}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(shareTrip.isShared)}
                    onChange={handleToggleSharePrivacy}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#d3c4b9] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6e4f32]" />
                </label>
              </div>

              {/* Link Copy Field */}
              <div className="flex items-center gap-2 mb-6">
                <div className="relative flex-1">
                  <input
                    type="text"
                    readOnly
                    value={
                      shareTrip.isShared
                        ? `https://tripai.com/p/${shareTrip.shareId || shareTrip.id}`
                        : "Public sharing is currently disabled"
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-[#f8f3ed] text-xs font-mono text-[#54381d] border border-[#d3c4b9]/50 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  disabled={!shareTrip.isShared}
                  className="px-4 h-11 rounded-xl bg-[#ece7e1] text-[#54381d] hover:bg-[#ded9d4] disabled:opacity-50 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#d3c4b9]/30">
                <button
                  type="button"
                  onClick={handleRevokeShare}
                  className="text-xs font-semibold text-[#81756b] hover:text-[#54381d] transition-colors cursor-pointer"
                >
                  Revoke secret link
                </button>
                <button
                  type="button"
                  onClick={() => setShareTrip(null)}
                  className="px-6 py-2.5 rounded-full bg-[#6e4f32] text-white text-xs font-semibold hover:opacity-95 active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteTargetTrip && (
          <motion.div
            id="delete-modal"
            key="delete-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#54381d]/30 backdrop-blur-sm"
            onClick={() => setDeleteTargetTrip(null)}
          >
            <motion.div
              key="delete-modal-dialog"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.92, y: 12 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.92, y: 12 }
              }
              transition={{
                duration: shouldReduceMotion ? 0.05 : 0.22,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl text-center border border-[#d3c4b9]/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-full bg-[#f8f3ed] flex items-center justify-center text-[#6e4f32] mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#54381d]">
                Delete this trip plan?
              </h3>
              <p className="text-xs sm:text-sm text-[#75593e] mt-2 mb-6 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#54381d]">
                  &quot;{deleteTargetTrip.destination}&quot;
                </span>
                ? This will permanently remove all daily stops, notes, and scrapbook items. This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTargetTrip(null)}
                  className="px-5 py-2.5 rounded-full bg-[#f2ede7] text-[#54381d] text-xs font-semibold hover:bg-[#ded9d4] transition-colors cursor-pointer"
                >
                  Keep trip
                </button>
                {/* Warm deep brown used for deletion, strictly no harsh red as specified */}
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-full bg-[#6e4f32] text-white text-xs font-semibold hover:bg-[#54381d] active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  Delete plan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            id="toast-notification"
            key="toast-notification"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 32, scale: 0.95 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 24, scale: 0.95 }
            }
            transition={{
              duration: shouldReduceMotion ? 0.05 : 0.26,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed bottom-6 right-6 z-50 bg-[#6e4f32] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 pointer-events-auto"
          >
            <CheckCircle2 className="w-4 h-4 text-[#ffd9b7] shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
