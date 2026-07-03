# 03-04 SUMMARY — Redis insights cache + OA usage billing

**Status:** Done  
**GAP:** GAP-11 (Redis cache), GAP-17 (usage in reports/OA)

## Backend (`aiPBX_backend`)

- `insights-cache.service.ts` — `InsightsCacheService` with optional `REDIS_URL` (ioredis), in-memory fallback
- `operator-analytics.service.ts` — uses cache service instead of private `Map`
- `billing` — `GET /billing?types=analytic,insight` comma-separated filter
- `insights-cache.service.spec.ts` — 3 unit tests
- Dependency: `ioredis`

## Frontend (`aiPBX`)

- `OperatorUsageSection` on `OperatorDashboard` — summary + last 10 OA billing rows
- `billingApi` — `types` query param
- i18n `OA_USAGE_*` (ru/en/de/zh)

## Ops

- Set `REDIS_URL=redis://...` in production for shared insights cache across instances
- Without Redis, behavior unchanged (in-memory per process)

## Verification

- `npx jest insights-cache.service.spec.ts`
- OA dashboard → usage block shows analytic + insight charges for date range
