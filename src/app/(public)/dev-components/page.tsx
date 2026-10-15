"use client";

import { useState } from "react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Navbar } from "@/components/layout/Navbar";
import { TripCard } from "@/components/trips/TripCard";
import { ActivityCard } from "@/components/trip/ActivityCard";
import { StickyNote } from "@/components/trip/StickyNote";
import { Modal } from "@/components/ui/Modal";
import { Drawer } from "@/components/ui/Drawer";
import { toast } from "@/components/common/toast";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Trip, Activity } from "@/types/trip";
import sampleItinerary from "@/data/sample-itinerary.json";
import curatedTrips from "@/data/trips.json";
import {
  Sparkles,
  MapPin,
  Share2,
  Trash2,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers,
  Component,
} from "lucide-react";

export default function DevComponentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"grid" | "list">("grid");

  const sampleTrip = curatedTrips[0] as unknown as Trip;
  const sampleTrip2 = curatedTrips[1] as unknown as Trip;
  const sampleActivity = sampleItinerary.days[0].activities[0] as unknown as Activity;
  const sampleActivityWithNote = sampleItinerary.days[0].activities[1] as unknown as Activity;

  return (
    <div className="min-h-screen bg-[#fef9f2] text-[#1d1b18] pb-24">
      {/* Page Title & Instructions Header */}
      <div className="bg-[#f2ede7] border-b border-[#d3c4b9]/50 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6e4f32] text-white flex items-center justify-center shadow-xs">
              <Component className="w-5 h-5 text-[#ffd9b7]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-[#54381d]">
                  Shared Component Showcase
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#ffd9b7] text-[#54381d] text-xs font-semibold">
                  /dev-components
                </span>
              </div>
              <p className="text-xs text-[#81756b]">
                Review all shared components built from the Stitch design system.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-16">

        {/* 1. NAVBARS */}
        <section className="space-y-4">
          <div className="border-b border-[#d3c4b9]/40 pb-2">
            <h2 className="font-serif text-xl font-bold text-[#54381d] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#75593e]" />
              <span>1. Navbars (Public & Logged-In)</span>
            </h2>
            <p className="text-xs text-[#81756b] mt-0.5">
              Exact Stitch navigation headers with responsive layouts and active state styling.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#81756b] mb-1.5 block">
                Public Navbar (Logged Out)
              </span>
              <div className="rounded-2xl overflow-hidden border border-[#d3c4b9]/60 shadow-sm">
                <PublicNavbar activePath="/" />
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#81756b] mb-1.5 block">
                Logged-In Navbar (With User Profile Dropdown)
              </span>
              <div className="rounded-2xl overflow-hidden border border-[#d3c4b9]/60 shadow-sm">
                <Navbar
                  onLogout={() => toast.info("Logged out clicked (Simulated)")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. TRIP CARDS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#d3c4b9]/40 pb-2">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#54381d] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#75593e]" />
                <span>2. TripCard (Curated & Saved Trips)</span>
              </h2>
              <p className="text-xs text-[#81756b] mt-0.5">
                Displays destination photos, status badges, travelers, budget ratio, and contextual actions.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#f2ede7] p-1 rounded-full text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("grid")}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  activeTab === "grid"
                    ? "bg-[#6e4f32] text-white shadow-xs"
                    : "text-[#75593e] hover:text-[#54381d]"
                }`}
              >
                Grid View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  activeTab === "list"
                    ? "bg-[#6e4f32] text-white shadow-xs"
                    : "text-[#75593e] hover:text-[#54381d]"
                }`}
              >
                List View
              </button>
            </div>
          </div>

          <div
            className={
              activeTab === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            <TripCard
              trip={sampleTrip}
              variant={activeTab}
              status="upcoming"
              onShare={(t) => toast.success(`Sharing link copied for ${t.destination}!`)}
              onDuplicate={(t) => toast.info(`Duplicated template for ${t.destination}`)}
              onDelete={(t) => toast.error(`Deleted trip: ${t.destination}`)}
            />
            <TripCard
              trip={sampleTrip2}
              variant={activeTab}
              status="past"
              onShare={(t) => toast.success(`Sharing link copied for ${t.destination}!`)}
              onDuplicate={(t) => toast.info(`Duplicated template for ${t.destination}`)}
              onDelete={(t) => toast.error(`Deleted trip: ${t.destination}`)}
            />
            {activeTab === "grid" && (
              <TripCard
                trip={curatedTrips[2] as unknown as Trip}
                variant="grid"
                status="upcoming"
                onShare={(t) => toast.success(`Sharing link copied for ${t.destination}!`)}
                onDuplicate={(t) => toast.info(`Duplicated template for ${t.destination}`)}
                onDelete={(t) => toast.error(`Deleted trip: ${t.destination}`)}
              />
            )}
          </div>
        </section>

        {/* 3. ACTIVITY CARDS & STICKY NOTES */}
        <section className="space-y-4">
          <div className="border-b border-[#d3c4b9]/40 pb-2">
            <h2 className="font-serif text-xl font-bold text-[#54381d] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#75593e]" />
              <span>3. ActivityCard & StickyNote</span>
            </h2>
            <p className="text-xs text-[#81756b] mt-0.5">
              Timeline milestones, time badges, duration adjustments, cost estimates, and attached washi-tape memos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Standard View */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#81756b] block">
                Standard View Mode
              </span>
              <ActivityCard
                activity={sampleActivity}
                index={1}
                isEditMode={false}
              />
            </div>

            {/* Edit Mode View */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#81756b] block">
                Edit Mode (Drag Handle, Duration +/-, Cost Input, Attached Note)
              </span>
              <ActivityCard
                activity={sampleActivityWithNote}
                index={2}
                isEditMode={true}
                onDelete={(id) => toast.error(`Removed activity: ${id}`)}
                onReplace={(id) => toast.info(`Replace dialog triggered for: ${id}`)}
                onUpdateDuration={(id, mins) =>
                  toast.success(`Duration updated to ${mins / 60}h`)
                }
                onUpdateCost={(id, cost) =>
                  toast.success(`Cost estimate updated to $${cost}`)
                }
                onUpdateNote={(id, note) =>
                  toast.success(`Note updated: "${note.slice(0, 20)}..."`)
                }
              />
            </div>
          </div>

          {/* Standalone Sticky Notes Showcase */}
          <div className="pt-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#81756b] mb-4 block">
              Standalone Sticky Notes (Washi Tape & Palette Switcher)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StickyNote
                note="Remember to withdraw cash at Nishiki Market! Best matcha donuts sell out by 11 AM."
                title="Traveler's Memo"
                defaultColor="#fdfbf7"
                isEditable={true}
                onUpdateNote={(txt) => toast.success("Memo saved")}
              />
              <StickyNote
                note="Golden photo window is 10:00–11:15 AM before the crowds build. Grab fresh poi bread early!"
                isAiNote={true}
                defaultColor="#ffd9b7"
                isEditable={true}
              />
              <StickyNote
                note="Sunset timing ~5:45 PM at the cliffside stage. Pack light rain jackets just in case."
                title="Logistics Tip"
                defaultColor="#d9c9ba"
                isEditable={true}
              />
            </div>
          </div>
        </section>

        {/* 4. MODAL & DRAWER WRAPPERS */}
        <section className="space-y-4">
          <div className="border-b border-[#d3c4b9]/40 pb-2">
            <h2 className="font-serif text-xl font-bold text-[#54381d] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#75593e]" />
              <span>4. Modal & Drawer Wrappers (shadcn / Radix)</span>
            </h2>
            <p className="text-xs text-[#81756b] mt-0.5">
              Accessible dialogs and slide-over panels styled with the Warm Editorial paper canvas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#6e4f32] text-white hover:bg-[#54381d] text-xs font-semibold transition-all shadow-sm"
            >
              Open Sample Modal
            </button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="px-5 py-2.5 rounded-full bg-white border border-[#d3c4b9] text-[#54381d] hover:bg-[#f2ede7] text-xs font-semibold transition-all shadow-sm"
            >
              Open Right Slide-Over Drawer
            </button>
          </div>

          {/* Modal Demo */}
          <Modal
            open={modalOpen}
            onOpenChange={setModalOpen}
            title="Rebuild Day with AI?"
            description="TripAi will propose a freshly paced collection of stops for this day. Your personal notes and pinned reminders will be preserved."
            footer={
              <>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#d3c4b9] text-[#75593e] hover:bg-[#f2ede7] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    toast.success("Day regenerated with freshly paced stops ✨");
                  }}
                  className="px-5 py-2 rounded-full bg-[#6e4f32] text-white hover:bg-[#54381d] text-xs font-semibold"
                >
                  Rebuild Day
                </button>
              </>
            }
          >
            <div className="p-4 rounded-xl bg-[#f8f3ed] border border-[#d3c4b9]/50 space-y-2 text-xs text-[#75593e]">
              <div className="font-semibold text-[#54381d] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#6e4f32]" />
                <span>AI Cadence Setting</span>
              </div>
              <p>
                Currently optimizing for: <strong>Slow Cultural Strolls &amp; Scenic Cafes</strong>
              </p>
            </div>
          </Modal>

          {/* Drawer Demo */}
          <Drawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            title="Add Stop to Itinerary"
            description="Search temples, scenic view points, and local cafes to add to Day 2."
            footer={
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="px-5 py-2 rounded-full bg-[#6e4f32] text-white hover:bg-[#54381d] text-xs font-semibold"
              >
                Done
              </button>
            }
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search spots (e.g. Tenryu-ji, Gion Cafe)..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#d3c4b9] text-xs text-[#1d1b18] placeholder:text-[#81756b] focus:outline-none focus:ring-2 focus:ring-[#6e4f32]"
              />

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#81756b]">
                  Curated Suggestions Nearby
                </p>

                {[
                  {
                    name: "Tenryu-ji Temple Zen Gardens",
                    meta: "UNESCO Heritage &bull; 1.5h",
                    cost: "$5 entry",
                  },
                  {
                    name: "Okochi Sanso Hilltop Villa",
                    meta: "Panoramic gorge vistas &bull; 1.0h",
                    cost: "$8 entry with tea",
                  },
                  {
                    name: "Saga Tofu Ine Luncheon",
                    meta: "Traditional handmade tofu &bull; 1.0h",
                    cost: "$15 per person",
                  },
                ].map((s) => (
                  <div
                    key={s.name}
                    className="p-3 rounded-xl bg-white border border-[#d3c4b9]/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <h4 className="font-serif font-bold text-[#54381d]">
                        {s.name}
                      </h4>
                      <p className="text-[11px] text-[#81756b] mt-0.5">{s.meta}</p>
                      <span className="text-[11px] font-semibold text-[#6e4f32]">
                        {s.cost}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        toast.success(`Added ${s.name} to itinerary!`);
                        setDrawerOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#6e4f32] text-white text-xs font-semibold hover:bg-[#54381d] shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Drawer>
        </section>

        {/* 5. TOAST NOTIFICATIONS */}
        <section className="space-y-4">
          <div className="border-b border-[#d3c4b9]/40 pb-2">
            <h2 className="font-serif text-xl font-bold text-[#54381d] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#75593e]" />
              <span>5. Toast Notification Helpers</span>
            </h2>
            <p className="text-xs text-[#81756b] mt-0.5">
              Warm editorial pill toasts matching the Stitch design.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                toast.success("Trip saved to My Trips • Offline copy ready")
              }
              className="px-4 py-2 rounded-full bg-[#54381d] text-white text-xs font-semibold hover:bg-[#6e4f32] flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5 text-[#ffd9b7]" />
              <span>Trigger Success Toast</span>
            </button>
            <button
              type="button"
              onClick={() =>
                toast.info("Smart Transit Notice: 45 min drive along causeway")
              }
              className="px-4 py-2 rounded-full bg-[#75593e] text-white text-xs font-semibold hover:bg-[#54381d] flex items-center gap-1.5 shadow-sm"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#ffd9b7]" />
              <span>Trigger Info Toast</span>
            </button>
            <button
              type="button"
              onClick={() =>
                toast.error("Network offline • Showing cached itinerary")
              }
              className="px-4 py-2 rounded-full bg-[#ba1a1a] text-white text-xs font-semibold hover:bg-[#93000a] flex items-center gap-1.5 shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Trigger Error Toast</span>
            </button>
          </div>
        </section>

        {/* 6. SKELETON CARD & EMPTY STATE */}
        <section className="space-y-4">
          <div className="border-b border-[#d3c4b9]/40 pb-2">
            <h2 className="font-serif text-xl font-bold text-[#54381d] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#75593e]" />
              <span>6. SkeletonCard & EmptyState</span>
            </h2>
            <p className="text-xs text-[#81756b] mt-0.5">
              Refined loading states and empty journey callouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Skeletons */}
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#81756b] block">
                Loading Shimmer Skeletons
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SkeletonCard variant="trip" />
                <SkeletonCard variant="trip" />
              </div>
              <SkeletonCard variant="list" />
            </div>

            {/* Empty State */}
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#81756b] block">
                Empty State Callout
              </span>
              <EmptyState
                title="Start a new journey"
                description="Tell TripAi where you want to go and your budget. We'll craft a bespoke daily itinerary in seconds."
                actionLabel="Plan with AI"
                onAction={() => toast.success("Plan with AI clicked!")}
                secondaryActionLabel="Explore destinations"
                onSecondaryAction={() => toast.info("Navigating to explore...")}
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
