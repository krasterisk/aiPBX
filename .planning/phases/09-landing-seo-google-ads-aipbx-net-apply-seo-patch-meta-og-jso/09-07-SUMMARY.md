---
phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
plan: 07
subsystem: infra
tags: [prerender, puppeteer, seo, webpack, docker, aipbx.net]

requires:
  - phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
    provides: useSeoRenderReady / seo-render-ready on landings (09-02/09-04), SITE_URL DefinePlugin (09-01), og-default.png (09-06)
provides:
  - PrerendererWebpackPlugin prod prerender of 4 public routes
  - scripts/verify-prerender.js fail-closed post-build gate
  - Docker builder Chromium + SITE_URL/GA4/Ads build ARGs for [deploy:1] EU
affects: [deploy:1 EU frontend image, Google Ads Quality Score, social OG scrapers]

tech-stack:
  added: ["@prerenderer/webpack-plugin@5.3.10", "@prerenderer/renderer-puppeteer@1.2.4", "puppeteer@^21"]
  patterns: ["renderAfterDocumentEvent seo-render-ready", "postProcess localhost→SITE_URL", "apt chromium + PUPPETEER_EXECUTABLE_PATH in Docker"]

key-files:
  created:
    - scripts/verify-prerender.js
  modified:
    - package.json
    - package-lock.json
    - config/build/buildPlugins.ts
    - Dockerfile
    - .env.example
    - .agent/workflows/deploy.md
    - src/pages/PublicPricingPage/ui/PublicPricingPage.tsx
    - src/shared/lib/seo/useSeoRenderReady.ts

key-decisions:
  - "Use @prerenderer/webpack-plugin + renderer-puppeteer (not react-snap) per D-04"
  - "Docker uses apt chromium + PUPPETEER_SKIP_DOWNLOAD (not puppeteer Chromium in slim)"
  - "SITE_URL/GA4/Ads passed as Dockerfile ARGs → process.env → DefinePlugin"
  - "verify-prerender fail-closed; also wired as postbuild:prod"

patterns-established:
  - "Prod-only PrerendererWebpackPlugin after CopyPlugin with renderAfterDocumentEvent"
  - "CJS verify-prerender.js asserts title/description/JSON-LD/canonical + no PageLoader/localhost/aipbx.ru"

requirements-completed: [D-04]

duration: 45min
completed: 2026-07-21
---

# Phase 09 Plan 07: Webpack prerender + verify gate Summary

**Bot-visible meta/OG/JSON-LD via `@prerenderer/webpack-plugin` on four routes, fail-closed `verify-prerender.js`, and Docker Chromium wiring for EU `[deploy:1]`.**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-07-21T10:18:00Z
- **Completed:** 2026-07-21T11:05:00Z
- **Tasks:** 3/3 (+ founder-approved Docker scope)
- **Files modified:** 9

## Accomplishments

- Installed `@prerenderer/webpack-plugin`, `@prerenderer/renderer-puppeteer`, `puppeteer`; wired prod-only prerender waiting on `seo-render-ready` with localhost→SITE_URL `postProcess`
- Added `scripts/verify-prerender.js` + `verify:prerender` / `postbuild:prod`; `npm run build:prod` green locally (system Chrome)
- Dockerfile installs apt `chromium`, sets `PUPPETEER_EXECUTABLE_PATH`, passes SEO/Ads build ARGs, runs verify during image build

## Task Commits

1. **Task 1: Package legitimacy gate** — approved by founder (no code commit)
2. **Task 2: Install deps + PrerendererWebpackPlugin** — `b06b79b2` (chore)
3. **Task 3: verify-prerender.js + build smoke** — `2051c025` (feat)
4. **Additional: Docker EU prerender** — `49f30b16` (chore)
5. **Rule 2 fix: PublicPricing seo-render-ready** — `345c9e59` (fix)

**Plan metadata:** (pending docs commit)

## Files Created/Modified

- `scripts/verify-prerender.js` — fail-closed grep gate for 4 routes + sitemap/robots + og image
- `config/build/buildPlugins.ts` — `PrerendererWebpackPlugin` in `isProd` after CopyPlugin
- `package.json` / `package-lock.json` — prerender deps + scripts
- `Dockerfile` — chromium, PUPPETEER_*, SITE_URL/GA4/Ads ARGs, verify step
- `.env.example` / `.agent/workflows/deploy.md` — EU deploy ARG docs
- `src/pages/PublicPricingPage/ui/PublicPricingPage.tsx` — `useSeoRenderReady(ready)`
- `src/shared/lib/seo/useSeoRenderReady.ts` — comment clarity

## Decisions Made

- System Chromium in Docker (skip puppeteer download) for reliable slim builds
- Honor `PUPPETEER_EXECUTABLE_PATH` in renderer `launchOptions` for Windows/CI/Docker
- Local Windows used system Chrome after Chromium postinstall hung; EU Docker path is production

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical] PublicPricingPage never dispatched seo-render-ready**
- **Found during:** Task 3 (`build:prod` timed out / first smoke)
- **Issue:** `/pricing` had `usePageMeta` but no `useSeoRenderReady`; also stale webpack cache omitted the event string from chunks
- **Fix:** Wire `useSeoRenderReady(ready)` on PublicPricingPage; clear cache; rebuild
- **Files modified:** `PublicPricingPage.tsx`, `useSeoRenderReady.ts`
- **Verification:** `npm run build:prod` + `verify-prerender: OK`
- **Committed in:** `345c9e59`

**2. [Rule 2 - Missing critical] Docker builder could not prerender**
- **Found during:** Founder-approved additional scope for `[deploy:1]`
- **Issue:** `node:22-slim` + `npm ci --ignore-scripts` left puppeteer without a browser
- **Fix:** apt `chromium` + `PUPPETEER_EXECUTABLE_PATH` / skip download; SEO/Ads ARGs; verify in Dockerfile
- **Files modified:** `Dockerfile`, `.env.example`, `.agent/workflows/deploy.md`
- **Committed in:** `49f30b16`

---

**Total deviations:** 2 auto-fixed (Rule 2)
**Impact on plan:** Required for D-04 correctness and EU deploy; no scope creep beyond founder-approved Docker work

## Issues Encountered

- Puppeteer Chromium download hung on Windows install → installed with skip-download; local smoke used `PUPPETEER_EXECUTABLE_PATH` to system Chrome
- First `build:prod` failed with `seo-render-ready` timeout due to stale webpack cache + missing Pricing hook; fixed and re-verified
- Backend `aiPBX_backend/.env.example` is gitignored — SEO ARG comments updated on disk but not committed there

## User Setup Required

**Deploy / CI (EU `[deploy:1]`):**
- Pass Dockerfile build args: `SITE_URL` (default `https://aipbx.net`), `GA4_MEASUREMENT_ID`, `GOOGLE_ADS_ID`, `ADS_SIGNUP_LABEL`
- Ensure compose/host env provides those values (see `.agent/workflows/deploy.md` frontend `args`)
- Builder needs apt Chromium (already in Dockerfile) or system Chrome + `PUPPETEER_EXECUTABLE_PATH`

**Manual SEO checks (founder — not claimed automated):**
- Google Rich Results Test on a prerendered URL after deploy
- Facebook/LinkedIn/Telegram OG debugger on `og:image`

## Known Stubs

None — prerender emits real meta/JSON-LD/canonical; verify gate enforces markers.

## Threat Flags

None beyond plan threat model (T-09-SC mitigated by legitimacy gate; T-09-15 localhost rewrite + verify; T-09-16 30s timeout).

## Auth Gates

- **Task 1:** Package legitimacy — founder signal `approved` (Chromium download OK). Proceeded with install; Windows download skipped in favor of system Chrome / Docker apt chromium.

## Self-Check: PASSED

- FOUND: `scripts/verify-prerender.js`
- FOUND: `PrerendererWebpackPlugin` + `seo-render-ready` in `config/build/buildPlugins.ts`
- FOUND: commits `b06b79b2`, `2051c025`, `49f30b16`, `345c9e59`
- FOUND: `verify-prerender: OK` after `npm run build:prod`
- FOUND: `build/index.html`, `build/voice-assistants/index.html`, `build/speech-analytics/index.html`, `build/pricing/index.html`
