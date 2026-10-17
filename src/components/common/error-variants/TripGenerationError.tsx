"use client";

import React from "react";
import Link from "next/link";
import { ErrorLayout } from "@/components/common/ErrorLayout";
import { CompassCardIllustration } from "./illustrations";

interface TripGenerationErrorProps {
  onRetry?: () => void;
  onEdit?: () => void;
  fullScreen?: boolean;
  className?: string;
  isMobile?: boolean;
}

export function TripGenerationError({
  onRetry,
  onEdit,
  fullScreen = true,
  className = "",
  isMobile = false,
}: TripGenerationErrorProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <ErrorLayout
      fullScreen={fullScreen}
      className={className}
      navType="logged-in"
      statusBadge="Status: Generation Timeout"
      illustration={<CompassCardIllustration isMobile={isMobile} />}
      headline="We couldn't build your trip."
      caption="Your details are saved. Try once more."
      buttons={
        <>
          <button
            type="button"
            onClick={handleRetry}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#6e4f32] text-white text-sm font-medium hover:bg-[#8c6e52] transition-all shadow-sm cursor-pointer"
          >
            Try again
          </button>
          {onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#d9c9ba]/35 text-[#6e4f32] border border-[#bba591]/40 text-sm font-medium hover:bg-[#d9c9ba]/60 transition-all cursor-pointer"
            >
              Edit my details
            </button>
          ) : (
            <Link
              href="/home"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#d9c9ba]/35 text-[#6e4f32] border border-[#bba591]/40 text-sm font-medium hover:bg-[#d9c9ba]/60 transition-all text-center"
            >
              Edit my details
            </Link>
          )}
        </>
      }
    />
  );
}

export default TripGenerationError;
