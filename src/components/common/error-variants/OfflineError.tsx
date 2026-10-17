"use client";

import React from "react";
import { ErrorLayout } from "@/components/common/ErrorLayout";
import { BalloonTetherIllustration } from "./illustrations";

interface OfflineErrorProps {
  onRetry?: () => void;
  fullScreen?: boolean;
  className?: string;
  isMobile?: boolean;
}

export function OfflineError({
  onRetry,
  fullScreen = true,
  className = "",
  isMobile = false,
}: OfflineErrorProps) {
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
      navType="offline"
      statusBadge="Status: Disconnected"
      illustration={<BalloonTetherIllustration isMobile={isMobile} />}
      headline="You're offline."
      caption="Check your connection and retry."
      buttons={
        <button
          type="button"
          onClick={handleRetry}
          className="w-full sm:w-auto min-w-[180px] px-8 py-3.5 rounded-2xl bg-[#6e4f32] text-white text-sm font-medium hover:bg-[#8c6e52] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          <span>Retry</span>
        </button>
      }
    />
  );
}

export default OfflineError;
