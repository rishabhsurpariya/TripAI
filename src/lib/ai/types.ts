import { z } from "zod";
import { TravelStyle, Trip } from "@/types/trip";

export interface TripGenerationInput {
  destination: string;
  days: number;
  budget: number;
  currency: string; // ISO 4217 code, e.g. "INR", "USD"
  style: TravelStyle;
  travelers: number;
  startCity?: string;
  interests?: string[];
  startDate?: string;
}

export interface GenerateStructuredOptions<T> {
  systemPrompt?: string;
  prompt: string;
  schema: z.ZodType<T>;
  stageName: string;
}

export interface AIProvider {
  name: string;
  generateStructured<T>(options: GenerateStructuredOptions<T>): Promise<T>;
}

export interface GenerationMetrics {
  modelCalls: number;
  stagesCompleted: number;
  retries: number;
}

export interface PipelineResult {
  trip: Trip;
  metrics: GenerationMetrics;
}

export class AIRateLimitError extends Error {
  code = "RATE_LIMIT" as const;
  statusCode = 429;
  constructor(message = "Service busy, please try again soon.") {
    super(message);
    this.name = "AIRateLimitError";
  }
}

export class AIValidationError extends Error {
  code = "VALIDATION_FAILED" as const;
  statusCode = 422;
  constructor(message = "AI response failed validation.") {
    super(message);
    this.name = "AIValidationError";
  }
}

export class AIGenerationError extends Error {
  code = "GENERATION_FAILED" as const;
  statusCode = 500;
  constructor(message = "Failed to generate travel plan.") {
    super(message);
    this.name = "AIGenerationError";
  }
}

export class AIInvalidInputError extends Error {
  code = "INVALID_INPUT" as const;
  statusCode = 400;
  constructor(message = "Invalid travel input provided.") {
    super(message);
    this.name = "AIInvalidInputError";
  }
}
