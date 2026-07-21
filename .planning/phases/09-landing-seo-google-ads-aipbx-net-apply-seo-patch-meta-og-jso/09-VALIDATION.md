---
phase: 9
slug: landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-21
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest 29 + ts-jest + jsdom (`config/jest/jest.config.ts`); Cypress optional for e2e |
| **Config file** | `config/jest/jest.config.ts` |
| **Quick run command** | `npm run test:unit -- <pattern>` |
| **Full suite command** | `npm run test:unit` + `npm run lint:ts` |
| **Estimated runtime** | ~30–90 seconds (unit); build+prerender gate longer |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:unit -- <touched module>` + `npm run lint:ts`
- **After every plan wave:** Run `npm run test:unit` (full)
- **Before `/gsd-verify-work`:** Full suite green + `build:prod` emits 4 nested `index.html` + `verify-prerender` green
- **Max feedback latency:** ~90 seconds (unit); build gate is a phase-level check

---

## Per-Task Verification Map

| Item | Requirement | Test Type | Automated Command | File Exists | Status |
|------|-------------|-----------|-------------------|-------------|--------|
| usePageMeta writes i18n title/desc/OG/canonical/JSON-LD/hreflang into head | D-01 | unit (jsdom) | `npm run test:unit -- usePageMeta` | ❌ 09-02 W2 | ⬜ pending |
| hreflang en→.net, ru→.ru, x-default→.net using `__SITE_URL__` (not window.origin) | D-02 | unit (jsdom) | `npm run test:unit -- usePageMeta` | ❌ 09-02 W2 | ⬜ pending |
| sitemap/robots contain `aipbx.net`, no `aipbx.ru` | D-03 | static assert | `node scripts/verify-prerender.js` | ❌ 09-07 W4 | ⬜ pending |
| Prerendered HTML has `<title>`, description, JSON-LD, canonical; no PageLoader; no dotted i18n keys | D-04 | integration (post-build grep) | `node scripts/verify-prerender.js` | ❌ 09-07 W4 | ⬜ pending |
| `og-default.png` (1200×630) exists; og:image absolute | D-05 | static assert | `node scripts/verify-prerender.js` | ❌ 09-07 W4 | ⬜ pending |
| `signup_complete` + Ads `send_to` fire on signup success (3 handlers) | D-06/D-07 | unit (mock gtag/trackEvent) | `npm run test:unit -- useSignupData` | ❌ 09-05 W3 | ⬜ pending |
| `initAnalytics` configs GA4 + Ads when env set; no-op when unset | D-07 | unit | `npm run test:unit -- initAnalytics` | ❌ 09-03 W2 | ⬜ pending |
| METRICS render from i18n (en + ru) | D-08 | unit (render) | `npm run test:unit -- SpeechAnalytics` | ❌ 09-04 W3 | ⬜ pending |
| Ads campaign asset draft artifact present | D-10 | doc exists | `test -f 09-ADS-ASSETS.md` | ❌ 09-08 W1 | ⬜ pending |
| SEO/Lighthouse audit artifact present | D-11 | doc exists | `test -f 09-SEO-AUDIT.md` | ❌ 09-08 W1 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Gaps — Scheduled Implementation Waves

These items originated as Wave 0 validation gaps, but their test creation is intentionally
scheduled with the implementation plan that owns each artifact:

- [ ] **09-02 / Wave 2:** `src/shared/lib/seo/usePageMeta.test.ts` — head assertions in jsdom (D-01/D-02)
- [ ] **09-03 / Wave 2:** `src/shared/config/analytics/initAnalytics.test.ts` — mock gtag (D-06/D-07)
- [ ] **09-05 / Wave 3:** `useSignupData` funnel test — assert `signup_complete` + Ads conversion on success
- [ ] **09-04 / Wave 3:** `SpeechAnalytics` render test — assert METRICS render from i18n (EN + RU)
- [ ] **09-07 / Wave 4:** `scripts/verify-prerender.js` — fail-closed post-build gate (D-03/D-04/D-05)
- [ ] **09-07 / Wave 4:** Prerender integration spike — confirm A1 (no hydration break with MUI/framer-motion/lazy chunks)
- [ ] **09-07 / Wave 4:** Install `@prerenderer/webpack-plugin @prerenderer/renderer-puppeteer puppeteer` (or provide system Chrome)
- [ ] **09-08 / Wave 1:** `09-ADS-ASSETS.md` and `09-SEO-AUDIT.md` artifact checks (D-10/D-11)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| JSON-LD valid | D-01 | External validator | Google Rich Results Test on prerendered pages |
| OG preview renders | D-05 | External scrapers | Facebook/LinkedIn/Telegram debuggers |
| Ads conversion recorded | D-07 | Live Ads account | GA4 DebugView + Google Tag Assistant (founder) |
| Search Console sitemap accepted | D-03 | External property | Submit `aipbx.net/sitemap.xml` in GSC (founder) |
| Lighthouse scores | D-11 | Lab/field tool | Lighthouse on prerendered pages; PageSpeed Insights |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s (unit)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
