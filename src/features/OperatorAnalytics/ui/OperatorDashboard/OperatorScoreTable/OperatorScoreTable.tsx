import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import type { AgentScorecard } from '@/entities/Report'
import cls from './OperatorScoreTable.module.scss'

const normalizeRate = (rate?: number): number => {
    if (!rate) return 0
    return rate > 1 ? rate : rate * 100
}

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
}

export const OperatorScoreTable = memo(({ rows }: OperatorScoreTableProps) => {
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
            if (nameQ && !row.operatorName.toLowerCase().includes(nameQ)) return false
            if (callsMin != null && row.callsCount < callsMin) return false
            if (scoreMin != null && row.averageScore < scoreMin) return false
            if (successMin != null && row.successRatePct < successMin) return false
            if (csatMin != null && (row.avgCsat == null || row.avgCsat < csatMin)) return false
            if (negativeMax != null && row.negativeRate > negativeMax) return false
            return true
        })
    }, [enrichedRows, filters])

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

    const scoreVariant = (value: number) =>
        value >= 80 ? 'success' : value >= 50 ? 'warning' : 'error'

    const negativeVariant = (value: number) =>
        value >= 30 ? 'error' : value >= 15 ? 'warning' : undefined

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
                        <th>
                            <input
                                className={cls.filterInput}
                                type="search"
                                value={filters.operatorName}
                                placeholder={String(t('OPERATOR_SCORE_FILTER_NAME'))}
                                onChange={e => { onFilterChange('operatorName', e.target.value) }}
                            />
                        </th>
                        <th>
                            <input
                                className={cls.filterInput}
                                type="number"
                                min={0}
                                value={filters.callsMin}
                                placeholder="≥"
                                onChange={e => { onFilterChange('callsMin', e.target.value) }}
                            />
                        </th>
                        <th>
                            <input
                                className={cls.filterInput}
                                type="number"
                                min={0}
                                max={100}
                                value={filters.scoreMin}
                                placeholder="≥"
                                onChange={e => { onFilterChange('scoreMin', e.target.value) }}
                            />
                        </th>
                        <th>
                            <input
                                className={cls.filterInput}
                                type="number"
                                min={0}
                                max={100}
                                value={filters.successMin}
                                placeholder="≥ %"
                                onChange={e => { onFilterChange('successMin', e.target.value) }}
                            />
                        </th>
                        <th>
                            <input
                                className={cls.filterInput}
                                type="number"
                                min={1}
                                max={5}
                                step={0.1}
                                value={filters.csatMin}
                                placeholder="≥"
                                onChange={e => { onFilterChange('csatMin', e.target.value) }}
                            />
                        </th>
                        <th>
                            <input
                                className={cls.filterInput}
                                type="number"
                                min={0}
                                max={100}
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
                        <tr key={row.operatorName} className={cls.bodyRow}>
                            <td className={cls.rankCol}>
                                <Text text={String(index + 1)} size="s" bold />
                            </td>
                            <td>
                                <Text text={row.operatorName} bold className={cls.operatorName} />
                            </td>
                            <td><Text text={String(row.callsCount)} /></td>
                            <td>
                                <Text text={String(row.averageScore)} bold variant={scoreVariant(row.averageScore)} />
                            </td>
                            <td>
                                <Text
                                    text={`${row.successRatePct.toFixed(0)}%`}
                                    bold
                                    variant={scoreVariant(row.successRatePct)}
                                />
                            </td>
                            <td>
                                <Text text={row.avgCsat != null ? String(row.avgCsat) : '—'} />
                            </td>
                            <td>
                                <Text
                                    text={`${row.negativeRate.toFixed(0)}%`}
                                    bold
                                    variant={negativeVariant(row.negativeRate)}
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
