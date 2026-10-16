/**
 * src/components/motion/Reveal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Scroll-triggered reveal wrapper using the fadeUp variant.
 *
 * USAGE
 * ─────
 *   <Reveal>
 *     <p>This fades in and slides up once when it enters the viewport.</p>
 *   </Reveal>
 *
 *   // Custom variant:
 *   <Reveal variants={scaleIn}>
 *     <img … />
 *   </Reveal>
 *
 * The animation plays once (no re-trigger on scroll back).
 * When prefers-reduced-motion is active the element is always visible.
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { fadeUp } from "@/lib/motion";

interface RevealProps {
  children: React.ReactNode;
  /** Override the default fadeUp variant. */
  variants?: Variants;
  /** Extra class names applied to the wrapper div. */
  className?: string;
  /** Viewport margin before triggering (default "-64px"). */
  margin?: string;
}

export default function Reveal({
  children,
  variants = fadeUp,
  className,
  margin = "-64px",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Trigger once when 1 px of the element is visible.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inView = useInView(ref, { once: true, margin: margin as any });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial={prefersReduced ? "visible" : "hidden"}
      animate={prefersReduced ? "visible" : inView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}
