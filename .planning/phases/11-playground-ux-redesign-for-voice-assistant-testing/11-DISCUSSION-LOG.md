# Phase 11: Playground UX redesign for voice assistant testing - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-10
**Phase:** 11-playground-ux-redesign-for-voice-assistant-testing
**Areas discussed:** Primary layout, Settings vs session, Debug/events, Pre/in/post-call, Mobile, Onboarding, Mic/audio, Setup cards, Assistant switch, Connection errors, i18n, Assistants migration, Empty account, Connecting timeout, Leave page, Audio output

---

## Primary layout model

| Option | Description | Selected |
|--------|-------------|----------|
| Call-first | One focus call UI | |
| Setup → Call | Two explicit modes | ✓ |
| Dual-pane lab | Chat + events always | |
| You decide | | |

**User's choice:** Setup → Call
**Notes:** Transition corrected to auto-enter Call after assistant select; Setup via «Настроить». Mid-call edits only after hangup. Full settings in Setup with compact card redesign.

---

## Settings vs session

| Option | Description | Selected |
|--------|-------------|----------|
| Draft + Save | Explicit save | |
| Immediate save each change | | |
| Autosave on leave/before call | | ✓ |
| You decide | | |

**Autosave fail:** Block call (selected). **Restart:** Normal Start only. **Tools:** Separate accordion.

---

## Debug / events

| Option | Description | Selected |
|--------|-------------|----------|
| Hidden by default | | ✓ |
| Collapsed rail | | |
| Always visible | | |

**UI:** Side sheet/drawer. **Filters:** as today except audio. **Metrics:** connection+timer only on Call.

---

## Pre / in / post call

**Idle:** Checklist + access to previous session via collapsed block. **In-call:** live transcript. **Post-call:** brief summary + transcript.

---

## Mobile

Fullscreen stack; landscape ≈ narrow desktop; back closes sheets with autosave; sticky bottom Start/Stop; checklist chips.

---

## Onboarding

Stripped flow; Setup/Debug secondary collapsed; assistantId preselect with changeable select.

---

## Mic / permissions / audio

Checklist errors; permanent deny = short warning + tooltip instructions; proactive permission on Call enter; device select in Debug only; mid-call lost = error + user hangup; **mute/volume in Call UI**.

---

## Setup cards

Accordions (Prompt default open); 2-col desktop / 1-col mobile; full card refactor; MUI allowed under FSD; new feature `AssistantSettingsForm`; Playground first, Assistants page plan 2.

---

## Assistant switch / connection / empty / connecting / leave

Confirm on switch; select disabled during call; toast+header for connection errors, no Retry; empty CTA create assistant; connecting timeout 15–20s + Cancel; leave Setup = silent autosave.

---

## i18n

Neutral product tone; locales ru+en+de+zh.

---

## Claude's Discretion

Visual density details, sheet dimensions, exact timeout in 15–20s, MUI component picks, summary field details, dead-code cleanup of PlaygroundSession v1.

## Deferred Ideas

Inline create in Playground; dedicated Retry; always-on dual-pane debug.
