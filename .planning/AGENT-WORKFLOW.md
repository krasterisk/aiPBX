# Agent Weekly Workflow — Solo Founder

Canonical routine for aiPBX development with GSD agents.

## Weekly schedule

| Day | Agent task | Founder task | Time |
|-----|------------|--------------|------|
| **Monday** | Pick 1 GAP from `GAPS.md` → `/gsd-discuss-phase` | Choose priority based on sales feedback | 30 min |
| **Tuesday** | `/gsd-plan-phase` → output PLAN.md | Review plan, approve or adjust scope | 20 min |
| **Wed–Thu** | `/gsd-execute-phase` (waves) | Review PRs/diffs, answer questions | 1–2 h/day |
| **Friday** | `/gsd-verify-work` + `/gsd-code-review` | Manual UAT, deploy decision | 1 h |
| **Daily** | — | Sales calls, demos, support | 60% of week |

## Phase lifecycle

```
GAP → discuss → spec → plan → execute → verify → review → STATE.md update → deploy
```

### Commands (Cursor GSD skills)

| Step | Skill / command |
|------|-----------------|
| Inventory | Read `.planning/intel/*` |
| Discuss | `/gsd-discuss-phase` |
| Spec | `/gsd-spec-phase` |
| Plan | `/gsd-plan-phase` |
| Execute | `/gsd-execute-phase` |
| Verify | `/gsd-verify-work` |
| Code review | `/gsd-code-review` |
| Security (billing/telephony) | `/gsd-secure-phase` |

## Rules

1. **Max 1 active product phase** + optional 1 GTM task
2. **Never skip verify** for billing, telephony, or auth changes
3. **Update STATE.md** after every completed phase
4. **Deploy** only with `[deploy all]` or `[deploy:1|2|3]` tag on master
5. **Sales feedback → GAPS.md** within 24 hours

## Deploy checklist

- [ ] CI green (lint + tests) on both repos
- [ ] Manual smoke: login, playground, one dashboard
- [ ] Commit message includes deploy tag if deploying
- [ ] Verify health on target server after deploy

## Monthly rituals

| Task | Command |
|------|---------|
| Backlog grooming | Review `GAPS.md`, reprioritize |
| UAT audit | `/gsd-audit-uat` |
| Docs sync | Check `intel/DOCS-INDEX.md` for stale ARCHIVE docs |
| GTM review | Update `intel/GTM-CONTENT-PLAN.md` |

## Context files (read before every phase)

1. `.planning/PROJECT.md`
2. `.planning/GAPS.md`
3. `.planning/intel/RISKS.md` (if touching API/billing/telephony)
4. `.planning/STATE.md`
