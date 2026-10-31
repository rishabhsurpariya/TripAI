import { Trip } from "@/types/trip";
import { getAIProvider } from "./geminiProvider";
import { TripGenerationInput, PipelineResult } from "./types";
import { validateAndSanitizeInput } from "./stages/inputValidation";
import { generateGettingThere } from "./stages/stage1GettingThere";
import { generateItinerary } from "./stages/stage2Itinerary";
import { generateStaysAndTransport } from "./stages/stage3StaysAndTransport";
import { assembleAndBalanceBudget } from "./stages/stage4BudgetAssembly";
import { enrichTrip } from "@/lib/enrichment/enrichTrip";

/**
 * Main AI Trip Generation Pipeline
 *
 * Calls:
 * - Call 1: Getting there transit options (0 calls if startCity is omitted)
 * - Call 2: Day-by-day itinerary & activities
 * - Call 3: Accommodations & local transport
 * - Call 4 (Optional): Budget adjustment pass if total > budget
 *
 * In normal case: makes exactly 3 model calls (or 2 if no start city).
 * At most: 4 calls (+ up to 2 retries = max 6 calls under rate-limit constraints).
 *
 * Stage 5 (Enrichment - purely deterministic, 0 model calls):
 * - Unsplash landscape photos for destination, stays, and activities
 * - Nominatim geocoding validation for coordinates within 100km perimeter
 */
export async function runGenerationPipeline(
  rawInput: any
): Promise<PipelineResult> {
  // Step 0: Input sanitization & prompt-injection defense
  const input: TripGenerationInput = validateAndSanitizeInput(rawInput);
  const provider = getAIProvider();

  let totalModelCalls = 0;

  // Stage 1: Getting There (Call 1)
  const gettingThereResult = await generateGettingThere(provider, input);
  totalModelCalls += gettingThereResult.callsMade;

  // Stage 2: Day-by-Day Itinerary (Call 2)
  const itineraryResult = await generateItinerary(provider, input);
  totalModelCalls += itineraryResult.callsMade;

  // Stage 3: Hotels, Stays, and Transit (Call 3)
  const staysResult = await generateStaysAndTransport(
    provider,
    input,
    itineraryResult.itinerary
  );
  totalModelCalls += staysResult.callsMade;

  // Stage 4: Programmatic Budget Assembly & Optional Adjustment (Optional Call 4)
  const budgetResult = await assembleAndBalanceBudget(
    provider,
    input,
    itineraryResult.itinerary,
    staysResult.staysAndTransport,
    gettingThereResult.options
  );
  totalModelCalls += budgetResult.adjustmentCallsMade;

  // Construct canonical Trip object adhering strictly to src/types/trip.ts
  const rawTrip: Trip = {
    id: "", // Database generates UUID
    destination: input.destination,
    country: itineraryResult.itinerary.country || "",
    coverImageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    days: budgetResult.days,
    travelers: input.travelers,
    style: input.style,
    startCity: input.startCity,
    totalBudget: input.budget,
    currency: input.currency,
    gettingThere: gettingThereResult.options,
    budget: budgetResult.budget,
    interests: itineraryResult.itinerary.interests || ["Exploration", "Sightseeing"],
    seasons: itineraryResult.itinerary.seasons || ["Year-round"],
    isShared: false,
    shareId: undefined,
    startDate: input.startDate,
  };

  // Stage 5: Post-generation deterministic enrichment (images & coordinates, 0 model calls)
  const { trip: enrichedTrip } = await enrichTrip(
    rawTrip,
    input.destination,
    itineraryResult.itinerary.country || ""
  );

  return {
    trip: enrichedTrip,
    metrics: {
      modelCalls: totalModelCalls,
      stagesCompleted: 5,
      retries: 0,
    },
  };
}
