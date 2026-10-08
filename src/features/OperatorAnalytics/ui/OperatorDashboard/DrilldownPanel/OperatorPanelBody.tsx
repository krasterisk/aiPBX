import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@mui/material'
import { ChevronRight } from 'lucide-react'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import {
    type OperatorEvidenceMetric,
    useGetOperatorEvidence,
} from '@/entities/Report'
import type { PanelEntry } from '../../../model/panelStack'
import { formatEvidenceMetricAverage, formatEvidenceMetricValue, getMetricLabelKey } from '../../../lib/metricVisual'
import cls from './OperatorPanelBody.module.scss'

const EVIDENCE_PAGE_SIZE = 20

export interface DashboardFilters {
    startDate?: string
    endDate?: string
    projectId?: string
    userId?: string
}

interface OperatorPanelBodyProps {
    entry: Extract<PanelEntry, { kind: 'operator' }>
    filters: DashboardFilters
    onSelectMetric?: (metricId: string, metricLabel: string) => void
}

interface OperatorMetricPanelBodyProps {
    description?: string
    entry: Extract<PanelEntry, { kind: 'operatorMetric' }>
    filters: DashboardFilters
    onOpenCall: (channelId: string, fromLabel: string) => void
}

function buildQueryArgs(
    operatorName: string | undefined,
    filters: DashboardFilters,
) {
    return {
        ...(operatorName ? { operatorName } : {}),
        startDate: filters.startDate,
        endDate: filters.endDate,
        projectId: filters.projectId,
        userId: filters.userId,
    }
}

function formatPeriodLabel(startDate?: string, endDate?: string): string {
    if (startDate && endDate) return `${startDate} - ${endDate}`
    if (startDate) return startDate
    if (endDate) return endDate
    return ''
}

function metricLabel(
    metric: OperatorEvidenceMetric,
    t: (key: string) => string,
): string {
    if (metric.label) return metric.label
    const labelKey = getMetricLabelKey(metric.metricId)
    return labelKey ? String(t(labelKey)) : metric.metricId
}

export const OperatorPanelBody = memo((props: OperatorPanelBodyProps) => {
    const { entry, filters, onSelectMetric } = props
    const { t } = useTranslation('reports')
    const [expandedMetricId, setExpandedMetricId] = useState<string | null>(null)

    const queryArgs = useMemo(
        () => buildQueryArgs(entry.operatorName, filters),
        [entry.operatorName, filters],
    )

    const { data, isLoading, isFetching, isError, refetch } = useGetOperatorEvidence(
        queryArgs,
        { skip: !entry.operatorName },
    )

    const loading = isLoading || isFetching

    const handleMetricActivate = useCallback((metric: OperatorEvidenceMetric) => {
        if (onSelectMetric) {
            onSelectMetric(metric.metricId, metricLabel(metric, t))
            return
        }
        setExpandedMetricId(prev => (prev === metric.metricId ? null : metric.metricId))
    }, [onSelectMetric, t])

    if (loading && !data) {
        return (
            <VStack gap="8" max align="stretch" className={cls.root} data-testid="operator-panel-loading">
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} variant="rounded" height={56} width="100%" />
                ))}
            </VStack>
        )
    }

    if (isError) {
        return (
            <div className={cls.errorBlock} data-testid="operator-panel-error">
                <Text title={String(t('Не удалось загрузить разбор'))} bold />
                <Text
                    text={String(t('Проверьте соединение и повторите. Если ошибка повторяется, обновите страницу.'))}
                    size="m"
                />
                <Button variant="glass-action" size="s" onClick={() => { void refetch() }}>
                    {String(t('Повторить'))}
                </Button>
            </div>
        )
    }

    if (!data?.metrics.length) {
        const period = formatPeriodLabel(filters.startDate, filters.endDate)
        return (
            <div className={cls.emptyBlock} data-testid="operator-panel-empty">
                <Text title={String(t('Нет обоснований по метрикам'))} bold />
                <Text
                    text={String(t('В звонках за этот период анализ не оставил цитат и пояснений. Попробуйте расширить период.'))}
                    size="m"
                />
                {period && (
                    <Text text={period} size="xs" className={cls.cappedNotice} />
                )}
            </div>
        )
    }

    return (
        <VStack gap="16" max align="stretch" className={cls.root} data-testid="operator-panel-body">
            <div className={cls.headlineBlock} data-testid="operator-panel-headline">
                <Text
                    text={String(t('Средний балл'))}
                    size="xs"
                    className={cls.headlineLabel}
                />
                <div className={cls.headline}>
                    {data.averageScore.toFixed(1)}
                </div>
            </div>

            {data.sampleCapped && (
                <div data-testid="operator-panel-capped-notice">
                    <Text
                        text={String(t('По последним {{count}} звонкам', { count: data.scoredCalls }))}
                        size="xs"
                        className={cls.cappedNotice}
                    />
                </div>
            )}

            <div className={cls.metricList}>
                {data.metrics.map(metric => {
                    const label = metricLabel(metric, t)
                    const display = formatEvidenceMetricAverage(metric.metricId, metric.average, t)
                    const expanded = expandedMetricId === metric.metricId
                    return (
                        <div key={metric.metricId}>
                            <button
                                type="button"
                                className={cls.metricRow}
                                onClick={() => { handleMetricActivate(metric) }}
                                aria-expanded={onSelectMetric ? undefined : expanded}
                                data-testid={`operator-metric-row-${metric.metricId}`}
                            >
                                <div className={cls.metricRowHeader}>
                                    <Text text={label} size="m" className={cls.metricLabel} />
                                    <HStack gap="8" align="center">
                                        <Text
                                            text={display.text}
                                            size="m"
                                            bold
                                            variant={display.variant}
                                        />
                                        <ChevronRight size={16} className={cls.metricChevron} aria-hidden />
                                    </HStack>
                                </div>
                                {!onSelectMetric && expanded && metric.evidence.length > 0 && (
                                    <div
                                        className={cls.evidenceBlock}
                                        data-testid={`operator-metric-evidence-${metric.metricId}`}
                                    >
                                        {metric.evidence.map(item => (
                                            <div key={`${item.channelId}-${item.createdAt}`} className={cls.evidenceItem}>
                                                {item.quote && (
                                                    <div data-testid="evidence-quote">
                                                        <Text
                                                            text={`«${item.quote}»`}
                                                            size="m"
                                                            className={cls.quote}
                                                        />
                                                    </div>
                                                )}
                                                {item.rationale && (
                                                    <div data-testid="evidence-rationale">
                                                        <Text
                                                            text={item.rationale}
                                                            size="m"
                                                            className={cls.rationale}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </button>
                        </div>
                    )
                })}
            </div>
        </VStack>
    )
})

export const OperatorMetricPanelBody = memo((props: OperatorMetricPanelBodyProps) => {
    const { entry, filters, description, onOpenCall } = props
    const { t } = useTranslation('reports')
    const [page, setPage] = useState(1)
    const scopeKey = `${entry.metricId}|${entry.operatorName ?? ''}|${filters.startDate ?? ''}|${filters.endDate ?? ''}|${filters.projectId ?? ''}`
    const [seenScope, setSeenScope] = useState(scopeKey)
    let evidencePage = page
    if (seenScope !== scopeKey) {
        setSeenScope(scopeKey)
        setPage(1)
        evidencePage = 1
    }

    const evidenceArgs = useMemo(
        () => ({
            ...buildQueryArgs(entry.operatorName, filters),
            metricId: entry.metricId,
            order: 'worst',
            evidencePage,
            evidencePageSize: EVIDENCE_PAGE_SIZE,
        }),
        [entry.metricId, entry.operatorName, evidencePage, filters],
    )

    const { data: evidenceData, isLoading: evidenceLoading, isError, refetch } = useGetOperatorEvidence(
        evidenceArgs,
    )

    const metric = evidenceData?.metrics.find(m => m.metricId === entry.metricId)

    const loading = evidenceLoading && !evidenceData

    if (loading) {
        return (
            <VStack gap="8" max align="stretch" className={cls.root} data-testid="operator-metric-loading">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} variant="rounded" height={72} width="100%" />
                ))}
            </VStack>
        )
    }

    if (isError) {
        return (
            <div className={cls.errorBlock} data-testid="operator-metric-error">
                <Text title={String(t('Не удалось загрузить разбор'))} bold />
                <Text
                    text={String(t('Проверьте соединение и повторите. Если ошибка повторяется, обновите страницу.'))}
                    size="m"
                />
                <Button variant="glass-action" size="s" onClick={() => { void refetch() }}>
                    {String(t('Повторить'))}
                </Button>
            </div>
        )
    }

    const label = entry.metricLabel ?? (metric ? metricLabel(metric, t) : entry.metricId)
    const evidenceValues = metric?.evidence.map(item => item.value) ?? []
    const display = formatEvidenceMetricAverage(
        entry.metricId,
        metric?.average ?? null,
        t,
        { evidenceValues },
    )
    const sampleSize = metric?.sampleSize || metric?.evidenceTotal || metric?.evidence.length || 0
    const evidenceTotal = metric?.evidenceTotal ?? metric?.evidence.length ?? 0
    const pageSize = metric?.evidencePageSize || EVIDENCE_PAGE_SIZE
    const totalPages = Math.max(1, Math.ceil(evidenceTotal / pageSize))

    return (
        <VStack gap="16" max align="stretch" className={cls.root} data-testid="operator-metric-panel">
            {description?.trim() && (
                <details key={entry.metricId} className={cls.promptDetails}>
                    <summary>{String(t('Описание для LLM'))}</summary>
                    <p className={cls.promptText}>{description}</p>
                </details>
            )}
            <div className={cls.headlineBlock}>
                <Text
                    text={String(t(display.labelKey))}
                    size="xs"
                    className={cls.headlineLabel}
                />
                <Text
                    text={display.text}
                    size="l"
                    bold
                    variant={display.variant}
                    className={cls.headline}
                />
                <Text
                    text={String(t('Оценок по метрике: {{count}}', { count: sampleSize }))}
                    size="xs"
                    className={cls.cappedNotice}
                />
            </div>

            {evidenceData?.sampleCapped && (
                <Text
                    text={String(t('По последним {{count}} звонкам', { count: evidenceData.scoredCalls }))}
                    size="xs"
                    className={cls.cappedNotice}
                />
            )}

            <div className={cls.listHeader}>
                <Text
                    text={String(t('METRIC_EVIDENCE_LIST_TITLE', { count: evidenceTotal }))}
                    size="m"
                    bold
                />
                <Text
                    text={String(t('METRIC_EVIDENCE_LIST_HINT'))}
                    size="xs"
                    className={cls.listHint}
                />
            </div>

            <div className={cls.evidenceSection}>
                {evidenceTotal === 0 ? (
                    <div className={cls.emptyBlock} data-testid="operator-metric-evidence-empty">
                        <Text text={String(t('Нет обоснований по метрикам'))} size="m" />
                    </div>
                ) : metric?.evidence.map(item => {
                    const valueDisplay = formatEvidenceMetricValue(item.value, t)
                    const dateLabel = new Date(item.createdAt).toLocaleString(undefined, {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })

                    return (
                        <button
                            key={`${item.channelId}-${item.createdAt}`}
                            type="button"
                            className={cls.evidenceItem}
                            onClick={() => { onOpenCall(item.channelId, label) }}
                            data-testid={`evidence-call-${item.channelId}`}
                        >
                            <div className={cls.rowMain}>
                                <HStack max justify="between" align="center" gap="8">
                                    <Text text={dateLabel} size="s" bold className={cls.rowTitle} />
                                    {valueDisplay && (
                                        <Text
                                            text={valueDisplay.text}
                                            size="s"
                                            bold
                                            variant={valueDisplay.variant}
                                        />
                                    )}
                                </HStack>
                                {item.quote && (
                                    <Text text={`«${item.quote}»`} size="m" className={cls.quote} />
                                )}
                                {item.rationale && (
                                    <Text text={item.rationale} size="s" className={cls.rationale} />
                                )}
                            </div>
                            <div className={cls.rowAside}>
                                <HStack gap="4" align="center" className={cls.openHint}>
                                    <span>{String(t('Открыть'))}</span>
                                    <ChevronRight size={14} aria-hidden />
                                </HStack>
                            </div>
                        </button>
                    )
                })}
            </div>

            {totalPages > 1 && (
                <HStack max justify="between" align="center" className={cls.pagination} data-testid="operator-metric-pagination">
                    <Button
                        variant="glass-action"
                        size="s"
                        disabled={evidencePage <= 1}
                        onClick={() => { setPage(p => Math.max(1, p - 1)) }}
                        data-testid="operator-metric-prev-page"
                    >
                        {String(t('Назад'))}
                    </Button>
                    <Text
                        text={String(t('TOPICS_PAGE_INDICATOR', { page: evidencePage, totalPages }))}
                        size="xs"
                    />
                    <Button
                        variant="glass-action"
                        size="s"
                        disabled={evidencePage >= totalPages}
                        onClick={() => { setPage(p => Math.min(totalPages, p + 1)) }}
                        data-testid="operator-metric-next-page"
                    >
                        {String(t('Далее'))}
                    </Button>
                </HStack>
            )}
        </VStack>
    )
})
