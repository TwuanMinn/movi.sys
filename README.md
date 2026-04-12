# CINEFORGE

> Internal Film Management System for CINEFORGE Studios

A full-stack internal management system built for movie studio operations. Tracks films through their lifecycle, manages team roles, assets, production timelines, and provides analytics dashboards.

**Not a public app** — only company staff with `@cineforge.com` accounts can access it.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, React Compiler, Turbopack) |
| **UI** | React 19 + Framer Motion |
| **Styling** | Tailwind CSS v4 (CSS-first via `@theme`) |
| **API** | tRPC v11 (end-to-end type-safe) |
| **Auth** | Better Auth + Google OAuth |
| **Database** | PostgreSQL (Supabase) + Drizzle ORM |
| **State** | Zustand (sidebar, filters, toasts) |
| **Charts** | Recharts |
| **Typography** | Cormorant Garamond (display) + Outfit (body) |

## Features

- **Dashboard** — Animated stat cards, active productions with progress rings, real-time activity feed
- **Movies** — Grid view of all productions with genre/status filtering and gradient poster cards
- **Team** — Studio members organized by department with role-based color coding
- **Assets** — File management grid with type icons, status badges, and approval workflow
- **Calendar** — Horizontal timeline of production milestones with diamond markers and hover tooltips
- **Analytics** — Budget allocation bars, genre distribution, financial summary cards
- **Settings** — Admin panel for studio profile, integrations, security, and notifications

## Prerequisites

- **Node.js** ≥ 20.9.0 (use `fnm use 22` if using fnm)
- **PostgreSQL** (Supabase recommended)
- **Google Cloud** OAuth credentials

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd movi.sys
npm install
```

### 2. Environment variables

Copy the example and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `BETTER_AUTH_SECRET` | Random secret (generate with `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | App URL (e.g., `http://localhost:3000`) |

### 3. Database setup

```bash
npx drizzle-kit push
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/        # Protected route group
│   │   ├── dashboard/      # Main dashboard
│   │   ├── movies/         # Productions grid
│   │   ├── team/           # Team management
│   │   ├── assets/         # Asset library
│   │   ├── calendar/       # Production timeline
│   │   ├── analytics/      # Financial analytics
│   │   └── settings/       # Admin settings
│   ├── login/              # Google OAuth login
│   └── api/                # tRPC + Auth handlers
├── components/
│   ├── layout/             # Sidebar, Header
│   ├── effects/            # SpotlightCard, TextReveal, BeamEffect
│   └── ui/                 # Badge, Button, Input, Modal, Toast
├── hooks/                  # useAnimatedCounter, useTextScramble
├── lib/                    # Utils, fonts, tRPC client
├── server/
│   ├── auth.ts             # Better Auth config
│   ├── db/                 # Drizzle schema + connection
│   └── trpc/               # tRPC routers (movies, users, assets, tasks, activities, analytics)
├── stores/                 # Zustand stores (UI, filters, toasts)
├── types/                  # Shared TypeScript types
└── proxy.ts                # Next.js 16 route protection
```

## Authentication & Authorization

- **Auth Provider:** Google OAuth (Better Auth)
- **Domain Lock:** Only `@cineforge.com` emails
- **Route Guard:** `proxy.ts` (Next.js 16 — replaces middleware.ts)
- **API Protection:** tRPC procedure tiers:
  - `publicProcedure` — No auth required
  - `protectedProcedure` — Any logged-in staff
  - `adminProcedure` — Admin/Director/Producer only

## Design System

Cinema Noir Industrial aesthetic with warm charcoal palette:

- **Colors:** OKLCH-based warm darks, amber/red accents (no purple)
- **Typography:** Cormorant Garamond (serif display) + Outfit (sans body)
- **Geometry:** Sharp edges (2-4px radius), no glassmorphism
- **Animations:** Framer Motion with spring physics, respects `prefers-reduced-motion`
- **Depth:** Film grain overlays, warm-tinted multi-layer shadows

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type check |
| `npx drizzle-kit push` | Push schema to database |
| `npx drizzle-kit studio` | Open Drizzle Studio |

## License

Private — Internal use only.
