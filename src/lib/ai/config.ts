/**
 * AI Provider Configuration
 *
 * Model selection:
 * Gemini Flash-Lite is optimized for fast, cost-effective structured output on free-tier limits.
 * The default model is 'gemini-3.5-flash-lite' (newest stable Flash-Lite model).
 * It can be overridden at runtime via the GEMINI_MODEL environment variable.
 */

export const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";

export const GEMINI_MODEL =
  process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
