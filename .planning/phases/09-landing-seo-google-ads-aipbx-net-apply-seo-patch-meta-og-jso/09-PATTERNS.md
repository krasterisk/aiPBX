# Phase 9: Landing SEO + Google Ads (aipbx.net) - Pattern Map

**Mapped:** 2026-07-21
**Files analyzed:** 14 (create/modify)
**Analogs found:** 13 / 14

All new code has a strong in-repo analog. This is a domain-swap + extend-existing
phase, not a greenfield build. The dominant instruction to the planner:
**extend existing modules in place** (`usePageMeta`, `initAnalytics`), **do not
introduce parallel systems** (no react-helmet, no hardcoded gtag in index.html).

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/shared/lib/seo/usePageMeta.ts` (modify) | utility (hook) | transform (opts→DOM head) | *itself* — extend | exact (self) |
| `src/shared/lib/seo/usePageMeta.test.ts` (new) | test | transform | `src/features/Onboarding/lib/onboardingAnalytics.test.ts` | role-match (jsdom head) |
| `src/shared/config/analytics/initAnalytics.ts` (modify) | config/utility | event-driven (gtag) | *itself* — extend | exact (self) |
| `src/shared/config/analytics/initAnalytics.test.ts` (new) | test | event-driven | `src/features/Onboarding/lib/onboardingAnalytics.test.ts` | exact |
| `config/build/buildPlugins.ts` (modify) | config (build) | build-time | *itself* — DefinePlugin + prod branch | exact (self) |
| `webpack.config.ts` (modify) | config (build) | build-time env read | *itself* — env var wiring | exact (self) |
| `config/build/types/config.ts` (modify) | config (types) | — | *itself* — buildOptions/buildEnv fields | exact (self) |
| `src/app/types/global.d.ts` (modify) | config (types) | — | *itself* — `declare const __X__` block | exact (self) |
| `public/index.html` (modify) | config (template) | static | *itself* — head tags | exact (self) |
| `public/sitemap.xml` (modify) | config (static asset) | static | *itself* — `.ru`→`.net` | exact (self) |
| `public/robots.txt` (modify) | config (static asset) | static | *itself* — `.ru`→`.net` | exact (self) |
| `public/assets/og-default.png` (new) | asset (binary) | static | — (no analog: 1200×630 PNG) | no analog |
| `src/pages/*LandingPage.tsx` + `MainPage.tsx` (modify) | component (page) | request-response | `MainPage.tsx` domain-conditional `usePageMeta` | exact |
| `public/locales/{en,ru}/main.json` (modify) | config (i18n) | static | existing `main` namespace keys | exact |
| `src/features/Auth/lib/hooks/useSignupData.ts` (modify) | hook | event-driven | *itself* — `.unwrap().then()` success sites | exact (self) |
| `scripts/verify-prerender.js` (new) | test (script) | file-I/O (grep build/) | `scripts/clear-cache.js` (CJS + `fs`) | role-match |

> RESEARCH also mentions optional `src/shared/lib/seo/seoConfig.ts` (route→JSON-LD/hreflang
> map). If created, its analog is a plain TS constants/config module colocated in
> `shared/lib/seo/` — same FSD slice as `usePageMeta.ts`. No dedicated analog needed;
> it is a static data map.

---

## Pattern Assignments

### `src/shared/lib/seo/usePageMeta.ts` (utility hook — EXTEND, do not rewrite)

**Analog:** itself (`src/shared/lib/seo/usePageMeta.ts`). Keep the existing
`upsertMeta`/`upsertCanonical` imperative-upsert idiom; add sibling `upsertHreflang`
and `upsertJsonLd` helpers in the same style; swap `window.location.origin` → `SITE_URL`.

**Existing imperative upsert idiom to replicate** (lines 13-38) — new `upsertHreflang`/`upsertJsonLd` must match this exact create-or-update shape:

```13:38:src/shared/lib/seo/usePageMeta.ts
function upsertMeta (attr: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attr}="${key}"]`
  const existing = document.head.querySelector(selector)
  let el: HTMLMetaElement
  if (existing instanceof HTMLMetaElement) {
    el = existing
  } else {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertCanonical (href: string): void {
  const existing = document.head.querySelector('link[rel="canonical"]')
  let el: HTMLLinkElement
  if (existing instanceof HTMLLinkElement) {
    el = existing
  } else {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}
```

**Origin to REPLACE** (lines 40-55) — the `window.location.origin` here is the exact
bug from Pitfall 3; replace with build-time `SITE_URL` (default `'https://aipbx.net'`):

```40:55:src/shared/lib/seo/usePageMeta.ts
export function setPageMeta ({ title, description, path, ogImage }: PageMetaOptions): void {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  document.title = fullTitle
  upsertMeta('name', 'description', description)
  upsertMeta('property', 'og:title', fullTitle)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:image', ogImage || DEFAULT_OG_IMAGE)

  if (path) {
    const origin = window.location.origin
    upsertCanonical(`${origin}${path}`)
    upsertMeta('property', 'og:url', `${origin}${path}`)
  }
}
```

**Constant declaration idiom to follow** (lines 10-11) — add `SITE_URL`/`RU_SITE_URL` as module consts next to these:

```10:11:src/shared/lib/seo/usePageMeta.ts
const SITE_NAME = 'AI PBX'
const DEFAULT_OG_IMAGE = '/assets/og-default.png'
```

**Hook effect + dep-array idiom** (lines 57-61) — when `jsonLd`/`ogImage` fields are added to `PageMetaOptions`, extend this dep array:

```57:61:src/shared/lib/seo/usePageMeta.ts
export function usePageMeta (options: PageMetaOptions): void {
  useEffect(() => {
    setPageMeta(options)
  }, [options.title, options.description, options.path, options.ogImage])
}
```

---

### `src/shared/config/analytics/initAnalytics.ts` (config/utility — EXTEND)

**Analog:** itself. The build-env-read idiom, the `window.gtag` guard, and the
dual-dispatch `trackEvent` are all already present. Add a second `gtag('config', adsId)`
and a `fireAdsConversion(label, params)` export in the same style.

**Build-env read + gtag config idiom to replicate** (lines 36-45) — the Ads
`config` goes right after the GA4 `config`; guard on `window.gtag` identically:

```36:45:src/shared/config/analytics/initAnalytics.ts
  if (ga4Id) {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`)
    window.dataLayer = window.dataLayer || []
    window.gtag = function (...args: unknown[]) {
      window.dataLayer?.push(args)
    }
    window.gtag('js', new Date())
    window.gtag('config', ga4Id)
  }
```

**`typeof __X__ !== 'undefined'` env-guard idiom** (lines 20-21) — read
`__GOOGLE_ADS_ID__` / `__ADS_SIGNUP_LABEL__` exactly this way:

```20:21:src/shared/config/analytics/initAnalytics.ts
  const metrikaId = typeof __YANDEX_METRIKA_ID__ !== 'undefined' ? __YANDEX_METRIKA_ID__ : ''
  const ga4Id = typeof __GA4_MEASUREMENT_ID__ !== 'undefined' ? __GA4_MEASUREMENT_ID__ : ''
```

**Event-dispatch guard idiom** (lines 47-58) — `fireAdsConversion` should mirror
the `if (id && window.gtag)` guard of `trackEvent`; keep GA4-only vs Metrika split
(Ads conversion is Google-only per RESEARCH):

```47:58:src/shared/config/analytics/initAnalytics.ts
export function trackEvent (name: string, params?: Record<string, string | number>): void {
  const metrikaId = typeof __YANDEX_METRIKA_ID__ !== 'undefined' ? __YANDEX_METRIKA_ID__ : ''
  const ga4Id = typeof __GA4_MEASUREMENT_ID__ !== 'undefined' ? __GA4_MEASUREMENT_ID__ : ''

  if (metrikaId && window.ym) {
    window.ym(Number(metrikaId), 'reachGoal', name, params)
  }

  if (ga4Id && window.gtag) {
    window.gtag('event', name, params)
  }
}
```

The `Window.gtag`/`dataLayer` global augmentation already exists (lines 1-7) — no
new `declare global` needed for gtag.

---

### `src/shared/config/analytics/initAnalytics.test.ts` & `usePageMeta.test.ts` (tests)

**Analog:** `src/features/Onboarding/lib/onboardingAnalytics.test.ts` — this is the
canonical test convention in the repo. Copy its structure verbatim.

**Full test-file skeleton to copy** (mock module, cast to `MockedFunction`, `clearAllMocks`, nested `describe`, `it.each`):

```1:41:src/features/Onboarding/lib/onboardingAnalytics.test.ts
import { trackEvent } from '@/shared/config/analytics/initAnalytics'
import { trackOnboardingEvent, trackOnboardingStepEvent } from './onboardingAnalytics'

jest.mock('@/shared/config/analytics/initAnalytics', () => ({
  trackEvent: jest.fn()
}))

const mockTrackEvent = trackEvent as jest.MockedFunction<typeof trackEvent>

describe('onboardingAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('trackOnboardingEvent', () => {
    it('calls trackEvent with name only when no params', () => {
      trackOnboardingEvent('onboarding_started')
      expect(mockTrackEvent).toHaveBeenCalledWith('onboarding_started')
    })
    // ...
```

**`it.each` table idiom for event-name coverage** (lines 53-71) — reuse for asserting the funnel event names (`signup_complete`, `payment_success`, etc.):

```53:71:src/features/Onboarding/lib/onboardingAnalytics.test.ts
  describe('event name constants (D-13)', () => {
    const expectedEvents = [
      'onboarding_started',
      // ...
    ]

    it.each(expectedEvents)('accepts event name: %s', (eventName) => {
      trackOnboardingEvent(eventName)
      expect(mockTrackEvent).toHaveBeenCalledWith(eventName)
    })
  })
```

**Test-specific guidance for the two NEW tests:**
- `initAnalytics.test.ts` — do NOT mock `initAnalytics` itself; instead stub
  `window.gtag = jest.fn()` (and `window.dataLayer`), define the `__GOOGLE_ADS_ID__`
  / `__GA4_MEASUREMENT_ID__` / `__ADS_SIGNUP_LABEL__` globals per-test (they are
  `declare const`, so set via `(global as any).__GOOGLE_ADS_ID__ = ...` or a
  `jest.config` `globals` entry), then assert `window.gtag` was called with
  `('config', 'AW-...')` and `('event','conversion',{send_to:'AW-.../label'})`.
  Cover the no-op-when-unset branch (D-07).
- `usePageMeta.test.ts` — jsdom is already the test env; call `setPageMeta({...})`
  and assert against `document.head.querySelector('meta[name="description"]')`,
  `link[rel="canonical"]`, `link[rel="alternate"][hreflang="en"]`,
  `script[type="application/ld+json"]`. Assert canonical uses `https://aipbx.net`
  (SITE_URL) and NOT `localhost`/`window.origin` (D-01/D-02).

> **Global define in tests:** the build `__X__` constants are injected by DefinePlugin
> at build, so under jest they are undefined unless set. Check `config/jest/jest.config.ts`
> `globals` for how `__GA4_MEASUREMENT_ID__` etc. are provided; add the new ones there
> or set/reset them in `beforeEach`/`afterEach`.

---

### `config/build/buildPlugins.ts` (build config — EXTEND DefinePlugin + prod branch)

**Analog:** itself. Add the three new `__SITE_URL__`/`__GOOGLE_ADS_ID__`/`__ADS_SIGNUP_LABEL__`
keys to the existing `DefinePlugin`, and push `PrerendererWebpackPlugin` into the
existing `if (isProd)` block (after `CopyPlugin`, so `build/` static files exist).

**DefinePlugin injection idiom** (lines 22-35) — add new `JSON.stringify(...)` entries here:

```22:35:config/build/buildPlugins.ts
    new webpack.DefinePlugin({
      __IS_DEV__: JSON.stringify(isDev),
      __API__: JSON.stringify(apiUrl),
      __WS__: JSON.stringify(wsUrl),
      __PROJECT__: JSON.stringify(project),
      __STATIC__: JSON.stringify(staticUrl),
      __GOOGLE_CLIENT_ID__: JSON.stringify(googleClientId),
      __TG_BOT_ID__: JSON.stringify(tgBotId),
      __STRIPE_PUBLISHABLE_KEY__: JSON.stringify(stripePublishableKey),
      __SENTRY_DSN__: JSON.stringify(sentryDsn),
      __SENTRY_ENVIRONMENT__: JSON.stringify(sentryEnvironment),
      __YANDEX_METRIKA_ID__: JSON.stringify(yandexMetrikaId),
      __GA4_MEASUREMENT_ID__: JSON.stringify(ga4MeasurementId)
    }),
```

**Prod-only plugin push idiom + existing CopyPlugin** (lines 59-75) — `PrerendererWebpackPlugin`
goes in this `isProd` block; note `robots.txt`/`sitemap.xml` are already copied here
(no CopyPlugin change needed for D-03, just edit the source files):

```59:75:config/build/buildPlugins.ts
  if (isProd) {
    plugins.push(new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: true
    }))
    plugins.push(new CopyPlugin({
      patterns: [
        { from: paths.locales, to: paths.buildLocales },
        { from: paths.favicon, to: paths.build },
        { from: 'public/robots.txt', to: paths.build, noErrorOnMissing: true },
        { from: 'public/sitemap.xml', to: paths.build, noErrorOnMissing: true },
        { from: paths.assets, to: paths.buildAssets },
        { from: 'public/docs', to: 'docs', noErrorOnMissing: true }
      ]
    }))
  }
```

**Destructuring signature idiom** (lines 11-14) — new build options are destructured from `buildOptions` here:

```11:14:config/build/buildPlugins.ts
export function buildPlugins ({
  paths, isDev, apiUrl, wsUrl, project, staticUrl, googleClientId, tgBotId, stripePublishableKey,
  sentryDsn, sentryEnvironment, yandexMetrikaId, ga4MeasurementId
}: buildOptions): webpack.WebpackPluginInstance[] {
```

---

### `webpack.config.ts` (build config — read new env vars)

**Analog:** itself. Every env var follows the same `env?.x || process.env.X || 'default'`
read-then-pass-to-buildWebpackConfig pattern.

**Env-read idiom** (lines 31-34) — add `siteUrl`, `googleAdsId`, `adsSignupLabel` reads here (default `siteUrl` to `'https://aipbx.net'`):

```31:34:webpack.config.ts
  const sentryDsn = process.env.SENTRY_DSN || ''
  const sentryEnvironment = process.env.SENTRY_ENVIRONMENT || mode
  const yandexMetrikaId = process.env.YANDEX_METRIKA_ID || ''
  const ga4MeasurementId = process.env.GA4_MEASUREMENT_ID || ''
```

**Pass-through to buildWebpackConfig idiom** (lines 36-52) — add the new fields to this object:

```36:52:webpack.config.ts
  return buildWebpackConfig({
    mode,
    isDev,
    paths,
    port: PORT,
    apiUrl,
    wsUrl,
    project: 'frontend',
    staticUrl,
    googleClientId,
    tgBotId,
    stripePublishableKey,
    sentryDsn,
    sentryEnvironment,
    yandexMetrikaId,
    ga4MeasurementId
  })
```

> Note: `buildWebpackConfig.ts` (not read here) sits between `webpack.config.ts` and
> `buildPlugins.ts` — it also destructures `buildOptions` and forwards to `buildPlugins`.
> Planner should add the 3 new fields there too (thread them through), matching the
> existing forwarding of `ga4MeasurementId`.

---

### `config/build/types/config.ts` (types — add fields to both interfaces)

**Analog:** itself. `buildOptions` gets the injected values; `buildEnv` gets the
CLI-overridable ones. Mirror `ga4MeasurementId`.

**`buildOptions` fields idiom** (lines 16-32) — add `siteUrl: string; googleAdsId: string; adsSignupLabel: string`:

```16:32:config/build/types/config.ts
export interface buildOptions {
  mode: buildMode
  paths: buildPaths
  isDev: boolean
  port: number
  apiUrl: string
  wsUrl: string
  project: 'storybook' | 'frontend' | 'jest'
  staticUrl: string
  googleClientId: string
  tgBotId: string
  stripePublishableKey: string
  sentryDsn: string
  sentryEnvironment: string
  yandexMetrikaId: string
  ga4MeasurementId: string
}
```

---

### `src/app/types/global.d.ts` (types — declare new build constants)

**Analog:** itself. Add three `declare const __X__: string` lines matching the
existing block. **Required** so `.ts`/`.tsx` referencing `__SITE_URL__`,
`__GOOGLE_ADS_ID__`, `__ADS_SIGNUP_LABEL__` typecheck (mirrors `__GA4_MEASUREMENT_ID__`).

**`declare const` idiom** (lines 22-33):

```22:33:src/app/types/global.d.ts
declare const __IS_DEV__: boolean
declare const __API__: string
declare const __WS__: string
declare const __PROJECT__: 'storybook' | 'frontend' | 'jest'
declare const __STATIC__: string
declare const __GOOGLE_CLIENT_ID__: string
declare const __TG_BOT_ID__: string
declare const __STRIPE_PUBLISHABLE_KEY__: string
declare const __SENTRY_DSN__: string
declare const __SENTRY_ENVIRONMENT__: string
declare const __YANDEX_METRIKA_ID__: string
declare const __GA4_MEASUREMENT_ID__: string
```

---

### Landing pages: `MainPage.tsx`, `VoiceAssistantsLandingPage.tsx`, `SpeechAnalyticsLandingPage.tsx` (components — i18n meta + render-ready gate)

**Analog:** `MainPage.tsx` is the best analog because it already drives meta values
by locale/domain (via `getDomainConfig`). The other two currently hardcode RU strings
and must be converted to `t('...')` (D-01).

**Domain/locale-aware `usePageMeta` idiom to follow** (`MainPage.tsx` lines 78-89) —
replace the hardcoded `isRuDomain ? '...' : '...'` inline strings with `t('...meta.title')`
i18n keys so RU and EN both live in `main.json` (D-01/D-08):

```78:89:src/pages/MainPage/ui/MainPage.tsx
  const domainConfig = getDomainConfig()
  const isRuDomain = domainConfig.region === 'ru'

  usePageMeta({
    title: isRuDomain
      ? 'Голосовой AI-ассистент для бизнеса — облачная АТС с ИИ'
      : 'AI Voice Assistant Platform — Cloud PBX',
    description: isRuDomain
      ? 'Создайте голосового AI-бота ...'
      : 'Build voice AI assistants ...',
    path: '/'
  })
```

**Hardcoded strings to REPLACE with i18n** (`SpeechAnalyticsLandingPage.tsx` lines 37-44) — this is the D-01 target; route title/description through `t('SpeechAnalyticsPage.meta.*')`:

```37:44:src/pages/SpeechAnalyticsLandingPage/ui/SpeechAnalyticsLandingPage.tsx
const SpeechAnalyticsLandingPage = () => {
    const { t } = useTranslation('main')

    usePageMeta({
        title: 'Речевая аналитика звонков колл-центра с ИИ',
        description: 'Автоматический анализ записей звонков: STT, ...',
        path: '/speech-analytics'
    })
```

**Hardcoded RU `METRICS` array to move → i18n (D-08)** (`SpeechAnalyticsLandingPage.tsx` lines 25-35) — keep `color` in code, move `name` to i18n keys per RESEARCH Code Examples. Note lines 197-201 already do a partial `t('SpeechAnalyticsPage.Metric_${m.name}', m.name)` fallback — standardize to a `key`-based lookup:

```25:35:src/pages/SpeechAnalyticsLandingPage/ui/SpeechAnalyticsLandingPage.tsx
const METRICS = [
    { name: 'Качество приветствия', color: '#22c55e' },
    { name: 'Следование скрипту', color: '#f59e0b' },
    { name: 'Вежливость и эмпатия', color: '#22c55e' },
    // ...
]
```

**Render-ready gate (Pattern 1 from RESEARCH)** — each landing page must dispatch
`seo-render-ready` after i18n `ready`. There is NO existing analog for this (it is
net-new); use `const { t, ready } = useTranslation('main')` (the `ready` flag is
currently unused in these files) + a `useEffect(() => { if (ready) document.dispatchEvent(new Event('seo-render-ready')) }, [ready])`. Consider a shared
`useSeoRenderReady()` hook colocated in `src/shared/lib/seo/`.

**framer-motion hazard note (Pitfall 4):** hero uses `animate="visible"` (safe),
but below-the-fold sections use `initial="hidden" whileInView="visible"` (lines 93+),
which snapshot as `opacity:0`. Text is still in DOM (indexable) — acceptable for SEO.

---

### `src/features/Auth/lib/hooks/useSignupData.ts` (hook — fire funnel + Ads conversion)

**Analog:** itself. There are **3 success sites** that use the identical
`.unwrap().then((data) => { localStorage...; dispatch(userActions.setToken); navigate })`
idiom — Google (58-70), Telegram (74-86), email-activation (124-145). Fire
`trackEvent('signup_complete', { method })` + `fireAdsConversion(__ADS_SIGNUP_LABEL__)`
inside each `.then()` **success** callback (the reliable success point per RESEARCH),
NOT in `.catch`.

**Success-handler idiom (Google) to instrument** (lines 58-70):

```58:70:src/features/Auth/lib/hooks/useSignupData.ts
  const handleGoogleSignupSuccess = (idToken: string) => {
    setSignupError(null)
    googleSignup({ id_token: idToken, legalAcceptance })
      .unwrap()
      .then((data) => {
        localStorage.setItem('onboarding_is_signup', 'true')
        dispatch(userActions.setToken(data))
        navigate(getRouteAssistants())
      })
      .catch((e) => {
        setSignupError(t(getErrorMessage(e)))
      })
  }
```

The Telegram handler (74-86) and email-activation `onSignupActivateClick` (124-145)
have the same `.then()` shape — instrument all three with the matching `method`
(`'google'` / `'telegram'` / `'email'`). Import from the analytics module:
`import { trackEvent, fireAdsConversion } from '@/shared/config/analytics/initAnalytics'`.

> **Do NOT** fire on `onSignupClick` success (lines 105-110) — that is the
> email-code-*sent* step (`setIsSignupActivation(true)`), not signup completion.
> The completion is the activation `.then()` (lines 137-141).

---

### `scripts/verify-prerender.js` (test script — post-build grep gate)

**Analog:** `scripts/clear-cache.js` — the repo's plain-CommonJS Node script
convention (`const fs = require('fs')`, no TS, no shebang).

**CJS script idiom** (entire file):

```1:3:scripts/clear-cache.js
const fs = require('fs')

fs.rmSync('./node_modules/.cache', { recursive: true, force: true })
```

**Guidance:** `verify-prerender.js` should `require('fs')`, read each
`build/<route>/index.html`, and assert presence of `<title>`, `name="description"`,
`application/ld+json`, `rel="canonical"`, absence of `PageLoader` and dotted i18n
keys, and that sitemap/robots contain `aipbx.net` and not `aipbx.ru` (D-03/D-04).
`process.exit(1)` on failure (fail-loud). The exact grep assertions are spelled out
in RESEARCH § "Prerender verification". Wire into `package.json` as a `postbuild:prod`
or a standalone `verify:prerender` script (current `build:prod` is at line 10).

---

## Shared Patterns

### Build-time env constant (DefinePlugin → `declare const` → `typeof __X__ !== 'undefined'` read)
**Source:** `config/build/buildPlugins.ts:22-35` (inject) + `src/app/types/global.d.ts:22-33` (declare) + `src/shared/config/analytics/initAnalytics.ts:20-21` (consume)
**Apply to:** `__SITE_URL__`, `__GOOGLE_ADS_ID__`, `__ADS_SIGNUP_LABEL__` — the full
chain is **4 files**: `webpack.config.ts` (env read) → `config.ts` (type) →
`buildPlugins.ts` (`JSON.stringify` inject) → `global.d.ts` (`declare const`).
Miss any link and either the build or typecheck fails. Consume with the
`typeof __X__ !== 'undefined' ? __X__ : '<default>'` guard everywhere (never assume defined).

### Analytics event dispatch (guarded gtag/ym)
**Source:** `src/shared/config/analytics/initAnalytics.ts:47-58`
**Apply to:** `fireAdsConversion` (new) and all `useSignupData` funnel calls. Always
guard `if (id && window.gtag)`. Route GA4 funnel events through `trackEvent` (dual-dispatches
to Metrika for free); keep Ads `conversion` Google-only.

### Analytics unit test (mock module, `MockedFunction`, `clearAllMocks`, `it.each`)
**Source:** `src/features/Onboarding/lib/onboardingAnalytics.test.ts` (whole file)
**Apply to:** `initAnalytics.test.ts`, `usePageMeta.test.ts`, and any `useSignupData` funnel test.
Run via `npm run test:unit -- <pattern>`; jsdom + ts-jest already configured (`config/jest/jest.config.ts`).

### DOM head upsert (create-or-update by selector)
**Source:** `src/shared/lib/seo/usePageMeta.ts:13-38`
**Apply to:** new `upsertHreflang`/`upsertJsonLd` helpers — query existing, reuse or
create+append. Idempotent (safe to call on every route change / re-render).

### i18n-driven copy (`useTranslation('main')` + `t('...')`)
**Source:** all landing pages already use `useTranslation('main')`; keys live in `public/locales/{en,ru}/main.json`
**Apply to:** landing meta titles/descriptions, METRICS names, demo-CTA labels, JSON-LD
schema names. **Hard rule (D-01/D-02, project DoD): every new key MUST exist in both
`en/main.json` AND `ru/main.json`.** Never delete/overwrite RU values.

### FSD placement
**Source:** existing tree — `src/shared/lib/seo/` (usePageMeta), `src/shared/config/analytics/` (initAnalytics)
**Apply to:** `seoConfig.ts`/`useSeoRenderReady` → `src/shared/lib/seo/`; analytics
additions stay in `src/shared/config/analytics/`. Tests are colocated next to source
(`*.test.ts` beside the module), per `onboardingAnalytics.test.ts`.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `public/assets/og-default.png` | asset (binary) | static | No existing 1200×630 OG image; generate with image tool (D-05). Not code — no pattern to copy. |

**Net-new patterns (no in-repo analog, use RESEARCH.md):**
- `PrerendererWebpackPlugin` config → RESEARCH § Pattern 1 (no prerender plugin exists today).
- `seo-render-ready` document-event dispatch in landing pages → RESEARCH § Pattern 1.
- JSON-LD `<script type="application/ld+json">` injection → RESEARCH § Pattern 3 (none in repo).
- hreflang `<link rel="alternate">` → RESEARCH § Pattern 2 (none in repo).

## Metadata

**Analog search scope:** `src/shared/lib/seo/`, `src/shared/config/analytics/`,
`src/features/Onboarding/lib/`, `src/features/Auth/lib/hooks/`, `src/pages/*LandingPage`,
`src/pages/MainPage`, `config/build/`, `webpack.config.ts`, `src/app/types/`,
`public/`, `scripts/`.
**Files scanned:** 16 read in full/targeted; 3 landing pages + build chain + tests.
**Pattern extraction date:** 2026-07-21
