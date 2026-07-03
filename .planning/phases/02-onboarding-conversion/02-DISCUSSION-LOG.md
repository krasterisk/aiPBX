# Phase 2: Onboarding Conversion — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `02-CONTEXT.md`.

**Date:** 2026-06-24
**Phase:** 02-onboarding-conversion
**Areas discussed:** Product fork, Assistants path, Analytics path, Funnel analytics, Docs screenshots

---

## Product fork & re-entry

| Option | Description | Selected |
|--------|-------------|----------|
| Assistants-only | Keep current single-product wizard | |
| Dual fork at start | User chooses Assistants or Speech Analytics | ✓ |
| Two menu items later | Separate nav entries for re-onboarding | |
| One button re-entry | Single entry, same fork inside | ✓ |

**User's choice:** Mandatory fork on first launch; later re-accessible via one button (not necessarily two menu items).
**Notes:** Project has two products; current onboarding only covers voice assistants.

---

## Assistants path — first success & post-steps

| Option | Description | Selected |
|--------|-------------|----------|
| Equal exits on completion | Dashboard / Playground / Docs / Assistants | |
| Playground-first | Wizard drives to Playground call as success | ✓ |
| Then trunk or widget | Offer АТС trunk or site widget after call | ✓ |

**User's choice:** Wizard leads to Playground call; then suggest trunk or widget setup.
**Notes:** Aligns with ≤15 min goal and existing PublishOverview concepts.

---

## Telegram step (RU)

| Option | Description | Selected |
|--------|-------------|----------|
| Remove entirely | Drop Telegram step | |
| Optional skip | Keep step with skip | |
| Simple example + Telegram mention | Replace with guided example; Telegram optional | ✓ |

**User's choice:** Replace with «Простой пример»; note Telegram is available but not required (blocked in RU).

---

## Speech Analytics path

| Option | Description | Selected |
|--------|-------------|----------|
| Skip OA in Phase 2 | Assistants only | |
| ProjectWizard-based flow | Create project, metrics, upload/API intro, dashboard tour | ✓ |
| Success = project created | Project exists | |
| Success = first analysis | File uploaded and analyzed | ✓ |

**User's choice:** Reuse ProjectWizard patterns; upload file or API intro; show OperatorDashboard; success = first analysis complete (2B).

---

## Funnel analytics (GAP-16)

| Option | Description | Selected |
|--------|-------------|----------|
| Assistants only | Single funnel | |
| Both paths | Separate events for assistants and analytics | ✓ |
| RU domain only | aipbx.ru | |
| All configured domains | Where GA4/Метрика IDs set | ✓ |

**User's choice:** Track both product paths on all domains with analytics configured.

---

## Docs screenshots (GAP-14)

| Option | Description | Selected |
|--------|-------------|----------|
| Founder provides images | Manual asset drop | |
| Agent captures/mocks | Screenshot from app or realistic UI mock | ✓ |
| Defer to later phase | Keep placeholders | |

**User's choice:** Agent implements — generate or create mock of real pages.

---

## Claude's Discretion

- Playground success detection mechanism
- Dashboard tour UX pattern
- Screenshot capture tooling
- Skip button behavior
- Exact event naming prefixes

## Deferred Ideas

- Deep API connector wizard for OA
- Cross-sell prompt between products after first success
- Phase 3 OA features (drill-down, Redis cache, custom metrics aggregation)
