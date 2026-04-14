# free campus spaces

**Campus-native study space visibility for UMass Amherst** — real-time occupancy for walk-in areas and booking flows for reservable rooms, in one UMass-owned platform.

CS 520 | Spring 2026 | Team 06 | University of Massachusetts Amherst

---

## Problem

Students often lose **15–30 minutes per study session** moving between buildings looking for a seat, with **no centralized view** of what is actually available.

## Solution

A **web app** that shows **near–real-time occupancy** across study spaces — **free common areas** and **bookable rooms** — **before** someone leaves where they are.

## Why it matters

- **30,000+** students compete for limited study space, especially around midterms and finals.
- Existing tools (e.g. Zoom Workspace) focus on **bookable conference-style rooms**; the majority of **walk-in** study spots have **no digital visibility**.
- Newer students are at a disadvantage versus peers who already know informal “hidden” spots.
- **Facilities** lack usage data to support staffing, hours, and infrastructure decisions.

---

## Who it is for

| Stakeholder | What they get |
|-------------|----------------|
| **Students** | Find a seat before leaving; filter by noise, amenities, building. |
| **Grad students / researchers** | Book a quiet reservable room without relying on a corporate Zoom account for campus study space. |
| **Facilities managers** | Usage analytics — peak hours, underused buildings, closures and announcements. |
| **University IT / Admin** | **Self-hosted**, institution-owned deployment path; **no vendor lock-in** for core data and auth. |

---

## Core design: two kinds of spaces

Everything in Spaces follows one rule: **free common spaces** and **reservable rooms** behave **differently**.

### Free common spaces

- Library floors, lounges, atriums — **walk-in only**; **no booking**, **no blocking**.
- Occupancy is a **crowd-sourced estimate** (e.g. *Nearly empty / Moderate / Very busy*).
- Reports are **time-weighted** and **expire**; the UI labels **stale** data clearly.

### Reservable rooms

- Study rooms, conference rooms — **exclusive** time slots.
- **No-show** within **10 minutes** of slot start → slot **auto-released** back to the pool.
- **“Release early”** is optional courtesy; the slot still ends at its scheduled time.

---

## MVP scope

### Student-facing

- **Map:** Interactive campus map with **color-coded** occupancy cues (e.g. white ring = free/low, amber = moderate, solid maroon = reservable).
- **Filters:** Space type, noise (quiet / collaborative), amenities (outlets, whiteboard, printer, etc.).
- **Detail panel:** Capacity, occupancy signal, hours, amenities, noise level.
- **Free spaces:** **3-step** report flow — open → pick level → submit.
- **Reservable:** Open → pick time → confirm.
- **Favorites** with optional **busy → available** notifications.
- **QR check-in** at physical locations; check-ins **expire** after stated duration or a **4-hour** hard cap.

### Admin-facing

- **Space CRUD:** Add / edit / deactivate spaces and metadata.
- **Announcements & closures** (date ranges; notify users who favorited affected spaces).
- **Analytics:** Peak hours, most/least used spaces, occupancy trends.
- **Reported issues** queue.

---

## Tech stack (target)

| Layer | Choice | Role |
|-------|--------|------|
| Frontend | **React + Vite + TypeScript** | UI and map client |
| Styling | **Tailwind CSS** | Fast iteration |
| Map | **Leaflet** (`react-leaflet`) | Open map tiles; **no** map API key for MVP |
| Backend | **Supabase** | Postgres, Auth, Realtime, Storage |
| Database | **Supabase Postgres** | Relational model, FKs, **Row Level Security** |
| Realtime | **Supabase Realtime** | Push occupancy updates on row changes |
| Auth | **Supabase Auth** | Email/password; **`@umass.edu`** enforcement (e.g. trigger) |
| Jobs | **Edge Functions + `pg_cron`** | Check-in / reservation expiry, scheduled housekeeping |
| Notifications | **Edge Functions** | e.g. favorite space becomes available |
| Hosting | **Vercel** (frontend) + **Supabase** (backend) | Simple deploy path for MVP |

---

## Data model (simplified)

| Entity | Notes |
|--------|--------|
| **User** | `id`, email (`@umass.edu`), role (`student` \| `admin`) |
| **StudySpace** | `id`, name, building, floor, type (`free` \| `reservable`), capacity, noise, amenities, hours, `is_active` |
| **CheckIn** | Links user ↔ space; timestamps; `active` \| `expired`; optional **occupancy_report** for free spaces |
| **Reservation** | User ↔ reservable space; `slot_start` / `slot_end`; `active` \| `expired` \| `released` |
| **Favorite** | User ↔ space; `notify_on_available` |
| **Report** | Issue reports from users; `open` \| `resolved` |
| **Announcement** | Space-scoped message with `start_at` / `end_at` |

**Invariant:** at most **one active check-in per user** — enforced in the database (e.g. **partial unique index**).

---

## Future (post-MVP)

- **Five College** expansion — multi-campus scoping.
- **ML occupancy** hints from historical patterns.
- **Registrar** (or scheduling) integration for automatic “in class” signals.
- **Mobile** (e.g. React Native) on the same backend.
- **Wayfinding** from current building to chosen space.
- **Social / opt-in** — e.g. study with friends where privacy allows.

---

## Repository

**GitHub:** [github.com/sakshikarande26/Spaces](https://github.com/sakshikarande26/Spaces)

If GitHub shows a redirect to **`free-campus-spaces`**, update your remote:

```bash
git remote set-url origin https://github.com/sakshikarande26/free-campus-spaces.git
```

---

## Team

| Name | GitHub |
|------|--------|
| Rupa Raj | [@ruparaj04](https://github.com/ruparaj04) |
| Sakshi Karande | [@sakshikarande26](https://github.com/sakshikarande26) |
| Prasi Shahi | [@prasishahi](https://github.com/prasishahi) |
| Ahaana Chabba | [@achabba](https://github.com/achabba) |

---

## Getting started

The repo is on a **clean slate** while the app is re-scaffolded on the **Supabase + Vite** stack above. Setup steps (`pnpm`/`npm` install, Supabase project link, env vars, migrations) will be added once the initial project layout is committed.

---

## Privacy (intent)

Spaces should show **aggregate** occupancy and booking state — **not** a public feed of which individual checked in where. Account deletion and data export paths should align with campus policy as the product hardens.
