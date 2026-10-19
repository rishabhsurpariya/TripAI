"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  CalendarDays,
  Plane,
  Bus,
  Building2,
  Wallet,
  Map,
  Edit2,
  Printer,
  Check,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Trip, Activity, Stay } from "@/types/trip";
import { easing } from "@/lib/motion";
import { useTripStore } from "@/store/tripStore";
import { TripHeader } from "./TripHeader";
import { DayTimeline } from "./DayTimeline";
import { BudgetSidePanel } from "./BudgetSidePanel";
import { GettingThereTab } from "./GettingThereTab";
import { LocalTransportTab } from "./LocalTransportTab";
import { HotelsTab } from "./HotelsTab";
import { BudgetTab } from "./BudgetTab";
import { TripMapTab } from "./TripMapTab";
import { AddActivityDrawer } from "@/components/edit/AddActivityDrawer";
import { ChangeHotelDrawer } from "@/components/edit/ChangeHotelDrawer";
import { updateTrip } from "@/lib/data/trips";
import { ShareTripModal } from "./ShareTripModal";

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

interface ToastState {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function TripPlanView({ trip }: TripPlanViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("itinerary");
  const shouldReduceMotion = useReducedMotion();

  // Zustand trip store integration
  const currentTrip = useTripStore((state) => state.currentTrip);
  const isEditMode = useTripStore((state) => state.isEditMode);
  const canUndo = useTripStore((state) => state.history.length > 0);
  const canRedo = useTripStore((state) => state.future.length > 0);
  const setTrip = useTripStore((state) => state.setTrip);
  const toggleEditMode = useTripStore((state) => state.toggleEditMode);
  const undo = useTripStore((state) => state.undo);
  const redo = useTripStore((state) => state.redo);
  const discardChanges = useTripStore((state) => state.discardChanges);
  const commitChanges = useTripStore((state) => state.commitChanges);
  const addActivity = useTripStore((state) => state.addActivity);
  const updateStay = useTripStore((state) => state.updateStay);

  // Sync incoming trip prop to store
  useEffect(() => {
    setTrip(trip);
  }, [trip, setTrip]);

  const activeTrip = currentTrip || trip;

  // Drawers and confirmation modals state
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [targetDayForAdd, setTargetDayForAdd] = useState(1);
  const [isHotelDrawerOpen, setIsHotelDrawerOpen] = useState(false);
  const [targetDayForHotel, setTargetDayForHotel] = useState(1);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback(
    (message: string, action?: { label: string; onClick: () => void }) => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToast({ message, action });
      toastTimerRef.current = setTimeout(() => {
        setToast(null);
      }, 3500);
    },
    []
  );

  // Auto-save debounced sync when in edit mode
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!isEditMode) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(async () => {
      if (activeTrip?.id) {
        try {
          await updateTrip(activeTrip.id, activeTrip);
        } catch (err) {
          console.error("[TripPlanView] Auto-save error:", err);
        }
      }
    }, 1500);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [activeTrip, isEditMode]);

  const handleDoneEditing = async () => {
    commitChanges();
    if (activeTrip?.id) {
      try {
        await updateTrip(activeTrip.id, activeTrip);
        showToast("All edits finalized and saved!");
      } catch (err) {
        console.error("[TripPlanView] Failed to save trip:", err);
        showToast("Could not save changes to cloud");
      }
    } else {
      showToast("All edits finalized!");
    }
  };

  // Keyboard shortcuts for Undo and Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditMode) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
          showToast("Redone change");
        } else {
          e.preventDefault();
          undo();
          showToast("Undone previous action");
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        showToast("Redone change");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditMode, undo, redo, showToast]);

  const daysCount = activeTrip.days?.length || 5;
  const totalBudgetSpent = Object.values(activeTrip.budget || {}).reduce(
    (a, b) => a + b,
    0
  );

  const handleOpenAddDrawer = (dayNumber: number) => {
    setTargetDayForAdd(dayNumber);
    setIsAddDrawerOpen(true);
  };

  const handleOpenHotelDrawer = (dayNumber: number) => {
    setTargetDayForHotel(dayNumber);
    setIsHotelDrawerOpen(true);
  };

  const handleAddActivity = (newAct: Activity) => {
    addActivity(targetDayForAdd, newAct);
    showToast(`Added "${newAct.name}" to Day ${targetDayForAdd}`);
    setIsAddDrawerOpen(false);
  };

  const handleSelectHotel = (newStay: Stay, applyToAll: boolean) => {
    updateStay(targetDayForHotel, newStay, applyToAll);
    showToast(
      `Switched hotel to "${newStay.name}"${applyToAll ? " for all nights" : ""}`
    );
    setIsHotelDrawerOpen(false);
  };

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
      <TripHeader trip={activeTrip} onShare={() => setIsShareModalOpen(true)} />

      {/* 2. STICKY EDITING NOTIFICATION BANNER (When Edit Mode is Active) */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -24, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -24, height: 0 }}
            transition={{ duration: 0.35, ease: easing }}
            className="sticky top-16 z-40 py-2.5 px-4 rounded-xl bg-[#f5ede4] border border-[#d3c4b9]/70 shadow-xs flex flex-wrap items-center justify-between gap-3 overflow-hidden"
            id="sticky-editing-banner"
          >
            <div className="flex items-center gap-2 text-primary text-xs font-semibold">
              <span className="material-symbols-outlined text-[18px] text-secondary">
                edit_note
              </span>
              <span>
                You&apos;re editing your trip. Changes save automatically as a draft.
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface/90 text-[11px] text-secondary border border-outline-variant/40 shadow-2xs">
                <span className="material-symbols-outlined text-[13px] text-secondary">
                  cloud_done
                </span>
                Saved just now
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  undo();
                  showToast("Undone previous action");
                }}
                disabled={!canUndo}
                className="w-8 h-8 rounded-lg bg-surface/80 hover:bg-surface text-primary border border-outline-variant/40 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Undo (Ctrl+Z)"
              >
                <span className="material-symbols-outlined text-[16px]">undo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  redo();
                  showToast("Redone change");
                }}
                disabled={!canRedo}
                className="w-8 h-8 rounded-lg bg-surface/80 hover:bg-surface text-primary border border-outline-variant/40 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Redo (Ctrl+Y)"
              >
                <span className="material-symbols-outlined text-[16px]">redo</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. STICKY SECTION TABS BAR WITH EDIT ACTIONS */}
      <section className="sticky top-16 z-30 bg-surface/95 backdrop-blur-md border-b border-outline-variant/50 -mx-3 px-3 sm:mx-0 sm:px-0">
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

          {/* View / Edit Mode Controls */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0 flex-wrap">
            {isEditMode ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-secondary bg-surface-container px-2.5 py-1 rounded-full border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[13px] text-secondary">
                    cloud_done
                  </span>
                  Saved just now
                </span>

                <button
                  type="button"
                  onClick={() => setIsDiscardModalOpen(true)}
                  className="text-xs font-semibold text-secondary hover:text-primary underline-offset-4 hover:underline transition-all px-2.5 py-1 cursor-pointer"
                >
                  Discard changes
                </button>

                <button
                  type="button"
                  onClick={handleDoneEditing}
                  className="px-4 py-1.5 rounded-full bg-primary-container text-on-primary hover:bg-primary text-xs font-semibold shadow-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Done editing</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center bg-surface-container-low p-1 rounded-full shadow-inner border border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => toggleEditMode(false)}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    !isEditMode
                      ? "bg-surface-container-lowest shadow-xs text-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleEditMode(true);
                    showToast("Rearrange Mode active: Drag stops to reorder");
                  }}
                  className={`px-3.5 py-1 rounded-full text-xs transition-all flex items-center gap-1 cursor-pointer ${
                    isEditMode
                      ? "bg-surface-container-lowest shadow-xs text-primary font-bold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  title="Enter edit mode"
                >
                  <Edit2 className="w-3 h-3 text-secondary" />
                  <span>Rearrange</span>
                </button>
              </div>
            )}

            {/* Print / Export Scrapbook Button */}
            <button
              type="button"
              onClick={() => showToast("Exporting vintage journal PDF...")}
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer border border-outline-variant/30"
              title="Export journal"
              aria-label="Export journal"
            >
              <Printer className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. MAIN WORKSPACE CONTENT: TAB PANELS (Animated Crossfade) */}
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
                  <DayTimeline
                    days={activeTrip.days || []}
                    onOpenAddDrawer={handleOpenAddDrawer}
                    onOpenHotelDrawer={handleOpenHotelDrawer}
                    onToast={showToast}
                  />
                </div>

                {/* RIGHT 33% (4 COLUMNS): STICKY SCRAPBOOK SIDE PANEL */}
                <BudgetSidePanel
                  trip={activeTrip}
                  onOpenBudgetTab={() => setActiveTab("budget")}
                />
              </div>
            )}

            {activeTab === "getting-there" && (
              /* TAB 2: GETTING THERE */
              <GettingThereTab trip={activeTrip} />
            )}

            {activeTab === "local-transport" && (
              /* TAB 3: LOCAL TRANSPORT */
              <LocalTransportTab trip={activeTrip} />
            )}

            {activeTab === "hotels" && (
              /* TAB 4: HOTELS */
              <HotelsTab trip={activeTrip} />
            )}

            {activeTab === "budget" && (
              /* TAB 5: BUDGET DETAILED VIEW */
              <BudgetTab trip={activeTrip} />
            )}

            {activeTab === "map" && (
              /* TAB 6: INTERACTIVE ROUTE MAP */
              <TripMapTab trip={activeTrip} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ADD ACTIVITY DRAWER */}
      <AddActivityDrawer
        isOpen={isAddDrawerOpen}
        dayNumber={targetDayForAdd}
        destination={activeTrip.destination || "Goa"}
        onClose={() => setIsAddDrawerOpen(false)}
        onAddActivity={handleAddActivity}
      />

      {/* CHANGE HOTEL DRAWER */}
      <ChangeHotelDrawer
        isOpen={isHotelDrawerOpen}
        dayNumber={targetDayForHotel}
        currentStay={
          activeTrip.days?.find((d) => d.dayNumber === targetDayForHotel)?.stay
        }
        onClose={() => setIsHotelDrawerOpen(false)}
        onSelectStay={handleSelectHotel}
      />

      {/* DISCARD CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDiscardModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"
          >
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.94, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { scale: 0.94, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: easing }}
              className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl p-6 border border-outline-variant/60 flex flex-col space-y-4"
              id="modal-discard-confirm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-serif">
                  <span className="material-symbols-outlined text-[22px] text-secondary">
                    warning
                  </span>
                  <h3 className="font-serif text-xl font-medium">
                    Discard your draft changes?
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDiscardModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-secondary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    close
                  </span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                You will lose all pending rearrangements, duration modifications,
                and added activity stops created during this session.
              </p>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDiscardModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-outline-variant hover:bg-surface-container text-xs font-semibold text-primary cursor-pointer"
                >
                  Keep editing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    discardChanges();
                    setIsDiscardModalOpen(false);
                    showToast("All pending edits discarded");
                  }}
                  className="px-5 py-2 rounded-full bg-secondary hover:bg-primary text-on-primary text-xs font-semibold transition-all cursor-pointer active:scale-95"
                >
                  Discard changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHARE MODAL DIALOG */}
      <ShareTripModal
        trip={activeTrip}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onTripUpdate={(updated) => {
          setTrip(updated);
        }}
        showToast={(msg) => showToast(msg)}
      />

      {/* TOAST NOTIFICATION WITH UNDO SUPPORT (Slides in and out) */}
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.message}
            initial={shouldReduceMotion ? { opacity: 0 } : { y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: 40, opacity: 0, scale: 0.95 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.1 }
                : { type: "spring", stiffness: 450, damping: 28 }
            }
            className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-4 sm:px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 border border-outline-variant/30 text-xs font-semibold max-w-sm"
            id="toastNotification"
          >
            <span className="material-symbols-outlined text-[18px] text-primary-fixed-dim">
              check_circle
            </span>
            <span className="truncate">{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                onClick={toast.action.onClick}
                className="ml-2 px-2.5 py-1 rounded-full bg-primary-fixed-dim text-primary text-[11px] font-bold hover:bg-white transition-colors cursor-pointer shrink-0"
              >
                {toast.action.label}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
