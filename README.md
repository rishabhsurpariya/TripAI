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
