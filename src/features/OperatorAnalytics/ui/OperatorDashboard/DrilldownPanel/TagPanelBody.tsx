import { CallPhone } from '@/entities/Report'
import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@mui/material'
import { ChevronRight, CircleHelp, Download } from 'lucide-react'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Tooltip } from '@/shared/ui/redesign-v3/Tooltip'
import { useGetOperatorCdrs, useLazyGetOperatorCdrs, type OperatorAnalysisResult, type OperatorProject, type TagStat } from '@/entities/Report'
import type { PanelEntry } from '../../../model/panelStack'
import { ALL_DEFAULT_METRICS, normalizeRate, scoreVariant } from '../../../lib/metricVisual'
import { operatorCallScore } from '../../../lib/operatorCallScore'
import { buildDistributionCallsSheet } from './distributionCallsExport'
import type { DashboardFilters } from './OperatorPanelBody'
import { DashboardHint } from '../DashboardHint'
import cls from './TagPanelBody.module.scss'

const PAGE_SIZE = 20
const EXPORT_FILE_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

interface TagPanelBodyProps {
    entry: Extract<PanelEntry, { kind: 'tag' | 'topicCalls' }>
    filters: DashboardFilters
    project?: OperatorProject
    onOpenCall: (channelId: string, fromLabel: string) => void
}

type CdrListRow = OperatorAnalysisResult & {
    callerId?: string
    analytics?: { metrics?: Record<string, unknown> }
}

function formatCallDuration(seconds: number | undefined, t: (key: string) => string): string | null {
    if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return null
    const total = Math.floor(seconds)
    const m = Math.floor(total / 60)
    const s = total % 60
    return m > 0
        ? `${m} ${t('мин')} ${s} ${t('сек')}`
        : `${s} ${t('сек')}`
}

function resolveCallMetrics(call: CdrListRow): Record<string, unknown> | undefined {
    if (call.metrics && typeof call.metrics === 'object') {
        return call.metrics as unknown as Record<string, unknown>
    }
    if (call.analytics?.metrics && typeof call.analytics.metrics === 'object') {
        return call.analytics.metrics
    }
    return undefined
}

function isMeaningfulFilename(filename?: string): boolean {
    if (!filename) return false
    const trimmed = filename.trim()
    if (!trimmed) return false
    if (/^\d+$/.test(trimmed)) return false
    return /[a-zA-Zа-яА-Я.]/.test(trimmed)
}

function formatDelta(value: number): string {
    if (value > 0) return `+${value.toFixed(1)}`
    return value.toFixed(1)
}

interface MetricHintProps {
    label: string
    hint: string
}

const MetricHintLabel = memo(({ label, hint }: MetricHintProps) => (
    <HStack gap="4" align="center" className={cls.hintLabel}>
        <Text text={label} size="xs" className={cls.statLabel} />
        <Tooltip title={hint} placement="top">
            <span className={cls.hintIcon} aria-label={hint}>
                <CircleHelp size={14} />
            </span>
        </Tooltip>
    </HStack>
))

export const TagPanelBody = memo((props: TagPanelBodyProps) => {
    const { entry, filters, project, onOpenCall } = props
    const stat: TagStat = entry.kind === 'tag' ? entry.stat : {
        tagId: entry.tagId ?? '',
        name: entry.label,
        callsCount: entry.callsCount,
        averageScore: 0,
        scoredCalls: 0,
        successRate: 0,
        sentiment: { positive: 0, neutral: 0, negative: 0 },
        shareOfPeriodCalls: undefined,
        deltaVsPeriodAverage: undefined,
    }
    const { t } = useTranslation('reports')
    const [page, setPage] = useState(1)
    const [exporting, setExporting] = useState(false)
    const [exportError, setExportError] = useState(false)
    const [fetchAllCdrs] = useLazyGetOperatorCdrs()

    const queryBase = useMemo(() => ({
        startDate: filters.startDate,
        endDate: filters.endDate,
        projectId: filters.projectId,
        userId: entry.kind === 'topicCalls' ? entry.operatorAccountId ?? filters.userId : filters.userId,
        // Backend getCdrs expects tagId (operator_call_tags), not legacy "theme".
        ...(entry.kind === 'topicCalls' && entry.tagId === null ? { withoutTopic: true } : { tagId: stat.tagId }),
        ...(entry.kind === 'topicCalls' && entry.operatorId
            ? { operatorId: entry.operatorId }
            : entry.kind === 'topicCalls' && entry.operatorName === null
            ? { withoutOperator: true }
            : entry.kind === 'topicCalls' && entry.operatorName != null
                ? { operatorNameExact: entry.operatorName }
                : {}),
    }), [filters, stat.tagId, entry])

    const cdrArgs = useMemo(() => ({
        ...queryBase,
        page,
        limit: PAGE_SIZE,
    }), [queryBase, page])

    const { data, isLoading, isFetching, isError, refetch } = useGetOperatorCdrs(cdrArgs, {
        skip: entry.kind === 'tag' && !stat.tagId,
    })

    const loading = (isLoading || isFetching) && !data
    const total = data?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const successRatePct = normalizeRate(stat.successRate)
    const delta = stat.deltaVsPeriodAverage
    const defaultKeys = project
        ? (project.visibleDefaultMetrics?.length ? project.visibleDefaultMetrics : ALL_DEFAULT_METRICS.map(({ key }) => key))
        : undefined

    const handleExport = useCallback(async () => {
        if (!total || exporting) return
        setExporting(true)
        setExportError(false)
        try {
            const result = await fetchAllCdrs({ ...queryBase, page: 1, limit: total }).unwrap()
            if (!result.data?.length) return
            const sheet = buildDistributionCallsSheet(result.data as CdrListRow[], key => String(t(key)))
            const worksheet = XLSX.utils.json_to_sheet(sheet.rows, { header: sheet.headers })
            worksheet['!cols'] = sheet.headers.map(header => ({
                wch: header === String(t('Саммари')) || header === String(t('Итог обращения'))
                    ? 48
                    : Math.min(Math.max(header.length, 12), 28),
            }))
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, 'calls')
            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
            const exportLabel = entry.kind === 'tag' ? stat.tagId : entry.label
            const tag = exportLabel.replace(/[^\p{L}\p{N}_.-]/gu, '_')
            const period = [filters.startDate, filters.endDate].filter(Boolean).join('_')
            const filename = [`topic-calls-${tag}`, period].filter(Boolean).join('_')
            saveAs(new Blob([buffer], { type: EXPORT_FILE_TYPE }), `${filename}.xlsx`)
        } catch {
            setExportError(true)
        } finally {
            setExporting(false)
        }
    }, [exporting, fetchAllCdrs, filters.startDate, filters.endDate, queryBase, stat.tagId, entry, t, total])

    if (loading) {
        return (
            <VStack gap="8" max className={cls.root} data-testid="tag-panel-loading">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} variant="rounded" height={56} width="100%" />
                ))}
            </VStack>
        )
    }

    if (isError) {
        return (
            <div className={cls.errorBlock} data-testid="tag-panel-error">
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

    return (
        <VStack gap="16" max className={cls.root} data-testid="tag-panel-body">
            {entry.kind === 'tag' && <>
            <HStack gap="8" wrap="wrap" data-testid="tag-panel-headline">
                <Text
                    text={String(t('TOPICS_DRILLDOWN_CALLS_COUNT', { count: stat.callsCount }))}
                    size="l"
                    bold
                />
                <DashboardHint hint={String(t('TOPICS_DRILLDOWN_SUMMARY_HINT'))} />
            </HStack>

            <div className={cls.statStrip} data-testid="tag-panel-stat-strip">
                <div className={cls.statItem}>
                    <MetricHintLabel
                        label={String(t('Средняя оценка'))}
                        hint={String(t('TOPICS_HINT_AVERAGE_SCORE'))}
                    />
                    <Text
                        text={stat.scoredCalls === 0 ? '-' : stat.averageScore.toFixed(1)}
                        size="m"
                        bold
                        variant={stat.scoredCalls === 0 ? undefined : scoreVariant(stat.averageScore)}
                        className={cls.statValue}
                    />
                </div>
                <div className={cls.statItem}>
                    <MetricHintLabel
                        label={String(t('Настроение клиента'))}
                        hint={String(t('TOPICS_HINT_SENTIMENT'))}
                    />
                    <div className={cls.sentimentMix}>
                        <span className={cls.sentimentPositive}>
                            {String(t('Positive'))}: {stat.sentiment.positive}
                        </span>
                        <span className={cls.sentimentNeutral}>
                            {String(t('Neutral'))}: {stat.sentiment.neutral}
                        </span>
                        <span className={cls.sentimentNegative}>
                            {String(t('Negative'))}: {stat.sentiment.negative}
                        </span>
                    </div>
                </div>
                <div className={cls.statItem}>
                    <MetricHintLabel
                        label={String(t('Успешных звонков'))}
                        hint={String(t('TOPICS_HINT_SUCCESS_RATE'))}
                    />
                    <Text
                        text={stat.scoredCalls === 0 ? '-' : `${successRatePct.toFixed(0)}%`}
                        size="m"
                        bold
                        variant={stat.scoredCalls === 0 ? undefined : scoreVariant(successRatePct)}
                        className={cls.statValue}
                    />
                </div>
            </div>

            {(stat.shareOfPeriodCalls != null || delta != null) && (
                <div className={cls.contextStrip} data-testid="tag-panel-context">
                    {stat.shareOfPeriodCalls != null && (
                        <div className={cls.contextItem}>
                            <MetricHintLabel
                                label={String(t('TOPICS_SHARE_OF_PERIOD_LABEL'))}
                                hint={String(t('TOPICS_HINT_SHARE_OF_PERIOD'))}
                            />
                            <Text
                                text={`${stat.shareOfPeriodCalls.toFixed(1)}%`}
                                size="m"
                                bold
                            />
                        </div>
                    )}
                    {delta != null && (
                        <div className={cls.contextItem}>
                            <MetricHintLabel
                                label={String(t('TOPICS_DELTA_VS_PERIOD_LABEL'))}
                                hint={String(t('TOPICS_HINT_DELTA_VS_PERIOD'))}
                            />
                            <Text
                                text={formatDelta(delta)}
                                size="m"
                                bold
                                variant={delta >= 0 ? 'success' : 'error'}
                            />
                        </div>
                    )}
                </div>
            )}

            </>}
            <HStack gap="8" wrap="wrap" max justify="between" data-testid="tag-panel-call-count">
                <HStack gap="8" wrap="wrap">
                    <Text
                        text={String(t('TOPICS_CALL_LIST_TITLE', { count: total }))}
                        size="m"
                        bold
                    />
                    <DashboardHint hint={String(t('TOPICS_CALL_LIST_HINT'))} />
                </HStack>
                    {total > 0 && (
                        <Button
                            variant="glass-action"
                            size="s"
                            addonLeft={<Download size={16} aria-hidden />}
                            onClick={() => { void handleExport() }}
                            disabled={exporting}
                            data-testid="tag-panel-export"
                        >
                            {exporting ? String(t('Экспорт...')) : String(t('Выгрузить'))}
                        </Button>
                    )}
            </HStack>
            {exportError && (
                <div role="alert">
                    <Text text={String(t('Не удалось выгрузить звонки'))} variant="error" size="s" />
                </div>
            )}

            <div className={cls.callList} data-testid="tag-panel-call-list">
                {(data?.data.length ?? 0) === 0 ? (
                    <div className={cls.emptyBlock} data-testid="tag-panel-calls-empty">
                        <Text text={String(t('Звонков за период нет'))} size="m" />
                    </div>
                ) : (data?.data as CdrListRow[] | undefined)?.map(call => {
                    const openId = call.channelId || call.id
                    const rawOperator = (call.assistantName || call.operatorName || '').trim()
                    const operator = !rawOperator || rawOperator === 'Unknown Operator' ? String(t('Без оператора')) : rawOperator
                    const client = call.clientPhone || call.callerId
                    const durationLabel = formatCallDuration(call.duration, t)
                    const score = operatorCallScore(resolveCallMetrics(call), defaultKeys, Boolean(project))
                    const filename = isMeaningfulFilename(call.filename) ? call.filename : null
                    const dateLabel = new Date(call.createdAt).toLocaleString(undefined, {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })

                    return (
                        <button
                            key={call.id}
                            type="button"
                            className={cls.callRow}
                            onClick={() => { onOpenCall(String(openId), stat.name) }}
                            data-testid={`tag-call-row-${call.id}`}
                        >
                            <div className={cls.rowMain}>
                                <Text text={operator} size="m" bold className={cls.rowTitle} />
                                <div className={cls.metaRow}>
                                    {call.operatorExtension && <span className={cls.metaItem}>
                                        <span className={cls.metaLabel}>{String(t('Внутренний номер'))}:</span>
                                        <span className={cls.metaValue}>{call.operatorExtension}</span>
                                    </span>}
                                    {durationLabel && (
                                        <span className={cls.metaItem}>
                                            <span className={cls.metaLabel}>{String(t('Длительность'))}:</span>
                                            <span className={cls.metaValue}>{durationLabel}</span>
                                        </span>
                                    )}
                                    <HStack gap="4" wrap="wrap">
                                        {client && <span className={cls.metaLabel}>{String(t('Клиент'))}:</span>}
                                        <CallPhone phone={client} callType={call.callType} />
                                    </HStack>
                                    {score != null && (
                                        <span className={cls.metaItem}>
                                            <span className={cls.metaLabel}>{String(t('Средний балл'))}:</span>
                                            <span
                                                className={cls.metaValue}
                                                data-score-variant={scoreVariant(score)}
                                            >
                                                {score}
                                            </span>
                                        </span>
                                    )}
                                    {filename && (
                                        <span className={cls.metaItem}>
                                            <span className={cls.metaLabel}>{String(t('Файл'))}:</span>
                                            <span className={cls.metaValue}>{filename}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className={cls.rowAside}>
                                <Text text={dateLabel} size="xs" className={cls.date} />
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
                <HStack max justify="between" align="center" className={cls.pagination} data-testid="tag-panel-pagination">
                    <Button
                        variant="glass-action"
                        size="s"
                        disabled={page <= 1}
                        onClick={() => { setPage(p => Math.max(1, p - 1)) }}
                        data-testid="tag-panel-prev-page"
                    >
                        {String(t('Назад'))}
                    </Button>
                    <Text
                        text={String(t('TOPICS_PAGE_INDICATOR', { page, totalPages }))}
                        size="xs"
                    />
                    <Button
                        variant="glass-action"
                        size="s"
                        disabled={page >= totalPages}
                        onClick={() => { setPage(p => Math.min(totalPages, p + 1)) }}
                        data-testid="tag-panel-next-page"
                    >
                        {String(t('Далее'))}
                    </Button>
                </HStack>
            )}
        </VStack>
    )
})
