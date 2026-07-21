# Phase 09 — SEO / Lighthouse Audit (aipbx.net)

**Scope:** Public EN landing surface on `https://aipbx.net` — `/`, `/voice-assistants`, `/speech-analytics`, `/pricing`.  
**Audience:** Founder + implementers. This is the D-11 deliverable: an expert technical-SEO audit with prioritized actions, not a Lighthouse score dump.  
**Sources:** Codebase review (usePageMeta, index.html, sitemap/robots, analytics init, landing pages), `09-RESEARCH.md`, `GTM-CONTENT-PLAN.md` technical checklist.  
**Date:** 2026-07-21.

---

## Executive Summary

aiPBX’s marketing pages are a client-rendered React SPA. Before Phase 09, crawlers and Ads quality bots largely saw an empty `#root`, a title-only `index.html`, RU-hardcoded meta on EN-targeted routes, and inert GA4/Ads wiring. That combination tanks organic eligibility and Quality Score even when the product UI itself is strong.

Phase 09 closes the crawlability and measurement gaps that block .net GTM: build-time `__SITE_URL__`, i18n-driven meta + hreflang + JSON-LD, absolute OG image, `.net` sitemap/robots, funnel gtag conversions, and prerendered HTML for the public routes. Those are the P0/P1 engineering fixes.

Two items stay out of code scope for founder decision: **Consent Mode v2 for EEA** (aipbx.net = `eu` region — compliance + Ads measurement quality), and **image dimension / CLS hardening** on landing imagery. Search Console / Ads console publication remains founder-led.

**Bottom line:** After Phase 09 code lands and prerender verifies, treat the site as “technically ready to rank and advertise on .net.” Remaining work is compliance (consent), content/CRO iteration, and console submission — not more meta plumbing.

---

## Per-page findings

Findings apply to the prerender target set. Severity reflects pre-fix baseline; Disposition shows Phase 09 treatment.

| Route | Primary intent | Pre-fix crawl/meta state | Notable page-specific issues | Disposition |
|-------|----------------|----------------------------|------------------------------|-------------|
| `/` | Brand + AI voice PBX overview | Client-only meta; empty shell for bots; RU strings risk on EN host | Needs SoftwareApplication JSON-LD, absolute canonical/OG, EN title/description aligned to “AI voice assistant / cloud PBX” | Fixed in-phase: D-01/D-02 meta (09-02/09-04), D-04 prerender (09-07), D-03/D-05 static SEO (09-06) |
| `/voice-assistants` | AI receptionist / SIP voice bot | Same SPA shell problem; Ads landing for ad groups 1–2 | H1/meta must mirror keyword themes (AI voice assistant, Asterisk/SIP bot) for QS; demo CTA (D-08) | Fixed in-phase as above + D-08 CRO (09-04) |
| `/speech-analytics` | Call QA / speech analytics | Hardcoded RU `METRICS` + RU meta historically | EN copy must be fully functional (D-09); metrics i18n (D-08) | Fixed in-phase: D-08/D-09 (09-04) + meta/prerender stack |
| `/pricing` | Commercial intent | In sitemap; meta must not leak RU currency assumptions on .net | Keep canonical on `.net`; avoid RU-only pricing claims in EN meta | Fixed in-phase: sitemap (09-06) + meta/prerender; pricing copy ownership stays product |

Cross-cutting: viewport zoom lock, missing OG file, `.ru` sitemap, inert analytics, and no Consent Mode v2 affected all four routes equally (see issue register below).

---

## Issue register (10 codebase-verified findings)

| # | Issue | Evidence | Severity | Disposition |
|---|-------|----------|----------|-------------|
| 1 | Meta injected client-side only → bots see empty `#root` | `usePageMeta` in `useEffect`; no SSR | **P0** | **FIXED in phase** via prerender (D-04 / plan **09-07**). Meta still written by React, but snapshot HTML includes title/description/OG/JSON-LD. |
| 2 | `index.html` missing description, canonical, OG, JSON-LD | `public/index.html` title-only shell | **P0** | **FIXED in phase** — shell + per-page head via usePageMeta + prerender (plans **09-02**, **09-04**, **09-07**). Do not hardcode per-route meta into `index.html`. |
| 3 | Viewport blocks zoom (`user-scalable=no`, `maximum-scale=1.0`) → a11y / Best Practices hit | `public/index.html` viewport meta | **P1** | **FIXED in phase** (D-08 / plan **09-04** Task 3 — index.html base meta + viewport a11y). |
| 4 | `og:image` path missing + relative URL invalid for scrapers | `usePageMeta` default `/assets/og-default.png`; file was absent | **P1** | **FIXED in phase** (D-05 / plan **09-06** shipped `public/assets/og-default.png` 1200×630; absolute URL via `__SITE_URL__` in D-02). |
| 5 | sitemap / robots pointed at `aipbx.ru` | `public/sitemap.xml`, `public/robots.txt` | **P1** | **FIXED in phase** (D-03 / plan **09-06**) → `https://aipbx.net` locs + Sitemap directive. Founder still submits in Search Console. |
| 6 | Landing meta hardcoded RU; no hreflang | Landing `.tsx` `usePageMeta` calls | **P0/P1** | **FIXED in phase** (D-01 i18n meta, D-02 hreflang / `__SITE_URL__` — plans **09-01**, **09-02**, **09-04**). |
| 7 | Hardcoded RU `METRICS` array on Speech Analytics | `SpeechAnalyticsLandingPage.tsx` | **P2** | **FIXED in phase** (D-08 / plan **09-04** Task 2 — METRICS → i18n). |
| 8 | Analytics inert (empty GA4/Ads env; no funnel / Ads conversions) | webpack DefinePlugin defaults; `initAnalytics` | **P0** | **FIXED in phase** (D-06/D-07 — plans **09-01**, **09-03**): GA4 `G-G1KZQCKP5D`, Ads `AW-16711221644`, signup label `-B6_CK72wtMcEIyDxKA-`. Prod env must supply real IDs. |
| 9 | No Consent Mode v2 (EEA / region `eu`) | `getDomainConfig` region `eu`; gtag without `consent` defaults | **P1 (compliance)** | **DEFERRED — founder decision.** Documented recommendation below. Not a Phase 09 code blocker (CONTEXT: defer consent UI). |
| 10 | Images lack width/height (CLS); some not lazy | Landing `<img>` — many already `loading="lazy"`, few explicit dims | **P2** | **DEFERRED to backlog.** Recommend dims on LCP/hero assets next CRO pass. |

---

## Prioritized recommendations

### P0 — Ship / verify this phase

1. **Confirm prerendered HTML** for `/`, `/voice-assistants`, `/speech-analytics`, `/pricing` contains real `<title>`, meta description, canonical, `og:*`, and JSON-LD (no PageLoader shell, no raw i18n keys). Gate: plan **09-07**.
2. **Confirm absolute URLs** use `https://aipbx.net` (never `window.location.origin` / localhost) for canonical, `og:url`, `og:image`, hreflang.
3. **Confirm gtag** loads GA4 + Google Ads configs in production builds and fires `signup_complete` (primary) plus observation events (`assistant_created`, `first_call`, `payment_success`) as wired in D-06/D-07.
4. **Do not publish Search Ads** until prerender verify passes — Ads quality bot must see the same LP copy as users.

### P1 — Near-term (founder / next compliance slice)

1. **Consent Mode v2 (EEA) — founder decision required.**  
   aipbx.net is configured as region `eu`. Running GA4 + Google Ads personalized advertising in the EEA without Consent Mode v2 conflicts with Google’s EU user consent policy and can suppress modeled conversions.  
   **Recommendation:**  
   - Minimal: `gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 })` before tags fire, then a CMP/banner that updates to `granted` on accept.  
   - If traffic is intentionally non-EEA only, document that and still default-deny for EEA IP until a CMP exists.  
   - Full banner/CMP UI is **out of Phase 09** — track as a dedicated compliance follow-up.  
2. **Submit** `https://aipbx.net/sitemap.xml` in Google Search Console (and Bing if used).  
3. **Validate OG** with Facebook Sharing Debugger / LinkedIn Post Inspector / Telegram after deploy (cache bust once).  
4. **Rich Results Test** on each LP’s JSON-LD (`SoftwareApplication` or equivalent).

### P2 — Backlog / polish

1. Add explicit `width`/`height` (or CSS aspect-ratio reserved space) on landing images to cut CLS.  
2. Optional `no-js` / prerender CSS fallback so framer-motion `opacity:0` snapshots don’t look blank in social screenshot tools (text remains indexable either way).  
3. Expand hreflang/RU twin pages when Phase 4 RU GTM lands (generator for dual-domain sitemap).  
4. Monitor GA4 DebugView for double `page_view` (SPA: prefer `send_page_view: false` + route-change events only).

---

## Verification method

| Check | How | Pass criteria |
|-------|-----|----------------|
| Lighthouse (lab) | Chrome DevTools or CLI on **prerendered** production build URLs for the four routes | SEO ≥ 90; no “Document doesn’t have a meta description”; viewport allows zoom; BP/A11y free of zoom-block and major crawl issues |
| PageSpeed Insights | Field + lab on live `.net` after deploy | No catastrophic LCP/CLS regressions vs. current SPA; track CLS if images still undimensioned |
| View source / curl | `curl -sL https://aipbx.net/voice-assistants \| head` (and peers) | Title, description, canonical, OG, JSON-LD present **without** executing JS |
| Rich Results Test | [Google Rich Results Test](https://search.google.com/test/rich-results) | Valid structured data; no critical errors on SoftwareApplication |
| OG debuggers | Meta / LinkedIn / Telegram scrapers | 1200×630 image resolves; title/description match EN meta |
| Analytics | GA4 DebugView + Google Ads tag assistant | `page_view` once per route; `signup_complete` with Ads conversion label on signup success |
| Consent (when implemented) | Tag Assistant + Ads “Consent” diagnostics | Default denied in EEA until grant; no policy warnings |

---

## Measurement notes for Lighthouse categories

- **Performance:** Prerender helps FCP for bots; real-user Perf still depends on chunk size, fonts, and motion. Do not chase 100 at the cost of product UX.  
- **SEO:** Should flip from fail (empty document / missing description) to pass once prerender + meta ship.  
- **Best Practices / Accessibility:** Viewport zoom unlock is the known Phase 09 a11y win; Consent Mode is policy, not a Lighthouse audit item.  
- **Crawl budget:** Small site — four marketing URLs + docs/signup in sitemap is appropriate; keep app routes `Disallow`’d.

---

## Out of scope (explicit)

- Live Google Ads campaign creation/budget (see `09-ADS-ASSETS.md` draft; founder-led).  
- Full CMP / cookie banner implementation.  
- RU content rewrites and Яндекс-centric SEO (Phase 4 / aipbx.ru).  
- Backend or telephony changes.
