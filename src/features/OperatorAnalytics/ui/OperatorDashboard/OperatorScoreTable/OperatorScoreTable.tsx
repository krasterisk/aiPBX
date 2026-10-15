import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp, UserRound } from 'lucide-react'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import type { AgentScorecard } from '@/entities/Report'
import { normalizeRate, scoreVariant } from '../../../lib/metricVisual'
import visuals from '../OperatorTopics/TopicVisuals.module.scss'
import cls from './OperatorScoreTable.module.scss'

type SortField = 'operatorName' | 'callsCount' | 'averageScore' | 'successRatePct' | 'avgCsat' | 'negativeRate'

interface ScoreRow extends AgentScorecard {
    successRatePct: number
}

interface ColumnFilters {
    operatorName: string
    callsMin: string
    scoreMin: string
    successMin: string
    csatMin: string
    negativeMax: string
}

const EMPTY_FILTERS: ColumnFilters = {
    operatorName: '',
    callsMin: '',
    scoreMin: '',
    successMin: '',
    csatMin: '',
    negativeMax: '',
}

const parseMin = (raw: string): number | null => {
    const trimmed = raw.trim()
    if (!trimmed) return null
    const n = Number(trimmed)
    return Number.isFinite(n) ? n : null
}

interface OperatorScoreTableProps {
    rows: AgentScorecard[]
    onSelectOperator?: (operatorName: string, rowElement: HTMLElement | null) => void
}

export const OperatorScoreTable = memo(({ rows, onSelectOperator }: OperatorScoreTableProps) => {
    const { t } = useTranslation('reports')
    const [sortField, setSortField] = useState<SortField>('averageScore')
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC')
    const [filters, setFilters] = useState<ColumnFilters>(EMPTY_FILTERS)

    const enrichedRows = useMemo<ScoreRow[]>(() =>
        rows.map(row => ({
            ...row,
            successRatePct: normalizeRate(row.successRate),
        })),
    [rows])

    const filteredRows = useMemo(() => {
        const nameQ = filters.operatorName.trim().toLowerCase()
        const callsMin = parseMin(filters.callsMin)
        const scoreMin = parseMin(filters.scoreMin)
        const successMin = parseMin(filters.successMin)
        const csatMin = parseMin(filters.csatMin)
        const negativeMax = parseMin(filters.negativeMax)

        return enrichedRows.filter(row => {
            const displayName = row.operatorName === 'Unknown Operator' ? String(t('Без оператора')) : row.operatorName
            if (nameQ && !displayName.toLowerCase().includes(nameQ)) return false
            if (callsMin != null && row.callsCount < callsMin) return false
            if (scoreMin != null && (row.scoredCalls === 0 || row.averageScore < scoreMin)) return false
            if (successMin != null && (row.scoredCalls === 0 || row.successRatePct < successMin)) return false
            if (csatMin != null && (row.avgCsat == null || row.avgCsat < csatMin)) return false
            if (negativeMax != null && (row.scoredCalls === 0 || row.negativeRate > negativeMax)) return false
            return true
        })
    }, [enrichedRows, filters, t])

    const sortedRows = useMemo(() => {
        const dir = sortOrder === 'ASC' ? 1 : -1
        return [...filteredRows].sort((a, b) => {
            if (sortField === 'operatorName') {
                return dir * a.operatorName.localeCompare(b.operatorName, undefined, { sensitivity: 'base' })
            }
            if (sortField === 'avgCsat') {
                const av = a.avgCsat ?? -Infinity
                const bv = b.avgCsat ?? -Infinity
                return dir * (av - bv)
            }
            if (sortField !== 'callsCount' && (a.scoredCalls === 0) !== (b.scoredCalls === 0)) return a.scoredCalls === 0 ? 1 : -1
            return dir * ((a[sortField]) - (b[sortField]))
        })
    }, [filteredRows, sortField, sortOrder])

    const onSort = useCallback((field: SortField) => {
        if (sortField === field) {
            setSortOrder(order => (order === 'ASC' ? 'DESC' : 'ASC'))
        } else {
            setSortField(field)
            setSortOrder(field === 'operatorName' ? 'ASC' : 'DESC')
        }
    }, [sortField])

    const onFilterChange = useCallback((key: keyof ColumnFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }, [])

    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) return null
        return sortOrder === 'ASC'
            ? <ChevronUp size={14} className={cls.sortIcon} />
            : <ChevronDown size={14} className={cls.sortIcon} />
    }

    const scoreVariantFn = (value: number) => scoreVariant(value)

    const negativeVariant = (value: number) =>
        value >= 30 ? 'error' : value >= 15 ? 'warning' : undefined

    const handleRowActivate = useCallback((row: ScoreRow, target: HTMLElement) => {
        onSelectOperator?.(row.operatorName, target)
    }, [onSelectOperator])

    const handleRowKeyDown = useCallback((
        event: React.KeyboardEvent<HTMLTableRowElement>,
        row: ScoreRow,
    ) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleRowActivate(row, event.currentTarget)
        }
    }, [handleRowActivate])

    return (
        <div className={cls.tableWrapper}>
            <table className={cls.table}>
                <thead>
                    <tr className={cls.headerRow}>
                        <th className={cls.rankCol}>#</th>
                        <th className={cls.sortable} onClick={() => { onSort('operatorName') }}>
                            <HStack gap="4">{String(t('Оператор'))} {renderSortIcon('operatorName')}</HStack>
                        </th>
                        <th className={cls.sortable} onClick={() => { onSort('callsCount') }}>
                            <HStack gap="4">{String(t('Звонков'))} {renderSortIcon('callsCount')}</HStack>
                        </th>
                        <th className={cls.sortable} onClick={() => { onSort('averageScore') }}>
                            <HStack gap="4">{String(t('Средний балл'))} {renderSortIcon('averageScore')}</HStack>
                        </th>
                        <th className={cls.sortable} onClick={() => { onSort('successRatePct') }}>
                            <HStack gap="4">{String(t('Успех'))} {renderSortIcon('successRatePct')}</HStack>
                        </th>
                        <th className={cls.sortable} onClick={() => { onSort('avgCsat') }}>
                            <HStack gap="4">CSAT {renderSortIcon('avgCsat')}</HStack>
                        </th>
                        <th className={cls.sortable} onClick={() => { onSort('negativeRate') }}>
                            <HStack gap="4">{String(t('Негатив'))} {renderSortIcon('negativeRate')}</HStack>
                        </th>
                    </tr>
                    <tr className={cls.filterRow}>
                        <th />
                        <th data-filter-label={String(t('OPERATOR_SCORE_FILTER_NAME'))}>
                            <input
                                className={cls.filterInput}
                                type="search"
                                aria-label={String(t('OPERATOR_SCORE_FILTER_NAME'))}
                                value={filters.operatorName}
                                placeholder={String(t('OPERATOR_SCORE_FILTER_NAME'))}
                                onChange={e => { onFilterChange('operatorName', e.target.value) }}
                            />
                        </th>
                        <th data-filter-label={String(t('TOPIC_FILTER_CALLS'))}>
                            <input
                                className={cls.filterInput}
                                type="number"
                                min={0}
                                aria-label={String(t('TOPIC_FILTER_CALLS'))}
                                value={filters.callsMin}
                                placeholder="≥"
                                onChange={e => { onFilterChange('callsMin', e.target.value) }}
                            />
                        </th>
                        <th data-filter-label={String(t('TOPIC_FILTER_SCORE'))}>
                            <input
                                className={cls.filterInput}
                                type="number"
                                min={0}
                                max={100}
                                aria-label={String(t('TOPIC_FILTER_SCORE'))}
                                value={filters.scoreMin}
                                placeholder="≥"
                                onChange={e => { onFilterChange('scoreMin', e.target.value) }}
                            />
                        </th>
                        <th data-filter-label={String(t('TOPIC_FILTER_SUCCESS'))}>
                            <input
                                className={cls.filterInput}
                                type="number"
                                min={0}
                                max={100}
                                aria-label={String(t('TOPIC_FILTER_SUCCESS'))}
                                value={filters.successMin}
                                placeholder="≥ %"
                                onChange={e => { onFilterChange('successMin', e.target.value) }}
                            />
                        </th>
                        <th data-filter-label={String(t('TOPIC_FILTER_CSAT'))}>
                            <input
                                className={cls.filterInput}
                                type="number"
                                min={1}
                                max={5}
                                step={0.1}
                                aria-label={String(t('TOPIC_FILTER_CSAT'))}
                                value={filters.csatMin}
                                placeholder="≥"
                                onChange={e => { onFilterChange('csatMin', e.target.value) }}
                            />
                        </th>
                        <th data-filter-label={String(t('TOPIC_FILTER_NEGATIVE'))}>
                            <input
                                className={cls.filterInput}
                                type="number"
                                min={0}
                                max={100}
                                aria-label={String(t('TOPIC_FILTER_NEGATIVE'))}
                                value={filters.negativeMax}
                                placeholder="≤ %"
                                onChange={e => { onFilterChange('negativeMax', e.target.value) }}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedRows.length === 0 ? (
                        <tr>
                            <td colSpan={7} className={cls.emptyCell}>
                                <Text text={String(t('OPERATOR_SCORE_NO_MATCH'))} size="s" />
                            </td>
                        </tr>
                    ) : sortedRows.map((row, index) => (
                        <tr
                            key={row.operatorName}
                            className={cls.bodyRow}
                            role={onSelectOperator ? 'button' : undefined}
                            tabIndex={onSelectOperator ? 0 : undefined}
                            aria-label={onSelectOperator ? (row.operatorName === 'Unknown Operator' ? String(t('Без оператора')) : row.operatorName) : undefined}
                            onClick={onSelectOperator ? (e) => { handleRowActivate(row, e.currentTarget) } : undefined}
                            onKeyDown={onSelectOperator ? (e) => { handleRowKeyDown(e, row) } : undefined}
                            data-testid={`operator-score-row-${row.operatorName}`}
                        >
                            <td className={cls.rankCol} data-label="#">
                                <Text text={String(index + 1)} size="s" bold />
                            </td>
                            <td data-label={String(t('Оператор'))}>
                                <HStack gap="8" className={visuals.identity}>
                                    <span className={visuals.avatar} aria-hidden>{row.operatorName === 'Unknown Operator' ? <UserRound size={16} /> : row.operatorName.slice(0, 2).toLocaleUpperCase()}</span>
                                    <Text text={row.operatorName === 'Unknown Operator' ? String(t('Без оператора')) : row.operatorName} bold className={cls.operatorName} />
                                </HStack>
                            </td>
                            <td data-label={String(t('Звонков'))}><Text text={String(row.callsCount)} className={visuals.total} /></td>
                            <td data-label={String(t('Средний балл'))} className={cls.scoreCell} data-score-level={row.scoredCalls === 0 ? 'none' : scoreVariantFn(row.averageScore)}>
                                <Text text={row.scoredCalls === 0 ? '-' : String(row.averageScore)} bold variant={row.scoredCalls === 0 ? undefined : scoreVariantFn(row.averageScore)} />
                            </td>
                            <td data-label={String(t('Успех'))} className={cls.rateCell} data-score-level={row.scoredCalls === 0 ? 'none' : scoreVariantFn(row.successRatePct)}>
                                <Text
                                    text={row.scoredCalls === 0 ? '-' : `${row.successRatePct.toFixed(0)}%`}
                                    bold
                                    variant={row.scoredCalls === 0 ? undefined : scoreVariantFn(row.successRatePct)}
                                />
                            </td>
                            <td data-label="CSAT">
                                <Text text={row.avgCsat != null ? String(row.avgCsat) : '-'} />
                            </td>
                            <td data-label={String(t('Негатив'))} className={cls.rateCell} data-score-level={row.scoredCalls === 0 ? 'none' : negativeVariant(row.negativeRate)}>
                                <Text
                                    text={row.scoredCalls === 0 ? '-' : `${row.negativeRate.toFixed(0)}%`}
                                    bold
                                    variant={row.scoredCalls === 0 ? undefined : negativeVariant(row.negativeRate)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {sortedRows.length > 0 && sortedRows.length < enrichedRows.length && (
                <Text
                    text={String(t('OPERATOR_SCORE_FILTERED_COUNT', {
                        shown: sortedRows.length,
                        total: enrichedRows.length,
                    }))}
                    size="xs"
                    className={cls.filteredHint}
                />
            )}
        </div>
    )
})
