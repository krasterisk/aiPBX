# Roadmap

## Phase 1: Dashboard Insights Upgrade

**Goal:** Replace plain-string AI insights with grounded structured insights end-to-end (backend contract + unified pipeline + frontend UI).

**Requirements:** REQ-01, REQ-02, REQ-03, REQ-04, REQ-05, REQ-06, REQ-07, REQ-08, REQ-09, REQ-10

**Repos:**
- Backend: `../aiPBX_backend` (or `c:/Users/Professional/WebstormProjects/aiPBX_backend`)
- Frontend: this repo (`aiPBX`)

**Plans:**
| Plan | Wave | Objective |
|------|------|-----------|
| 01-01 | 1 | Insights schema, facts builder, prompt + JSON schema |
| 01-02 | 2 | Service unification, controller, tests, env docs |
| 01-03 | 3 | Frontend types/API + AiInsightsBanner redesign + i18n + userId wiring |

**Deferred (Phase 2 follow-up):** REQ-11 — drill-down, persist runs, Redis, offline eval
