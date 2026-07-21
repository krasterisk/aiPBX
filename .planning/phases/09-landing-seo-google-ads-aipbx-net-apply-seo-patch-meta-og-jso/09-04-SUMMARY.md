---
phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
plan: 04
subsystem: seo
tags: [i18n, usePageMeta, JSON-LD, seo-render-ready, demo-cta, index.html, METRICS]

requires:
  - phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
    provides: "usePageMeta SITE_URL/JSON-LD + useSeoRenderReady (09-02)"
provides:
  - "i18n-driven meta + SoftwareApplication JSON-LD on Main/Voice/Speech landings"
  - "seo-render-ready dispatch after i18n ready on all 3 landings"
  - "Speech Analytics METRICS names via i18n (EN+RU); demo CTA on all 3 pages"
  - "index.html base meta/OG/canonical/Organization JSON-LD + accessible viewport"
affects:
  - 09-07 prerender snapshots of landing meta/JSON-LD
  - Phase 4 RU GTM (meta/METRICS already i18n-ready)

tech-stack:
  added: []
  patterns:
    - "Landing meta via t('...meta.*') — never hardcoded EN overwriting RU"
    - "Per-page SoftwareApplication JSON-LD through usePageMeta (single source)"
    - "HtmlWebpackPlugin siteUrl template for index.html canonical/OG"

key-files:
  created: []
  modified:
    - src/pages/MainPage/ui/MainPage.tsx
    - src/pages/VoiceAssistantsLandingPage/ui/VoiceAssistantsLandingPage.tsx
    - src/pages/SpeechAnalyticsLandingPage/ui/SpeechAnalyticsLandingPage.tsx
    - public/index.html
    - public/locales/en/main.json
    - public/locales/ru/main.json
    - config/build/buildPlugins.ts

key-decisions:
  - "SEO patch applied as baseline not verbatim — RU meta preserved in ru/main.json"
  - "index.html Organization JSON-LD site-wide; per-page SoftwareApplication via usePageMeta"
  - "HtmlWebpackPlugin siteUrl from 09-01 chain (default https://aipbx.net) for canonical/OG"
  - "No gtag in index.html — analytics remains initAnalytics (09-03)"

patterns-established:
  - "useTranslation ready + useSeoRenderReady(ready) on every public landing"
  - "METRICS as { key, color } with t('SpeechAnalyticsPage.metrics.' + key)"
  - "landing.demoCta.label secondary CTA next to primary signup CTA"

requirements-completed: [D-01, D-08, D-09]

duration: 11min
completed: 2026-07-21
---

# Phase 09 Plan 04: Landing i18n Meta + CRO Quick Wins Summary

**Routed all landing meta/JSON-LD/METRICS through EN+RU i18n, wired seo-render-ready, added demo CTAs, and shipped accessible index.html base meta via HtmlWebpackPlugin siteUrl.**

## Performance

- **Duration:** ~11 min
- **Started:** 2026-07-21T09:02:58Z
- **Completed:** 2026-07-21T09:13:44Z
- **Tasks:** 3/3
- **Files modified:** 7

## Accomplishments

- Replaced hardcoded RU/EN meta ternaries with `t('MainPage|VoiceAssistantsPage|SpeechAnalyticsPage.meta.*')` and per-page `SoftwareApplication` JSON-LD
- Dispatched `seo-render-ready` via `useSeoRenderReady(ready)` on all three landings for prerender (09-07)
- Moved Speech Analytics metric names to i18n keys; added `landing.demoCta` on Main, Voice, and Speech pages
- Fixed viewport a11y; added description/robots/canonical/OG/Organization JSON-LD without hardcoded gtag

## Task Commits

Each task was committed atomically:

1. **Task 1: i18n-driven meta + per-page JSON-LD + render-ready** - `4134636e` (feat)
2. **Task 2: METRICS to i18n, demo CTA, and en/ru locale keys** - `0aae6ac7` (feat)
3. **Task 3: index.html base meta, viewport a11y, Organization JSON-LD** - `f712358b` (feat)

**Plan metadata:** `af7becd7` (docs: complete plan)

## Files Created/Modified

- `src/pages/MainPage/ui/MainPage.tsx` — i18n meta/JSON-LD, render-ready, demo CTA
- `src/pages/VoiceAssistantsLandingPage/ui/VoiceAssistantsLandingPage.tsx` — i18n meta/JSON-LD, render-ready, demo CTA
- `src/pages/SpeechAnalyticsLandingPage/ui/SpeechAnalyticsLandingPage.tsx` — i18n meta/JSON-LD/METRICS, render-ready, demo CTA
- `public/locales/en/main.json` — EN meta, metrics, demoCta keys
- `public/locales/ru/main.json` — RU meta (original strings preserved), metrics, demoCta keys
- `public/index.html` — accessible viewport + base meta/OG/canonical/Organization JSON-LD
- `config/build/buildPlugins.ts` — HtmlWebpackPlugin `siteUrl` option from 09-01 chain

## Decisions Made

- Applied SEO patch as baseline only: EN copy from patch for EN locale; RU strings taken from prior hardcoded values — never overwritten with EN
- Canonical/OG URLs in `index.html` use `<%= htmlWebpackPlugin.options.siteUrl %>` (default `https://aipbx.net`), not a bare hardcoded host without the template chain
- Site-level schema is `Organization` in `index.html`; per-page `SoftwareApplication` flows through `usePageMeta` (no duplicate inline `dangerouslySetInnerHTML` blocks)
- Demo CTA links to `getRouteSignup()` with `landing.demoCta.label` on all three pages

## Deviations from Plan

None - plan executed exactly as written.

Note: `npm run test:unit -- SpeechAnalytics` found no matching tests (exit 1 / no tests). Lint (`npm run lint:ts`) passed with 0 errors. Index.html verification gate printed PASS.

## Issues Encountered

- Jest `SpeechAnalytics` pattern matched 0 tests — expected; no render test exists yet for this landing

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Landing pages ready for 09-07 prerender (`seo-render-ready` + i18n meta present)
- 09-05 funnel events can proceed independently
- RU segment remains intact for Phase 4 GTM

## Self-Check: PASSED

- FOUND: all 7 modified files
- FOUND: commits `4134636e`, `0aae6ac7`, `f712358b`
- FOUND: `09-04-SUMMARY.md` written

---
*Phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso*
*Completed: 2026-07-21*
