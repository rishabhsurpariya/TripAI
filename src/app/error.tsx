"use client";

import React, { useEffect } from "react";
import { SomethingWentWrongContent } from "@/components/common/error-variants/SomethingWentWrongContent";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for observability
    console.error("TripAi runtime application error:", error);
  }, [error]);

  return <SomethingWentWrongContent reset={reset} fullScreen={true} />;
}
