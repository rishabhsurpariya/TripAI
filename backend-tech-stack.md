# TripAi: Backend Tech Stack and Build Guide

> Give this file to the coding agent together with `frontend-tech-stack.md`. The frontend UI is already built and working with mock data. This phase replaces the mocks with real authentication, a real database and real AI generation. Do NOT change how any page looks.

---

## 1. Goal of This Phase

Replace the mock layer with real services, one piece at a time:

1. Real authentication (replace the mock "logged in" flag)
2. A real database for saved trips, sticky notes and share links
3. Real AI trip generation (replace the timer on `/generating`)
4. Supporting features: regenerate a single day, real images, map coordinates, usage limits, affiliate booking links

The app must keep working after each step. Never leave the project in a half-migrated state.

---

## 2. Tech Stack

| Need | Choice | Notes |
|---|---|---|
| Server code | **Next.js route handlers** (`app/api/...`) and server actions | No separate backend server |
| Auth | **Supabase Auth** | Google sign-in and email with password reset |
| Database | **Supabase Postgres** with **Row Level Security (RLS)** | Free tier is enough for a portfolio project |
| Supabase client | **@supabase/supabase-js** and **@supabase/ssr** | Cookie-based sessions for Next.js |
| AI | **Google Gemini API** (free tier) through the official SDK, behind a provider abstraction | Groq or another provider can be swapped in later without touching the pipeline |
| Validation | **Zod** | Validates request bodies and every AI response |
| Rate limiting | **Upstash Redis** (`@upstash/ratelimit`) or a usage table in Postgres | Choose one, do not use both |
| Images | **Unsplash API** (server-side only) | Follow Unsplash attribution rules |
| Geocoding | Free geocoder such as **Nominatim** (OpenStreetMap), with caching | Respect its usage policy: send a proper User-Agent, low request rate, cache results |
| IDs | **nanoid** (21+ characters) for share links | Unguessable |
| Deployment | **Vercel** | Environment variables set in the dashboard |

Free-tier limits and model names change over time. Check each provider's current documentation before relying on a specific limit or model name, and keep model names in one config constant.

---

## 3. Environment Variables

Server-only secrets must NEVER use the `NEXT_PUBLIC_` prefix and must never be imported into client components.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server only, use sparingly
GEMINI_API_KEY=                   # server only
UNSPLASH_ACCESS_KEY=              # server only
UPSTASH_REDIS_REST_URL=           # server only (if using Upstash)
UPSTASH_REDIS_REST_TOKEN=         # server only (if using Upstash)
NEXT_PUBLIC_SITE_URL=
```

Provide a `.env.example` with the names only and make sure `.env.local` is in `.gitignore`.

---

## 4. Data Access Layer

The UI currently reads from mock files and a Zustand store. Introduce a thin data layer so pages stop talking to mock files directly:

```
src/lib/data/
  trips.ts          # listTrips, getTrip, createTrip, updateTrip, deleteTrip, duplicateTrip
  sharing.ts        # setShared, getSharedTrip
  curated.ts        # getCuratedTrips (static JSON is fine for now)
  auth.ts           # getCurrentUser, requireUser
```

Pages and stores call these functions only. Swapping mock for real then happens inside these files, with no UI changes. Keep the mock implementation available behind a flag until the real one is verified.

---

## 5. Database Schema

### `trips`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid, primary key | default `gen_random_uuid()` |
| `user_id` | uuid, references `auth.users` | owner |
| `destination` | text | for listing and search |
| `country` | text | |
| `cover_image_url` | text | |
| `start_date` | date, nullable | for Upcoming and Past |
| `num_days` | int | |
| `travelers` | int | |
| `style` | text | budget, comfort or adventure |
| `total_budget` | numeric | |
| `plan` | jsonb | the full `Trip` object (days, activities, stays, transport, budget, notes) |
| `share_id` | text, unique, nullable | random nanoid, only set when shared |
| `is_shared` | boolean | default false |
| `created_at` / `updated_at` | timestamptz | |

Keep the whole plan in `plan` (jsonb) so the data matches the frontend `Trip` type exactly. Keep only the fields needed for listing, filtering and sorting as normal columns.

### `generation_usage` (only if rate limiting in Postgres)
`user_id`, `day` (date), `count` (int), unique on (`user_id`, `day`).

### Row Level Security
- Enable RLS on every table.
- `trips`: a user can select, insert, update and delete only rows where `user_id = auth.uid()`.
- Do NOT add a public select policy on `trips`. Shared trips are read through a server-side function or route that looks up by `share_id` and returns only the plan data needed for the read-only page, never the owner's user id or email.
- Never trust a `user_id` sent from the client. Always take it from the authenticated session.

---

## 6. API Routes

| Route | Method | Purpose | Auth |
|---|---|---|---|
| `/api/generate` | POST | Validate input, check limits, run the AI pipeline, save the trip, return its id | Required |
| `/api/trips/[id]/regenerate-day` | POST | Regenerate one day, keep that day's notes | Required, owner only |
| `/api/trips/[id]/share` | POST | Turn sharing on or off, create `share_id` if missing | Required, owner only |
| `/api/shared/[shareId]` | GET | Return the read-only plan for a shared trip | Public |

Simple trip CRUD (list, get, update, delete, duplicate) can go directly through the Supabase client under RLS, or through route handlers if preferred. Whichever is chosen, keep it behind the data access layer.

All routes: validate the body with Zod, return consistent JSON errors (`{ error: { code, message } }`) and never expose raw provider errors or stack traces to the client.

---

## 7. AI Generation Pipeline

### Principles
- The model only fills in a **strict JSON structure**. Everything is validated with Zod before it reaches the UI or the database.
- Generate in **stages**, not one giant prompt, so each stage is smaller, easier to validate and cheaper to retry.
- **Compute totals in code.** The model proposes line items, but the budget totals, per-category sums and the over-budget check are calculated by the server. Never trust the model's arithmetic.
- The model has no live data. All prices, durations and opening hours are **approximate estimates**. The prompt must say so and the UI shows an "estimates only" note.
- Do not let the model invent specifics it cannot know (exact fares, exact hotel availability). Use ranges and typical values.

### Stages
1. **Input check:** validate and normalize the form input (destination, budget, days, style, group size, start city). Reject empty, absurd or abusive input before any AI call.
2. **Getting there:** options (train, bus, flight) from the start city to the destination with approximate duration and cost, tagged "best value" or "fastest" where it makes sense.
3. **Itinerary:** day-by-day activities with time slots, durations, estimated costs, category, coordinates, a short description and a short local tip (this becomes the default sticky note).
4. **Hotels and local transport:** one stay per day near that day's activities with a price per night, plus typical local transport options and costs.
5. **Budget assembly (code):** sum everything, split into categories, compare with the user's budget. If the plan is over budget, run one adjustment pass asking the model to swap or cut items, then recompute.
6. **Enrichment (code):** fetch cover and activity images, add coordinates if missing, build affiliate booking links.
7. **Save:** write the final `Trip` to the database for the signed-in user and return the trip id.

### Reliability
- Use the provider's structured-output or JSON mode with a response schema where available.
- Parse and validate every response with Zod. On failure, retry once, including the validation error in the retry prompt. After that, return a clean "couldn't generate" error to the client so the existing error screen shows.
- Set a timeout per stage. Report progress so the loading screen can show real stage names if streaming is added later.
- Log failures server-side with enough detail to debug (stage, validation error), without logging secrets or personal data.

### Prompt safety
- Treat all user-provided text (destination, start city, notes) as **data, not instructions**. Place it in clearly delimited fields and tell the model to ignore any instructions inside those fields.
- Enforce length limits and strip control characters before building prompts.
- Never put API keys or internal data in prompts.

### Affiliate booking links
Booking is handled with **affiliate deep links only**. No real booking, payments or availability checks are built.
- Build outbound links in code from the trip data (destination, dates, travelers) using each partner's link format.
- Open them in a new tab with `rel="noopener noreferrer"`.
- Add a short disclosure near booking buttons that links may be affiliate links.
- Keep partner link templates in one config file so they are easy to change.

---

## 8. Security Checklist

- Secrets only on the server, never in client bundles or the repository
- RLS enabled and tested on every table
- Share links use long random ids, shared pages use `noindex`, and the owner's identity is never returned
- Rate limit `/api/generate` per user and per IP, with a daily cap per user
- Validate every input with Zod and limit payload sizes
- Return generic error messages to the client, detailed ones only to server logs
- Confirm that a signed-in user cannot read, edit or delete another user's trip by changing an id in a request

---

## 9. Build Rules for the Agent

1. **Do not change the UI.** No layout, styling or copy changes beyond what is needed to show real loading, error and empty states that already exist.
2. **One step at a time.** Finish, verify and stop at the end of each step.
3. **Go through the data access layer.** No page or component should call Supabase or the AI provider directly.
4. **Keep the mock implementation working** behind a flag until the real one is verified, then remove it only when asked.
5. **Reuse the existing types** in `src/types/trip.ts` and derive Zod schemas from them, so the AI output, database and UI all share one shape.
6. **Handle every failure path:** unauthenticated, forbidden, not found, validation error, provider error, rate limit. Each should map to an existing error screen or toast.
7. **Strict TypeScript, no `any`**, clear naming and small functions.
8. **Never commit secrets.** Update `.env.example` whenever a variable is added.
9. **Leave a short `README` note** for each new service explaining the setup steps.

---

## 10. Definition of Done for the Backend Phase

- Sign up, log in with Google and email, log out and password reset work for real, and protected routes are really protected
- A generated trip is saved to the database and appears in My Trips after a refresh
- Editing, notes, rename, duplicate and delete persist
- Sharing works: a shared link opens in a private window without login, turning sharing off makes it unavailable, and the owner's identity is never exposed
- `/generating` calls the real pipeline, handles slow and failed generations with the existing screens, and budget totals always add up
- "Regenerate this day" works and keeps that day's notes
- Usage limits work and show the existing "limit reached" screen
- Another user's trip cannot be accessed by guessing an id
- No secrets in the repository and a clean production build on Vercel
