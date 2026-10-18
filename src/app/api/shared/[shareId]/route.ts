import { NextResponse } from "next/server";
import { getSharedTrip } from "@/lib/data/sharing";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;

    if (!shareId) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "This trip is unavailable or sharing is turned off.",
          },
        },
        { status: 404 }
      );
    }

    const result = await getSharedTrip(shareId);

    // Return the exact same "not available" state for a missing share_id and
    // for sharing turned off, so the two cases cannot be told apart.
    if (!result.trip || !result.isShared) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "This trip is unavailable or sharing is turned off.",
          },
        },
        { status: 404 }
      );
    }

    // Return sanitized public read-only plan (never owner's user_id or email)
    return NextResponse.json({
      trip: result.trip,
      isShared: true,
      sharedBy: result.sharedBy || "Traveler",
      lastUpdated: result.lastUpdated || "",
    });
  } catch (err) {
    console.error("[GET /api/shared/[shareId]] Error:", err);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to retrieve shared trip.",
        },
      },
      { status: 500 }
    );
  }
}
