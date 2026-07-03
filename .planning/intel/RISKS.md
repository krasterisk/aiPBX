# RISKS — Security, Ops & Agent Safety

Last updated: 2026-06-24.  
**Agents must read this before touching marked areas.**

## Critical — do not modify without dedicated phase

### R1: Live telephony (AriModule + RTP)

| Risk | Impact | Mitigation |
|------|--------|------------|
| ARI disconnect | All calls drop | AriModule cron reconnect; test on staging PBX |
| RTP port misconfig | No audio | `UDP_SERVER_PORT` must match Asterisk |
| Pipeline mode switch | Wrong AI provider mid-call | Test both realtime and non-realtime separately |

**Files:** `aiPBX_backend/src/ari/`, `rtp-udp-server/`, `open-ai/`, `non-realtime/`  
**Checklist:** manual test call after any change

### R2: Billing & money (BillingModule + PaymentsModule)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Incorrect token counting | Over/under charge | Unit tests on billing.service.spec.ts |
| FX snapshot missing | Wrong RUB display | Verify `TENANT_CURRENCY` + FX on record |
| Robokassa signature mismatch | Payment lost | Test with Robokassa sandbox |
| Stripe webhook miss | Balance not credited | Verify webhook endpoint |

**Files:** `aiPBX_backend/src/billing/`, `payments/`, `prices/`  
**5 failing OA tests** may mask billing regressions — fix GAP-02 first

### R3: SBIS / legal documents (AccountingModule)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Wrong UPD closing | Legal violation RU B2B | Test in SBIS sandbox |
| EDO invitation to wrong counterparty | Data leak | Verify `sbisCounterpartyId` lookup |
| Invoice numbering collision | Duplicate docs | Check `INVOICE_*` env vars |

**Reference:** `aiPBX_backend/docs/BILLING_LEGAL_ENTITIES.md`, `SBIS_EDO_FIELDS.md`

### R4: Tenant isolation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cache key without userId | Cross-tenant data leak | Fixed in Phase 1 insights; audit other caches |
| Admin bypass too broad | Sub-user sees wrong data | Test with owner + sub-user accounts |
| API token scope | External data access | `oa_xxx` tokens scoped per project |

**Pattern:** all cache keys must include `tenantUserId`

---

## High — fix in Phase 0b (Engineering Foundation)

### R5: No test CI

Agents can merge breaking changes. **Fix:** GAP-01 — add `test:unit` to deploy.yml or separate test workflow.

### R6: Secrets in package.json

Stripe live/test keys, internal IP in `aiPBX/package.json` scripts. **Fix:** GAP-03 — move to `.env.example` + local `.env`.

### R7: JWT default secret

Backend falls back to `'SECRET'` if `PRIVATE_KEY` unset. **Verify** on all production servers.

### R8: FE/BE type drift

No OpenAPI codegen — agent changes DTO without updating frontend types. **Fix:** GAP-06.

### R9: Lenient validation

Global `ValidationPipe` with `skipMissingProperties: true`; some controllers have ValidationPipe commented out. Malformed input may reach services.

---

## Medium — product/ops risks

### R10: No frontend error monitoring

Production bugs invisible until user reports. `ErrorBoundary` only `console.log`. **Fix:** GAP-05 Sentry.

### R11: SPA SEO

Landing pages not indexed — lost RU B2B traffic. **Fix:** GAP-15, GAP-40.

### R12: Manual DB migrations

67 SQL files, not automated in deploy. Migration miss = schema drift. Document in deploy checklist.

### R13: GPU service dependency

Whisper STT and TTS on separate GPU host. If GPU down: non-realtime pipeline and OA analysis fail.

### R14: Dual bundler confusion

Webpack (prod) + Vite (dev). Agent may configure wrong bundler. **Rule:** Webpack only for production builds.

### R15: UI generation sprawl

Agent writes to `deprecated/` or `redesigned/` instead of `redesign-v3/`. **Rule:** enforced in PROJECT.md.

---

## Agent operation risks

### R16: Context rot

`.idea/` specs may be stale vs code. **Always verify** implementation before planning from archive docs.

### R17: Phase scope creep

Agent refactors unrelated modules. **Rule:** one GAP per phase, scope lock in PLAN.md.

### R18: Deploy without tag

Production deploy requires commit tag `[deploy all]` or `[deploy:N]`. Never push directly to prod servers.

### R19: Swagger disabled in production

Cannot introspect live API. Use `intel/API-MAP.md` and local dev Swagger at `/api/docs`.

---

## Risk matrix for next phases

| Phase | Risks to watch |
|-------|----------------|
| Phase 0b Engineering | R5, R6, R7, R8 |
| Phase 2 Onboarding | R10 (track conversion errors) |
| Phase 3 OA Phase 2 | R1 (no), R4 (cache), R2 (regen cost) |
| Phase 4 GTM | R11 only |
| Any billing change | R2, R3 |
| Any voice change | R1, R13 |
