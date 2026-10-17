"use client";

import React from "react";
import Link from "next/link";
import { ErrorLayout } from "@/components/common/ErrorLayout";
import { PolaroidCorkboardIllustration } from "./illustrations";

interface TripUnavailableErrorProps {
  onPlan?: () => void;
  fullScreen?: boolean;
  className?: string;
  isMobile?: boolean;
}

export function TripUnavailableError({
  onPlan,
  fullScreen = true,
  className = "",
  isMobile = false,
}: TripUnavailableErrorProps) {
  return (
    <ErrorLayout
      fullScreen={fullScreen}
      className={className}
      navType="minimal"
      statusBadge="Status: 403 Forbidden"
      illustration={<PolaroidCorkboardIllustration isMobile={isMobile} />}
      headline="This trip isn't shared anymore."
      caption="The owner may have turned off the link."
      buttons={
        <>
          {onPlan ? (
            <button
              type="button"
              onClick={onPlan}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#6e4f32] text-white text-sm font-medium hover:bg-[#8c6e52] transition-all shadow-sm cursor-pointer"
            >
              Plan your own trip
            </button>
          ) : (
            <Link
              href="/home"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#6e4f32] text-white text-sm font-medium hover:bg-[#8c6e52] transition-all shadow-sm text-center"
            >
              Plan your own trip
            </Link>
          )}
          <Link
            href="/"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#d9c9ba]/35 text-[#6e4f32] border border-[#bba591]/40 text-sm font-medium hover:bg-[#d9c9ba]/60 transition-all text-center"
          >
            Go home
          </Link>
        </>
      }
    />
  );
}

export default TripUnavailableError;
