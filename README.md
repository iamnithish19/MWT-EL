# Smart Fitness Companion

A React (Vite) web app implementing the UML class diagram: `User`,
`FitnessPlan`, `Workout`, `Exercise`, `HealthTracker`, `Device`,
`NutritionPlan`, and `Progress report`.

## Stack
- React 18 + Vite
- Plain CSS (`src/styles/global.css`) — no external UI framework
- A lightweight embedded "database" (`src/services/db.js`) seeded from
  `src/data/db.json` and persisted to the browser's `localStorage`, so
  data survives page reloads without a backend server.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

To produce a static production build:

```bash
npm run build
npm run preview
```

## Project structure

```
smart-fitness-companion/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # routes pages, wires db.js to components
│   ├── data/
│   │   └── db.json              # seed data for every entity
│   ├── services/
│   │   └── db.js                # CRUD + domain methods (updateProfile, generateProgressReport)
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ProgressRing.jsx
│   │   ├── Profile.jsx          # User
│   │   ├── FitnessPlans.jsx     # FitnessPlan → Workout → Exercise
│   │   ├── HealthTracker.jsx
│   │   ├── Devices.jsx
│   │   ├── NutritionPlan.jsx
│   │   └── ProgressReports.jsx
│   └── styles/
│       └── global.css
```

## Entity relationships modeled

- `User` **has** many `FitnessPlan`
- `FitnessPlan` **contains** many `Workout`
- `Workout` **consists_of** many `Exercise`
- `User` **records** many `HealthTracker` entries
- `User` **owns** many `Device`
- `User` **follows** a `NutritionPlan`
- `User` **generates** many `Progress report` entries (via `generate()`)

## Notes on the "database"

`src/services/db.js` exposes `getAll`, `filterBy`, `insert`, `update`,
`remove`, `resetDatabase`, and `exportDatabase`, plus two domain
operations pulled straight from the class diagram: `updateProfile()`
on `User` and `generateProgressReport()` (backing `Progress
report.generate()`). Swap this module out for real HTTP calls to a
backend/ORM later without touching any component code — every
component only talks to this service layer.
