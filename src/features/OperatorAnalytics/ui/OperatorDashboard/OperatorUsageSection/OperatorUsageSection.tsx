import { memo, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from '@mui/material'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { useBillingHistory } from '@/entities/Billing'
import { formatDisplayMoney } from '@/shared/lib/functions/formatDisplayMoney'
import { getRoutePayment } from '@/shared/const/router'
import cls from './OperatorUsageSection.module.scss'

interface OperatorUsageSectionProps {
    startDate?: string
    endDate?: string
    userId?: string | number
}

const formatDate = (iso: string) => new Date(iso).toLocaleString()

export const OperatorUsageSection = memo((props: OperatorUsageSectionProps) => {
    const { startDate, endDate, userId } = props
    const { t } = useTranslation('reports')
    const { t: tPayment } = useTranslation('payment')
    const navigate = useNavigate()

    const handleViewAll = useCallback(() => {
        navigate(getRoutePayment())
    }, [navigate])

    const queryParams = useMemo(() => ({
        page: 1,
        limit: 10,
        startDate,
        endDate,
        types: 'analytic,insight',
        userId: userId != null && userId !== '' ? String(userId) : undefined,
        sortField: 'createdAt',
        sortOrder: 'DESC',
    }), [startDate, endDate, userId])

    const { data, isLoading, isFetching } = useBillingHistory(queryParams, {
        skip: !startDate || !endDate,
    })

    const loading = isLoading || isFetching

    return (
        <Card
            max
            variant="glass"
            border="partial"
            padding="24"
            className={cls.section}
            data-tour-id="oa-usage"
        >
            <VStack gap="16" max>
                <HStack max justify="between" align="center" wrap="wrap" gap="8">
                    <VStack gap="4">
                        <Text title={String(t('OA_USAGE_TITLE'))} bold />
                        <Text text={String(t('OA_USAGE_SUBTITLE'))} size="s" />
                    </VStack>
                    <Button
                        variant="glass-action"
                        size="s"
                        onClick={handleViewAll}
                    >
                        {String(t('OA_USAGE_VIEW_ALL'))}
                    </Button>
                </HStack>

                <div className={cls.summaryGrid}>
                    <div className={cls.summaryCard}>
                        <span className={cls.summaryLabel}>
                            {tPayment('usage.totalRecords', { defaultValue: 'Total Records' })}
                        </span>
                        <span className={cls.summaryValue}>
                            {data ? data.count.toLocaleString() : '—'}
                        </span>
                    </div>
                    <div className={cls.summaryCard}>
                        <span className={cls.summaryLabel}>
                            {tPayment('usage.totalCost', { defaultValue: 'Total Cost' })}
                        </span>
                        <span className={cls.summaryValue}>
                            {data
                                ? formatDisplayMoney({
                                    costUsd: data.totalCost,
                                    amountCurrency: data.totalAmountCurrency ?? undefined,
                                }, 2)
                                : '—'}
                        </span>
                    </div>
                </div>

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

                {!loading && data && data.rows.length > 0 && (
                    <div className={cls.tableWrapper}>
                        <table className={cls.table}>
                            <thead>
                                <tr>
                                    <th>{tPayment('usage.table.date', { defaultValue: 'Date' })}</th>
                                    <th>{tPayment('usage.table.type', { defaultValue: 'Type' })}</th>
                                    <th>{tPayment('usage.table.description', { defaultValue: 'Description' })}</th>
                                    <th>{tPayment('usage.table.tokens', { defaultValue: 'Tokens' })}</th>
                                    <th>{tPayment('usage.table.cost', { defaultValue: 'Cost' })}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.rows.map(row => (
                                    <tr key={row.id}>
                                        <td>{formatDate(row.createdAt)}</td>
                                        <td><span className={cls.typeBadge}>{row.type}</span></td>
                                        <td>{row.description || row.aiCdr?.assistantName || '—'}</td>
                                        <td>{row.totalTokens.toLocaleString()}</td>
                                        <td>
                                            {formatDisplayMoney({
                                                costUsd: row.totalCost,
                                                amountCurrency: row.amountCurrency ?? undefined,
                                                costCurrency: row.currency,
                                            }, 4)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </VStack>
        </Card>
    )
})
