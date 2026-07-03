# Phase 2: Onboarding Conversion — Context

**Gathered:** 2026-06-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver dual-product onboarding so a new RU B2B user reaches **first success within ≤15 minutes**:

1. **Product fork** at onboarding start: Voice AI Assistants vs Speech Analytics (Operator Analytics).
2. **Assistants path:** Refine existing wizard → mandatory Playground call → then offer trunk (АТС) or website widget.
3. **Analytics path:** Guided project creation (reuse `ProjectWizard` patterns) → first file analyzed → dashboard tour (insights, operator reports).
4. **Conversion funnel:** GA4 + Яндекс.Метрика events for both paths (GAP-16).
5. **Docs screenshots:** Replace placeholders with real or high-fidelity page captures (GAP-14).

**Success metrics:**
- Assistants: `playground_call_success` (user completes a call in Playground).
- Analytics: `oa_first_analysis_complete` (first recording uploaded and analyzed).

**Out of scope (other phases):**
- OA Phase 2 product features (drill-down, Redis cache, `aggregatedCustomMetrics` backend) — Phase 3
- Full telephony trunk provisioning automation beyond guided next-steps
- Deep API integration setup wizard (intro + docs link OK; full connector config deferred)
- SEO/prerender — Phase 4
- E2E tests in CI — Phase 6

</domain>

<decisions>
## Implementation Decisions

### Product fork & re-entry
- **D-01:** On first login after signup, user **must** choose product path: Voice Assistants or Speech Analytics.
- **D-02:** After onboarding completed, same fork is reachable via **one entry point** (single button — not necessarily two separate menu items). User picks assistants or analytics again inside that flow.
- **D-03:** Both products are first-class; onboarding is not assistants-only anymore.

### Assistants path
- **D-04:** Keep current wizard structure as base (business template → assistant creation → publish overview → completion), but **primary success = Playground call** before treating onboarding as done.
- **D-05:** After successful Playground call, present **next steps**: connect SIP trunk for own PBX **or** embed website widget (non-blocking; user can defer).
- **D-06:** Replace mandatory Telegram step with **«Простой пример»** — simple, clear walkthrough of configuring and using the assistant on a concrete scenario. **Telegram remains optional** — mention that integration is available, but not required (blocked in RU).
- **D-07:** Wizard must **drive user to Playground** (deep-link / prominent CTA), not offer four equal exits without guidance. Other destinations (dashboard, docs, assistants list) remain secondary after success or via skip.

### Speech Analytics path
- **D-08:** New onboarding branch modeled on `ProjectWizard` — collaborative project creation: name, industry/tasks, **custom metrics or templates** from existing catalog.
- **D-09:** After project created, offer **upload arbitrary call recording** (primary first-success path) **or** introduce **API** for automatic call export from client PBX (educational step + docs; full connector setup not required in this phase).
- **D-10:** Show `OperatorDashboard` capabilities: AI insights, operator reports, key widgets — guided tour or highlight overlay after first analysis (or empty-state preview before data).
- **D-11:** Analytics first success = **first file uploaded and analysis completed** (symmetric to Playground call for assistants).

### Analytics & measurement (GAP-16)
- **D-12:** Track **both paths separately** via existing `trackEvent()` in `initAnalytics.ts`.
- **D-13:** Minimum event set:
  - `onboarding_started`, `onboarding_product_assistants`, `onboarding_product_analytics`
  - `onboarding_step_{n}` (per wizard step, path-prefixed if needed)
  - `assistant_created`, `playground_call_success`
  - `oa_project_created`, `oa_file_uploaded`, `oa_first_analysis_complete`
  - `onboarding_completed`, `onboarding_skipped` (if skip allowed)
- **D-14:** Funnel goals in both GA4 and Яндекс.Метрика for **all domains** where analytics IDs are configured (not ru-only).

### Documentation screenshots (GAP-14)
- **D-15:** Replace placeholders in `public/docs/screenshots/` with **real page captures or high-fidelity mocks** of actual UI (redesign-v3). Agent may use Playwright/screenshot from dev build or composed mock from real components — must look like production, not generic placeholders.
- **D-16:** Priority screenshots (from `screenshots/README.md`): dashboard, assistant create, SIP publish, tool create, playground, reports history. Add OA-relevant captures if docs reference analytics (project wizard, upload, operator dashboard).

### UI & technical constraints (carried forward)
- **D-17:** New onboarding UI only in `shared/ui/redesign-v3/`.
- **D-18:** Reuse `DynamicModuleLoader` + Redux slice pattern from existing `Onboarding` feature; analytics branch may reuse `projectWizard` slice/actions where possible.
- **D-19:** Signup trigger: keep `onboarding_is_signup` localStorage flag; extend state to include `productPath: 'assistants' | 'analytics'`.

### Claude's Discretion
- Exact step count and naming for each branch after fork
- Whether Playground call success is detected via WebSocket event, billing record, or UI callback
- Dashboard tour implementation: spotlight overlay vs dedicated onboarding sub-route
- Screenshot capture method (Playwright vs manual staging) per environment constraints
- Skip button visibility and whether skip blocks funnel "completed" goal

</decisions>

<canonical_refs>
## Canonical References

### Planning
- `.planning/ROADMAP.md` — Phase 2 scope, GAP-10/14/16
- `.planning/GAPS.md` — gap definitions and evidence paths
- `.planning/PROJECT.md` — dual-product context, RU B2B, redesign-v3 rule
- `.planning/phases/00b-engineering-foundation/00b-CONTEXT.md` — analytics infra deferred to Phase 2
- `.planning/phases/01-dashboard-insights-upgrade/01-CONTEXT.md` — OperatorDashboard insights patterns

### Assistants onboarding (existing)
- `src/features/Onboarding/ui/OnboardingWizard/OnboardingWizard.tsx` — shell, 5 steps, signup trigger
- `src/features/Onboarding/model/slices/onboardingSlice.ts` — state, complete/skip
- `src/features/Onboarding/model/types/onboarding.ts` — step model
- `src/features/Onboarding/ui/steps/` — Welcome, BusinessType, Telegram (to replace), PublishOverview, Completion
- `src/features/Auth/lib/hooks/useSignupData.ts` — sets `onboarding_is_signup`
- `src/app/App.tsx` — mounts `OnboardingWizard`

### Speech Analytics onboarding (reuse)
- `src/features/OperatorAnalytics/ui/ProjectWizard/ProjectWizard.tsx` — project creation wizard
- `src/features/OperatorAnalytics/ui/ProjectWizard/WizardStep0_Templates.tsx` — industry templates
- `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.tsx` — dashboard tour target
- `src/entities/Report/` — operator project API, `projectWizard` slice

### Analytics instrumentation
- `src/shared/config/analytics/initAnalytics.ts` — GA4 + Метрика init
- `src/shared/config/analytics/initAnalytics.ts` — `trackEvent()` helper
- `aiPBX/.env.example` — `YANDEX_METRIKA_ID`, `GA4_MEASUREMENT_ID`

### Docs screenshots
- `public/docs/screenshots/README.md` — placeholder inventory

### Codebase map
- `.planning/codebase/STRUCTURE.md` — App shell, onboarding overlay
- `.planning/codebase/CONCERNS.md` — GAP-10, GAP-16 notes

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `OnboardingWizard` + `onboardingSlice` — assistants branch foundation; extend with product fork step 0
- `ProjectWizard` + `projectWizardActions` — analytics branch; extract or embed simplified flow for onboarding (not full webhook/budget settings on first run unless needed)
- `trackEvent()` — wire into all onboarding transitions
- `CompletionStep` — refactor: Playground as primary CTA; post-success trunk/widget cards
- `PublishOverviewStep` — already explains widget, telephony, playground; align with D-05/D-07

### Established Patterns
- FSD: feature slice under `src/features/Onboarding`, entities for API
- `DynamicModuleLoader` for lazy reducer injection
- `localStorage` keys: `onboarding_completed`, `onboarding_is_signup`
- i18n namespace `onboarding` (extend); `reports` for OA wizard strings

### Integration Points
- `App.tsx` — onboarding overlay above authenticated shell
- Post-signup: `useSignupData` → fork wizard
- Playground route: `getRoutePlayground()`
- OA routes: operator analytics pages, file upload endpoints
- Re-entry button: likely Navbar/Menubar or dashboard empty-state (single button per D-02)

</code_context>

<specifics>
## Specific Ideas

- Founder vision: two products, not one — current onboarding wrongly assumes assistants-only
- RU market: Telegram blocked — must not block funnel; show as optional integration
- «Простой пример» should teach assistant setup on a concrete relatable scenario (e.g. receptionist, appointment booking)
- Analytics path: collaborative metric selection based on client industry/tasks — not empty project form
- After Playground call: offer trunk OR widget — mirrors publish overview but timed after success
- Screenshots: founder approved agent-generated captures or realistic mocks of real pages
- ≤15 minutes end-to-end for either path remains the north-star

</specifics>

<deferred>
## Deferred Ideas

- Full OA API connector onboarding (SIP/CDR webhook provisioning) — deep setup in docs + Phase 3 integration hardening
- `aggregatedCustomMetrics` backend widget — Phase 3 (GAP-12)
- Insights drill-down to CDR — Phase 3 (REQ-11)
- Freemium / trial tier messaging in onboarding — GAP-46, future GTM phase
- Second onboarding path auto-suggested (“You created an assistant — try analytics?”) — optional enhancement post-MVP

</deferred>

---

*Phase: 02-onboarding-conversion*
*Context gathered: 2026-06-24 via interactive discuss-phase*
