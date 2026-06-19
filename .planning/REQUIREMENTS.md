# Requirements — Dashboard Insights Upgrade

## REQ-01 — Structured insight contract
Each insight must include `priority`, `type`, `title`, `observation`, `recommendation`, and `evidence` (metric/value/operators/periodLabel). API returns `OperatorInsightsResponse` with `promptVersion`, `sampleSize`, `lowConfidence`.

## REQ-02 — Grounded generation
LLM receives pre-computed dashboard facts (metric ranking, operator outliers, trends, custom metrics, data quality, focus metrics). Prompt forbids advice without numeric evidence from facts.

## REQ-03 — Unified backend pipeline
Single `generateInsights()` path using `chatWithFallback`, JSON schema, `temperature: 0`, shared env thresholds, tenant-safe cache key including `userId`.

## REQ-04 — Cache and tenant isolation
Cache key format: `insights:v1:{tenantUserId}:{projectId}:{start}:{end}:{operator}:{promptVersion}:{factsDigest}`. Fix `getProjectInsights` cache leak (missing `userId`).

## REQ-05 — Backend tests
Unit tests for schema validation, `buildInsightsFacts`, cache key composition, billing invocation, structured LLM parse.

## REQ-06 — Frontend types and API
Update `report.ts`, `reportApi.ts` to structured `OperatorInsightsResponse`; support `userId`, `operatorName`, `refresh` query param.

## REQ-07 — AiInsightsBanner redesign
Priority/type badges, evidence chips, refresh button, filter reset on param change, lowConfidence warning, error states, loading skeletons.

## REQ-08 — Admin userId wiring
Pass `userId` from `DashboardCallRecordsPage` → `OperatorDashboard` → `AiInsightsBanner` (same pattern as `useGetOperatorDashboard`).

## REQ-09 — i18n
Add `reports.json` keys for priority, type, low confidence, refresh, errors in en/ru/de/zh.

## REQ-10 — Env documentation
Document `OPERATOR_INSIGHTS_MIN_CALLS`, `OPERATOR_INSIGHTS_TTL_SEC`, `OPERATOR_INSIGHTS_MAX_COUNT` in backend docs and `.env.example`.

## REQ-11 — Phase 3 deferral
Drill-down to CDR, assessment themes aggregation, Redis cache, offline eval — out of scope for this phase; tracked as follow-up.
