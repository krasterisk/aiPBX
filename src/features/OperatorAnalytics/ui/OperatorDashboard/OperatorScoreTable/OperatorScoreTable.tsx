import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp, UserRound } from 'lucide-react'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import type { AgentScorecard } from '@/entities/Report'
import { normalizeRate, scoreVariant } from '../../../lib/metricVisual'
import visuals from '../OperatorTopics/TopicVisuals.module.scss'
import { operatorInitials } from '../OperatorTopics/topicVisual'
import cls from './OperatorScoreTable.module.scss'

type SortField = 'operatorName' | 'callsCount' | 'averageScore' | 'successRatePct' | 'avgCsat' | 'negativeRate'

interface ScoreRow extends AgentScorecard {
    successRatePct: number
}

interface OperatorScoreTableProps {
    rows: AgentScorecard[]
    onSelectOperator?: (operatorName: string, rowElement: HTMLElement | null, operatorId?: string, operatorAccountId?: string) => void
}

export const OperatorScoreTable = memo(({ rows, onSelectOperator }: OperatorScoreTableProps) => {
    const { t } = useTranslation('reports')
    const [sortField, setSortField] = useState<SortField>('averageScore')
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC')

    const enrichedRows = useMemo<ScoreRow[]>(() =>
        rows.map(row => ({
            ...row,
            successRatePct: normalizeRate(row.successRate),
        })),
    [rows])

    const sortedRows = useMemo(() => {
        const dir = sortOrder === 'ASC' ? 1 : -1
        return [...enrichedRows].sort((a, b) => {
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
    }, [enrichedRows, sortField, sortOrder])

    const onSort = useCallback((field: SortField) => {
        if (sortField === field) {
            setSortOrder(order => (order === 'ASC' ? 'DESC' : 'ASC'))
        } else {
            setSortField(field)
            setSortOrder(field === 'operatorName' ? 'ASC' : 'DESC')
        }
    }, [sortField])

    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) return null
        return sortOrder === 'ASC'
            ? <ChevronUp size={14} className={cls.sortIcon} aria-hidden />
            : <ChevronDown size={14} className={cls.sortIcon} aria-hidden />
    }

    const scoreVariantFn = (value: number) => scoreVariant(value)

    const negativeVariant = (value: number) =>
        value >= 30 ? 'error' : value >= 15 ? 'warning' : undefined

    const handleRowActivate = useCallback((row: ScoreRow, target: HTMLElement) => {
        if (row.operatorId && row.operatorAccountId) onSelectOperator?.(row.operatorName, target, row.operatorId, row.operatorAccountId)
        else if (row.operatorId) onSelectOperator?.(row.operatorName, target, row.operatorId)
        else onSelectOperator?.(row.operatorName, target)
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

    const sortColumns: Array<{ field: SortField, label: string }> = [
        { field: 'operatorName', label: String(t('Оператор')) },
        { field: 'callsCount', label: String(t('Звонков')) },
        { field: 'averageScore', label: String(t('Средний балл')) },
        { field: 'successRatePct', label: String(t('Успех')) },
        { field: 'avgCsat', label: String(t('CSAT')) },
        { field: 'negativeRate', label: String(t('Негатив')) },
    ]

    return (
        <div className={cls.tableWrapper}>
            <table className={cls.table}>
                <thead>
                    <tr className={cls.headerRow}>
                        <th className={cls.rankCol}>#</th>
                        {sortColumns.map(({ field, label }) => <th key={field} className={cls.sortable}
                            aria-sort={sortField === field ? (sortOrder === 'ASC' ? 'ascending' : 'descending') : 'none'}
                            onClick={() => { onSort(field) }}>
                            <Button variant="clear" className={cls.headerButton}>
                                <HStack gap="4">{label} {renderSortIcon(field)}</HStack>
                            </Button>
                        </th>)}
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
                            key={row.operatorId ? JSON.stringify([row.operatorAccountId, row.operatorId]) : row.operatorName}
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
                                    <span className={visuals.avatar} aria-hidden>{operatorInitials(row.operatorName) || <UserRound size={16} />}</span>
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
        </div>
    )
})
