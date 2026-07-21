---
phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
plan: 02
subsystem: seo
tags: [usePageMeta, hreflang, JSON-LD, canonical, SITE_URL, seo-render-ready, jsdom]

requires:
  - phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
    provides: "__SITE_URL__ build constant + Jest globals (09-01)"
provides:
  - "i18n-driven setPageMeta with absolute canonical/og/hreflang/JSON-LD from SITE_URL"
  - "useSeoRenderReady hook dispatching seo-render-ready"
  - "jsdom unit coverage for D-01/D-02"
affects:
  - 09-04 landing page meta wiring
  - 09-07 prerender renderAfterDocumentEvent

tech-stack:
  added: []
  patterns:
    - "Imperative head upsert (upsertMeta/Canonical/Hreflang/JsonLd) keyed by selector/id"
    - "Build-time SITE_URL for canonical/og:url/hreflang — never window.location.origin"

key-files:
  created:
    - src/shared/lib/seo/useSeoRenderReady.ts
    - src/shared/lib/seo/usePageMeta.test.ts
  modified:
    - src/shared/lib/seo/usePageMeta.ts

key-decisions:
  - "Canonical/og:url/hreflang built from __SITE_URL__ (default https://aipbx.net); RU alternates on https://aipbx.ru"
  - "JSON-LD upserted via textContent + id=page-jsonld for idempotent updates"
  - "seo-render-ready event name locked for prerender plugin (09-07)"

patterns-established:
  - "Extend usePageMeta in place (no react-helmet); sibling upsert helpers match existing idiom"
  - "useSeoRenderReady(ready) as shared i18n→prerender gate"

requirements-completed: [D-01, D-02]

duration: 12min
completed: 2026-07-21
---

# Phase 09 Plan 02: usePageMeta SEO Head Summary

**Extended `usePageMeta` to emit absolute canonical, OG, hreflang (en/ru/x-default), and JSON-LD from build-time `__SITE_URL__`, plus `useSeoRenderReady` for the prerender gate.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-07-21T08:36:13Z
- **Completed:** 2026-07-21T08:48:00Z
- **Tasks:** 2/2
- **Files modified:** 3

## Accomplishments

- Replaced `window.location.origin` with `__SITE_URL__` / `SITE_URL` so prerender/localhost cannot pollute canonical and OG URLs
- Added `upsertHreflang` / `upsertJsonLd` helpers and absolute `og:image` resolution
- Added `useSeoRenderReady` dispatching `seo-render-ready` for `@prerenderer` (09-07)
- Green jsdom tests prove D-01/D-02 (canonical host, hreflang triad, JSON-LD idempotency)

## Task Commits

Each task was committed atomically:

1. **Task 1 (RED): add failing setPageMeta SEO head test** - `76e903b8` (test)
2. **Task 1 (GREEN): extend usePageMeta with SITE_URL canonical and JSON-LD** - `9c9a19e8` (feat)
3. **Task 2: add useSeoRenderReady for prerender gate** - `4c2cb652` (feat)

**Plan metadata:** `b00f73a6` (docs: complete plan)

## Files Created/Modified

- `src/shared/lib/seo/usePageMeta.ts` — SITE_URL/RU_SITE_URL, hreflang, JSON-LD, absolute OG
- `src/shared/lib/seo/usePageMeta.test.ts` — jsdom head assertions for D-01/D-02
- `src/shared/lib/seo/useSeoRenderReady.ts` — dispatches `seo-render-ready` when ready

## Decisions Made

- Keep imperative upsert idiom; do not introduce react-helmet
- Host for EN/x-default = `https://aipbx.net`; RU alternate = `https://aipbx.ru`
- JSON-LD is developer/i18n-authored — inject via `JSON.stringify` + `.textContent` (T-09-03 accept)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. TDD RED failed at TypeScript compile on missing `jsonLd` (expected); GREEN passed `npm run test:unit -- usePageMeta` and `npm run lint:ts`.

## User Setup Required

None.

## Next Phase Readiness

09-04 can call `usePageMeta` + `useSeoRenderReady(ready)` from landing pages. 09-07 can wait on document event `seo-render-ready`.

## TDD Gate Compliance

- RED: `76e903b8` — failing test committed before implementation
- GREEN: `9c9a19e8` — implementation after RED
- REFACTOR: not needed

## Self-Check: PASSED

- FOUND: `src/shared/lib/seo/usePageMeta.ts`
- FOUND: `src/shared/lib/seo/usePageMeta.test.ts`
- FOUND: `src/shared/lib/seo/useSeoRenderReady.ts`
- FOUND: `09-02-SUMMARY.md`
- FOUND: `76e903b8`, `9c9a19e8`, `4c2cb652`
