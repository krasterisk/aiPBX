# Phase 1: Dashboard Insights Upgrade — Research

**Researched:** 2026-06-19  
**Status:** Complete

## RESEARCH COMPLETE

## Current Frontend Baseline (verified in aiPBX)

### AiInsightsBanner
- Lazy fetch on button click via `useLazyGetOperatorInsights`
- Props: `projectName`, `queryParams` with `startDate`, `endDate`, `projectId` only — **no `userId` or `operatorName`**
- Renders `insights: string[]` as plain text with emoji icon
- No refresh, no filter reset, no priority/evidence UI

### RTK API (`reportApi.ts`)
```typescript
getOperatorInsights: build.query<
  { insights: string[], generatedAt: string },
  { startDate?, endDate?, operatorName?, projectId? }
>
```
- Missing `userId` in query params type
- Response type is legacy `string[]`

### OperatorDashboard wiring
- `DashboardCallRecordsPage` computes `userId` for `useGetOperatorDashboard` but does **not** pass it to `OperatorDashboard`
- `OperatorDashboard` passes only `startDate`, `endDate`, `projectId` to `AiInsightsBanner`
- Banner shown when `data?.insightsAvailable` is true

### i18n
- Existing keys in `reports.json`: `AI Инсайты`, `Получить инсайты`, `Недостаточно данных для генерации инсайтов`, `Сгенерировано`
- Missing: priority labels, type labels, low confidence, refresh, error messages

## Backend Baseline (from source plan + architecture docs)

Backend lives in sibling repo `aiPBX_backend` (not present in current workspace). Key files per plan:

| File | Role |
|------|------|
| `operator-analytics.service.ts` | `getInsights`, `getProjectInsights`, in-memory `Map` cache |
| `operator-analytics.controller.ts` | `GET /operator-analytics/insights`, `GET /projects/:id/insights` |
| `lib/analysis-schema.ts` | Reference pattern for zod + OpenAI json_schema |

**Defects documented in source plan:**
1. Cache key without `userId` in `getProjectInsights`
2. Duplicate LLM invocation paths
3. Threshold mismatch between endpoints
4. Rich dashboard payload underutilized in prompt
5. No unit tests for insights

## Recommended Implementation Pattern

Follow `analysis-schema.ts` pattern:
1. Types + zod schema + `buildInsightsJsonSchema()` for OpenAI strict mode
2. `parseAndValidateInsightsResponse()` with optional legacy `string[]` wrapper (one release)
3. Pure function `buildInsightsFacts()` — no LLM, fully unit-testable
4. `buildInsightsPrompt(facts, projectContext)` — system + user messages with guardrails
5. `generateInsights(ctx)` — orchestrates dashboard fetch → facts → prompt → LLM → validate → cache → billing

## Cache Key Design

```
insights:v1:{tenantUserId}:{projectId}:{start}:{end}:{operator}:{promptVersion}:{factsDigest}
```

`factsDigest` = short hash of serialized facts object (for debug invalidation).  
`tenantUserId` = `query.userId ?? authenticatedUserId ?? 'admin-all'`

## API Refresh Semantics

Add optional `refresh=1` query param to bypass in-memory cache without changing cache key format. Frontend "Обновить" button passes `refresh: true` mapped to query param.

## Wave / Dependency Recommendation

| Wave | Work | Rationale |
|------|------|-----------|
| 1 | Schema + facts + prompt module | Defines contract; no service changes yet |
| 2 | Service + controller + tests + env | Depends on schema module exports |
| 3 | Frontend types + API + UI + i18n | Depends on stable API response shape |

## Risks

| Risk | Mitigation |
|------|------------|
| Backend repo not in workspace | Plans reference absolute paths; executor must open `aiPBX_backend` |
| Breaking API change | Ship backend + frontend together; legacy parse fallback one release |
| LLM hallucination | Grounded facts + strict JSON schema + prompt guardrails |
| Admin cache leak | Cache key includes `userId`; frontend passes `userId` |

## Validation Architecture

| Dimension | Approach |
|-----------|----------|
| Schema | Jest unit tests on zod parse + legacy fallback |
| Facts builder | Fixture dashboard snapshots → expected fact blocks |
| Service | Mock LLM + mock billing; cache hit/miss per tenant |
| Frontend | TypeScript compile; manual verify banner states |
| E2E | Deferred — manual test on dashboard with ≥10 calls |
