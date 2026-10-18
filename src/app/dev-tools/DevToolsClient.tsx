"use client";

/**
 * ⚠️  DEV-ONLY COMPONENT — DELETE BEFORE DEPLOYMENT ⚠️
 * See page.tsx for full explanation.
 */

import { useState } from "react";
import Link from "next/link";
import sampleItinerary from "@/data/sample-itinerary.json";
import { createTrip } from "@/lib/data/trips";
import type { Trip } from "@/types/trip";

// ---------------------------------------------------------------------------
// Seed presets — each gives the copy a distinct destination/title so you can
// tell them apart in My Trips. start_date is offset from today so Upcoming /
// Past filtering can also be tested.
// ---------------------------------------------------------------------------
interface SeedPreset {
  label: string;
  destinationOverride: string;
  startDaysFromNow: number; // positive = upcoming, negative = past
}

const PRESETS: SeedPreset[] = [
  { label: "Save test trip (upcoming, +15 days)", destinationOverride: "Kyoto (test 1 – upcoming)", startDaysFromNow: 15 },
  { label: "Save test trip (upcoming, +45 days)", destinationOverride: "Kyoto (test 2 – upcoming)", startDaysFromNow: 45 },
  { label: "Save test trip (past, -10 days)",    destinationOverride: "Kyoto (test 3 – past)",    startDaysFromNow: -10 },
  { label: "Save test trip (past, -60 days)",    destinationOverride: "Kyoto (test 4 – past)",    startDaysFromNow: -60 },
];

function offsetDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ToastState {
  message: string;
  tripId?: string;
  isError?: boolean;
}

export function DevToolsClient() {
  const [busy, setBusy] = useState<number | null>(null); // index of preset being saved
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (state: ToastState) => {
    setToast(state);
    setTimeout(() => setToast(null), 6000);
  };

  const handleSave = async (preset: SeedPreset, idx: number) => {
    setBusy(idx);
    setToast(null);

    try {
      const startDate = offsetDate(preset.startDaysFromNow);
      const numDays = (sampleItinerary.days ?? []).length;

      // Build a Trip value that matches the frontend Trip type exactly.
      // The id from JSON is intentionally stripped so createTrip lets Postgres
      // generate a fresh UUID — never trust a client-supplied id.
      const tripPayload: Trip = {
        ...(sampleItinerary as unknown as Trip),
        // Override top-level columns so they match what the data layer writes
        // to dedicated columns (destination, country, cover_image_url, etc.)
        id: "",                                     // stripped — DB generates UUID
        destination: preset.destinationOverride,
        country: sampleItinerary.country,
        coverImageUrl: sampleItinerary.coverImageUrl,
        startDate,
        // endDate is not a DB column but stored inside plan.endDate
        endDate: offsetDate(preset.startDaysFromNow + numDays),
        travelers: sampleItinerary.travelers,
        style: sampleItinerary.style as Trip["style"],
        totalBudget: sampleItinerary.totalBudget,
        // Sharing is off for test trips
        isShared: false,
        shareId: undefined,
      };

      const saved = await createTrip(tripPayload);

      showToast({
        message: `✓ Saved "${saved.destination}" (id: ${saved.id.slice(0, 8)}…)`,
        tripId: saved.id,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast({ message: `✗ Error: ${msg}`, isError: true });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f2ec] text-[#54381d] p-8 font-sans">
      {/* Warning banner */}
      <div className="max-w-xl mx-auto mb-6 px-4 py-3 rounded-xl bg-amber-100 border border-amber-400 text-amber-900 text-xs font-semibold flex items-start gap-2">
        <span className="text-lg leading-none">⚠️</span>
        <span>
          <strong>DEV-ONLY PAGE — DELETE BEFORE DEPLOYMENT.</strong>{" "}
          This page is blocked in production (returns 404). It is not linked from any real
          page. Remove{" "}
          <code className="bg-amber-200 px-1 rounded">src/app/dev-tools/</code> before
          going live.
        </span>
      </div>

      <div className="max-w-xl mx-auto">
        <h1 className="font-serif text-3xl font-bold mb-1">Dev Tools</h1>
        <p className="text-sm text-[#75593e] mb-8">
          Seed real test trips into Supabase using the live data layer. Each button calls{" "}
          <code className="text-xs bg-[#ece7e1] px-1.5 py-0.5 rounded">createTrip()</code>{" "}
          with a copy of <code className="text-xs bg-[#ece7e1] px-1.5 py-0.5 rounded">sample-itinerary.json</code>.
          The user id is taken from the authenticated Supabase session, never from the client.
        </p>

        {/* Preset buttons */}
        <div className="flex flex-col gap-3 mb-8">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              id={`dev-save-trip-${idx + 1}`}
              type="button"
              disabled={busy !== null}
              onClick={() => handleSave(preset, idx)}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl bg-white border border-[#d3c4b9]/60 shadow-sm hover:bg-[#f8f3ed] active:scale-[0.98] transition-all text-sm font-semibold text-[#54381d] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{preset.label}</span>
              {busy === idx ? (
                <span className="text-xs text-[#75593e] animate-pulse">Saving…</span>
              ) : (
                <span className="text-[11px] font-mono text-[#81756b]">
                  start_date: {offsetDate(preset.startDaysFromNow)}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Navigation helpers */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/trips"
            className="px-5 py-2.5 rounded-full bg-[#6e4f32] text-white text-xs font-semibold hover:opacity-95 active:scale-95 transition-all"
          >
            → Go to My Trips
          </Link>
          <Link
            href="/home"
            className="px-5 py-2.5 rounded-full bg-[#f2ede7] text-[#54381d] text-xs font-semibold hover:bg-[#ded9d4] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-xl text-xs font-semibold border ${
            toast.isError
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-[#6e4f32] text-white border-transparent"
          }`}
        >
          <span>{toast.message}</span>
          {toast.tripId && !toast.isError && (
            <Link
              href="/trips"
              className="underline underline-offset-2 opacity-80 hover:opacity-100"
            >
              View in My Trips →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
