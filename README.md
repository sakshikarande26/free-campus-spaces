# Spaces — Campus Free Space Map

CS 520 | Spring 2026 | Team 06 | University of Massachusetts Amherst

We didn't become the #1 dining campus in the nation by accident. Spaces brings that same energy to study infrastructure by making UMass not just where students eat best, but where they study best too.

---

## Overview

Students at UMass Amherst routinely waste time wandering between buildings searching for a place to study, especially during peak periods like midterms and finals. Despite the campus having numerous libraries, common areas, and open classrooms, there is no centralized way to know which spaces are available without physically being there.

**Spaces** is a full-stack web application that surfaces near-real-time study space availability across campus. Students can search and filter spaces by building, amenity, noise level, and occupancy status — before leaving their current location. The system combines scheduled data (building hours, class schedules) with voluntary crowd-sourced check-ins to build an approximate picture of availability.

Spaces is **purely informational** — it does not reserve or restrict access to any free space, preserving the first-come-first-served culture of campus study areas.

---

## Team Members

| Name | GitHub |
|------|--------|
| Rupa Raj | [@ruparaj04](https://github.com/ruparaj04) |
| Sakshi Karande | [@sakshikarande26](https://github.com/sakshikarande26) |
| Prasi Shahi | [@prasishahi](https://github.com/prasishahi) |
| Ahaana Chabba | [@achabba](https://github.com/achabba) |

**GitHub Repo:** [Campus-FreeSpace-Map](https://github.com/sakshikarande26/Campus-FreeSpace-Map.git)

---

## Key Features

### For Students
- 🗺️ Interactive campus map with heatmap-style occupancy indicators
- 🔍 Search and filter by building, floor, noise level, and amenities
- ✅ QR code or in-app check-in with expected duration
- ⭐ Favorites list with opt-in availability notifications
- 🚨 Report incorrect or outdated space information

### For Administrators
- 🏢 Add, edit, and remove spaces and their metadata
- 📢 Post announcements and manage temporary closures
- 📊 Usage analytics dashboard (peak hours, occupancy trends, underutilized areas)
- 🗂️ Manage reported issues from students

### System
- 🔐 UMass email-based authentication with JWT sessions
- ⏱️ Automatic check-in expiry (stated duration or 4-hour hard cap)
- 🔄 Real-time map updates within 30 seconds via WebSockets/SSE

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | Node.js / Express |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Real-time | WebSockets / Server-Sent Events |
| Maps | Google Maps API (or Leaflet) |
| Deployment | TBD |

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/sakshikarande26/Campus-FreeSpace-Map.git
cd Campus-FreeSpace-Map

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/spaces
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
EMAIL_SERVICE_API_KEY=your_email_key
PORT=5000
```

### Running the App

```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /frontend)
npm start
```

The app will be available at `http://localhost:3000`.

---

## Non-Functional Requirements

- **Performance:** Pages load within 2 seconds; map updates within 30 seconds of a check-in event
- **Scalability:** Supports 1,000+ concurrent users during peak periods
- **Security:** HTTPS, bcrypt password hashing, rate-limited login, short-lived JWTs
- **Accessibility:** WCAG 2.1 AA compliant (keyboard nav, screen readers, color contrast)
- **Responsiveness:** Fully functional on screens as small as 375px wide
- **Data Integrity:** Stale check-ins auto-expire; closed buildings never show as available

---

## Privacy

Spaces never exposes individual check-in data to other students — only **aggregate occupancy numbers** are shown publicly. Students may delete their account and all associated data at any time.
