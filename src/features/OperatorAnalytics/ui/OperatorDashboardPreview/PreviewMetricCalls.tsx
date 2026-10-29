import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useQualityEvidenceQuery as useGetOperatorEvidence } from '@/entities/Report'
import type { PanelEntry } from '../../model/panelStack'
import { formatEvidenceMetricAverage, formatEvidenceMetricValue } from '../../lib/metricVisual'
import type { PreviewFilters } from './previewModel'
import common from './OperatorDashboardPreview.module.scss'
import cls from './PreviewMetricCalls.module.scss'

interface Props {
    entry: Extract<PanelEntry, { kind: 'operatorMetric' }>
    filters: PreviewFilters
    page: number
    onPage: (page: number) => void
    onOpen: (channelId: string) => void
}

/** Uses the same evidence query and value semantics as the dashboard metric. */
export function PreviewMetricCalls({ entry, filters, page, onPage, onOpen }: Props) {
    const { t, i18n } = useTranslation('call-records-preview')
    const { t: r } = useTranslation('reports')
    const { currentData: data, isFetching, isError, refetch } = useGetOperatorEvidence({
        ...filters,
        ...(entry.operatorId ? { operatorId: entry.operatorId } : entry.operatorName ? { operatorName: entry.operatorName } : {}),
        userId: entry.operatorAccountId ?? filters.userId,
        metricId: entry.metricId,
        order: 'worst',
        evidencePage: page,
        evidencePageSize: 10
    })
    const metric = data?.metrics.find(item => item.metricId === entry.metricId)
    const rows = metric?.evidence ?? []
    const total = metric?.evidenceTotal ?? rows.length
    const pages = Math.max(1, Math.ceil(total / (metric?.evidencePageSize || 10)))
    const display = formatEvidenceMetricAverage(entry.metricId, metric?.average ?? null, r, { evidenceValues: rows.map(item => item.value) })
    if (isError) return <div className={common.message} role="alert"><p>{t('loadError')}</p><button type="button" className={common.button} onClick={() => { void refetch() }}>{t('retry')}</button></div>
    if (!data) return <p className={common.message} role="status">{t('loading')}</p>
    return <div className={cls.root} aria-busy={isFetching}>
        <div className={cls.summary}>
            <div><small>{r(display.labelKey)}</small><strong className={cls.value} data-variant={display.variant}><i aria-hidden />{display.text}</strong></div>
            <span>{r('Оценок по метрике: {{count}}', { count: metric?.sampleSize ?? total })}</span>
        </div>
        {data.sampleCapped && <p className={common.caption}>{r('По последним {{count}} звонкам', { count: data.scoredCalls })}</p>}
        <p className={common.caption}>{r('METRIC_EVIDENCE_LIST_TITLE', { count: total })}</p>
        {!rows.length ? <p className={common.message}>{r('Нет обоснований по метрикам')}</p> : rows.map(item => {
            const value = formatEvidenceMetricValue(item.value, r)
            const date = new Date(item.createdAt)
            return <button type="button" className={cls.row} key={`${item.channelId}-${item.createdAt}`} onClick={() => { onOpen(item.channelId) }}>
                <span className={cls.rowHead}><time dateTime={item.createdAt}>{date.toLocaleDateString(i18n.language)} · {date.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}</time><span className={cls.value} data-variant={value?.variant}>{value && <><i aria-hidden />{value.text}</>}<ChevronRight size={16} aria-hidden /></span></span>
                {item.quote && <span className={cls.quote}>«{item.quote}»</span>}
                {item.rationale && <span className={cls.rationale}>{item.rationale}</span>}
            </button>
        })}
        <footer className={common.pagination}><span>{t('page', { page, pages, total })}</span><div>
            <button type="button" className={common.iconButton} disabled={page <= 1 || isFetching} aria-label={String(t('previous'))} onClick={() => { onPage(page - 1) }}><ChevronLeft size={17} aria-hidden /></button>
            <button type="button" className={common.iconButton} disabled={page >= pages || isFetching} aria-label={String(t('next'))} onClick={() => { onPage(page + 1) }}><ChevronRight size={17} aria-hidden /></button>
        </div></footer>
    </div>
}
