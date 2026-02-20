import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Table } from '@/shared/ui/redesigned/Table'
import { useGetOrganizationsQuery } from '../../api/organizationApi'
import { Loader } from '@/shared/ui/Loader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { classNames } from '@/shared/lib/classNames/classNames'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'
import { Organization } from '../../model/types/organization'

interface OrganizationListProps {
    className?: string
    userId?: string
    onEdit?: (organization: Organization) => void
    onDelete?: (organization: Organization) => void
}

export const OrganizationList = memo((props: OrganizationListProps) => {
    const { className, userId, onEdit, onDelete } = props
    const { t } = useTranslation('payment')

    const { data, isLoading, isError } = useGetOrganizationsQuery({ userId }, {
        skip: !userId
    })

    const organizations = data?.rows || []

    const columns = useMemo(() => [
        {
            header: t('Наименование'),
            accessorKey: 'name',
            cell: (info: any) => info.getValue()
        },
        {
            header: t('ИНН'),
            accessorKey: 'tin',
            cell: (info: any) => info.getValue()
        },
        {
            header: t('Адрес'),
            accessorKey: 'address',
            cell: (info: any) => info.getValue()
        },
        {
            id: 'actions',
            cell: (info: any) => (
                <HStack gap="8">
                    <IconButton color="primary" onClick={() => onEdit?.(info.row.original)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete?.(info.row.original)}>
                        <DeleteIcon />
                    </IconButton>
                </HStack>
            )
        }
    ], [t, onEdit, onDelete])

    if (isLoading) {
        return <VStack max align="center"><Loader /></VStack>
    }

    if (isError) {
        return <ErrorGetData title={t('Ошибка при загрузке организаций') || ''} />
    }

    return (
        <VStack gap="16" max className={classNames('', {}, [className])}>
            {organizations.length
? (
                <Table
                    data={organizations}
                    columns={columns}
                />
            )
: (
                <Text text={t('Список организаций пуст') || ''} />
            )}
        </VStack>
    )
})
