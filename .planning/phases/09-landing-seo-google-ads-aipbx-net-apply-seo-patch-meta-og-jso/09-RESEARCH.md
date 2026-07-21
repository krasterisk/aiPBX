# Phase 9: Landing SEO + Google Ads (aipbx.net) — Research

**Researched:** 2026-07-21
**Domain:** Technical SEO / prerender for a Webpack 5 React 18 SPA + GA4/Google Ads conversion tracking + i18n-safe meta
**Confidence:** HIGH (codebase facts, prerender/gtag mechanics), MEDIUM (Ads asset guidance, Consent Mode applicability)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Apply `scripts/aipbx_seo.patch` as a **baseline, not verbatim.** The patch hardcodes EN meta strings into `.tsx` and hardcodes the `METRICS` array in RU. Instead, route all landing meta (`usePageMeta` titles/descriptions) **and** the `METRICS` array through i18n keys (`main` namespace) so EN and RU coexist. Applying the patch as-is would break the future RU landing — explicitly disallowed.
- **D-02:** Target **aipbx.net / EN now**, but architect for RU. Add `hreflang` alternates (en ↔ ru) and keep meta/content i18n-driven so the `.ru` segment can be enabled later without rework. Clear EN/RU segment separation is a hard requirement: **do not break RU** while shipping EN.
- **D-03:** `sitemap.xml` and `robots.txt` switch to `https://aipbx.net` (per patch). RU sitemap/robots handling deferred to Phase 4; note the single-static-build constraint (one sitemap/robots per build).
- **D-04:** Do **not** adopt `react-snap` blindly. Research must **evaluate alternatives** (SSR, prerender service, react-snap) and justify. Bots (Google Ads quality bot, social scrapers, non-JS crawlers) must receive fully rendered meta/OG/JSON-LD; current `usePageMeta` is client-side only.
- **D-05:** Generate the missing `og-default.png` (referenced at `/assets/og-default.png`, file does not exist → OG previews broken). Per-page OG images optional.
- **D-06:** Implement the **full GA4 funnel**, not just signup: `signup_complete`, `assistant_created`, `first_call`, `payment_success` (names per `GTM-CONTENT-PLAN.md`). Patch's `fireConversionEvent()` on signup is the starting point.
- **D-07:** GA4 (`G-G1KZQCKP5D`) + Google Ads (`AW-16711221644`) are the real IDs. Yandex.Metrika deferred with RU (Phase 4), but keep the funnel event model reusable for it.
- **D-08:** CRO quick wins on all 3 pages: (1) demo CTA (GAP-42), (2) move hardcoded RU `METRICS` array → i18n EN+RU, (3) fix `viewport` a11y (remove `user-scalable=no, maximum-scale=1.0`).
- **D-09:** Speech Analytics landing fully functional in EN for .net while preserving RU via i18n. Deep CRO deferred.
- **D-10:** Deliver **code + campaign asset drafts.** Code = gtag + full-funnel conversions in repo. Assets = EN keyword list, ad copy, ad group structure as a phase artifact. Live campaign management is founder-led (outside codebase).
- **D-11:** Produce a written **SEO / Lighthouse-style expert audit + prioritized recommendations** as a phase artifact.

### Claude's Discretion
- Exact i18n key naming, JSON-LD field details, and the structure of the audit and Ads-asset documents are left to the planner/implementer.

### Deferred Ideas (OUT OF SCOPE)
- RU / aipbx.ru SEO + Yandex.Metrika + RU sitemap/robots → Phase 4 (RU GTM).
- Deep CRO (hero copy rewrite, social proof, trust blocks, FAQ) → future CRO phase / backlog.
- Per-page custom OG images (beyond `og-default.png`) → backlog.
- Live Google Ads campaign creation/management → founder-led, outside codebase.
</user_constraints>

<phase_requirements>
## Phase Requirements

> `.planning/REQUIREMENTS.md` is stale (Dashboard Insights, Phase 1). Phase 9 has no dedicated REQ-IDs; the mapping below derives from CONTEXT decisions + GAPS the phase closes (GAP-15 SEO, GAP-16 conversion analytics, GAP-40 prerender, GAP-42 demo CTA).

| ID | Description | Research Support |
|----|-------------|------------------|
| D-01 / GAP-15 | i18n-driven per-page meta (EN+RU) + JSON-LD, patch applied as baseline | § Architecture Patterns (Meta helper), § Code Examples |
| D-02 | hreflang alternates en/ru/x-default; do not break RU | § Pattern: hreflang + build-time SITE_URL |
| D-03 | sitemap.xml / robots.txt → .net (single build) | § Pattern: sitemap/robots strategy |
| D-04 / GAP-40 | Bot-visible prerender of /, /voice-assistants, /speech-analytics, /pricing | § Standard Stack, § Prerender evaluation |
| D-05 | Generate `og-default.png` (1200×630) | § Don't Hand-Roll / § Pitfalls (OG image) |
| D-06 / GAP-16 | Full GA4 funnel: signup_complete, assistant_created, first_call, payment_success | § Analytics wiring map |
| D-07 | Real GA4 + Ads IDs via build env, not hardcoded index.html | § Pattern: extend initAnalytics |
| D-08 / GAP-42 | Demo CTA + METRICS→i18n + viewport a11y fix | § Code Examples, § CRO quick wins |
| D-10 | Google Ads EN asset draft artifact | § Google Ads Campaign Asset Structure |
| D-11 | SEO/Lighthouse expert audit artifact | § Lighthouse / Technical-SEO Audit |
</phase_requirements>

## Summary

The current SPA injects all SEO metadata client-side: `public/index.html` ships with only `<title>AI PBX</title>` and a viewport tag (no description, canonical, OG, or JSON-LD), and `usePageMeta` writes title/description/OG into `document.head` inside a `useEffect`. Non-JS crawlers (Google Ads quality bot, Facebook/Telegram/LinkedIn scrapers) therefore see an empty `<div id="root">` with no marketing meta — this is the core problem the phase fixes. All four target routes (`/`, `/voice-assistants`, `/speech-analytics`, `/pricing`) are **lazy-loaded** (`React.lazy` + `Suspense`/`PageLoader`), i18n is loaded **asynchronously** at runtime (`i18next-http-backend` fetching `/locales/{lng}/{ns}.json`), and landing content animates via **framer-motion** (`initial="hidden"` opacity:0). All three facts are prerender hazards that must be handled by a "render-ready" signal.

**Prerender recommendation:** Do **not** use `react-snap` — it is effectively unmaintained (last real release 2018/2020, v1.23.0), has no React 18 `createRoot`/`hydrateRoot` support, and is documented to break on `React.lazy` async chunks. Use **`@prerenderer/webpack-plugin` (v5.3.10) with `@prerenderer/renderer-puppeteer`**, hooked into the existing `HtmlWebpackPlugin`, waiting on a `renderAfterDocumentEvent` that each landing page dispatches once its lazy chunk mounted **and** i18n is ready. This produces static per-route HTML containing correct meta/OG/JSON-LD/hreflang.

**Two decoupled changes are mandatory for correctness:** (1) canonical/`og:url`/hreflang must be built from a **build-time `__SITE_URL__` constant** (default `https://aipbx.net`), NOT `window.location.origin` — because the prerender host is `localhost`, and because `getDomainConfig()` is runtime-hostname-based and returns the wrong region during prerender. (2) GA4 + Ads should extend the **already-existing** `initAnalytics()`/`trackEvent()` module (which reads build-env IDs via `DefinePlugin`) rather than hardcoding gtag into `index.html` as the patch does — hardcoding would load GA/Ads on **every** domain including aipbx.ru, duplicate the tag, and bypass the env system. Notably, `assistant_created`, `playground_call_success` (≈`first_call`), and OA funnel events are **already emitted** via `trackOnboardingEvent`; the phase mostly needs `signup_complete`, `payment_success`, an Ads conversion `send_to`, and event-name reconciliation.

**Primary recommendation:** `@prerenderer/webpack-plugin` + `renderAfterDocumentEvent` + build-time `__SITE_URL__`; extend `usePageMeta` (i18n-driven, adds JSON-LD + hreflang + canonical) rather than adopting react-helmet-async; extend `initAnalytics` for Ads + full funnel; static `.net` sitemap/robots now with an env-aware generator noted for Phase 4.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Bot-visible meta/OG/JSON-LD | Build (prerender) | CDN/Static (Nginx+Cloudflare) | SPA has no server tier; static HTML must be produced at build and served as flat files |
| Per-page meta values (i18n) | Browser/Client (`usePageMeta`) | Build (snapshot captures result) | Values come from `t()` at runtime; prerender freezes the EN result into HTML |
| Canonical / hreflang / og:url | Build (`__SITE_URL__` define) | Client | Must be host-independent; runtime `window.location` is wrong under prerender + single build |
| sitemap.xml / robots.txt | CDN/Static | Build (optional generation) | Flat files copied by `copy-webpack-plugin` into `build/` |
| GA4 page_view + funnel events | Browser/Client | — | User interaction + RTK Query mutation results are only available client-side |
| Google Ads conversion (`send_to`) | Browser/Client | — | Fires on signup/payment success in the browser |
| Ads campaign assets / SEO audit | Docs artifact (`.planning`) | — | Deliverables, not code |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@prerenderer/webpack-plugin` | `5.3.10` (pub 2024-05-01) | Prerender routes to static HTML during webpack build | Actively maintained successor to `prerender-spa-plugin`; hooks into `HtmlWebpackPlugin` (already used); supports `renderAfterDocumentEvent`/`renderAfterElementExists` + `postProcess` HTML rewriting `[VERIFIED: npm registry + Tofandel/prerenderer docs]` |
| `@prerenderer/renderer-puppeteer` | `1.2.4` | Headless-Chrome renderer for the plugin | Official renderer; waits on DOM signals; ~38K weekly downloads `[VERIFIED: npm registry]` |
| `puppeteer` | `^21+` (renderer peer) | Headless Chromium driver | Required by renderer; downloads Chromium at install (CI: use `--no-sandbox`) `[CITED: registry.npmjs.org/@prerenderer/renderer-puppeteer]` |

### Supporting (already in repo — reuse, do not re-add)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `html-webpack-plugin` | `^5.5.0` | Generates `index.html`; prerender plugin depends on it | Already configured in `buildPlugins.ts` |
| `copy-webpack-plugin` | `^11.0.0` | Copies `robots.txt`, `sitemap.xml`, assets to `build/` | Already copies both (with `noErrorOnMissing`) |
| `react-i18next` / `i18next` | `12.1.5` / `22.4.9` | i18n for meta + METRICS + copy | `useTranslation('main')`; exposes `ready` flag to gate render-ready |
| `webpack.DefinePlugin` | (webpack 5) | Inject `__SITE_URL__`, `__GA4_MEASUREMENT_ID__`, `__GOOGLE_ADS_ID__` | Already injects `__GA4_MEASUREMENT_ID__` + `__YANDEX_METRIKA_ID__` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@prerenderer/webpack-plugin` | `react-snap` (patch's choice) | **Rejected (D-04):** unmaintained since ~2020 (v1.23.0), no React 18 `createRoot`/`hydrateRoot`, breaks on `React.lazy`. Would require an entry-file hydrate/render fork + puppeteer_utils hacks. `[VERIFIED: GitHub issue #573, StackOverflow]` |
| `@prerenderer/webpack-plugin` | True SSR (Next/Remix/custom `renderToString`) | **Rejected:** requires a Node server tier (arch is static SPA behind Nginx/Cloudflare), MUI/emotion SSR setup, RTK Query server store, `.async` route rework. Massive scope for 4 static pages. |
| `@prerenderer/webpack-plugin` | Vite SSG (`vike`/`vite-react-ssg`) | **Rejected:** production build is Webpack per `.cursor/rules` ("Production builds use Webpack, not Vite"); Vite is experimental. Forking the build for SEO is out of scope. |
| `@prerenderer/webpack-plugin` | Prerender.io / hosted prerender service | **Rejected:** adds a paid runtime dependency + Nginx bot-UA routing; overkill for 4 pages; the founder wants it in-repo. |
| Extend `usePageMeta` | `react-helmet-async` `3.0.0` | **Viable alternative, not recommended.** Original (`staylor`) 2.x is unmaintained; the `3.0.0` on npm (mod 2026-03) is a re-published/forked line of uncertain provenance `[ASSUMED]`. Without true SSR, Helmet writes to `document.head` at runtime exactly like `usePageMeta` — so it does NOT by itself make bots see meta; it still needs the prerender step. It only adds declarative ergonomics + dedup. Given the repo already ships `usePageMeta` and CONTEXT says "extend rather than replace," a new dependency is not justified. |

**Installation:**
```bash
npm install -D @prerenderer/webpack-plugin @prerenderer/renderer-puppeteer puppeteer
```

**Version verification:** `npm view` confirmed on 2026-07-21 — `@prerenderer/webpack-plugin@5.3.10` (mod 2024-05-01), `@prerenderer/renderer-puppeteer@1.2.4`, `react-snap@1.23.0` (mod 2022-05-15, stale), `react-helmet-async@3.0.0` (mod 2026-03-03).

## Package Legitimacy Audit

> slopcheck was not run in this session (offline research). All packages verified via npm registry + official GitHub (Tofandel/prerenderer monorepo). Puppeteer/prerenderer are long-established, high-download, source-backed packages. Planner SHOULD still gate the install behind a normal review; no `[SLOP]` indicators present.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `@prerenderer/webpack-plugin` | npm | pub 2024-05 (v5) | (part of @prerenderer monorepo) | github.com/Tofandel/prerenderer | not run | Approved — verify at install |
| `@prerenderer/renderer-puppeteer` | npm | mature | ~38.3K/wk | github.com/Tofandel/prerenderer | not run | Approved — verify at install |
| `puppeteer` | npm | mature | millions/wk | github.com/puppeteer/puppeteer | not run | Approved (⚠ postinstall downloads Chromium — expected) |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none
**Note:** `puppeteer` has a legitimate `postinstall` that downloads Chromium — this is expected behavior, not a slop signal. In CI set `PUPPETEER_SKIP_DOWNLOAD` only if a system Chrome is provided; otherwise allow the download and run with `--no-sandbox`.

## Architecture Patterns

### System Architecture Diagram

```
                         BUILD TIME (npm run build:prod)
  ┌──────────────────────────────────────────────────────────────────┐
  │  webpack --env mode=production                                     │
  │     │                                                              │
  │     ├─ DefinePlugin: __SITE_URL__, __GA4_MEASUREMENT_ID__,        │
  │     │                __GOOGLE_ADS_ID__, __ADS_SIGNUP_LABEL__       │
  │     ├─ HtmlWebpackPlugin → build/index.html (base meta/OG/JSON-LD) │
  │     ├─ CopyPlugin → robots.txt, sitemap.xml (.net), assets/       │
  │     └─ @prerenderer/webpack-plugin (renderer-puppeteer)            │
  │            for each route [/ , /voice-assistants,                  │
  │                            /speech-analytics, /pricing]:           │
  │              1. serve build/ on localhost                          │
  │              2. headless Chrome loads route                        │
  │              3. WAIT for document event 'seo-render-ready'         │
  │                 (fired after lazy chunk mount + i18n ready +       │
  │                  usePageMeta wrote title/desc/OG/JSON-LD/hreflang) │
  │              4. snapshot DOM → build/<route>/index.html            │
  │              5. postProcess: rewrite http://localhost → SITE_URL   │
  └──────────────────────────────────────────────────────────────────┘
                                   │  (flat static files)
                                   ▼
   Internet → Cloudflare → Nginx (try_files $uri /index.html)
                                   │
             ┌─────────────────────┴─────────────────────┐
             ▼                                            ▼
   Non-JS bot / social scraper                   Real browser (JS on)
   reads prerendered <head>:                     loads SPA bundle,
   title, description, canonical,                hydrates over snapshot,
   og:*, JSON-LD, hreflang  ✅                   gtag fires page_view +
                                                 funnel/Ads conversions
```

### Recommended Project Structure (files touched/added)
```
public/
├── index.html            # + description, robots, canonical, og:*, JSON-LD Organization; FIX viewport
├── robots.txt            # aipbx.ru → aipbx.net (Sitemap line)
├── sitemap.xml           # aipbx.ru → aipbx.net + <lastmod>
└── assets/og-default.png # NEW (1200×630) — D-05
src/shared/lib/seo/
├── usePageMeta.ts        # extend: i18n-driven, + JSON-LD, + hreflang, + __SITE_URL__ canonical
└── seoConfig.ts          # NEW (optional): route→JSON-LD/hreflang map, SITE_URL helper
src/shared/config/analytics/
└── initAnalytics.ts      # extend: gtag('config', AW-…); fireAdsConversion(send_to)
config/build/
├── buildPlugins.ts       # + PrerendererWebpackPlugin (prod only); + DefinePlugin vars
└── types/config.ts       # + siteUrl, googleAdsId, adsSignupLabel to buildOptions/buildEnv
webpack.config.ts         # read SITE_URL / GOOGLE_ADS_ID / ADS_SIGNUP_LABEL from env
public/locales/{en,ru}/main.json  # + meta.* keys, METRICS keys, demo CTA keys
```

### Pattern 1: `renderAfterDocumentEvent` render-ready gate (THE critical pattern)
**What:** Each landing page dispatches a document event once it is genuinely ready; the prerenderer snapshots only then.
**When to use:** Always here — lazy routes + async i18n + framer-motion mean a naive snapshot captures the `PageLoader` spinner or untranslated i18n keys.
```typescript
// In each landing page (or a shared useSeoRenderReady hook)
// Source pattern: Tofandel/prerenderer renderAfterDocumentEvent
const { t, ready } = useTranslation('main')
useEffect(() => {
  if (!ready) return
  // usePageMeta already wrote <title>/meta/JSON-LD/hreflang by now
  document.dispatchEvent(new Event('seo-render-ready'))
}, [ready])
```
```typescript
// config/build/buildPlugins.ts (prod branch)
import PrerendererWebpackPlugin from '@prerenderer/webpack-plugin'
new PrerendererWebpackPlugin({
  routes: ['/', '/voice-assistants', '/speech-analytics', '/pricing'],
  renderer: '@prerenderer/renderer-puppeteer',
  rendererOptions: {
    renderAfterDocumentEvent: 'seo-render-ready',
    timeout: 30000,                    // fail loud rather than hang
    headless: true,
    launchOptions: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
  },
  postProcess (renderedRoute) {
    // Safety net: rewrite any leaked localhost origin to the canonical site URL
    renderedRoute.html = renderedRoute.html
      .replace(/http:\/\/localhost:\d+/g, process.env.SITE_URL || 'https://aipbx.net')
  }
})
```

### Pattern 2: Host-independent canonical + hreflang via build-time `__SITE_URL__`
**What:** Never derive canonical/og:url/hreflang from `window.location.origin`.
**Why:** (a) prerender host is `localhost`; (b) `getDomainConfig()` reads `window.location.hostname` at runtime → during prerender it returns `DEFAULT_CONFIG` (region `eu`), and on a single build the origin is fixed anyway.
```typescript
// __SITE_URL__ injected by DefinePlugin, default 'https://aipbx.net'
const SITE_URL = typeof __SITE_URL__ !== 'undefined' ? __SITE_URL__ : 'https://aipbx.net'
const RU_SITE_URL = 'https://aipbx.ru'
// canonical:  `${SITE_URL}${path}`
// hreflang:   en → SITE_URL+path, ru → RU_SITE_URL+path, x-default → SITE_URL+path
```

### Pattern 3: JSON-LD injection that survives prerender
Inject via the meta helper (imperative `<script type="application/ld+json">` upsert in `document.head`), OR render inline in the page JSX (`dangerouslySetInnerHTML`, as the patch does). Either is captured by the snapshot. Prefer centralizing in the helper so EN/RU strings come from `t()` and there is a single source of truth. Use `SoftwareApplication` per page + a site-level `Organization` in `index.html`.

### Anti-Patterns to Avoid
- **Hardcoding gtag in `index.html`** (patch does this): loads GA4+Ads on *every* domain incl. aipbx.ru, duplicates the tag vs. `initAnalytics`, and can't be turned off per environment. Extend `initAnalytics` instead.
- **`window.location.origin` for canonical/hreflang:** wrong under prerender and single-build. Use `__SITE_URL__`.
- **`renderAfterTime` (fixed delay):** flaky; use `renderAfterDocumentEvent`.
- **Applying the patch verbatim:** overwrites RU meta strings and hardcodes RU `METRICS` (violates D-01/D-02).
- **Enabling GA4 Enhanced-Measurement history page_views AND firing manual page_view:** double-counts. Pick one (see Analytics section).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Snapshotting routes to static HTML | Custom puppeteer post-build script | `@prerenderer/webpack-plugin` | Handles serving, route iteration, render-wait, HtmlWebpackPlugin integration, HTML rewrite hook |
| Waiting for "page ready" | `setTimeout`/polling in a script | `renderAfterDocumentEvent` | Deterministic; no race with lazy chunk + i18n |
| OG image | Hand-drawn one-off | 1200×630 PNG (Canva/Figma/`sharp`/`@vercel/og`-style template) | Correct dimensions + <8MB, `og:image:width/height` set; social scrapers need absolute URL |
| sitemap for many routes | Manual XML editing forever | Build-time generator from a routes manifest (optional, Phase 4) | Keeps `.net`/`.ru` in sync via env; for now static `.net` is fine |
| Analytics event plumbing | New ad-hoc gtag calls | Existing `trackEvent()` / `trackOnboardingEvent()` | Already GA4+Metrika aware, strips null params, unit-tested |

**Key insight:** The hard part of SPA SEO is not "which meta to write" — it's guaranteeing the meta exists in the served HTML *before* JS runs. That is a build/prerender concern, and rolling it by hand reintroduces exactly the lazy-chunk/i18n races the plugin already solves.

## Runtime State Inventory

> Domain-swap phase (aipbx.ru → aipbx.net strings + tracking IDs). Grep finds files; below are the non-file/runtime concerns.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no DB/datastore stores the domain string as a key. `.net` vs `.ru` is resolved at runtime from `window.location.hostname` (`getDomainConfig`). | None |
| Live service config | **Google Search Console + Bing Webmaster:** aipbx.net property must be verified and sitemap submitted (founder-led, external). **Google Ads console:** conversion action "Signup - aipbx.net" already created (label `-B6_CK72wtMcEIyDxKA-` exists) — founder-led. **Cloudflare/Nginx:** must serve prerendered `/<route>/index.html` (confirm `try_files`/routing for the 4 static paths). | Manual (founder) + verify Nginx serves nested index.html |
| OS-registered state | None. | None ("None — no scheduled tasks/services embed the domain") |
| Secrets/env vars | New build-time env vars needed: `SITE_URL`, `GA4_MEASUREMENT_ID` (=`G-G1KZQCKP5D`), `GOOGLE_ADS_ID` (=`AW-16711221644`), `ADS_SIGNUP_LABEL` (=`-B6_CK72wtMcEIyDxKA-`). `GA4_MEASUREMENT_ID` + `YANDEX_METRIKA_ID` already read in `webpack.config.ts` but are empty today → analytics currently inert. Add the new vars to `.env.example` + deploy env. | Add env vars; document in `.env.example` |
| Build artifacts | Prerendered `build/<route>/index.html` are new outputs — ensure they are deployed and served (not shadowed by SPA `index.html` fallback). | Verify deploy copies nested HTML |

**The canonical question:** After code is updated, what still points at `.ru`? → `public/sitemap.xml` (6 URLs), `public/robots.txt` (Sitemap line). Both are static and must be edited to `.net` (D-03). External: GSC/Ads/analytics properties (founder).

## Common Pitfalls

### Pitfall 1: Prerender captures the `PageLoader` spinner (lazy routes)
**What goes wrong:** Landing pages are `React.lazy`; a snapshot taken before the chunk resolves freezes `<Suspense fallback={<PageLoader/>}>`.
**Why:** puppeteer's default "load" fires before the dynamic import + i18n fetch complete.
**How to avoid:** `renderAfterDocumentEvent: 'seo-render-ready'`, dispatched from the page after `ready` (i18n) and mount.
**Warning signs:** Prerendered HTML contains the loader markup / no `<h1>`.

### Pitfall 2: Untranslated i18n keys in the snapshot (async http-backend)
**What goes wrong:** `i18next-http-backend` fetches `/locales/en/main.json` asynchronously; a premature snapshot shows raw keys (`SpeechAnalyticsPage.HeroTitle`) or the English fallback of missing keys.
**Why:** i18n isn't ready at first paint.
**How to avoid:** Gate the render-ready event on `useTranslation().ready`. (Optionally preload/bundle the `main` namespace via `resources`/`addResourceBundle` for extra determinism — but the `ready` gate is sufficient.)
**Warning signs:** grep of prerendered HTML shows dotted i18n keys.

### Pitfall 3: Wrong canonical/og:url/hreflang (localhost or wrong region)
**What goes wrong:** `usePageMeta` uses `window.location.origin` → prerendered canonical = `http://localhost:PORT/...`; and `getDomainConfig()` returns `eu`/default during prerender.
**How to avoid:** Build-time `__SITE_URL__` (Pattern 2) + `postProcess` localhost rewrite as a safety net.
**Warning signs:** `<link rel="canonical" href="http://localhost...">` in `build/`.

### Pitfall 4: framer-motion `opacity:0` frozen into HTML
**What goes wrong:** Sections use `initial="hidden"` (opacity:0, y:30) with `whileInView`; the snapshot captures inline `opacity:0` on below-the-fold blocks.
**Impact:** Text is still in the DOM (Google indexes it), but (a) social preview screenshots could look blank and (b) users with JS disabled see hidden content.
**How to avoid:** Accept for SEO (text present); for robustness consider a CSS fallback (`.LandingPage [style*="opacity:0"] { opacity:1 }` under a `no-js`/prerender class) or reduce reliance on `whileInView` for the hero (hero already uses `animate="visible"`, so it's fine). Verify `<h1>`/description are readable in the snapshot.
**Warning signs:** Everything below hero has `style="opacity:0"` and no `no-js` fallback.

### Pitfall 5: GA4 page_view double-counting in the SPA
**What goes wrong:** GA4 `config` auto-sends a page_view on load; add manual route-change page_views AND enable Enhanced Measurement history events → duplicates.
**How to avoid:** Choose one model. Recommended: `gtag('config', GA4, { send_page_view: false })` + a `useLocation` effect firing `gtag('event','page_view', {...})` on every route change (incl. first). Keeps it code-owned and portable to Metrika later.
**Warning signs:** 2× page_view in GA4 DebugView per navigation.

### Pitfall 6: Missing `og:image` file / non-absolute URL
**What goes wrong:** `usePageMeta` points `og:image` at `/assets/og-default.png` which doesn't exist (D-05), and a relative URL is invalid for scrapers.
**How to avoid:** Create the 1200×630 PNG; emit an **absolute** `${SITE_URL}/assets/og-default.png`; set `og:image:width`/`height`/`og:image:alt`.

### Pitfall 7: EU + Google Ads without Consent Mode (compliance)
**What goes wrong:** aipbx.net is region `eu`. Running Google Ads remarketing/personalization + GA4 in the EEA without **Consent Mode v2** violates Google's EU user consent policy and can degrade Ads measurement.
**How to avoid:** Flag to founder. Minimal: set default `gtag('consent','default', {...'denied'})` + a consent banner updating to granted. `[ASSUMED — not in CONTEXT; founder decision]`. At minimum document it in the audit (D-11) as a prioritized recommendation; full consent UI may be a follow-up phase.
**Warning signs:** Ads/GA4 flags "consent not configured for EEA."

## Code Examples

### Extended `usePageMeta` (i18n-driven + JSON-LD + hreflang + canonical)
```typescript
// src/shared/lib/seo/usePageMeta.ts (extended shape)
export interface PageMetaOptions {
  title: string            // pass t('SpeechAnalyticsPage.meta.title')
  description: string      // pass t('SpeechAnalyticsPage.meta.description')
  path?: string
  ogImage?: string
  jsonLd?: Record<string, unknown>   // SoftwareApplication per page
}
const SITE_URL = typeof __SITE_URL__ !== 'undefined' ? __SITE_URL__ : 'https://aipbx.net'
const RU_SITE_URL = 'https://aipbx.ru'

function upsertHreflang (lng: string, href: string) { /* upsert <link rel=alternate hreflang> */ }
function upsertJsonLd (data: Record<string, unknown>) { /* upsert <script type=application/ld+json id=page-jsonld> */ }

export function setPageMeta ({ title, description, path, ogImage, jsonLd }: PageMetaOptions) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  document.title = fullTitle
  upsertMeta('name', 'description', description)
  upsertMeta('property', 'og:title', fullTitle)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:image', ogImage ? `${SITE_URL}${ogImage}` : `${SITE_URL}${DEFAULT_OG_IMAGE}`)
  if (path) {
    upsertCanonical(`${SITE_URL}${path}`)
    upsertMeta('property', 'og:url', `${SITE_URL}${path}`)
    upsertHreflang('en', `${SITE_URL}${path}`)
    upsertHreflang('ru', `${RU_SITE_URL}${path}`)
    upsertHreflang('x-default', `${SITE_URL}${path}`)
  }
  if (jsonLd) upsertJsonLd(jsonLd)
}
```
```typescript
// usage in SpeechAnalyticsLandingPage.tsx (D-01)
const { t, ready } = useTranslation('main')
usePageMeta({
  title: t('SpeechAnalyticsPage.meta.title'),
  description: t('SpeechAnalyticsPage.meta.description'),
  path: '/speech-analytics',
  jsonLd: { '@context':'https://schema.org', '@type':'SoftwareApplication',
            name: t('SpeechAnalyticsPage.meta.schemaName'), /* … */ }
})
```

### METRICS → i18n (D-08) — keep color in code, move name to i18n
```typescript
const METRICS = [
  { key: 'greetingQuality', color: '#22c55e' },
  { key: 'scriptAdherence', color: '#f59e0b' },
  // …
]
// render: {t(`SpeechAnalyticsPage.metrics.${m.key}`)}
// en/main.json: "metrics": { "greetingQuality": "Greeting quality", … }
// ru/main.json: "metrics": { "greetingQuality": "Качество приветствия", … }
```

### Extend `initAnalytics` for Ads + conversion (D-06/D-07)
```typescript
// src/shared/config/analytics/initAnalytics.ts
const adsId = typeof __GOOGLE_ADS_ID__ !== 'undefined' ? __GOOGLE_ADS_ID__ : ''
// after GA4 config:
if (adsId && window.gtag) {
  window.gtag('config', adsId)               // second config = Google Ads
}
export function fireAdsConversion (label: string, params: Record<string, unknown> = {}) {
  const adsId = typeof __GOOGLE_ADS_ID__ !== 'undefined' ? __GOOGLE_ADS_ID__ : ''
  if (adsId && window.gtag) window.gtag('event', 'conversion', { send_to: `${adsId}/${label}`, ...params })
}
```
```typescript
// useSignupData.ts — replace patch's fireConversionEvent() at all 3 success handlers
import { trackEvent } from '@/shared/config/analytics/initAnalytics'
import { fireAdsConversion } from '@/shared/config/analytics/initAnalytics'
// on google/telegram/email-activation success:
trackEvent('signup_complete', { method: 'google' })                 // GA4 funnel (D-06)
fireAdsConversion(__ADS_SIGNUP_LABEL__ /* '-B6_CK72wtMcEIyDxKA-' */) // Ads conversion (D-07)
```

### SPA page_view on route change (Pitfall 5)
```typescript
// e.g. src/app/providers/router or App
const location = useLocation()
useEffect(() => {
  const ga4 = typeof __GA4_MEASUREMENT_ID__ !== 'undefined' ? __GA4_MEASUREMENT_ID__ : ''
  if (ga4 && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: location.pathname,
      page_location: `${SITE_URL}${location.pathname}`,
      page_title: document.title
    })
  }
}, [location.pathname])
// with gtag('config', GA4, { send_page_view: false }) in initAnalytics
```

### index.html base meta + viewport fix (D-08)
```html
<!-- FIX: remove user-scalable=no, maximum-scale=1.0 (Lighthouse a11y [aria]/[best-practices]) -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="AI PBX — AI voice assistant & speech analytics for business…">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://aipbx.net/">
<meta property="og:title" content="AI PBX — AI Voice Assistant & Speech Analytics">
<meta property="og:image" content="https://aipbx.net/assets/og-default.png">
<!-- Organization JSON-LD site-wide; per-page SoftwareApplication injected by usePageMeta -->
```

## Analytics Wiring Map (D-06 funnel — where each event fires)

| Funnel event (GTM plan) | Current state | Fire at | Notes |
|-------------------------|---------------|---------|-------|
| `signup_complete` | **Missing** (patch fires generic `conversion` only) | `useSignupData.ts` — Google, Telegram, and email-activation `.then()` success (3 sites) | Also call `fireAdsConversion(ADS_SIGNUP_LABEL)` here (D-07). RTK Query `.unwrap().then()` is the reliable success point. |
| `assistant_created` | **Already emitted** ✅ | `features/Onboarding/ui/steps/BusinessTypeStep.tsx:164,215` via `trackOnboardingEvent('assistant_created')` | Confirm it reaches GA4 (i.e. GA4 build env set). No new firing site needed; may add an Ads conversion if founder creates that action. |
| `first_call` | **Emitted as `playground_call_success`** ⚠ | `pages/Playground/ui/Playground/Playground.tsx:47` | **Name mismatch** — reconcile: either emit `first_call` alongside, or standardize. Decide with founder; keep both for continuity. |
| `payment_success` | **Missing** | Payment success path — `features/CheckoutByRobokassa/…`, `entities/Payment/api/paymentApi.ts`, `pages/PaymentPage`, `BillingPage` | ⚠ **Touches billing/payment** — `.cursor/rules` forbids touching `billing/` without an explicit phase. Prefer a non-invasive fire: on the post-payment return/success route or a top-up-success callback that already exists, not inside billing core logic. Flag for planner. |

**Reusability for Metrika (D-07):** All events go through `trackEvent()` which already dual-dispatches to `ym('reachGoal', …)` when `__YANDEX_METRIKA_ID__` is set → Phase 4 gets the funnel for free. Ads `conversion` is Google-only (correct).

## sitemap.xml / robots.txt strategy (D-03, single-build)

**Constraint:** one webpack build → one `build/` → one sitemap/robots (copied by `copy-webpack-plugin`). Cannot serve `.net` and `.ru` variants from the same build simultaneously.

**Recommended (this phase):** Static edit `public/sitemap.xml` + `public/robots.txt` from `aipbx.ru` → `aipbx.net` (add `<lastmod>` per patch). Simplest, matches D-03, zero risk. Add `/` , `/pricing`, `/speech-analytics`, `/voice-assistants` (public, `Allow`); keep app routes `Disallow`.

**Forward-looking (note for Phase 4, do not build now unless trivial):** Replace the two static files with a small build-time generator (prebuild script or `webpack.DefinePlugin` + template) that reads `SITE_URL`/region env and emits the correct domain + hreflang `<xhtml:link>` alternates in the sitemap. This lets a `.ru` build regenerate without editing files. Keep it env-driven to preserve the single-build model (one build per domain deploy).

**Sitemap hreflang (nice-to-have):** add `<xhtml:link rel="alternate" hreflang="ru" href="https://aipbx.ru/…">` per URL to reinforce the en↔ru pairing (D-02).

## Google Ads Campaign Asset Structure (D-10 deliverable shape)

The artifact (e.g. `.planning/phases/09-…/09-ADS-ASSETS.md`) should contain, for the EN/.net segment:

- **Account/campaign layout:** 1 Search campaign (EN), split into ad groups by intent theme; note Performance Max as optional later.
- **Ad groups (theme → tight keyword cluster):**
  1. *AI Voice Assistant* → "ai voice assistant", "ai phone agent", "automated phone answering ai", "ai receptionist" → LP `/voice-assistants`
  2. *Asterisk / SIP voice bot* → "asterisk ai voice bot", "sip ai agent", "webrtc voice assistant" → `/voice-assistants`
  3. *Speech Analytics* → "speech analytics software", "call center speech analytics", "call recording analysis ai" → `/speech-analytics`
  4. *Call QA / operator scoring* → "call center qa software", "agent call scoring", "conversation intelligence" → `/speech-analytics`
- **RSAs (per ad group):** ≥8–15 headlines (≤30 chars) + ≥4 descriptions (≤90 chars), pinned brand headline optional. Include benefit + keyword-insertion variants + CTA ("Start free", "Book a demo").
- **Sitelink/callout/structured-snippet assets:** Pricing, Docs, Voice Assistants, Speech Analytics; callouts ("SIP/Asterisk ready", "API & webhooks", "24/7 automation").
- **Negative keywords:** "free", "jobs", "salary", "tutorial", "open source", "resume", "meaning", "wikipedia", "phantom", brand competitors as needed.
- **Conversion mapping:** primary = `signup_complete` (Ads action label `-B6_CK72wtMcEIyDxKA-`); secondary/observation = `assistant_created`, `first_call`, `payment_success` (import from GA4 or create Ads actions — founder).
- **Landing/quality-bot note:** publication requires the Ads bot to read a rendered LP → depends on the prerender deliverable. Match ad copy keywords to prerendered `<h1>`/meta for Quality Score.
- **Budget/bidding:** leave as founder input (Maximize conversions / tCPA placeholder). Draft only.

## Lighthouse / Technical-SEO Audit (D-11 deliverable shape)

**Artifact** (e.g. `09-SEO-AUDIT.md`) — structure: Executive summary → per-page findings table → prioritized recommendations (P0/P1/P2) → verification method.

**Concrete current issues to document (verified in codebase):**
| # | Issue | Evidence | Severity | Fix in phase? |
|---|-------|----------|----------|----------------|
| 1 | Meta injected client-side only → bots see empty `#root` | `usePageMeta` in `useEffect`; `index.html` has no description/OG/JSON-LD | P0 | Yes (prerender) |
| 2 | `index.html` missing description, canonical, OG, JSON-LD | `public/index.html` (title only) | P0 | Yes |
| 3 | Viewport blocks zoom (`user-scalable=no, maximum-scale=1.0`) → a11y penalty | `public/index.html:5-6` | P1 | Yes (D-08) |
| 4 | `og:image` → `/assets/og-default.png` missing + relative | `usePageMeta.ts:11`; file absent | P1 | Yes (D-05) |
| 5 | sitemap/robots point at `aipbx.ru` | `public/sitemap.xml`, `public/robots.txt` | P1 | Yes (D-03) |
| 6 | Landing meta hardcoded RU; no hreflang | landing `.tsx` `usePageMeta` calls | P0/P1 | Yes (D-01/02) |
| 7 | Hardcoded RU `METRICS` array | `SpeechAnalyticsLandingPage.tsx:25-35` | P2 | Yes (D-08) |
| 8 | Analytics inert (GA4/Ads env empty; no funnel/Ads) | `webpack.config.ts:34`, `initAnalytics` | P0 | Yes (D-06/07) |
| 9 | No Consent Mode v2 (EU region) | region `eu` in `getDomainConfig` | P1 (compliance) | Flag / recommend |
| 10 | Images lack width/height (CLS) / some not lazy | landing `<img>` (many `loading="lazy"` ✅, no dims) | P2 | Recommend |

**Measure:** Lighthouse (Performance/SEO/Best-Practices/Accessibility) on prerendered pages; Rich Results Test for JSON-LD; Facebook/LinkedIn/Telegram debuggers for OG; PageSpeed Insights (field + lab).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `react-snap` for CRA prerender | `@prerenderer/webpack-plugin` (Tofandel fork) | react-snap stalled ~2020; React 18 (2022) broke it | Must not use react-snap on React 18 |
| Separate GA (analytics.js) + Ads tags | Single Google tag (gtag.js) with multiple `config` IDs | gtag.js consolidation | One snippet, `config` per ID (G- and AW-) |
| Auto page_view only | SPA manual `page_view` with `send_page_view:false` (or Enhanced Measurement history — pick one) | GA4 SPA guidance | Prevents skewed single-page metrics |
| Ads without consent (EEA) | Consent Mode v2 required for EEA personalization | 2024 | Compliance + measurement quality |

**Deprecated/outdated:** `react-snap` (unmaintained), `prerender-spa-plugin` v2 (PhantomJS), `react-helmet` (original, unmaintained) — and `react-helmet-async` 2.x is unmaintained; treat the npm `3.0.0` line as unverified provenance.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `@prerenderer/webpack-plugin` integrates cleanly with this custom webpack 5 config + `HtmlWebpackPlugin` and handles MUI/emotion + framer-motion snapshots without hydration breakage | Standard Stack / Patterns | If hydration mismatches, may need `no-js` CSS fallback or minor entry tweaks; spike recommended (Wave 0) |
| A2 | Gating render-ready on `useTranslation().ready` is sufficient for i18n determinism (vs. bundling `main` namespace) | Pitfall 2 | Untranslated snapshot; fallback = preload namespace via `resources` |
| A3 | `react-helmet-async@3.0.0` is a non-authoritative/forked release | Alternatives | Only matters if planner chooses helmet (not recommended) |
| A4 | Consent Mode v2 applies (aipbx.net = EEA target) and is a real compliance need | Pitfall 7 | Founder may target non-EEA / handle via CMP; treat as recommendation, not blocker |
| A5 | `payment_success` can be fired without editing billing core (via return route / existing success callback) | Analytics Wiring Map | If it requires touching `billing/`, needs explicit scope approval per `.cursor/rules` |
| A6 | Google Ads conversion action label `-B6_CK72wtMcEIyDxKA-` is valid/active for signup | D-07 | Wrong label = no conversions recorded; verify in Ads console (founder) |
| A7 | Nginx serves nested prerendered `/<route>/index.html` (not shadowed by SPA fallback) | Runtime State | Bots get SPA shell not snapshot; verify deploy/try_files |

## Open Questions

1. **payment_success without touching billing** — Where is the post-top-up success signal reachable outside `billing/` core? Recommendation: fire from the payment *return/success route* component or an existing success callback; get planner/founder confirmation before editing any billing file. **(RESOLVED: the concrete candidate is `src/pages/PaymentPage/ui/PaymentPage.tsx`; it currently has no explicit success branch, so Plan 09-05 adds a blocking founder decision before wiring the event. The selected target must be this component's confirmed success branch or another explicitly named non-billing frontend return component; billing/ARI/accounting/payment API/checkout core remain excluded.)**
2. **first_call vs playground_call_success naming** — Standardize to GTM plan (`first_call`) or keep existing? Recommendation: emit `first_call` in addition (non-breaking) and align GA4 config. **(RESOLVED: emit `first_call` alongside the existing `playground_call_success` in `src/pages/Playground/ui/Playground/Playground.tsx`; retain the existing event for continuity.)**
3. **Consent Mode scope** — In-phase minimal default-consent + banner, or defer to a compliance phase? Recommendation: document in audit (D-11); implement default `consent` denied stub if cheap. **(RESOLVED: defer consent UI/default-consent implementation; document Consent Mode v2 as a prioritized P1 recommendation in `09-SEO-AUDIT.md`, preserving this phase's locked scope.)**
4. **Enhanced Measurement vs manual page_view** — Which is GA4 admin already set to? Recommendation: use code-owned manual page_view + `send_page_view:false` and disable history-based page changes to avoid double counts. **(RESOLVED: use code-owned manual `page_view` on route changes with GA4 `send_page_view:false`; the plan does not enable a second history-based page-view mechanism.)**
5. **Deploy/CI puppeteer** — Does the deploy runner allow Chromium download + `--no-sandbox`? If not, provision system Chrome + `PUPPETEER_EXECUTABLE_PATH`. **(RESOLVED: retain the blocking package/setup checkpoint in Plan 09-07; install Chromium when permitted, otherwise the founder supplies `PUPPETEER_EXECUTABLE_PATH` to a system Chrome and the configured `--no-sandbox` launch args remain.)**

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node/npm | build | ✓ (repo builds) | — | — |
| Webpack 5 + HtmlWebpackPlugin | prerender plugin | ✓ | `^5.75` / `^5.5` | — |
| Puppeteer/Chromium (build host + CI) | prerender at build | ✗ (not installed yet) | needs `^21+` | System Chrome via `PUPPETEER_EXECUTABLE_PATH`; else prerender step fails |
| `GA4_MEASUREMENT_ID` env | GA4 activation | ✗ (empty today) | set `G-G1KZQCKP5D` | Analytics stays inert if unset |
| `GOOGLE_ADS_ID` / `ADS_SIGNUP_LABEL` env | Ads conversion | ✗ (new) | `AW-16711221644` / `-B6_CK72wtMcEIyDxKA-` | Ads conversions won't fire if unset |
| Image tool for OG PNG | D-05 | ✓ (any) | — | Figma/Canva/`sharp` |

**Missing dependencies with no fallback:** Puppeteer at build time is required for prerender — must be installed/allowed in CI (or provide system Chrome).
**Missing dependencies with fallback:** Analytics env vars (inert until set); OG image (create with any tool).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest 29 + ts-jest + jsdom (`config/jest/jest.config.ts`); Cypress for e2e (optional) |
| Config file | `config/jest/jest.config.ts` |
| Quick run command | `npm run test:unit -- <pattern>` |
| Full suite command | `npm run test:unit` + `npm run lint:ts` |

### Phase Requirements → Test Map
| Req | Behavior | Test Type | Automated Command | Exists? |
|-----|----------|-----------|-------------------|---------|
| D-01 | `usePageMeta` writes i18n title/desc/OG/canonical/JSON-LD/hreflang into head | unit (jsdom) | `npm run test:unit -- usePageMeta` | ❌ Wave 0 |
| D-02 | hreflang en→.net, ru→.ru, x-default→.net using `__SITE_URL__` (not window.origin) | unit | `npm run test:unit -- usePageMeta` | ❌ Wave 0 |
| D-04 | Prerendered HTML contains `<title>`, meta description, JSON-LD, canonical, no `PageLoader`, no dotted i18n keys | integration (post-build grep) | `node scripts/verify-prerender.js` (grep `build/*/index.html`) | ❌ Wave 0 |
| D-06 | `signup_complete`/`payment_success` call `trackEvent`; Ads `send_to` fires | unit (mock gtag/trackEvent) | `npm run test:unit -- useSignupData` / `initAnalytics` | ❌ Wave 0 (pattern exists in `onboardingAnalytics.test.ts`) |
| D-07 | `initAnalytics` configs GA4 + Ads when env set; no-op when unset | unit | `npm run test:unit -- initAnalytics` | ❌ Wave 0 |
| D-08 | METRICS render from i18n (en+ru) | unit (render) | `npm run test:unit -- SpeechAnalytics` | ❌ Wave 0 |
| D-03 | sitemap/robots contain `aipbx.net`, no `aipbx.ru` | static assert | `node scripts/verify-prerender.js` (grep) | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run test:unit -- <touched module>` + `npm run lint:ts`
- **Per wave merge:** full `npm run test:unit`
- **Phase gate:** `build:prod` succeeds, prerender emits 4 nested `index.html`, `verify-prerender.js` green, Rich Results + OG debugger manual pass.

### Prerender verification (the key manual/automated check for D-04)
```bash
npm run build:prod
# assert each route produced static HTML with SEO content:
for r in "" voice-assistants speech-analytics pricing; do
  f="build/${r:+$r/}index.html"
  grep -q "<title>" "$f" && grep -q 'name="description"' "$f" \
    && grep -q 'application/ld+json' "$f" && grep -q 'rel="canonical"' "$f" \
    && ! grep -q 'PageLoader' "$f" || echo "FAIL: $f"
done
# conversion events fire WITHOUT a live Ads account:
#   jest: mock window.gtag; assert gtag('event','conversion',{send_to:'AW-…/label'}) called
#   manual: gtag debug via ?gtm_debug / GA4 DebugView + Google Tag Assistant
```

### Wave 0 Gaps
- [ ] `src/shared/lib/seo/usePageMeta.test.ts` — covers D-01/D-02 (head assertions in jsdom)
- [ ] `src/shared/config/analytics/initAnalytics.test.ts` — covers D-06/D-07 (mock gtag)
- [ ] `useSignupData` funnel test — assert `signup_complete` + Ads conversion on success
- [ ] `scripts/verify-prerender.js` — post-build grep gate (D-03/D-04)
- [ ] Prerender integration spike — confirm A1 (no hydration break with MUI/framer-motion/lazy)

## Security Domain

> `security_enforcement` not configured (treat as enabled). Low surface — client SEO/analytics, no new backend/auth. Key concerns:

| ASVS | Applies | Control |
|------|---------|---------|
| V5 Input Validation / Output Encoding | yes | JSON-LD is developer-authored (not user input) — safe; if any dynamic value ever enters JSON-LD, JSON-encode it. Landing `dangerouslySetInnerHTML` only for static schema strings. |
| V6 Cryptography | no | none |
| V14 Config | yes | Tracking IDs are public by design (client-side); no secrets exposed. Ensure `.env` build secrets (Stripe/Google client) are unaffected. |

| Pattern | STRIDE | Mitigation |
|---------|--------|-----------|
| Third-party script (gtag) supply chain | Tampering | Load from official `googletagmanager.com`; consider SRI/CSP `script-src` allowlist (note: gtag uses inline eval-ish patterns — CSP needs care) |
| PII in analytics events | Info disclosure | Do not send email/tokens as event params; `trackEvent` already coerces to strings — keep params non-PII |
| Consent (EEA) | Compliance | Consent Mode v2 (Pitfall 7) |

## Sources

### Primary (HIGH confidence)
- Codebase (read this session): `usePageMeta.ts`, `useSignupData.ts`, `initAnalytics.ts`, `onboardingAnalytics.ts(.test)`, `buildPlugins.ts`, `webpack.config.ts`, `getDomainConfig.ts`, `i18n.ts`, `index.tsx`, `routeConfig.tsx`, `AppRouter.tsx`, landing pages, `public/{index.html,sitemap.xml,robots.txt}`, `scripts/aipbx_seo.patch`, CONTEXT/PROJECT/GAPS/STATE, `.cursor/rules/*`.
- Tofandel/prerenderer (GitHub) + npm `@prerenderer/webpack-plugin`/`renderer-puppeteer` — renderer options, HtmlWebpackPlugin requirement.
- Google for Developers — gtag configure/reference (multiple `config` IDs, `send_page_view`), GA4 SPA measurement; Google Ads Help (Google tag for conversion, multi-account).
- npm registry (`npm view`, 2026-07-21) — version/date verification.

### Secondary (MEDIUM confidence)
- GitHub issue stereobooster/react-snap#573 + StackOverflow — react-snap React 18 incompatibility.

### Tertiary (LOW confidence)
- `react-helmet-async@3.0.0` provenance — unverified (flagged A3).
- Consent Mode v2 EEA applicability to this specific deployment — general guidance, founder to confirm (A4).

## Metadata

**Confidence breakdown:**
- Standard stack (prerender/gtag): HIGH — verified via npm + official docs + code.
- Architecture/patterns: HIGH — grounded in actual build config + route/i18n facts.
- Analytics wiring: HIGH — existing events located in code with line refs.
- Ads asset guidance: MEDIUM — best-practice structure, founder tailors specifics.
- Consent Mode / payment_success placement: MEDIUM — flagged assumptions.

**Research date:** 2026-07-21
**Valid until:** ~2026-08-20 (30 days; prerender/gtag ecosystem stable, but re-check puppeteer/plugin versions at install).
