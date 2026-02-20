import { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import cls from './PaymentList.module.scss'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Table } from '@/shared/ui/redesigned/Table'

import { useGetPaymentsQuery } from '../../api/paymentApi'
import { Loader } from '@/shared/ui/Loader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { classNames } from '@/shared/lib/classNames/classNames'

interface PaymentListProps {
    className?: string
}

export const PaymentList = memo((props: PaymentListProps) => {
    const { className } = props
    const { t } = useTranslation('payment')

    const { data, isLoading, isError } = useGetPaymentsQuery({})

    const payments = data?.rows || []

    const exportToExcel = useCallback(() => {
        if (!payments.length) return

        const worksheet = XLSX.utils.json_to_sheet(payments)
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
            cell: (info: any) => new Date(info.getValue()).toLocaleString()
        },
        {
            header: t('Сумма'),
            accessorKey: 'amount',
            cell: (info: any) => info.getValue()
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
            accessorKey: 'receiptUrl',
            cell: (info: any) => {
                const url = info.getValue()
                return url
                    ? <a href={url} target="_blank" rel="noopener noreferrer">{t('Чек')}</a>
                    : '-'
            }
        }
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
