import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@mui/material'
import { ChevronRight, Download } from 'lucide-react'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import {
    useGetOperatorCdrs,
    useLazyGetOperatorCdrs,
    type OperatorAnalysisResult,
} from '@/entities/Report'
import { ALL_DEFAULT_METRICS, scoreVariant } from '../../../lib/metricVisual'
import { buildDistributionCallsSheet } from './distributionCallsExport'
import type { PanelEntry } from '../../../model/panelStack'
import type { DashboardFilters } from './OperatorPanelBody'
import cls from './DistributionPanelBody.module.scss'

const PAGE_SIZE = 20

interface DistributionPanelBodyProps {
    entry: Extract<PanelEntry, { kind: 'distribution' }>
    filters: DashboardFilters
    onOpenCall: (channelId: string, fromLabel: string) => void
}

const EXPORT_FILE_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'

type CdrListRow = OperatorAnalysisResult & {
    callerId?: string
    analytics?: {
        summary?: string
        sentiment?: string
        metrics?: Record<string, unknown>
    }
}

function exportFileName(
    entry: Extract<PanelEntry, { kind: 'distribution' }>,
    filters: DashboardFilters,
): string {
    const kind = entry.chart === 'success'
        ? (entry.segment === 'fail' ? 'unsuccessful-calls' : 'successful-calls')
        : `calls-${entry.segment}`
    const period = [filters.startDate, filters.endDate].filter(Boolean).join('_')
    return period ? `${kind}_${period}.xlsx` : `${kind}.xlsx`
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

function averageScoreFromMetrics(metrics?: Record<string, unknown>): number | null {
    if (!metrics) return null
    let sum = 0
    let count = 0
    for (const { key } of ALL_DEFAULT_METRICS) {
        const value = Number(metrics[key])
        if (Number.isFinite(value)) {
            sum += value
            count += 1
        }
    }
    if (!count) return null
    return Math.round(sum / count)
}

function isMeaningfulFilename(filename?: string): boolean {
    if (!filename) return false
    const trimmed = filename.trim()
    if (!trimmed) return false
    // Bare numeric ids (e.g. "65") are not useful labels for users.
    if (/^\d+$/.test(trimmed)) return false
    return /[a-zA-Zа-яА-Я.]/.test(trimmed)
}

export const DistributionPanelBody = memo((props: DistributionPanelBodyProps) => {
    const { entry, filters, onOpenCall } = props
    const { t } = useTranslation('reports')
    const [page, setPage] = useState(1)
    const [exporting, setExporting] = useState(false)
    const [fetchAllCdrs] = useLazyGetOperatorCdrs()

    const queryBase = useMemo(() => {
        const base = {
            startDate: filters.startDate,
            endDate: filters.endDate,
            projectId: filters.projectId,
        }
        if (entry.chart === 'sentiment') {
            return {
                ...base,
                sentiment: entry.segment as 'positive' | 'neutral' | 'negative',
            }
        }
        return {
            ...base,
            success: entry.segment === 'success',
        }
    }, [entry.chart, entry.segment, filters])

    const cdrArgs = useMemo(() => ({
        ...queryBase,
        page,
        limit: PAGE_SIZE,
    }), [queryBase, page])

    const { data, isLoading, isFetching, isError, refetch } = useGetOperatorCdrs(cdrArgs)

    const total = data?.total ?? 0

    const handleExport = useCallback(async () => {
        if (!total || exporting) return
        setExporting(true)
        try {
            const result = await fetchAllCdrs({
                ...queryBase,
                page: 1,
                limit: total,
            }).unwrap()
            const rows = (result.data ?? []) as CdrListRow[]
            if (!rows.length) return
            const sheet = buildDistributionCallsSheet(rows, key => String(t(key)))
            const worksheet = XLSX.utils.json_to_sheet(sheet.rows, { header: sheet.headers })
            worksheet['!cols'] = sheet.headers.map(header => ({
                wch: header === String(t('Саммари')) || header === String(t('Итог обращения'))
                    ? 48
                    : Math.min(Math.max(header.length, 12), 28),
            }))
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, 'calls')
            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
            saveAs(new Blob([buffer], { type: EXPORT_FILE_TYPE }), exportFileName(entry, filters))
        } catch {
            // The list stays on screen; the button returns to idle below.
        } finally {
            setExporting(false)
        }
    }, [entry, exporting, fetchAllCdrs, filters, queryBase, t, total])

    const loading = (isLoading || isFetching) && !data
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    if (loading) {
        return (
            <VStack gap="8" max align="stretch" className={cls.root} data-testid="distribution-panel-loading">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} variant="rounded" height={72} width="100%" />
                ))}
            </VStack>
        )
    }

    if (isError) {
        return (
            <div className={cls.errorBlock} data-testid="distribution-panel-error">
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
        <VStack gap="16" max align="stretch" className={cls.root} data-testid="distribution-panel-body">
            <div className={cls.summary}>
                <div className={cls.summaryHeader}>
                    <div data-testid="distribution-panel-call-count">
                        <Text
                            text={String(t('TOPICS_CALL_LIST_HEADER', { count: total }))}
                            size="m"
                            bold
                        />
                    </div>
                    {total > 0 && (
                        <Button
                            variant="glass-action"
                            size="s"
                            addonLeft={<Download size={16} aria-hidden />}
                            onClick={() => { void handleExport() }}
                            disabled={exporting}
                            data-testid="distribution-panel-export"
                        >
                            {exporting ? String(t('Экспорт...')) : String(t('Выгрузить'))}
                        </Button>
                    )}
                </div>
                <Text
                    text={String(t('DISTRIBUTION_LIST_HINT'))}
                    size="xs"
                    className={cls.summaryHint}
                />
            </div>

            <div className={cls.callList} data-testid="distribution-panel-call-list">
                {(data?.data.length ?? 0) === 0 ? (
                    <div className={cls.emptyBlock} data-testid="distribution-panel-calls-empty">
                        <Text text={String(t('Звонков за период нет'))} size="m" />
                    </div>
                ) : (data?.data as CdrListRow[] | undefined)?.map(call => {
                    const openId = call.channelId || call.id
                    const operator = call.assistantName || call.operatorName || String(t('Без оператора'))
                    const client = call.clientPhone || call.callerId
                    const durationLabel = formatCallDuration(call.duration, t)
                    const score = averageScoreFromMetrics(resolveCallMetrics(call))
                    const filename = isMeaningfulFilename(call.filename) ? call.filename : null
                    const dateLabel = new Date(call.createdAt).toLocaleDateString()

                    return (
                        <button
                            key={call.id}
                            type="button"
                            className={cls.callRow}
                            onClick={() => { onOpenCall(String(openId), entry.label) }}
                            data-testid={`distribution-call-row-${call.id}`}
                        >
                            <div className={cls.rowMain}>
                                <Text text={operator} size="m" bold className={cls.rowTitle} />
                                <div className={cls.metaRow}>
                                    {durationLabel && (
                                        <span className={cls.metaItem}>
                                            <span className={cls.metaLabel}>{String(t('Длительность'))}:</span>
                                            <span className={cls.metaValue}>{durationLabel}</span>
                                        </span>
                                    )}
                                    {client && (
                                        <span className={cls.metaItem}>
                                            <span className={cls.metaLabel}>{String(t('Клиент'))}:</span>
                                            <span className={cls.metaValue}>{client}</span>
                                        </span>
                                    )}
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
                <HStack max justify="between" align="center" className={cls.pagination} data-testid="distribution-panel-pagination">
                    <Button
                        variant="glass-action"
                        size="s"
                        disabled={page <= 1}
                        onClick={() => { setPage(p => Math.max(1, p - 1)) }}
                        data-testid="distribution-panel-prev-page"
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
                        data-testid="distribution-panel-next-page"
                    >
                        {String(t('Далее'))}
                    </Button>
                </HStack>
            )}
        </VStack>
    )
})
