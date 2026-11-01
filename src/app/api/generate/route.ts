import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runGenerationPipeline } from "@/lib/ai/pipeline";
import {
  AIRateLimitError,
  AIInvalidInputError,
  AIValidationError,
  AIGenerationError,
} from "@/lib/ai/types";
import { createTripServer } from "@/lib/data/trips.server";

export async function POST(request: Request) {
  try {
    // 1. Authenticate user from session cookies (never trust client-sent user_id)
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "You must be signed in to generate travel plans.",
          },
        },
        { status: 401 }
      );
    }

    // 2. Parse request JSON body
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_INPUT",
            message: "Request body must be valid JSON.",
          },
        },
        { status: 400 }
      );
    }

    // 3. Execute generation pipeline
    console.log(
      `[POST /api/generate] Starting AI generation for user ${user.id} -> destination: "${(rawBody as Record<string, unknown>)?.destination}"`
    );

    const { trip, metrics } = await runGenerationPipeline(rawBody);

    console.log(
      `[POST /api/generate] Generation complete (${metrics.modelCalls} model calls). Saving to database...`
    );

    // 4. Save trip to database through server data access layer
    const savedTrip = await createTripServer(trip);

    return NextResponse.json({
      success: true,
      tripId: savedTrip.id,
      modelCalls: metrics.modelCalls,
    });
  } catch (err: unknown) {
    if (err instanceof AIRateLimitError) {
      console.warn("[POST /api/generate] Rate limit triggered:", err.message);
      return NextResponse.json(
        {
          error: {
            code: "RATE_LIMIT",
            message: "busy, try again soon",
          },
        },
        { status: 429 }
      );
    }

    if (err instanceof AIInvalidInputError) {
      console.warn("[POST /api/generate] Invalid input rejected:", err.message);
      return NextResponse.json(
        {
          error: {
            code: "INVALID_INPUT",
            message: err.message,
          },
        },
        { status: 400 }
      );
    }

    if (
      err instanceof AIValidationError ||
      err instanceof AIGenerationError
    ) {
      console.error(
        "[POST /api/generate] Generation failure:",
        err.name,
        err.message
      );
      return NextResponse.json(
        {
          error: {
            code: "GENERATION_FAILED",
            message: "We couldn't build your trip right now.",
          },
        },
        { status: 500 }
      );
    }

    console.error("[POST /api/generate] Unexpected server error:", err);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred during trip generation.",
        },
      },
      { status: 500 }
    );
  }
}
