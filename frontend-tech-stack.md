# TripAi: Frontend Tech Stack and Build Guide

> Give this file to the coding agent at the start of the project. It covers the tech stack, project structure, data model and build rules. All UI and visual design already exists from Stitch and is NOT part of this file. Do not redesign or restyle anything.

---

## 1. Project Overview

**TripAi** is an AI travel itinerary planner. A logged-in user enters a destination, budget and number of days (optionally travel style, group size and starting city). The app returns a complete trip plan: a day-by-day itinerary, how to get there (train, bus or flight with approximate costs), local transport, hotel suggestions near each day's spots, and a budget breakdown. Users can edit, save and share plans.

**Current phase: frontend only.** Turn the existing Stitch designs into a working Next.js app using mock data. No backend, no database, no AI calls yet. Structure the code so these can be plugged in later without rewriting components.

---

## 2. Tech Stack

| Need | Choice |
|---|---|
| Framework | **Next.js** (App Router) |
| Language | **TypeScript** (strict mode) |
| Styling | **Tailwind CSS** |
| UI components | **shadcn/ui** (modals, drawers, tabs, dropdowns, toasts, accordion, tooltip) |
| Icons | **lucide-react** |
| Animation | **Framer Motion** |
| Drag and drop | **dnd-kit** (reordering activity cards in edit mode) |
| Forms and validation | **React Hook Form** + **Zod** |
| Charts | **Recharts** (budget charts) |
| Maps | **react-leaflet** + **Leaflet** with OpenStreetMap tiles (free, no API key) |
| State management | **Zustand** (trip being edited, undo and redo, UI state) |
| Package manager | **npm** (or pnpm if already set up) |
| Deployment (later) | **Vercel** |

### Install order (add libraries only when the page that needs them is built)
1. Next.js + TypeScript + Tailwind via `create-next-app`
2. shadcn/ui, lucide-react, Framer Motion
3. React Hook Form + Zod (planner form, login, sign up)
4. Recharts (trip plan budget tab)
5. react-leaflet + leaflet (map views)
6. dnd-kit + Zustand (edit mode)

Do NOT install authentication, database or AI libraries in this phase.

---

## 3. Pages and Routes

| Route | Page | Access |
|---|---|---|
| `/` | Landing page | Public |
| `/login` | Login | Public |
| `/signup` | Sign up | Public |
| `/forgot-password` | Forgot password | Public |
| `/home` | Home: planner form, curated trips, explore by interest, explore by season | Logged in |
| `/explore` | Explore results, filtered by interest or season via query params | Logged in |
| `/generating` | Loading / generating screen with progress steps | Logged in |
| `/trip/[id]` | Trip plan page (itinerary, getting there, local transport, hotels, budget, map) with edit mode | Logged in |
| `/trips` | My Trips (grid and list views) | Logged in |
| `/shared/[shareId]` | Shared trip, public and read-only | Public |
| `not-found.tsx`, `error.tsx` | 404 and generic error pages | Public |

Edit mode is a **state of `/trip/[id]`**, not a separate route.

In this phase, authentication is faked: use a simple mock "logged in" flag so protected pages can be built and navigated.

---

## 4. Suggested Folder Structure

```
src/
  app/
    (public)/
      page.tsx                 # landing
      login/page.tsx
      signup/page.tsx
      forgot-password/page.tsx
      shared/[shareId]/page.tsx
    (app)/
      home/page.tsx
      explore/page.tsx
      generating/page.tsx
      trips/page.tsx
      trip/[id]/page.tsx
    not-found.tsx
    error.tsx
    layout.tsx
  components/
    ui/                        # shadcn/ui components
    layout/                    # navbars
    home/                      # planner form, curated trip card, interest and season cards
    trip/                      # trip header, day timeline, activity card, sticky note,
                               # stay card, budget panel, budget chart, trip map, tabs
    edit/                      # drag handle, add activity drawer, change hotel drawer
    trips/                     # trip card, list row, share modal
    common/                    # skeletons, empty states, toast helpers
  data/
    trips.json                 # 10 to 15 mock curated trips
    sample-itinerary.json      # one complete itinerary for the trip plan page
  lib/
    utils.ts
    constants.ts               # interests, seasons, travel styles
  store/
    tripStore.ts               # Zustand: current trip, edit state, undo and redo
  types/
    trip.ts                    # shared TypeScript types
```

---

## 5. Data Model (mock data now, real data later)

Define these types in `src/types/trip.ts`. The future AI output and database must match them.

```ts
export type TravelStyle = "budget" | "comfort" | "adventure";

export interface Activity {
  id: string;
  name: string;
  description: string;
  timeSlot: "morning" | "afternoon" | "evening" | string;
  durationMinutes: number;
  estimatedCost: number;
  category: string;
  imageUrl: string;
  lat: number;
  lng: number;
  note?: string;          // sticky note text
  noteColor?: string;
}

export interface Stay {
  id: string;
  name: string;
  pricePerNight: number;
  distanceFromStopsKm: number;
  imageUrl: string;
}

export interface Day {
  id: string;
  dayNumber: number;
  title: string;
  date?: string;
  notes?: string;         // day-level sticky note
  activities: Activity[];
  stay: Stay;
  localTransport: string[];
}

export interface TransportOption {
  mode: "train" | "bus" | "flight";
  durationHours: number;
  estimatedCost: number;
  tag?: "best value" | "fastest";
  tip?: string;
}

export interface BudgetBreakdown {
  transport: number;
  stay: number;
  food: number;
  activities: number;
  misc: number;
}

export interface Trip {
  id: string;
  destination: string;
  country: string;
  coverImageUrl: string;
  days: Day[];
  travelers: number;
  style: TravelStyle;
  startCity?: string;
  totalBudget: number;
  gettingThere: TransportOption[];
  budget: BudgetBreakdown;
  interests: string[];
  seasons: string[];
  shareId?: string;
  isShared?: boolean;
}
```

---

## 6. Build Rules for the Agent

1. **Do not change the design.** Keep the existing Stitch layouts, styling and assets exactly as they are. Only add the structure, logic and interactivity around them.
2. **Break the existing screens into reusable components** (navbar, cards, sticky note, modals, drawers) instead of one large file per page.
3. **Page build order:** Home, Trip plan, Loading, Explore results, My Trips, Edit mode, Shared trip, Landing, Login and sign up, Error pages.
4. **Everything renders from mock data** in `src/data`. Components take typed props, not hard-coded content.
5. **Keep components small.** One component per file, typed props, no duplicated markup.
6. **Preserve responsive behavior** from the Stitch designs on desktop and mobile.
7. **Images:** use `next/image`.
8. **No backend work yet.** No API routes, no database, no authentication provider, no AI calls. Leave clear `TODO` comments where those will connect.
9. **Code quality:** strict TypeScript, no `any`, consistent formatting (Prettier and ESLint), clear naming.
10. **Public pages (`/shared/[shareId]`)** must work without login and include `noindex` metadata.
11. **Estimated costs are approximate.** Show a small "estimates only" note near budget figures on the trip plan page.

---

## 7. Later Phases (do NOT build yet)

- **Auth:** Supabase Auth or Firebase Auth (Google sign-in and email)
- **Database and storage:** Supabase for saved trips and shared links
- **AI generation:** an LLM API with structured JSON output validated by Zod against the types above, generated in stages (transport, itinerary, hotels, budget)
- **Caching and rate limiting** to stay within free-tier quotas
- **Deployment** on Vercel with environment variables for keys

---

## 8. Definition of Done for the Frontend Phase

- All pages in section 3 are built and navigable with mock data
- Every page matches its Stitch design and works on desktop and mobile
- Edit mode works locally: reorder, add and remove activities, edit notes, live budget updates
- Loading, empty and error states exist for the pages that need them
- The project builds with no TypeScript or lint errors
