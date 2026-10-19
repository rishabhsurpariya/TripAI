import { AIProvider, TripGenerationInput } from "../types";
import {
  ItineraryResponse,
  StaysAndTransportResponse,
  BudgetAdjustmentResponseSchema,
} from "../schemas";
import { BudgetBreakdown, Day, TransportOption } from "@/types/trip";

interface AssembledPlanData {
  days: Day[];
  budget: BudgetBreakdown;
  totalSpent: number;
  adjustmentCallsMade: number;
}

const SYSTEM_PROMPT = `You are a travel budget optimization specialist.
You help trim costs on travel itineraries by proposing budget-friendly alternatives without ruining the trip experience.
Honesty rule: You do NOT have live rates. All suggested prices are approximate typical estimates.
Output strictly valid JSON with no markdown wrapping.`;

export async function assembleAndBalanceBudget(
  provider: AIProvider,
  input: TripGenerationInput,
  itinerary: ItineraryResponse,
  staysAndTransport: StaysAndTransportResponse,
  gettingThere: TransportOption[]
): Promise<AssembledPlanData> {
  // 1. Initial build of days structure
  const days: Day[] = itinerary.days.map((d, index) => {
    const stayInfo = staysAndTransport.stays.find(
      (s) => s.dayNumber === d.dayNumber
    ) || {
      dayNumber: d.dayNumber,
      hotelName: `${input.destination} City Stay`,
      pricePerNight: Math.round(input.budget / (input.days * 2.5)),
      distanceFromStopsKm: 1.5,
      localTransport: ["Walking", "Public Transit"],
    };

    return {
      id: `day-${d.dayNumber}`,
      dayNumber: d.dayNumber,
      title: d.title,
      date: input.startDate
        ? new Date(
            new Date(input.startDate).getTime() +
              index * 24 * 60 * 60 * 1000
          ).toISOString().split("T")[0]
        : undefined,
      notes: d.activities[0]?.tip || undefined,
      localTransport: stayInfo.localTransport,
      stay: {
        id: `stay-${d.dayNumber}`,
        name: stayInfo.hotelName,
        pricePerNight: Math.round(stayInfo.pricePerNight),
        distanceFromStopsKm: Number(stayInfo.distanceFromStopsKm.toFixed(1)),
        imageUrl: "", // Left empty for enrichment stage later
      },
      activities: d.activities.map((a, actIndex) => ({
        id: `act-${d.dayNumber}-${actIndex + 1}`,
        name: a.name,
        description: a.description,
        timeSlot: a.timeSlot,
        durationMinutes: Math.round(a.durationMinutes),
        estimatedCost: Math.round(a.estimatedCost),
        category: a.category,
        imageUrl: "",
        lat: Number(a.lat.toFixed(4)),
        lng: Number(a.lng.toFixed(4)),
        note: a.tip || undefined,
        noteColor: "yellow",
      })),
    };
  });

  // 2. Compute initial category sums strictly in code
  const computeTotals = (
    currentDays: Day[],
    dailyFood: number,
    dailyMisc: number
  ): { breakdown: BudgetBreakdown; total: number } => {
    // Select lowest-cost getting there option for budget calculation
    const transitCost =
      gettingThere.length > 0
        ? Math.min(...gettingThere.map((o) => o.estimatedCost))
        : 0;

    const stayCost = currentDays.reduce(
      (sum, d) => sum + (d.stay?.pricePerNight || 0),
      0
    );

    const activitiesCost = currentDays.reduce(
      (sum, d) =>
        sum +
        d.activities.reduce((aSum, a) => aSum + (a.estimatedCost || 0), 0),
      0
    );

    const foodCost = Math.round(dailyFood * input.days);
    const miscCost = Math.round(dailyMisc * input.days);
    const total = transitCost + stayCost + foodCost + activitiesCost + miscCost;

    return {
      breakdown: {
        transport: Math.round(transitCost),
        stay: Math.round(stayCost),
        food: foodCost,
        activities: Math.round(activitiesCost),
        misc: miscCost,
      },
      total: Math.round(total),
    };
  };

  let dailyFood = staysAndTransport.dailyFoodEstimate;
  let dailyMisc = staysAndTransport.dailyMiscEstimate;
  let { breakdown, total } = computeTotals(days, dailyFood, dailyMisc);
  let adjustmentCallsMade = 0;

  // 3. If over user budget, run ONE optimization call
  if (total > input.budget) {
    const overage = total - input.budget;
    console.log(
      `[assembleAndBalanceBudget] Plan total ($${total}) exceeds budget ($${input.budget}) by $${overage}. Running optimization adjustment pass...`
    );

    try {
      const adjustmentPrompt = `The estimated total of this trip is $${total}, which is $${overage} over the traveler's target budget of $${input.budget}.
Please suggest realistic adjustments to bring it within budget:
- Suggest lower-cost alternative accommodations where appropriate
- Suggest swapping expensive paid activities for free/lower-cost scenic walks, viewpoints, or public sights
- Suggest an adjusted daily food estimate

Current Stays:
${days.map((d) => `Day ${d.dayNumber}: "${d.stay.name}" ($${d.stay.pricePerNight}/night)`).join("\n")}

Top Paid Activities:
${days
  .flatMap((d) => d.activities)
  .filter((a) => a.estimatedCost > 20)
  .map((a) => `- "${a.name}": $${a.estimatedCost}`)
  .slice(0, 6)
  .join("\n")}

Target Total: $${input.budget}`;

      const adjustment = await provider.generateStructured({
        systemPrompt: SYSTEM_PROMPT,
        prompt: adjustmentPrompt,
        schema: BudgetAdjustmentResponseSchema,
        stageName: "Stage 4 (Budget Adjustment)",
      });
      adjustmentCallsMade = 1;

      // Apply adjustments in code
      if (adjustment.adjustedStays && adjustment.adjustedStays.length > 0) {
        for (const adj of adjustment.adjustedStays) {
          const day = days.find((d) => d.dayNumber === adj.dayNumber);
          if (day && day.stay) {
            day.stay.name = adj.hotelName;
            day.stay.pricePerNight = Math.round(adj.pricePerNight);
          }
        }
      }

      if (
        adjustment.adjustedActivities &&
        adjustment.adjustedActivities.length > 0
      ) {
        for (const adj of adjustment.adjustedActivities) {
          const day = days.find((d) => d.dayNumber === adj.dayNumber);
          if (day) {
            const act = day.activities.find(
              (a) => a.name.toLowerCase() === adj.activityName.toLowerCase()
            );
            if (act) {
              act.estimatedCost = Math.round(adj.newEstimatedCost);
            }
          }
        }
      }

      if (
        typeof adjustment.dailyFoodEstimate === "number" &&
        adjustment.dailyFoodEstimate > 0
      ) {
        dailyFood = adjustment.dailyFoodEstimate;
      }

      // Recompute totals in code — never trust model arithmetic
      const recomputed = computeTotals(days, dailyFood, dailyMisc);
      breakdown = recomputed.breakdown;
      total = recomputed.total;
    } catch (adjErr: any) {
      console.warn(
        "[assembleAndBalanceBudget] Optional adjustment pass failed, using original estimate:",
        adjErr?.message
      );
    }
  }

  return {
    days,
    budget: breakdown,
    totalSpent: total,
    adjustmentCallsMade,
  };
}
