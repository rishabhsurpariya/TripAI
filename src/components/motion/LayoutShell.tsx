/**
 * src/components/motion/LayoutShell.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Thin client component that wraps children with AnimatePresence so that
 * page exit animations are possible across App Router navigations.
 *
 * Rendered once in the root layout.tsx — do not nest it.
 * Individual pages use <PageTransition> to trigger their own fade.
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import { AnimatePresence } from "framer-motion";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
