# Phase 10: Speech analytics UX overhaul — operator drill-down, call tags, topic reports - Research

**Researched:** 2026-07-30
**Domain:** Full-stack analytics UX (React 18 / FSD / RTK Query + NestJS 11 / Sequelize / PostgreSQL) — panel-based drill-down, controlled taxonomy tagging, in-request aggregation
**Confidence:** HIGH (codebase-verified); MEDIUM on UX density/visual specifics (Claude's discretion)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Operator drill-down UX
- **D-01:** Enter operator from «Рейтинг операторов» via **side panel / drawer** over the dashboard (not a dedicated route). — *Reversibility: reversible*
- **D-02:** Explanation chain inside panel: **metric → evidence → calls**. — *Reversibility: reversible*
- **D-03:** Opening a call **stacks inside the same panel** (back returns to operator metric context); do not navigate away to `/calls` for this flow. — *Reversibility: reversible*
- **D-04:** Identify operator by **`operatorName`** (as in current `AgentScorecard`). — *Reversibility: costly — later id-based identity needs scorecard/API + migration of filters*
- **D-05:** Metric-level evidence = **aggregated** top quotes/rationales from `_assessments` across the operator's calls (API support as needed). — *Reversibility: costly — new aggregate API/shape*
- **D-06:** Panel period/filters **strictly match** dashboard `startDate` / `endDate` / `projectId`. — *Reversibility: reversible*
- **D-07:** **No** shareable deep-link / query for open panel — UI state only. — *Reversibility: reversible*
- **D-08:** If assessments missing: **hide metrics without evidence**; show only metrics that have quotes/rationales. — *Reversibility: reversible*

#### Costs removal & fixed-layout cleanup
- **D-09:** Remove **`OperatorUsageSection`** from the OA analytics dashboard. — *Reversibility: reversible*
- **D-10:** **Keep** cost StatCards («Общая стоимость» / «Средняя стоимость»). — *Reversibility: reversible*
- **D-11:** Remove **«Динамика звонков»** and **«Активность»** (`HeatmapCalendar`) from OA **fixed** layout (they duplicate volume views better suited to summary dashboard; note OA heatmap chart type differs from summary). — *Reversibility: reversible*
- **D-12:** Keep heatmap available as a **Dashboard Builder** widget only; do not change summary dashboard in this phase. — *Reversibility: reversible*

#### Tag / topic model
- **D-13:** **Project taxonomy** (controlled vocabulary) for themes/tags — not free-form LLM tags in Phase 10. — *Reversibility: costly — taxonomy stored on project; later LLM tags need coexistence rules*
- **D-14:** Tags applied **automatically on analysis** + **manual edit** on call card after analysis. — *Reversibility: reversible*
- **D-15:** Theme reports live as **«Темы» section on OA dashboard** → same side-panel drill-down pattern as operators. — *Reversibility: reversible*
- **D-16:** Tag panel summary: **call count, avg score, sentiment mix, success rate** → then call list. — *Reversibility: reversible*
- **D-17:** Taxonomy CRUD in **project settings / Project Wizard** (alongside custom metrics). — *Reversibility: reversible*
- **D-18:** Matching at analysis = **keyword/phrase** against dictionary aliases (extend current spotting); no LLM classification in Phase 10. — *Reversibility: reversible*
- **D-19:** **Multi-tag** per call; reports/filters use "contains tag". — *Reversibility: reversible*
- **D-20:** Dictionary changes affect **new analyses only** — no automatic historical retag. — *Reversibility: reversible*
- **D-21:** Empty taxonomy: show **empty state** on «Темы» with link to project settings (do not hide silently). — *Reversibility: reversible*
- **D-22:** Manual tag edit permissions = **existing OA project/report permissions** (no new roles). — *Reversibility: reversible*
- **D-23:** Surface tags on **call journal chips + call card + CSV export**. — *Reversibility: costly — export schema change*

#### Dashboard IA
- **D-24:** **Single scroll** layout (no tabs). — *Reversibility: reversible*
- **D-25:** Fixed section order: **Stats → AI Insights → sentiment/success → avg metrics → custom metrics → Темы → Рейтинг операторов**. — *Reversibility: reversible*
- **D-26:** When `dashboardConfig` present: builder grid **replaces mid-charts**; **Темы + Рейтинг always remain below**. — *Reversibility: reversible*
- **D-27:** **Manager-first** density: larger sections, less clutter, clear CTAs into operator/topic panels. — *Reversibility: reversible*
- **D-28:** AI Insights stays **after Stats** (current placement). — *Reversibility: reversible*
- **D-29:** Dashboard usable **without project** (org aggregate); **«Темы» only when a project is selected**. — *Reversibility: reversible*
- **D-30:** Side panel: **mobile fullscreen**; desktop side panel ~480–560px. — *Reversibility: reversible*

### Claude's Discretion
- Visual polish details within manager-first density (spacing, CTA copy) not micro-specified
- Exact aggregate API payload shape for operator evidence / tag stats (researcher/planner)
- Whether to extend `_topics.keywords` vs dedicated tag fields — prefer coherent with existing metrics storage unless research finds a clear better fit

### Deferred Ideas (OUT OF SCOPE)
- LLM free-form tags / hybrid "new theme" moderation UI
- LLM closed-set classification into taxonomy
- Batch «перетегировать период» without full re-analysis
- Shareable deep-link URL for open operator/topic panel
- Stable `operatorId` instead of name-only identity
- Moving/adding OA-style heatmap onto summary dashboard
- Changing billing/payment modules (out of scope)
</user_constraints>

<phase_requirements>
## Phase Requirements

No `REQ-*` IDs were assigned to Phase 10 (`.planning/REQUIREMENTS.md` covers Phase 1 only; `REQ-11` is the Phase-3 deferral note that Phase 10 partially discharges). Traceability therefore runs **ROADMAP scope row → CONTEXT decision → research support**:

| ROADMAP scope row | Decisions | Research Support |
|---|---|---|
| Dashboard UX — информативность без перегруза | D-24…D-29 | `OperatorDashboard.tsx` section map + `hasCustomDashboard` ternary boundary (Pattern 1, Pitfall 3) |
| Убрать расходы | D-09, D-10 | Removal inventory + orphan/tour-anchor audit (Runtime State Inventory, Pitfall 4) |
| Рейтинг операторов drill-down «почему такие баллы» | D-01…D-08 | SidePanel stack pattern (Pattern 1–2) + new `operator-evidence` endpoint contract (Pattern 3) |
| Теги звонков + отчёты по темам | D-13…D-23 | Taxonomy storage decision (Pattern 4), `keyword-spotting` extension (Pattern 5), `tagStats` in `getDashboard` (Pattern 6) |
| Модуль целиком (UX для маркетолога / руководителя КЦ) | D-27, D-30 | Manager-first density guidance + `@include mobile` breakpoint convention |
| GAP-11 residual (drill-down debt) | all | Phase 3 shipped `/calls`-based insight drill-down only; operator/topic evidence drill-down was never built |
</phase_requirements>

## Summary

This phase is **almost entirely an internal-codebase problem, not a library problem**. Every capability Phase 10 needs already has a working precedent in the two repos: side sheets (`shared/ui/mui/Drawer` on MUI `SwipeableDrawer`), per-call metric evidence rendering (`ReportShowAnalytics` reads `metrics._assessments`), in-request aggregation without new endpoints (`buildAgentScorecards`, `aggregateCustomMetrics` inside `getDashboard`), project-scoped JSON schema config (`operator_projects.customMetricsSchema`), keyword spotting (`lib/keyword-spotting.ts` → `metrics._topics.keywords`), a "manual correction stored in a separate table" pattern (`operator_metric_overrides`), and a tenant-safe cache (`InsightsCacheService`). **No new npm dependency is required for any part of Phase 10.**

The three genuinely new things are (1) a **right-anchored, stackable side panel** — the existing `redesigned/Drawer` is a bottom sheet with a module-scope `window.innerHeight` snapshot and no focus trap, so it cannot satisfy D-30; (2) an **aggregated operator-evidence endpoint** — `_assessments` lives only inside the `aiAnalytics.metrics` JSON blob, so there is no way to aggregate quotes in SQL and a dedicated, bounded, tenant-scoped read endpoint is required (D-05); and (3) a **project tag taxonomy** — the current keyword list is a single global env var (`OPERATOR_KEYWORD_SPOTTING`), so a per-project dictionary is a real schema addition needing dual-dialect SQL migrations (Sequelize `sync: { alter: true }` is commented out in `config/database.config.ts`).

The highest-risk decisions are storage-shaped, not UI-shaped. Two traps will silently destroy data if the planner follows the obvious path: `writeMetricValues()` calls `metricValueRepository.destroy({ where: { channelId } })` before every bulk insert, so any tag stored in `operator_metric_values` is wiped on every re-analysis; and `OperatorAnalytics.transcription` is **encrypted at rest** via a Sequelize getter/setter, so no SQL `LIKE`-based historical retag is even possible — which independently confirms D-20 is the only correct choice.

**Primary recommendation:** Build one `redesign-v3/SidePanel` on MUI `Drawer anchor="right"` driven by a single panel-stack state array (never nested drawers); add exactly two backend read surfaces (`GET /operator-analytics/operator-evidence` and a `tagStats` block inside the existing `getDashboard` payload) plus two write surfaces (`callTaxonomy` on project PATCH, `PATCH /operator-analytics/:id/tags`); store per-call tags dual-write — `metrics._topics.tags` as the single read path, `operator_call_tags` as the queryable/auditable table with `source: 'auto' | 'manual'`; and treat removal of `OperatorUsageSection`/`LinesChart`/`HeatmapCalendar` from the fixed layout as a *rendering* change only (keep `HeatmapCalendar` — the builder still renders it).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Operator/topic panel open state, stack, back navigation | Browser / Client (React state in `OperatorDashboard`) | — | D-07 forbids URL state; ephemeral UI state belongs in the component tree, not Redux or the router |
| Panel period/project filters | Browser / Client (props from `DashboardCallRecordsPage`) | — | D-06 requires the panel to mirror the dashboard's already-resolved `startDate`/`endDate`/`projectId`/`userId` — pass them down, never re-read Redux inside the panel |
| Operator metric evidence aggregation (quotes/rationales) | API / Backend (new `operator-evidence` endpoint) | — | `_assessments` is inside a JSON blob; aggregating client-side would require shipping every transcript-adjacent record to the browser (PII + payload) |
| Tag statistics for «Темы» (count/avg score/sentiment/success) | API / Backend (inside existing `getDashboard`) | — | `getDashboard` already holds every eligible record in memory (`recordsForDerived`); adding `tagStats` there costs zero extra queries and matches `buildAgentScorecards` |
| Tag → call list filtering | API / Backend (`GET /operator-analytics/cdrs?tagId=`) | Database (indexed join) | Pagination + tenant scoping already live in `getCdrs`; a client-side filter cannot paginate |
| Taxonomy definition (CRUD) | API / Backend (`operator_projects.callTaxonomy` JSON) | Frontend Project Wizard form | Mirrors `customMetricsSchema` exactly — same column type, same DTO validation shape, same PATCH endpoint |
| Auto tag assignment at analysis time | API / Backend (`operator-analytics.service` analysis path) | — | Only place where the decrypted transcript exists in memory |
| Manual tag edit | API / Backend (`PATCH /operator-analytics/:id/tags`) | Browser (call card UI) | Tenant/ownership check must be server-side (`assertRecordAccess`) |
| Tag chips in journal + call card | Browser / Client | — | Data already arrives in `report.analytics.metrics._topics` via `getCdrs`/`getReports` |
| Tag column in CSV/XLSX export | Browser / Client (`callsExportSheet.ts`) | — | Export is generated client-side with `xlsx`; an `EXPORT_KEYWORDS` column already exists as the precedent |
| Persistence of tags & taxonomy | Database / Storage | — | Requires manual dual-dialect SQL migrations (R12) |

## Standard Stack

### Core — all already installed; no `npm install` in this phase

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@mui/material` | ^7.3.0 | `Drawer` / `SwipeableDrawer` for the right-anchored side panel | Already the repo's drawer substrate (`shared/ui/mui/Drawer` wraps `SwipeableDrawer`); gives focus trap, ESC handling, scroll lock, `aria-modal`, portal, and `anchor="right"` for free [VERIFIED: `package.json` dependency + `src/shared/ui/mui/Drawer/ui/Drawer.tsx`] |
| `react` | ^18.2.0 | Panel stack state | — |
| `@reduxjs/toolkit` (RTK Query) | ^1.9.5 | New endpoints on the existing `reportApi` injection | All OA endpoints already live in `src/entities/Report/api/reportApi.ts` via `rtkApi.injectEndpoints` [VERIFIED: file read] |
| `react-i18next` / `i18next` | ^12.1.5 / ^22.4.9 | `reports` namespace keys | Existing OA namespace; locales exist for `ru`, `en`, `de`, `zh` [VERIFIED: `public/locales/*/reports.json`] |
| `lucide-react` | ^0.575.0 | Panel icons (back chevron, close, tag) | `OperatorScoreTable` already imports `ChevronDown`/`ChevronUp` from it [VERIFIED: file read] |
| `xlsx` | ^0.18.5 | Tag column in export | Already used by `useCallsExport` / `callsExportSheet.ts` [VERIFIED] |
| `@nestjs/swagger` | ^11.0.3 | `@ApiProperty` DTOs → `openapi.json` → generated FE types | CI gate `generate:api-types:check` fails the build if FE types drift [VERIFIED: `.github/workflows/deploy.yml` line 43] |
| `class-validator` / `class-transformer` | ^0.14.1 / ^0.5.1 | Taxonomy DTO validation (`ValidateNested`, `ArrayMaxSize`) | Exactly how `MetricDefinitionDto` is validated in `dto/project.dto.ts` [VERIFIED] |
| `sequelize` / `sequelize-typescript` | ^6.37.6 / ^2.1.6 | New `operator_call_tags` model + JSON column | — |
| `ioredis` (via `InsightsCacheService`) | ^5.11.1 | Optional caching of evidence responses | Redis-or-in-memory fallback already abstracted [VERIFIED: `insights-cache.service.ts`] |

### Supporting — available, use only if the MUI path is rejected

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@headlessui/react` | ^2.2.9 | Unstyled `Dialog` with built-in focus trap + transitions | Only if the team wants the new `redesign-v3/SidePanel` to be MUI-free. Costs custom slide/scroll-lock CSS that MUI provides. |
| `motion` (framer-motion) | ^12.23.12 | Panel enter/exit animation | Only if MUI's `Slide` transition is judged insufficient; note `animations.scss` already honours `prefers-reduced-motion` |
| `@react-spring/web` + `@use-gesture/react` | ^9.7.2 / ^10.2.26 | Drag-to-dismiss | Substrate of the existing `redesigned/Drawer` bottom sheet — reuse only if swipe-to-close on mobile is explicitly wanted |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| New `redesign-v3/SidePanel` on MUI `Drawer` | Extend `shared/ui/redesigned/Drawer` | **Rejected.** It is a bottom sheet: `const height = window.innerHeight - 100` is evaluated **once at module load** (breaks on resize/rotate), positioning is `bottom: calc(-100vh + …)`, there is no `anchor` prop, no focus trap, and no ARIA role. Retrofitting it to a right panel is a rewrite plus a regression risk for every existing consumer. |
| New `redesign-v3/SidePanel` on MUI `Drawer` | Extend `shared/ui/mui/Drawer` in place | **Rejected.** Its `sx` hardcodes `width: 80vw; maxWidth: 320px; borderRight` (left anchor) and it lives in the legacy `mui/` generation that PROJECT.md/R15 steer away from. Copy the pattern, don't mutate the shared component. |
| Dedicated `/operator-analytics/tags/stats` endpoint | `tagStats` block inside existing `getDashboard` response | **Prefer `getDashboard`.** It already loads every eligible record (`recordsForDerived`) and already gates project-only aggregates (`customMetricsAggregated`) behind `if (query.projectId)`. Zero extra queries, one fewer round trip, automatic filter coherence with D-06/D-29. |
| Client-side evidence aggregation from `getOperatorCdrs` | Dedicated `operator-evidence` endpoint | **Endpoint wins.** `getCdrs` returns decrypted transcripts; pulling N pages to the browser to extract quotes multiplies PII exposure and payload for no benefit. |
| Tags in `operator_metric_values` (`origin: 'tag'`) | New `operator_call_tags` table | **Table wins — this is a data-loss trap.** `writeMetricValues()` runs `destroy({ where: { channelId } })` before `bulkCreate` on every analysis/regenerate, so manual tags stored there vanish silently. |

**Installation:** none. Confirm with `npm ls @mui/material @headlessui/react` in `aiPBX` — both are already direct dependencies.

**Version verification:** package versions above were read directly from `aiPBX/package.json` and `aiPBX_backend/package.json` in this session [VERIFIED: local manifests]. No registry lookups were performed because no package is being added.

## Package Legitimacy Audit

**Not applicable — this phase installs zero external packages.**

Every library the plan needs is already a direct dependency of one of the two repos, verified by reading the local `package.json` manifests. If the planner introduces a new dependency it must run the legitimacy gate before doing so.

| Package | Registry | Verdict | Disposition |
|---------|----------|---------|-------------|
| — | — | — | No new packages proposed |

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### System Architecture Diagram

```
┌─ Browser ────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  DashboardCallRecordsPage                                                    │
│    ├── Redux dashboardPage: startDate, endDate, userId                       │
│    ├── local state: projectId  ── (also from ?projectId= on mount)           │
│    └── useGetOperatorDashboard({startDate,endDate,projectId,userId})          │
│              │                                                               │
│              ▼                                                               │
│  OperatorDashboard  ── single scroll, no tabs (D-24) ────────────────────┐    │
│    │  Stats (cost StatCards kept, D-10)                                  │    │
│    │  AI Insights                                                        │    │
│    │  ┌── hasCustomDashboard ? DashboardConfigGrid : mid-charts ──┐      │    │
│    │  │   donuts → metric bars → custom metrics                    │      │    │
│    │  └────────────────────────────────────────────────────────────┘      │    │
│    │  «Темы»  (only when projectId set, D-29/D-21)  ── ALWAYS BELOW ─┐   │    │
│    │  «Рейтинг операторов» (OperatorScoreTable)     ── ALWAYS BELOW ─┘   │    │
│    │        │ onOperatorSelect(name)        │ onTagSelect(tagId)          │    │
│    │        ▼                               ▼                            │    │
│    │  panelStack: PanelEntry[]   ── push / pop, single owner ────────────┤    │
│    └──────────────┬──────────────────────────────────────────────────────┘    │
│                   ▼                                                           │
│  <SidePanel open={stack.length>0} onBack={pop} onClose={clear}>               │
│      top of stack decides body:                                               │
│        operator → metric list  ──click──►  evidence quotes ──click──► call     │
│        tag      → tag summary  ─────────────────────────────────────► call     │
│        call     → ReportShowAnalytics + transcript (leaf, back pops)           │
│  </SidePanel>                                                                 │
│         │                    │                         │                      │
└─────────┼────────────────────┼─────────────────────────┼──────────────────────┘
          ▼                    ▼                         ▼
   GET /operator-analytics/  GET /operator-analytics/  GET /operator-analytics/:id
   operator-evidence         cdrs?tagId=&operatorName=       (existing)
   (NEW)                     (extended)
          │                    │                         │
┌─────────┼────────────────────┼─────────────────────────┼──────────────────────┐
│ NestJS OperatorAnalyticsController  (static routes MUST precede @Get(':id'))   │
│   RolesGuard(ADMIN,USER) → isAdmin ? query.userId : realUserId  (tenant scope) │
│         ▼                                                                      │
│ OperatorAnalyticsService                                                       │
│   buildDashboardCdrWhere(+exact-operator option)                               │
│   getDashboard → recordsForDerived ──► buildAgentScorecards                     │
│                                   ──► aggregateCustomMetrics                   │
│                                   ──► buildTagStats  (NEW, projectId-gated)     │
│   getOperatorEvidence (NEW, bounded limit + audit log)                          │
│         ▼                                                                      │
│ analysis pipeline (analyzeFile / processUrl / regenerate)                       │
│   sttResult.text (plaintext, in memory only)                                    │
│     ├─ spotTopicKeywords(env list)     → _topics.keywords   (unchanged)         │
│     └─ spotTaxonomyTags(project list)  → _topics.tags       (NEW)               │
│           └─ also upsert operator_call_tags rows source='auto'                  │
└────────────────────────────────────────────────────────────────────────────────┘
          │                          │                        │
          ▼                          ▼                        ▼
   aiCdr (assistantName,      aiAnalytics.metrics JSON   operator_projects
   projectId, userId,          (_assessments, _topics,     .callTaxonomy (NEW JSON)
   createdAt, cost)            _quality)                  operator_call_tags (NEW)
                                                          operator_analytics
                                                          .transcription (ENCRYPTED)
```

### Recommended Project Structure

```
aiPBX/src/
├── shared/ui/redesign-v3/
│   └── SidePanel/                        # NEW — right-anchored, mobile-fullscreen shell
│       ├── SidePanel.tsx
│       ├── SidePanel.module.scss
│       └── index.ts
├── features/OperatorAnalytics/
│   ├── model/
│   │   └── panelStack.ts                 # NEW — PanelEntry union + push/pop reducer helpers
│   └── ui/OperatorDashboard/
│       ├── OperatorDashboard.tsx         # EDIT — remove usage/dynamics/heatmap, add Темы + panel
│       ├── OperatorScoreTable/           # EDIT — clickable rows → onOperatorSelect
│       ├── OperatorUsageSection/         # DELETE (orphan after D-09 — verify no other importer)
│       ├── HeatmapCalendar/              # KEEP — still rendered by WidgetRenderer 'heatmap'
│       ├── TopicsSection/                # NEW — «Темы» cards/chips + empty state (D-15/D-21)
│       └── DrilldownPanel/               # NEW — panel body router: operator | tag | call
│           ├── OperatorPanelBody.tsx
│           ├── TagPanelBody.tsx
│           └── CallPanelBody.tsx
├── entities/Report/
│   ├── api/reportApi.ts                  # EDIT — evidence query, tags mutation, tagId on cdrs
│   └── model/types/report.ts             # EDIT — TagDefinition, TagStat, evidence types
└── features/Calls/lib/callsExportSheet.ts # EDIT — «Теги» column (D-23)

aiPBX_backend/
├── migrations/postgres/2026-XX-XX-operator-call-taxonomy.sql   # NEW
├── migrations/mysql/2026-XX-XX-operator-call-taxonomy.sql      # NEW (dual dialect, mandatory)
└── src/operator-analytics/
    ├── operator-call-tag.model.ts        # NEW
    ├── operator-project.model.ts         # EDIT — callTaxonomy JSON column
    ├── lib/keyword-spotting.ts           # EDIT — spotTaxonomyTags + boundary matching
    ├── lib/tag-stats.ts                  # NEW — pure buildTagStats(records, taxonomy)
    ├── lib/operator-evidence.ts          # NEW — pure aggregation from records
    ├── lib/dashboard-aggregation.ts      # EDIT — exact operator match option
    ├── dto/project.dto.ts                # EDIT — TagDefinitionDto
    ├── dto/operator-evidence.dto.ts      # NEW — @ApiProperty for openapi.json
    ├── operator-analytics.controller.ts  # EDIT — new routes ABOVE @Get(':id')
    └── operator-analytics.service.ts     # EDIT — evidence, tagStats, tag write paths
```

### Pattern 1: Single-owner panel stack, never nested drawers

**What:** One `SidePanel` instance per dashboard, driven by an array of typed entries. `push` on drill-down, `pop` on back, `clear` on close.
**When to use:** Every panel transition in D-01/D-02/D-03/D-15.
**Why:** Rendering a second `Drawer` inside the first produces two portals competing for focus trap, scroll lock, and `z-index`, and browser back/ESC then dismisses the wrong layer. A stack array keeps exactly one modal in the DOM.

```tsx
// Source: pattern derived from existing repo state usage (OperatorDashboard local state,
// DashboardCallRecordsPage prop drilling) — no external source
export type PanelEntry =
    | { kind: 'operator', operatorName: string }
    | { kind: 'operatorMetric', operatorName: string, metricId: string }
    | { kind: 'tag', tagId: string }
    | { kind: 'call', channelId: string, fromLabel: string }

const [stack, setStack] = useState<PanelEntry[]>([])
const push = useCallback((e: PanelEntry) => { setStack(s => [...s, e]) }, [])
const pop = useCallback(() => { setStack(s => s.slice(0, -1)) }, [])
const close = useCallback(() => { setStack([]) }, [])
const top = stack[stack.length - 1]

// Filters flow down from the dashboard verbatim — D-06. Never re-read Redux inside the panel.
<SidePanel
    isOpen={stack.length > 0}
    onBack={stack.length > 1 ? pop : undefined}
    onClose={close}
    title={panelTitle(top, t)}
>
    {top?.kind === 'operator' && (
        <OperatorPanelBody
            operatorName={top.operatorName}
            startDate={startDate} endDate={endDate}
            projectId={projectId} userId={userId}
            onOpenCall={channelId => { push({ kind: 'call', channelId, fromLabel: top.operatorName }) }}
        />
    )}
</SidePanel>
```

### Pattern 2: `SidePanel` shell on MUI `Drawer anchor="right"`

**What:** A `redesign-v3` component that owns width/breakpoint/theme-var styling and exposes `isOpen`/`onClose`/`onBack`/`title`/`children`.
**When to use:** D-30.
**Why:** MUI supplies focus trap, ESC, scroll lock, and `aria-modal`; the repo's own `mui/Drawer` proves `MuiDrawer-paper` + `sx` + theme CSS vars is the established styling seam.

```tsx
// Source: adapted from src/shared/ui/mui/Drawer/ui/Drawer.tsx (existing repo pattern)
import { Drawer as MuiDrawer } from '@mui/material'

export const SidePanel = memo(({ isOpen, onClose, onBack, title, children, className }: SidePanelProps) => (
    <MuiDrawer
        anchor="right"
        open={!!isOpen}
        onClose={onClose}
        className={classNames('', {}, [className])}
        PaperProps={{ 'aria-label': title }}
        sx={{
            '& .MuiDrawer-paper': {
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: 'min(560px, 100vw)',
                maxWidth: '100vw',
                // D-30: fullscreen on mobile — matches `@include mobile` (max-width: 600px)
                '@media (max-width: 600px)': { width: '100vw' },
                background: 'var(--bg-redesigned)',
                color: 'var(--text-redesigned)',
                borderLeft: '1px solid var(--glass-border-primary)',
                overflowY: 'auto',
            },
        }}
    >
        <PanelHeader title={title} onBack={onBack} onClose={onClose} />
        {children}
    </MuiDrawer>
))
```

Desktop width: `min(560px, 100vw)` sits at the top of the D-30 range; if the planner prefers the middle, use `clamp(480px, 38vw, 560px)`. Breakpoint must be `600px` to match the repo's `@include mobile` mixin in `src/app/styles/variables/mixins.scss` [VERIFIED: file read].

### Pattern 3: Bounded, tenant-scoped evidence endpoint

**What:** `GET /api/operator-analytics/operator-evidence`, declared **above** `@Get(':id')` in the controller.
**When to use:** D-05, D-08.
**Why:** `_assessments` is only inside the `aiAnalytics.metrics` JSON blob — unaggregatable in SQL. The read must be explicitly bounded because `getDashboard`'s existing loader walks the entire period in 2000-row pages.

Query: `operatorName` (required, exact), `startDate`, `endDate`, `projectId`, `userId` (admin only), `limit` (server-capped), `order` (`worst` default | `best`).

Prescriptive response shape:

```ts
interface OperatorEvidenceResponse {
    operatorName: string
    callsCount: number          // records matched within the cap
    scoredCalls: number         // records that actually carried metrics
    averageScore: number
    sampleCapped: boolean       // true when callsCount hit the server cap
    metrics: Array<{
        metricId: string
        origin: 'default' | 'custom' | 'summary'
        label?: string          // from project _custom_meta / customMetricsSchema when custom
        average: number | null
        sampleSize: number
        evidence: Array<{       // ≤ 5, D-08: metric omitted entirely when this is empty
            channelId: string
            createdAt: string
            value: number | boolean | string | null
            rationale?: string
            quote?: string
        }>
    }>
}
```

Rules the planner must encode:
- **D-08 is a filter, not a flag:** drop any metric whose `evidence` array is empty before serialising.
- Reuse `ReportShowAnalytics`'s existing de-duplication logic when reading assessments: it drops `quote` when the rationale already contains it (normalising `«»"'\``), and falls back to legacy `metrics._evidence[key]` for pre-`_assessments` records. Extract that into a shared pure helper rather than reimplementing it on the server.
- Tenant scope exactly as the sibling endpoints: `const isAdmin = req.isAdmin ?? false; const realUserId = isAdmin ? null : (req.vpbxUserId || req.tokenUserId)`.
- Emit the same structured audit line as `logTranscriptAccess` — this endpoint returns verbatim customer speech.
- Exclude `_quality.quality ∈ {low, unusable}` records, matching `getDashboard`'s eligibility filter, so panel numbers agree with the table the user clicked from.

### Pattern 4: Tag storage — JSON as the read path, table as the queryable/auditable record

**What:** Dual-write, mirroring the documented philosophy already in `operator-metric-value.model.ts` ("the JSON remains the source of truth for existing readers; this table enables … SQL aggregation/filtering").
**When to use:** D-14, D-19, D-20, D-23.

| Concern | Location |
|---|---|
| Taxonomy definition | `operator_projects.callTaxonomy` — JSON, `[{ id, name, aliases: string[], color?, description? }]` |
| Auto tags at analysis | `aiAnalytics.metrics._topics.tags: string[]` **and** `operator_call_tags` rows with `source='auto'` |
| Manual edits | `operator_call_tags` rows with `source='manual'` + `actorUserId` **and** the same effective set written back into `_topics.tags` |
| Effective tag set | `_topics.tags` — one read path for dashboard aggregation, journal chips, call card, and export |
| Filtering ("contains tag") | `operator_call_tags` via `channelId IN (…)` subquery on `getCdrs` |

Non-negotiables:
- **Never** store tags in `operator_metric_values` (see Pitfall 1).
- Regenerate deletes only `source='auto'` rows; manual rows survive, exactly like `operator_metric_overrides` survives re-analysis.
- Keep `_topics.keywords` (the env-driven compliance spotting) untouched and add a sibling `tags` key. Mixing project taxonomy hits into `keywords` would corrupt the existing `EXPORT_KEYWORDS` column and the `data-testid="topic-keywords"` badge assertion in `ReportShowAnalytics.test.tsx`.
- Taxonomy edits must **not** bump `currentSchemaVersion`. That counter is incremented by `updateProject` when `customMetricsSchema` changes and is stamped onto analyses as `_schema_version` to describe the *LLM metric* schema; bumping it for a keyword-dictionary change would mislabel every subsequent analysis.

### Pattern 5: Extend `keyword-spotting.ts` with boundary-aware alias matching

**What:** A new pure exported function beside the existing two, unit-tested in the existing `keyword-spotting.spec.ts`.
**When to use:** D-18.
**Why:** The current matcher is bare `haystack.includes(kw.toLowerCase())`, which produces false positives on short Russian aliases (`«акт»` matches «контакт», «фактически»). Managers will lose trust in «Темы» immediately if that happens.

```ts
// Source: extension of aiPBX_backend/src/operator-analytics/lib/keyword-spotting.ts
export interface TagDefinition { id: string; name: string; aliases: string[] }

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Word-boundary-ish match that works for Cyrillic (\b is ASCII-only in JS RegExp). */
function matchesAlias(haystack: string, alias: string): boolean {
    const a = alias.trim().toLowerCase()
    if (!a) return false
    // Multi-word phrases are specific enough for plain substring matching.
    if (/\s/.test(a)) return haystack.includes(a)
    const re = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(a)}([^\\p{L}\\p{N}]|$)`, 'u')
    return re.test(haystack)
}

export function spotTaxonomyTags(
    transcription: string,
    taxonomy: TagDefinition[],
    maxTags = 10,
): string[] {
    if (!transcription?.trim() || !taxonomy?.length) return []
    const haystack = transcription.toLowerCase()
    const hits: string[] = []
    for (const tag of taxonomy) {
        const aliases = tag.aliases?.length ? tag.aliases : [tag.name]
        if (aliases.some(a => matchesAlias(haystack, a)) && !hits.includes(tag.id)) {
            hits.push(tag.id)
            if (hits.length >= maxTags) break
        }
    }
    return hits
}
```

The `u`-flag `\p{L}\p{N}` classes require `target: ES2018+`. Backend TS is 5.7 with NestJS defaults — the planner should confirm `tsconfig.json` `target`/`lib` before relying on the `u` flag, and fall back to an explicit Cyrillic+Latin character class if not.

### Pattern 6: `tagStats` computed inside `getDashboard`, gated on `projectId`

**What:** A pure `buildTagStats(records, taxonomy)` called from `getDashboard` next to `buildAgentScorecards`, added to the response as `tagStats`.
**When to use:** D-15, D-16, D-29.
**Why:** `recordsForDerived` is already in memory with `analytics.metrics` attached; the existing `customMetricsAggregated` block is the exact precedent for a project-only aggregate.

```ts
// Source: pattern from aiPBX_backend/src/operator-analytics/operator-analytics.service.ts
//         getDashboard() lines ~1442-1450 (customMetricsAggregated + buildAgentScorecards)
let tagStats: TagStat[] = []
if (query.projectId) {
    const project = await this.projectRepository.findByPk(query.projectId)
    if (project?.callTaxonomy?.length) {
        tagStats = buildTagStats(recordsForDerived, project.callTaxonomy)
    }
}
// TagStat: { tagId, name, callsCount, averageScore, successRate,
//            sentiment: { positive, neutral, negative }, avgCsat }
```

The single `findByPk(query.projectId)` already happening for `customMetricsAggregated` should be hoisted and reused — do not add a second project fetch.

D-21 (empty state) is a **frontend** concern: the backend returning `tagStats: []` is ambiguous between "no taxonomy configured" and "taxonomy configured but zero matches". The frontend already has `activeProject.callTaxonomy` from `useGetOperatorProjects`, so branch on `activeProject.callTaxonomy?.length` for the empty state and on `tagStats.length` for the no-matches state.

### Pattern 7: Removal is a rendering change, not a file purge

**What:** D-09/D-11 remove *usages*, and only `OperatorUsageSection` becomes a deletable orphan.
**When to use:** the cleanup plan.

| Target | Action | Reason |
|---|---|---|
| `OperatorUsageSection` | remove import + JSX; delete component + `.module.scss` after confirming `OperatorDashboard.tsx` is the only importer | grep shows it is imported only there |
| «Динамика звонков» `LinesChart` block | remove the JSX + now-dead `timeSeriesLabels`/`timeSeriesCalls` locals and the `LinesChart` import | `LinesChart` remains used elsewhere (`shared/ui/mui/LinesChart`, `WidgetRenderer`) |
| `HeatmapCalendar` | remove from fixed layout + drop the `heatmapData` memo; **keep the component file** | `WidgetRenderer.tsx` renders it for `widgetType: 'heatmap'` (D-12) |
| Cost StatCards | **keep** — `totalDisplayCost` / `avgCost` stay | D-10 |
| `data-tour-id` anchors | preserve `oa-stats`, `oa-insights`, `oa-scorecard`, `oa-upload-entry` | `OnboardingDashboardTour` queries these; none sit on removed blocks, so the tour survives if the four are untouched |
| i18n keys for removed strings | leave `reports.json` keys in place | Removing shared keys risks breaking other consumers; dead keys are cheap |

### Anti-Patterns to Avoid

- **Nesting a second Drawer for the stacked call view (D-03).** Two portals fight over focus trap and scroll lock. Use the panel-stack array (Pattern 1).
- **Putting panel state in the URL or Redux.** D-07 explicitly rules out deep links, and `dashboardPage` Redux state is for shared filters, not modal state.
- **Re-reading `startDate`/`endDate` from Redux inside the panel.** Guarantees a drift bug the moment the dashboard is reused elsewhere; pass props (D-06).
- **Calling `loadDashboardCdrPages` for evidence.** It intentionally has no upper bound — it loops until a short page. Fine for one dashboard aggregate, a denial-of-service shape for a per-operator panel that opens on every row click.
- **Filtering tags client-side over a paginated list.** `getCdrs` returns page 1 of 20; a client filter produces a list that lies about totals.
- **A single-dialect migration.** `config/database.config.ts` supports both dialects (`dialect === 'postgres'` branches all over `dashboard-aggregation.ts`) and every prior migration ships as a `postgres/` + `mysql/` pair.
- **Assuming the new JSON column exists.** `sync: { alter: true }` is commented out; follow the `schemaVersion`/`promptVersion` precedent of wrapping writes in `try/catch` with a log line naming the migration file.
- **Using `_topics.keywords` as the tag field.** Breaks the existing export column and the `topic-keywords` test assertion; also conflates env-global compliance spotting with per-project taxonomy.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal focus trap, ESC, scroll lock, `aria-modal`, portal | Custom `div` overlay + `useEffect` key handlers | MUI `Drawer` (Pattern 2) | Focus restoration and iOS scroll-lock edge cases are where hand-rolled panels fail accessibility review |
| Tenant-safe CDR `WHERE` clause | New date/user/project filter code | `buildDashboardCdrWhere` in `lib/dashboard-aggregation.ts` | Already handles admin-vs-user scoping, both date-bound combinations, and dialect-specific `LIKE`/`ILIKE` |
| Per-call metric evidence rendering | New quote/rationale component | `ReportShowAnalytics` (`getAssessment`, legacy `_evidence` fallback, quote de-duplication) | Battle-tested against real LLM output quirks; has a spec file |
| Call list with pagination/sorting/search inside the panel | New list endpoint | `useGetOperatorCdrs` + a new `tagId` param | Already supports `operatorName`, `projectId`, dates, `search`, `page`, `limit`, `sortField`, `sortOrder` |
| Response cache with tenant isolation | New Map/TTL cache | `InsightsCacheService` | Redis-with-in-memory-fallback already abstracted; copy the `insights:v1:{tenantUserId}:…` key composition so R4 stays satisfied |
| FE/BE type sync for new DTOs | Hand-written TS interfaces | `openapi:export` (BE) → `sync:openapi` + `generate:api-types` (FE) | `generate:api-types:check` is a hard CI gate; `report.ts` already imports insight types from `@/shared/api/generated/schema` |
| XLSX/CSV generation for the tag column | New serializer | `buildCallsExportSheet` + `useCallsExport` | Handles the 32767-char Excel cell cap, dynamic custom-metric columns, and header ordering |
| Metric colour/threshold semantics | New thresholds | `metricVisual` + `MetricPolarity` in `OperatorDashboard.tsx` | Keeps panel colours identical to dashboard colours — essential for D-02 credibility |
| Percent normalisation | New `%` math | `normalizeRate` (present in both `OperatorDashboard.tsx` and `OperatorScoreTable.tsx`) | Backend sends success rate as either 0–1 or 0–100; the heuristic is already documented in a comment |

**Key insight:** in this codebase the expensive mistake is not choosing the wrong library — it is adding a *parallel* implementation of an aggregation, filter, or evidence-rendering rule that already exists, so the panel shows numbers that disagree with the table the manager clicked. Every drill-down number must be derived from the same helper as its parent view.

## Runtime State Inventory

Phase 10 is partly a refactor/removal phase (D-09, D-11) and adds persisted state (taxonomy, tags), so this inventory applies.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| **Stored data** | `aiAnalytics.metrics` JSON per call — will gain `_topics.tags`. Existing `_topics.keywords`, `_assessments`, `_evidence`, `_quality`, `_custom_meta`, `_schema_version` must remain byte-compatible. `operator_metric_values` rows are rebuilt on every analysis. `operator_metric_overrides` survives re-analysis. | Code edit only for existing keys; **no historical data migration** — D-20 forbids retagging, and the transcript encryption makes it infeasible anyway |
| **Live service config** | `OPERATOR_KEYWORD_SPOTTING` env var (global comma-separated compliance keyword list) is the *current* spotting source and is set per-server, not in git. `operator_projects.dashboardConfig` JSON is user-authored via the builder and lives only in the DB. | Leave `OPERATOR_KEYWORD_SPOTTING` behaviour intact (additive change). Do not rewrite `dashboardConfig`; D-26 only changes how it is laid out relative to Темы/Рейтинг |
| **OS-registered state** | None. No Task Scheduler / pm2 / cron registration references the removed sections. Backend cron tasks in the module (`operator-stuck-reaper.task.ts`, `operator-retention.task.ts`, `operator-anomaly.task.ts`) are `@nestjs/schedule` decorators inside the app, unaffected by this phase | None — verified by reading the module's task files list and the removal targets |
| **Secrets / env vars** | No new secret. Existing: `OPERATOR_KEYWORD_SPOTTING`, `REDIS_URL`, `OPERATOR_INSIGHTS_*`, and the transcript encryption key consumed by `lib/transcript-crypto.ts`. If evidence responses get cached, they land in the same Redis as insights | If a new `OPERATOR_EVIDENCE_MAX_CALLS` cap is introduced, document it in backend docs + `.env.example` (the precedent set by REQ-10 for `OPERATOR_INSIGHTS_*`) |
| **Build artifacts** | `aiPBX/src/shared/api/generated/schema.d.ts` is a generated file committed to git and gated by `npm run generate:api-types:check` in CI. `aiPBX_backend/openapi.json` is committed and gated by `openapi:check` | After any DTO change: `npm run openapi:export` in backend → `npm run sync:openapi && npm run generate:api-types` in frontend → commit both. Skipping this fails the `quality` job before deploy |

**Explicitly nothing found:** OS-registered state — verified by inspecting the OA module file list (only in-process `@nestjs/schedule` tasks) and confirming no removed component name appears in deploy or scripts config.

## Common Pitfalls

### Pitfall 1: Storing tags in `operator_metric_values` silently deletes manual edits
**What goes wrong:** Manual tag corrections disappear after a call is re-analysed, with no error anywhere.
**Why it happens:** `writeMetricValues()` executes `await this.metricValueRepository.destroy({ where: { channelId } })` before `bulkCreate`, and the whole body is wrapped in a `try/catch` that only logs a warning. Re-using that table for tags means "idempotent per channel" becomes "wipes user input".
**How to avoid:** Dedicated `operator_call_tags` table (Pattern 4); on regenerate delete only `source='auto'`.
**Warning signs:** a plan task that adds `origin: 'tag'` to `MetricValueOrigin`, or reuses `add(tagId, …)` inside `writeMetricValues`.

### Pitfall 2: Substring operator matching pulls in the wrong operator's calls
**What goes wrong:** Clicking «Иван» in the ranking shows «Иван Петров»'s calls too; the panel's `callsCount` disagrees with the table row that was clicked.
**Why it happens:** Both `buildDashboardCdrWhere` and `getCdrs` apply `where.assistantName = likeOp('%' + operatorName + '%')` — a substring/`ILIKE` filter — while `buildAgentScorecards` groups by the **exact trimmed** `assistantName`. The two disagree by construction, and D-04 makes name the identity.
**How to avoid:** Add an exact-match option (e.g. `operatorNameExact`) to `DashboardCdrFilters`/`getCdrs` and use it for every panel query. Keep the substring behaviour for the free-text search box.
**Warning signs:** panel totals ≠ the ranking row; two operators whose names are prefixes of one another.

### Pitfall 3: `activeProject` lookup fails for a URL-provided `projectId`
**What goes wrong:** Arriving at `/…?projectId=3` (the onboarding deep link) renders the dashboard with no custom metrics, no builder grid, and — after this phase — **no «Темы» section**, because `activeProject` is `undefined`.
**Why it happens:** `getProjects` returns raw Sequelize models where `id` is an `INTEGER`, but `queryProjectId = searchParams.get('projectId')` is a string, and the lookups are strict: `projects?.find(p => p.id === projectId)` in both `OperatorDashboard.tsx` and `DashboardCallRecordsPage.tsx`. The chip click path happens to work only because it stores the numeric value it received. The frontend type `OperatorProject.id: string` disagrees with the wire format.
**How to avoid:** Normalise once — compare `String(p.id) === String(projectId)` in both places (or coerce at the API boundary). Since D-29 makes «Темы» depend on `activeProject`, this latent bug becomes user-visible in Phase 10 and should be fixed in the same plan.
**Warning signs:** Темы/custom metrics/builder appear when clicking the chip but not on a fresh page load with the query param.

### Pitfall 4: Removing a section that carries a tour anchor
**What goes wrong:** The onboarding analytics tour silently stops highlighting, because `document.querySelector('[data-tour-id="…"]')` returns `null` and `setRect(null)` hides the spotlight.
**Why it happens:** `OnboardingDashboardTour` targets `oa-insights`, `oa-scorecard`, `oa-upload-entry`, with an `oa-stats` fallback for `oa-insights`.
**How to avoid:** None of those four sit on a D-09/D-11 removal target, so the tour survives — **provided** the IA reshuffle (D-25/D-26) keeps all four attributes on their sections. Re-verify after moving the ranking card out of the `hasCustomDashboard` ternary.
**Warning signs:** tour renders but with no spotlight rectangle.

### Pitfall 5: The new JSON column doesn't exist yet in production
**What goes wrong:** `project.callTaxonomy = […]; await project.save()` throws `column "callTaxonomy" does not exist`, and — worse — an analysis-path read of `project.callTaxonomy` can break the whole analysis.
**Why it happens:** `sync: { alter: true }` is commented out in `config/database.config.ts`, migrations are 70+ hand-applied SQL files across `migrations/postgres/` and `migrations/mysql/` (R12), and deploy does not run them.
**How to avoid:** Ship both dialect migrations in the same plan; make every read default to `[]` and every write `try/catch` with a log line naming the migration file — the exact pattern already used for `schemaVersion` and `promptVersion`. Add migration application to the deploy checklist note.
**Warning signs:** works locally, 500s on one production server only.

### Pitfall 6: Assuming a transcript can be re-scanned in SQL
**What goes wrong:** A "retag historical calls" or "search transcripts for tag aliases" task produces zero or garbage matches.
**Why it happens:** `OperatorAnalytics.transcription` has a Sequelize getter/setter running `encryptTranscript`/`decryptTranscript`; ciphertext is what's in the column. `getCdrs`'s `transcription LIKE %q%` search is already degraded for encrypted rows (a pre-existing limitation, capped at 500 ids).
**How to avoid:** Tag only at analysis time on `sttResult.text`, which is the plaintext held in memory. This is exactly what D-20 mandates — treat the encryption as the technical justification, not just a product preference.
**Warning signs:** a plan task proposing SQL/`LIKE`-driven backfill.

### Pitfall 7: Unbounded evidence queries and unbounded response size
**What goes wrong:** Opening the operator panel on a 90-day period stalls the API and ships megabytes of quotes.
**Why it happens:** Evidence lives in JSON, so records must be materialised; the nearest existing helper (`loadDashboardCdrPages`, `DASHBOARD_PAGE_SIZE = 2000`) deliberately loops until exhaustion.
**How to avoid:** Bounded `findAll` (`order: [['createdAt','DESC']], limit: cap`), cap evidence at ~5 items per metric, return `sampleCapped` so the UI can say "по последним N звонкам".
**Warning signs:** panel open latency scaling with the selected period.

### Pitfall 8: Export schema change breaks consumers
**What goes wrong:** Downstream spreadsheets/macros keyed to column positions shift.
**Why it happens:** `buildCallsExportSheet` builds `headers` positionally (`base → analytics → operator metrics → dynamic custom → bot`). D-23 is flagged "costly — export schema change" for this reason.
**How to avoid:** Append the «Теги» header inside the `analyticsHeaders` group adjacent to the existing `EXPORT_KEYWORDS` column (keeping the two topic concepts together) and extend `callsExportSheet.test.ts` — it already asserts on `_topics.keywords` output, so the test is the regression guard.
**Warning signs:** the existing export test passing without modification after adding a column.

### Pitfall 9: New static route shadowed by `@Get(':id')`
**What goes wrong:** `GET /operator-analytics/operator-evidence` hits `getById` and returns 404 "Analysis not found" (or a `NaN` lookup, since `getById` does `+id`).
**Why it happens:** Nest matches in declaration order and `@Get(':id')` is declared near the end of `operator-analytics.controller.ts`.
**How to avoid:** Declare all new static GET routes above it, next to `@Get('dashboard')` / `@Get('insights')`. `@Patch(':id/tags')` is method+path-distinct and safe, but keep it beside the `:id/overrides` routes for readability.
**Warning signs:** 404 with an "Analysis not found" body from a route that clearly exists.

### Pitfall 10: Cache key missing the tenant
**What goes wrong:** Cross-tenant data leak — R4's named failure mode, already fixed once in Phase 1.
**Why it happens:** Copying `InsightsCacheService.get/set` without copying `buildInsightsCacheKey`'s tenant segment.
**How to avoid:** Any cached evidence/tag key must start `evidence:v1:{tenantUserId}:` where `tenantUserId = query.userId || realUserId || 'admin-all'`. Add a unit test on key composition — REQ-05 established that precedent.
**Warning signs:** two accounts with identical filters seeing identical panels.

## Code Examples

### Exact-operator filter (backend)

```ts
// Source: extension of aiPBX_backend/src/operator-analytics/lib/dashboard-aggregation.ts
export interface DashboardCdrFilters {
    userId?: string
    projectId?: number
    startDate?: string
    endDate?: string
    operatorName?: string        // substring (existing search behaviour)
    operatorNameExact?: string   // NEW — drill-down identity (D-04)
}

// inside buildDashboardCdrWhere, before the substring branch:
if (query.operatorNameExact) {
    where.assistantName = query.operatorNameExact          // groups exactly like buildAgentScorecards
} else if (query.operatorName) {
    where.assistantName = likeOp(`%${query.operatorName}%`)
}
```

### Reusing the assessment reader (shared pure helper)

```ts
// Source: extracted verbatim from the getAssessment closure in
// aiPBX/src/entities/Report/ui/ReportShowAnalytics/ReportShowAnalytics.tsx
const normalizeQuote = (s: string) => s.replace(/[«»"'`]/g, '').trim().toLowerCase()

export function readAssessment(
    metrics: { _assessments?: Record<string, { rationale?: string, quote?: string }>, _evidence?: Record<string, string> },
    key: string,
): { rationale?: string, quote?: string } | undefined {
    const a = metrics._assessments?.[key]
    if (a && (a.rationale || a.quote)) {
        let quote = a.quote
        // Drop the quote if the model already embedded it inside the rationale
        if (quote && a.rationale && normalizeQuote(a.rationale).includes(normalizeQuote(quote))) {
            quote = undefined
        }
        return { rationale: a.rationale, quote }
    }
    const legacy = metrics._evidence?.[key]
    return legacy ? { quote: legacy } : undefined
}
```

### Tag filter on the CDR list (backend)

```ts
// Source: extension of getCdrs in aiPBX_backend/src/operator-analytics/operator-analytics.service.ts
if (query.tagId) {
    const tagRows = await this.callTagRepository.findAll({
        where: { tagId: query.tagId, ...(query.projectId ? { projectId: query.projectId } : {}) },
        attributes: ['channelId'],
    })
    // Empty match must yield zero rows, not "no filter"
    where.channelId = { [Op.in]: tagRows.length ? tagRows.map(r => r.channelId) : ['__none__'] }
}
```

### RTK Query endpoints (frontend)

```ts
// Source: pattern from aiPBX/src/entities/Report/api/reportApi.ts (existing OA endpoints)
getOperatorEvidence: build.query<OperatorEvidenceResponse, {
    operatorName: string
    startDate?: string
    endDate?: string
    projectId?: string
    userId?: string
}>({
    query: (args) => ({
        url: '/operator-analytics/operator-evidence',
        params: Object.fromEntries(
            Object.entries(args).filter(([, v]) => v !== undefined && v !== ''),
        ),
    }),
    providesTags: ['OperatorAnalytics'],
}),

updateCallTags: build.mutation<{ tagIds: string[] }, { id: string, tagIds: string[] }>({
    query: ({ id, tagIds }) => ({
        url: `/operator-analytics/${id}/tags`,
        method: 'PATCH',
        body: { tagIds },
    }),
    // Invalidate the record and the list so journal chips + dashboard Темы refresh
    invalidatesTags: (result, error, { id }) => [
        { type: 'OperatorAnalytics', id },
        { type: 'Reports', id: 'LIST' },
    ],
}),
```

### Dual-dialect migration skeleton

```sql
-- Source: shape follows aiPBX_backend/migrations/{postgres,mysql}/2026-06-18-operator-metric-values.sql
-- migrations/postgres/2026-XX-XX-operator-call-taxonomy.sql
ALTER TABLE operator_projects ADD COLUMN IF NOT EXISTS "callTaxonomy" JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS operator_call_tags (
    id            SERIAL PRIMARY KEY,
    "channelId"   VARCHAR(255) NOT NULL,
    "userId"      VARCHAR(255),
    "projectId"   INTEGER,
    "tagId"       VARCHAR(100) NOT NULL,
    source        VARCHAR(16)  NOT NULL DEFAULT 'auto',
    "actorUserId" VARCHAR(255),
    "createdAt"   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_call_tags_channel_tag ON operator_call_tags ("channelId", "tagId");
CREATE INDEX IF NOT EXISTS idx_call_tags_tag_project      ON operator_call_tags ("tagId", "projectId");
```

The MySQL twin uses `JSON`, `AUTO_INCREMENT`, `DATETIME DEFAULT CURRENT_TIMESTAMP`, and backtick quoting — mirror an existing pair such as `2026-06-18-operator-metric-values.sql` rather than translating by hand.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Insight drill-down navigates to `/calls` with `sessionStorage` handoff (`insightDrilldown.ts`, Phase 3 D-02) | Operator/topic drill-down stays **in-panel** (D-03) | Phase 10 | `insightDrilldown.ts` stays for the AI-insights flow; the new panel flow must not reuse `sessionStorage` |
| Metrics readable only from the `aiAnalytics.metrics` JSON blob | Dual-write into `operator_metric_values` for dialect-aware SQL aggregation | Phase 3 (`2026-06-18-operator-metric-values.sql`) | Establishes the "JSON = read path, table = query path" convention that Pattern 4 follows |
| Supervisor corrections overwrite LLM values | Corrections stored separately in `operator_metric_overrides` | Phase 3 (`2026-06-18-operator-metric-overrides.sql`) | Precedent for keeping manual tag edits in their own rows |
| Unstructured insight strings | Structured `OperatorInsightsResponse` with priority/type/evidence, FE types generated from `openapi.json` | Phase 1 (REQ-01/REQ-06) | New evidence/tag DTOs are expected to flow through the same codegen gate |
| Plaintext transcripts | Encrypted at rest via `lib/transcript-crypto.ts` getter/setter | pre-Phase 10 | Removes SQL-side transcript scanning as an option (Pitfall 6) |
| Insights cached in a process `Map` | `InsightsCacheService` with Redis + in-memory fallback | Phase 3 D-05 | Reuse rather than reinvent if evidence caching is wanted |

**Deprecated/outdated:**
- `metrics._evidence` (bare quote map) — superseded by `_assessments`; still read as a fallback, so keep the fallback.
- `GET /operator-analytics/projects/:id/insights` — marked `deprecated: true` in Swagger; use `GET /insights?projectId=`.
- `shared/ui/deprecated/*` and, for new work, `shared/ui/redesigned/*` — new UI belongs in `redesign-v3`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | MUI 7's `Drawer` with `anchor="right"` provides focus trap / ESC / scroll lock / `aria-modal` out of the box | Standard Stack, Pattern 2 | If a behaviour is missing, the SidePanel needs extra a11y work; low risk — `SwipeableDrawer` (same `Modal` base) is already relied on in `shared/ui/mui/Drawer` |
| A2 | Backend `tsconfig` targets ES2018+, so `RegExp` `u`-flag `\p{L}\p{N}` classes are available | Pattern 5 | Alias boundary matching fails to compile; mitigation is an explicit Cyrillic/Latin char class. Planner should read `aiPBX_backend/tsconfig.json` in the first task |
| A3 | `OperatorUsageSection` has no importer other than `OperatorDashboard.tsx` | Pattern 7 | Deleting it breaks another surface. Cheap to verify with one grep before deletion |
| A4 | ~5 evidence items per metric and a ~300-call cap are the right defaults for manager coaching | Pattern 3 | Too few = unconvincing evidence, too many = slow panel. Make both configurable and tune during UAT |
| A5 | Word-boundary alias matching is a net improvement over the current substring match for Russian call transcripts | Pattern 5 | Could reduce recall on inflected forms (`возврат` / `возвратом`). Mitigation: boundary regex allows a trailing suffix only if the planner opts for a prefix match instead — decide with real transcripts |
| A6 | «Темы» ordering by `callsCount` descending (mirroring `buildAgentScorecards`) is what managers want | Pattern 6 | Low impact; trivially changeable |

## Open Questions

1. **D-28 vs. current code placement of AI Insights.**
   - What we know: D-25 orders the page `Stats → AI Insights → …`, and D-28 says AI Insights "stays after Stats (current placement)". In `OperatorDashboard.tsx` the `AiInsightsBanner` is rendered **first**, above the excluded-quality notice, the project chip row, and the Stats row.
   - What's unclear: whether D-28 means "keep the code as-is" (banner first) or "move it to after Stats, as D-25 says".
   - Recommendation: follow **D-25** (Stats → AI Insights) since it is the explicit IA spec, and confirm with the founder in the plan checkpoint. Also decide where the project chip row and `DASHBOARD_EXCLUDED_LOW_QUALITY` notice land — neither is named in D-25 and both currently sit above Stats. Keep `data-tour-id="oa-upload-entry"` wherever the chip row ends up.

2. **`.cursor/rules/frontend-fsd.mdc` names a directory that does not exist.**
   - What we know: the rule says "New UI only in `src/shared/ui/redesign/`"; the actual directories are `deprecated/`, `redesigned/`, `mui/`, `redesign-v3/`. `PROJECT.md` and `RISKS.md` R15 both say `redesign-v3`.
   - What's unclear: whether the rule is a typo for `redesign-v3` or an unrealised future rename.
   - Recommendation: build `SidePanel` in `redesign-v3/` (two of three sources agree, and it exists) and fix the rule text in the same phase as a one-line change.

3. **Tag identity in `_topics.tags`: ids or display names?**
   - What we know: `_topics.keywords` stores raw matched strings; the export column and the call-card badge render them directly. Storing tag **ids** keeps renames cheap but requires the taxonomy to resolve names at render time (available on the frontend via `useGetOperatorProjects`, unavailable for a call whose project was deleted).
   - Recommendation: store **ids** in `_topics.tags` and additionally snapshot `_topics.tag_names` (id → name at analysis time), mirroring how `_custom_meta` snapshots metric definitions. That makes the export and call card readable without the project, and keeps «Темы» rename-safe.

4. **Should evidence responses be cached?**
   - What we know: unlike insights there is no LLM cost, so the only driver is latency; caching quotes adds a PII surface in Redis.
   - Recommendation: **no cache in wave 1.** Measure panel latency during UAT; add `InsightsCacheService`-based caching later only with a tenant-prefixed key (Pitfall 10).

5. **Taxonomy CRUD placement within the wizard (D-17).**
   - What we know: `ProjectWizard` has steps 0–4 (`Templates`, `Chat`, `MetricBuilder`, `DefaultMetrics`, `Webhook`) plus `ProjectSettingsForm` and `WizardReviewSection`.
   - What's unclear: new wizard step vs. a section inside `ProjectSettingsForm`.
   - Recommendation: put it in **`ProjectSettingsForm`** (edit path — the realistic place for iterating a keyword dictionary) and surface it in `WizardReviewSection` read-only, avoiding a longer creation funnel that would work against the onboarding conversion goal.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | both repos, CI | ✓ | CI pins 22 | — |
| PostgreSQL | taxonomy + tags tables | ✓ (production dialect) | per server | — |
| MySQL | dual-dialect support | ✓ (`mysql2` dep + `migrations/mysql/`) | per server | — |
| `@mui/material` | SidePanel | ✓ | ^7.3.0 | `@headlessui/react` ^2.2.9 |
| `@headlessui/react` | SidePanel alternative | ✓ | ^2.2.9 | — |
| Jest (FE) | `npm run test:unit` | ✓ | ^29.4.2 + ts-jest, jsdom | — |
| Jest (BE) | `npm test` | ✓ | 29.7.0, node env | — |
| `openapi-typescript` | FE type codegen | ✓ | ^7.13.0 | — |
| Redis | optional evidence cache | ✗ unless `REDIS_URL` set | — | `InsightsCacheService` in-memory Map fallback (Phase 3 D-05) |
| Migration runner | applying the new SQL | ✗ none — manual (R12) | — | Hand-apply per server; document in the deploy checklist |
| GPU STT/LLM host | exercising auto-tagging end-to-end | ✗ not verified from this workspace | — | Unit-test `spotTaxonomyTags` as a pure function; UAT auto-tagging manually after deploy |

**Missing dependencies with no fallback:**
- Automated migration application — the plan must include an explicit manual migration step and a defensive `try/catch` around taxonomy reads/writes.

**Missing dependencies with fallback:**
- Redis (in-memory cache), GPU analysis host (pure-function unit tests + manual UAT).

## Validation Architecture

### Test Framework

| Property | Value — Frontend (`aiPBX`) | Value — Backend (`aiPBX_backend`) |
|----------|---------------------------|-----------------------------------|
| Framework | Jest 29 + ts-jest, `jsdom`, `@testing-library/react` 13 | Jest 29.7 + ts-jest, `node` env |
| Config file | `config/jest/jest.config.ts` | `jest` block in `package.json` |
| Test match | `src/**/*(*.)@(spec|test).[tj]s?(x)` | `.*\.spec\.ts$` under `src/` |
| Quick run command | `npx jest --config config/jest/jest.config.ts <path> ` | `npx jest <path>` |
| Full suite command | `npm run test:unit` | `npm test` |
| Lint gate | `npm run lint:ts` | `npm run lint` |
| Contract gate | `npm run generate:api-types:check` | `npm run openapi:check` |

### Phase Requirements → Test Map

Phase 10 has no `REQ-*` ids; rows are keyed to decisions.

| Decision | Behavior | Test Type | Automated Command | File Exists? |
|----------|----------|-----------|-------------------|-------------|
| D-18 | Taxonomy aliases match transcript, boundary-aware, no false positive on substrings, cap respected | unit (BE) | `npx jest src/operator-analytics/lib/keyword-spotting.spec.ts` | ✅ extend |
| D-16, D-29 | `buildTagStats` returns count/avg score/success/sentiment per tag; `[]` when no taxonomy | unit (BE) | `npx jest src/operator-analytics/lib/tag-stats.spec.ts` | ❌ Wave 0 |
| D-05, D-08 | Evidence aggregation groups by metric, caps at N, **omits metrics with no evidence**, honours legacy `_evidence` | unit (BE) | `npx jest src/operator-analytics/lib/operator-evidence.spec.ts` | ❌ Wave 0 |
| D-04 | `operatorNameExact` produces an equality clause; substring path unchanged | unit (BE) | `npx jest src/operator-analytics/lib/dashboard-aggregation.spec.ts` | ✅ extend |
| D-14, D-20 | Regenerate deletes only `source='auto'` tag rows; manual rows survive | unit (BE) | `npx jest src/operator-analytics/operator-analytics.service.spec.ts` | ✅ extend |
| D-22 | Tag PATCH rejects a record owned by another tenant (`assertRecordAccess`) | unit (BE) | `npx jest src/operator-analytics/operator-analytics.service.spec.ts` | ✅ extend |
| R4 / Pitfall 10 | Any new cache key includes `tenantUserId` | unit (BE) | `npx jest src/operator-analytics/insights-cache.service.spec.ts` | ✅ extend |
| D-01, D-03 | Clicking an operator row opens the panel; opening a call pushes; back pops to the operator | unit (FE, RTL) | `npx jest --config config/jest/jest.config.ts src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel` | ❌ Wave 0 |
| D-09, D-11, D-10 | Usage section / «Динамика» / «Активность» absent; cost StatCards present | unit (FE, RTL) | `npx jest --config config/jest/jest.config.ts src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.test.tsx` | ❌ Wave 0 |
| D-26 | With `dashboardConfig` present, Темы + Рейтинг still render | unit (FE, RTL) | same file as above | ❌ Wave 0 |
| D-21 | Empty taxonomy → empty state with settings link, not a hidden section | unit (FE, RTL) | `…/TopicsSection/TopicsSection.test.tsx` | ❌ Wave 0 |
| D-23 | «Теги» column present and populated in the export sheet | unit (FE) | `npx jest --config config/jest/jest.config.ts src/features/Calls/lib/callsExportSheet.test.ts` | ✅ extend |
| Pitfall 3 | `projectId` from a URL string resolves `activeProject` | unit (FE, RTL) | `…/OperatorDashboard.test.tsx` | ❌ Wave 0 |
| Contract | Backend DTO change reflected in `openapi.json` + `schema.d.ts` | contract | `npm run openapi:check` (BE) then `npm run generate:api-types:check` (FE) | ✅ CI gate |
| D-30 | Panel is fullscreen ≤600px, ~480–560px above | manual-only | — (CSS media query; not observable in jsdom) | manual UAT |
| D-27 | Manager-first density reads well | manual-only | — (subjective) | manual UAT |
| End-to-end auto-tagging | Real analysis assigns tags from the project dictionary | manual-only | — (requires GPU STT + LLM host) | manual UAT |

### Sampling Rate

- **Per task commit:** the affected file's quick run — `npx jest <path>` (BE) or `npx jest --config config/jest/jest.config.ts <path>` (FE), plus `npm run lint:ts` / `npm run lint` for the touched repo.
- **Per wave merge:** `npm test` (BE) and `npm run test:unit` (FE); after any DTO change also `npm run openapi:check` then `npm run sync:openapi && npm run generate:api-types` and commit the regenerated files.
- **Phase gate:** both full suites green + both contract gates green + i18n keys present in `ru` and `en` (minimum per DoD; `de`/`zh` also exist and Phase 8 set the precedent of filling all four) before `/gsd-verify-work`.

### Wave 0 Gaps

- [ ] `aiPBX_backend/src/operator-analytics/lib/tag-stats.spec.ts` — covers D-16/D-29
- [ ] `aiPBX_backend/src/operator-analytics/lib/operator-evidence.spec.ts` — covers D-05/D-08
- [ ] `aiPBX/src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.test.tsx` — covers D-09/D-10/D-11/D-26 + Pitfall 3 (no dashboard test exists today)
- [ ] `aiPBX/src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/DrilldownPanel.test.tsx` — covers D-01/D-02/D-03
- [ ] `aiPBX/src/features/OperatorAnalytics/ui/OperatorDashboard/TopicsSection/TopicsSection.test.tsx` — covers D-15/D-21
- [ ] RTL render helper for `OperatorDashboard`: it calls `useGetOperatorProjects` and `useTranslation` — check whether `src/shared/lib/tests/` already provides a store/i18n wrapper (`useWidgetData.test.ts` and `ReportShowAnalytics.test.tsx` are the closest existing patterns to copy) before writing a new one
- [ ] No framework install needed — both suites are configured and green as of Phase 0b

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no (reused) | Existing `RolesGuard` + `@Roles('ADMIN','USER')` / `ApiTokenGuard`; no new auth surface |
| V3 Session Management | no | JWT handling unchanged |
| V4 Access Control | **yes** | Every new endpoint must repeat the module's tenant pattern: `isAdmin ? query.userId : realUserId` for reads, `assertRecordAccess(channelId, userId, isAdmin)` for the tag PATCH (D-22 — no new roles). Taxonomy writes go through `updateProject`, which already scopes `findOne({ where: { id, userId } })` |
| V5 Input Validation | **yes** | `class-validator` DTOs for the taxonomy (`ValidateNested`, `ArrayMaxSize`, `MaxLength` on `id`/`name`/each alias) and for `tagIds`. Note R9: the global `ValidationPipe` runs with `skipMissingProperties: true` and is commented out on some controllers — do not rely on it alone; validate `limit`/`order`/`tagId` explicitly and clamp `limit` server-side |
| V6 Cryptography | no new crypto | `lib/transcript-crypto.ts` already handles transcript encryption; never decrypt into a cache or log |
| V7 Error/Logging | **yes** | Reuse the `AUDIT {json}` log line pattern (`logTranscriptAccess`, `operator_metric_override`) for evidence reads and manual tag edits. Never log quote text |
| V8 Data Protection | **yes** | Quotes and rationales are verbatim customer speech. Bound the evidence payload, avoid caching it in wave 1, and ensure the retention/anonymisation task (`operator-retention.task.ts`, which nulls `transcription`/`clientPhone`) is not contradicted — evidence must degrade gracefully when a record has been anonymised |
| V13 API | **yes** | Route ordering vs `@Get(':id')` (Pitfall 9); `@ApiProperty` on every new DTO field so `openapi.json` and the generated FE types stay in sync |

### Known Threat Patterns for NestJS + Sequelize + React

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| SQL injection via a new `tagId` / `operatorName` filter | Tampering | Sequelize `where` objects and `:named` replacements only — never string-concatenate into the raw SQL in `dashboard-aggregation.ts` |
| Cross-tenant read through a missing `userId` clause or cache key | Information Disclosure | R4: every query filtered by tenant; every cache key prefixed with `tenantUserId` (Pitfall 10) |
| IDOR on `PATCH /:id/tags` | Elevation of Privilege | `assertRecordAccess` before any write; it already throws 404 (not 403) so it does not leak record existence |
| PII over-exposure via aggregated quotes | Information Disclosure | Bounded evidence count, audit log per read, no caching in wave 1, respect anonymised records |
| Stored XSS via a taxonomy tag name rendered as a chip | Tampering | React escapes by default — do **not** introduce `dangerouslySetInnerHTML`; `MaxLength` the name and reject control characters |
| ReDoS via a user-authored alias compiled into a RegExp | Denial of Service | Escape alias metacharacters before `new RegExp` (see Pattern 5), cap alias length and alias count per tag |
| Unbounded query as a DoS vector | Denial of Service | Server-side `limit` clamp on the evidence endpoint; never call `loadDashboardCdrPages` from it |
| Billing side effects from a new endpoint | — | The evidence endpoint must **not** call `chargeInsightCost` or any billing path. Billing is explicitly out of scope (R2/R3) |

## Project Constraints (from `.cursor/rules/`)

Directives extracted from `.cursor/rules/aipbx-core.mdc`, `frontend-fsd.mdc`, `backend-nestjs.mdc` — the planner must verify each is satisfiable by the plan.

| # | Directive | Source | Applies to Phase 10 |
|---|-----------|--------|---------------------|
| C1 | Definition of Done: `npm run lint:ts` passes in both repos where changed | aipbx-core | Both repos change |
| C2 | DoD: `npm run test:unit` / `npm test` passes for affected modules | aipbx-core | See Validation Architecture |
| C3 | DoD: user-facing UI needs i18n keys in `ru` + `en` minimum | aipbx-core, frontend-fsd | Panel, Темы, tag chips, export header, taxonomy form. `de`/`zh` `reports.json` also exist |
| C4 | DoD: API changes = backend DTO **and** frontend entity types updated together | aipbx-core, frontend-fsd | Enforced by `generate:api-types:check` in CI |
| C5 | DoD: voice/telephony changes need a manual test checklist | aipbx-core | N/A — no telephony change |
| C6 | Update `.planning/STATE.md` after phase completion | aipbx-core | Orchestrator step |
| C7 | One GAP per active phase; no drive-by refactors | aipbx-core, R17 | GAP-11. Pitfall 3's `String(id)` fix is in-scope because D-29 depends on it; anything else stays out |
| C8 | Do **not** touch `ari/`, `billing/`, `accounting/` without an explicit phase | aipbx-core, backend-nestjs, R2/R3 | Cost StatCards read data already in the dashboard payload — no billing module edit |
| C9 | Production deploy requires a `[deploy all]` / `[deploy:N]` commit tag; never SSH to prod | aipbx-core, R18 | Deploy is out of the plan's scope |
| C10 | New UI only in the current UI generation | frontend-fsd (`redesign/`) vs PROJECT.md + R15 (`redesign-v3/`) | Conflict — see Open Question 2; use `redesign-v3/` |
| C11 | Do not add code to `shared/ui/deprecated/` | frontend-fsd | Satisfied |
| C12 | RTK Query endpoints in `entities/*/api/*Api.ts`, types in `entities/*/model/types/` | frontend-fsd | New endpoints go in `reportApi.ts`, new types in `report.ts` |
| C13 | No hardcoded user-visible strings | frontend-fsd | Note the existing codebase style passes Russian text *through* `t()` as the key (`t('Рейтинг операторов')`); follow that convention rather than inventing a new key scheme mid-file |
| C14 | Production builds use Webpack, not Vite | frontend-fsd, R14 | No bundler change |
| C15 | Feature modules: `.module.ts` / `.controller.ts` / `.service.ts`; DTOs with `@ApiProperty` | backend-nestjs | New model must be registered in `OperatorAnalyticsModule`'s `SequelizeModule.forFeature` |
| C16 | Guards: `JwtAuthGuard` / `RolesGuard` / `ApiTokenGuard` as appropriate | backend-nestjs | `RolesGuard('ADMIN','USER')` for the new JWT routes |
| C17 | Always filter by tenant; cache keys include tenant id | backend-nestjs, R4 | Security Domain V4 + Pitfall 10 |
| C18 | Unit tests `*.spec.ts` next to the service; add a test for every new service method with business logic | backend-nestjs | Wave 0 gaps |
| C19 | Update `.planning/intel/API-MAP.md` when adding endpoints | backend-nestjs | Add `operator-evidence`, `:id/tags`, `tagId` param on `cdrs` |
| C20 | Verify implementation before planning from `.idea/` archive specs | R16 | This research is code-verified; ignore stale `.idea/` OA specs |

## Sources

### Primary (HIGH confidence) — code read in this session

**Frontend (`aiPBX`)**
- `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.tsx` — full section map, `hasCustomDashboard` ternary, `metricVisual`, `normalizeRate`, tour anchors, cost StatCards
- `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorScoreTable/OperatorScoreTable.tsx` — sorting/filtering, row rendering, `operatorName` keying
- `src/features/OperatorAnalytics/lib/insightDrilldown.ts` — the `/calls` + `sessionStorage` flow Phase 10 must not reuse
- `src/features/OperatorAnalytics/ui/DashboardBuilder/{useWidgetData,WidgetRenderer,AddWidgetModal,WidgetSettingsPopover,dashboardGridLayout}.ts(x)` — `tag-cloud` and `heatmap` widget wiring
- `src/entities/Report/model/types/report.ts` — `AnalyticsMetrics._assessments/_evidence/_topics`, `AgentScorecard`, `OperatorDashboardResponse`, `OperatorProject`, `MetricDefinition`
- `src/entities/Report/api/reportApi.ts` — all OA endpoints, tag types, hook exports
- `src/entities/Report/ui/ReportShowAnalytics/ReportShowAnalytics.tsx` — assessment reading + quote de-duplication + `topic-keywords` badge
- `src/features/Calls/lib/callsExportSheet.ts` + `.test.ts` — header ordering, `EXPORT_KEYWORDS`, cell cap
- `src/pages/DashboardCallRecordsPage/ui/DashboardCallRecordsPage/DashboardCallRecordsPage.tsx` — filter/prop wiring, `?projectId=` handling
- `src/shared/ui/redesigned/Drawer/ui/Drawer.tsx` — bottom-sheet limitations
- `src/shared/ui/mui/Drawer/ui/Drawer.tsx` — MUI drawer + theme-var `sx` pattern
- `src/features/Onboarding/ui/analytics/OnboardingDashboardTour.tsx` — `TOUR_TARGETS`
- `src/app/styles/variables/mixins.scss` — `@include mobile` = `max-width: 600px`
- `package.json`, `config/jest/jest.config.ts`, `.github/workflows/deploy.yml`

**Backend (`aiPBX_backend`)**
- `src/operator-analytics/operator-analytics.controller.ts` — route order, guards, tenant resolution
- `src/operator-analytics/operator-analytics.service.ts` — `getDashboard`, `getCdrs`, `getById`, `buildAgentScorecards`, `spotTopicKeywords`, `enrichStoredMetrics`, `writeMetricValues`, `loadDashboardCdrPages`, `updateProject`, `createProject`, `getProjects`, override CRUD, `buildInsightsCacheKey`, `logTranscriptAccess`
- `src/operator-analytics/lib/{keyword-spotting,dashboard-aggregation}.ts` — matcher and `WHERE` builder
- `src/operator-analytics/{operator-project,operator-metric-value}.model.ts` — JSON column and dual-write table conventions
- `src/operator-analytics/dto/project.dto.ts` — `class-validator` DTO shape to mirror
- `src/operator-analytics/insights-cache.service.ts` — Redis/in-memory abstraction
- `src/operator-analytics/lib/transcript-crypto.ts` + `operator-analytics.model.ts` — transcript encryption getter/setter
- `src/ai-cdr/ai-cdr.model.ts` — `assistantName`, `projectId`, associations
- `src/config/database.config.ts` — `sync: { alter: true }` commented out
- `migrations/{postgres,mysql}/` — dual-dialect naming convention
- `package.json` — `openapi:export` / `openapi:check`, jest config, `zod` 4 available

**Planning docs**
- `.planning/phases/10-…/10-CONTEXT.md`, `.planning/ROADMAP.md` (Phase 10), `.planning/PROJECT.md`, `.planning/GAPS.md` (GAP-11), `.planning/STATE.md`, `.planning/REQUIREMENTS.md`, `.planning/intel/RISKS.md`, `.planning/phases/03-…/03-CONTEXT.md`
- `.cursor/rules/{aipbx-core,frontend-fsd,backend-nestjs}.mdc`

### Secondary (MEDIUM confidence)
- Library versions from local `package.json` manifests only — no registry verification was performed because no package is being added.

### Tertiary (LOW confidence)
- MUI `Drawer` a11y behaviour and RegExp `u`-flag availability rest on training knowledge (A1, A2). No web/docs provider was available in this session: `init.phase-op` reported `brave_search: false`, `firecrawl: false`, `exa_search: false`. Both assumptions are cheap for the planner to verify in the first task.

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — every library is an existing direct dependency, read from the local manifests; nothing new is installed
- Architecture: **HIGH** — every recommended pattern has a working in-repo precedent that was read line-by-line (`buildAgentScorecards`, `aggregateCustomMetrics`, `operator_metric_overrides`, `mui/Drawer`, `InsightsCacheService`)
- Pitfalls: **HIGH** — Pitfalls 1, 2, 3, 5, 6, 9 were each derived from specific verified lines of source, not from general experience
- Validation architecture: **HIGH** for commands and existing files; **MEDIUM** on the RTL harness for `OperatorDashboard`, which has no existing test to copy exactly
- UX density / visual specifics: **MEDIUM** — explicitly Claude's discretion per CONTEXT.md
- External library behaviour (A1, A2): **LOW** — no documentation provider available this session

**Research date:** 2026-07-30
**Valid until:** 2026-08-29 (30 days — stable internal codebase; re-verify only if the OA module or `shared/ui` generations change)
