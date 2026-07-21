---
phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
plan: 01
subsystem: infra
tags: [webpack, DefinePlugin, jest, env, SEO, Google Ads, GA4]

requires: []
provides:
  - "__SITE_URL__ build constant (default https://aipbx.net)"
  - "__GOOGLE_ADS_ID__ / __ADS_SIGNUP_LABEL__ build constants from env"
  - "Jest globals for the three new constants"
  - ".env.example documentation for SITE_URL / Ads / GA4"
affects:
  - 09-02 meta/OG/hreflang (needs __SITE_URL__)
  - 09 analytics init (needs Ads + GA4 IDs)

tech-stack:
  added: []
  patterns:
    - "Build-time env constant chain: process.env → webpack.config → buildOptions → DefinePlugin → declare const → Jest globals (mirrors __GA4_MEASUREMENT_ID__)"

key-files:
  created:
    - .env.example
  modified:
    - webpack.config.ts
    - config/build/types/config.ts
    - config/build/buildPlugins.ts
    - src/app/types/global.d.ts
    - config/jest/jest.config.ts

key-decisions:
  - "SITE_URL defaults to https://aipbx.net at build time; never window.location.origin (D-02/D-03)"
  - "Ads IDs empty-string default locally; real values documented in .env.example as public client IDs"
  - ".env.example force-added despite .env.* gitignore so plan artifact is tracked"

patterns-established:
  - "New analytics/SEO build constants follow the same four-hop chain as __GA4_MEASUREMENT_ID__"

requirements-completed: [D-07]

duration: 18min
completed: 2026-07-21
---

# Phase 09 Plan 01: Build-time SEO/Ads constants Summary

**Webpack DefinePlugin chain for `__SITE_URL__`, `__GOOGLE_ADS_ID__`, and `__ADS_SIGNUP_LABEL__` (env → buildOptions → declare const → Jest globals), mirroring `__GA4_MEASUREMENT_ID__`**

## Performance

- **Duration:** 18 min
- **Started:** 2026-07-21T07:41:00Z
- **Completed:** 2026-07-21T07:59:00Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Threaded `SITE_URL` / `GOOGLE_ADS_ID` / `ADS_SIGNUP_LABEL` from `process.env` through `webpack.config.ts` into typed `buildOptions`
- Injected matching `__SITE_URL__` / `__GOOGLE_ADS_ID__` / `__ADS_SIGNUP_LABEL__` via DefinePlugin + `global.d.ts`
- Documented public tracking env vars in `.env.example` and registered Jest globals for Wave 2 tests

## Task Commits

Each task was committed atomically:

1. **Task 1: Thread SITE_URL / GOOGLE_ADS_ID / ADS_SIGNUP_LABEL through webpack env + types** - `7cc64c6a` (feat)
2. **Task 2: Inject constants via DefinePlugin + declare globals** - `fe87b412` (feat)
3. **Task 3: Document env vars + register Jest globals** - `db4cf416` (chore) + `e6c12965` (chore, `.env.example` force-add)

**Plan metadata:** (pending docs commit)

## Files Created/Modified

- `webpack.config.ts` — env reads + pass-through for `siteUrl`, `googleAdsId`, `adsSignupLabel`
- `config/build/types/config.ts` — `buildOptions` fields for the three strings
- `config/build/buildPlugins.ts` — DefinePlugin entries for the three `__CONST__`s
- `src/app/types/global.d.ts` — `declare const` for the three names
- `.env.example` — `SITE_URL`, `GOOGLE_ADS_ID`, `ADS_SIGNUP_LABEL`, GA4 value note
- `config/jest/jest.config.ts` — Jest `globals` defaults for the three constants

## Decisions Made

- Default `__SITE_URL__` / `SITE_URL` to `https://aipbx.net` so canonical/hreflang stay host-independent
- Leave Ads IDs empty in local/Jest defaults; document production public IDs in `.env.example` only
- Do not hardcode gtag in `index.html` (deferred to analytics plans)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `.env.example` ignored by `.env.*` gitignore**
- **Found during:** Task 3 (Document env vars + register Jest globals)
- **Issue:** `git add .env.example` skipped the file because `.gitignore` matches `.env.*`, so the plan's documented env keys would not be tracked
- **Fix:** `git add -f .env.example` and a follow-up chore commit so the template is in history
- **Files modified:** `.env.example`
- **Verification:** `git ls-files .env.example` shows tracked; file contains `SITE_URL`, `GOOGLE_ADS_ID`, `ADS_SIGNUP_LABEL`
- **Committed in:** `e6c12965`

---

**Total deviations:** 1 auto-fixed (Rule 3)
**Impact on plan:** Necessary for Task 3 acceptance (`.env.example` keys present in repo). No scope creep.

## Issues Encountered

- Plan verify `npx tsc --noEmit -p tsconfig.json` reports pre-existing `node_modules` type errors (playwright-core, react-toastify JSX, etc.). Out of scope; `npm run lint:ts` (Task 2 gate) passed with 0 errors.
- `buildWebpackConfig.ts` needed no edit (passes `options` through) as predicted by the plan.

## User Setup Required

None for this plan alone. Downstream analytics plans will need local `.env.local` values for `GOOGLE_ADS_ID` / `ADS_SIGNUP_LABEL` / `GA4_MEASUREMENT_ID` when testing conversions.

## Next Phase Readiness

Wave 2 plans can import `__SITE_URL__` for canonical/hreflang and Ads/GA4 constants for analytics init. Constant names are aligned across DefinePlugin, `declare const`, and Jest globals.

## Self-Check: PASSED

- FOUND: `.planning/phases/09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso/09-01-SUMMARY.md`
- FOUND: `7cc64c6a`, `fe87b412`, `db4cf416`, `e6c12965`
- FOUND: `__SITE_URL__` in `config/build/buildPlugins.ts` and `src/app/types/global.d.ts`
