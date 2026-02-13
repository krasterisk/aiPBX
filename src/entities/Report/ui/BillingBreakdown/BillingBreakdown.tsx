import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './BillingBreakdown.module.scss'
import React, { memo, useMemo } from 'react'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { BillingRecord } from '../../model/types/report'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'

interface BillingBreakdownProps {
    className?: string
    billingRecords?: BillingRecord[]
    userCurrency: string
}

export const BillingBreakdown = memo((props: BillingBreakdownProps) => {
    const {
        className,
        billingRecords,
        userCurrency
    } = props

    const { t } = useTranslation('reports')

    const totals = useMemo(() => {
        if (!billingRecords?.length) return null
        return billingRecords.reduce(
            (acc, record) => ({
                audioTokens: acc.audioTokens + record.audioTokens,
                textTokens: acc.textTokens + record.textTokens,
                totalTokens: acc.totalTokens + record.totalTokens,
                audioCost: acc.audioCost + record.audioCost,
                textCost: acc.textCost + record.textCost,
                totalCost: acc.totalCost + record.totalCost
            }),
            { audioTokens: 0, textTokens: 0, totalTokens: 0, audioCost: 0, textCost: 0, totalCost: 0 }
        )
    }, [billingRecords])

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })
    }

    if (!billingRecords?.length) {
        return (
            <HStack max justify="center" className={classNames(cls.BillingBreakdown, {}, [className])}>
                <Text text={t('Нет данных о биллинге')} />
            </HStack>
        )
    }

    return (
        <VStack
            gap="8"
            max
            className={classNames(cls.BillingBreakdown, {}, [className])}
        >
            <div className={cls.tableWrapper}>
                <table className={cls.table} id="billing-breakdown-table">
                    <thead>
                        <tr>
                            <th>{t('№')}</th>
                            <th>{t('Время')}</th>
                            <th>{t('Тип')}</th>
                            <th>{t('Audio токены')}</th>
                            <th>{t('Text токены')}</th>
                            <th>{t('Всего')}</th>
                            <th>{t('Audio стоимость')}</th>
                            <th>{t('Text стоимость')}</th>
                            <th>{t('Итого')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billingRecords.map((record, index) => {
                            const isAnalytic = record.type === 'analytic'
                            return (
                                <tr key={record.id} id={`billing-record-${record.id}`}>
                                    <td>{index + 1}</td>
                                    <td>{formatTime(record.createdAt)}</td>
                                    <td>
                                        <span className={classNames(cls.typeBadge, {
                                            [cls.typeRealtime]: !isAnalytic,
                                            [cls.typeAnalytic]: isAnalytic
                                        })}>
                                            {t(record.type)}
                                        </span>
                                    </td>
                                    <td>{isAnalytic ? '—' : record.audioTokens.toLocaleString()}</td>
                                    <td>{isAnalytic ? '—' : record.textTokens.toLocaleString()}</td>
                                    <td>{record.totalTokens.toLocaleString()}</td>
                                    <td>{isAnalytic ? '—' : formatCurrency(record.audioCost, userCurrency, 4)}</td>
                                    <td>{isAnalytic ? '—' : formatCurrency(record.textCost, userCurrency, 4)}</td>
                                    <td className={cls.totalCell}>
                                        {formatCurrency(record.totalCost, userCurrency, 4)}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                    {totals && (
                        <tfoot>
                            <tr className={cls.totalsRow}>
                                <td colSpan={3}>
                                    <strong>{t('Итого')}</strong>
                                </td>
                                <td><strong>{totals.audioTokens.toLocaleString()}</strong></td>
                                <td><strong>{totals.textTokens.toLocaleString()}</strong></td>
                                <td><strong>{totals.totalTokens.toLocaleString()}</strong></td>
                                <td><strong>{formatCurrency(totals.audioCost, userCurrency, 4)}</strong></td>
                                <td><strong>{formatCurrency(totals.textCost, userCurrency, 4)}</strong></td>
                                <td className={cls.totalCell}>
                                    <strong>{formatCurrency(totals.totalCost, userCurrency, 4)}</strong>
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </VStack>
    )
})
