import { AIInvalidInputError, TripGenerationInput } from "../types";

/**
 * Strips control characters and normalizes whitespace.
 */
function sanitizeString(input: string): string {
  return input
    .replace(/[\x00-\x1F\x7F]/g, "")
    .trim();
}

/**
 * Simple heuristic to reject nonsensical or adversarial destinations.
 */
const INJECTION_PATTERNS = [
  /ignore (all )?(previous|above) instructions/i,
  /system prompt/i,
  /drop table/i,
  /select\s+\*\s+from/i,
  /delete from/i,
  /<script>/i,
];

export function validateAndSanitizeInput(
  rawInput: any
): TripGenerationInput {
  if (!rawInput || typeof rawInput !== "object") {
    throw new AIInvalidInputError("Input must be a valid JSON object.");
  }

  // 1. Destination
  const rawDest = String(rawInput.destination || "");
  const destination = sanitizeString(rawDest);
  if (!destination || destination.length < 2 || destination.length > 100) {
    throw new AIInvalidInputError(
      "Destination must be a valid place name between 2 and 100 characters."
    );
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(destination)) {
      throw new AIInvalidInputError("Invalid or disallowed destination input.");
    }
  }

  // 2. Days
  const daysNum = Number(rawInput.days);
  if (isNaN(daysNum) || !Number.isInteger(daysNum) || daysNum < 1 || daysNum > 15) {
    throw new AIInvalidInputError(
      "Trip duration must be an integer between 1 and 15 days."
    );
  }

  // 3. Budget
  const budgetNum = Number(rawInput.budget);
  if (isNaN(budgetNum) || budgetNum <= 0) {
    throw new AIInvalidInputError(
      "Total budget must be a positive number greater than 0."
    );
  }

  // 4. Travelers
  const travelersNum = Number(rawInput.travelers || 1);
  if (
    isNaN(travelersNum) ||
    !Number.isInteger(travelersNum) ||
    travelersNum < 1 ||
    travelersNum > 50
  ) {
    throw new AIInvalidInputError(
      "Number of travelers must be between 1 and 50."
    );
  }

  // 5. Travel Style
  const rawStyle = String(rawInput.style || "comfort").toLowerCase();
  const validStyles = ["budget", "comfort", "adventure"] as const;
  const style = validStyles.includes(rawStyle as any)
    ? (rawStyle as "budget" | "comfort" | "adventure")
    : "comfort";

  // 6. Start City (optional)
  let startCity: string | undefined = undefined;
  if (rawInput.startCity) {
    const sanitizedStart = sanitizeString(String(rawInput.startCity));
    if (sanitizedStart.length > 0) {
      if (sanitizedStart.length > 100) {
        throw new AIInvalidInputError(
          "Starting city must be at most 100 characters."
        );
      }
      for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(sanitizedStart)) {
          throw new AIInvalidInputError("Invalid starting city input.");
        }
      }
      startCity = sanitizedStart;
    }
  }

  // 7. Start Date (optional YYYY-MM-DD)
  let startDate: string | undefined = undefined;
  if (rawInput.startDate) {
    const sanitizedDate = sanitizeString(String(rawInput.startDate));
    if (/^\d{4}-\d{2}-\d{2}$/.test(sanitizedDate)) {
      startDate = sanitizedDate;
    }
  }

  return {
    destination,
    days: daysNum,
    budget: budgetNum,
    style,
    travelers: travelersNum,
    startCity,
    startDate,
  };
}
