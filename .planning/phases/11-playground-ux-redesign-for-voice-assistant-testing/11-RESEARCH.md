# Phase 11: Playground UX redesign for voice assistant testing - Research

**Researched:** 2026-08-10
**Domain:** React 18 FSD frontend — Playground WebRTC session UX + shared assistant settings form
**Confidence:** HIGH (codebase architecture); MEDIUM (MUI sheet/accordion patterns from official docs); LOW where noted

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Two explicit modes: **Setup** and **Call** (not dual-pane lab as the default mental model). — **Reversibility:** reversible
- **D-02:** After assistant select → **auto-enter Call**; Setup opens only via **«Настроить»**. — **Reversibility:** reversible
- **D-03:** No mid-call settings edits — configure only after hangup. — **Reversibility:** reversible
- **D-04:** Setup shows the **full** settings surface (prompt, model/params, VAD, tools/MCP), not a reduced subset — but with a new compact UX (not 1:1 current popovers). — **Reversibility:** reversible
- **D-05:** **Autosave to assistant** when leaving Setup and/or before starting a call; **no separate Save button**. — **Reversibility:** costly — changes save mental model vs Assistants form and playground form slices
- **D-06:** Autosave failure **blocks** starting a call; stay in Setup until save succeeds. — **Reversibility:** reversible
- **D-07:** After Setup edits post-hangup, restart is **normal Start only** (no banner, no autostart). — **Reversibility:** reversible
- **D-08:** Tools/MCP live in a **separate bottom accordion** «Инструменты» in Setup (not mixed into prompt/model). — **Reversibility:** reversible
- **D-09:** Debug **hidden by default**; open via Events/Debug control. — **Reversibility:** reversible
- **D-10:** Debug opens as a **side sheet/drawer** over Call — **no permanent** 65/35 resizable split as default layout. — **Reversibility:** costly — removes current PlaygroundLayout Group/Panel primary chrome
- **D-11:** Default event filters: **as today** (almost everything except raw audio). — **Reversibility:** reversible
- **D-12:** Permanent Call chrome shows **connection status + timer only**; tokens/latency/VAD/model details live in Debug sheet (retire dense StatusBar from always-on UI). — **Reversibility:** reversible
- **D-13:** Idle Call center: **readiness checklist** (mic / assistant / model) + Start; previous session must remain accessible if it exists. — **Reversibility:** reversible
- **D-14:** Previous session: **collapsed block** under checklist («Последний тест · N реплик»). — **Reversibility:** reversible
- **D-15:** In-call primary content: **live transcript**. — **Reversibility:** reversible
- **D-16:** Post-call: **brief session summary** (duration, errors, tool calls) above transcript. — **Reversibility:** reversible
- **D-17:** Mobile: **fullscreen stack** — Call is home; Setup and Debug are full-screen sheets/screens. — **Reversibility:** reversible
- **D-18:** Landscape ≈ narrow desktop (transcript + Debug sheet beside when open). — **Reversibility:** reversible
- **D-19:** System back / header arrow closes Setup/Debug → Call; Setup close triggers autosave (D-05). — **Reversibility:** reversible
- **D-20:** Mobile Start/Stop on **sticky bottom thumb bar**; header keeps assistant + status/timer. — **Reversibility:** reversible
- **D-21:** Mobile checklist as **compact chips**. — **Reversibility:** reversible
- **D-22:** Onboarding (`?onboarding=assistants` / productPath assistants): **stripped flow** — select/preselect → Call → call; Setup/Debug not primary. — **Reversibility:** reversible
- **D-23:** During onboarding Setup/Debug remain **visible but collapsed** as secondary controls. — **Reversibility:** reversible
- **D-24:** URL `assistantId`: show select **preselected**, user **may change**. — **Reversibility:** reversible
- **D-25:** Mic problems surface in **checklist** (red item + retry); Start disabled until ok. — **Reversibility:** reversible
- **D-26:** Permanent permission deny: **short warning** + **detailed browser instructions in tooltip**. — **Reversibility:** reversible
- **D-27:** **Proactive** mic permission request when entering Call after assistant select. — **Reversibility:** reversible
- **D-28:** Mic **device select** only in **Debug sheet** (power-user). — **Reversibility:** reversible
- **D-29:** Mid-call mic lost: show error; user hangs up; fix in checklist after — no silent reconnect / auto-hangup. — **Reversibility:** reversible
- **D-30:** **Mute / volume** controls in **Call UI** (not Debug-only). — **Reversibility:** reversible
- **D-31:** Setup sections as **accordions** (one open at a time); **Prompt** open by default. — **Reversibility:** reversible
- **D-32:** Field layout: **2 columns desktop / 1 column mobile**. — **Reversibility:** reversible
- **D-33:** **Full refactor** of assistant settings cards/fields — new simple, convenient, functional UX (not CSS wrappers over current MainInfoCard/ModelParametersCard/VadSettingsCard). — **Reversibility:** costly — replaces Assistants form building blocks
- **D-34:** Implementation may use **MUI components directly** (not only `shared/ui/redesign-v3` wrappers), but **must follow FSD**. Explicit override of “redesign-v3 only” for this phase’s settings UI. — **Reversibility:** costly — introduces MUI-at-feature pattern that other phases may copy
- **D-35:** New feature slice **`AssistantSettingsForm`** (name may vary slightly) — single source imported by Playground Setup and Assistants page. — **Reversibility:** costly — new public FSD surface
- **D-36:** Delivery order: **Playground first**; **Assistants page migration** is a **follow-up plan within Phase 11** (same milestone phase, second wave). — **Reversibility:** reversible
- **D-37:** Switching assistant with existing session history: **confirm** («Сменить ассистента и очистить историю?»). — **Reversibility:** reversible
- **D-38:** Assistant select **disabled while call connected**. — **Reversibility:** reversible
- **D-39:** Connection errors: **toast + header status**; details in Debug; **no dedicated Retry** — return to idle and use normal Start. — **Reversibility:** reversible
- **D-40:** Empty assistants list: **empty state + CTA** «Создать ассистента» → Assistants create route. — **Reversibility:** reversible
- **D-41:** Long connecting: **timeout ~15–20s** + message + **Cancel → idle**. — **Reversibility:** reversible
- **D-42:** Leaving page during Setup: **silent autosave** (no beforeunload confirm). — **Reversibility:** reversible
- **D-43:** Copy tone: **neutral product** (кабинет), not “lab/sandbox” jargon. — **Reversibility:** reversible
- **D-44:** New i18n keys for this phase: **ru + en + de + zh**. — **Reversibility:** reversible

### Claude's Discretion
- Exact visual density, accordion animation, sheet width, checklist chip styling, summary field set (beyond duration/errors/tool calls), MUI component choices within D-34, and precise timeout seconds within 15–20s range.
- Whether `PlaygroundSession` v1 can be deleted vs left unused after V2 redesign — prefer remove dead UI only if safe; researcher/planner decide.

### Deferred Ideas (OUT OF SCOPE)
- Inline create-assistant wizard inside Playground (rejected; use CTA to Assistants).
- Dedicated Retry control for connection failures (rejected; normal Start only).
- Always-visible dual-pane debug lab as default (rejected).
- None beyond above — discussion stayed within phase; Assistants page swap is **in phase** as plan 2, not deferred to another milestone.
</user_constraints>

<phase_requirements>
## Phase Requirements

REQUIREMENTS.md currently documents Phase 1 Dashboard Insights (REQ-01…11). Phase 11 IDs are **TBD** in ROADMAP. Planner should treat CONTEXT D-01…D-44 + approved `11-UI-SPEC.md` as the requirement set. Suggested provisional IDs for plan mapping:

| ID | Description | Research Support |
|----|-------------|------------------|
| PG-UX-01 | Setup/Call modes; auto-enter Call after select; Setup on demand | Layout model; mode state machine |
| PG-UX-02 | Autosave on Setup leave / before Start; fail blocks Start | Dual-slice consolidation; `useUpdateAssistant` |
| PG-UX-03 | Debug as sheet (not permanent 65/35); metrics off StatusBar | Drawer/SidePanel patterns; DebugPanel reuse |
| PG-UX-04 | Call center states: empty, idle checklist, connecting+18s, live transcript, post-call summary | ConversationPanel + metrics fields |
| PG-UX-05 | Mobile fullscreen sheets + sticky Start/Stop bar | `useMediaQuery` vs `useDevice`; sticky CSS |
| PG-UX-06 | Mic checklist, proactive permission, mute/volume in Call | `usePlaygroundSession` gaps; Permissions API |
| PG-UX-07 | `AssistantSettingsForm` feature; Playground first, Assistants migrate later | Extract vs leave matrix; FSD |
| PG-UX-08 | Onboarding stripped flow; preserve `playground_call_success` / `first_call` | Playground page disconnect hook |
| PG-UX-09 | i18n ru+en+de+zh; neutral product copy | Copywriting Contract in UI-SPEC |
</phase_requirements>

## Project Constraints (from .cursor/rules/)

| Source | Directive | Phase impact |
|--------|-----------|--------------|
| `aipbx-core.mdc` | DoD: `lint:ts`, unit tests, i18n, no ARI/billing without phase | Frontend-only; manual WebRTC checklist in plan |
| `aipbx-core.mdc` | One GAP per phase; no drive-by refactors | Scope = Playground + AssistantSettingsForm + Assistants migration plan only |
| `frontend-fsd.mdc` | New UI in `redesign-v3`; prefer redesign-v3 over MUI | **Superseded for this phase by D-34 / UI-SPEC** — MUI direct or `shared/ui/mui/` wrappers; still FSD |
| `frontend-fsd.mdc` | RTK in entities; i18n no hardcoded strings | Autosave via entity hooks; all new copy via `playground` (+ assistants) locales |
| PROJECT.md | New UI redesign-v3 only | Same override as D-34 for settings/Call chrome per UI-SPEC |
| PROJECT.md | i18n ru+en minimum | Phase raises to **ru+en+de+zh** (D-44) |

**ROADMAP wording override:** ROADMAP still says “UI in redesign-v3” for Phase 11 — treat as **stale**. Locked truth is CONTEXT D-34 + approved UI-SPEC (MUI-first / `shared/ui/mui`).

## Summary

Phase 11 is a **frontend IA redesign** around an already-working WebRTC playground. The session contract (`usePlaygroundSession` + Socket.IO `playground_*` events + `eventProcessor`) must stay stable while chrome changes from a permanent dual-pane lab (`react-resizable-panels` 65/35 + dense StatusBar + settings popovers) to **Call-first + Setup/Debug sheets**. Settings UX is a **new shared feature** (`AssistantSettingsForm`), not CSS wrappers over `MainInfoCard` / `ModelParametersCard` / `VadSettingsCard`.

The highest-risk seams are: (1) **dual Redux form slices** (`playgroundAssistantForm` in pages + `assistantForm` in entities) with **features → pages** FSD violations already eslint-disabled; (2) **onboarding analytics** on disconnect (`MIN_CONNECTED_MS` → `playground_call_success` + `first_call`); (3) **new mute/volume + proactive mic** which do not exist in the session hook today; (4) **Assistants page Save button** remains until plan 04 while Playground becomes autosave-only.

**Primary recommendation:** Keep `usePlaygroundSession` as the sole WebRTC owner; rebuild UI as mode-driven Call chrome + MUI drawers; consolidate write path on **entity `assistantForm` + `useUpdateAssistant`**; extract `features/AssistantSettingsForm` for Setup (Playground) then swap Assistants edit form in a later wave; delete dead V1/popover paths only after V2 Call/Setup ships.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Mode state (Call/Setup/Debug) | Browser / Client | — | Pure UI; local React state in orchestrator |
| WebRTC / Socket.IO session | Browser / Client | API / Backend (existing playground WS) | `usePlaygroundSession` owns socket+audio; no backend change |
| Transcript / metrics derive | Browser / Client | — | `eventProcessor` pure transform of WS events |
| Assistant settings edit UI | Browser / Client | — | New `AssistantSettingsForm` feature |
| Persist assistant settings | API / Backend (existing) | Browser / Client | RTK `useUpdateAssistant` — no new endpoints |
| Autosave orchestration | Browser / Client | — | Setup close / Start / page unmount |
| Onboarding completion analytics | Browser / Client | — | Stay in thin `Playground` page callback |
| Mic permission / mute / volume | Browser / Client | — | MediaDevices + AudioContext graph |
| Assistants create CTA navigation | Browser / Client | — | `getRouteAssistantCreate()` |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18 (repo) | UI | Existing app |
| `@mui/material` | `^7.3.0` installed; registry latest observed `9.3.1` | Drawer, Accordion, Dialog, Chip, Tooltip, Button, Slider, Grid2, LinearProgress | UI-SPEC locked; already dependency — **do not upgrade in this phase** |
| `@mui/icons-material` | (peer of MUI in repo) | Dense form icons only if needed | UI-SPEC |
| `lucide-react` | `^0.575.0` | Call chrome icons | UI-SPEC; already used in PlaygroundHeader |
| `@reduxjs/toolkit` + RTK Query | existing | Form slice + `useUpdateAssistant` / `useAssistant` | Project standard |
| `react-toastify` | existing | Connection / autosave errors | UI-SPEC — no second toast system |
| `react-i18next` | existing | `playground` namespace + assistants | D-44 |
| `socket.io-client` | existing | Playground session | Keep via `usePlaygroundSession` |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `src/shared/ui/mui/*` | local | Input, Textarea, Combobox, Check, Slider, Drawer | Prefer wrappers; add Accordion wrapper only if shared public API needed |
| `src/shared/ui/redesign-v3/SidePanel` | local | Right drawer shell with back/title | Optional base for Setup/Debug sheets (width tokens differ — override paper width) |
| `react-resizable-panels` | `^4.10.0` | Current dual-pane | **Retire from default layout** (D-10); remove import from new layout |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| MUI Drawer for Setup/Debug | Keep resizable panels | Violates D-10 |
| New settings form | Wrap MainInfoCard etc. | Violates D-33 |
| `playgroundAssistantForm` + entity dual write | Single entity `assistantForm` | Dual write is current bug magnet — consolidate |
| Feature→feature import | Page composition only | Cleaner FSD but more prop drilling; either OK if documented |

**Installation:** None required — reuse installed packages.

**Version verification:** `@mui/material` package.json `^7.3.0`; `npm view @mui/material version` → `9.3.1` (do not bump in Phase 11). `lucide-react` package.json `^0.575.0`. [VERIFIED: npm registry / package.json]

## Package Legitimacy Audit

> No new external packages for this phase.

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| — | — | — | — | — | — | No installs |

**Packages removed due to [SLOP] verdict:** none  
**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### System Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────┐
│ Playground Page (thin)                                          │
│  - searchParams: assistantId, onboarding=assistants              │
│  - onSessionDisconnect ≥10s → onboarding + first_call analytics │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ PlaygroundSessionV2 orchestrator                                │
│  mode: call | setup | debug                                     │
│  selectedAssistant, processorState, typedEvents                 │
│  checklist (mic/assistant/model) · confirm switch · timeout 18s │
└───────┬───────────────────┬───────────────────┬─────────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌────────────────┐  ┌──────────────────────────┐
│ Call chrome   │  │ Setup sheet    │  │ Debug sheet              │
│ header+center │  │ MUI Drawer     │  │ MUI Drawer               │
│ sticky mobile │  │ → Assistant    │  │ → DebugPanel + metrics   │
│ mute/volume   │  │   SettingsForm │  │   + mic device select    │
└───────┬───────┘  └───────┬────────┘  └──────────────────────────┘
        │                  │
        ▼                  ▼
┌───────────────┐  ┌──────────────────────────────────────────────┐
│ usePlayground │  │ entities/Assistants                          │
│ Session       │  │  assistantForm slice (single write path)     │
│ socket+audio  │  │  useUpdateAssistant (autosave)               │
└───────────────┘  └──────────────────────────────────────────────┘
```

### Recommended Project Structure

```text
src/features/PlaygroundSession/
├── model/
│   ├── usePlaygroundSession.ts      # KEEP — WebRTC contract (+ mute/volume extensions)
│   ├── useMicPermission.ts          # NEW — proactive probe + checklist state
│   ├── useAutosaveAssistant.ts      # NEW — dirty → updateAssistant; fail semantics
│   └── types/…
├── lib/eventProcessor.ts            # KEEP — extend summary aggregates if needed
├── ui/
│   ├── PlaygroundSessionV2/         # Rewrite orchestrator (modes)
│   ├── CallChrome/                  # Header, sticky bar, status+timer
│   ├── CallCenter/                  # Empty / checklist / connecting / transcript / summary
│   ├── SetupSheet/                  # Drawer wrapping AssistantSettingsForm
│   ├── DebugSheet/                  # Drawer wrapping DebugPanel + StatusBar metrics
│   └── ConversationPanel/           # KEEP logic; restyle
└── (delete after safe): PlaygroundSession.tsx v1, SettingsPopover*, SettingsPanel*,
    PlaygroundAssistantSettings*, PlaygroundLayout* (resizable), StatusBar as always-on

src/features/AssistantSettingsForm/  # NEW (D-35)
├── ui/AssistantSettingsForm/
│   └── sections: Prompt | Parameters | Vad | Tools  (accordions)
├── model/ (optional local UI state only)
└── index.ts

src/pages/Playground/
├── ui/Playground/Playground.tsx     # KEEP analytics hook
└── model/slices/playgroundAssistantFormSlice.ts  # REMOVE after consolidation
```

### Pattern 1: Mode-driven sheets over live session
**What:** Call is always mounted; Setup/Debug are overlays. Session audio/socket continues only in Call `connected`; Setup is blocked while connected (D-03).  
**When to use:** All Playground UX.  
**Example:**

```tsx
// Pattern: local mode enum — do not put WebRTC status into Redux
type PlaygroundUiMode = 'call' | 'setup' | 'debug'

// Opening Setup while connected → no-op or force hangup first (D-03: configure only after hangup)
const openSetup = () => {
  if (status === 'connected' || status === 'connecting') return
  setMode('setup')
}
```

### Pattern 2: Single form write path + autosave gate
**What:** All field edits dispatch `assistantFormActions.updateForm`. Autosave calls `useUpdateAssistant` with `getAssistantFormData`. Remove Sync dances between playground + entity slices.  
**When to use:** Setup close, Start click, Playground unmount during Setup (D-42).  
**Example:**

```tsx
const [updateAssistant] = useUpdateAssistant()
const data = useSelector(getAssistantFormData)

async function autosave(): Promise<boolean> {
  if (!data?.id) return false
  try {
    await updateAssistant(data).unwrap()
    return true
  } catch {
    return false
  }
}

async function handleStart() {
  const ok = await autosave()
  if (!ok) {
    setMode('setup') // D-06
    setAutosaveError(true)
    return
  }
  connect(selectedAssistant.id)
}
```

### Pattern 3: Controlled exclusive Accordion (Setup)
**What:** One expanded section; Prompt default. [CITED: mui.com/material-ui/react-accordion]  
**When to use:** AssistantSettingsForm sections (D-31).

```tsx
// Source: https://mui.com/material-ui/react-accordion/ (Controlled / only one expanded)
const [expanded, setExpanded] = useState<string | false>('prompt')
const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
  setExpanded(isExpanded ? panel : false)
}
```

### Pattern 4: Drawer sheets (desktop width / mobile fullscreen)
**What:** Prefer MUI `Drawer` `anchor="right"` for desktop Setup **420px** / Debug **400px**; mobile `width: 100%`. Existing `shared/ui/mui/Drawer` is left SwipeableDrawer max 320px — **too narrow / wrong anchor** for this phase; either extend with props or use MUI Drawer / adapt `redesign-v3/SidePanel` with width overrides. [CITED: mui.com/material-ui/react-drawer]  
**When to use:** SetupSheet, DebugSheet (D-10, D-17).

### Anti-Patterns to Avoid
- **Dual form sync:** Writing prompt to `playgroundAssistantForm` and cards to `assistantForm` then merging on save — current Header bug magnet; delete after consolidation.
- **features → pages imports:** Today Header/V2 import `@/pages/Playground` with eslint-disable — fix by removing page slice.
- **Mid-call `updateSession` Apply button:** Conflicts with D-03; remove from UI (hook may remain unused).
- **Using `useDevice()` (pointer:coarse) for UI-SPEC `<900px`:** Wrong signal for landscape tablets; use `matchMedia('(max-width: 899px)')` for layout sheets/sticky bar.
- **Rebuilding permanent resizable debug pane:** Violates D-10.
- **Breaking Playground page disconnect analytics:** Do not move `onSessionDisconnect` semantics without preserving ≥10s gate.

## What to Extract vs Leave

| Concern | Put in `AssistantSettingsForm` | Leave in `PlaygroundSession` |
|---------|--------------------------------|------------------------------|
| Prompt / model / params / VAD / tools+MCP fields | ✓ | |
| Accordion IA, 2-col grid, MUI field density | ✓ | |
| Dirty tracking helpers (optional) | ✓ or shared hook | |
| Call/Setup/Debug mode | | ✓ |
| WebRTC connect/disconnect/mute/volume | | ✓ |
| Transcript, events, metrics derive | | ✓ |
| Checklist, empty state, sticky bar | | ✓ |
| Autosave **triggers** (when to save) | | ✓ (calls form’s data + updateAssistant) |
| Onboarding analytics | | Page only |
| Assistant select + switch confirm | | ✓ |
| Explicit Save buttons (Assistants page) | Header stays in Assistants until plan 04; form itself has **no** Save | |

**Assistants migration (D-36):** Plan 04 replaces `AssistantForm` internals / cards with `AssistantSettingsForm` inside `AssistantCard`, keeping `AssistantFormHeader` Save/Create/Delete (Assistants retains explicit save; Playground does not).

## Autosave Strategy & Form Slice Consolidation

**Current state [VERIFIED: codebase]:**
- `playgroundAssistantForm` — registered in root store (`store.ts`); prompt edits often go here.
- `assistantForm` — DynamicModuleLoader in V2; MainInfoCard/Model/Vad read/write here.
- Save reads **entity** data, syncs back to playground slice, then `updateAssistant`.

**Recommendation (prescriptive):**
1. **Canonical slice = entity `assistantForm`** (already supports create/edit modes for Assistants).
2. **Delete `playgroundAssistantForm`** reducer from root store after migration; fix StateSchema.
3. Playground V2 always `DynamicModuleLoader` `assistantForm` (already does) and `initEdit(assistantData)` on select.
4. Autosave = `updateAssistant(getAssistantFormData)` with validation mirroring Assistants (`name`, `model`, `voice`, `instruction` at minimum — reuse `validateAssistant` logic extracted to shared lib under entities or AssistantSettingsForm).
5. Dirty flag: compare to `initialData` already on `assistantForm` schema OR shallow snapshot on Setup open — skip no-op PATCH when clean.
6. D-42 unmount: `useEffect` cleanup calling autosave — fire-and-forget; swallow errors (silent). Prefer `navigator.sendBeacon` only if already patterned; **do not** invent beacon unless verified — use async unwrap in cleanup with caveat that React 18 StrictMode double-mount may double-fire in dev [ASSUMED: acceptable with idempotent PUT].

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Side sheet | Custom portal + CSS slide | MUI Drawer / SidePanel | Focus trap, Esc, backdrop [CITED: mui.com/material-ui/react-drawer] |
| Exclusive accordions | Custom expand state machine with CSS | MUI Accordion controlled | a11y id/aria-controls [CITED: mui.com/material-ui/react-accordion] |
| Confirm dialog | window.confirm | MUI Dialog | Matches UI-SPEC; i18n |
| Toast | New snackbar system | `react-toastify` | Already wired |
| Event → transcript | New parser | `eventProcessor` | Covered by unit tests |
| WS audio | New client | `usePlaygroundSession` | Fragile PCM/worklet graph |
| Mic permission UX | Ignore Permissions API | `permissions.query({name:'microphone'})` + getUserMedia probe | Checklist accuracy [CITED: MDN Permissions API] |

**Key insight:** Most risk is **state orchestration**, not new libraries. Prefer deleting dual form + resizable layout over adding abstractions.

## Common Pitfalls

### Pitfall 1: Sheet remount tears down session
**What goes wrong:** Conditional render of entire V2 tree when opening Setup unmounts hook → disconnect.  
**Why:** Cleanup `useEffect(() => () => disconnect())` in `usePlaygroundSession`.  
**How to avoid:** Keep session hook mounted at orchestrator root; only overlay drawers. Never key remount on mode.  
**Warning signs:** Call drops when opening settings.

### Pitfall 2: Dual-slice drift after “save”
**What goes wrong:** UI shows stale prompt after params save.  
**Why:** Prompt on playground slice, cards on entity.  
**How to avoid:** Single slice before building new form.  
**Warning signs:** eslint-disable layer-imports to `@/pages/Playground` still present.

### Pitfall 3: Onboarding first-call regression
**What goes wrong:** UX change shortens calls or remounts page → analytics never fires.  
**Why:** `Playground.tsx` requires `wasConnected && connectedDurationMs >= 10_000`.  
**How to avoid:** Keep `onSessionDisconnect` prop; add regression unit test around disconnect info plumbing; manual checklist for onboarding path.  
**Warning signs:** GAP-10 still open for human E2E — do not worsen.

### Pitfall 4: Proactive mic vs connect-time getUserMedia
**What goes wrong:** Double permission prompts or checklist green but connect fails.  
**Why:** Today mic only requested inside `playground.ready` → `initAudioInput`.  
**How to avoid:** Probe with short-lived stream (stop tracks immediately) for checklist; connect path still opens real stream; if probe granted, connect should succeed. Handle Safari Permissions API gaps with try/catch fallback to getUserMedia.  
**Warning signs:** Start enabled but connect immediately errors.

### Pitfall 5: Mute/volume missing from audio graph
**What goes wrong:** UI toggles do nothing.  
**Why:** Playback connects sources directly to `ctx.destination`; mic mute not exposed.  
**How to avoid:** Insert `GainNode` for playback volume; mute via `MediaStreamTrack.enabled`; keep loopback gain at 0.  
**Warning signs:** Volume slider cosmetic-only.

### Pitfall 6: Post-call “errors” metric undefined
**What goes wrong:** Summary shows 0/undefined.  
**Why:** `SessionMetrics` has `functionCallCount` / `interruptCount` but **no errorCount** — errors go to transcript via `processEvent` case `'error'`.  
**How to avoid:** Count typedEvents with `getEventCategory === 'error'` or add `errorCount` to processor.  
**Warning signs:** Summary Errors always 0.

### Pitfall 7: Assistants Save vs Playground autosave mental split
**What goes wrong:** Users expect Save on Assistants after using Playground; or Plan 04 removes Save too early.  
**Why:** D-05 is Playground-only; Assistants keep header Save until product decides otherwise.  
**How to avoid:** Plan 04 migrates **fields UI only**, keeps `AssistantFormHeader` onSave.

### Pitfall 8: Mobile breakpoint mismatch
**What goes wrong:** Sticky bar never shows on touch laptop / shows on narrow desktop incorrectly.  
**How to avoid:** UI-SPEC `<900px` via `useMediaQuery`; do not reuse `useDevice()` alone.

## Code Examples

### Preserve onboarding disconnect contract

```tsx
// Source: src/pages/Playground/ui/Playground/Playground.tsx [VERIFIED: codebase]
const MIN_CONNECTED_MS = 10_000
// onSessionDisconnect → setPlaygroundCallCompleted + trackOnboardingEvent('playground_call_success') + trackEvent('first_call')
```

### Default Debug filters (keep)

```tsx
// Source: DebugPanel.tsx [VERIFIED: codebase]
// Default: transcript, function, response, session, error, vad — NOT audio (D-11)
new Set(['transcript', 'function', 'response', 'session', 'error', 'vad'])
```

### Empty-state CTA route

```tsx
navigate(getRouteAssistantCreate()) // src/shared/const/router.ts
```

### Connecting timeout (UI layer)

```tsx
// Discretion: 18s per UI-SPEC
useEffect(() => {
  if (status !== 'connecting') return
  const id = window.setTimeout(() => setConnectTimedOut(true), 18_000)
  return () => clearTimeout(id)
}, [status])
// Cancel → disconnect() → idle (D-41)
```

## State of the Art

| Old Approach | Current Approach (Phase 11) | When Changed | Impact |
|--------------|----------------------------|--------------|--------|
| Permanent 65/35 resizable debug | Hidden Debug sheet | D-10 / UI-SPEC | Removes `PlaygroundLayout` as primary chrome |
| Settings popovers + Save/Apply | Setup sheet + autosave | D-05 / D-03 | Removes mid-call Apply |
| Dense StatusBar always on | Status+timer in header; metrics in Debug | D-12 | StatusBar component becomes Debug section |
| Dual form slices | Single `assistantForm` | Research rec | Fixes FSD violation |
| ROADMAP redesign-v3-only | MUI-first settings/chrome | D-34 | Update ROADMAP note in ship docs |

**Deprecated/outdated:**
- `PlaygroundSession` v1 + stories-only path — **safe to delete** after V2 redesign lands (only consumers: index export + Storybook; page uses V2) [VERIFIED: codebase grep]
- `SettingsPanel`, `PlaygroundAssistantSettings`, `SettingsPopover` — dead once Setup sheet ships
- Title copy «Песочница» / Sandbox — replace with neutral product tone (D-43); UI-SPEC copy table

## Suggested Plan Wave Split (tracer-first)

| Plan | Wave | Scope | Depends | Notes |
|------|------|-------|---------|-------|
| **11-01** | 1 | Call chrome + center states (empty, checklist, connecting+18s, transcript, post-call summary strip); header status+timer; sticky mobile bar; mute/volume wired; retire permanent split (Debug hidden stub OK) | — | Keep existing DebugPanel mountable but closed; preserve session hook |
| **11-02** | 2 | Setup sheet + `AssistantSettingsForm` + autosave + form slice consolidation; remove popovers; D-03 gate | 11-01 | Highest FSD risk |
| **11-03** | 2 | Debug sheet + move StatusBar metrics + mic device select; default filters | 11-01 | Can parallel 11-02 if no shared file thrash |
| **11-04** | 3 | Assistants page migration to `AssistantSettingsForm`; keep Save header | 11-02 | D-36 |
| **11-05** | 3 | i18n ru/en/de/zh polish; remove dead V1; ROADMAP note; copy audit | 11-02, 11-03 | D-43/D-44 |

**Tracer alternative:** If planner prefers thinner first plan — 11-01a = mode shell + drawers with **existing** panels dropped in (ConversationPanel/DebugPanel/old settings) without visual polish, then 11-01b states polish. Prefer single 11-01 if capacity allows.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Assistants page keeps explicit Save after Plan 04 | Extract matrix | Product may want autosave there too — confirm if founder objects |
| A2 | Unmount autosave via async cleanup is acceptable (no sendBeacon) | Autosave | Rare lost edits on hard tab kill |
| A3 | `errorCount` for summary = count of error-category events | Pitfall 6 | Wrong metric definition |
| A4 | No MUI major upgrade in this phase | Standard Stack | Accidental upgrade breaks unrelated screens |
| A5 | Feature→feature import of AssistantSettingsForm into PlaygroundSession acceptable with documented exception | FSD | Lint CI fails if exception not allowed — then compose at page |

**If empty table:** N/A — assumptions listed above need planner awareness.

## Open Questions (RESOLVED)

1. **FSD import direction for AssistantSettingsForm** — **RESOLVED:** PlaygroundSession → AssistantSettingsForm feature→feature import with one documented `eslint-disable` for layer-imports (same pattern as current Assistants import); plans 11-02 / 11-04 stick to this (A5).
2. **Assistants create mode** — **RESOLVED:** `AssistantSettingsForm` supports create+edit via entity `assistantForm` (`initCreate`/`initEdit`); Playground uses edit-only; Assistants keeps explicit Save header (no Playground-style autosave on Assistants in Phase 11).
3. **Mic device select persistence** — **RESOLVED:** Session-only state in Debug sheet for Phase 11; pass `micDeviceId` into `connect` when set; no localStorage persistence.
## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | lint/tests | ✓ | v22.13.0 | — |
| npm | scripts | ✓ | 11.14.1 | — |
| Jest | unit tests | ✓ | ^29.4.2 | — |
| HTTPS / localhost | getUserMedia | ✓ (dev) | — | Checklist already warns |
| Backend playground WS | Live call | env-dependent | — | Manual checklist; unit tests mock hook |

**Missing dependencies with no fallback:** none for planning/execution of frontend plans.

**Step 2.6:** External runtime for CI is Node/npm only; WebRTC manual.

## Validation Architecture

> `workflow.nyquist_validation` not set to false in `.planning/config.json` — section included.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Jest ^29.4.2 |
| Config file | `config/jest/jest.config.ts` |
| Quick run command | `npm run test:unit -- --testPathPattern=PlaygroundSession` |
| Full suite command | `npm run test:unit` |
| Lint gate | `npm run lint:ts` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PG-UX-01 | Mode transitions / Setup blocked while connected | unit | `testPathPattern=playgroundMode` | ❌ Wave 0 |
| PG-UX-02 | Autosave success/fail gates Start | unit | `testPathPattern=useAutosaveAssistant` | ❌ Wave 0 |
| PG-UX-03 | Default filters exclude audio | unit | existing `eventProcessor` + Debug filter helper | ⚠️ partial |
| PG-UX-04 | Summary counts duration/errors/tools | unit | extend `eventProcessor.test.ts` | ⚠️ extend |
| PG-UX-06 | Mic checklist state machine | unit | `testPathPattern=useMicPermission` | ❌ Wave 0 |
| PG-UX-08 | Disconnect info still reaches page | unit/component | mock session disconnect | ❌ Wave 0 |
| PG-UX-09 | i18n keys present 4 locales | grep/script | locale key check | ❌ Wave 0 |
| WebRTC E2E | Real call | manual | checklist below | — |

### Sampling Rate
- **Per task commit:** targeted Jest pattern for touched module
- **Per wave merge:** `npm run test:unit -- --testPathPattern=PlaygroundSession|AssistantSettingsForm|eventProcessor`
- **Phase gate:** `npm run lint:ts` + unit suite green + manual WebRTC checklist

### Wave 0 Gaps
- [ ] `useAutosaveAssistant.test.ts` — PG-UX-02
- [ ] `useMicPermission.test.ts` — PG-UX-06
- [ ] Call center state pure helper tests (idle/connecting/post-call) — PG-UX-04
- [ ] Extend `eventProcessor.test.ts` for errorCount / summary aggregates
- [ ] Optional: component test for mode shell with mocked session

### Manual WebRTC Checklist (plans must cite)
1. Select assistant → lands in Call; mic prompt appears (D-27)
2. Start → connect ≤18s; transcript live; mute/volume work
3. Stop → summary strip; Start again without banner (D-07)
4. Open Setup after hangup → edit prompt → close → Start blocked if save fails
5. Debug sheet filters default; metrics visible; no permanent split
6. Mobile width: sticky Start/Stop; Setup/Debug fullscreen back closes
7. Onboarding `?onboarding=assistants&assistantId=…`: stripped chrome; ≥10s call fires success toast + analytics
8. Empty assistants → CTA to create
9. Switch assistant with history → confirm clears transcript

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no (existing session cookie/JWT) | — |
| V3 Session Management | no new | — |
| V4 Access Control | yes (tenant assistants via API) | Existing `useAssistant` / userId on select |
| V5 Input Validation | yes | Client validate before update; server DTO unchanged |
| V6 Cryptography | no | — |

### Known Threat Patterns for Playground UX

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via transcript/event payload | Tampering | React text escaping; avoid `dangerouslySetInnerHTML` |
| Over-broad assistant update | Elevation | Only update selected assistant id; RTK auth header |
| Mic permission phishing copy | Spoofing | Neutral product copy; no fake system dialogs |
| Debug event log PII retention | Info disclosure | Client-only buffer caps already (500/2000); no new persistence |

`security_enforcement`: treat as enabled (config absent).

## Sources

### Primary (HIGH confidence)
- Codebase: `PlaygroundSessionV2`, `usePlaygroundSession`, `PlaygroundHeader`, `PlaygroundLayout`, `DebugPanel`, `StatusBar`, `Playground.tsx`, form slices, `AssistantCard`/`AssistantForm` — read this session
- `11-CONTEXT.md`, `11-UI-SPEC.md` — locked decisions + design contract
- `.cursor/rules/aipbx-core.mdc`, `frontend-fsd.mdc`
- package.json dependency versions + `npm view @mui/material version`

### Secondary (MEDIUM confidence)
- [CITED: https://mui.com/material-ui/react-drawer/] — temporary/swipeable drawer behavior
- [CITED: https://mui.com/material-ui/react-accordion/] — controlled exclusive expand; `unmountOnExit` perf note
- [CITED: https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query] — microphone permission query

### Tertiary (LOW confidence)
- Unmount autosave reliability across browsers [ASSUMED]
- Exact Safari Permissions API `microphone` support quirks [ASSUMED — mitigate with getUserMedia fallback]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — reuse existing deps; versions verified in package.json
- Architecture: HIGH — mapped from live source + locked CONTEXT
- Pitfalls: HIGH for session/form/onboarding; MEDIUM for mute graph details until implemented

**Research date:** 2026-08-10  
**Valid until:** 2026-09-09 (30 days; UI libs stable if no MUI major bump)

---

## RESEARCH COMPLETE

**Phase:** 11 - Playground UX redesign for voice assistant testing  
**Confidence:** HIGH

### Key Findings
- Keep `usePlaygroundSession` mounted; replace resizable dual-pane with Call + Setup/Debug drawers (D-10).
- Consolidate on entity `assistantForm` + autosave via `useUpdateAssistant`; delete `playgroundAssistantForm` and features→pages imports.
- New `features/AssistantSettingsForm` (full field refactor, exclusive accordions); Assistants Save header stays until plan 04.
- Mute/volume + proactive mic + connecting 18s timeout + summary errorCount are **net-new** vs current code — plan them explicitly.
- Preserve Playground page ≥10s onboarding analytics (`playground_call_success` + `first_call`).

### File Created
`.planning/phases/11-playground-ux-redesign-for-voice-assistant-testing/11-RESEARCH.md`

### Confidence Assessment
| Area | Level | Reason |
|------|-------|--------|
| Standard Stack | HIGH | No new packages; MUI already in repo |
| Architecture | HIGH | Verified coupling + clear ownership map |
| Pitfalls | HIGH | Dual-slice, session unmount, onboarding confirmed in code |

### Open Questions (RESOLVED)
- FSD: feature→feature import + documented eslint-disable (plans 11-02/11-04)
- Assistants: keep explicit Save; form supports create+edit; no Assistants autosave in Phase 11
- Mic device: session-only in Debug (no localStorage)
### Ready for Planning
Research complete. Planner can now create PLAN.md files.
