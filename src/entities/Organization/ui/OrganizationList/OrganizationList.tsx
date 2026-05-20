import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Table } from '@/shared/ui/redesigned/Table'
import { Button } from '@/shared/ui/redesigned/Button'
import { useGetOrganizationsQuery } from '../../api/organizationApi'
import { Loader } from '@/shared/ui/Loader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { classNames } from '@/shared/lib/classNames/classNames'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Organization } from '../../model/types/organization'
import { OrganizationDocumentsList } from '@/entities/OrganizationDocument'
import cls from './OrganizationList.module.scss'

interface OrganizationListProps {
    className?: string
    userId?: string
    canDeleteDocuments?: boolean
    onEdit?: (organization: Organization) => void
    onDelete?: (organization: Organization) => void
    onIssueInvoice?: (organization: Organization) => void
}

function formatOrgTableCell(info: { getValue: () => string | null | undefined }) {
    const value = info.getValue()
    return value?.trim() ? value : ''
}

export const OrganizationList = memo((props: OrganizationListProps) => {
    const { className, userId, canDeleteDocuments, onEdit, onDelete, onIssueInvoice } = props
    const { t } = useTranslation('payment')

    const { data, isLoading, isError } = useGetOrganizationsQuery(
        userId ? { userId } : {},
        { refetchOnMountOrArgChange: true },
    )

    const organizations = data?.rows || []

    const columns = useMemo(() => [
        {
            header: t('Наименование'),
            accessorKey: 'name',
            cell: formatOrgTableCell,
        },
        {
            header: t('ИНН'),
            accessorKey: 'tin',
            cell: formatOrgTableCell,
        },
        {
            header: t('organization.table.kpp'),
            accessorKey: 'kpp',
            cell: formatOrgTableCell,
        },
        {
            header: t('Адрес'),
            accessorKey: 'address',
            cell: formatOrgTableCell,
        },
        {
            id: 'actions',
            header: t('organization.table.actions'),
            cell: (info: { row: { original: Organization } }) => (
                <HStack gap="8" wrap="wrap" className={cls.actionsCell}>
                    <Button
                        className={cls.actionBtn}
                        variant="glass-action"
                        onClick={() => { onIssueInvoice?.(info.row.original) }}
                    >
                        {t('invoice.issue')}
                    </Button>
                    <Button
                        className={cls.iconBtn}
                        variant="clear"
                        addonLeft={<EditIcon fontSize="small" />}
                        onClick={() => { onEdit?.(info.row.original) }}
                    />
                    <Button
                        className={cls.iconBtn}
                        variant="clear"
                        color="error"
                        addonLeft={<DeleteIcon fontSize="small" />}
                        onClick={() => { onDelete?.(info.row.original) }}
                    />
                </HStack>
            )
        }
    ], [t, onEdit, onDelete, onIssueInvoice])

    if (isLoading) {
        return <VStack max align="center"><Loader /></VStack>
    }

    if (isError) {
        return <ErrorGetData title={t('Ошибка при загрузке организаций') || ''} />
    }

    return (
        <VStack gap="16" max className={classNames(cls.OrganizationList, {}, [className])}>
            {organizations.length
                ? (
                    <div className={cls.tableWrap}>
                        <Table
                            data={organizations}
                            columns={columns}
                            rowVariant="glass"
                            renderExpandedRow={(row) => (
                                <OrganizationDocumentsList
                                    organizationId={String(row.original.id)}
                                    canDeleteDocuments={canDeleteDocuments}
                                />
                            )}
                        />
                    </div>
                )
                : (
                    <Text text={t('Список организаций пуст') || ''} />
                )}
        </VStack>
    )
})
