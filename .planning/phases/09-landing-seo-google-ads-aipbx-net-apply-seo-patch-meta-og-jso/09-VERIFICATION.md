---
phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
verified: 2026-07-21T11:05:00Z
status: passed
score: 11/11 must-haves verified
overrides_applied: 0
gaps: []
---

# Phase 09: Landing SEO + Google Ads (aipbx.net) Verification Report

**Phase Goal:** Deliver production SEO for public landing pages (`/`, `/voice-assistants`, `/speech-analytics`, `/pricing`) and enable Google Ads publication for aipbx.net (EN): i18n-driven per-page meta/OG/JSON-LD/hreflang, bot-visible prerender, GA4 + Google Ads conversion funnel, sitemap/robots for .net, SEO/Lighthouse audit artifact, drafted Google Ads campaign assets. Docker EU build must support prerender for `[deploy:1]`.

**Verified:** 2026-07-21T11:05:00Z  
**Status:** passed  
**Re-verification:** Yes — EN prerender locale gap closed

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Build injects `__SITE_URL__`, `__GOOGLE_ADS_ID__`, `__ADS_SIGNUP_LABEL__` | ✓ VERIFIED | webpack → DefinePlugin → `global.d.ts` |
| 2 | `setPageMeta` writes title, description, OG, canonical, hreflang, JSON-LD from `__SITE_URL__` | ✓ VERIFIED | `usePageMeta.ts` |
| 3 | `useSeoRenderReady` dispatches `seo-render-ready`; landings + PublicPricing call it | ✓ VERIFIED | Hook + 4 public pages |
| 4 | `initAnalytics` configures Ads + GA4 `send_page_view:false`; `fireAdsConversion` guarded | ✓ VERIFIED | `initAnalytics.ts` + tests |
| 5 | Landing meta/METRICS/demo CTA via i18n (EN+RU); `index.html` base SEO + a11y viewport | ✓ VERIFIED | locales + `index.html` |
| 6 | Full funnel: signup_complete + Ads, SPA page_view, first_call, payment_success | ✓ VERIFIED | signup / App / Playground / BillingPage |
| 7 | `sitemap.xml` / `robots.txt` → `https://aipbx.net`; `og-default.png` 1200×630 | ✓ VERIFIED | files inspected |
| 8 | Prerender 4 routes; `verify-prerender.js` structural + EN gate passes | ✓ VERIFIED | `npm run build:prod` → postbuild OK |
| 9 | `09-SEO-AUDIT.md` + `09-ADS-ASSETS.md` | ✓ VERIFIED | artifacts present |
| 10 | Docker EU builder: Chromium + SITE_URL/GA4/Ads ARGs + verify | ✓ VERIFIED | `Dockerfile` |
| 11 | **Bot-visible prerendered HTML for aipbx.net is EN (D-02)** | ✓ VERIFIED | Rebuild 2026-07-21: EN titles on all 4 routes; verify asserts no Cyrillic + EN markers |

**Score:** 11/11 truths verified

### EN prerender fix (gap closure)

| Change | Role |
| ------ | ---- |
| `src/shared/config/i18n/i18n.ts` | Custom `siteUrl` detector; order `localStorage → siteUrl → navigator` so `.net` `__SITE_URL__` wins over host OS locale |
| `config/build/buildPlugins.ts` | `pageSetup`: set `i18nextLng` + `Accept-Language` from `SITE_URL` before app scripts |
| `scripts/verify-prerender.js` | For non-`.ru` `SITE_URL`: reject Cyrillic in title/description; require EN title substrings |

### Spot-check (post-fix build)

| Route | `<title>` |
| ----- | --------- |
| `/` | AI Voice Assistant Platform — Cloud PBX \| AI PBX |
| `/voice-assistants` | AI Voice Assistant for Business \| Automate Calls 24/7 \| AI PBX |
| `/speech-analytics` | Speech Analytics Software for Call Centers \| AI PBX |
| `/pricing` | AI PBX Pricing |

`verify-prerender: OK (4 routes + sitemap/robots + og-default.png, EN meta)`
