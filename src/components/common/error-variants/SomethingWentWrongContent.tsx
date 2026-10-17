"use client";

import React from "react";
import Link from "next/link";
import { ErrorLayout } from "@/components/common/ErrorLayout";
import { SuitcaseCloudIllustration } from "./illustrations";

interface SomethingWentWrongContentProps {
  reset?: () => void;
  fullScreen?: boolean;
  className?: string;
  isMobile?: boolean;
}

export function SomethingWentWrongContent({
  reset,
  fullScreen = true,
  className = "",
  isMobile = false,
}: SomethingWentWrongContentProps) {
  const handleReset = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <ErrorLayout
      fullScreen={fullScreen}
      className={className}
      navType="logged-in"
      statusBadge="Status: 500"
      illustration={<SuitcaseCloudIllustration isMobile={isMobile} />}
      headline="Something went wrong."
      caption="It's not you. Please try again."
      buttons={
        <>
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#6e4f32] text-white text-sm font-medium hover:bg-[#8c6e52] transition-all shadow-sm cursor-pointer"
          >
            Try again
          </button>
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

export default SomethingWentWrongContent;
