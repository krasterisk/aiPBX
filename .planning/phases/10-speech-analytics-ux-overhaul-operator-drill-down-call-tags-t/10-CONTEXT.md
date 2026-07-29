# Phase 10: Speech analytics UX overhaul — operator drill-down, call tags, topic reports - Context

**Gathered:** 2026-07-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Refactor and deepen Operator Analytics / call-analytics UX for call-center managers and marketers: clean `OperatorDashboard` (remove usage costs block and volume-duplicative charts), add operator and topic drill-down via side panel to explain scores and inspect calls, and introduce project taxonomy tagging with theme reports — without expanding into LLM free-form tagging, billing-core changes, or new product modules outside ROADMAP Phase 10.

</domain>

<decisions>
## Implementation Decisions

### Operator drill-down UX
- **D-01:** Enter operator from «Рейтинг операторов» via **side panel / drawer** over the dashboard (not a dedicated route). — **Reversibility:** reversible
- **D-02:** Explanation chain inside panel: **metric → evidence → calls**. — **Reversibility:** reversible
- **D-03:** Opening a call **stacks inside the same panel** (back returns to operator metric context); do not navigate away to `/calls` for this flow. — **Reversibility:** reversible
- **D-04:** Identify operator by **`operatorName`** (as in current `AgentScorecard`). — **Reversibility:** costly — later id-based identity needs scorecard/API + migration of filters
- **D-05:** Metric-level evidence = **aggregated** top quotes/rationales from `_assessments` across the operator’s calls (API support as needed). — **Reversibility:** costly — new aggregate API/shape
- **D-06:** Panel period/filters **strictly match** dashboard `startDate` / `endDate` / `projectId`. — **Reversibility:** reversible
- **D-07:** **No** shareable deep-link / query for open panel — UI state only. — **Reversibility:** reversible
- **D-08:** If assessments missing: **hide metrics without evidence**; show only metrics that have quotes/rationales. — **Reversibility:** reversible

### Costs removal & fixed-layout cleanup
- **D-09:** Remove **`OperatorUsageSection`** from the OA analytics dashboard. — **Reversibility:** reversible
- **D-10:** **Keep** cost StatCards («Общая стоимость» / «Средняя стоимость»). — **Reversibility:** reversible
- **D-11:** Remove **«Динамика звонков»** and **«Активность»** (`HeatmapCalendar`) from OA **fixed** layout (they duplicate volume views better suited to summary dashboard; note OA heatmap chart type differs from summary). — **Reversibility:** reversible
- **D-12:** Keep heatmap available as a **Dashboard Builder** widget only; do not change summary dashboard in this phase. — **Reversibility:** reversible

### Tag / topic model
- **D-13:** **Project taxonomy** (controlled vocabulary) for themes/tags — not free-form LLM tags in Phase 10. — **Reversibility:** costly — taxonomy stored on project; later LLM tags need coexistence rules
- **D-14:** Tags applied **automatically on analysis** + **manual edit** on call card after analysis. — **Reversibility:** reversible
- **D-15:** Theme reports live as **«Темы» section on OA dashboard** → same side-panel drill-down pattern as operators. — **Reversibility:** reversible
- **D-16:** Tag panel summary: **call count, avg score, sentiment mix, success rate** → then call list. — **Reversibility:** reversible
- **D-17:** Taxonomy CRUD in **project settings / Project Wizard** (alongside custom metrics). — **Reversibility:** reversible
- **D-18:** Matching at analysis = **keyword/phrase** against dictionary aliases (extend current spotting); no LLM classification in Phase 10. — **Reversibility:** reversible
- **D-19:** **Multi-tag** per call; reports/filters use “contains tag”. — **Reversibility:** reversible
- **D-20:** Dictionary changes affect **new analyses only** — no automatic historical retag. — **Reversibility:** reversible
- **D-21:** Empty taxonomy: show **empty state** on «Темы» with link to project settings (do not hide silently). — **Reversibility:** reversible
- **D-22:** Manual tag edit permissions = **existing OA project/report permissions** (no new roles). — **Reversibility:** reversible
- **D-23:** Surface tags on **call journal chips + call card + CSV export**. — **Reversibility:** costly — export schema change

### Dashboard IA
- **D-24:** **Single scroll** layout (no tabs). — **Reversibility:** reversible
- **D-25:** Fixed section order: **Stats → AI Insights → sentiment/success → avg metrics → custom metrics → Темы → Рейтинг операторов**. — **Reversibility:** reversible
- **D-26:** When `dashboardConfig` present: builder grid **replaces mid-charts**; **Темы + Рейтинг always remain below**. — **Reversibility:** reversible
- **D-27:** **Manager-first** density: larger sections, less clutter, clear CTAs into operator/topic panels. — **Reversibility:** reversible
- **D-28:** AI Insights stays **after Stats** (current placement). — **Reversibility:** reversible
- **D-29:** Dashboard usable **without project** (org aggregate); **«Темы» only when a project is selected**. — **Reversibility:** reversible
- **D-30:** Side panel: **mobile fullscreen**; desktop side panel ~480–560px. — **Reversibility:** reversible

### Claude's Discretion
- Visual polish details within manager-first density (spacing, CTA copy) not micro-specified
- Exact aggregate API payload shape for operator evidence / tag stats (researcher/planner)
- Whether to extend `_topics.keywords` vs dedicated tag fields — prefer coherent with existing metrics storage unless research finds a clear better fit

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase / product
- `.planning/ROADMAP.md` — Phase 10 goal, scope table, suggested plans 10-01…10-04
- `.planning/GAPS.md` — GAP-11 (OA Phase 2 drill-down deferred)
- `.planning/phases/03-operator-analytics-phase-2/03-CONTEXT.md` — D-02 `/calls` drill-down, D-04 dashboardConfig, D-06 usage/billing (superseded for OA dashboard usage section by Phase 10 D-09)
- `.planning/PROJECT.md` — Operator Analytics product context

### Frontend
- `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.tsx` — primary dashboard surface
- `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorScoreTable/OperatorScoreTable.tsx` — rating table (add row → panel)
- `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorUsageSection/OperatorUsageSection.tsx` — remove from OA dashboard
- `src/features/OperatorAnalytics/ui/OperatorDashboard/HeatmapCalendar/HeatmapCalendar.tsx` — remove from fixed layout; builder-only
- `src/features/OperatorAnalytics/lib/insightDrilldown.ts` — existing insight → calls pattern (panel flow is separate)
- `src/entities/Report/ui/ReportShowAnalytics/ReportShowAnalytics.tsx` — `_assessments` / evidence UI patterns for call stack
- `src/entities/Report/model/types/report.ts` — `AgentScorecard`, `_topics`, metrics types
- `src/shared/ui/redesigned/Drawer/` — reusable drawer for side panel
- `src/features/Dashboard/ui/DashboardCharts/DashboardCharts.tsx` — summary «Динамика»/«Активность» (do not remove; OA dedupe only)

### Backend
- `aiPBX_backend/src/operator-analytics/operator-analytics.service.ts` — analysis pipeline, `spotTopicKeywords`, `_topics`
- `aiPBX_backend/src/operator-analytics/lib/keyword-spotting.ts` — keyword match to extend for project taxonomy

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Drawer` (`shared/ui/redesigned/Drawer`) — side panel shell for operator/topic/call stack
- `OperatorScoreTable` — add clickable rows / `onOperatorSelect`
- `ReportShowAnalytics` — per-call metric evidence display inside stacked call view
- `DashboardConfigGrid` / builder `tag-cloud` — theme cloud patterns; fixed «Темы» section is new primary surface
- `keyword-spotting` + `_topics.keywords` — foundation for project taxonomy matching

### Established Patterns
- FSD: feature `OperatorAnalytics`, entity `Report`, RTK Query APIs
- Phase 3: custom `dashboardConfig` replaces mid layout when present; scorecard stays outside mid-charts today
- i18n via `reports` (+ related) namespaces; ru+en minimum for DoD
- Insights drill-down historically used `/calls` + sessionStorage — **operator/topic Phase 10 flow stays in-panel** (D-03)

### Integration Points
- OA dashboard page wiring project/date filters into panel queries
- Project wizard / settings for taxonomy CRUD
- Call journal + export for tag chips / CSV columns
- Backend analysis path to apply project dictionary tags; PATCH (or equivalent) for manual tag edits

</code_context>

<specifics>
## Specific Ideas

- Volume charts on OA feel like summary-dashboard territory; OA heatmap type differs from summary «Активность» — keep calendar capability via builder, not fixed OA
- Best-practice recommendation accepted: controlled project taxonomy first; LLM free tags deferred
- User clarified costs: remove **OperatorUsageSection** specifically; keep cost StatCards

</specifics>

<deferred>
## Deferred Ideas

- LLM free-form tags / hybrid “new theme” moderation UI
- LLM closed-set classification into taxonomy
- Batch «перетегировать период» without full re-analysis
- Shareable deep-link URL for open operator/topic panel
- Stable `operatorId` instead of name-only identity
- Moving/adding OA-style heatmap onto summary dashboard
- Changing billing/payment modules (out of scope)

</deferred>

---

*Phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t*
*Context gathered: 2026-07-29*
