"use client";

import React from "react";
import Link from "next/link";
import { ErrorLayout } from "@/components/common/ErrorLayout";
import { LuggageTagLockIllustration } from "./illustrations";

interface SessionExpiredErrorProps {
  onLogin?: () => void;
  fullScreen?: boolean;
  className?: string;
  isMobile?: boolean;
}

export function SessionExpiredError({
  onLogin,
  fullScreen = true,
  className = "",
  isMobile = false,
}: SessionExpiredErrorProps) {
  return (
    <ErrorLayout
      fullScreen={fullScreen}
      className={className}
      navType="session"
      statusBadge="Status: 401 Unauthorized"
      illustration={<LuggageTagLockIllustration isMobile={isMobile} />}
      headline="Please log in again."
      caption="Your session timed out."
      buttons={
        onLogin ? (
          <button
            type="button"
            onClick={onLogin}
            className="w-full sm:w-auto min-w-[180px] px-8 py-3.5 rounded-2xl bg-[#6e4f32] text-white text-sm font-medium hover:bg-[#8c6e52] transition-all shadow-sm cursor-pointer"
          >
            Log in
          </button>
        ) : (
          <Link
            href="/login"
            className="w-full sm:w-auto min-w-[180px] px-8 py-3.5 rounded-2xl bg-[#6e4f32] text-white text-sm font-medium hover:bg-[#8c6e52] transition-all shadow-sm text-center"
          >
            Log in
          </Link>
        )
      }
    />
  );
}

export default SessionExpiredError;
