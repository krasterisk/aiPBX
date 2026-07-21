# Phase 9: Landing SEO + Google Ads (aipbx.net) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-21
**Phase:** 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
**Areas discussed:** Market/Domain, Prerender, Analytics/Tracking, Landing CRO, Google Ads scope, Audit deliverable

---

## Market / Domain

| Option | Description | Selected |
|--------|-------------|----------|
| .net/EN only | RU stays in Phase 4, clean scope | |
| Unify .net + .ru | domain-aware sitemap/robots/meta, Yandex + Google | |
| .net now + hreflang | ship EN, architect for future RU | ✓ |

**User's choice:** .net now + lay hreflang/architecture for RU.
**Notes:** Follow-up made this a hard constraint — clearly separate EN and RU
segments, i18n for EN, fully functional analytics, but **do not break RU**.
Drove D-01 (apply patch NOT verbatim; route meta + METRICS through i18n).

---

## Prerender

| Option | Description | Selected |
|--------|-------------|----------|
| react-snap (patch) | simple, fragile on hydration | |
| Evaluate alternatives | SSR / prerender service vs react-snap | ✓ |
| react-snap, defer OG | | |

**User's choice:** Evaluate alternatives first.
**Notes:** react-snap considered fragile; research must justify the choice.
Missing `og-default.png` flagged for generation (D-05).

---

## Analytics / Tracking

| Option | Description | Selected |
|--------|-------------|----------|
| Full GA4 funnel | signup + assistant_created + first_call + payment | ✓ |
| Signup tag only | patch minimum | |
| Full funnel + Metrika | add Yandex if RU in play | |

**User's choice:** Full GA4 funnel.
**Notes:** Event names align with GTM-CONTENT-PLAN.md. Metrika deferred to RU/Phase 4.

---

## Landing CRO

| Option | Description | Selected |
|--------|-------------|----------|
| Quick wins (all 3 pages) | demo CTA, RU METRICS → i18n, viewport a11y | ✓ |
| Technical SEO only | defer all CRO | |
| Deep CRO | hero rewrite, social proof, trust blocks | |

**User's choice:** Quick wins on all 3 pages (/, /voice-assistants, /speech-analytics).
**Notes:** User raised that the Speech Analytics product/landing must be equally
covered — confirmed both landings + MainPage in scope. Speech Analytics content
fully functional in EN via i18n while preserving RU (D-08/D-09).

---

## Google Ads scope

| Option | Description | Selected |
|--------|-------------|----------|
| Code only | tag + conversions; campaign founder-led | |
| Code + campaign assets | agent drafts EN keywords, ad copy, group structure | ✓ |

**User's choice:** Code + drafted campaign assets.
**Notes:** Live campaign management stays founder-led (D-10).

---

## Audit deliverable

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — audit doc | SEO/Lighthouse audit + recommendations artifact | ✓ |
| No | just apply patch + fixes | |

**User's choice:** Yes — produce written expert audit (D-11).

---

## Claude's Discretion

- i18n key naming, JSON-LD field details, structure of audit and Ads-asset docs.

## Deferred Ideas

- RU / aipbx.ru SEO + Yandex.Metrika + RU sitemap/robots → Phase 4.
- Deep CRO (hero, social proof, trust, FAQ) → future CRO phase / backlog.
- Per-page custom OG images → backlog.
- Live Google Ads campaign creation/management → founder-led.
