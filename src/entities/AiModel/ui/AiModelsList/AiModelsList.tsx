import { memo, useMemo } from 'react'
import { AiModel } from '../../model/types/aiModel'
import cls from './AiModelsList.module.scss'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Table } from '@/shared/ui/redesigned/Table/Table'
import { createColumnHelper } from '@tanstack/react-table'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Edit, Trash2, Check, X } from 'lucide-react'

interface AiModelsListProps {
    className?: string
    models?: AiModel[]
    isLoading?: boolean
    onEdit: (model: AiModel) => void
    onDelete: (id: number) => void
}

export const AiModelsList = memo((props: AiModelsListProps) => {
    const {
        className,
        models,
        isLoading,
        onEdit,
        onDelete
    } = props

    const { t } = useTranslation('admin')

    const columnHelper = createColumnHelper<AiModel>()

    const columns = useMemo(() => [
        columnHelper.accessor((row, index) => index + 1, {
            id: 'index',
            header: '#',
            cell: info => info.getValue()
        }),
        columnHelper.accessor('name', {
            header: (t('Name') ?? ''),
            cell: info => info.getValue()
        }),
        columnHelper.accessor('comment', {
            header: (t('Comment') ?? ''),
            cell: info => info.getValue()
        }),
        columnHelper.accessor('publish', {
            header: (t('Publish') ?? ''),
            cell: info => (
                <span className={info.getValue() ? cls.publishActive : cls.publishInactive}>
                    {info.getValue()
                        ? <Check size={16} />
                        : <X size={16} />
                    }
                </span>
            )
        }),
        columnHelper.accessor('publishName', {
            header: (t('Publish Name') ?? ''),
            cell: info => info.getValue() || '—'
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

    if (!models?.length) {
        return <Text text={t('No models found')} align="center" />
    }

    return (
        <div className={classNames(cls.list, {}, [className])}>
            <Table
                data={models}
                columns={columns}
                className={cls.table}
            />
        </div>
    )
})
