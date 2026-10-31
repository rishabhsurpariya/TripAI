import { UnsplashRawPhoto } from "./unsplash";

/**
 * Curated pool of verified high-res Unsplash travel photos across common categories.
 * Used as high-quality fallbacks when the live Unsplash API is rate-limited (HTTP 403/429)
 * or temporarily offline, ensuring every card in the trip still gets a unique, relevant photo.
 */
export const CURATED_FALLBACK_POOLS: Record<string, UnsplashRawPhoto[]> = {
  cover: [
    {
      id: "curated-cov-1",
      url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
      description: "Scenic aerial travel panorama and mountain vista",
      attribution: {
        photographerName: "Francesca Tirico",
        photographerUrl: "https://unsplash.com/@francesca_tirico",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-cov-2",
      url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
      description: "Historic temple street with wooden heritage houses and stone path",
      attribution: {
        photographerName: "Andre Benz",
        photographerUrl: "https://unsplash.com/@trapnation",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-cov-3",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      description: "Majestic alpine mountain peaks and dramatic clouds",
      attribution: {
        photographerName: "Kalen Emsley",
        photographerUrl: "https://unsplash.com/@kalenemsley",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-cov-4",
      url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      description: "Romantic golden hour cityscape and iconic landmark",
      attribution: {
        photographerName: "Chris Karidis",
        photographerUrl: "https://unsplash.com/@chriskaridis",
        unsplashUrl: "https://unsplash.com",
      },
    },
  ],

  stays: [
    {
      id: "curated-stay-1",
      url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
      description: "Boutique heritage luxury hotel exterior with warm garden lighting",
      attribution: {
        photographerName: "Manuel Moreno",
        photographerUrl: "https://unsplash.com/@manuelmoreno",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-stay-2",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      description: "Tranquil resort courtyard, palm trees and shimmering swimming pool",
      attribution: {
        photographerName: "Edvin Johansson",
        photographerUrl: "https://unsplash.com/@edvinjohansson",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-stay-3",
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
      description: "Sunlit modern hotel guest room with comfortable plush bed",
      attribution: {
        photographerName: "Andrea Davis",
        photographerUrl: "https://unsplash.com/@andreadavis",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-stay-4",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
      description: "Mediterranean boutique villa patio and tranquil outdoor seating",
      attribution: {
        photographerName: "Roberto Nickson",
        photographerUrl: "https://unsplash.com/@rpnickson",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-stay-5",
      url: "https://images.unsplash.com/photo-1731985861530-334f4eed6121?auto=format&fit=crop&w=600&q=80",
      description: "Cozy artisanal hotel lounge and timber minimalist architecture",
      attribution: {
        photographerName: "Studio Piece",
        photographerUrl: "https://unsplash.com",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-stay-6",
      url: "https://images.unsplash.com/photo-1730489889425-bea9266af1ad?auto=format&fit=crop&w=600&q=80",
      description: "Warm traditional wooden ryokan villa interior with tatami ambiance",
      attribution: {
        photographerName: "Heritage Spaces",
        photographerUrl: "https://unsplash.com",
        unsplashUrl: "https://unsplash.com",
      },
    },
  ],

  heritage: [
    {
      id: "curated-her-1",
      url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
      description: "Historic multi-tiered wooden pagoda overlooking ancient stone streets",
      attribution: {
        photographerName: "Soragrit Wongsa",
        photographerUrl: "https://unsplash.com/@soragrit",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-her-2",
      url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
      description: "Ancient marble architectural monument and world heritage fortress",
      attribution: {
        photographerName: "Sylwia Bartyzel",
        photographerUrl: "https://unsplash.com/@sylwiabartyzel",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-her-3",
      url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
      description: "Classical ancient amphitheater, colosseum and historic arches",
      attribution: {
        photographerName: "David Kohlmann",
        photographerUrl: "https://unsplash.com/@davidkohlmann",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-her-4",
      url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
      description: "Iconic whitewashed heritage hillside village and blue dome towers",
      attribution: {
        photographerName: "Anthony Delanoix",
        photographerUrl: "https://unsplash.com/@anthonydelanoix",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-her-5",
      url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80",
      description: "Zen temple pond reflection, moss garden, and red autumn maple leaves",
      attribution: {
        photographerName: "Su San Lee",
        photographerUrl: "https://unsplash.com/@blackodc",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-her-6",
      url: "https://images.unsplash.com/photo-1694451288643-a2c9b13c7124?auto=format&fit=crop&w=600&q=80",
      description: "Dry rock zen meditation garden with raked gravel and boulders",
      attribution: {
        photographerName: "Takuya Morita",
        photographerUrl: "https://unsplash.com/@takuyamorita",
        unsplashUrl: "https://unsplash.com",
      },
    },
  ],

  nature: [
    {
      id: "curated-nat-1",
      url: "https://images.unsplash.com/photo-1594847110727-c9d3ed572eba?auto=format&fit=crop&w=600&q=80",
      description: "Lush towering green bamboo grove trail with filtered morning sunlight",
      attribution: {
        photographerName: "Satoshi Hirayama",
        photographerUrl: "https://unsplash.com/@satoshihirayama",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-nat-2",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      description: "Spectacular misty river canyon, pine forests, and mountain reflections",
      attribution: {
        photographerName: "Bailey Zindel",
        photographerUrl: "https://unsplash.com/@baileyzindel",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-nat-3",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      description: "Pristine white sand beach with turquoise ocean gentle waves",
      attribution: {
        photographerName: "Sean Oulashin",
        photographerUrl: "https://unsplash.com/@oulashin",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-nat-4",
      url: "https://images.unsplash.com/photo-1558862107-d49ef2a04d72?auto=format&fit=crop&w=600&q=80",
      description: "Shaded stone canal footpath lined with cherry blossoms and moss",
      attribution: {
        photographerName: "Manuel Cosentino",
        photographerUrl: "https://unsplash.com/@manuelcosentino",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-nat-5",
      url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80",
      description: "Expansive savanna landscape with acacia trees during sunset",
      attribution: {
        photographerName: "Damian Patkowski",
        photographerUrl: "https://unsplash.com/@damianpatkowski",
        unsplashUrl: "https://unsplash.com",
      },
    },
  ],

  food: [
    {
      id: "curated-foo-1",
      url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
      description: "Steaming hot authentic noodle bowl with broth, pork, and egg",
      attribution: {
        photographerName: "Manki Kim",
        photographerUrl: "https://unsplash.com/@manki_kim",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-foo-2",
      url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
      description: "Bustling night market street food stalls with savory skewers",
      attribution: {
        photographerName: "Alex Block",
        photographerUrl: "https://unsplash.com/@alexblock",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-foo-3",
      url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
      description: "Traditional green matcha tea ceremony bowl and bamboo whisk",
      attribution: {
        photographerName: "Romain Mathias",
        photographerUrl: "https://unsplash.com/@romainmathias",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-foo-4",
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
      description: "Warm artisan restaurant dining with fresh seasonal gourmet dishes",
      attribution: {
        photographerName: "Jason Leung",
        photographerUrl: "https://unsplash.com/@ninjason",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-foo-5",
      url: "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?auto=format&fit=crop&w=600&q=80",
      description: "Atmospheric izakaya counter dinner with lanterns and small plates",
      attribution: {
        photographerName: "Satoshi Hirayama",
        photographerUrl: "https://unsplash.com/@satoshihirayama",
        unsplashUrl: "https://unsplash.com",
      },
    },
  ],

  nightlife: [
    {
      id: "curated-nig-1",
      url: "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?auto=format&fit=crop&w=600&q=80",
      description: "Historic lantern-lit cobblestone alley at dusk with traditional signs",
      attribution: {
        photographerName: "Andre Benz",
        photographerUrl: "https://unsplash.com/@trapnation",
        unsplashUrl: "https://unsplash.com",
      },
    },
    {
      id: "curated-nig-2",
      url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80",
      description: "Vibrant neon city nightlife with energetic glowing night streets",
      attribution: {
        photographerName: "Aleksandar Pasaric",
        photographerUrl: "https://unsplash.com/@apasaric",
        unsplashUrl: "https://unsplash.com",
      },
    },
  ],
};

/**
 * Maps any arbitrary category name into one of the canonical fallback pool keys.
 */
export function getCategoryFallbackKey(category: string): string {
  const c = (category || "").toLowerCase().trim();
  if (c.includes("food") || c.includes("culinary") || c.includes("dine") || c.includes("market") || c.includes("tea") || c.includes("coffee") || c.includes("eat")) {
    return "food";
  }
  if (c.includes("nature") || c.includes("outdoor") || c.includes("park") || c.includes("garden") || c.includes("mountain") || c.includes("hike") || c.includes("river") || c.includes("walk")) {
    return "nature";
  }
  if (c.includes("night") || c.includes("evening") || c.includes("bar") || c.includes("club") || c.includes("pub")) {
    return "nightlife";
  }
  if (c.includes("beach") || c.includes("sea") || c.includes("ocean") || c.includes("coast") || c.includes("island")) {
    return "nature";
  }
  if (c.includes("hotel") || c.includes("stay") || c.includes("resort") || c.includes("hostel") || c.includes("villa") || c.includes("ryokan")) {
    return "stays";
  }
  // Default for heritage, culture, museum, art, spiritual, temple, shrine, etc.
  return "heritage";
}
