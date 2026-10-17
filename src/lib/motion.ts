/**
 * src/lib/motion.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised Framer Motion variants and transitions for TripAi.
 *
 * USAGE GUIDE
 * ───────────
 * Import whatever you need:
 *   import { fadeUp, staggerContainer, hoverLift, easing } from "@/lib/motion";
 *
 * Apply to a motion element:
 *   <motion.div variants={fadeUp} initial="hidden" animate="visible" />
 *
 * For staggered children wrap the parent with staggerContainer and each child
 * with any entry variant (e.g. fadeUp). Framer Motion propagates variants
 * automatically when the names match.
 *
 * hoverLift / tapPress are spread directly onto a motion element as props:
 *   <motion.div {...hoverLift} />
 *
 * Respect prefers-reduced-motion by wrapping with <Reveal> or <StaggerList>
 * (see src/components/motion/) which check useReducedMotion internally.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Transition, Variants } from "framer-motion";

// ─── Shared timing ────────────────────────────────────────────────────────────

/** Default easing curve used across the app. */
export const easing = [0.25, 0.1, 0.25, 1] as const;

/** Default duration in seconds (~0.5 s, smooth ease-out feel). */
export const duration = 0.5;

/** Shared base transition applied to all entry variants. */
export const baseTransition: Transition = {
  duration,
  ease: easing,
};

// ─── Entry variants ───────────────────────────────────────────────────────────

/**
 * fadeUp — fade in while sliding up ~16 px.
 * Great for cards, headings and hero content.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
};

/**
 * fadeIn — pure opacity fade with no movement.
 * Use for overlays, modals or subtle reveals.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: baseTransition,
  },
};

/**
 * scaleIn — scale up from 95 % while fading in.
 * Great for modals, toasts and pop-up elements.
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: baseTransition,
  },
};

/**
 * shakeError — gentle horizontal shake with fade in for validation error feedback.
 */
export const shakeError: Variants = {
  hidden: { opacity: 0, x: -4 },
  visible: {
    opacity: 1,
    x: [0, -6, 6, -4, 4, -2, 0],
    transition: { duration: 0.42, ease: easing },
  },
};

// ─── Container / orchestration variants ───────────────────────────────────────

/**
 * staggerContainer — staggers direct children by ~0.08 s.
 * Wrap a list parent with this variant and each child with fadeUp / fadeIn.
 *
 * @param staggerChildren - Delay between each child (default 0.08 s).
 * @param delayChildren   - Initial delay before the first child (default 0 s).
 */
export const staggerContainer = (
  staggerChildren = 0.08,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// ─── Interactive motion props ─────────────────────────────────────────────────

/**
 * hoverLift — spreads onto a motion element to lift it 4 px with a soft shadow.
 * Usage: <motion.div {...hoverLift} />
 */
export const hoverLift = {
  whileHover: {
    y: -4,
    boxShadow:
      "0 12px 32px -4px rgba(0,0,0,0.14), 0 4px 10px -2px rgba(0,0,0,0.08)",
    transition: { duration: 0.2, ease: easing },
  },
} as const;

/**
 * tapPress — slight scale down on tap / click for tactile feedback.
 * Usage: <motion.button {...tapPress} />
 */
export const tapPress = {
  whileTap: {
    scale: 0.97,
    transition: { duration: 0.12, ease: easing },
  },
} as const;

// ─── Page transition variant ──────────────────────────────────────────────────

/**
 * pageVariant — soft fade used by <PageTransition> between routes.
 * Keeps the transition shorter (0.35 s) so navigation feels snappy.
 */
export const pageVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: easing },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: easing },
  },
};
