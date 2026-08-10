---
phase: 11
slug: playground-ux-redesign-for-voice-assistant-testing
status: approved
shadcn_initialized: false
preset: none
created: 2026-08-10
reviewed_at: 2026-08-10
---

# Phase 11 — UI Design Contract

> Visual and interaction contract for Playground UX redesign. Locks modern MUI-first UI for Setup/Call/Debug and `AssistantSettingsForm`. Implements CONTEXT D-01…D-44.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (no shadcn) |
| Preset | not applicable |
| Component library | **MUI v5+** (direct `@mui/material` / `@mui/icons-material`) + existing `src/shared/ui/mui/*` wrappers |
| Icon library | **Lucide React** for Playground chrome icons (Play, Square, Settings, Mic, Volume); MUI icons only inside dense form controls if needed |
| Font | App default stack already in theme (`--font-m` / system UI stack used by redesign); **do not introduce Inter/Roboto as a new display face** — inherit app typography |
| Styling | MUI `sx` / theme tokens for form density; SCSS modules for Playground layout shells; CSS variables from `src/app/styles/themes/*` and `design-system.scss` |
| Architecture note | **Explicit deviation** from `.docs/FRONTEND_ARCHITECTURE.md` component-selection rules for this phase: prefer MUI direct or new `shared/ui/mui` wrappers. Still **FSD**. `redesign-v3` optional for chrome, not mandatory. |

### Component policy (locked)

| Need | Source |
|------|--------|
| Drawer / Debug sheet / Setup sheet | Existing `shared/ui/mui/Drawer` **or** MUI `Drawer`/`SwipeableDrawer` with phase-specific width tokens |
| Text fields | Prefer `shared/ui/mui/Input`, `Textarea`, `Combobox`, `Check`, `Slider`; if missing → add wrapper under `shared/ui/mui/` then use |
| Accordion (Setup sections) | MUI `Accordion` / `AccordionSummary` / `AccordionDetails` — add thin `shared/ui/mui/Accordion` only if reuse across Assistants+Playground needs a public API |
| Chips (mobile checklist) | MUI `Chip` |
| Tooltip (mic deny instructions) | MUI `Tooltip` |
| Dialog (assistant switch confirm) | MUI `Dialog` |
| Mute / volume | MUI `IconButton` + `Slider` (reuse `shared/ui/mui/Slider`) |
| Toast | Existing `react-toastify` (connection errors) — do not invent a second toast system |
| Primary/secondary buttons | MUI `Button` **or** existing redesigned Button if already themed; prefer one system per surface — **Playground Call chrome: MUI Button**; form actions inside Setup: MUI Button |

**Do not** rebuild permanent `react-resizable-panels` 65/35 split as default (D-10).

---

## Layout Contract

### Modes

| Mode | Desktop | Mobile (<900px) |
|------|---------|-----------------|
| **Call** (default after assistant select) | Single column: Header → Center (checklist / transcript / summary) → optional sticky actions | Fullscreen stack; Start/Stop in **sticky bottom bar** (56px + safe-area) |
| **Setup** | Right or full-height **sheet/drawer** over Call (width **420px**, max 100%); accordion form | Fullscreen sheet with back arrow |
| **Debug** | Right **sheet/drawer** (width **400px**); event list + filters + metrics + mic device select | Fullscreen sheet |

### Call header (always)

Left → Right:
1. Assistant select (disabled while `connected`)
2. Secondary controls: «Открыть настройки», «Открыть события» — **desktop: icon + visible text label**; **mobile: icon-only** with required `aria-label` matching the copy table + tooltip on hover/long-press (onboarding: visually subdued / smaller)
3. Connection status dot + short label
4. Timer `MM:SS` (only when connected or post-call of current session)
5. Desktop: Start / Stop primary button group — Stop uses destructive color, **no confirm dialog** (immediate hangup)
6. Mute + volume (compact) when session active or idle-with-mic-ready — Mute is **icon-only** with `aria-label` from Mute/Unmute copy + tooltip

### Call center states

| State | Center content |
|-------|----------------|
| No assistants | Empty state + CTA «Создать ассистента» |
| Idle (assistant selected) | Readiness checklist (mic / assistant / model) + collapsed «Последний тест · N» if history |
| Connecting | Centered progress + «Отменить подключение»; after **18s** timeout message + same cancel control → idle |
| Connected | Live transcript (primary); auto-scroll |
| Error (connection) | Return to idle chrome; toast + header error status (no dedicated Retry) |
| Post-call | Summary strip (duration, errors count, tool-call count) above frozen transcript |

### Setup form structure

Accordions (exclusive expand):
1. **Промпт** — default expanded
2. **Параметры** — model + main params (2-col desktop / 1-col mobile)
3. **VAD**
4. **Инструменты** — tools/MCP at bottom

No Save button; closing Setup / Start triggers autosave. Autosave fail keeps Setup open + inline error + blocks Start.

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, chip padding-y |
| sm | 8px | Compact control gaps, accordion dense padding |
| md | 16px | Default element spacing, header item gaps |
| lg | 24px | Section padding inside sheets |
| xl | 32px | Layout gaps between header and center |
| 2xl | 48px | Empty-state vertical rhythm |
| 3xl | 64px | Rare page-level breathing (empty state only) |

Exceptions: sticky bottom bar height **56px** (multiple of 4); drawer widths **400/420** (layout, not spacing scale).

Density: Setup forms use MUI `size="small"` controls; accordion summary min-height **48px**.

---

## Typography

Maximum 4 roles; **maximum 2 font weights** (400 regular + 600 semibold):

| Role | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Body | 14px | 400 | 1.5 | Transcript, form helpers, event rows |
| Label | 12px | 400 | 1.4 | Checklist chips, status, timer, accordion meta, speaker names |
| Heading | 18px | 600 | 1.3 | Sheet titles, empty-state title, post-call summary title |
| Display | 24px | 600 | 1.25 | Empty-state hero numeral/icon label only (optional); otherwise unused |

No fifth size. No weight 500 — labels stay regular (400); emphasis only via Heading/Display 600.

---

## Color

Map to existing CSS variables (light / dark). Hex below = **light theme** reference; implement via vars.

| Role | Value (light) | Dark | Usage |
|------|---------------|------|-------|
| Dominant (60%) | `#eff5f6` (`--bg-redesigned`) | `#0c1214` | Page / Call background |
| Secondary (30%) | `#ffffff` / glass surfaces | glass overlays on `#0c1214` | Sheets, header bar, summary strip, accordion surfaces |
| Accent (10%) | `#00c8ff` (`--accent-redesigned`) | `#5ed3f3` | **Reserved list only** (below) |
| Destructive | `#ef4444` (`--status-error`) | same family | Stop call, error checklist chip, destructive confirm |
| Success | `#10b981` | same | Mic OK / connected status |
| Warning | `#f59e0b` | same | Connecting timeout warning |
| Text | `#141c1f` (`--text-redesigned`) | `#dbdbdb` | Primary text |

**Accent reserved for (only):**
1. Primary CTA «Начать тест» filled background (and focus ring)
2. Connection status **connected** indicator
3. Active accordion indicator / expanded summary accent bar (2px)
4. Focus rings on form fields in Setup

**Not accent:** secondary icon buttons, Debug open state (use text/secondary), transcript bubbles, chips default, Mute button (neutral until muted → warning/destructive tint).

Avoid purple-indigo gradient themes and glow-heavy chrome.

---

## Motion

| Motion | Spec |
|--------|------|
| Sheet open/close | MUI Drawer default (~225ms) |
| Accordion expand | MUI default |
| Transcript append | Instant; optional 120ms fade-in per bubble max |
| Sticky bar | No bounce; appear with Call mode |

Max intentional motions: sheet, accordion, subtle bubble fade — no decorative ambient animation.

---

## Copywriting Contract

Tone: **neutral product** (кабинет). Locales: **ru, en, de, zh**. Table shows RU primary + EN.

| Element | Copy (RU) | Copy (EN) |
|---------|-----------|-----------|
| Primary CTA (idle) | Начать тест | Start test |
| Primary CTA (connecting) | Подключение… | Connecting… |
| Stop CTA | Завершить звонок | End call |
| Configure | Открыть настройки | Open settings |
| Debug open | Открыть события | Open events |
| Empty state heading | Нет ассистентов | No assistants yet |
| Empty state body | Создайте ассистента, чтобы начать тест голосового сценария. | Create an assistant to start testing your voice flow. |
| Empty state CTA | Создать ассистента | Create assistant |
| Checklist mic OK | Микрофон готов | Microphone ready |
| Checklist mic deny (short) | Нет доступа к микрофону | Microphone blocked |
| Mic deny tooltip | Откройте настройки сайта в браузере → Разрешения → Микрофон → Разрешить, затем нажмите «Повторить проверку». | Open site settings in your browser → Permissions → Microphone → Allow, then tap Retry check. |
| Checklist retry | Повторить проверку | Retry check |
| Previous session | Последний тест · {n} реплик | Last test · {n} turns |
| Connecting timeout | Не удалось подключиться вовремя. Проверьте сеть и попробуйте снова. | Could not connect in time. Check your network and try again. |
| Connecting cancel | Отменить подключение | Cancel connection |
| Connection error toast | Ошибка соединения. Подробности — в «События». | Connection error. See details in Events. |
| Autosave error | Не удалось сохранить настройки. Исправьте ошибки и попробуйте снова. | Could not save settings. Fix the errors and try again. |
| Assistant switch confirm title | Сменить ассистента? | Switch assistant? |
| Destructive confirmation | Сменить ассистента: история текущего теста будет очищена. Продолжить? | Switch assistant: the current test history will be cleared. Continue? |
| Confirm action | Сменить ассистента | Switch assistant |
| Dismiss confirm | Оставить текущего | Keep current assistant |
| Post-call summary title | Итог теста | Test summary |
| Summary duration | Длительность | Duration |
| Summary errors | Ошибки | Errors |
| Summary tools | Вызовы инструментов | Tool calls |
| Setup sections | Промпт / Параметры / VAD / Инструменты | Prompt / Parameters / VAD / Tools |
| Mute | Выключить звук | Mute |
| Unmute | Включить звук | Unmute |

Generic labels **forbidden** as CTA: Submit, OK, Save, Cancel, Click here.

**Note vs CONTEXT D-02:** decision text used «Настроить»; product copy upgrades to verb+noun **«Открыть настройки»** / Open settings (intentional, not a behavior change).

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not required |
| MUI (`@mui/material`) | Drawer, Accordion, Button, Chip, Dialog, Tooltip, IconButton, Slider, Stack, Grid2, LinearProgress | already in repo dependency — no shadcn view gate |
| Lucide | chrome icons | already in repo |

New shared wrappers go only under `src/shared/ui/mui/{Name}/` with public `index.ts` (FSD).

---

## Consistency with CONTEXT

| Decision | UI-SPEC coverage |
|----------|------------------|
| D-01…D-04 modes/Setup | Layout Contract |
| D-05…D-08 autosave/tools | Layout + Copy |
| D-09…D-12 Debug | Layout + Color (metrics off chrome) |
| D-13…D-16 call states | Call center states |
| D-17…D-21 mobile | Layout mobile column |
| D-22…D-24 onboarding | Header secondary treatment |
| D-25…D-30 mic/audio | Copy + Mute/volume in header |
| D-31…D-36 form slice | Design System + Setup structure |
| D-37…D-42 switch/errors/empty/timeout | Copy + states |
| D-43…D-44 i18n | Copywriting Contract |

---

## UI Considerations

Applicable state considerations resolved: 8 covered, 1 backstop, 0 unresolved

| Category | Element(s) | Status | Resolution / Reason |
|----------|------------|--------|---------------------|
| empty | Assistants list / Call center | ✅ covered | Empty assistants renders empty-state heading/body + CTA «Создать ассистента» (Copywriting Contract) |
| loading | Connecting state | ✅ covered | Centered progress + «Отменить подключение»; after 18s timeout message + cancel → idle |
| error | Connection fail | ✅ covered | Toast + header error status; details in Events; recovery via normal Start from idle |
| error | Mic permission deny | ✅ covered | Red checklist item + short warning; detailed instructions in tooltip; «Повторить проверку» |
| error | Autosave fail | ✅ covered | Stay in Setup; inline autosave error copy; Start blocked until save succeeds |
| populated | In-call transcript | ✅ covered | Live transcript is primary center content while connected |
| partial | Idle with previous session | ✅ covered | Checklist + collapsed «Последний тест · N реплик» when history exists |
| zero-one-many | Event filters in Debug | ✅ covered | Default filters as today (almost all except raw audio); user toggles categories |
| long-text | Prompt accordion textarea | 🧪 backstop | Visual check: long prompt scrolls inside accordion without breaking sheet width |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-08-10
