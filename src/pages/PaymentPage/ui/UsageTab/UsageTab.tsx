import React, { memo, useState, useCallback, useMemo } from 'react'
import cls from './UsageTab.module.scss'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { useTranslation } from 'react-i18next'
import { useBillingHistory, BillingRecord } from '@/entities/Billing'
import { useSelector } from 'react-redux'
import { isUserAdmin, ClientSelect } from '@/entities/User'
import { DateSelector } from '@/shared/ui/mui/DateSelector'
import { Button } from '@/shared/ui/redesigned/Button'
import { ChevronLeft, ChevronRight, FileX2, Download } from 'lucide-react'
import dayjs, { Dayjs } from 'dayjs'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

type SortField = 'createdAt' | 'type' | 'totalTokens' | 'totalCost'
type SortOrder = 'ASC' | 'DESC'
type BillingType = '' | 'realtime' | 'analytic' | 'text' | 'insight'

const TYPE_BADGE_MAP: Record<string, { cls: string, label: string }> = {
    realtime: { cls: 'badgeRealtime', label: 'Realtime' },
    analytic: { cls: 'badgeAnalytic', label: 'Analytics' },
    text: { cls: 'badgeText', label: 'Text' },
    insight: { cls: 'badgeInsight', label: 'Insight' },
}

const PAGE_SIZES = [10, 20, 50, 100]

// ── helpers ──────────────────────────────────────────────

const formatCost = (cost: number) => `$${cost.toFixed(6)}`
const formatTotalCost = (cost: number) => `$${cost.toFixed(2)}`
const formatTokens = (tokens: number) => tokens.toLocaleString()

const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const formatPeriod = (start?: string, end?: string, allTimeLabel?: string | null) => {
    if (!start && !end) return allTimeLabel || 'All time'
    const parts: string[] = []
    if (start) parts.push(dayjs(start).format('DD.MM.YYYY'))
    if (end) parts.push(dayjs(end).format('DD.MM.YYYY'))
    return parts.join(' — ')
}

// ── component ────────────────────────────────────────────

export const UsageTab = memo(() => {
    const { t } = useTranslation('payment')
    const admin = useSelector(isUserAdmin)

    // State
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const [startDate, setStartDate] = useState<string | undefined>(undefined)
    const [endDate, setEndDate] = useState<string | undefined>(undefined)
    const [type, setType] = useState<BillingType>('')
    const [userId, setUserId] = useState('')
    const [sortField, setSortField] = useState<SortField>('createdAt')
    const [sortOrder, setSortOrder] = useState<SortOrder>('DESC')

    const queryParams = useMemo(() => ({
        page,
        limit,
        startDate,
        endDate,
        type: type || undefined,
        userId: admin && userId ? userId : undefined,
        sortField,
        sortOrder,
    }), [page, limit, startDate, endDate, type, userId, sortField, sortOrder, admin])

    const { data, isLoading, isFetching } = useBillingHistory(queryParams)

    // Filter handlers (reset page on change)
    const handleStartDate = useCallback((val: Dayjs | null) => {
        setStartDate(val ? val.format('YYYY-MM-DD') : undefined)
        setPage(1)
    }, [])

    const handleEndDate = useCallback((val: Dayjs | null) => {
        setEndDate(val ? val.format('YYYY-MM-DD') : undefined)
        setPage(1)
    }, [])

    const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setType(e.target.value as BillingType)
        setPage(1)
    }, [])

    const handleUserIdChange = useCallback((clientId: string) => {
        setUserId(clientId)
        setPage(1)
    }, [])

    const handleLimitChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(Number(e.target.value))
        setPage(1)
    }, [])

    const handleSort = useCallback((field: SortField) => {
        if (sortField === field) {
            setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC')
        } else {
            setSortField(field)
            setSortOrder('DESC')
        }
        setPage(1)
    }, [sortField])

    // Pagination
    const totalPages = data ? Math.ceil(data.count / limit) : 0
    const from = data && data.count > 0 ? (page - 1) * limit + 1 : 0
    const to = data ? Math.min(page * limit, data.count) : 0

    const renderSortHeader = (field: SortField, label: string) => (
        <th
            className={cls.sortable}
            onClick={() => { handleSort(field) }}
        >
            <span className={cls.sortHeader}>
                {label}
                {sortField === field && (
                    <span className={cls.sortArrow}>
                        {sortOrder === 'ASC' ? '▲' : '▼'}
                    </span>
                )}
            </span>
        </th>
    )

    const renderTypeBadge = (recordType: string) => {
        const cfg = TYPE_BADGE_MAP[recordType]
        if (!cfg) return <span>{recordType}</span>
        return (
            <span className={`${cls.badge} ${cls[cfg.cls]}`}>
                {t(`usage.type.${recordType}`, { defaultValue: cfg.label })}
            </span>
        )
    }

    const renderDetails = (row: BillingRecord) => {
        const parts: React.ReactNode[] = []

        if (row.type === 'realtime') {
            if (row.audioCost > 0) {
parts.push(
                <span key="audio" className={cls.detailsRow}>
                    <span>Audio:</span> <span>{formatCost(row.audioCost)}</span>
                </span>
            )
}
            if (row.textCost > 0) {
parts.push(
                <span key="text" className={cls.detailsRow}>
                    <span>Text:</span> <span>{formatCost(row.textCost)}</span>
                </span>
            )
}
            if (row.aiCdr?.assistantName) {
parts.push(
                <span key="assist" className={cls.detailsRow}>
                    <span>{t('usage.details.assistant', { defaultValue: 'Assistant' })}:</span>
                    <span>{row.aiCdr.assistantName}</span>
                </span>
            )
}
            if (row.aiCdr?.callerId) {
parts.push(
                <span key="caller" className={cls.detailsRow}>
                    <span>Caller:</span> <span>{row.aiCdr.callerId}</span>
                </span>
            )
}
        } else if (row.type === 'analytic') {
            if (row.textCost > 0) {
parts.push(
                <span key="text" className={cls.detailsRow}>
                    <span>Text:</span> <span>{formatCost(row.textCost)}</span>
                </span>
            )
}
            if (row.sttCost > 0) {
parts.push(
                <span key="stt" className={cls.detailsRow}>
                    <span>STT:</span> <span>{formatCost(row.sttCost)}</span>
                </span>
            )
}
            if (row.aiCdr?.assistantName) {
parts.push(
                <span key="assist" className={cls.detailsRow}>
                    <span>{t('usage.details.assistant', { defaultValue: 'Assistant' })}:</span>
                    <span>{row.aiCdr.assistantName}</span>
                </span>
            )
}
            if (row.aiCdr?.source) {
parts.push(
                <span key="src" className={cls.detailsRow}>
                    <span>Source:</span> <span>{row.aiCdr.source}</span>
                </span>
            )
}
        } else {
            // text / insight
            parts.push(
                <span key="tokens" className={cls.detailsRow}>
                    <span>Tokens:</span> <span>{formatTokens(row.textTokens)}</span>
                </span>
            )
        }

        return <div className={cls.detailsCell}>{parts}</div>
    }

    const exportToExcel = useCallback(() => {
        if (!data?.rows?.length) return

        const exportData = data.rows.map((row) => ({
            [t('usage.table.date', { defaultValue: 'Date' })]: formatDate(row.createdAt),
            [t('usage.table.type', { defaultValue: 'Type' })]: row.type,
            [t('usage.table.description', { defaultValue: 'Description' })]: row.description || row.type,
            'Audio Tokens': row.audioTokens,
            'Text Tokens': row.textTokens,
            [t('usage.table.tokens', { defaultValue: 'Tokens' })]: row.totalTokens,
            'Audio Cost': row.audioCost,
            'Text Cost': row.textCost,
            'STT Cost': row.sttCost,
            [t('usage.table.cost', { defaultValue: 'Cost' })]: row.totalCost,
            'Channel ID': row.channelId,
            ...(row.aiCdr ? {
                Assistant: row.aiCdr.assistantName || '',
                'Caller ID': row.aiCdr.callerId || '',
                Source: row.aiCdr.source || '',
                'Duration (s)': row.aiCdr.duration || '',
            } : {}),
        }))

        const worksheet = XLSX.utils.json_to_sheet(exportData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Usage')
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        })
        const dateStr = dayjs().format('YYYY-MM-DD')
        saveAs(blob, `usage_${dateStr}.xlsx`)
    }, [data, t])

    return (
        <VStack gap="16" max className={cls.UsageTab}>
            {/* Summary Cards */}
            <div className={cls.summaryGrid}>
                <div className={cls.summaryCard}>
                    <span className={cls.summaryLabel}>
                        {t('usage.totalRecords', { defaultValue: 'Total Records' })}
                    </span>
                    <span className={cls.summaryValue}>
                        {data ? data.count.toLocaleString() : '—'}
                    </span>
                </div>
                <div className={cls.summaryCard}>
                    <span className={cls.summaryLabel}>
                        {t('usage.totalCost', { defaultValue: 'Total Cost' })}
                    </span>
                    <span className={cls.summaryValue}>
                        {data ? formatTotalCost(data.totalCost) : '—'}
                    </span>
                </div>
                <div className={cls.summaryCard}>
                    <span className={cls.summaryLabel}>
                        {t('usage.period', { defaultValue: 'Period' })}
                    </span>
                    <span className={cls.summaryValue} style={{ fontSize: '1.1rem' }}>
                        {formatPeriod(
                            startDate,
                            endDate,
                            t('usage.allTime', { defaultValue: 'All time' }) 
                        )}
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className={cls.filtersRow}>
                <div className={cls.filterGroup}>
                    <span className={cls.filterLabel}>
                        {t('usage.filters.from', { defaultValue: 'From' })}
                    </span>
                    <DateSelector
                        value={startDate ? dayjs(startDate) : null}
                        onChange={handleStartDate}
                        label=""
                    />
                </div>
                <div className={cls.filterGroup}>
                    <span className={cls.filterLabel}>
                        {t('usage.filters.to', { defaultValue: 'To' })}
                    </span>
                    <DateSelector
                        value={endDate ? dayjs(endDate) : null}
                        onChange={handleEndDate}
                        label=""
                    />
                </div>
                <div className={cls.filterGroup}>
                    <span className={cls.filterLabel}>
                        {t('usage.filters.type', { defaultValue: 'Type' })}
                    </span>
                    <select
                        className={cls.filterSelect}
                        value={type}
                        onChange={handleTypeChange}
                    >
                        <option value="">{t('usage.filters.allTypes', { defaultValue: 'All types' })}</option>
                        <option value="realtime">Realtime</option>
                        <option value="analytic">Analytics</option>
                        <option value="text">Text</option>
                        <option value="insight">Insight</option>
                    </select>
                </div>
                {admin && (
                    <div className={cls.filterGroup}>
                        <span className={cls.filterLabel}>
                            {t('usage.filters.user', { defaultValue: 'User ID' })}
                        </span>
                        <ClientSelect
                            clientId={userId}
                            onChangeClient={handleUserIdChange}
                            size="small"
                            showIcon={false}
                        />
                    </div>
                )}
                <div className={cls.filterGroup} style={{ marginLeft: 'auto' }}>
                    <span className={cls.filterLabel}>&nbsp;</span>
                    <Button
                        variant="glass-action"
                        size="m"
                        onClick={exportToExcel}
                        disabled={!data?.rows?.length}
                        addonLeft={<Download size={16} />}
                    >
                        {t('Экспорт в Excel')}
                    </Button>
                </div>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className={cls.loadingWrapper}>
                    <div className={cls.spinner} />
                    <span>{t('Загрузка...', { defaultValue: 'Loading...' })}</span>
                </div>
            ) : data && data.rows.length === 0 ? (
                <div className={cls.emptyWrapper}>
                    <FileX2 size={48} className={cls.emptyIcon} />
                    <span>
                        {(startDate || endDate || type)
                            ? t('usage.emptyFiltered', { defaultValue: 'No records match the selected filters' })
                            : t('usage.empty', { defaultValue: 'No billing records found' })
                        }
                    </span>
                </div>
            ) : data ? (
                <>
                    <div className={cls.tableWrapper}>
                        <table className={cls.table}>
                            <thead>
                                <tr>
                                    {renderSortHeader('createdAt',
                                        t('usage.table.date', { defaultValue: 'Date' }) 
                                    )}
                                    {renderSortHeader('type',
                                        t('usage.table.type', { defaultValue: 'Type' }) 
                                    )}
                                    <th>
                                        {t('usage.table.description', { defaultValue: 'Description' })}
                                    </th>
                                    {renderSortHeader('totalTokens',
                                        t('usage.table.tokens', { defaultValue: 'Tokens' }) 
                                    )}
                                    {renderSortHeader('totalCost',
                                        t('usage.table.cost', { defaultValue: 'Cost' }) 
                                    )}
                                    <th>
                                        {t('usage.table.details', { defaultValue: 'Details' })}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.rows.map((row) => (
                                    <tr key={row.id}>
                                        <td>{formatDate(row.createdAt)}</td>
                                        <td>{renderTypeBadge(row.type)}</td>
                                        <td>{row.description || row.type}</td>
                                        <td className={cls.tokensCell}>
                                            {formatTokens(row.totalTokens)}
                                        </td>
                                        <td className={cls.costCell}>
                                            {formatCost(row.totalCost)}
                                        </td>
                                        <td>{renderDetails(row)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className={cls.paginationRow}>
                        <span className={cls.paginationInfo}>
                            {t('usage.pagination.showing', {
                                defaultValue: 'Showing {{from}}-{{to}} of {{total}}',
                                from,
                                to,
                                total: data.count,
                            })}
                        </span>

                        <div className={cls.paginationControls}>
                            <span className={cls.filterLabel} style={{ marginRight: 4 }}>
                                {t('usage.pagination.perPage', { defaultValue: 'Per page' })}
                            </span>
                            <select
                                className={cls.filterSelect}
                                value={limit}
                                onChange={handleLimitChange}
                                style={{ minWidth: 70 }}
                            >
                                {PAGE_SIZES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>

                            <Button
                                variant="outline"
                                size="s"
                                disabled={page <= 1}
                                onClick={() => { setPage(p => p - 1) }}
                            >
                                <ChevronLeft size={18} />
                            </Button>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', minWidth: 40, textAlign: 'center' }}>
                                {page} / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="s"
                                disabled={page >= totalPages}
                                onClick={() => { setPage(p => p + 1) }}
                            >
                                <ChevronRight size={18} />
                            </Button>
                        </div>
                    </div>
                </>
            ) : null}
        </VStack>
    )
})
