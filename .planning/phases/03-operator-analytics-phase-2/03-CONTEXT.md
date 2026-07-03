# Phase 3 — Operator Analytics Phase 2 — CONTEXT

**Status:** Locked for planning (2026-07-03)  
**GAPs:** GAP-11, GAP-12, GAP-13, GAP-17  
**Repos:** `aiPBX` + `aiPBX_backend`

## Goal

Complete Operator Analytics product: custom metrics in Dashboard Builder, insights drill-down to CDR, saved dashboard layout on main view, usage billing visibility in reports context.

## Decisions

- **D-01:** Use existing `customMetricsAggregated` field (no new endpoint for wave 1).
- **D-02:** Drill-down navigates to `/calls` with URL query filters (operator, dates, project, source).
- **D-03:** Extend insight evidence with optional `channelIds[]` for exemplar calls (max 5).
- **D-04:** Main dashboard renders `project.dashboardConfig` when project selected and config non-empty; else fixed layout fallback.
- **D-05:** Redis cache optional via `REDIS_URL`; fallback to in-memory Map when unset.
- **D-06:** Usage summary reuses `GET /billing` patterns from `UsageTab` (no billing module changes).

## Out of scope

- SQL aggregation for custom metrics at scale (defer post-phase)
- Offline eval CI gate (document only)
- Changes to `billing/` pricing logic

## References

- `.planning/ROADMAP.md` Phase 3
- `.planning/GAPS.md` GAP-11–13, GAP-17
- Phase 1 insights: `01-dashboard-insights-upgrade`
