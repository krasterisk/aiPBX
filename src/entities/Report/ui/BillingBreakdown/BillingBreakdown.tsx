import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { createColumnHelper } from '@tanstack/react-table'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Table } from '@/shared/ui/redesigned/Table/Table'
import { BillingRecord } from '../../model/types/report'
import { formatDisplayMoney } from '@/shared/lib/functions/formatDisplayMoney'
import cls from './BillingBreakdown.module.scss'

interface BillingBreakdownProps {
    billingRecords?: BillingRecord[]
    userCurrency: string
}

/** Line cost in USD; use row FX snapshot only for the total column (amountCurrency is for totalCost). */
const fmtCost = (row: BillingRecord, usd: number | undefined) => {
    if (usd == null || usd <= 0) return '—'
    const isRowTotal = Math.abs(Number(usd) - Number(row.totalCost)) < 1e-9
    return formatDisplayMoney(
        isRowTotal
            ? {
                costUsd: usd,
                amountCurrency: row.amountCurrency,
                costCurrency: row.currency,
            }
            : { costUsd: usd, costCurrency: row.currency },
        4,
    )
}

const helper = createColumnHelper<BillingRecord>()

/** Analytic-family records have no audio leg (STT/LLM only). */
const isAnalyticType = (type: string) => type === 'analytic' || type === 'analytic_regen'

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
                totalCost: acc.totalCost + r.totalCost,
                amountCurrency: acc.amountCurrency + (Number(r.amountCurrency) || 0),
                currency: acc.currency || r.currency || null,
            }),
            {
                audioTokens: 0,
                textTokens: 0,
                totalTokens: 0,
                audioCost: 0,
                textCost: 0,
                sttCost: 0,
                totalCost: 0,
                amountCurrency: 0,
                currency: null as string | null,
            },
        )
    }, [billingRecords])

    const hasStt = billingRecords?.some(r => (r.sttCost ?? 0) > 0) ?? false
    const hasTokenSplit = billingRecords?.some(
        r => r.textTokensIn != null || r.textTokensOut != null,
    ) ?? false

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
                cell: info => isAnalyticType(info.row.original.type)
                    ? '—'
                    : info.getValue().toLocaleString(),
                footer: () => null
            }),
            helper.accessor('textTokens', {
                header: String(t('Text токены')),
                cell: info => info.getValue().toLocaleString(),
                footer: () => null
            }),
            ...(hasTokenSplit ? [
                helper.accessor('textTokensIn', {
                    header: String(t('LLM вход')),
                    cell: info => info.getValue() != null
                        ? Number(info.getValue()).toLocaleString()
                        : '—',
                    footer: () => null
                }),
                helper.accessor('textTokensOut', {
                    header: String(t('LLM выход')),
                    cell: info => info.getValue() != null
                        ? Number(info.getValue()).toLocaleString()
                        : '—',
                    footer: () => null
                })
            ] : []),
            helper.accessor('totalTokens', {
                header: String(t('Всего токенов')),
                cell: info => info.getValue().toLocaleString(),
                footer: () => null
            }),
            helper.accessor('audioCost', {
                header: String(t('Audio стоимость')),
                cell: info => isAnalyticType(info.row.original.type)
                    ? '—'
                    : fmtCost(info.row.original, info.getValue()),
                footer: () => null
            }),
            helper.accessor('textCost', {
                header: String(t('Text стоимость')),
                cell: info => fmtCost(info.row.original, info.getValue()),
                footer: () => null
            }),
            ...(hasStt ? [
                helper.accessor('sttCost', {
                    header: String(t('STT стоимость')),
                    cell: info => fmtCost(info.row.original, info.getValue()),
                    footer: () => null
                })
            ] : []),
            helper.accessor('totalCost', {
                header: String(t('Итого')),
                cell: info => (
                    <Text
                        text={formatDisplayMoney({
                            costUsd: info.getValue(),
                            amountCurrency: info.row.original.amountCurrency,
                            costCurrency: info.row.original.currency,
                        }, 4)}
                        bold
                        variant="accent"
                    />
                ),
                footer: () => totals
                    ? (
                        <Text
                            text={formatDisplayMoney({
                                costUsd: totals.totalCost,
                                amountCurrency: totals.amountCurrency,
                                costCurrency: totals.currency || userCurrency,
                            }, 4)}
                            bold
                            variant="accent"
                        />
                    )
                    : null
            })
        ]
        return cols
    }, [t, userCurrency, hasStt, hasTokenSplit, totals])

    if (!billingRecords?.length) {
        return (
            <HStack max justify="center">
                <Text text={String(t('Нет данных о биллинге'))} />
            </HStack>
        )
    }

    return (
        <div className={cls.BillingBreakdown}>
            <Table
                data={billingRecords}
                columns={columns}
                rowVariant="clear"
            />
        </div>
    )
})
