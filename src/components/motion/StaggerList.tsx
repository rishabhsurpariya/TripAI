/**
 * src/components/motion/StaggerList.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Orchestrates a staggered entrance for a list of children.
 *
 * USAGE
 * ─────
 *   <StaggerList>
 *     {trips.map((t) => (
 *       <TripCard key={t.id} trip={t} />   // each child gets fadeUp automatically
 *     ))}
 *   </StaggerList>
 *
 *   // Custom stagger delay and initial delay:
 *   <StaggerList staggerDelay={0.12} initialDelay={0.2}>
 *     …
 *   </StaggerList>
 *
 * Children do NOT need their own variants — StaggerList wraps each child in a
 * motion.div with the fadeUp variant so they animate in sequence.
 *
 * When prefers-reduced-motion is active all children appear immediately.
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motion";

interface StaggerListProps {
  children: React.ReactNode;
  /** Seconds between each child animation (default 0.08). */
  staggerDelay?: number;
  /** Seconds before the first child animates (default 0). */
  initialDelay?: number;
  /** Extra classes on the container. */
  className?: string;
}

export default function StaggerList({
  children,
  staggerDelay = 0.08,
  initialDelay = 0,
  className,
}: StaggerListProps) {
  const prefersReduced = useReducedMotion();
  const containerVariants = staggerContainer(staggerDelay, initialDelay);

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial={prefersReduced ? "visible" : "hidden"}
      animate="visible"
    >
      {/* Wrap each child in a motion.div so they inherit the stagger */}
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={prefersReduced ? undefined : fadeUp}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
