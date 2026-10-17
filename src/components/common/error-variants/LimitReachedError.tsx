"use client";

import React from "react";
import Link from "next/link";
import { ErrorLayout } from "@/components/common/ErrorLayout";
import { HourglassTicketsIllustration } from "./illustrations";

interface LimitReachedErrorProps {
  onBack?: () => void;
  fullScreen?: boolean;
  className?: string;
  isMobile?: boolean;
}

export function LimitReachedError({
  onBack,
  fullScreen = true,
  className = "",
  isMobile = false,
}: LimitReachedErrorProps) {
  return (
    <ErrorLayout
      fullScreen={fullScreen}
      className={className}
      navType="logged-in"
      statusBadge="Status: 429 Rate Limited"
      illustration={<HourglassTicketsIllustration isMobile={isMobile} />}
      headline="Taking a short break."
      caption="You've hit today's planning limit. Try again later."
      buttons={
        onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 rounded-2xl bg-[#6e4f32] text-white text-sm font-medium hover:bg-[#8c6e52] transition-all shadow-sm cursor-pointer"
          >
            Back to my trips
          </button>
        ) : (
          <Link
            href="/trips"
            className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 rounded-2xl bg-[#6e4f32] text-white text-sm font-medium hover:bg-[#8c6e52] transition-all shadow-sm text-center"
          >
            Back to my trips
          </Link>
        )
      }
    />
  );
}

export default LimitReachedError;
