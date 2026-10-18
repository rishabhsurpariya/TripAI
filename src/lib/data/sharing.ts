import { Trip } from "@/types/trip";
import sampleItinerary from "@/data/sample-itinerary.json";
import { getCuratedTrips } from "./curated";
import { useSavedTripsStore } from "@/store/savedTripsStore";
import { USE_MOCK_DATA } from "./config";

export { USE_MOCK_DATA };

export interface SharedTripResult {
  trip: Trip | null;
  isShared: boolean;
  sharedBy: string;
  lastUpdated: string;
  source: "goa-stitch" | "sample" | "saved" | "curated" | "not-found";
}

// Canonical Stitch Design Goa Trip Plan
export const GOA_SHARED_TRIP: Trip = {
  id: "trip-goa-shared",
  destination: "Goa Coastal Odyssey",
  country: "India",
  coverImageUrl:
    "https://lh3.googleusercontent.com/aida/AEtjO1VWdFv1ysxzCUc21vKtlvs1ysbpz3SVAG2drwz56KIudH4fc5O-Jxuo2z0fiMF4KMD349DhRspkkXavGKRfk6K0KSHW-hSDJwXcXK2JZ-cAgghrc5qeTSNDlFX0DS83gpfg5jA8P8pB330Bm0-51CwC7CAciYmXFxy2wG7ISC9TGZPGqVpyS87AvbB6lmj86ajnza7kBviQsKFXNocjZ0qBxColW3IzgxdtNnsuHewvLR5YN-GvtaN6Sdw",
  travelers: 2,
  style: "comfort",
  startCity: "Jaipur",
  totalBudget: 25000,
  budget: {
    transport: 5100,
    stay: 11200,
    food: 3300,
    activities: 3800,
    misc: 0,
  },
  gettingThere: [
    {
      mode: "flight",
      durationHours: 2.5,
      estimatedCost: 6800,
      tag: "fastest",
      tip: "Direct flight into Manohar International Airport (Mopa) or Dabolim",
    },
    {
      mode: "train",
      durationHours: 27.5,
      estimatedCost: 2200,
      tag: "best value",
      tip: "Maru Sagar Express down through the scenic Western Ghats corridor",
    },
  ],
  interests: ["Heritage", "Culinary", "Coastal Walks", "Scenic"],
  seasons: ["Winter", "Spring"],
  shareId: "goa-coastal-odyssey",
  isShared: true,
  days: [
    {
      id: "day-1",
      dayNumber: 1,
      title: "Arrival, Latin Quarter & Sunset by the Sea",
      date: "Thursday, Nov 14",
      notes:
        "Remember to withdraw cash at Panjim market for beach shacks! Sunset timing ~5:45 PM at Reis Magos.",
      localTransport: ["Scooter Rental", "Mandovi Ferry", "Walking"],
      activities: [
        {
          id: "act-1",
          name: "Fontainhas Heritage Walk",
          description:
            "Stroll past vibrant 18th-century Portuguese-style mansions, azulejo tile murals, and charming heritage bakery doors.",
          timeSlot: "morning",
          durationMinutes: 120,
          estimatedCost: 0,
          category: "Heritage",
          imageUrl:
            "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
          lat: 15.4989,
          lng: 73.8278,
          note: "Bakeries open at 8 AM. Try hot Poi bread with melted butter.",
          noteColor: "yellow",
        },
        {
          id: "act-2",
          name: "Traditional Goan Lunch at Viva Panjim",
          description:
            "Family-run eatery hidden in narrow alleys serving homestyle Fish Curry Rice, Prawn Balchão, and Bebinca.",
          timeSlot: "afternoon",
          durationMinutes: 90,
          estimatedCost: 800,
          category: "Food",
          imageUrl:
            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
          lat: 15.4975,
          lng: 73.829,
        },
        {
          id: "act-3",
          name: "Reis Magos Fort Sunset Viewpoint",
          description:
            "Perched on the Mandovi estuary, this restored 16th-century fortress offers panoramic river views without the Baga crowds.",
          timeSlot: "evening",
          durationMinutes: 105,
          estimatedCost: 150,
          category: "Scenic",
          imageUrl:
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
          lat: 15.4984,
          lng: 73.8087,
          note: "Last ticket issued at 5:00 PM. Magnificent photography light.",
          noteColor: "teal",
        },
      ],
      stay: {
        id: "stay-1",
        name: "Panjim Heritage Inn & Courtyard",
        pricePerNight: 2800,
        distanceFromStopsKm: 0.4,
        imageUrl:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      },
    },
    {
      id: "day-2",
      dayNumber: 2,
      title: "Spice Plantations & Old Goa Churches",
      date: "Friday, Nov 15",
      notes: "Carry mosquito repellent for the spice plantation walk.",
      localTransport: ["Self-drive car", "Local bus"],
      activities: [
        {
          id: "act-4",
          name: "Basilica of Bom Jesus & Sé Cathedral",
          description:
            "UNESCO World Heritage site containing the sacred relics of St. Francis Xavier, featuring ornate baroque gilded altars.",
          timeSlot: "morning",
          durationMinutes: 120,
          estimatedCost: 50,
          category: "Heritage",
          imageUrl:
            "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
          lat: 15.5009,
          lng: 73.9116,
        },
        {
          id: "act-5",
          name: "Sahakari Spice Farm Tour & Banana Leaf Buffet",
          description:
            "Guided botanical walk through vanilla, cardamom, and betel nut groves followed by an authentic Konkani buffet.",
          timeSlot: "afternoon",
          durationMinutes: 180,
          estimatedCost: 600,
          category: "Food",
          imageUrl:
            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
          lat: 15.4059,
          lng: 74.0132,
        },
        {
          id: "act-6",
          name: "Miramar Beach Sunset Stroll",
          description:
            "Broad palm-fringed shoreline meeting the Arabian Sea, ideal for watching fishing trawlers return at dusk.",
          timeSlot: "evening",
          durationMinutes: 75,
          estimatedCost: 0,
          category: "Beaches",
          imageUrl:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
          lat: 15.4831,
          lng: 73.8082,
        },
      ],
      stay: {
        id: "stay-2",
        name: "Panjim Heritage Inn & Courtyard",
        pricePerNight: 2800,
        distanceFromStopsKm: 1.2,
        imageUrl:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      },
    },
    {
      id: "day-3",
      dayNumber: 3,
      title: "Quiet South Goa Sands & Cliffside Dinner",
      date: "Saturday, Nov 16",
      notes: "Cab from North to South takes approx 1 hr 15 mins.",
      localTransport: ["Pre-paid taxi", "Scooter"],
      activities: [
        {
          id: "act-7",
          name: "Cabo de Rama Fort Lookout",
          description:
            "Ancient fortress perched atop sheer cliff walls overlooking turquoise water, steeped in folklore and solitude.",
          timeSlot: "morning",
          durationMinutes: 110,
          estimatedCost: 0,
          category: "Scenic",
          imageUrl:
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
          lat: 15.0894,
          lng: 73.9194,
          note: "Spectacular breezy cliff view. Wear sturdy sandals.",
          noteColor: "purple",
        },
        {
          id: "act-8",
          name: "Cola Beach Hidden Lagoon",
          description:
            "Untouched sandy beach featuring an emerald freshwater lagoon surrounded by coconut palms just meters from the surf.",
          timeSlot: "afternoon",
          durationMinutes: 150,
          estimatedCost: 200,
          category: "Beaches",
          imageUrl:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
          lat: 15.0563,
          lng: 73.9669,
        },
        {
          id: "act-9",
          name: "Agonda Cliffside Candlelight Seafood",
          description:
            "Fresh red snapper catch cooked over open coconut husks, eaten with feet in soft sand under lantern light.",
          timeSlot: "evening",
          durationMinutes: 120,
          estimatedCost: 1200,
          category: "Food",
          imageUrl:
            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
          lat: 15.0445,
          lng: 73.9882,
        },
      ],
      stay: {
        id: "stay-3",
        name: "Agonda Palm Grove Eco Cottages",
        pricePerNight: 2800,
        distanceFromStopsKm: 0.2,
        imageUrl:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
      },
    },
    {
      id: "day-4",
      dayNumber: 4,
      title: "Palolem Kayaking & Dolphin Spotting",
      date: "Sunday, Nov 17",
      notes: "Early morning boat safari at 7:30 AM before winds pick up.",
      localTransport: ["Kayak", "Walking"],
      activities: [
        {
          id: "act-10",
          name: "Butterfly Beach Sea Kayak Expedition",
          description:
            "Paddle through sheltered cove waters past semi-submerged volcanic boulders to spot playful Indo-Pacific humpback dolphins.",
          timeSlot: "morning",
          durationMinutes: 130,
          estimatedCost: 700,
          category: "Adventure",
          imageUrl:
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
          lat: 15.025,
          lng: 74.0205,
        },
        {
          id: "act-11",
          name: "Lazy Palolem Bay Lunch & Smoothie Bowl",
          description:
            "Organic beachside cafe lounge with cold brew, avocado sourdough, and panoramic views of crescent-shaped bay.",
          timeSlot: "afternoon",
          durationMinutes: 100,
          estimatedCost: 550,
          category: "Food",
          imageUrl:
            "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
          lat: 15.01,
          lng: 74.023,
        },
        {
          id: "act-12",
          name: "Monkey Island Causeway Sunset",
          description:
            "Low-tide crossing across the sand spit to explore natural rock tidal pools at the northern tip of the bay.",
          timeSlot: "evening",
          durationMinutes: 80,
          estimatedCost: 0,
          category: "Scenic",
          imageUrl:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
          lat: 15.015,
          lng: 74.018,
        },
      ],
      stay: {
        id: "stay-4",
        name: "Agonda Palm Grove Eco Cottages",
        pricePerNight: 2800,
        distanceFromStopsKm: 5.4,
        imageUrl:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
      },
    },
  ],
};

/**
 * Loads a trip by shareId from available mock data:
 * 1. Checks user's local savedTripsStore
 * 2. Checks Goa Stitch Design trip
 * 3. Checks sample-itinerary.json
 * 4. Checks curated trips (trips.json)
 */
export function getSharedTripSync(shareId: string): SharedTripResult {
  if (!USE_MOCK_DATA) {
    return {
      trip: null,
      isShared: false,
      sharedBy: "",
      lastUpdated: "",
      source: "not-found",
    };
  }

  // 1. Check local savedTripsStore if browser/client side
  if (typeof window !== "undefined") {
    try {
      const savedTrips = useSavedTripsStore.getState().trips;
      const foundInStore = savedTrips.find(
        (t) => t.shareId === shareId || t.id === shareId
      );
      if (foundInStore) {
        return {
          trip: foundInStore,
          isShared: foundInStore.isShared ?? true,
          sharedBy: "Elena",
          lastUpdated: "Recently",
          source: "saved",
        };
      }
    } catch {
      // Ignore if store not yet hydrated
    }
  }

  // 2. Exact match for Goa Stitch Canonical Trip
  if (
    shareId === "goa-coastal-odyssey" ||
    shareId === "goa-shared" ||
    shareId === "aarav-goa"
  ) {
    return {
      trip: GOA_SHARED_TRIP,
      isShared: true,
      sharedBy: "Aarav",
      lastUpdated: "Nov 18, 2024",
      source: "goa-stitch",
    };
  }

  // 3. Match goa-sun-2026: specifically configured as isShared: false in trips.json
  if (shareId === "goa-sun-2026") {
    return {
      trip: {
        ...GOA_SHARED_TRIP,
        shareId: "goa-sun-2026",
        isShared: false,
      },
      isShared: false,
      sharedBy: "Aarav",
      lastUpdated: "Nov 18, 2024",
      source: "goa-stitch",
    };
  }

  // 4. Match Kyoto sample itinerary
  if (
    shareId === "kyoto-spring-2026" ||
    shareId === sampleItinerary.id ||
    shareId === "kyoto"
  ) {
    return {
      trip: sampleItinerary as unknown as Trip,
      isShared: sampleItinerary.isShared ?? true,
      sharedBy: "Aarav",
      lastUpdated: "Apr 10, 2026",
      source: "sample",
    };
  }

  // 5. Match from curated trips
  const curated = getCuratedTrips();
  const tripInCatalog = curated.find(
    (t) => t.shareId === shareId || t.id === shareId
  );

  if (tripInCatalog) {
    // Populate days from sampleItinerary if not present
    const enrichedTrip: Trip = {
      ...sampleItinerary,
      ...tripInCatalog,
      days:
        tripInCatalog.days && tripInCatalog.days.length > 0
          ? tripInCatalog.days
          : (sampleItinerary.days as unknown as Trip["days"]),
    } as unknown as Trip;

    return {
      trip: enrichedTrip,
      isShared: tripInCatalog.isShared ?? false,
      sharedBy: "Aarav",
      lastUpdated: "Nov 18, 2024",
      source: "curated",
    };
  }

  // 6. Not Found
  return {
    trip: null,
    isShared: false,
    sharedBy: "",
    lastUpdated: "",
    source: "not-found",
  };
}

/**
 * Async version of getSharedTrip conforming to section 4 & 6 of backend-tech-stack.md.
 * Reads public read-only trip data via the get_shared_trip Postgres security-definer function.
 * Never exposes owner user_id or email.
 */
export async function getSharedTrip(shareId: string): Promise<SharedTripResult> {
  if (USE_MOCK_DATA) {
    return getSharedTripSync(shareId);
  }

  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const { data, error } = await supabase.rpc("get_shared_trip", {
      p_share_id: shareId,
    });

    if (error) {
      console.error("[getSharedTrip] Postgres RPC error:", error.message);
      return {
        trip: null,
        isShared: false,
        sharedBy: "",
        lastUpdated: "",
        source: "not-found",
      };
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
        trip: null,
        isShared: false,
        sharedBy: "",
        lastUpdated: "",
        source: "not-found",
      };
    }

    const row = data[0];
    const plan = (row.plan || {}) as Record<string, any>;

    // Strictly ensure no owner metadata is present in the plan object
    delete plan.userId;
    delete plan.user_id;
    delete plan.email;

    const trip: Trip = {
      ...plan,
      destination: row.destination || plan.destination || "",
      country: row.country || plan.country || "",
      coverImageUrl: row.cover_image_url || plan.coverImageUrl || "",
      shareId,
      isShared: true,
    } as Trip;

    return {
      trip,
      isShared: true,
      sharedBy: "Traveler",
      lastUpdated: "Recently",
      source: "saved",
    };
  } catch (err) {
    console.error("[getSharedTrip] Unexpected error:", err);
    return {
      trip: null,
      isShared: false,
      sharedBy: "",
      lastUpdated: "",
      source: "not-found",
    };
  }
}

/**
 * Sets or toggles share status on a trip.
 */
export async function setShared(
  id: string,
  isShared?: boolean,
  revoke?: boolean
): Promise<{ isShared: boolean; shareId?: string } | null> {
  if (USE_MOCK_DATA) {
    useSavedTripsStore.getState().toggleShare(id, isShared);
    const updated = useSavedTripsStore.getState().trips.find((t) => t.id === id);
    if (!updated) return null;
    return {
      isShared: Boolean(updated.isShared),
      shareId: updated.shareId,
    };
  }

  const res = await fetch(`/api/trips/${id}/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isShared, revoke }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to update trip sharing");
  }

  const data = await res.json();
  return {
    isShared: Boolean(data.isShared),
    shareId: data.shareId,
  };
}
