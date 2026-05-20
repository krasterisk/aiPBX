import { memo, useMemo } from 'react'
import type { CellContext } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from 'lucide-react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Table } from '@/shared/ui/redesigned/Table'
import { Button } from '@/shared/ui/redesigned/Button'
import { Loader } from '@/shared/ui/Loader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { useGetOrganizationDocumentsQuery, openOrganizationDocumentPdf } from '../../api/organizationDocumentApi'
import type { OrganizationDocument } from '../../model/types/organizationDocument'
import cls from './OrganizationDocumentsList.module.scss'

function formatDocCell(info: { getValue: () => string | null | undefined }) {
    const value = info.getValue()
    return value?.trim() ? value : ''
}

interface OrganizationDocumentsListProps {
    organizationId: string
}

export const OrganizationDocumentsList = memo((props: OrganizationDocumentsListProps) => {
    const { organizationId } = props
    const { t } = useTranslation('payment')

    const { data, isLoading, isError } = useGetOrganizationDocumentsQuery(organizationId, {
        skip: !organizationId,
    })

    const hasPendingEdo = data?.some((d) => d.sbisStatus === 'sent_to_sbis') ?? false

    useGetOrganizationDocumentsQuery(organizationId, {
        skip: !organizationId,
        pollingInterval: hasPendingEdo ? 5000 : 0,
    })

    const rows = data || []

    const columns = useMemo(() => [
        {
            header: t('documents.table.number'),
            accessorKey: 'number',
            cell: formatDocCell,
        },
        {
            header: t('documents.table.type'),
            accessorKey: 'type',
            cell: (info: { getValue: () => string }) => {
                const type = info.getValue()
                return t(`documents.type.${type}` as 'documents.type.invoice')
            },
        },
        {
            header: t('documents.table.date'),
            accessorKey: 'documentDate',
            cell: formatDocCell,
        },
        {
            header: t('documents.table.amountRub'),
            accessorKey: 'amountRub',
            cell: formatDocCell,
        },
        {
            header: t('documents.table.status'),
            accessorKey: 'status',
            cell: (info: { getValue: () => string }) => {
                const st = info.getValue()
                return t(`documents.status.${st}` as 'documents.status.issued')
            },
        },
        {
            id: 'edo',
            header: t('documents.table.edo'),
            cell: (info: CellContext<OrganizationDocument, unknown>) => {
                const doc = info.row.original
                const edoUrl = doc.sbisUrl?.trim()
                const edoStatus = doc.sbisStatus?.trim() || null

                if (!doc.sbisId && !edoStatus) {
                    return null
                }

                if (edoStatus === 'sent_to_sbis') {
                    return (
                        <VStack gap="4" align="start">
                            <Loader />
                            <Text text={t('documents.edo.pending')} size="s" />
                        </VStack>
                    )
                }

                if (edoStatus === 'failed' || edoStatus === 'failed_permanent') {
                    return (
                        <Text
                            text={doc.sbisLastError || t('documents.edo.failed')}
                            size="s"
                            variant="error"
                        />
                    )
                }

                if (edoUrl) {
                    return (
                        <Button
                            variant="clear"
                            addonLeft={<ExternalLink size={16} />}
                            onClick={() => {
                                window.open(edoUrl, '_blank', 'noopener,noreferrer')
                            }}
                        >
                            {t('documents.actions.openInEdo')}
                        </Button>
                    )
                }

                if (doc.sbisId || edoStatus === 'draft' || edoStatus === 'accepted') {
                    return <Text text={t('documents.edo.registered')} size="s" />
                }

                return null
            },
        },
        {
            id: 'actions',
            header: t('documents.table.pdf'),
            cell: (info: CellContext<OrganizationDocument, unknown>) => {
                const doc = info.row.original
                if (!doc.pdfPath && !doc.sbisId) return null
                return (
                    <Button
                        variant="glass-action"
                        onClick={() => {
                            void openOrganizationDocumentPdf(organizationId, doc.id)
                        }}
                    >
                        {t('documents.actions.openPdf')}
                    </Button>
                )
            },
        },
    ], [t, organizationId])

    if (isLoading) {
        return (
            <VStack max align="center">
                <Loader />
            </VStack>
        )
    }

    if (isError) {
        return <ErrorGetData title={String(t('documents.errorLoad'))} />
    }

    if (rows.length === 0) {
        return (
            <VStack max align="center" justify="center" className={cls.empty}>
                <Text text={t('documents.empty')} align="center" />
            </VStack>
        )
    }

    return (
        <VStack gap="16" max>
            <Text title={t('documents.title')} size="s" bold />
            <Table data={rows} columns={columns} rowVariant="glass" />
        </VStack>
    )
})
