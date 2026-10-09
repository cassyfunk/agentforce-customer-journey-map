# Design Decisions

> Record significant choices made during development so future contributors know the WHY.

## 2026-10-09 — Initial build

**Stack: React + Vite + Tailwind + D3**
- React: widest ecosystem, easiest to find help for
- Vite: fast HMR for iterative work
- Tailwind: rapid swim-lane grid layout without fighting CSS
- D3: handles the emotion curve — a real data visualization that needs scales and paths
- Rejected ReactFlow: journey maps are structured grids, not free-form node graphs

**Data in JS files, not a database**
- All content lives in `src/data/journeyData.js`
- Chose flat JS arrays over JSON so comments can be added inline
- When data outgrows this, migrate to a headless CMS or API

**Four swim lanes minimum**
- Actions, Thoughts, Feelings, Touchpoints, Pain Points, Opportunities
- Based on Nielsen Norman Group framework (see best-practices.md)
- Lane filter allows hiding rows to reduce visual noise for different audiences

**Sentiment drives the emotion curve**
- Each stage has a `sentiment` value (-2 to +2)
- Individual feeling-lane touchpoints can also have a `sentiment` override
- Curve is decorative/contextual — not a calculated average (update manually when data changes)
