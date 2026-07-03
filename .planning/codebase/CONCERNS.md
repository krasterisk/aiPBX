# Codebase Concerns

**Analysis Date:** 2026-06-24

## Tech Debt

**FSD layer-import violations (frontend):**
- Issue: 17+ files suppress `krasterisk-plugin/layer-imports` with `eslint-disable`, breaking Feature-Sliced Design import rules (e.g. pages importing from other pages, app importing from pages).
- Files: `src/app/providers/StoreProvider/config/store.ts`, `src/features/PlaygroundSession/ui/PlaygroundSession/PlaygroundSession.tsx`, `src/pages/UsersPage/ui/UsersPage/UsersPage.tsx`, `src/shared/lib/tests/componentRender/componentRender.tsx`, and others.
- Impact: Circular dependencies, harder refactors, agents place code in wrong layers.
- Fix approach: Extract shared logic to `entities/` or `shared/`; remove suppressions one module at a time.

**Three coexisting UI generations (frontend):**
- Issue: `shared/ui/redesigned/` is the dominant import target (200+ files), `shared/ui/deprecated/` still referenced in 3 files, `shared/ui/redesign-v3/` used in only ~6 files despite being the intended target per `.planning/PROJECT.md`.
- Files: `src/shared/ui/redesigned/`, `src/shared/ui/deprecated/`, `src/shared/ui/redesign-v3/`, `src/features/uiDesignSwitcher/ui/UiDesignSwitcher/UiDesignSwitcher.tsx`
- Impact: Inconsistent UX, duplicated components, agents write to wrong generation.
- Fix approach: Phase 5 UI consolidation (GAP-28); route all new work through `redesign-v3/`.

**Dual bundler with divergent config (frontend):**
- Issue: Webpack is production (`webpack.config.ts`, `npm run build:prod`); Vite is experimental (`vite.config.ts`, `npm run start:vite`) with hardcoded dev API URL.
- Files: `webpack.config.ts`, `vite.config.ts`, `package.json`
- Impact: Dev/prod parity gaps; agents may configure the wrong bundler.
- Fix approach: Treat Webpack as sole production path; align or remove Vite dev URL hardcoding.

**Hardcoded internal API URLs (frontend):**
- Issue: Private LAN IP `192.168.2.37:7000` embedded in Vite config and Cypress commands instead of env-driven values.
- Files: `vite.config.ts`, `cypress/support/commands/common.ts`, `cypress/support/commands/profile.ts`, `cypress/support/commands/manual.ts`
- Impact: E2E and Vite dev fail off-network; leaks infra topology into repo.
- Fix approach: Move to `.env.local` / Cypress env; add frontend `.env.example` (GAP-04).

**OpenAPI codegen unused (both repos):**
- Issue: `npm run generate:api-types` produces `src/shared/api/generated/schema.d.ts`, but no source file imports from it; entity types remain hand-written and drift from backend DTOs.
- Files: `src/shared/api/generated/schema.d.ts`, `package.json`, entity `model/types/` directories across `src/entities/`
- Impact: Silent FE/BE contract breaks on API changes (R8).
- Fix approach: Adopt generated types in RTK Query endpoints; run codegen in CI.

**Legal document content-hash stub (frontend):**
- Issue: `contentHash` equals version string; build script `scripts/legal-hash.ts` does not exist.
- Files: `src/shared/lib/legal/versions.ts`
- Impact: Server cannot verify document text integrity; only version-date idempotency works.
- Fix approach: Implement `scripts/legal-hash.ts` and wire into build (GAP-26).

**Admin page placeholder (frontend):**
- Issue: `AdminPage` renders only a translated title with no functionality.
- Files: `src/pages/AdminPage/ui/AdminPage.tsx`
- Impact: Admin route exists but delivers no value (GAP-25).
- Fix approach: Dedicated admin phase or remove route until implemented.

**Operator Analytics dashboard custom metrics stub (frontend):**
- Issue: `useWidgetData` returns `{ value: 0 }` for custom metrics; backend aggregation not wired.
- Files: `src/features/OperatorAnalytics/ui/DashboardBuilder/useWidgetData.ts`
- Impact: Dashboard Builder widgets for custom metrics show zero/incorrect data (GAP-12).
- Fix approach: Implement `aggregatedCustomMetrics` on backend; consume in `useWidgetData.ts`.

**Dashboard Builder incomplete (frontend):**
- Issue: Builder UI exists but roadmap items (drill-down, full widget catalog) remain open.
- Files: `src/features/OperatorAnalytics/ui/DashboardBuilder/DashboardBuilder.tsx`, `.idea/dashboard_builder_roadmap.md`
- Impact: Operator Analytics Phase 2 selling point incomplete (GAP-13).
- Fix approach: Follow OA Phase 2 plan in `.planning/ROADMAP.md`.

**Type-safety suppressions (frontend):**
- Issue: `@ts-ignore`, `@ts-expect-error`, and `eslint-disable` used for react-grid-layout types, Redux store extension, payment types, menubar items.
- Files: `src/features/OperatorAnalytics/ui/DashboardBuilder/DashboardBuilder.tsx`, `src/app/providers/StoreProvider/config/store.ts`, `src/entities/Payment/api/paymentApi.ts`, `src/widgets/Menubar/ui/MenubarItems/MenubarItems.tsx`, `src/shared/lib/store/buildSlice.ts`
- Impact: Type errors hidden; runtime surprises on dependency upgrades.
- Fix approach: Add proper type declarations or upgrade `moduleResolution`; fix Payment entity exports.

**Orphan / disabled backend modules:**
- Issue: `AmiModule` commented out in `app.module.ts`; `VpbxUsersModule` exists but is not imported; `WidgetKeysModule` imported twice.
- Files: `aiPBX_backend/src/app.module.ts`, `aiPBX_backend/src/ami/ami.module.ts`, `aiPBX_backend/src/vpbx_users/vpbx_users.module.ts`
- Impact: Dead code confusion; duplicate module registration (GAP-22, GAP-23).
- Fix approach: Remove or re-enable with explicit phase scope.

**Commented-out ValidationPipe on controllers (backend):**
- Issue: Per-route `ValidationPipe` disabled on payments, assistants, ai-tools, ai-cdr, open-ai, currency, vpbx_users controllers while global pipe uses `skipMissingProperties: true`.
- Files: `aiPBX_backend/src/payments/payments.controller.ts`, `aiPBX_backend/src/assistants/assistants.controller.ts`, `aiPBX_backend/src/ai-tools/ai-tools.controller.ts`, `aiPBX_backend/src/ai-cdr/ai-cdr.controller.ts`, `aiPBX_backend/src/open-ai/open-ai.controller.ts`, `aiPBX_backend/src/main.ts`
- Impact: Malformed payloads reach services (R9, GAP-24).
- Fix approach: Re-enable DTO validation per controller; tighten global pipe where safe.

**Manual dual-dialect database migrations (backend):**
- Issue: 67 SQL migration files maintained in parallel under `migrations/mysql/` and `migrations/postgres/` with no automated deploy step.
- Files: `aiPBX_backend/migrations/mysql/`, `aiPBX_backend/migrations/postgres/`
- Impact: Schema drift between environments; missed migration = production outage (R12).
- Fix approach: Document deploy checklist; consider migration runner in CI/deploy.

**In-memory caches and session stores (backend):**
- Issue: Operator insights, OpenAI sessions, non-realtime sessions, and batch progress stored in process-local `Map` objects — not Redis/shared.
- Files: `aiPBX_backend/src/operator-analytics/operator-analytics.service.ts` (`insightsCache`, `batches`), `aiPBX_backend/src/open-ai/open-ai.service.ts` (`sessions`), `aiPBX_backend/src/non-realtime/non-realtime.service.ts` (`sessions`)
- Impact: Lost on restart; no horizontal scaling; OA Phase 2 Redis cache still deferred (GAP-11).
- Fix approach: Extract to Redis with tenant-scoped keys.

**Oversized service files (backend):**
- Issue: Core services exceed maintainability threshold (~800–3100 lines).
- Files: `aiPBX_backend/src/operator-analytics/operator-analytics.service.ts` (~3145 lines), `aiPBX_backend/src/accounting/sbis.service.ts` (~1770 lines), `aiPBX_backend/src/open-ai/open-ai.service.ts` (~839 lines)
- Impact: High change risk; difficult testing; agent context overload.
- Fix approach: Extract sub-services by domain (insights, batch, STT, SBIS XML, sessions).

**Documentation sprawl:**
- Issue: ~90 markdown files across `.idea/`, `.docs/`, `docs/`, `public/docs/` with duplicates and stale specs (R16).
- Files: `.planning/intel/DOCS-INDEX.md`, `.idea/*.md`, `docs/`, `public/docs/`
- Impact: Agents plan from outdated specs.
- Fix approach: Trust `.planning/` and `intel/DOCS-INDEX.md`; verify code before planning.

**No frontend `.env.example`:**
- Issue: README references `cp .env.example .env.local` but file does not exist in frontend repo; backend has `aiPBX_backend/.env.example`.
- Files: `README.md`, `aiPBX_backend/.env.example`
- Impact: Onboarding friction; env vars undocumented for FE (GAP-04).
- Fix approach: Create frontend `.env.example` mirroring webpack `buildPlugins` inject vars.

## Known Bugs

**Frontend unit tests fail to compile (14/21 suites):**
- Symptoms: `TS2307: Cannot find module '*.module.scss'` when Jest loads components that import SCSS modules.
- Files: `config/jest/jest.config.ts`, `src/app/types/global.d.ts`, `src/entities/Report/ui/ReportExpandedPanel/ReportExpandedPanel.tsx` (example failure chain)
- Trigger: `npm run test:unit` in `aiPBX/`
- Workaround: None reliable; 7 suites that avoid SCSS-importing components pass (33 tests).

**Backend unit tests failing (8 suites, 13 tests):**
- Symptoms: Nest DI resolution failures and assertion mismatches across core modules.
- Files: `aiPBX_backend/src/accounting/invoice-billing-host.spec.ts`, `aiPBX_backend/src/users/users.service.spec.ts`, `aiPBX_backend/src/payments/payments.service.spec.ts`, `aiPBX_backend/src/auth/auth.service.spec.ts`, `aiPBX_backend/src/open-ai/open-ai.service.spec.ts`, `aiPBX_backend/src/assistants/assistants.service.spec.ts`, `aiPBX_backend/src/ari/ari.service.spec.ts`, `aiPBX_backend/src/ai-cdr/ai-cdr.service.spec.ts`
- Trigger: `npm test` in `aiPBX_backend/`
- Workaround: None; CI `quality` job on both repos will fail until fixed (GAP-02 expanded).

**Widget audio interrupt not implemented:**
- Symptoms: When user speaks during AI playback in embed widget, browser may continue playing buffered audio.
- Files: `aiPBX_backend/src/widget/widget-webrtc.service.ts` (line ~203 TODO)
- Trigger: Audio interrupt event during active widget WebRTC session.
- Workaround: Hangup and restart session.

**Landing pages use hardcoded strings bypassing i18n:**
- Symptoms: Russian/English content not in translation files; `i18next/no-literal-string` disabled inline.
- Files: `src/pages/SpeechAnalyticsLandingPage/ui/SpeechAnalyticsLandingPage.tsx`, `src/pages/VoiceAssistantsLandingPage/ui/VoiceAssistantsLandingPage.tsx`, `src/pages/PublicPricingPage/ui/PublicPricingPage.tsx`
- Trigger: Language switch on landing routes.
- Workaround: None for non-Russian locales.

## Security Considerations

**JWT secret fallback to literal `'SECRET'`:**
- Risk: Tokens forgeable if `PRIVATE_KEY` unset in any environment.
- Files: `aiPBX_backend/src/auth/auth.module.ts`, `aiPBX_backend/src/legal/legal.module.ts`
- Current mitigation: Production should set `PRIVATE_KEY`; no startup guard enforces it.
- Recommendations: Fail fast on boot if `PRIVATE_KEY` missing in non-dev; rotate keys via deploy checklist (R7).

**MCP credential encryption weak fallback:**
- Risk: `McpCryptoService` derives AES key from `JWT_SECRET` or hardcoded `'default-fallback-key'` when `ENCRYPTION_KEY` absent.
- Files: `aiPBX_backend/src/mcp-client/services/mcp-crypto.service.ts`
- Current mitigation: Warning logged when using JWT-derived key.
- Recommendations: Require `ENCRYPTION_KEY` in production; reject MCP credential storage without it.

**Permissive CORS and validation:**
- Risk: `app.enableCors()` with no origin restriction; global `ValidationPipe({ skipMissingProperties: true })` allows partial/malformed bodies.
- Files: `aiPBX_backend/src/main.ts`
- Current mitigation: Helmet headers (CSP disabled for API); throttler module registered.
- Recommendations: Restrict CORS to known frontends; enable strict DTO validation on write endpoints.

**Internal infrastructure addresses in repo:**
- Risk: `192.168.2.37` exposes LAN topology; `.agent/workflows/deploy.md` documents example `pk_live_`/`sk_live_` patterns.
- Files: `vite.config.ts`, `cypress/support/commands/*.ts`, `.agent/workflows/deploy.md`
- Current mitigation: Deploy secrets live in server `.env.production`, not committed.
- Recommendations: Remove LAN IPs from committed configs; use env placeholders only.

**Tenant isolation in caches:**
- Risk: Cross-tenant data leak if cache keys omit `tenantUserId`.
- Files: `aiPBX_backend/src/operator-analytics/operator-analytics.service.ts` (`buildInsightsCacheKey` — fixed for insights per R4; audit other caches)
- Current mitigation: Insights cache includes `tenantUserId`.
- Recommendations: Audit all `Map`/Redis keys for tenant scoping before OA Phase 2 scale-out.

**Live telephony and billing touch surfaces:**
- Risk: Changes to ARI/RTP, billing token counting, Robokassa/Stripe webhooks, SBIS EDO can cause call drops, incorrect charges, or legal document errors.
- Files: `aiPBX_backend/src/ari/`, `aiPBX_backend/src/billing/`, `aiPBX_backend/src/payments/`, `aiPBX_backend/src/accounting/`
- Current mitigation: Documented in `.planning/intel/RISKS.md` (R1–R3); some billing unit tests exist.
- Recommendations: Dedicated phase + manual test checklist for any change; fix failing test suites first.

## Performance Bottlenecks

**Monolithic Operator Analytics service:**
- Problem: Single ~3145-line service handles upload, STT, LLM analysis, batch jobs, insights, caching, webhooks.
- Files: `aiPBX_backend/src/operator-analytics/operator-analytics.service.ts`
- Cause: Feature accretion without service decomposition.
- Improvement path: Split into upload, analysis, insights, batch sub-services; add Redis cache (GAP-11).

**GPU-hosted Whisper STT dependency:**
- Problem: Non-realtime pipeline and OA transcription call external Whisper HTTP service; failure blocks analysis.
- Files: `aiPBX_backend/src/whisper/whisper.service.ts`, `aiPBX_backend/src/non-realtime/`
- Cause: Self-hosted GPU inference on separate host (R13).
- Improvement path: Health checks, queue/retry, fallback provider configuration.

**In-memory insights cache without TTL eviction sweep:**
- Problem: `insightsCache` Map grows per unique query; no documented max size.
- Files: `aiPBX_backend/src/operator-analytics/operator-analytics.service.ts`
- Cause: Process-local cache with per-entry expiry only checked on read.
- Improvement path: Redis with TTL; LRU cap; tenant-scoped keys.

**Frontend console logging in hot paths:**
- Problem: `console.log`/`console.error` in playground, calls, billing, status pages — no structured logging, potential PII in browser console.
- Files: `src/features/PlaygroundSession/model/usePlaygroundSession.ts`, `src/pages/StatusPage/ui/StatusPage.tsx`, `src/shared/lib/hooks/useOpenAiEvents/useOpenAiEvents.ts`, `src/pages/BillingPage/ui/BillingPage/BillingPage.tsx`
- Cause: Debug logging left in production paths.
- Improvement path: Gate behind `__IS_DEV__` or route through Sentry breadcrumbs.

## Fragile Areas

**ARI live telephony module:**
- Files: `aiPBX_backend/src/ari/ari.service.ts`, `aiPBX_backend/src/ari/ari-connection.ts`, `aiPBX_backend/rtp-udp-server/`
- Why fragile: ARI disconnect drops all calls; RTP port must match Asterisk; realtime vs non-realtime pipeline switch.
- Safe modification: Staging PBX manual test call after every change; read R1 in `.planning/intel/RISKS.md`.
- Test coverage: `ari.service.spec.ts` exists but currently failing.

**Billing and payments:**
- Files: `aiPBX_backend/src/billing/billing.service.ts`, `aiPBX_backend/src/payments/payments.service.ts`, `aiPBX_backend/src/prices/`
- Why fragile: Token counting, FX snapshots, Robokassa signatures, Stripe webhooks — money correctness.
- Safe modification: Run `billing.service.spec.ts`, `payments.service.spec.ts` (fix DI mocks first); sandbox payment tests.
- Test coverage: Specs exist; `payments.service.spec.ts` currently failing.

**SBIS / Russian legal accounting:**
- Files: `aiPBX_backend/src/accounting/sbis.service.ts`, `aiPBX_backend/src/accounting/invoice.service.ts`
- Why fragile: UPD/invoice XML, EDO counterparty lookup, document numbering — legal compliance.
- Safe modification: SBIS sandbox only; never test against production EDO without phase plan.
- Test coverage: Partial (`sbis.service.spec.ts`, XML specs); `invoice-billing-host.spec.ts` failing.

**WebRTC widget sessions:**
- Files: `aiPBX_backend/src/widget/widget-webrtc.service.ts`, `aiPBX_backend/src/widget/widget.service.ts`
- Why fragile: WebRTC signaling, OpenAI realtime bridge, session cleanup on hangup.
- Safe modification: Manual widget embed test; no unit tests in `widget/` directory.
- Test coverage: None detected.

**Redux store with dynamic reducer manager:**
- Files: `src/app/providers/StoreProvider/config/store.ts`, `src/app/providers/StoreProvider/config/reducerManager.ts`
- Why fragile: `@ts-expect-error` on `store.reducerManager`; async route reducers.
- Safe modification: Type the extension properly; test lazy-loaded routes.
- Test coverage: `src/app/providers/router/ui/AppRouter.test.tsx` exists.

**Error boundary chunk reload:**
- Files: `src/app/providers/ErrorBoundary/ui/ErrorBoundary.tsx`
- Why fragile: Auto-reloads once on `ChunkLoadError` via `sessionStorage` — can mask deploy issues or loop on persistent failure.
- Safe modification: Keep Sentry capture; verify reload logic after deploys.
- Test coverage: None.

## Scaling Limits

**Single-process session state:**
- Current capacity: All active calls, playground sessions, widget WebRTC, and OA batches tied to one Node process memory.
- Limit: Process restart clears sessions; cannot horizontally scale API without sticky sessions or external store.
- Scaling path: Externalize sessions to Redis; separate telephony worker if call volume grows.

**Manual migration deploy:**
- Current capacity: 67 migration files, dual MySQL/PostgreSQL dialects.
- Limit: Human error on deploy misses schema step.
- Scaling path: Automated migration runner in deploy pipeline with dialect detection.

**Operator Analytics batch processing:**
- Current capacity: In-memory `batches` Map in `operator-analytics.service.ts`.
- Limit: Large batch uploads on single instance; no distributed job queue visible.
- Scaling path: Bull/BullMQ or similar with Redis backend.

## Dependencies at Risk

**`react-grid-layout` v2 type incompatibility:**
- Risk: `@ts-ignore` required in Dashboard Builder; breaks under stricter TS settings.
- Impact: Dashboard drag-and-drop may fail type-check in CI upgrades.
- Migration plan: Pin version or add local type shim; upgrade when official types stabilize.

**Dual database dialect (MySQL + PostgreSQL):**
- Risk: Every schema change needs two migration files; drift between dialects.
- Impact: Wrong dialect applied in environment breaks queries.
- Migration plan: Standardize on one production dialect or automate sync validation.

**`identity-obj-proxy` vs missing SCSS module declarations:**
- Risk: Jest `moduleNameMapper` maps SCSS but TypeScript still errors without `declare module '*.scss'`.
- Impact: Frontend CI test gate blocked (14/21 suites fail at compile).
- Migration plan: Add `declare module '*.scss'` to `src/app/types/global.d.ts` or jest-specific types.

## Missing Critical Features

**Onboarding conversion flow untested:**
- Problem: `features/Onboarding` wizard exists but no conversion metrics or verified «first call in 15 min» path.
- Blocks: Sales demo confidence, GTM Phase 2 (GAP-10).

**Operator Analytics Phase 2 capabilities:**
- Problem: Drill-down, Redis insights cache, offline eval, aggregated custom metrics deferred.
- Blocks: Enterprise OA sales (GAP-11, GAP-12, GAP-13).

**Interrupt response UI (VAD):**
- Problem: Backend has interrupt fields; frontend spec in `.idea/frontend_interrupt_response_spec.md` not fully implemented.
- Blocks: Natural conversation UX in playground/widget (GAP-21).

**Conversion funnel analytics wiring:**
- Problem: `initAnalytics()` supports Yandex Metrika and GA4 via build-time vars, but no documented goal/event mapping for signup → first call funnel.
- Blocks: GTM measurement (GAP-16); files: `src/shared/config/analytics/initAnalytics.ts`, `webpack.config.ts` / `config/build/buildPlugins.ts`.

**Backend e2e test suite:**
- Problem: `test/jest-e2e.json` exists; no `*.e2e-spec.ts` files found.
- Blocks: API regression confidence (GAP-30).

## Test Coverage Gaps

**Frontend feature modules (calls, billing, OA, playground):**
- What's not tested: RTK Query flows, forms, dashboard builder, playground WebRTC/audio.
- Files: `src/features/Calls/`, `src/features/OperatorAnalytics/`, `src/features/PlaygroundSession/`, `src/pages/BillingPage/`
- Risk: Regressions ship; CI fails on compile before assertions run.
- Priority: High

**Backend widget and non-realtime telephony:**
- What's not tested: WebRTC signaling, VAD pipeline, RTP bridging.
- Files: `aiPBX_backend/src/widget/`, `aiPBX_backend/src/non-realtime/`, `aiPBX_backend/rtp-udp-server/`
- Risk: Voice regressions only caught in manual calls.
- Priority: High

**Backend organizations and EDO flows:**
- What's not tested: Full EDO invitation lifecycle beyond unit fragments.
- Files: `aiPBX_backend/src/organizations/organization-edo.service.ts`
- Risk: Wrong counterparty EDO invitation (R3).
- Priority: Medium

**Cypress e2e (minimal, not in CI):**
- What's not tested: ~5 specs (routing, profile, manuals); hardcoded backend URL; no CI step in `.github/workflows/deploy.yml`.
- Files: `cypress/e2e/`, `package.json` (`test:e2e`)
- Risk: Critical user journeys untested in pipeline.
- Priority: Medium

**Sentry and analytics initialization:**
- What's not tested: `initSentry()` no-op without DSN; `initAnalytics()` no-op without IDs.
- Files: `src/shared/config/sentry/initSentry.ts`, `src/shared/config/analytics/initAnalytics.ts`
- Risk: Production deploy without env vars silently disables observability.
- Priority: Medium

---

*Concerns audit: 2026-06-24*
