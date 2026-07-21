---
phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
plan: 08
subsystem: gtm
tags: [seo-audit, google-ads, lighthouse, consent-mode, aipbx.net, campaign-draft]

requires:
  - phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
    provides: RESEARCH issue table, Ads structure, CONTEXT D-10/D-11 scope
provides:
  - "09-SEO-AUDIT.md expert SEO/Lighthouse audit with P0/P1/P2 + Consent Mode v2 (D-11)"
  - "09-ADS-ASSETS.md EN Search campaign draft with 4 ad groups + conversion mapping (D-10)"
affects:
  - founder Ads console setup
  - post-phase compliance (Consent Mode v2)
  - 09-07 prerender gate (Ads quality-bot dependency noted)

tech-stack:
  added: []
  patterns:
    - "Phase GTM artifacts as .planning markdown (audit + Ads draft), not runtime code"
    - "Disposition each RESEARCH finding as FIXED-in-phase (D-ID/plan) vs deferred backlog"

key-files:
  created:
    - .planning/phases/09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso/09-SEO-AUDIT.md
    - .planning/phases/09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso/09-ADS-ASSETS.md
  modified: []

key-decisions:
  - "Consent Mode v2 documented as P1 founder decision; no CMP implementation in this plan"
  - "Ads draft optimizes to signup_complete (label -B6_CK72wtMcEIyDxKA-); other funnel events observation-only"
  - "Campaign launch gated on 09-07 prerender verify for Quality Score"

patterns-established:
  - "Expert audit prose + issue register linking each finding to phase plan IDs"
  - "EN Ads asset draft: 4 intent ad groups → LP routes with RSA/negatives/extensions"

requirements-completed: [D-10, D-11]

duration: 12min
completed: 2026-07-21
---

# Phase 09 Plan 08: SEO Audit + Ads Assets Summary

**Delivered D-11 expert SEO/Lighthouse audit and D-10 EN Google Ads Search campaign draft as phase planning artifacts for aipbx.net.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-07-21T08:26:00Z
- **Completed:** 2026-07-21T08:32:00Z
- **Tasks:** 2/2
- **Files modified:** 2 created

## Accomplishments

- Wrote `09-SEO-AUDIT.md` with executive summary, per-page findings for `/`, `/voice-assistants`, `/speech-analytics`, `/pricing`, all 10 RESEARCH issues with fix-in-phase vs deferred disposition, P0/P1/P2 recommendations, and verification methods (Lighthouse, PSI, Rich Results, OG debuggers).
- Explicitly flagged **Consent Mode v2 (EEA)** as a prioritized P1 compliance recommendation for founder decision (deferred from Phase 09 code scope).
- Wrote `09-ADS-ASSETS.md`: one EN Search campaign, four ad groups mapped to landing routes, keyword clusters, RSAs, negatives, sitelinks/callouts, conversion mapping to `signup_complete` + Ads label `-B6_CK72wtMcEIyDxKA-`, budget/bidding left as founder placeholders.

## Task Commits

Each task was committed atomically:

1. **Task 1: Write 09-SEO-AUDIT.md** - `f60e5fd4` (docs)
2. **Task 2: Write 09-ADS-ASSETS.md** - `5391e7d9` (docs)

**Plan metadata:** (pending final docs commit)

## Files Created/Modified

- `09-SEO-AUDIT.md` — expert technical-SEO audit (D-11)
- `09-ADS-ASSETS.md` — EN Google Ads campaign asset draft (D-10)

## Decisions Made

- Consent Mode v2: document only (P1); no default-consent stub or banner in this plan.
- Ads: draft-only; founder manages live campaign; launch after 09-07 prerender verify.
- Primary conversion for bidding: `signup_complete` with label `-B6_CK72wtMcEIyDxKA-`; secondary funnel events as observation/import.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

Founder actions (not code):

1. Submit `https://aipbx.net/sitemap.xml` in Google Search Console (also noted in 09-06).
2. Decide Consent Mode v2 / CMP approach before scaling EEA Ads (see audit P1).
3. Load `09-ADS-ASSETS.md` into Google Ads console after prerender verify; set budget/bidding.

## Known Stubs

None — both artifacts are complete written deliverables. Budget/bidding fields intentionally use `[FOUNDER: …]` placeholders per plan.

## Threat Flags

None beyond plan threat model T-09-17 (public Ads/GA client IDs in docs — accepted).

## Next Phase Readiness

- D-10 and D-11 artifacts unblocked founder GTM ops.
- Remaining Phase 09 code plans (02–05, 07 as applicable) still need execution for audit “FIXED in phase” claims to be true in production HTML.
- Ads launch explicitly waits on 09-07 prerender.

## Self-Check: PASSED

- FOUND: `09-SEO-AUDIT.md`
- FOUND: `09-ADS-ASSETS.md`
- FOUND: commit `f60e5fd4`
- FOUND: commit `5391e7d9`
