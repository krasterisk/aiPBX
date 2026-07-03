# Phase 3 — Operator Analytics Phase 2 — RESEARCH

**Date:** 2026-07-03  
**GAPs:** GAP-11, GAP-12, GAP-13, GAP-17  
**REQ:** REQ-11 (drill-down, Redis cache, offline eval)

## Findings

### GAP-12 — custom metrics in Dashboard Builder
- Backend **already returns** `customMetricsAggregated` on `GET /operator-analytics/dashboard` when `projectId` is set (`operator-analytics.service.ts` → `aggregateCustomMetrics`).
- `OperatorDashboard.tsx` renders custom metrics correctly.
- `useWidgetData.ts` has TODO stub returning `{ value: 0 }` — **frontend-only fix**.

### GAP-13 — Dashboard Builder
- `dashboardConfig` persisted on `OperatorProject`; builder UI complete.
- Main `OperatorDashboard` does **not** render saved widget layout.
- `tag-cloud` widget type is placeholder in `WidgetRenderer.tsx`.

### REQ-11 — Insights drill-down
- `AiInsightsBanner` evidence chips are static (no navigation).
- `useGetOperatorCdrs` defined but unused.
- `OperatorInsightEvidenceDto` lacks `channelIds`; CDR API has no metric filter params.

### GAP-17 — Usage billing in reports
- `UsageTab` on Payment page implements full billing table.
- No aggregate usage view on `/calls` or OA dashboard.

### Redis cache
- Insights cache is in-memory `Map` in `operator-analytics.service.ts`.
- No Redis dependency in backend today.

## Plan waves

| Plan | Wave | Scope |
|------|------|-------|
| 03-01 | 1 | Wire `customMetricsAggregated` in `useWidgetData` + unit tests |
| 03-02 | 2 | Insights drill-down: BE evidence + CDR filters, FE navigation |
| 03-03 | 3 | Render `dashboardConfig` on main dashboard; tag-cloud or remove |
| 03-04 | 4 | Redis insights cache (optional env); usage table in OA/reports |
