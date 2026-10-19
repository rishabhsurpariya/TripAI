"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Share2,
  X,
  Globe,
  Lock,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Trip } from "@/types/trip";
import { setShared } from "@/lib/data/sharing";

export interface ShareTripModalProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onTripUpdate?: (updatedTrip: Trip) => void;
  showToast?: (message: string) => void;
}

export function ShareTripModal({
  trip,
  isOpen,
  onClose,
  onTripUpdate,
  showToast,
}: ShareTripModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isCopied, setIsCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!trip) return null;

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://tripai.com";

  // Use shareId if present, else fall back to trip.id
  const shareSlug = trip.shareId || trip.id;
  const shareUrl = `${origin}/shared/${shareSlug}`;

  const handleCopyLink = async () => {
    if (!trip.isShared) return;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setIsCopied(true);
      showToast?.("✓ Secret link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      showToast?.("Failed to copy link to clipboard");
    }
  };

  const handleTogglePrivacy = async () => {
    const newState = !trip.isShared;
    setIsUpdating(true);

    try {
      const res = await setShared(trip.id, newState);
      if (res) {
        const updatedTrip: Trip = {
          ...trip,
          isShared: res.isShared,
          shareId: res.shareId ?? trip.shareId,
        };
        onTripUpdate?.(updatedTrip);
        showToast?.(
          newState ? "Public link re-enabled" : "Public link disabled (private)"
        );
      }
    } catch (err: any) {
      console.error("[ShareTripModal] Toggle error:", err);
      showToast?.(err?.message || "Failed to update sharing settings");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRevokeShare = async () => {
    setIsUpdating(true);

    try {
      const res = await setShared(trip.id, false, true);
      if (res) {
        const updatedTrip: Trip = {
          ...trip,
          isShared: false,
          shareId: undefined,
        };
        onTripUpdate?.(updatedTrip);
        showToast?.("Secret link revoked");
      }
    } catch (err: any) {
      console.error("[ShareTripModal] Revoke error:", err);
      showToast?.(err?.message || "Failed to revoke secret link");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="share-modal"
          key="share-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#54381d]/30 backdrop-blur-sm"
          onClick={onClose}
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
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f8f3ed] text-[#54381d] flex items-center justify-center hover:bg-[#ece7e1] transition-colors cursor-pointer"
              aria-label="Close modal"
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
                    trip.coverImageUrl ||
                    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&q=80"
                  }
                  alt={trip.destination}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#54381d] truncate">
                  {trip.destination}{trip.country ? `, ${trip.country}` : ""}
                </p>
                <p className="text-xs text-[#81756b] flex items-center gap-1 mt-0.5">
                  {trip.isShared ? (
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
                  Public link {trip.isShared ? "enabled" : "disabled"}
                </span>
                <span className="text-xs text-[#81756b]">
                  {trip.isShared
                    ? "Unlisted; anyone with the secret link can view"
                    : "Only accessible by you when logged in"}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(trip.isShared)}
                  onChange={handleTogglePrivacy}
                  disabled={isUpdating}
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
                    trip.isShared
                      ? shareUrl
                      : "Public sharing is currently disabled"
                  }
                  className="w-full h-11 px-3.5 rounded-xl bg-[#f8f3ed] text-xs font-mono text-[#54381d] border border-[#d3c4b9]/50 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                disabled={!trip.isShared || isUpdating}
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
                disabled={isUpdating}
                className="text-xs font-semibold text-[#81756b] hover:text-[#54381d] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? "Updating..." : "Revoke secret link"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#6e4f32] text-white text-xs font-semibold hover:opacity-95 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
