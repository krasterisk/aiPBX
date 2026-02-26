import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { createColumnHelper } from '@tanstack/react-table'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Table } from '@/shared/ui/redesigned/Table/Table'
import { BillingRecord } from '../../model/types/report'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'

interface BillingBreakdownProps {
    billingRecords?: BillingRecord[]
    userCurrency: string
}

const fmt = (v: number | undefined, currency: string) =>
    v != null && v > 0 ? formatCurrency(v, currency, 4) : '—'

const helper = createColumnHelper<BillingRecord>()

export const BillingBreakdown = memo(({ billingRecords, userCurrency }: BillingBreakdownProps) => {
    const { t } = useTranslation('reports')

    const totals = useMemo(() => {
        if (!billingRecords?.length) return null
        return billingRecords.reduce(
            (acc, r) => ({
                audioTokens: acc.audioTokens + r.audioTokens,
                textTokens: acc.textTokens + r.textTokens,
                totalTokens: acc.totalTokens + r.totalTokens,
                audioCost: acc.audioCost + r.audioCost,
                textCost: acc.textCost + r.textCost,
                sttCost: acc.sttCost + (r.sttCost ?? 0),
                totalCost: acc.totalCost + r.totalCost
            }),
            { audioTokens: 0, textTokens: 0, totalTokens: 0, audioCost: 0, textCost: 0, sttCost: 0, totalCost: 0 }
        )
    }, [billingRecords])

    const hasStt = billingRecords?.some(r => (r.sttCost ?? 0) > 0) ?? false

    const formatTime = (dateStr: string) =>
        new Date(dateStr).toLocaleTimeString(undefined, {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        })

    const columns = useMemo(() => {
        const cols = [
            helper.display({
                id: 'index',
                header: '№',
                cell: info => info.row.index + 1,
                footer: () => <Text text={String(t('Итого'))} bold />
            }),
            helper.accessor('createdAt', {
                header: String(t('Время')),
                cell: info => formatTime(info.getValue()),
                footer: () => null
            }),
            helper.accessor('type', {
                header: String(t('Тип')),
                cell: info => (
                    <Text
                        text={String(t(info.getValue()))}
                        variant={info.getValue() === 'realtime' ? 'accent' : 'warning'}
                        bold
                    />
                ),
                footer: () => null
            }),
            helper.accessor('audioTokens', {
                header: String(t('Audio токены')),
                cell: info => info.row.original.type === 'analytic'
                    ? '—'
                    : info.getValue().toLocaleString(),
                footer: () => totals ? <Text text={totals.audioTokens.toLocaleString()} bold /> : null
            }),
            helper.accessor('textTokens', {
                header: String(t('Text токены')),
                cell: info => info.getValue().toLocaleString(),
                footer: () => totals ? <Text text={totals.textTokens.toLocaleString()} bold /> : null
            }),
            helper.accessor('totalTokens', {
                header: String(t('Всего токенов')),
                cell: info => info.getValue().toLocaleString(),
                footer: () => totals ? <Text text={totals.totalTokens.toLocaleString()} bold /> : null
            }),
            helper.accessor('audioCost', {
                header: String(t('Audio стоимость')),
                cell: info => info.row.original.type === 'analytic'
                    ? '—'
                    : fmt(info.getValue(), userCurrency),
                footer: () => totals ? <Text text={fmt(totals.audioCost, userCurrency)} bold /> : null
            }),
            helper.accessor('textCost', {
                header: String(t('Text стоимость')),
                cell: info => fmt(info.getValue(), userCurrency),
                footer: () => totals ? <Text text={fmt(totals.textCost, userCurrency)} bold /> : null
            }),
            ...(hasStt ? [
                helper.accessor('sttCost', {
                    header: String(t('STT стоимость')),
                    cell: info => fmt(info.getValue(), userCurrency),
                    footer: () => totals ? <Text text={fmt(totals.sttCost, userCurrency)} bold /> : null
                })
            ] : []),
            helper.accessor('totalCost', {
                header: String(t('Итого')),
                cell: info => (
                    <Text text={formatCurrency(info.getValue(), userCurrency, 4)} bold variant="accent" />
                ),
                footer: () => totals
                    ? <Text text={formatCurrency(totals.totalCost, userCurrency, 4)} bold variant="accent" />
                    : null
            })
        ]
        return cols
    }, [t, userCurrency, hasStt, totals])

    if (!billingRecords?.length) {
        return (
            <HStack max justify="center">
                <Text text={String(t('Нет данных о биллинге'))} />
            </HStack>
        )
    }

    return (
        <Table
            data={billingRecords}
            columns={columns}
            rowVariant="clear"
        />
    )
})
