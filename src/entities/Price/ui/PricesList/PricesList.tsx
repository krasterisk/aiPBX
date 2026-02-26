import { memo, useMemo } from 'react'
import { Price } from '../../model/types/price'
import cls from './PricesList.module.scss'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Table } from '@/shared/ui/redesigned/Table/Table'
import { createColumnHelper } from '@tanstack/react-table'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Edit, Trash2 } from 'lucide-react'

interface PricesListProps {
    className?: string
    prices?: Price[]
    isLoading?: boolean
    onEdit: (price: Price) => void
    onDelete: (id: number) => void
}

export const PricesList = memo((props: PricesListProps) => {
    const {
        className,
        prices,
        isLoading,
        onEdit,
        onDelete
    } = props

    const { t } = useTranslation('admin')

    const columnHelper = createColumnHelper<Price>()

    const columns = useMemo(() => [
        columnHelper.accessor((row, index) => index + 1, {
            id: 'index',
            header: '#',
            cell: info => info.getValue()
        }),

        columnHelper.accessor('user.name', {
            header: (t('Customer') ?? ''),
            cell: info => info.getValue() || info.row.original.user?.username || '-'
        }),
        columnHelper.accessor('realtime', {
            header: (t('Realtime') ?? ''),
            cell: info => info.getValue()
        }),
        columnHelper.accessor('analytic', {
            header: (t('Analytic') ?? ''),
            cell: info => info.getValue()
        }),
        columnHelper.accessor('stt', {
            header: (t('STT') ?? ''),
            cell: info => info.getValue()
        }),
        columnHelper.display({
            id: 'actions',
            header: (t('Actions') ?? ''),
            cell: (info) => (
                <HStack gap="8">
                    <Button
                        onClick={() => { onEdit(info.row.original) }}
                        variant="clear"
                        size="m"
                    >
                        <Edit size={20} />
                    </Button>
                    <Button
                        onClick={() => { onDelete(info.row.original.id) }}
                        variant="clear"
                        color="error"
                        size="m"
                    >
                        <Trash2 size={20} />
                    </Button>
                </HStack>
            )
        })
    ], [t, onEdit, onDelete])

    if (isLoading) {
        return <Text text={t('Loading...')} />
    }

    if (!prices?.length) {
        return <Text text={t('No prices found')} align="center" />
    }

    return (
        <div className={classNames(cls.list, {}, [className])}>
            <Table
                data={prices}
                columns={columns}
                className={cls.table}
            />
        </div>
    )
})
