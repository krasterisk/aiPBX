# Phase 9: Landing SEO + Google Ads (aipbx.net) - Context

**Gathered:** 2026-07-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver production SEO for the public landing pages and enable Google Ads
publication for **aipbx.net (EN segment)**. Scope covers three public pages —
`/` (MainPage), `/voice-assistants`, `/speech-analytics` — plus `/pricing` for
prerender. Concretely: crawlable per-page meta/OG/JSON-LD, bot-visible
prerendering, GA4 + Google Ads conversion tracking across the signup funnel,
sitemap/robots for `.net`, an expert SEO/Lighthouse audit artifact, and drafted
Google Ads campaign assets.

Baseline starting point is `scripts/aipbx_seo.patch` (4 commits), but it is
applied **with modification** (see D-01) — not verbatim.

**In scope:** technical SEO, prerender, conversion/analytics wiring, EN i18n for
landing content, CRO quick wins, audit doc, Ads campaign asset drafts.
**Out of scope:** RU/aipbx.ru go-to-market execution (Phase 4), deep CRO
rewrites, running/managing live Ads campaigns (founder-led), backend changes.

</domain>

<decisions>
## Implementation Decisions

### Market / Domain Segmentation
- **D-01:** Apply `scripts/aipbx_seo.patch` as a **baseline, not verbatim.**
  The patch hardcodes EN meta strings directly into the `.tsx` files (replacing
  the RU strings) and hardcodes the `METRICS` array in RU. Instead, route all
  landing meta (`usePageMeta` titles/descriptions) **and** the `METRICS` array
  through i18n keys (`main` namespace) so EN and RU coexist. Applying the patch
  as-is would break the future RU landing — this is explicitly disallowed.
- **D-02:** Target **aipbx.net / EN now**, but architect for RU. Add `hreflang`
  alternates (en ↔ ru) and keep the meta/content i18n-driven so the `.ru`
  segment can be enabled later without rework. Clear EN/RU segment separation is
  a hard requirement: **do not break RU** while shipping EN.
- **D-03:** `sitemap.xml` and `robots.txt` switch to `https://aipbx.net`
  (per patch). RU sitemap/robots handling is deferred to Phase 4; note the
  single-static-build constraint (one sitemap/robots per build) for the planner.

### Prerender Strategy
- **D-04:** Do **not** adopt `react-snap` blindly. Research step must **evaluate
  alternatives** (SSR, prerender service, or react-snap) and justify the choice —
  react-snap is known to be fragile on hydration/dynamic content. Goal: bots
  (Google Ads quality bot, social scrapers, non-JS crawlers) must receive fully
  rendered meta/OG/JSON-LD, since the current `usePageMeta` is client-side only.
- **D-05:** Generate the missing `og-default.png` (referenced by `usePageMeta`
  at `/assets/og-default.png` but the file does not exist → OG previews are
  currently broken). Per-page OG images optional/nice-to-have.

### Analytics & Conversion Tracking
- **D-06:** Implement the **full GA4 funnel**, not just the signup tag:
  `signup_complete`, `assistant_created`, `first_call`, `payment_success`
  (event names per `.planning/intel/GTM-CONTENT-PLAN.md`). Patch's
  `fireConversionEvent()` on signup is the starting point; extend to the other
  funnel stages.
- **D-07:** GA4 (`G-G1KZQCKP5D`) + Google Ads (`AW-16711221644`) tags from the
  patch are the real IDs to use. Yandex.Metrika is deferred with the RU segment
  (Phase 4), but leave the funnel event model reusable for it.

### Landing CRO (Quick Wins — all 3 pages)
- **D-08:** Quick wins only across `/`, `/voice-assistants`, `/speech-analytics`:
  (1) demo CTA (GAP-42), (2) move hardcoded RU `METRICS` array on the Speech
  Analytics landing → i18n with EN + RU, (3) fix `viewport` accessibility
  (`user-scalable=no, maximum-scale=1.0` penalized by Lighthouse a11y).
- **D-09:** Speech Analytics landing content is **fully functional in EN** for
  the .net market while preserving the RU variant via i18n. Deep CRO (hero
  rewrites, social proof, trust blocks, FAQ) is deferred.

### Google Ads Publication Scope
- **D-10:** Deliver **code + campaign asset drafts.** Code = gtag + full-funnel
  conversions in the repo. Assets = agent drafts EN keyword list, ad copy, and
  ad group structure as a phase artifact. Actual campaign creation/management in
  the Google Ads console remains **founder-led** (outside the codebase).

### Expert Audit Deliverable
- **D-11:** Produce a written **SEO / Lighthouse-style expert audit +
  prioritized recommendations** as a phase artifact (the founder explicitly
  requested landing analysis and improvement recommendations). The audit informs
  which quick wins land in this phase vs. the backlog.

### Claude's Discretion
- Exact i18n key naming, JSON-LD field details, and the structure of the audit
  and Ads-asset documents are left to the planner/implementer.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### SEO patch baseline (apply with D-01 modification)
- `scripts/aipbx_seo.patch` — 4-commit baseline: EN meta, JSON-LD
  `SoftwareApplication`, GA4 + Ads gtag, `fireConversionEvent`, react-snap,
  sitemap/robots → `.net`. Apply as baseline, NOT verbatim (see D-01).

### GTM / analytics plan
- `.planning/intel/GTM-CONTENT-PLAN.md` — funnel goal event names
  (`signup_complete`, `assistant_created`, `first_call`, `payment_success`),
  keyword table, technical SEO checklist.

### Current SEO implementation (files to change)
- `public/index.html` — no description/OG/JSON-LD/gtag today; `lang="en"`;
  `viewport` a11y issue.
- `src/shared/lib/seo/usePageMeta.ts` — client-side meta helper (title, desc,
  OG, canonical); references missing `/assets/og-default.png`.
- `src/pages/VoiceAssistantsLandingPage/ui/VoiceAssistantsLandingPage.tsx` —
  hardcoded RU meta via `usePageMeta`.
- `src/pages/SpeechAnalyticsLandingPage/ui/SpeechAnalyticsLandingPage.tsx` —
  hardcoded RU meta + hardcoded RU `METRICS` array (D-08).
- `src/pages/MainPage/ui/MainPage.tsx` — home page, include in meta/JSON-LD.
- `public/sitemap.xml`, `public/robots.txt` — currently `aipbx.ru`.
- `src/features/Auth/lib/hooks/useSignupData.ts` — signup success handlers where
  `fireConversionEvent()` is wired (extend for full funnel, D-06).
- `package.json` — `postbuild:prod` / prerender config target.

### Project rules
- `.planning/PROJECT.md` — i18n ru+en minimum, new UI in `redesign-v3`,
  Definition of Done.
- `.planning/GAPS.md` — GAP-15 (SPA single title), GAP-16 (conversion analytics),
  GAP-40 (prerender/SSR), GAP-42 (demo CTA).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `usePageMeta` / `setPageMeta` (`src/shared/lib/seo/usePageMeta.ts`): already
  handles title/description/OG/canonical upsert — extend to be i18n-driven and
  add JSON-LD + hreflang rather than replacing.
- `react-i18next` `useTranslation('main')` already used on all landing pages —
  the mechanism for moving hardcoded strings into i18n exists.
- Landing pages share `../../shared/LandingStyles.module.scss` — consistent
  place for any CTA/section styling.

### Established Patterns
- Client-side meta injection via `useEffect` — the core reason bots see empty
  `#root`; prerender (D-04) is what makes this SEO-effective.
- i18n keys under `main` namespace for landing copy; ru + en required by project
  rules.

### Integration Points
- Signup funnel: `src/features/Auth/lib/hooks/useSignupData.ts` (Google,
  Telegram, email activation success) — conversion + funnel events fire here.
- Build pipeline: `package.json` scripts (`build:prod`, `postbuild:prod`) — where
  the chosen prerender approach hooks in.

</code_context>

<specifics>
## Specific Ideas

- Real tracking IDs to wire: GA4 `G-G1KZQCKP5D`, Google Ads `AW-16711221644`,
  signup conversion `send_to: AW-16711221644/-B6_CK72wtMcEIyDxKA-`.
- The founder wants a genuine expert audit with prioritized recommendations, not
  just a mechanical patch application (D-11).
- Hard constraint restated: EN and RU are separate segments — ship EN fully
  functional, never break RU.

</specifics>

<deferred>
## Deferred Ideas

- RU / aipbx.ru SEO + Yandex.Metrika + RU sitemap/robots → **Phase 4 (RU GTM)**.
- Deep CRO (hero copywriting rewrite, social proof, trust blocks, FAQ sections)
  → future CRO phase / backlog.
- Per-page custom OG images (beyond a single `og-default.png`) → backlog.
- Live Google Ads campaign creation/management → founder-led, outside codebase.

None of the above are in Phase 9 scope.

</deferred>

---

*Phase: 9-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso*
*Context gathered: 2026-07-21*
