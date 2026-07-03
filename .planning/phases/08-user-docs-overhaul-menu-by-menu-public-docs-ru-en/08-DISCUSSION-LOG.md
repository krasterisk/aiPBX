# Phase 08: User docs overhaul — Discussion Log

> **Audit trail only.** Decisions are in `08-CONTEXT.md`.

**Date:** 2026-07-03
**Phase:** 08-user-docs-overhaul
**Areas discussed:** Navigation, Visuals, Analytics depth, Locales, Legacy, Audience (layered)

---

## Navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Mirror menubar 1:1 | Same groups/subitems as app menubar in `/docs` sidebar | ✓ |
| Learning tracks | Assistants vs Analytics paths | |
| Hybrid | Menubar top + scenario flows inside | |

**User's choice:** Mirror menubar 1:1 (D-01)

**Notes:** Follow-up on Calls/KB placement and Users section skipped — defaulted to menubar parity (top-level Calls & KB; Users in getting-started per ROADMAP).

---

## Visuals

| Option | Description | Selected |
|--------|-------------|----------|
| Inline form-mockup only | HTML in markdown | |
| PNG only | capture script | |
| Both | Mockups in text + PNG for major screens | ✓ |

**User's choice:** Both (D-07)

---

## PNG generation quality

| Option | Description | Selected |
|--------|-------------|----------|
| Playwright live `--base-url` | Real authenticated UI | |
| HTML mocks in script | Offline, CI-stable | ✓ |
| Live then mock fallback | | |

**User's choice:** HTML mocks priority (D-08) — address GAP-14 / Phase 2 weak mocks.

---

## Analytics API depth

| Option | Description | Selected |
|--------|-------------|----------|
| UI only | No endpoints | |
| UI + link to in-app API page | | |
| UI + embedded API reference | Tokens, analyze-file, batch in docs | ✓ |

**User's choice:** UI + embed (D-14)

---

## Locales

| Option | Description | Selected |
|--------|-------------|----------|
| ru + en only | Current folders | |
| ru + en + de + zh | Full app parity | ✓ |

**User's choice:** All four locales (D-06)

---

## Legacy root files

| Option | Description | Selected |
|--------|-------------|----------|
| Remove `public/docs/01-08.md` duplicates | Single source in lang folders | ✓ |
| Keep synced copies | | |
| Deprecate only | | |

**User's choice:** Remove (D-16)

---

## Audience / tone

| Option | Description | Selected |
|--------|-------------|----------|
| Operator / call center manager | Click-path focus | (base layer) |
| Business owner | Outcomes focus | |
| Asterisk integrator | Technical | (integrator blocks) |
| Layered | Quick start + «For integrators» in publish/analytics | ✓ |

**User's choice:** Layered (D-10)

---

## Claude's Discretion

- Anchor IDs for new DOC_SECTIONS subsections
- Exact PNG inventory expansion
- Wave ordering within 08-01…08-04

## Deferred Ideas

- Admin docs, video tutorials, dev docs, GTM copy — see CONTEXT.md `<deferred>`
