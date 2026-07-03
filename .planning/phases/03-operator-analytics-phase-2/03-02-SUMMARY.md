# 03-02 SUMMARY — Insights drill-down to CDR

**Status:** Done  
**GAP:** REQ-11 (drill-down)

## Backend (`aiPBX_backend`)

- `lib/insights-drilldown.ts` — `enrichInsightsWithChannelIds()` attaches up to 5 exemplar `channelId`s per insight
- `insights-schema.ts` — `channelIds` on evidence + zod/sanitize passthrough
- `operator-insights-response.dto.ts` — OpenAPI field
- `operator-analytics.service.ts` — enrich after LLM parse
- `ai-cdr.service.ts` — `channelId` included in search OR
- `insights-drilldown.spec.ts` — 3 unit tests

## Frontend (`aiPBX`)

- `lib/insightDrilldown.ts` — sessionStorage payload + builders
- `AiInsightsBanner.tsx` — clickable evidence chip → `/calls`
- `CallsPage.tsx` — consumes drill-down filters on init
- `schema.d.ts` — `channelIds` on `OperatorInsightEvidenceDto`
- i18n `INSIGHT_DRILLDOWN_HINT` (ru/en/de/zh)

## Verification

- Backend: `npx jest insights-drilldown.spec.ts` — pass
- Manual: generate insights → click evidence → Calls page opens with date range + search by channel/operator
