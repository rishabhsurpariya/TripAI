/**
 * ⚠️  DEV-ONLY PAGE — DELETE THIS ENTIRE FILE BEFORE DEPLOYING TO PRODUCTION ⚠️
 *
 * This page is a developer tool that lets you seed real trips into Supabase
 * so you can test My Trips, editing, rename, duplicate, and delete before the
 * AI generation pipeline exists.
 *
 * It is blocked at the server level when NODE_ENV === "production".
 * It is NOT linked from any real page, nav, or sitemap.
 *
 * TO REMOVE: delete src/app/dev-tools/page.tsx (and this entire directory).
 */

import { notFound } from "next/navigation";
import { DevToolsClient } from "./DevToolsClient";

export const metadata = {
  title: "Dev Tools · TripAi",
  robots: "noindex,nofollow",
};

export default function DevToolsPage() {
  // Hard block in production — next/navigation notFound() renders the 404 page
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <DevToolsClient />;
}
