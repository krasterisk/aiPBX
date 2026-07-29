# Phase 10: Speech analytics UX overhaul - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-29
**Phase:** 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t
**Areas discussed:** Operator drill-down UX, Costs removal & layout cleanup, Tag/topic model, Dashboard IA

---

## Operator drill-down UX

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated page | Route `/reports/operators/:id` | |
| Side panel/drawer | Over dashboard | ✓ |
| Calls filter first | Phase 3 `/calls` pattern first | |
| You decide | | |

**User's choice:** Side panel/drawer
**Notes:** Chain metric→evidence→calls; call stacks in same panel; identity by operatorName; aggregated assessments API; period=dashboard; no deep-link URL; hide metrics without evidence

---

## Costs removal & fixed-layout cleanup

| Option | Description | Selected |
|--------|-------------|----------|
| Only StatCards | Remove cost cards, keep Usage | |
| OperatorUsageSection only | Remove usage block; keep cost StatCards | ✓ (clarified) |
| All analytics cost | Dashboard + reports | |
| You decide | | |

**User's choice:** Remove OperatorUsageSection; keep cost StatCards; also remove Динамика + Активность from fixed OA; heatmap builder-only
**Notes:** User noted OA «Активность» chart type differs from summary dashboard; chose builder retention over migrating heatmap to summary

---

## Tag/topic model

| Option | Description | Selected |
|--------|-------------|----------|
| Project taxonomy | Controlled vocabulary | ✓ |
| LLM free tags | | |
| Hybrid + moderation | | |
| Keyword-only env list | | |

**User's choice:** Project taxonomy; auto+manual; Themes section+panel; stats set 1; settings/wizard; keyword match; multi-tag; no historical retag; empty state+link; OA perms; chips+card+CSV
**Notes:** Asked for best-practice recommendation; accepted taxonomy-first, LLM deferred

---

## Dashboard IA

| Option | Description | Selected |
|--------|-------------|----------|
| Single scroll | Fixed order | ✓ |
| Tabs | Overview/Operators/Themes | |
| Builder-first | | |
| You decide | | |

**User's choice:** Single scroll; order Stats→Insights→charts→metrics→Themes→Ranking; builder replaces mid-charts but Themes+Ranking always below; manager-first; Insights after Stats; Themes need project; mobile fullscreen / desktop side panel
**Notes:** —

---

## Claude's Discretion

- Aggregate API shapes; tag storage field design; visual polish within manager-first

## Deferred Ideas

- LLM free tags / hybrid moderation / closed-set LLM
- Batch retag period
- Operator panel deep-link URL
- operatorId identity
- Heatmap on summary dashboard
- Billing module changes
