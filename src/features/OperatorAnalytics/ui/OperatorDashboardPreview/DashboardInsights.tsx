import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronRight, ChevronUp, RefreshCw, Sparkles } from 'lucide-react'
import { useLazyQualityInsightsQuery, type DashboardInsight, type DashboardInsightsResponse, type OperatorProject } from '@/entities/Report'
import { SidePanel } from '@/shared/ui/redesign-v3'
import { createInsightMetricNames, applyInsightMetricNames, insightMetricLabel } from '../../lib/insightMetrics'
import type { PreviewFilters } from './previewModel'
import cls from './DashboardInsights.module.scss'

interface Props {
    filters: PreviewFilters
    project?: OperatorProject
    total: number
    renderCallDetail?: (id: string, onDeleted: () => void) => ReactNode
}

/** Explicit generation: changing filters never sends a paid model request. */
export function DashboardInsights({ filters, project, total, renderCallDetail }: Props) {
    const { t, i18n } = useTranslation('dashboard-insights')
    const { t: r } = useTranslation('reports')
    const [generate] = useLazyQualityInsightsQuery()
    const [result, setResult] = useState<{ key: string, data: DashboardInsightsResponse }>()
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [selected, setSelected] = useState<DashboardInsight>()
    const [call, setCall] = useState<string>()
    const key = JSON.stringify(Object.entries(filters).sort(([a], [b]) => a.localeCompare(b)))
    const generation = useRef(0)
    const pending = useRef(false)
    useEffect(() => {
        generation.current++
        pending.current = false
        setBusy(false); setError(false); setSelected(undefined); setCall(undefined); setCollapsed(false)
        return () => { generation.current++ }
    }, [key])
    const data = result?.key === key ? result.data : undefined
    const names = createInsightMetricNames(k => String(r(k)), k => String(i18n.getFixedT('en', 'reports')(k)), Object.fromEntries((project?.customMetricsSchema ?? []).map(m => [m.id, m.name])))
    const fetch = async () => {
        if (pending.current || !total) return
        pending.current = true
        const request = ++generation.current
        setBusy(true); setError(false)
        try {
            const response = await generate({ ...filters, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, refresh: Boolean(data) }, false).unwrap()
            if (request === generation.current) { setResult({ key, data: response }); setCollapsed(false) }
        } catch {
            if (request === generation.current) setError(true)
        } finally {
            if (request === generation.current) { pending.current = false; setBusy(false) }
        }
    }
    const text = (value: string) => applyInsightMetricNames(value, names)
    const valueWithUnit = (value: number | undefined, unit?: string) => `${value ?? '—'}${unit === 'percent' ? '%' : unit === 'points' ? ` ${t('points')}` : ''}`
    const categoryLabel = (value: string) => value === 'true' ? t('answerYes') : value === 'false' ? t('answerNo') : value
    const tone = (insight: DashboardInsight) => insight.type === 'strength' ? cls.strength : insight.priority === 'high' ? cls.high : cls.medium
    const close = () => { setSelected(undefined); setCall(undefined) }
    const hasInsights = Boolean(data && !data.lowConfidence && data.insights.length)
    const expanded = hasInsights && !collapsed && !busy
    const summary = !total ? t('empty') : !data ? t(result ? 'stale' : 'initial') : data.lowConfidence ? t('low', { count: data.sampleSize }) : !data.insights.length ? t('noInsights') : `${project?.name || t('allProjects')} · ${t('selection', { count: total })}`
    return <section className={`${cls.root} ${expanded ? '' : cls.compact}`} aria-label={String(t('title'))}>
        <header className={cls.header}>
            <div className={cls.intro}><h2><Sparkles size={18} aria-hidden />{t('title')}{data && <small>{t('count', { count: data.insights.length })}</small>}</h2>
                <p className={cls.summary}>{summary}</p>
            </div>
            <div className={cls.actions}>{data && <small className={cls.updated}>{t('updated', { time: new Date(data.generatedAt).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' }) })}</small>}<button type="button" className={data ? cls.refreshIcon : undefined} disabled={busy || !total} onClick={fetch} aria-label={String(t(busy ? 'generating' : data ? 'refresh' : 'generate'))}><RefreshCw size={14} aria-hidden /><span>{busy ? t('generatingCompact') : data ? t('refresh') : t('generateCompact')}</span></button>{hasInsights && <button type="button" className={cls.toggle} disabled={busy} aria-expanded={expanded} aria-label={String(t(collapsed ? 'expand' : 'collapse'))} title={String(t(collapsed ? 'expand' : 'collapse'))} onClick={() => { setCollapsed(value => !value) }}>{collapsed ? <ChevronDown size={18} aria-hidden /> : <ChevronUp size={18} aria-hidden />}</button>}</div>
        </header>
        {error && <p role="alert">{t('error')}</p>}
        {expanded && data && <div className={cls.cards}>{data.insights.map((insight, index) => <article className={cls.card} key={index}>
                <span className={cls.category}><i className={tone(insight)} />{t('type_' + insight.type)}</span>
                <h3>{text(insight.title)}</h3>
                {insight.evidence.value != null && <div className={cls.value}><strong>{insight.evidence.value}{insight.evidence.unit === 'percent' ? '%' : ''}</strong><small>{insight.evidence.unit === 'points' ? t('points') : insight.evidence.metric ? insightMetricLabel(insight.evidence.metric, names) : t('reportedValue')}</small></div>}
                <p>{text(insight.observation)}</p><div className={cls.recommendation}>{text(insight.recommendation)}</div>
                <button type="button" className={cls.evidence} onClick={() => { setSelected(insight) }}>{t('evidence')}<ChevronRight size={17} aria-hidden /></button>
            </article>)}</div>}
        <SidePanel isOpen={Boolean(selected)} onClose={close} title={call ? String(t('call')) : selected ? text(selected.title) : ''} onBack={call ? () => { setCall(undefined) } : undefined} backLabel={String(t('back'))}>
            {call && renderCallDetail ? renderCallDetail(call, close) : selected && <div className={cls.detail}>
                <p className={cls.context}>{project?.name || t('allProjects')} · {filters.startDate && new Date(filters.startDate).toLocaleDateString(i18n.language)} — {filters.endDate && new Date(filters.endDate).toLocaleDateString(i18n.language)}</p>
                <article><h3>{t('basis')}</h3><p>{text(selected.observation)}</p>{selected.evidence.metric && <p>{insightMetricLabel(selected.evidence.metric, names)}: {valueWithUnit(selected.evidence.value, selected.evidence.unit)}</p>}</article>
                {selected.evidence.assessed != null && <article><h3>{t('sample')}</h3><p>{t('assessed', { count: selected.evidence.assessed, total: selected.evidence.applicable })}</p><p>{t('na', { count: selected.evidence.notApplicable ?? 0 })}</p>{Object.entries(selected.evidence.distribution ?? {}).map(([label, count]) => <p key={label}>{categoryLabel(label)}: {count}</p>)}</article>}
                {selected.evidence.previousPeriod && <article><h3>{t('comparison')}</h3><p>{new Date(selected.evidence.previousPeriod.startDate).toLocaleDateString(i18n.language)} — {new Date(selected.evidence.previousPeriod.endDate).toLocaleDateString(i18n.language)}</p><p>{selected.evidence.previousValue} → {valueWithUnit(selected.evidence.value, selected.evidence.unit)}</p>{selected.evidence.previousChannelIds?.map((id, i) => <button type="button" key={id} className={cls.call} disabled={!renderCallDetail} onClick={() => { setCall(id) }}>{t('previousExample', { count: i + 1 })}<ChevronRight size={17} aria-hidden /></button>)}</article>}
                <article><h3>{t('action')}</h3><p>{text(selected.recommendation)}</p></article>
                <article><h3>{t('examples')}</h3><p className={cls.context}>{t('examplesHint')}</p>{selected.evidence.channelIds?.length ? selected.evidence.channelIds.map((id, i) => <button type="button" key={id} className={cls.call} onClick={() => { setCall(id) }} disabled={!renderCallDetail}>{t('example', { count: i + 1 })}<ChevronRight size={17} aria-hidden /></button>) : <p>{t('noExamples')}</p>}</article>
            </div>}
        </SidePanel>
    </section>
}
