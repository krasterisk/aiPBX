import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Table } from '@/shared/ui/redesigned/Table'
import { Button } from '@/shared/ui/redesigned/Button'
import { Loader } from '@/shared/ui/Loader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { classNames } from '@/shared/lib/classNames/classNames'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useGetOurOrganizationsQuery } from '../../api/ourOrganizationApi'
import type { OurOrganization } from '../../model/types/ourOrganization'
import cls from './OurOrganizationList.module.scss'

interface OurOrganizationListProps {
    className?: string
    onEdit?: (org: OurOrganization) => void
    onDelete?: (org: OurOrganization) => void
}

export const OurOrganizationList = memo((props: OurOrganizationListProps) => {
    const { className, onEdit, onDelete } = props
    const { t } = useTranslation('admin')

    const { data, isLoading, isError } = useGetOurOrganizationsQuery()

    const organizations = data || []

    const columns = useMemo(() => [
        {
            header: t('ourOrg.table.primary'),
            accessorKey: 'isPrimary',
            cell: (info: { getValue: () => boolean }) =>
                info.getValue() ? t('ourOrg.table.primaryYes') : '—',
        },
        {
            header: t('Name'),
            accessorKey: 'name',
            cell: (info: { getValue: () => string }) => info.getValue(),
        },
        {
            header: t('ourOrg.table.inn'),
            accessorKey: 'tin',
            cell: (info: { getValue: () => string }) => info.getValue(),
        },
        {
            header: t('ourOrg.table.kpp'),
            accessorKey: 'kpp',
            cell: (info: { getValue: () => string }) => info.getValue() || '—',
        },
        {
            header: t('ourOrg.table.address'),
            accessorKey: 'address',
            cell: (info: { getValue: () => string }) => info.getValue(),
        },
        {
            id: 'actions',
            header: t('Actions'),
            cell: (info: { row: { original: OurOrganization } }) => (
                <HStack gap="8" wrap="wrap">
                    <Button
                        variant="clear"
                        addonLeft={<EditIcon fontSize="small" />}
                        onClick={() => { onEdit?.(info.row.original) }}
                    />
                    <Button
                        variant="clear"
                        color="error"
                        addonLeft={<DeleteIcon fontSize="small" />}
                        onClick={() => { onDelete?.(info.row.original) }}
                    />
                </HStack>
            ),
        },
    ], [t, onEdit, onDelete])

    if (isLoading) {
        return (
            <VStack max align="center" className={classNames(cls.OurOrganizationList, {}, [className])}>
                <Loader />
            </VStack>
        )
    }

    if (isError) {
        return <ErrorGetData />
    }

    if (!organizations.length) {
        return (
            <VStack gap="8" max className={classNames(cls.OurOrganizationList, {}, [className])}>
                <Text text={t('ourOrg.empty')} variant="accent" />
            </VStack>
        )
    }

    return (
        <VStack gap="16" max className={classNames(cls.OurOrganizationList, {}, [className])}>
            <Table data={organizations} columns={columns} />
        </VStack>
    )
})
