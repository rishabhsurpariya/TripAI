import { z } from "zod";

/**
 * Zod schemas strictly derived from src/types/trip.ts
 * Used to validate AI structured JSON responses at each stage of the pipeline.
 */

// --- Stage 1: Getting There Options ---
export const TransportOptionSchema = z.object({
  mode: z.enum(["train", "bus", "flight"]),
  durationHours: z.number().positive(),
  estimatedCost: z.number().nonnegative(),
  tag: z.enum(["best value", "fastest"]).optional(),
  tip: z.string().max(300).optional(),
});

export const GettingThereResponseSchema = z.object({
  options: z.array(TransportOptionSchema).max(5),
});

export type GettingThereResponse = z.infer<typeof GettingThereResponseSchema>;

// --- Stage 2: Day-by-Day Itinerary ---
export const ActivitySchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
  timeSlot: z.enum(["morning", "afternoon", "evening"]),
  durationMinutes: z.number().int().positive().max(720),
  estimatedCost: z.number().nonnegative(),
  category: z.string().min(1).max(50),
  lat: z.number(),
  lng: z.number(),
  tip: z.string().max(250).optional(), // Becomes the default sticky note
});

export const DayItinerarySchema = z.object({
  dayNumber: z.number().int().positive(),
  title: z.string().min(1).max(120),
  activities: z.array(ActivitySchema).min(2).max(6),
});

export const ItineraryResponseSchema = z.object({
  country: z.string().min(1).max(80),
  interests: z.array(z.string().max(40)).max(6).optional(),
  seasons: z.array(z.string().max(30)).max(4).optional(),
  days: z.array(DayItinerarySchema),
});

export type ItineraryResponse = z.infer<typeof ItineraryResponseSchema>;

// --- Stage 3: Hotels & Local Transport ---
export const DayStaySchema = z.object({
  dayNumber: z.number().int().positive(),
  hotelName: z.string().min(1).max(120),
  pricePerNight: z.number().nonnegative(),
  distanceFromStopsKm: z.number().nonnegative().max(50),
  localTransport: z.array(z.string().max(40)).min(1).max(4),
});

export const StaysAndTransportResponseSchema = z.object({
  dailyFoodEstimate: z.number().nonnegative(),
  dailyMiscEstimate: z.number().nonnegative(),
  stays: z.array(DayStaySchema),
});

export type StaysAndTransportResponse = z.infer<
  typeof StaysAndTransportResponseSchema
>;

// --- Stage 4 (Optional): Budget Adjustment ---
export const BudgetAdjustmentResponseSchema = z.object({
  adjustedStays: z
    .array(
      z.object({
        dayNumber: z.number().int(),
        hotelName: z.string(),
        pricePerNight: z.number().nonnegative(),
      })
    )
    .optional(),
  adjustedActivities: z
    .array(
      z.object({
        dayNumber: z.number().int(),
        activityName: z.string(),
        newEstimatedCost: z.number().nonnegative(),
      })
    )
    .optional(),
  dailyFoodEstimate: z.number().nonnegative().optional(),
});

export type BudgetAdjustmentResponse = z.infer<
  typeof BudgetAdjustmentResponseSchema
>;
