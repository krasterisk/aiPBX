---
phase: 11
slug: playground-ux-redesign-for-voice-assistant-testing
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-10
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest ^29.4.2 + ts-jest + @testing-library/react |
| **Config file** | `config/jest/jest.config.ts` |
| **Quick run command** | `npm run test:unit -- --testPathPattern=PlaygroundSession\|AssistantSettingsForm\|eventProcessor\|useAutosave\|useMicPermission\|callCenter` |
| **Full suite command** | `npm run test:unit` |
| **Lint gate** | `npm run lint:ts` |
| **Estimated runtime** | ~30–90 seconds (targeted); full suite longer |

---

## Sampling Rate

- **After every task commit:** Run the plan task's `<automated>` command
- **After every plan wave:** `npm run test:unit -- --testPathPattern=PlaygroundSession|AssistantSettingsForm|eventProcessor`
- **Before `/gsd-verify-work`:** `npm run lint:ts` + `npm run test:unit` green + manual WebRTC checklist
- **Max feedback latency:** 90 seconds for targeted patterns

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 1 | PG-UX-01 | T-11-01 | Mode shell keeps session mounted | unit | `npm run test:unit -- --testPathPattern=playgroundMode` | ❌ W0 | ⬜ pending |
| 11-01-02 | 01 | 1 | PG-UX-04, PG-UX-06 | T-11-02 | Mic probe + summary aggregates | unit | `npm run test:unit -- --testPathPattern=useMicPermission\|callCenter\|eventProcessor` | ❌ W0 | ⬜ pending |
| 11-01-03 | 01 | 1 | PG-UX-05, PG-UX-08 | T-11-03 | DisconnectInfo still reaches page | unit | `npm run test:unit -- --testPathPattern=Playground` | ❌ W0 | ⬜ pending |
| 11-02-01 | 02 | 2 | PG-UX-07 | T-11-04 | Form fields bind to assistantForm only | unit | `npm run test:unit -- --testPathPattern=AssistantSettingsForm` | ❌ W0 | ⬜ pending |
| 11-02-02 | 02 | 2 | PG-UX-02 | T-11-04 | Autosave fail blocks Start | unit | `npm run test:unit -- --testPathPattern=useAutosaveAssistant` | ❌ W0 | ⬜ pending |
| 11-02-03 | 02 | 2 | PG-UX-02, PG-UX-07 | T-11-04 | No playgroundAssistantForm imports in features | grep+lint | `npm run lint:ts` | ✅ infra | ⬜ pending |
| 11-03-01 | 03 | 3 | PG-UX-03 | T-11-05 | Default filters exclude audio | unit | `npm run test:unit -- --testPathPattern=DebugPanel\|debugFilters` | ⚠️ partial | ⬜ pending |
| 11-03-02 | 03 | 3 | PG-UX-03, PG-UX-06 | — | Mic device id passed to connect | unit | `npm run test:unit -- --testPathPattern=DebugSheet\|usePlaygroundSession` | ❌ W0 | ⬜ pending |
| 11-04-01 | 04 | 3 | PG-UX-07 | T-11-04 | Assistants edit uses shared form | lint | `npm run lint:ts` | ✅ infra | ⬜ pending |
| 11-04-02 | 04 | 3 | PG-UX-07 | — | Header Save still present | grep | locale/key + Assistants header grep | ✅ infra | ⬜ pending |
| 11-05-01 | 05 | 4 | PG-UX-01…08 | — | Four-locale key parity | grep/script | locale key check across ru/en/de/zh | ❌ W0 | ⬜ pending |
| 11-05-02 | 05 | 4 | PG-UX-08 | T-11-03 | Dead V1 gone; disconnect contract intact | unit+lint | `npm run test:unit -- --testPathPattern=Playground` + `lint:ts` | ⚠️ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Create these scaffolds in the plan that first needs them (prefer 11-01 / 11-02 early tasks):

- [ ] `src/features/PlaygroundSession/model/playgroundMode.test.ts` — PG-UX-01 mode transitions / Setup blocked while connected
- [ ] `src/features/PlaygroundSession/model/useMicPermission.test.ts` — PG-UX-06 checklist state machine
- [ ] `src/features/PlaygroundSession/model/callCenterState.test.ts` — PG-UX-04 idle/connecting/post-call pure helper
- [ ] `src/features/PlaygroundSession/lib/eventProcessor.test.ts` — extend for errorCount / summary aggregates (PG-UX-04)
- [ ] `src/features/PlaygroundSession/model/useAutosaveAssistant.test.ts` — PG-UX-02 (created in 11-02)
- [ ] `src/features/AssistantSettingsForm/**/*.test.ts(x)` — PG-UX-07 smoke (created in 11-02)
- [ ] Optional: disconnect-info plumbing test under `src/pages/Playground/` — PG-UX-08

Existing infrastructure: Jest + RTL already configured — no framework install.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Real WebRTC call + mute/volume | PG-UX-04, PG-UX-06 | Needs mic + backend WS | RESEARCH checklist items 1–3 |
| Autosave fail blocks Start in browser | PG-UX-02 | Needs forced API fail | Checklist item 4 |
| Debug sheet + no permanent split | PG-UX-03 | Visual/layout | Checklist item 5 |
| Mobile sticky bar / fullscreen sheets | PG-UX-05 | Viewport | Checklist item 6 |
| Onboarding ≥10s analytics | PG-UX-08 | Live analytics | Checklist item 7 |
| Long prompt scroll in Setup accordion | UI-SPEC backstop | Visual | Open Setup, paste long prompt, confirm sheet width stable |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s for targeted runs
- [ ] `nyquist_compliant: true` set in frontmatter after validate-phase

**Approval:** pending
