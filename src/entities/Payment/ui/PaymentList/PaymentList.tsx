import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cls from './PaymentList.module.scss'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Table } from '@/shared/ui/redesigned/Table'

import { useGetPaymentsQuery, type GetPaymentsQueryArgs } from '../../api/paymentApi'
import { Loader } from '@/shared/ui/Loader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { classNames } from '@/shared/lib/classNames/classNames'
import { ClientSelect, isUserAdmin } from '@/entities/User'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'
import { formatPaymentFxRate } from '../../lib/formatPaymentFxRate'
import type { Payment } from '../../model/types/payment'

interface PaymentListProps {
    className?: string
}

export const PaymentList = memo((props: PaymentListProps) => {
    const { className } = props
    const { t } = useTranslation('payment')
    const { t: tUsers } = useTranslation('users')
    const isAdmin = useSelector(isUserAdmin)

    const [filterClientId, setFilterClientId] = useState('')

    const queryArgs = useMemo((): GetPaymentsQueryArgs => {
        const base: GetPaymentsQueryArgs = {
            page: 1,
            limit: isAdmin ? 500 : 100,
        }
        if (isAdmin && filterClientId) {
            base.userId = filterClientId
        }
        return base
    }, [isAdmin, filterClientId])

    const { data, isLoading, isError } = useGetPaymentsQuery(queryArgs)

    const payments = data?.rows || []

    const exportToExcel = useCallback(() => {
        if (!payments.length) return

        const exportRows = payments.map((row: Payment) => ({
            ...row,
            fxRateDisplay: formatPaymentFxRate(row),
        }))
        const worksheet = XLSX.utils.json_to_sheet(exportRows)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments')
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        saveAs(dataBlob, 'payments_history.xlsx')
    }, [payments])

    const columns = useMemo(() => [
        {
            header: t('Дата'),
            accessorKey: 'createdAt',
            cell: (info: any) => {
                const d = new Date(info.getValue())
                return d.toLocaleDateString() + ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })
            }
        },
        {
            header: t('Сумма'),
            accessorKey: 'amount',
            cell: (info: any) => {
                const row = info.row.original as { amount?: number, currency?: string }
                const amount = Number(row.amount)
                if (!Number.isFinite(amount)) return '—'
                return formatCurrency(amount, (row.currency || 'USD').toUpperCase(), 2)
            },
        },
        {
            header: t('Валюта'),
            accessorKey: 'currency',
            cell: (info: any) => String(info.getValue()).toUpperCase()
        },
        {
            header: t('Метод оплаты'),
            accessorKey: 'paymentMethod',
            cell: (info: any) => info.getValue() || '-'
        },
        {
            header: t('Статус'),
            accessorKey: 'status',
            cell: (info: any) => info.getValue()
        },
        {
            header: t('Детали'),
            id: 'details',
            cell: (info: any) => {
                const row = info.row.original as Payment
                const url = row.receiptUrl
                const description = row.description?.trim()
                const rate = formatPaymentFxRate(row)
                const hasRate = rate !== '—'

                return (
                    <div className={cls.detailsCell}>
                        {url
                            ? (
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    {t('Чек')}
                                </a>
                            )
                            : (description || (!hasRate ? '—' : null))}
                        {hasRate && (
                            <span className={cls.detailsRate}>{rate}</span>
                        )}
                    </div>
                )
            },
        },
    ], [t])

    if (isLoading) {
        return <Loader />
    }

    if (isError) {
        return <ErrorGetData title={t('Ошибка при загрузке платежей') || ''} />
    }

    return (
        <VStack gap="16" max className={classNames(cls.PaymentListSection, {}, [className])}>
            <HStack justify="between" max wrap="wrap" gap="16">
                <Text title={t('История платежей') || ''} />
                <Button onClick={exportToExcel} variant="glass-action">
                    {t('Экспорт в Excel')}
                </Button>
            </HStack>

            {isAdmin && (
                <ClientSelect
                    label={String(tUsers('Пользователь'))}
                    clientId={filterClientId || undefined}
                    onChangeClient={(id) => { setFilterClientId(id || '') }}
                    fullWidth
                />
            )}

            {payments.length
                ? (
                    <Table
                        data={payments}
                        columns={columns}
                    />
                )
                : (
                    <Text text={t('История платежей пуста') || ''} />
                )}
        </VStack>
    )
})
