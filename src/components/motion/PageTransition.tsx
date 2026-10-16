/**
 * src/components/motion/PageTransition.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Soft fade transition wrapper for Next.js App Router pages.
 *
 * USAGE — wrap page content (not the layout shell) with this component:
 *
 *   // In any page.tsx:
 *   import PageTransition from "@/components/motion/PageTransition";
 *
 *   export default function HomePage() {
 *     return (
 *       <PageTransition>
 *         <main>…page content…</main>
 *       </PageTransition>
 *     );
 *   }
 *
 * The root layout (layout.tsx) imports and renders <PageTransitionShell> once
 * to provide AnimatePresence at the top level. Individual pages wrap their
 * own content with <PageTransition> to trigger the fade on navigation.
 *
 * When prefers-reduced-motion is active the wrapper is transparent (no anim).
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { pageVariant } from "@/lib/motion";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransition({
  children,
  className,
}: PageTransitionProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={pageVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
