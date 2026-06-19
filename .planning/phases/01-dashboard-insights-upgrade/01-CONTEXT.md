# Phase 1: Dashboard Insights Upgrade — Context

**Gathered:** 2026-06-19  
**Status:** Ready for planning  
**Source:** PRD Express Path (`.cursor/plans/dashboard_insights_upgrade_94e53d73.plan.md`)

<domain>
## Phase Boundary

Deliver structured, grounded AI insights for Operator Analytics dashboard:

1. **Backend (aiPBX_backend):** JSON contract, deterministic facts builder, unified LLM pipeline, tenant-safe cache, tests, env docs.
2. **Frontend (aiPBX):** Types/API alignment, redesigned `AiInsightsBanner`, admin `userId` wiring, i18n.

**Out of scope:** CDR drill-down, `operator_insights_runs` persistence, Redis cache, offline eval (Phase 2).

</domain>

<decisions>
## Implementation Decisions

### API contract
- Response type `OperatorInsightsResponse` with `insights: OperatorInsight[]`, `generatedAt`, `promptVersion`, `sampleSize`, `lowConfidence`, optional `factsDigest`
- `INSIGHTS_PROMPT_VERSION = '2026-06-18.1'`
- Insight fields: `priority` (high|medium|low), `type` (strength|gap|trend|outlier|quality), `title`, `observation`, `recommendation`, `evidence`
- Breaking change: `string[]` → `OperatorInsight[]`; frontend updated in same milestone

### Grounded generation
- `buildInsightsFacts(dashboard, project?, query?)` extracts: summary, metricRanking, operatorOutliers, trends, customMetrics, dataQuality, focusMetrics
- LLM prompt: Russian text, 3–6 insights, evidence required, no generic advice without numbers
- Assessment themes from `_assessments` rationales — deferred to Phase 1b / follow-up

### Backend pipeline
- Single `private generateInsights(ctx)` — `getInsights` and `getProjectInsights` delegate
- Always `chatWithFallback` + OpenAI `json_schema` (strict) + `temperature: 0`
- Unified threshold: `OPERATOR_INSIGHTS_MIN_CALLS` default **10** (env)
- Cache key: `insights:v1:{tenantUserId}:{projectId}:{start}:{end}:{operator}:{promptVersion}:{factsDigest}`
- `tenantUserId = query.userId || realUserId || 'admin-all'`
- `GET /projects/:id/insights` — deprecated wrapper delegating to `generateInsights`
- Legacy `string[]` parse fallback for one release, then remove

### Frontend
- `AiInsightsBanner`: priority badges, type icons, evidence chips, refresh (`refresh=1`), lowConfidence banner, error states
- Reset RTK state when `queryParams` change (useEffect)
- Pass `userId` and optional `operatorName` through component chain
- `insightsAvailable` threshold synced with backend `OPERATOR_INSIGHTS_MIN_CALLS`

### Billing
- Billing type `insight` unchanged — on-demand on button click

### Claude's Discretion
- Exact SCSS token names for priority colors (follow existing `--accent-redesigned` / warning variants)
- Skeleton count for loading state
- Whether to use RTK `fixedCacheKey` vs manual reset for filter changes

</decisions>

<canonical_refs>
## Canonical References

### Source plan
- `.cursor/plans/dashboard_insights_upgrade_94e53d73.plan.md` — full architecture and phase breakdown

### Frontend (this repo)
- `src/features/OperatorAnalytics/ui/OperatorDashboard/AiInsightsBanner/AiInsightsBanner.tsx` — current banner (string[])
- `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.tsx` — mounts banner, missing userId
- `src/pages/DashboardCallRecordsPage/ui/DashboardCallRecordsPage/DashboardCallRecordsPage.tsx` — has userId for dashboard query
- `src/entities/Report/api/reportApi.ts` — `getOperatorInsights` RTK endpoint
- `src/entities/Report/model/types/report.ts` — dashboard types including `insightsAvailable`
- `public/locales/*/reports.json` — i18n namespace `reports`

### Backend (sibling repo — pattern reference)
- `aiPBX_backend/src/operator-analytics/lib/analysis-schema.ts` — pattern for zod + json_schema + parseAndValidate
- `aiPBX_backend/src/operator-analytics/operator-analytics.service.ts` — `getInsights`, `getProjectInsights`, in-memory cache
- `aiPBX_backend/src/operator-analytics/operator-analytics.controller.ts` — insights endpoints
- `aiPBX_backend/docs/OPERATOR_ANALYTICS_ENV.md` — env documentation target

</canonical_refs>

<specifics>
## Specific Ideas

**Known defects to fix:**
- `getProjectInsights` cache key omits `userId` → cross-tenant cache leak
- Admin UI does not pass `userId` to insights (dashboard query does)
- Two LLM paths: `chatWithFallback` vs direct `openAiClient`
- Inconsistent thresholds: `getInsights` uses `< 5`, `getProjectInsights` uses `totalAnalyzed === 0`
- Dashboard sends rich data (`agentScorecards`, `timeSeries`, `customMetricsAggregated`, etc.) but LLM prompt uses ~6 fields only

**Env defaults:**

| Variable | Default | Purpose |
|----------|---------|---------|
| OPERATOR_INSIGHTS_MIN_CALLS | 10 | Minimum calls for generation |
| OPERATOR_INSIGHTS_TTL_SEC | 3600 | In-memory cache TTL |
| OPERATOR_INSIGHTS_MAX_COUNT | 6 | Max insights in response |

</specifics>

<deferred>
## Deferred Ideas

- Evidence click → CDR list with prefilled filters (Phase 3)
- `operator_insights_runs` table for audit
- Redis cache for multi-instance
- Offline eval golden fixtures in `eval/golden-set/`
- Period-over-period second `getDashboard` call for deltas
- Assessment themes aggregation from `_assessments` rationales (Phase 1b)

</deferred>

---

*Phase: 01-dashboard-insights-upgrade*  
*Context gathered: 2026-06-19 via PRD Express Path*
