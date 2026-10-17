import { Trip } from "@/types/trip";
import sampleItinerary from "@/data/sample-itinerary.json";
import tripsData from "@/data/trips.json";
import { useSavedTripsStore } from "@/store/savedTripsStore";

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
      stay: {
        id: "stay-ahilya",
        name: "Ahilya by the Sea (Dolphin Bay)",
        pricePerNight: 6800,
        distanceFromStopsKm: 4.2,
        imageUrl:
          "https://lh3.googleusercontent.com/aida/AEtjO1VWdFv1ysxzCUc21vKtlvs1ysbpz3SVAG2drwz56KIudH4fc5O-Jxuo2z0fiMF4KMD349DhRspkkXavGKRfk6K0KSHW-hSDJwXcXK2JZ-cAgghrc5qeTSNDlFX0DS83gpfg5jA8P8pB330Bm0-51CwC7CAciYmXFxy2wG7ISC9TGZPGqVpyS87AvbB6lmj86ajnza7kBviQsKFXNocjZ0qBxColW3IzgxdtNnsuHewvLR5YN-GvtaN6Sdw",
      },
      activities: [
        {
          id: "goa-act-1",
          name: "Stroll through Fontainhas & Heritage Bakeries",
          description:
            "Explore quiet, sun-drenched alleys flanked by 18th-century Portuguese bungalows, azulejo ceramic tiles, and warm Bebinca fresh from the wood-fired ovens of 31st January Bakery.",
          timeSlot: "Morning · 10:30 AM",
          durationMinutes: 150,
          estimatedCost: 350,
          category: "Culture & Walk",
          imageUrl:
            "https://lh3.googleusercontent.com/aida/AEtjO1VWdFv1ysxzCUc21vKtlvs1ysbpz3SVAG2drwz56KIudH4fc5O-Jxuo2z0fiMF4KMD349DhRspkkXavGKRfk6K0KSHW-hSDJwXcXK2JZ-cAgghrc5qeTSNDlFX0DS83gpfg5jA8P8pB330Bm0-51CwC7CAciYmXFxy2wG7ISC9TGZPGqVpyS87AvbB6lmj86ajnza7kBviQsKFXNocjZ0qBxColW3IzgxdtNnsuHewvLR5YN-GvtaN6Sdw",
          lat: 15.4989,
          lng: 73.8278,
          note: "Golden photo window is 10:00–11:15 AM before the heat builds. Grab fresh poi bread early!",
          noteColor: "#f8f0e5",
        },
        {
          id: "goa-act-2",
          name: "Spice Luncheon at Mum's Kitchen",
          description:
            "Celebrated preservation kitchen dedicated to forgotten Christian and Hindu Goan ancestral recipes. Savor authentic Meen Koddi, Kokum Solkadhi, and spicy Crab Xec Xec.",
          timeSlot: "Afternoon · 02:00 PM",
          durationMinutes: 90,
          estimatedCost: 1200,
          category: "Culinary Heritage",
          imageUrl:
            "https://lh3.googleusercontent.com/aida/AEtjO1XEDE1cLpttoIPYmuOJZpxnYgbedr7RFywkwaJtYp7h6CAb9oHyBgaiObdaE2UF9E0c3E1SNvAgQHKRDim4mQtFiDy26hzn_EzI0C-464DYMLZjKbvHUN066witVEJnyYkrrB1DQDRInBcipJJ6kxt2eoy2GkJGwtpuiAMY5iQG0-qNVn2JLkOt0uGjaqgDjvzQcGOdEWeq2aOJEjodbCbl3LB8L4M_k3jc_ELjZfDF7huMhjAEjr74G00",
          lat: 15.4909,
          lng: 73.8122,
          note: "Book patio table under the frangipani!",
          noteColor: "#f2e7db",
        },
        {
          id: "goa-act-3",
          name: "Golden Hour Walk at Reis Magos Fort",
          description:
            "Climb the restored red laterite fortress ramparts built in 1551. Enjoy panoramic views where the Mandovi River embraces the Arabian Sea as wooden fishing dhows glide home.",
          timeSlot: "Golden Hour · 05:00 PM",
          durationMinutes: 120,
          estimatedCost: 200,
          category: "Scenic & Fort",
          imageUrl:
            "https://lh3.googleusercontent.com/aida/AEtjO1U5UDc4vV0HEXtj-fB2D-SKWEnJvUwhJRerJ6FfFfe0jLBTZeW1qkXsrNmDP5s3FDJ9h8iBq7YC7_cjyTDoGxb3NfXusxT5xUdlrIFwAr4WFfmgOe6mO95RrKZcoQ0A2fkTNggT7mSKHX8LT3pDxiA2SgSN2sFO_mJxFI8HvVOc0hCdFQaKh59mTDF7kYdO2Nol1B5AIPaq4LElWkT0IninOK4IBsq3GgtGIlG0u-RTkMzrKKBUTRS7vH4",
          lat: 15.498,
          lng: 73.8087,
        },
      ],
    },
    {
      id: "day-2",
      dayNumber: 2,
      title: "Ancient Temples, Spice Groves & River Twilight",
      date: "Friday, Nov 15",
      notes:
        "Wear breathable linen & footwear that slips off easily for spice farm walks and temple sanctums.",
      localTransport: ["Hired Driver", "Catamaran Cruise"],
      stay: {
        id: "stay-ahilya-2",
        name: "Ahilya by the Sea (Dolphin Bay)",
        pricePerNight: 6800,
        distanceFromStopsKm: 4.2,
        imageUrl:
          "https://lh3.googleusercontent.com/aida/AEtjO1VWdFv1ysxzCUc21vKtlvs1ysbpz3SVAG2drwz56KIudH4fc5O-Jxuo2z0fiMF4KMD349DhRspkkXavGKRfk6K0KSHW-hSDJwXcXK2JZ-cAgghrc5qeTSNDlFX0DS83gpfg5jA8P8pB330Bm0-51CwC7CAciYmXFxy2wG7ISC9TGZPGqVpyS87AvbB6lmj86ajnza7kBviQsKFXNocjZ0qBxColW3IzgxdtNnsuHewvLR5YN-GvtaN6Sdw",
      },
      activities: [
        {
          id: "goa-act-4",
          name: "Sahakari Spice Farm Tour & Traditional Buffet",
          description:
            "Guided walk through aromatic vanilla, cinnamon, and pepper orchards. Followed by a fresh banana-leaf lunch prepared with estate-grown spices and cashew feni tasting.",
          timeSlot: "Morning · 09:30 AM",
          durationMinutes: 180,
          estimatedCost: 1000,
          category: "Nature & Food",
          imageUrl:
            "https://lh3.googleusercontent.com/aida/AEtjO1VyAITd8D27_V5Dm9xDlf9kOBh4_tRqDk6VV2Zl-jlvY0wFn0SkN-udkSS8hQTMOca9yLdocBE67lt4Wk9HU8mLD_qP9towWwXLsR_uU8kYSATgJbxt8T1jOT_Y2YxmFGkQGgFe9Lj0AlSkiqre38fq1qt1-a4fYtkxuJyBoDjD4yIPBU7MlW-Rz2AmHSWvYGls6GDnidP1YwTrKV8PdPE5-pIUpxmml4VDM1dqhY8pDP8Eckl93gnuDuU",
          lat: 15.4055,
          lng: 74.0204,
        },
        {
          id: "goa-act-5",
          name: "Sunset Catamaran on the Mandovi Estuary",
          description:
            "Sail past sleepy mangrove channels and Chorao island bird sanctuaries away from crowded tourist boats. Complimentary local port wine and acoustic Goan folk melodies.",
          timeSlot: "Sunset · 04:45 PM",
          durationMinutes: 120,
          estimatedCost: 1400,
          category: "River Cruise",
          imageUrl:
            "https://lh3.googleusercontent.com/aida/AEtjO1U5UDc4vV0HEXtj-fB2D-SKWEnJvUwhJRerJ6FfFfe0jLBTZeW1qkXsrNmDP5s3FDJ9h8iBq7YC7_cjyTDoGxb3NfXusxT5xUdlrIFwAr4WFfmgOe6mO95RrKZcoQ0A2fkTNggT7mSKHX8LT3pDxiA2SgSN2sFO_mJxFI8HvVOc0hCdFQaKh59mTDF7kYdO2Nol1B5AIPaq4LElWkT0IninOK4IBsq3GgtGIlG0u-RTkMzrKKBUTRS7vH4",
          lat: 15.502,
          lng: 73.911,
        },
      ],
    },
    {
      id: "day-3",
      dayNumber: 3,
      title: "Anjuna Cliffside Trails & Beachside Sundowner",
      date: "Saturday, Nov 16",
      notes: "Arrive at Anjuna cliff early to catch low tide rock pools.",
      localTransport: ["Scooter Rental"],
      stay: {
        id: "stay-ahilya-3",
        name: "Ahilya by the Sea (Dolphin Bay)",
        pricePerNight: 6800,
        distanceFromStopsKm: 4.2,
        imageUrl:
          "https://lh3.googleusercontent.com/aida/AEtjO1VWdFv1ysxzCUc21vKtlvs1ysbpz3SVAG2drwz56KIudH4fc5O-Jxuo2z0fiMF4KMD349DhRspkkXavGKRfk6K0KSHW-hSDJwXcXK2JZ-cAgghrc5qeTSNDlFX0DS83gpfg5jA8P8pB330Bm0-51CwC7CAciYmXFxy2wG7ISC9TGZPGqVpyS87AvbB6lmj86ajnza7kBviQsKFXNocjZ0qBxColW3IzgxdtNnsuHewvLR5YN-GvtaN6Sdw",
      },
      activities: [
        {
          id: "goa-act-6",
          name: "Anjuna Flea Market & Seaside Trail",
          description:
            "Browse artisan jewelry, vintage textiles, and handcrafted leather items before walking along the red cliff edge.",
          timeSlot: "Morning · 10:00 AM",
          durationMinutes: 150,
          estimatedCost: 200,
          category: "Culture",
          imageUrl:
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
          lat: 15.579,
          lng: 73.743,
        },
        {
          id: "goa-act-7",
          name: "Sunset Cocktails at Curlies",
          description:
            "Watch the golden sun dip below the Arabian Sea with chilled King's beer and wood-fired flatbreads.",
          timeSlot: "Sunset · 05:30 PM",
          durationMinutes: 120,
          estimatedCost: 1500,
          category: "Scenic & Food",
          imageUrl:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
          lat: 15.572,
          lng: 73.742,
        },
      ],
    },
    {
      id: "day-4",
      dayNumber: 4,
      title: "Divar Island Cycling & Backwater Sanctuary",
      date: "Sunday, Nov 17",
      notes: "Carry a small backpack with water and sun protection.",
      localTransport: ["River Ferry", "Bicycle"],
      stay: {
        id: "stay-ahilya-4",
        name: "Ahilya by the Sea (Dolphin Bay)",
        pricePerNight: 6800,
        distanceFromStopsKm: 4.2,
        imageUrl:
          "https://lh3.googleusercontent.com/aida/AEtjO1VWdFv1ysxzCUc21vKtlvs1ysbpz3SVAG2drwz56KIudH4fc5O-Jxuo2z0fiMF4KMD349DhRspkkXavGKRfk6K0KSHW-hSDJwXcXK2JZ-cAgghrc5qeTSNDlFX0DS83gpfg5jA8P8pB330Bm0-51CwC7CAciYmXFxy2wG7ISC9TGZPGqVpyS87AvbB6lmj86ajnza7kBviQsKFXNocjZ0qBxColW3IzgxdtNnsuHewvLR5YN-GvtaN6Sdw",
      },
      activities: [
        {
          id: "goa-act-8",
          name: "Divar Island Ferry & Village Bicycle Loop",
          description:
            "Take the free river ferry across to sleepy Divar Island, cycling through paddy fields and whitewashed Portuguese chapels.",
          timeSlot: "Morning · 09:00 AM",
          durationMinutes: 210,
          estimatedCost: 800,
          category: "Adventure",
          imageUrl:
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
          lat: 15.518,
          lng: 73.901,
        },
        {
          id: "goa-act-9",
          name: "Goan Fish Curry Thali at Ritz Classic",
          description:
            "Legendary lunch spot famous for fresh Kingfish fry, Crab Masala, clams, and sour solkadhi.",
          timeSlot: "Afternoon · 01:30 PM",
          durationMinutes: 90,
          estimatedCost: 900,
          category: "Food",
          imageUrl:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
          lat: 15.496,
          lng: 73.824,
        },
      ],
    },
    {
      id: "day-5",
      dayNumber: 5,
      title: "Morjim Beach Turtle Walk & Farewell",
      date: "Monday, Nov 18",
      notes: "Pack luggage before checkout; departure flight late evening.",
      localTransport: ["Prepaid Cab", "Airport Drop"],
      stay: {
        id: "stay-ahilya-5",
        name: "Ahilya by the Sea (Dolphin Bay)",
        pricePerNight: 6800,
        distanceFromStopsKm: 4.2,
        imageUrl:
          "https://lh3.googleusercontent.com/aida/AEtjO1VWdFv1ysxzCUc21vKtlvs1ysbpz3SVAG2drwz56KIudH4fc5O-Jxuo2z0fiMF4KMD349DhRspkkXavGKRfk6K0KSHW-hSDJwXcXK2JZ-cAgghrc5qeTSNDlFX0DS83gpfg5jA8P8pB330Bm0-51CwC7CAciYmXFxy2wG7ISC9TGZPGqVpyS87AvbB6lmj86ajnza7kBviQsKFXNocjZ0qBxColW3IzgxdtNnsuHewvLR5YN-GvtaN6Sdw",
      },
      activities: [
        {
          id: "goa-act-10",
          name: "Morjim Olive Ridley Nesting Coast Walk",
          description:
            "Peaceful barefoot morning walk along the protected sandbar where migratory birds and sea turtles find refuge.",
          timeSlot: "Morning · 08:30 AM",
          durationMinutes: 120,
          estimatedCost: 0,
          category: "Nature",
          imageUrl:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
          lat: 15.632,
          lng: 73.731,
        },
        {
          id: "goa-act-11",
          name: "Farewell Seafood Lunch at Fisherman's Wharf",
          description:
            "Riverside dining beside the Sal river with Goan prawn balchão and pork vindaloo before airport transfer.",
          timeSlot: "Afternoon · 01:00 PM",
          durationMinutes: 120,
          estimatedCost: 1800,
          category: "Food",
          imageUrl:
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
          lat: 15.228,
          lng: 73.946,
        },
      ],
    },
  ],
};

/**
 * Loads a trip by shareId from all available mock data:
 * 1. Checks user's local savedTripsStore
 * 2. Checks Goa Stitch Design trip
 * 3. Checks sample-itinerary.json
 * 4. Checks trips.json
 */
export function getSharedTrip(shareId: string): SharedTripResult {
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

  // 5. Match from trips.json
  const tripInCatalog = (tripsData as unknown as Trip[]).find(
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
