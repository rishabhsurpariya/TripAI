"use client";

import React from "react";
import Link from "next/link";
import { ErrorLayout } from "@/components/common/ErrorLayout";
import { PlaneMapIllustration } from "./illustrations";

interface NotFoundErrorContentProps {
  fullScreen?: boolean;
  className?: string;
  isMobile?: boolean;
}

export function NotFoundErrorContent({
  fullScreen = true,
  className = "",
  isMobile = false,
}: NotFoundErrorContentProps) {
  return (
    <ErrorLayout
      fullScreen={fullScreen}
      className={className}
      navType="logged-out"
      statusBadge="Status: 404"
      illustration={<PlaneMapIllustration isMobile={isMobile} />}
      headline="We lost this page."
      caption="The link may be old or mistyped."
      buttons={
        <>
          <Link
            href="/"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#6e4f32] text-white text-sm font-medium hover:bg-[#8c6e52] transition-all shadow-sm text-center"
          >
            Go home
          </Link>
          <Link
            href="/home"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#d9c9ba]/35 text-[#6e4f32] border border-[#bba591]/40 text-sm font-medium hover:bg-[#d9c9ba]/60 transition-all text-center"
          >
            Plan a trip
          </Link>
        </>
      }
    />
  );
}

export default NotFoundErrorContent;
