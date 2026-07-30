# Phase 10: Speech analytics UX overhaul — operator drill-down, call tags, topic reports - Pattern Map

**Mapped:** 2026-07-30
**Files analyzed:** 36 (21 frontend `aiPBX`, 15 backend `aiPBX_backend`)
**Analogs found:** 34 / 36

> Source of file list: `10-CONTEXT.md` decisions D-01…D-30, `10-RESEARCH.md` "Recommended Project Structure" + Patterns 1–7, `10-UI-SPEC.md` Component Inventory.
> Every excerpt below was read from the live repos in this session. Line numbers are current as of 2026-07-30.

---

## File Classification

### Frontend — `C:/Users/Professional/WebstormProjects/aiPBX`

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/shared/ui/redesign-v3/SidePanel/SidePanel.tsx` (NEW) | component (overlay shell) | event-driven | `src/shared/ui/mui/Drawer/ui/Drawer.tsx` | exact (MUI Drawer + `sx` theme-var seam) |
| `src/shared/ui/redesign-v3/SidePanel/SidePanel.module.scss` (NEW) | styles | — | `src/shared/ui/redesign-v3/Tooltip/Tooltip.module.scss` | exact |
| `src/shared/ui/redesign-v3/SidePanel/index.ts` (NEW) | barrel | — | `src/shared/ui/redesign-v3/index.ts` | exact |
| `src/features/OperatorAnalytics/model/panelStack.ts` (NEW) | utility (typed state helpers) | transform | `src/features/OperatorAnalytics/lib/insightDrilldown.ts` | role-match (pure feature-lib module; storage mechanism differs — D-03/D-07 forbid sessionStorage) |
| `…/OperatorDashboard/OperatorDashboard.tsx` (EDIT) | component (container) | request-response | itself (lines 313–533 define the ternary boundary being reshuffled) | self |
| `…/OperatorDashboard/OperatorScoreTable/OperatorScoreTable.tsx` (EDIT) | component (table) | transform | itself + `AiInsightsBanner` clickable-evidence `<button>` (lines 169–181) | role-match |
| `…/OperatorDashboard/TopicsSection/TopicsSection.tsx` (NEW) | component (section) | request-response | `…/OperatorUsageSection/OperatorUsageSection.tsx` | exact (Card section shell + loading + empty state) |
| `…/OperatorDashboard/TopicsSection/TopicsSection.module.scss` (NEW) | styles | — | `…/OperatorScoreTable/OperatorScoreTable.module.scss` | role-match |
| `…/OperatorDashboard/DrilldownPanel/DrilldownPanel.tsx` (NEW) | component (router by stack top) | event-driven | `OperatorDashboard.tsx` `hasCustomDashboard` branch (lines 313–320) | partial |
| `…/DrilldownPanel/OperatorPanelBody.tsx` (NEW) | component | request-response | `AiInsightsBanner/AiInsightsBanner.tsx` | exact (RTK query + skeleton + error + empty in one card) |
| `…/DrilldownPanel/TagPanelBody.tsx` (NEW) | component | request-response | `AiInsightsBanner.tsx` + `OperatorUsageSection.tsx` | exact |
| `…/DrilldownPanel/CallPanelBody.tsx` (NEW) | component (leaf) | request-response | `src/entities/Report/ui/ReportShowAnalytics/ReportShowAnalytics.tsx` | exact (reuse, do not re-implement) |
| Tag chip row (planner picks `entities/Report` or `features/Calls`) (NEW) | component | transform | `ReportShowAnalytics.tsx` lines 199–203 (`topic-keywords` badge) + `@include chip-base` | role-match |
| `src/entities/Report/api/reportApi.ts` (EDIT) | api client | request-response | itself, lines 210–224 (`getOperatorDashboard`) + 311–318 (`saveMetricOverrides`) | exact |
| `src/entities/Report/model/types/report.ts` (EDIT) | model (types) | — | itself, lines 178–189 (`_assessments`/`_topics`) + 373–379 (`AgentScorecard`) | exact |
| `src/features/Calls/lib/callsExportSheet.ts` (EDIT) | utility | transform | itself, lines 151–157 + 223–224 (`EXPORT_KEYWORDS`) | self |
| `src/features/Calls/lib/callsExportSheet.test.ts` (EDIT) | test | — | itself, lines 38 + 52 | self |
| Taxonomy editor in `…/ProjectWizard/` (NEW) | component | CRUD | `…/ProjectWizard/WizardStep2_MetricBuilder.tsx` | exact |
| `…/ProjectWizard/ProjectSettingsForm.tsx` (EDIT) | component (form) | CRUD | itself, lines 51–77 (`handleSave` → `updateProject`) | self |
| `…/OperatorDashboard/{OperatorDashboard,DrilldownPanel,TopicsSection}.test.tsx` (NEW) | test | — | `src/entities/Report/ui/ReportShowAnalytics/ReportShowAnalytics.test.tsx` | role-match (only RTL analog with an i18n mock) |
| `public/locales/{ru,en,de,zh}/reports.json` (EDIT) | config | — | existing `reports` namespace | exact |
| `…/OperatorDashboard/OperatorUsageSection/**` (DELETE) | — | — | — | n/a (removal) |

### Backend — `C:/Users/Professional/WebstormProjects/aiPBX_backend`

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `migrations/postgres/2026-XX-XX-operator-call-taxonomy.sql` (NEW) | migration | — | `migrations/postgres/2026-06-18-operator-metric-values.sql` | exact |
| `migrations/mysql/2026-XX-XX-operator-call-taxonomy.sql` (NEW) | migration | — | `migrations/mysql/2026-06-18-operator-metric-values.sql` | exact |
| `src/operator-analytics/operator-call-tag.model.ts` (NEW) | model | CRUD | `src/operator-analytics/operator-metric-value.model.ts` | exact |
| `src/operator-analytics/operator-project.model.ts` (EDIT) | model | — | itself, lines 53–55 (`customMetricsSchema` JSON column) | self |
| `src/operator-analytics/interfaces/operator-metrics.interface.ts` (EDIT) | model (types) | — | `MetricDefinition` in the same file | exact |
| `src/operator-analytics/lib/keyword-spotting.ts` (EDIT) | utility | transform | itself, lines 10–19 (`spotKeywords`) | self |
| `src/operator-analytics/lib/keyword-spotting.spec.ts` (EDIT) | test | — | itself | self |
| `src/operator-analytics/lib/tag-stats.ts` (NEW) | utility (pure aggregation) | batch | `operator-analytics.service.ts` `buildAgentScorecards` lines 1601–1658 | exact (algorithm) / `lib/insights-drilldown.ts` (file shape) |
| `src/operator-analytics/lib/tag-stats.spec.ts` (NEW) | test | — | `lib/dashboard-aggregation.spec.ts` | exact |
| `src/operator-analytics/lib/operator-evidence.ts` (NEW) | utility (pure aggregation) | batch | `lib/insights-drilldown.ts` + `ReportShowAnalytics.getAssessment` (lines 114–129) | role-match |
| `src/operator-analytics/lib/operator-evidence.spec.ts` (NEW) | test | — | `lib/dashboard-aggregation.spec.ts` | exact |
| `src/operator-analytics/lib/dashboard-aggregation.ts` (EDIT) | utility | transform | itself, lines 4–48 (`buildDashboardCdrWhere`) | self |
| `src/operator-analytics/dto/project.dto.ts` (EDIT) | DTO (validation) | — | itself, lines 7–63 (`MetricDefinitionDto` + `UpdateSchemaDto`) | exact |
| `src/operator-analytics/dto/operator-evidence.dto.ts` (NEW) | DTO (response) | — | `dto/operator-insights-response.dto.ts` | exact |
| `src/operator-analytics/operator-analytics.controller.ts` (EDIT) | controller | request-response | itself, lines 564–583 (`@Get('dashboard')`) + 623–645 (`@Post(':id/overrides')`) | exact |
| `src/operator-analytics/operator-analytics.service.ts` (EDIT) | service | CRUD + batch | itself — `getDashboard` (1442–1468), `getCdrs` (1212–1316), `saveMetricOverrides` (1140–1197), `writeMetricValues` (2704–2749), `updateProject` (1727–1768) | self |
| `src/operator-analytics/operator-analytics.service.spec.ts` (EDIT) | test | — | itself | self |
| `src/operator-analytics/operator-analytics.module.ts` (EDIT) | config (DI) | — | itself, line 30 (`SequelizeModule.forFeature`) | self |
| `openapi.json` + `aiPBX/src/shared/api/generated/schema.d.ts` (REGEN) | build artifact | — | CI gates `openapi:check` / `generate:api-types:check` | n/a |

---

## Pattern Assignments

### `src/shared/ui/redesign-v3/SidePanel/SidePanel.tsx` (component, event-driven)

**Analog A (behaviour + styling seam):** `src/shared/ui/mui/Drawer/ui/Drawer.tsx` — the whole file, lines 1–48.
**Analog B (redesign-v3 file conventions):** `src/shared/ui/redesign-v3/Tooltip/Tooltip.tsx` lines 1–28.

**Imports + props-object convention** (`mui/Drawer/ui/Drawer.tsx` lines 1–18):

```tsx
import { classNames } from '@/shared/lib/classNames/classNames'
import { memo, ReactNode } from 'react'
import { SwipeableDrawer } from '@mui/material'

interface DrawerProps {
  className?: string
  children: ReactNode
  isOpen?: boolean
  onClose?: () => void
}

export const Drawer = memo((props: DrawerProps) => {
  const {
    className,
    children,
    isOpen,
    onClose
  } = props
```

Note the house style, visible in both analogs: `memo((props: XProps) => { const { … } = props`, **not** destructuring in the parameter list. `redesign-v3/Tooltip` uses the same shape with `cls` from a co-located `.module.scss` (line 4: `import cls from './Tooltip.module.scss'`).

**Core pattern — `MuiDrawer-paper` + `sx` + theme CSS vars** (`mui/Drawer/ui/Drawer.tsx` lines 20–47). This is the exact seam to copy; change `SwipeableDrawer`→`Drawer`, add `anchor="right"`, swap `borderRight`→`borderLeft`, and replace the hardcoded width with the UI-SPEC widths:

```tsx
    <SwipeableDrawer
      open={!!isOpen}
      onClose={() => onClose?.()}
      className={classNames('', {}, [className])}
      sx={{
        '& .MuiDrawer-paper': {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '80vw',          // ← replace: clamp(480px, 38vw, 560px), 100vw @ ≤600px
          maxWidth: '320px',      // ← replace per 10-UI-SPEC "Panel Contract"
          boxSizing: 'border-box',
          overflowY: 'auto',
          background: 'var(--bg-redesigned)',
          color: 'var(--text-redesigned)',
          borderRight: '1px solid var(--glass-border-primary)',   // ← borderLeft
        }
      }}
    >
      {children}
    </SwipeableDrawer>
```

**Do NOT** copy `swipeAreaWidth` / `disableSwipeToOpen` / `onOpen` — those exist only because the analog uses `SwipeableDrawer`. Plain `Drawer` needs none of them.

**Breakpoint constant:** `600px` — verified in `src/app/styles/variables/mixins.scss` lines 430–434:

```scss
@mixin mobile {
    @media (max-width: 600px) {
        @content;
    }
}
```

---

### `src/shared/ui/redesign-v3/SidePanel/SidePanel.module.scss` (styles)

**Analog:** `src/shared/ui/redesign-v3/Tooltip/Tooltip.module.scss`.

**Import + token discipline** (lines 1, 23–33) — note: every colour is a `var(--…)`, spacing uses `--space-N`:

```scss
@import '@/app/styles/variables/mixins';

.tooltipInner {
    padding: var(--space-2) var(--space-3);
    background: var(--card-bg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg), var(--shadow-accent-sm);
    color: var(--text-redesigned);
    font-size: var(--font-size-s);
    backdrop-filter: var(--glass-blur-md);
}
```

**Mixins the UI-SPEC requires** (`src/app/styles/variables/mixins.scss`):

```scss
@mixin glass-card-tertiary {          // line 32 — evidence blocks in the panel body
    background: var(--glass-bg-tertiary);
    backdrop-filter: var(--glass-blur-sm);
    border-radius: var(--radius-md);
    border: var(--glass-border-subtle);
    transition: var(--transition-normal);
}

@mixin hover-card-row {               // line 59 — every clickable metric/evidence/call row
    transition: var(--transition-slow);
    &:hover {
        transform: scale(1.01);
        box-shadow: var(--shadow-lg), var(--shadow-accent-md);
        border-color: rgba(94, 211, 243, 0.3);
        background: var(--glass-bg-tertiary);
    }
}

@mixin chip-base {                    // line 207 — tag chips
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--chip-padding);
    border-radius: var(--chip-radius);
    background: var(--chip-bg);
    border: var(--chip-border);
    font-size: var(--font-size-xs);
    font-weight: 700;
}

@mixin focus-visible {                // line 492 — panel back/close, all interactive rows
    &:focus-visible {
        outline: 2px solid var(--accent-redesigned);
        outline-offset: 2px;
    }
}

@mixin text-clamp($lines: 2) { … }    // line 265 — evidence quote clamp(4)
@mixin custom-scrollbar { … }         // line 352 — panel body scroll
@mixin flex-between { … }             // line 464 — panel header
```

---

### `src/shared/ui/redesign-v3/SidePanel/index.ts` (barrel)

**Analog:** `src/shared/ui/redesign-v3/index.ts` lines 1–13 — named re-export + separate `export type`:

```ts
export { Input } from './Input'
export type { InputProps, InputSize } from './types'
```

Add `export { SidePanel } from './SidePanel'` to the generation barrel too; `SidePanelProps` goes next to it as a `export type`.

---

### `src/features/OperatorAnalytics/model/panelStack.ts` (utility, transform)

**Analog:** `src/features/OperatorAnalytics/lib/insightDrilldown.ts` (lines 1–50) — a pure, dependency-free feature-lib module exporting a discriminated payload type plus small functions:

```ts
import type { CdrSource, OperatorInsight } from '@/entities/Report'

export interface InsightDrilldownPayload {
    startDate?: string
    endDate?: string
    projectId?: string
    userId?: string
    search?: string
}

export function buildInsightDrilldownPayload(…): InsightDrilldownPayload | null { … }
```

**Copy the shape, not the mechanism.** `insightDrilldown.ts` persists through `sessionStorage` (lines 15–28) because Phase 3 D-02 navigated to `/calls`. Phase 10 D-03/D-07 forbid both navigation and persisted state — `panelStack.ts` exports only the `PanelEntry` union and pure `push`/`pop`/`clear`/`titleFor` helpers over a `useState` array owned by `OperatorDashboard`. Leave `insightDrilldown.ts` untouched; the AI-insights flow still uses it (`AiInsightsBanner.tsx` lines 87–92).

---

### `…/OperatorDashboard/TopicsSection/TopicsSection.tsx` (component, request-response)

**Analog:** `…/OperatorDashboard/OperatorUsageSection/OperatorUsageSection.tsx` — the component being deleted is also the best structural template for the one replacing it.

**Imports** (lines 1–12):

```tsx
import { memo, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@mui/material'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import cls from './TopicsSection.module.scss'
```

**Section shell + title/subtitle/CTA header** (lines 49–71):

```tsx
<Card max variant="glass" border="partial" padding="24" className={cls.section}>
    <VStack gap="16" max>
        <HStack max justify="between" align="center" wrap="wrap" gap="8">
            <VStack gap="4">
                <Text title={String(t('OA_USAGE_TITLE'))} bold />
                <Text text={String(t('OA_USAGE_SUBTITLE'))} size="s" />
            </VStack>
            <Button variant="glass-action" size="s" onClick={handleViewAll}>
                {String(t('OA_USAGE_VIEW_ALL'))}
            </Button>
        </HStack>
```

The title/subtitle `VStack gap="4"` is exactly the shape the UI-SPEC mandates for the two drill-down sections. The same pattern already exists on the ranking card — `OperatorDashboard.tsx` lines 516–523 — so keep both sections identical:

```tsx
<VStack gap={'4'} max>
    <Text title={String(t('Рейтинг операторов'))} bold />
    <Text text={String(t('OPERATOR_SCORE_RANKING_SUBTITLE'))} size={'s'} />
</VStack>
```

**Loading + empty-state branches** (`OperatorUsageSection.tsx` lines 97–107) — copy this three-branch structure for the two distinct «Темы» empty states (D-21 no-taxonomy vs. zero-matches):

```tsx
{loading && (
    <VStack gap="8" max>
        {[1, 2, 3].map(i => (
            <Skeleton key={i} variant="rounded" height={40} width="100%" />
        ))}
    </VStack>
)}

{!loading && data && data.rows.length === 0 && (
    <Text text={String(t('OA_USAGE_EMPTY'))} size="s" />
)}
```

**i18n convention:** the analog mixes identity keys (`t('Проект')`) with SCREAMING keys (`t('OA_USAGE_TITLE')`). Per UI-SPEC and C13, prefer the identity-key style used across `OperatorDashboard.tsx` (`t('Рейтинг операторов')`) for new user-visible copy.

---

### `…/OperatorDashboard/DrilldownPanel/OperatorPanelBody.tsx` and `TagPanelBody.tsx` (component, request-response)

**Analog:** `…/OperatorDashboard/AiInsightsBanner/AiInsightsBanner.tsx` — the only OA component that already does query + loading + error + empty + clickable-evidence in one place.

**Query-args memoisation and prop-drilled filters** (lines 15–35, 64–68) — this is how D-06 is satisfied without touching Redux:

```tsx
interface AiInsightsBannerProps {
    projectName?: string
    queryParams?: {
        startDate?: string
        endDate?: string
        projectId?: string
        userId?: string
        operatorName?: string
    }
}

export const AiInsightsBanner = memo(({ projectName, queryParams }: AiInsightsBannerProps) => {
    const { t } = useTranslation('reports')
    const [triggerInsights, { data, isLoading, isFetching, isError }] = useLazyGetOperatorInsights()
```

**Loading / error / empty triad** (lines 123–133, 196–198):

```tsx
{loading && (
    <VStack gap={'8'} max>
        {[1, 2, 3].map(i => (
            <Skeleton key={i} variant="rounded" height={72} width="100%" />
        ))}
    </VStack>
)}

{isError && (
    <Text text={String(t('INSIGHTS_ERROR'))} size={'s'} variant={'warning'} />
)}

{showData && insights.length === 0 && !loading && (
    <Text text={String(t('Недостаточно данных для генерации инсайтов'))} size={'s'} />
)}
```

UI-SPEC upgrades the error case to heading + body + «Повторить» — extend this branch, don't invent a new component.

**Accessible clickable row** (lines 169–181) — the existing precedent for "make a rendered element drill-downable" is a real `<button type="button">`, which is exactly what the UI-SPEC Accessibility Contract requires for panel rows:

```tsx
{evidenceText && (
    canDrillDown(insight) ? (
        <button
            type="button"
            className={`${cls.evidenceChip} ${cls.evidenceChipClickable}`}
            onClick={() => { handleEvidenceClick(insight) }}
            title={String(t('INSIGHT_DRILLDOWN_HINT'))}
        >
            {evidenceText}
        </button>
    ) : (
        <span className={cls.evidenceChip}>{evidenceText}</span>
    )
)}
```

**Metric colouring — reuse, never re-derive** (`OperatorDashboard.tsx` lines 36–64). Both panel bodies must import these rather than copy them, or panel colours will drift from the dashboard the manager clicked (D-02 credibility):

```tsx
const normalizeRate = (rate?: number): number => {
    if (!rate) return 0
    return rate > 1 ? rate : rate * 100
}

const metricVisual = (
    value: number,
    opts: { min?: number, max?: number, polarity?: MetricPolarity, isRate?: boolean },
): { pct: number, color: string } => { … }
```

Note `normalizeRate` is currently **duplicated** in `OperatorDashboard.tsx` (36–39) and `OperatorScoreTable.tsx` (9–12). Do not add a third copy — hoist to a shared module in the same plan that adds the panel.

---

### `…/OperatorDashboard/DrilldownPanel/CallPanelBody.tsx` (component, leaf)

**Analog:** `src/entities/Report/ui/ReportShowAnalytics/ReportShowAnalytics.tsx` — **reuse the component, don't re-implement**. It already handles operator vs. bot metric shapes, quality dimming, and assessments.

**Assessment reader + quote de-duplication** (lines 113–129) — this exact logic must also be mirrored server-side by `lib/operator-evidence.ts`; extract it into a shared pure helper rather than writing it twice:

```tsx
const assessments = metrics._assessments as Record<string, { rationale?: string, quote?: string }> | undefined
const legacyEvidence = metrics._evidence
const normalizeQuote = (s: string) => s.replace(/[«»"'`]/g, '').trim().toLowerCase()
const getAssessment = (key: string): { rationale?: string, quote?: string } | undefined => {
    const a = assessments?.[key]
    if (a && (a.rationale || a.quote)) {
        let quote = a.quote
        // Drop the quote if the model already embedded it inside the rationale
        if (quote && a.rationale && normalizeQuote(a.rationale).includes(normalizeQuote(quote))) {
            quote = undefined
        }
        return { rationale: a.rationale, quote }
    }
    const legacy = legacyEvidence?.[key]
    return legacy ? { quote: legacy } : undefined
}
```

**Existing topic badge** (lines 199–203) — the tag chip row sits beside this; keep `_topics.keywords` rendering intact (a test asserts on `data-testid="topic-keywords"`):

```tsx
{(metrics._topics?.keywords?.length ?? 0) > 0 && (
    <span className={cls.sentimentBadge} data-sentiment="neutral" data-testid="topic-keywords">
        {metrics._topics!.keywords!.join(', ')}
    </span>
)}
```

---

### `src/entities/Report/api/reportApi.ts` (api client, request-response)

**Analog:** the file itself.

**Query with filtered params** (lines 210–224) — copy verbatim for `getOperatorEvidence`; the `undefined`/`''` filter is what keeps empty filters out of the URL:

```ts
getOperatorDashboard: build.query<OperatorDashboardResponse, {
  startDate?: string
  endDate?: string
  operatorName?: string
  projectId?: string
  userId?: string
}>({
  query: (args) => ({
    url: '/operator-analytics/dashboard',
    params: Object.fromEntries(
      Object.entries(args).filter(([, v]) => v !== undefined && v !== '')
    )
  }),
  providesTags: ['OperatorAnalytics']
}),
```

**Mutation with per-id invalidation** (lines 311–318) — copy for `updateCallTags`; add `{ type: 'Reports', id: 'LIST' }` so journal chips refresh:

```ts
saveMetricOverrides: build.mutation<MetricOverride[], { id: string, overrides: MetricOverrideInput[] }>({
  query: ({ id, overrides }) => ({
    url: `/operator-analytics/${id}/overrides`,
    method: 'POST',
    body: { overrides }
  }),
  invalidatesTags: (result, error, { id }) => [{ type: 'OperatorAnalytics', id }]
}),
```

**Optimistic update with rollback** (lines 119–126) — the pattern for UI-SPEC's "optimistic chip removal reverts on failure":

```ts
async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
  const patchResult = dispatch(
    reportApi.util.updateQueryData('getReport', id, (draft) => {
      Object.assign(draft, patch)
    })
  )
  queryFulfilled.catch(patchResult.undo)
},
```

**Hook export block** (lines 374–393) — every new endpoint needs a matching `export const useX = reportApi.useXQuery/Mutation` line in the "Operator Analytics hooks" section.

---

### `src/entities/Report/model/types/report.ts` (model, types)

**Analog:** the file itself.

**Where `TagDefinition['id'][]` lands** (lines 177–189) — add a sibling `tags` key; do **not** overload `keywords`:

```ts
  /** Per-metric reasoning: why the model assigned each score (+ supporting quote) */
  _assessments?: Record<string, { rationale?: string, quote?: string }>
  /** Legacy: bare supporting quotes (pre-assessments records) */
  _evidence?: Record<string, string>
  …
  /** Keyword spotting hits (compliance / competitor mentions) */
  _topics?: { keywords?: string[] }        // ← add: tags?: string[]; tag_names?: Record<string,string>
```

**Response-shape convention for a new dashboard block** (lines 333–379) — `tagStats?: TagStat[]` goes beside `agentScorecards`, and `TagStat` mirrors `AgentScorecard`'s flat-number shape:

```ts
export interface OperatorDashboardResponse {
  …
  excludedLowQualityCount?: number
  agentScorecards?: AgentScorecard[]
}

export interface AgentScorecard {
  operatorName: string
  callsCount: number
  averageScore: number
  successRate: number
  avgCsat: number | null
  negativeRate: number
}
```

**Project shape for the taxonomy** (lines 494–507) — `callTaxonomy?: TagDefinition[]` goes beside `customMetricsSchema`. ⚠ Note `id: string` here vs. `INTEGER` on the wire — this is RESEARCH Pitfall 3; the `String(p.id) === String(projectId)` fix belongs in the same plan because D-29 depends on it.

---

### `src/features/Calls/lib/callsExportSheet.ts` (utility, transform)

**Analog:** the file itself.

**Header group to extend** (lines 151–157) — append «Теги» inside `analyticsHeaders`, adjacent to `EXPORT_KEYWORDS` (Pitfall 8):

```ts
const analyticsHeaders = [
    String(t('Саммари')),
    String(t('Качество транскрипции')),
    String(t('EXPORT_KEYWORDS')),
    String(t('Обоснование метрик')),
    String(t('Транскрипт')),
]
```

**Cell population** (lines 219–226):

```ts
if (metrics || report.transcription) {
    row[String(t('Саммари'))] = truncateCell(getSummary(report))
    row[String(t('Качество транскрипции'))] =
        report.transcriptionQuality || metrics?._quality?.quality || ''
    row[String(t('EXPORT_KEYWORDS'))] =
        metrics?._topics?.keywords?.join(', ') ?? ''
    row[String(t('Транскрипт'))] = truncateCell(report.transcription?.trim() ?? '')
}
```

Tag names come from `_topics.tag_names` (snapshot) so the column is readable without the project. Wrap long joins in the existing `truncateCell` (lines 81–82, 32767-char Excel cap).

**Test to extend** (`callsExportSheet.test.ts` lines 38, 52) — the fixture already carries `_topics: { keywords: ['возврат'] }`; add `tags` to the same fixture and one `expect(rows[0]['Теги'])` assertion.

---

### Taxonomy editor in `…/ProjectWizard/` (component, CRUD)

**Analog:** `…/ProjectWizard/WizardStep2_MetricBuilder.tsx` — a controlled list-of-objects editor with add/remove/field-change, driven entirely by props. This is the exact template for the tag dictionary (name + aliases + optional colour).

**Controlled-list handlers** (lines 43–76):

```tsx
const generateId = (name: string): string =>
    name.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') || `metric_${Date.now()}`

const handleAdd = useCallback(() => {
    onChangeMetrics([...metrics, { id: `metric_${Date.now()}`, name: '', type: 'boolean', description: '' }])
}, [metrics, onChangeMetrics])

const handleRemove = useCallback((idx: number) => {
    onChangeMetrics(metrics.filter((_, i) => i !== idx))
}, [metrics, onChangeMetrics])

const handleChange = useCallback((idx: number, field: keyof MetricDefinition, value: any) => {
    const updated = metrics.map((m, i) => {
        if (i !== idx) return m
        const newMetric = { ...m, [field]: value }
        if (field === 'name') { newMetric.id = generateId(value) }
        return newMetric
    })
    onChangeMetrics(updated)
}, [metrics, onChangeMetrics])
```

**Row card + delete affordance** (lines 104–124) — UI-SPEC requires a `Modal` confirmation for taxonomy deletion, so wire `handleRemove` through the modal instead of calling it directly:

```tsx
<Card key={idx} variant={'glass'} border={'partial'} padding={'16'} max>
    <VStack gap={'12'} max>
        <HStack max justify={'between'} align={'center'}>
            <Text text={metric.name || String(t('Новая метрика'))} bold />
            <Button variant={'glass-action'} color={'error'} size={'s'}
                onClick={() => { handleRemove(idx) }}
                addonLeft={<DeleteOutlineIcon fontSize={'small'} />}>
                {String(t('Удалить'))}
            </Button>
        </HStack>
```

**Comma-separated list field** (lines 148–157) — exactly what tag `aliases` needs:

```tsx
<Textarea
    label={String(t('Значения (через запятую)'))}
    value={metric.enumValues?.join(', ') || ''}
    onChange={e => { handleChange(idx, 'enumValues', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)) }}
    size={'small'} fullWidth multiline={false}
/>
```

**Save path** (`ProjectSettingsForm.tsx` lines 51–77) — add `callTaxonomy` to the existing `updateProject({ … }).unwrap()` payload; no new mutation:

```tsx
await updateProject({
    id: editProject.id,
    name: name.trim() || String(t('Новый проект')),
    …
    customMetricsSchema: customMetrics,
    monthlyBudgetUsd,
}).unwrap()
```

---

### `…/OperatorDashboard/*.test.tsx` (tests)

**Analog:** `src/entities/Report/ui/ReportShowAnalytics/ReportShowAnalytics.test.tsx` — the only RTL test in the repo close to these surfaces.

**Mock header + fixture + assertion style** (lines 1–24, 115–138):

```tsx
import { render, screen } from '@testing-library/react'

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'ru', changeLanguage: jest.fn() }
    })
}))

jest.mock('./MetricOverridePanel', () => ({ MetricOverridePanel: () => null }))

describe('ReportShowAnalytics', () => {
    it('renders operator view with data-testid="analytics-operator"', () => {
        render(<ReportShowAnalytics analytics={operatorAnalytics} />)
        expect(screen.getByTestId('analytics-operator')).toBeInTheDocument()
        expect(screen.queryByTestId('analytics-bot')).not.toBeInTheDocument()
    })
```

⚠ **Gap the planner must close:** this analog renders a presentational component with no store. `OperatorDashboard` calls `useGetOperatorProjects()` (RTK Query), so its test needs a store/i18n wrapper. Nothing in `src/shared/lib/tests/` was confirmed for this; the cheapest path matching the analog is `jest.mock('@/entities/Report', …)` for the hooks, same as the `MetricOverridePanel` mock above. Add `data-testid` attributes to the new sections so removal assertions (D-09/D-11) can use `queryByTestId` rather than translated strings.

---

### `migrations/{postgres,mysql}/2026-XX-XX-operator-call-taxonomy.sql` (migration)

**Analog:** the `2026-06-18-operator-metric-values.sql` pair — copy both, don't hand-translate one into the other.

Postgres (lines 1–21):

```sql
-- Migration: normalized metric_values table (dual-write alongside JSON)
-- Dialect: PostgreSQL

CREATE TABLE IF NOT EXISTS operator_metric_values (
    id SERIAL PRIMARY KEY,
    "channelId" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(255),
    "projectId" INTEGER,
    "metricId" VARCHAR(255) NOT NULL,
    origin VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_metric_values_channel ON operator_metric_values ("channelId");
CREATE INDEX IF NOT EXISTS idx_metric_values_project ON operator_metric_values ("projectId");
```

MySQL twin (lines 1–20) — note `AUTO_INCREMENT`, backticks, `TINYINT(1)`, `TIMESTAMP(3)`, inline `INDEX`, and the trailing engine clause:

```sql
-- Dialect: MySQL 8.0+
CREATE TABLE IF NOT EXISTS operator_metric_values (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `channelId` VARCHAR(255) NOT NULL,
    `projectId` INT NULL,
    origin VARCHAR(20) NOT NULL,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_metric_values_channel (`channelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

The `ALTER TABLE operator_projects ADD COLUMN "callTaxonomy"` half has a precedent in `2026-02-26-add-webhook-headers.sql` (both dialects, same date-prefixed naming).

---

### `src/operator-analytics/operator-call-tag.model.ts` (model, CRUD)

**Analog:** `src/operator-analytics/operator-metric-value.model.ts` — the whole file, lines 1–66. Same dual-write philosophy, same column-decorator style.

```ts
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

export type MetricValueOrigin = 'default' | 'custom' | 'summary';   // ← TagSource = 'auto' | 'manual'

interface MetricValueCreationAttrs {
    channelId: string;
    userId?: string;
    projectId?: number;
    metricId: string;
    origin: MetricValueOrigin;
}

/**
 * Normalized, queryable storage for analysis metric values.
 *
 * Written in addition to the JSON blob on AiAnalytics.metrics (dual-write). The JSON
 * remains the source of truth for existing readers; this table enables future
 * dialect-aware SQL aggregation/filtering/sorting without breaking anything.
 */
@Table({ tableName: 'operator_metric_values', timestamps: true, updatedAt: false })
export class MetricValue extends Model<MetricValue, MetricValueCreationAttrs> {
    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: '123', description: 'AiCdr.channelId (= OperatorAnalytics.id as string)' })
    @Column({ type: DataType.STRING, allowNull: false })
    channelId: string;
```

The doc-comment is worth copying almost verbatim for `operator_call_tags` — it is the written record of the convention Pattern 4 relies on.

**JSON column on the project** (`operator-project.model.ts` lines 53–55) — `callTaxonomy` copies this exactly:

```ts
@ApiProperty({ description: 'Custom metrics schema definitions' })
@Column({ type: DataType.JSON, allowNull: false, defaultValue: [] })
customMetricsSchema: MetricDefinition[];
```

**Module registration** (`operator-analytics.module.ts` line 30) — add the new model to the array:

```ts
SequelizeModule.forFeature([OperatorAnalytics, OperatorApiToken, OperatorProject, MetricValue, MetricOverride, Prices, User, AiCdr, AiAnalytics, BillingRecord]),
```

---

### `src/operator-analytics/lib/keyword-spotting.ts` (utility, transform)

**Analog:** the file itself, lines 1–19 — `spotTaxonomyTags` becomes a third export beside these two:

```ts
/**
 * Lightweight keyword spotting for compliance phrases / competitor mentions (R&D).
 * Case-insensitive substring match on normalized transcript text.
 */
export function parseKeywordList(raw?: string | null): string[] { … }

export function spotKeywords(transcription: string, keywords: string[]): string[] {
    if (!transcription?.trim() || !keywords.length) return [];
    const haystack = transcription.toLowerCase();
    const hits: string[] = [];
    for (const kw of keywords) {
        if (!kw) continue;
        if (haystack.includes(kw.toLowerCase())) hits.push(kw);
    }
    return hits;
}
```

Note the guard-clause-first shape and the lowercased haystack hoisted out of the loop — keep both. `spotKeywords` stays byte-identical (D-20 / Pattern 4 non-negotiable).

**Its spec** (`keyword-spotting.spec.ts` lines 1–25) is the file to extend — nested `describe` per exported function, Cyrillic fixtures already present:

```ts
import { parseKeywordList, spotKeywords } from './keyword-spotting';

describe('keyword-spotting', () => {
    describe('spotKeywords', () => {
        it('finds case-insensitive matches', () => {
            const hits = spotKeywords('Клиент упомянул КОНКУРЕНТ в разговоре', ['конкурент', 'возврат']);
            expect(hits).toEqual(['конкурент']);
        });
    });
});
```

Add a `describe('spotTaxonomyTags')` block with the boundary cases named in RESEARCH Pattern 5 (`акт` must not match `контакт`).

---

### `src/operator-analytics/lib/tag-stats.ts` (utility, batch)

**Analog A (algorithm):** `operator-analytics.service.ts` `buildAgentScorecards`, lines 1601–1658. `buildTagStats` is the same group-then-average shape, keyed by tag instead of operator.

```ts
private buildAgentScorecards(records: AiCdr[]): Array<{ operatorName: string; callsCount: number; … }> {
    const numericKeys = ['greeting_quality', 'script_compliance', /* … */ 'closing_quality'];
    const byOperator = new Map<string, AiCdr[]>();
    for (const r of records) {
        const name = (r.assistantName || '').trim() || 'Unknown Operator';
        if (!byOperator.has(name)) byOperator.set(name, []);
        byOperator.get(name)!.push(r);
    }

    const scorecards = Array.from(byOperator.entries()).map(([operatorName, rows]) => {
        let successCount = 0; let negativeCount = 0; let csatSum = 0; let csatCount = 0; let scored = 0;
        for (const r of rows) {
            const m = r.analytics?.metrics;
            if (!m) continue;
            scored++;
            if (m.success) successCount++;
            const sentiment = (r.analytics?.sentiment || m.customer_sentiment || '').toLowerCase();
            if (sentiment === 'negative') negativeCount++;
            const csat = r.analytics?.csat ?? m.csat;
            if (typeof csat === 'number') { csatSum += csat; csatCount++; }
        }
        const denom = scored || 1;                       // ← divide-by-zero guard, copy it
        return {
            operatorName,
            callsCount: rows.length,                      // ← rows.length, not `scored`
            successRate: parseFloat(((successCount / denom) * 100).toFixed(2)),
            avgCsat: csatCount ? parseFloat((csatSum / csatCount).toFixed(2)) : null,
            negativeRate: parseFloat(((negativeCount / denom) * 100).toFixed(2)),
        };
    });

    return scorecards.sort((a, b) => b.callsCount - a.callsCount);   // ← A-06 ordering
}
```

Three conventions to carry over exactly, or the panel numbers will disagree with the dashboard: `denom = scored || 1`, `parseFloat(x.toFixed(2))` on every derived number, and `callsCount = rows.length` (not the scored subset).

**Analog B (file shape for a pure lib):** `lib/insights-drilldown.ts` lines 1–15 — typed deps passed in, no Nest decorators, no repository import:

```ts
import { Op, WhereOptions } from 'sequelize';
import type { AiCdr } from '../../ai-cdr/ai-cdr.model';

function readMetricValue(record: AiCdr, metricKey: string): number | null {
    const metrics = record.analytics?.metrics as Record<string, unknown> | undefined;
    if (!metrics) return null;
    const nested = metrics.metrics as Record<string, unknown> | undefined;
    const raw = nested?.[metricKey] ?? metrics[metricKey];
    if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
    return null;
}
```

**Call site** (`operator-analytics.service.ts` lines 1442–1450) — `buildTagStats` slots in beside these two, reusing the single `findByPk`:

```ts
let customMetricsAggregated: Record<string, { type: string; value?: number; distribution?: Record<string, number> }> = {};
if (query.projectId) {
    const project = await this.projectRepository.findByPk(query.projectId);
    if (project?.customMetricsSchema?.length) {
        customMetricsAggregated = this.aggregateCustomMetrics(recordsForDerived, project.customMetricsSchema);
    }
}

const agentScorecards = this.buildAgentScorecards(recordsForDerived);
```

---

### `src/operator-analytics/lib/operator-evidence.ts` (utility, batch)

**Analog:** `lib/insights-drilldown.ts` lines 60–101 — bounded `findAll`, in-memory sort, capped result loop. This is the anti-`loadDashboardCdrPages` precedent (Pitfall 7):

```ts
const EXEMPLAR_LIMIT = 5;

const rows = await deps.aiCdrRepository.findAll({
    where,
    attributes: ['channelId', 'analytics'],
    limit: 120,
    order: [['createdAt', 'DESC']],
});

let ordered = rows;
if (evidence.metric) {
    const metricKey = evidence.metric;
    const lowIsBad = insightType === 'gap' || insightType === 'outlier' || insightType === 'quality';
    ordered = [...rows].sort((a, b) => {
        const av = readMetricValue(a, metricKey) ?? (lowIsBad ? 999 : -1);
        const bv = readMetricValue(b, metricKey) ?? (lowIsBad ? 999 : -1);
        return lowIsBad ? av - bv : bv - av;
    });
}

const ids: string[] = [];
for (const row of ordered) {
    if (!row.channelId) continue;
    if (ids.includes(row.channelId)) continue;
    ids.push(row.channelId);
    if (ids.length >= EXEMPLAR_LIMIT) break;
}
return ids;
```

The `worst`/`best` ordering in the evidence endpoint contract maps directly onto this `lowIsBad` sort. The assessment reader it needs is the `getAssessment` excerpt above (`ReportShowAnalytics.tsx` lines 114–129).

**Spec analog for both new libs:** `lib/dashboard-aggregation.spec.ts` (whole file, 23 lines) — plain function-in / assert-out, no Nest test module:

```ts
import { buildDashboardCdrWhere } from './dashboard-aggregation';
import { Op } from 'sequelize';

describe('dashboard-aggregation', () => {
    const likeOp = (v: string) => ({ [Op.like]: v });

    it('buildDashboardCdrWhere scopes non-admin to realUserId', () => {
        const where = buildDashboardCdrWhere({}, false, '42', likeOp);
        expect(where.userId).toBe('42');
    });
});
```

---

### `src/operator-analytics/lib/dashboard-aggregation.ts` (utility, transform)

**Analog:** the file itself, lines 4–48. The `operatorNameExact` branch (Pitfall 2) goes immediately before the existing substring branch:

```ts
export interface DashboardCdrFilters {
    userId?: string;
    projectId?: number;
    startDate?: string;
    endDate?: string;
    operatorName?: string;
}

export function buildDashboardCdrWhere(
    query: DashboardCdrFilters,
    isAdmin: boolean,
    realUserId: string,
    likeOp: (value: string) => Record<string, string>,
): Record<string, unknown> {
    const where: Record<string, unknown> = {};

    if (!isAdmin) {
        where.userId = String(realUserId);
    } else if (query.userId) {
        where.userId = query.userId;
    }
    …
    if (query.operatorName) {
        where.assistantName = likeOp(`%${query.operatorName}%`);   // ← keep for the search box
    }
```

Same substring clause is duplicated in raw SQL at lines 85–89 and 164–168 (`ILIKE`/`LIKE` by dialect) and again in `getCdrs` (service line 1247). Anywhere the panel filters, use the exact-match variant; anywhere the free-text search box filters, keep the substring.

---

### `src/operator-analytics/dto/project.dto.ts` (DTO, validation)

**Analog:** the file itself, lines 7–63. `TagDefinitionDto` is `MetricDefinitionDto` with different fields; `callTaxonomy` on the update DTO is `customMetricsSchema` with a different `@Type`.

```ts
class MetricDefinitionDto {
    @ApiProperty({ example: 'upsell_attempt', description: 'snake_case identifier' })
    @IsString()
    @MaxLength(50)
    id: string;

    @ApiProperty({ example: 'Попытка апселла' })
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiPropertyOptional({ example: ['low', 'medium', 'high'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    enumValues?: string[];              // ← aliases: string[] copies this exactly
}

export class UpdateSchemaDto {
    @ApiProperty({ type: [MetricDefinitionDto], description: 'Custom metrics definitions' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MetricDefinitionDto)
    @ArrayMaxSize(20)
    customMetricsSchema: MetricDefinitionDto[];
}
```

`@ArrayMaxSize` + `@MaxLength` are the ReDoS/XSS caps the Security Domain requires on aliases; add `@ArrayMaxSize` to the alias array too, not just the tag array.

---

### `src/operator-analytics/dto/operator-evidence.dto.ts` (DTO, response)

**Analog:** `dto/operator-insights-response.dto.ts` — whole file, lines 1–58. Nested class per level, `@ApiProperty`/`@ApiPropertyOptional` on every field (this is what feeds `openapi.json` → the FE `schema.d.ts` CI gate):

```ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OperatorInsightEvidenceDto {
    @ApiPropertyOptional({ example: 'greeting_quality' })
    metric?: string;

    @ApiPropertyOptional({ type: [String], description: 'Exemplar CDR channel IDs for drill-down (max 5)' })
    channelIds?: string[];
}

export class OperatorInsightDto {
    @ApiProperty({ enum: ['high', 'medium', 'low'], example: 'high' })
    priority: 'high' | 'medium' | 'low';

    @ApiProperty({ type: OperatorInsightEvidenceDto })
    evidence: OperatorInsightEvidenceDto;
}

export class OperatorInsightsResponseDto {
    @ApiProperty({ type: [OperatorInsightDto] })
    insights: OperatorInsightDto[];

    @ApiProperty({ example: 42 })
    sampleSize: number;

    @ApiProperty({ example: false })
    lowConfidence: boolean;
}
```

`sampleSize`/`lowConfidence` are the direct precedent for `scoredCalls`/`sampleCapped`.

---

### `src/operator-analytics/operator-analytics.controller.ts` (controller, request-response)

**Analog:** the file itself.

**Imports + request typing** (lines 1–25):

```ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles-auth.decorator';

interface RequestWithUser extends Request {
    isAdmin?: boolean;
    tokenUserId?: string;
    vpbxUserId?: string;
}
```

**Static GET route + tenant resolution** (lines 564–583) — `@Get('operator-evidence')` must be declared in this block, **above** `@Get(':id')` at line 664 (Pitfall 9):

```ts
@Get('dashboard')
@ApiBearerAuth()
@Roles('ADMIN', 'USER')
@UseGuards(RolesGuard)
@ApiOperation({ summary: 'Get aggregated dashboard data' })
@ApiResponse({ status: 200, description: 'Dashboard metrics' })
async getDashboard(
    @Req() req: RequestWithUser,
    @Query() query: { userId?: string; startDate?: string; endDate?: string; operatorName?: string; projectId?: number },
) {
    const isAdmin = req.isAdmin ?? false;
    const realUserId = isAdmin ? null : (req.vpbxUserId || req.tokenUserId);
    return this.service.getDashboard(query, isAdmin, realUserId);
}
```

**`:id`-scoped write route** (lines 623–645) — the template for `@Patch(':id/tags')`; note the explicit `Unauthorized` throw and that `isAdmin` is passed through so the service can run `assertRecordAccess`:

```ts
@Post(':id/overrides')
@ApiBearerAuth()
@Roles('ADMIN', 'USER')
@UseGuards(RolesGuard)
@ApiOperation({ summary: 'Create/update supervisor metric overrides (stored separately from LLM values)' })
async saveOverrides(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() body: { overrides: Array<{ metricId: string; … }> },
) {
    const userId = req.vpbxUserId || req.tokenUserId;
    if (!userId) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return this.service.saveMetricOverrides(id, userId, req.isAdmin ?? false, body?.overrides);
}
```

Place `@Patch(':id/tags')` next to the override routes (612–660), i.e. still above `@Get(':id')`.

---

### `src/operator-analytics/operator-analytics.service.ts` (service, CRUD + batch)

**Analog:** the file itself. Five call sites the plan touches:

**1. Tenant/ownership guard for the tag PATCH** (lines 1122–1130) — throws 404, not 403, so record existence isn't leaked:

```ts
private async assertRecordAccess(channelId: string, userId?: string, isAdmin?: boolean): Promise<AiCdr> {
    const where: any = { channelId: String(channelId) };
    if (!isAdmin && userId) where.userId = String(userId);
    const record = await this.aiCdrRepository.findOne({ where });
    if (!record) {
        throw new HttpException('Analysis not found', HttpStatus.NOT_FOUND);
    }
    return record;
}
```

**2. Manual-edit write path** (lines 1152–1197) — the exact template for `updateCallTags`: guard → derive `ownerUserId` from the record (never from the actor) → validate → upsert → audit line → return current state:

```ts
const record = await this.assertRecordAccess(channelId, actorUserId, isAdmin);
const ownerUserId = String(record.userId);

if (!Array.isArray(overrides) || overrides.length === 0) {
    throw new HttpException('No overrides provided', HttpStatus.BAD_REQUEST);
}

for (const o of overrides) {
    if (!o || typeof o.metricId !== 'string' || !o.metricId) {
        throw new HttpException('Each override requires a metricId', HttpStatus.BAD_REQUEST);
    }
    const payload = { channelId: String(channelId), userId: ownerUserId, actorUserId: String(actorUserId), … };
    const existing = await this.metricOverrideRepository.findOne({ where: { channelId: String(channelId), metricId: o.metricId } });
    if (existing) { await existing.update(payload); } else { await this.metricOverrideRepository.create(payload as any); }
}

this.logger.log(`AUDIT ${JSON.stringify({
    kind: 'operator_metric_override',
    channelId: String(channelId),
    actorUserId: String(actorUserId),
    metrics: overrides.map(o => o.metricId),
    at: new Date().toISOString(),
})}`);
```

**3. Audit line for the evidence read** (lines 1101–1117) — verbatim template; note the swallowed `catch` so audit never breaks the read, and that **no quote text is logged**:

```ts
/**
 * Structured access audit for PII reads (transcript/recording).
 * Emitted as a JSON log line so it can be shipped to a SIEM without a new table.
 */
private logTranscriptAccess(actorUserId: string | undefined, recordId: number, action: 'read'): void {
    try {
        this.logger.log(`AUDIT ${JSON.stringify({
            kind: 'operator_transcript_access',
            action, recordId,
            actorUserId: actorUserId ?? null,
            at: new Date().toISOString(),
        })}`);
    } catch {
        // never let audit logging break the read path
    }
}
```

**4. `getCdrs` tag filter insertion point** (lines 1246–1273) — the `tagId` subquery clause goes right after the `projectId` clause and before the `search` block, which owns `where[Op.or]`:

```ts
if (query.operatorName) {
    where.assistantName = this.likeOp(`%${query.operatorName}%`);
}

if (query.projectId) {
    where.projectId = query.projectId;
}
// ← tagId clause here; must set where.channelId = { [Op.in]: [...] } with a
//    '__none__' sentinel on empty match so "no rows" ≠ "no filter"

if (query.search && query.search.trim() !== '') {
    …
    where[Op.or] = searchConditions;
}
```

The 500-capped id-subquery at lines 1264–1271 is the in-repo precedent for that shape.

**5. The destroy-before-insert trap** (lines 2742–2748) — read this before writing any tag persistence; it is Pitfall 1 in source form:

```ts
        await this.metricValueRepository.destroy({ where: { channelId } });
        if (rows.length) {
            await this.metricValueRepository.bulkCreate(rows as any);
        }
    } catch (e) {
        this.logger.warn(`metric_values dual-write failed for channel ${channelId}: ${(e as Error).message}`);
    }
```

The `try/catch { logger.warn }` wrapper **is** the pattern for defensive writes against a possibly-unmigrated column (Pitfall 5) — copy it for taxonomy reads/writes, naming the migration file in the message. The `destroy({ where: { channelId } })` is what you must **not** copy for tags; scope any tag delete to `source: 'auto'`.

**6. Taxonomy write on the project** (lines 1751–1754) — `callTaxonomy` follows this shape **without** the version bump (Pattern 4 non-negotiable):

```ts
if (data.customMetricsSchema !== undefined) {
    project.customMetricsSchema = data.customMetricsSchema;
    project.currentSchemaVersion = (project.currentSchemaVersion || 1) + 1;   // ← do NOT do this for callTaxonomy
}
```

---

## Shared Patterns

### Tenant scoping (backend, every new endpoint)
**Source:** `operator-analytics.controller.ts` lines 580–582 (reads) and `operator-analytics.service.ts` lines 1122–1130 (writes)
**Apply to:** `GET /operator-evidence`, `PATCH /:id/tags`, `tagId` on `GET /cdrs`, `tagStats` in `getDashboard`

```ts
// Read endpoints — controller resolves the tenant, service never re-derives it
const isAdmin = req.isAdmin ?? false;
const realUserId = isAdmin ? null : (req.vpbxUserId || req.tokenUserId);

// Write endpoints — ownership proven against the record itself
await this.assertRecordAccess(channelId, userId, isAdmin);
```

### Structured audit logging (backend)
**Source:** `operator-analytics.service.ts` lines 1105–1117, 1185–1191
**Apply to:** evidence reads (returns verbatim customer speech) and manual tag edits

```ts
this.logger.log(`AUDIT ${JSON.stringify({ kind: '…', actorUserId: …, at: new Date().toISOString() })}`);
```

### Defensive persistence against unapplied migrations (backend)
**Source:** `operator-analytics.service.ts` lines 2711, 2746–2748
**Apply to:** every `callTaxonomy` / `operator_call_tags` read and write

```ts
try { /* … */ } catch (e) {
    this.logger.warn(`… failed for channel ${channelId}: ${(e as Error).message}`);
}
```
Reads default to `[]`; the warn message names the migration file so a 500 on one server is self-diagnosing.

### Rounding + divide-by-zero on every derived number (backend)
**Source:** `buildAgentScorecards` lines 1645, 1650–1653
**Apply to:** `buildTagStats`, `getOperatorEvidence`

```ts
const denom = scored || 1;
averageScore: parseFloat(aggregated.toFixed(2)),
successRate: parseFloat(((successCount / denom) * 100).toFixed(2)),
```

### RTK Query param hygiene (frontend)
**Source:** `reportApi.ts` lines 204–206, 219–221, 343–350
**Apply to:** every new query endpoint

```ts
params: Object.fromEntries(
  Object.entries(args).filter(([, v]) => v !== undefined && v !== '')
)
```

### Card section shell (frontend)
**Source:** `OperatorUsageSection.tsx` lines 50–63; `OperatorDashboard.tsx` lines 508–523
**Apply to:** `TopicsSection`, and the reshuffled ranking card

```tsx
<Card max variant={'glass'} border={'partial'} padding={'24'} data-tour-id="…">
    <VStack gap={'16'} max>
        <VStack gap={'4'} max>
            <Text title={String(t('…'))} bold />
            <Text text={String(t('…SUBTITLE'))} size={'s'} />
        </VStack>
        …
    </VStack>
</Card>
```

### Loading / error / empty triad (frontend)
**Source:** `AiInsightsBanner.tsx` lines 123–133, 196–198; `OperatorUsageSection.tsx` lines 97–107
**Apply to:** `TopicsSection`, all three panel bodies

MUI `<Skeleton variant="rounded" …/>` in the target geometry → `<Text variant="warning">` error → `<Text size="s">` empty. UI-SPEC upgrades the error branch to heading + body + retry button; extend, don't replace.

### i18n key style (frontend)
**Source:** `OperatorDashboard.tsx` lines 236, 244, 518 — `String(t('Рейтинг операторов'))`
**Apply to:** all new user-visible copy in the `reports` namespace, in `ru`/`en`/`de`/`zh`
The Russian string is the key. Do not introduce a dotted scheme mid-namespace (C13). `String(t(…))` wrapping is mandatory for `Text` props in this codebase.

### Tour-anchor preservation (frontend)
**Source:** `OperatorDashboard.tsx` lines 211 (`oa-insights`), 233 (`oa-upload-entry`), 274 (`oa-stats`), 514 (`oa-scorecard`)
**Apply to:** the D-25/D-26 reshuffle — all four attributes must survive on their new positions (Pitfall 4). `oa-usage` (line 56 of `OperatorUsageSection.tsx`) disappears with the component and is not referenced by the tour.

### FE/BE contract regeneration (both repos)
**Source:** CI gates `openapi:check` (BE) and `generate:api-types:check` (FE)
**Apply to:** any plan touching a DTO
`npm run openapi:export` (BE) → `npm run sync:openapi && npm run generate:api-types` (FE) → commit `openapi.json` **and** `src/shared/api/generated/schema.d.ts`.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/features/OperatorAnalytics/model/panelStack.ts` | utility | transform | No stacked-modal navigation state exists anywhere in the repo. `insightDrilldown.ts` is the closest *file shape* but its mechanism (sessionStorage + route change) is explicitly ruled out by D-03/D-07. Use RESEARCH Pattern 1 verbatim. |
| `…/OperatorDashboard/OperatorDashboard.test.tsx` (harness portion) | test | — | No RTL test in the repo renders a component that calls an RTK Query hook. `ReportShowAnalytics.test.tsx` covers assertion style and the i18n mock, but the store/hook wrapper has no precedent — mock `@/entities/Report` hooks the way that file mocks `MetricOverridePanel`, or add a wrapper in `src/shared/lib/tests/`. |

Partial-analog notes the planner should not mistake for exact matches:

- **`DrilldownPanel.tsx` (body router)** — no in-repo component switches body content off a discriminated union. `OperatorDashboard.tsx`'s `hasCustomDashboard ? … : …` (lines 313–320) is a two-way branch only.
- **Panel header with back + close** — `ProjectWizard/WizardHeader.tsx` is the nearest header-with-close, but it is page chrome, not modal chrome; take the 64px sticky `@include flex-between` spec from the UI-SPEC rather than from that file.

---

## Metadata

**Analog search scope:**
`aiPBX/src/{shared/ui/{mui,redesign-v3,redesigned},features/OperatorAnalytics,features/Calls,entities/Report,pages/DashboardCallRecordsPage,app/styles/variables}`;
`aiPBX_backend/src/operator-analytics/{,lib,dto,interfaces}` and `aiPBX_backend/migrations/{postgres,mysql}`.

**Files read in full:** 22 · **Files read in targeted ranges:** 3 (`operator-analytics.service.ts`, `operator-analytics.controller.ts`, `mixins.scss`) · **Files enumerated:** ~130

**Pattern extraction date:** 2026-07-30
