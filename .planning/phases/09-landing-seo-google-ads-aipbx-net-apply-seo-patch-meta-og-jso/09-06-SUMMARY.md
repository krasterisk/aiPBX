---
phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
plan: 06
subsystem: seo
tags: [sitemap, robots.txt, og-image, aipbx.net, open-graph]

requires: []
provides:
  - "aipbx.net sitemap.xml with lastmod for public routes"
  - "robots.txt Sitemap line pointing at aipbx.net"
  - "1200x630 public/assets/og-default.png for OG previews"
affects:
  - 09-07 (prerender verify gate expects .net sitemap/robots + OG asset)
  - social scrapers / GSC

tech-stack:
  added: []
  patterns:
    - "Static single-build sitemap/robots hardcoded to deploy domain (D-03)"
    - "Default OG image at /assets/og-default.png, 1200x630 PNG"

key-files:
  created:
    - public/assets/og-default.png
  modified:
    - public/sitemap.xml
    - public/robots.txt

key-decisions:
  - "lastmod set to 2026-07-21 (execution day) rather than patch's 2026-07-20"
  - "Kept /docs and /signup in sitemap (existing entries); RU variants deferred to Phase 4"
  - "OG card generated via System.Drawing branded template (cyan→violet accents matching aipbx_logo_v4)"

patterns-established:
  - "Pattern: one sitemap/robots per build — domain switch is a static file edit until Phase 4 generator"

requirements-completed: [D-03, D-05]

duration: 8min
completed: 2026-07-21
---

# Phase 09 Plan 06: Static SEO Assets (.net + OG) Summary

**Switched sitemap/robots to https://aipbx.net with lastmod, and shipped a 1200×630 branded og-default.png so social previews stop 404ing.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-07-21T08:18:00Z
- **Completed:** 2026-07-21T08:26:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- `public/sitemap.xml` now lists aipbx.net URLs (/, /pricing, /speech-analytics, /voice-assistants, /docs, /signup) with `<lastmod>2026-07-21</lastmod>`; no aipbx.ru remains
- `public/robots.txt` Sitemap line → `https://aipbx.net/sitemap.xml`; public Allow + app Disallow rules unchanged
- `public/assets/og-default.png` exists as a valid PNG at exactly 1200×630 (~168KB), matching `usePageMeta` `DEFAULT_OG_IMAGE`

## Task Commits

Each task was committed atomically:

1. **Task 1: Switch sitemap.xml and robots.txt to aipbx.net** - `57f4188f` (feat)
2. **Task 2: Generate og-default.png (1200x630)** - `ec5ae827` (feat)

**Plan metadata:** `738698f3` (docs: complete plan)

## Files Created/Modified

- `public/sitemap.xml` — aipbx.net locs + lastmod
- `public/robots.txt` — Sitemap: https://aipbx.net/sitemap.xml
- `public/assets/og-default.png` — branded default Open Graph image (1200×630)

## Decisions Made

- Used execution-day lastmod `2026-07-21` (plan example date) instead of patch baseline `2026-07-20`
- Retained existing `/docs` and `/signup` sitemap entries (already present; plan required the 4 public marketing routes which are included)
- Generated OG asset with Windows System.Drawing (branded dark gradient + wordmark/tagline) rather than Canva/Figma export — exact dimensions guaranteed for the verify gate

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required. Founder still submits the new sitemap URL in Google Search Console when ready (out of this plan's code scope).

## Next Phase Readiness

- Unblocks 09-07 prerender verify gate expectations for `.net` static SEO assets and OG file presence
- Absolute OG URL still depends on `__SITE_URL__` + usePageMeta work in 09-02/09-04; file path `/assets/og-default.png` is now valid

## Self-Check: PASSED

- FOUND: `public/sitemap.xml`, `public/robots.txt`, `public/assets/og-default.png`
- FOUND: commits `57f4188f`, `ec5ae827`
- Verify gates: Task 1 PASS; Task 2 OG 1200x630 OK

---
*Phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso*
*Completed: 2026-07-21*
