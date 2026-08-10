# Phase 11: Playground UX redesign for voice assistant testing - Context

**Gathered:** 2026-08-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Redesign the Playground voice-assistant testing UX so it is simple, scannable, and intuitive while **keeping existing functionality** (WebRTC session, transcript, assistant settings, events/debug, onboarding hooks, metrics). Scope is frontend: `Playground` page + `PlaygroundSession` feature + a new shared `AssistantSettingsForm` feature used by Playground Setup and (follow-up plan) Assistants page. No ARI/billing/telephony backend changes.

</domain>

<decisions>
## Implementation Decisions

### Primary layout model
- **D-01:** Two explicit modes: **Setup** and **Call** (not dual-pane lab as the default mental model). — **Reversibility:** reversible
- **D-02:** After assistant select → **auto-enter Call**; Setup opens only via **«Настроить»**. — **Reversibility:** reversible
- **D-03:** No mid-call settings edits — configure only after hangup. — **Reversibility:** reversible
- **D-04:** Setup shows the **full** settings surface (prompt, model/params, VAD, tools/MCP), not a reduced subset — but with a new compact UX (not 1:1 current popovers). — **Reversibility:** reversible

### Settings vs session
- **D-05:** **Autosave to assistant** when leaving Setup and/or before starting a call; **no separate Save button**. — **Reversibility:** costly — changes save mental model vs Assistants form and playground form slices
- **D-06:** Autosave failure **blocks** starting a call; stay in Setup until save succeeds. — **Reversibility:** reversible
- **D-07:** After Setup edits post-hangup, restart is **normal Start only** (no banner, no autostart). — **Reversibility:** reversible
- **D-08:** Tools/MCP live in a **separate bottom accordion** «Инструменты» in Setup (not mixed into prompt/model). — **Reversibility:** reversible

### Debug / events
- **D-09:** Debug **hidden by default**; open via Events/Debug control. — **Reversibility:** reversible
- **D-10:** Debug opens as a **side sheet/drawer** over Call — **no permanent** 65/35 resizable split as default layout. — **Reversibility:** costly — removes current PlaygroundLayout Group/Panel primary chrome
- **D-11:** Default event filters: **as today** (almost everything except raw audio). — **Reversibility:** reversible
- **D-12:** Permanent Call chrome shows **connection status + timer only**; tokens/latency/VAD/model details live in Debug sheet (retire dense StatusBar from always-on UI). — **Reversibility:** reversible

### Pre-call / in-call / post-call
- **D-13:** Idle Call center: **readiness checklist** (mic / assistant / model) + Start; previous session must remain accessible if it exists. — **Reversibility:** reversible
- **D-14:** Previous session: **collapsed block** under checklist («Последний тест · N реплик»). — **Reversibility:** reversible
- **D-15:** In-call primary content: **live transcript**. — **Reversibility:** reversible
- **D-16:** Post-call: **brief session summary** (duration, errors, tool calls) above transcript. — **Reversibility:** reversible

### Mobile
- **D-17:** Mobile: **fullscreen stack** — Call is home; Setup and Debug are full-screen sheets/screens. — **Reversibility:** reversible
- **D-18:** Landscape ≈ narrow desktop (transcript + Debug sheet beside when open). — **Reversibility:** reversible
- **D-19:** System back / header arrow closes Setup/Debug → Call; Setup close triggers autosave (D-05). — **Reversibility:** reversible
- **D-20:** Mobile Start/Stop on **sticky bottom thumb bar**; header keeps assistant + status/timer. — **Reversibility:** reversible
- **D-21:** Mobile checklist as **compact chips**. — **Reversibility:** reversible

### Onboarding
- **D-22:** Onboarding (`?onboarding=assistants` / productPath assistants): **stripped flow** — select/preselect → Call → call; Setup/Debug not primary. — **Reversibility:** reversible
- **D-23:** During onboarding Setup/Debug remain **visible but collapsed** as secondary controls. — **Reversibility:** reversible
- **D-24:** URL `assistantId`: show select **preselected**, user **may change**. — **Reversibility:** reversible

### Mic / permissions / audio
- **D-25:** Mic problems surface in **checklist** (red item + retry); Start disabled until ok. — **Reversibility:** reversible
- **D-26:** Permanent permission deny: **short warning** + **detailed browser instructions in tooltip**. — **Reversibility:** reversible
- **D-27:** **Proactive** mic permission request when entering Call after assistant select. — **Reversibility:** reversible
- **D-28:** Mic **device select** only in **Debug sheet** (power-user). — **Reversibility:** reversible
- **D-29:** Mid-call mic lost: show error; user hangs up; fix in checklist after — no silent reconnect / auto-hangup. — **Reversibility:** reversible
- **D-30:** **Mute / volume** controls in **Call UI** (not Debug-only). — **Reversibility:** reversible

### Setup cards / AssistantSettingsForm
- **D-31:** Setup sections as **accordions** (one open at a time); **Prompt** open by default. — **Reversibility:** reversible
- **D-32:** Field layout: **2 columns desktop / 1 column mobile**. — **Reversibility:** reversible
- **D-33:** **Full refactor** of assistant settings cards/fields — new simple, convenient, functional UX (not CSS wrappers over current MainInfoCard/ModelParametersCard/VadSettingsCard). — **Reversibility:** costly — replaces Assistants form building blocks
- **D-34:** Implementation may use **MUI components directly** (not only `shared/ui/redesign-v3` wrappers), but **must follow FSD**. Explicit override of “redesign-v3 only” for this phase’s settings UI. — **Reversibility:** costly — introduces MUI-at-feature pattern that other phases may copy
- **D-35:** New feature slice **`AssistantSettingsForm`** (name may vary slightly) — single source imported by Playground Setup and Assistants page. — **Reversibility:** costly — new public FSD surface
- **D-36:** Delivery order: **Playground first**; **Assistants page migration** is a **follow-up plan within Phase 11** (same milestone phase, second wave). — **Reversibility:** reversible

### Assistant switch / connection / empty / connecting / navigation
- **D-37:** Switching assistant with existing session history: **confirm** («Сменить ассистента и очистить историю?»). — **Reversibility:** reversible
- **D-38:** Assistant select **disabled while call connected**. — **Reversibility:** reversible
- **D-39:** Connection errors: **toast + header status**; details in Debug; **no dedicated Retry** — return to idle and use normal Start. — **Reversibility:** reversible
- **D-40:** Empty assistants list: **empty state + CTA** «Создать ассистента» → Assistants create route. — **Reversibility:** reversible
- **D-41:** Long connecting: **timeout ~15–20s** + message + **Cancel → idle**. — **Reversibility:** reversible
- **D-42:** Leaving page during Setup: **silent autosave** (no beforeunload confirm). — **Reversibility:** reversible

### i18n / copy
- **D-43:** Copy tone: **neutral product** (кабинет), not “lab/sandbox” jargon. — **Reversibility:** reversible
- **D-44:** New i18n keys for this phase: **ru + en + de + zh**. — **Reversibility:** reversible

### Claude's Discretion
- Exact visual density, accordion animation, sheet width, checklist chip styling, summary field set (beyond duration/errors/tool calls), MUI component choices within D-34, and precise timeout seconds within 15–20s range.
- Whether `PlaygroundSession` v1 can be deleted vs left unused after V2 redesign — prefer remove dead UI only if safe; researcher/planner decide.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase / product
- `.planning/ROADMAP.md` — Phase 11 goal and scope
- `.planning/PROJECT.md` — FSD rules, DoD (lint/tests/i18n); note D-34 overrides redesign-v3-only for settings UI in this phase
- `.planning/GAPS.md` — GAP-10 onboarding first-call adjacency (do not break onboarding completion)

### Frontend — Playground
- `src/pages/Playground/ui/Playground/Playground.tsx` — thin page; onboarding disconnect ≥10s hook
- `src/features/PlaygroundSession/ui/PlaygroundSessionV2/PlaygroundSessionV2.tsx` — current session orchestrator
- `src/features/PlaygroundSession/ui/PlaygroundLayout/PlaygroundLayout.tsx` — current resizable dual-pane (to be replaced as default per D-10)
- `src/features/PlaygroundSession/ui/PlaygroundHeader/PlaygroundHeader.tsx` — overloaded header + settings popovers
- `src/features/PlaygroundSession/ui/DebugPanel/DebugPanel.tsx` — events UI
- `src/features/PlaygroundSession/ui/StatusBar/StatusBar.tsx` — metrics bar (retire from always-on per D-12)
- `src/features/PlaygroundSession/ui/ConversationPanel/ConversationPanel.tsx` — transcript
- `src/features/PlaygroundSession/model/usePlaygroundSession.ts` — session connect/disconnect

### Frontend — Assistants settings (refactor source)
- `src/features/Assistants/` — current MainInfoCard / ModelParametersCard / VadSettingsCard consumers
- `src/entities/Assistants/` — assistant types, form slice, RTK hooks

### UI / architecture
- `.planning/codebase/CONVENTIONS.md` — FSD, i18n, memo patterns
- `.planning/codebase/STRUCTURE.md` — where features/pages live
- `src/shared/ui/redesign-v3/` — still preferred for chrome/buttons where suitable; D-34 allows MUI in settings form

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `usePlaygroundSession` — keep session/WebRTC contract; redesign around it
- `eventProcessor` + `DebugPanel` filtering — reuse logic inside sheet
- `AssistantSelect`, `useAssistant`, `useUpdateAssistant` — selection + autosave
- Onboarding actions / `DisconnectInfo` / `MIN_CONNECTED_MS` in Playground page — preserve behavior
- `DynamicModuleLoader` for assistantForm reducer patterns

### Established Patterns
- Page is thin; real UI in `features/PlaygroundSession`
- Dual form slices today (`playgroundAssistantForm` in pages + `assistantForm` in entities) — autosave redesign should clarify single write path
- i18n namespace `playground`
- Current UI uses `shared/ui/redesigned` Button (not always redesign-v3)

### Integration Points
- Route Playground page + query `assistantId`, `onboarding=assistants`
- Analytics: `playground_call_success`, `first_call` on successful onboarding call
- Assistants create route for empty-state CTA
- Follow-up plan: swap Assistants edit form to `AssistantSettingsForm`

</code_context>

<specifics>
## Specific Ideas

- User: current UX is oversaturated / hard to scan — prioritize progressive disclosure (Call-first after select, Setup on demand, Debug hidden).
- User: Setup cards need full UX rethink — compact, convenient, functional; MUI OK under FSD.
- User: permanent mic deny = short warning + detailed instructions in tooltip (not only docs link).
- Transition decision was corrected mid-discussion: auto-enter Call (not wizard CTA-only).

</specifics>

<deferred>
## Deferred Ideas

- Inline create-assistant wizard inside Playground (rejected; use CTA to Assistants).
- Dedicated Retry control for connection failures (rejected; normal Start only).
- Always-visible dual-pane debug lab as default (rejected).
- None beyond above — discussion stayed within phase; Assistants page swap is **in phase** as plan 2, not deferred to another milestone.

</deferred>

---

*Phase: 11-Playground UX redesign for voice assistant testing*
*Context gathered: 2026-08-10*
