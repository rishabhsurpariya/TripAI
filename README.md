# TripAi — AI Travel Itinerary & Journey Architect

Exported directly from Google Stitch project `projects/1037422058097488063`.

## 📖 Overview
TripAi is a bespoke AI travel planning web application featuring an understated luxury, tactile editorial aesthetic.

- **Theme**: Warm Editorial Journey
- **Typography**: Playfair Display (Headlines & Editorial Titles) + Plus Jakarta Sans (Interface & Body)
- **Palette**: Warm cream background (`#fef9f2`), Deep Umber (`#6e4f32`), Warm Mocha (`#8c6e52`), Sunlit Clay (`#a28973`)
- **Shapes**: Pill buttons (`rounded-full`), smooth 20px–24px card contours

---

## 🗂️ Project Structure

```
tripai/
├── src/                          # Next.js App Router codebase
│   ├── app/                      # Public & Protected routes
│   │   ├── (public)/             # Landing, login, signup, forgot-password, shared trip, dev-components
│   │   └── (app)/                # Protected: home, explore, generating, trips, trip/[id]
│   ├── components/               # Reusable components
│   │   ├── layout/               # Navbar, PublicNavbar
│   │   ├── trips/                # TripCard
│   │   ├── trip/                 # ActivityCard, StickyNote
│   │   ├── ui/                   # Modal, Drawer
│   │   └── common/               # SkeletonCard, EmptyState, toast
│   ├── data/                     # Mock trips and 5-day sample itinerary
│   ├── lib/                      # utils, constants
│   ├── store/                    # Zustand authStore and tripStore
│   └── types/                    # TypeScript trip contracts
├── DESIGN_SYSTEM.md              # Full Design System Specification & Component Tokens
├── stitch-project.json           # Raw Google Stitch project schema & metadata
├── screens.json                  # List of screens, dimensions, and asset mappings
├── screens/                      # Standalone complete HTML screens from Stitch
├── screenshots/                  # High-resolution screen captures
└── assets/images/                # Curated editorial photography assets
```

---

## 🚀 How to Run & Preview

```bash
# Install dependencies
npm install

# Run Next.js App Router
npm run dev
# Open http://localhost:3000 in your browser
# Open http://localhost:3000/dev-components to view all shared components
```

---

## 🔐 Supabase Authentication Setup (Manual Dashboard Steps)

To connect and use real authentication with Supabase Auth:

### 1. Create a Supabase Project
1. Go to [database.new](https://database.new) or your [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project**, pick your organization, name your project (`tripai`), set a secure database password, and select your region.
3. Wait for the project to finish provisioning.

### 2. Copy API Credentials to `.env.local`
1. In your Supabase dashboard, navigate to **Project Settings** (gear icon) > **API**.
2. Copy the **Project URL** and paste it into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   ```
3. Copy the **anon public** API key and paste it into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Verify `NEXT_PUBLIC_SITE_URL` is set:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### 3. Disable Email Confirmation (Instant Sign-up)
1. In the Supabase dashboard, go to **Authentication** > **Providers** > **Email**.
2. Toggle **Confirm email** to **OFF** (this allows newly signed up users to log in immediately without waiting for email verification).
3. Click **Save**.

### 4. Enable Google OAuth Sign-in
1. Go to **Authentication** > **Providers** > **Google**.
2. Toggle **Enable Google provider** to **ON**.
3. In [Google Cloud Console](https://console.cloud.google.com/):
   - Create an OAuth 2.0 Client ID for a Web application.
   - Under **Authorized redirect URIs**, add the callback URI provided in your Supabase dashboard:
     `https://<your-project-id>.supabase.co/auth/v1/callback`
   - Copy the Google **Client ID** and **Client Secret** into the Supabase Google Provider settings.
4. Click **Save** in Supabase.

### 5. Set Redirect URLs
1. In the Supabase dashboard, go to **Authentication** > **URL Configuration**.
2. Set **Site URL** to:
   `http://localhost:3000`
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/**`
   - `https://your-production-domain.vercel.app/auth/callback` (for production)
4. Click **Save**.

