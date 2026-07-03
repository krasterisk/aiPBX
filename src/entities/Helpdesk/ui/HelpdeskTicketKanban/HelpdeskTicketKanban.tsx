import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import type { HelpdeskTicket, HelpdeskTicketStatus } from '../../model/types/helpdesk'
import { HelpdeskTicketCard } from '../HelpdeskTicketCard/HelpdeskTicketCard'
import cls from './HelpdeskTicketKanban.module.scss'

const KANBAN_COLUMNS: HelpdeskTicketStatus[] = [
    'new',
    'in_progress',
    'waiting_client',
    'resolved',
]

interface HelpdeskTicketKanbanProps {
    tickets: HelpdeskTicket[]
}

export const HelpdeskTicketKanban = memo((props: HelpdeskTicketKanbanProps) => {
    const { tickets } = props
    const { t } = useTranslation('admin')

    const grouped = useMemo(() => {
        const map = new Map<HelpdeskTicketStatus, HelpdeskTicket[]>()
        for (const col of KANBAN_COLUMNS) {
            map.set(col, [])
        }
        for (const ticket of tickets) {
            let status: HelpdeskTicketStatus = 'resolved'
            if (
                ticket.status === 'new' ||
                ticket.status === 'in_progress' ||
                ticket.status === 'waiting_client' ||
                ticket.status === 'resolved'
            ) {
                status = ticket.status
            }
            const bucket = map.get(status) ?? []
            bucket.push(ticket)
            map.set(status, bucket)
        }
        return map
    }, [tickets])

    return (
        <HStack gap="16" align="start" max className={cls.kanban}>
            {KANBAN_COLUMNS.map((status) => (
                <VStack key={status} gap="12" className={cls.column}>
                    <Text title={t(`helpdesk.status.${status}`)} size="s" />
                    <VStack gap="12" max>
                        {(grouped.get(status) || []).map((ticket) => (
                            <HelpdeskTicketCard key={ticket.id} ticket={ticket} />
                        ))}
                    </VStack>
                </VStack>
            ))}
        </HStack>
    )
})
