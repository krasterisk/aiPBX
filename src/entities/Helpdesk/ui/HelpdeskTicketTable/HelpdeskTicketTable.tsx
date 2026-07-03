import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { createColumnHelper } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'
import { Table } from '@/shared/ui/redesigned/Table'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import type { HelpdeskTicket } from '../../model/types/helpdesk'
import { useClaimHelpdeskTicketMutation } from '../../api/helpdeskApi'

interface HelpdeskTicketTableProps {
    tickets: HelpdeskTicket[]
    isLoading?: boolean
}

const columnHelper = createColumnHelper<HelpdeskTicket>()

export const HelpdeskTicketTable = memo((props: HelpdeskTicketTableProps) => {
    const { tickets, isLoading } = props
    const { t } = useTranslation('admin')
    const navigate = useNavigate()
    const [claimTicket, { isLoading: isClaiming }] = useClaimHelpdeskTicketMutation()

    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: () => t('helpdesk.table.id'),
            cell: (info) => `#${info.getValue()}`,
        }),
        columnHelper.accessor('subject', {
            header: () => t('helpdesk.table.subject'),
        }),
        columnHelper.accessor('clientName', {
            header: () => t('helpdesk.table.client'),
            cell: (info) => info.getValue() || t('helpdesk.table.unidentified'),
        }),
        columnHelper.accessor('status', {
            header: () => t('helpdesk.table.status'),
            cell: (info) => t(`helpdesk.status.${info.getValue()}`, info.getValue()),
        }),
        columnHelper.accessor('priority', {
            header: () => t('helpdesk.table.priority'),
            cell: (info) => t(`helpdesk.priority.${info.getValue()}`, info.getValue()),
        }),
        columnHelper.accessor('assigneeId', {
            header: () => t('helpdesk.table.assignee'),
            cell: (info) => (info.getValue() ? `#${info.getValue()}` : t('helpdesk.table.unassigned')),
        }),
        columnHelper.display({
            id: 'actions',
            header: () => t('helpdesk.table.actions'),
            cell: ({ row }) => {
                const ticket = row.original
                if (ticket.assigneeId != null) return null
                return (
                    <Button
                        variant="glass-action"
                        size="s"
                        disabled={isClaiming}
                        onClick={(e) => {
                            e.stopPropagation()
                            claimTicket(ticket.id).catch(console.error)
                        }}
                    >
                        {t('helpdesk.claim')}
                    </Button>
                )
            },
        }),
    ], [claimTicket, isClaiming, t])

    if (isLoading) {
        return <Text text={t('Loading...')} />
    }

    if (!tickets.length) {
        return <Text text={t('helpdesk.empty')} variant="accent" />
    }

    return (
        <Table
            data={tickets}
            columns={columns}
            onRowClick={(row) => { navigate(`/admin/helpdesk/${row.original.id}`) }}
        />
    )
})
