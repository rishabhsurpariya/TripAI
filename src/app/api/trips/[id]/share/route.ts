import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { createClient } from "@/lib/supabase/server";

const shareBodySchema = z.object({
  isShared: z.boolean().optional(),
  revoke: z.boolean().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Trip ID is required." } },
        { status: 400 }
      );
    }

    // Authenticate user
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
            message: "You must be signed in to manage trip sharing.",
          },
        },
        { status: 401 }
      );
    }

    // Parse request body
    let body: z.infer<typeof shareBodySchema> = {};
    try {
      const json = await request.json();
      body = shareBodySchema.parse(json);
    } catch {
      // Body may be empty or optional; default to toggling
    }

    // Lookup trip (RLS on trips ensures user can only access rows where user_id = auth.uid())
    const { data: trip, error: fetchError } = await supabase
      .from("trips")
      .select("id, is_shared, share_id, plan")
      .eq("id", id)
      .single();

    if (fetchError || !trip) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Trip not found or you do not have permission to edit it.",
          },
        },
        { status: 404 }
      );
    }

    // Determine new sharing status
    const isShared =
      typeof body.isShared === "boolean" ? body.isShared : !trip.is_shared;

    let shareId = trip.share_id;
    if (isShared && !shareId) {
      shareId = nanoid(21);
    } else if (!isShared && body.revoke) {
      // Revoking secret link clears share_id so a future enable generates a new one
      shareId = null;
    }

    // Build update payload
    const updatePayload: Record<string, unknown> = {
      is_shared: isShared,
      share_id: shareId,
    };

    // Synchronize plan JSONB with share metadata
    if (trip.plan && typeof trip.plan === "object") {
      updatePayload.plan = {
        ...trip.plan,
        isShared,
        shareId: shareId || undefined,
      };
    }

    const { data: updated, error: updateError } = await supabase
      .from("trips")
      .update(updatePayload)
      .eq("id", id)
      .select("id, is_shared, share_id")
      .single();

    if (updateError || !updated) {
      console.error("[POST /api/trips/[id]/share] Update failed:", updateError);
      return NextResponse.json(
        {
          error: {
            code: "UPDATE_FAILED",
            message: "Failed to update sharing settings.",
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      isShared: updated.is_shared,
      shareId: updated.share_id,
    });
  } catch (err: unknown) {
    console.error("[POST /api/trips/[id]/share] Unexpected error:", err);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred while updating sharing.",
        },
      },
      { status: 500 }
    );
  }
}
