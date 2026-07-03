import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import type { HelpdeskTicket } from '../../model/types/helpdesk'
import { useClaimHelpdeskTicketMutation } from '../../api/helpdeskApi'
import cls from './HelpdeskTicketCard.module.scss'

interface HelpdeskTicketCardProps {
    ticket: HelpdeskTicket
}

export const HelpdeskTicketCard = memo((props: HelpdeskTicketCardProps) => {
    const { ticket } = props
    const { t } = useTranslation('admin')
    const navigate = useNavigate()
    const [claimTicket, { isLoading }] = useClaimHelpdeskTicketMutation()

    return (
        <Card
            variant="glass"
            className={cls.card}
            onClick={() => { navigate(`/admin/helpdesk/${ticket.id}`) }}
        >
            <VStack gap="8" max>
                <HStack justify="between" max>
                    <Text text={`#${ticket.id}`} size="s" variant="accent" />
                    <Text text={t(`helpdesk.priority.${ticket.priority}`, ticket.priority)} size="s" />
                </HStack>
                <Text title={ticket.subject} size="s" />
                <Text
                    text={ticket.clientName || t('helpdesk.table.unidentified')}
                    size="xs"
                    variant="accent"
                />
                {ticket.assigneeId == null && (
                    <Button
                        variant="glass-action"
                        size="s"
                        disabled={isLoading}
                        onClick={(e) => {
                            e.stopPropagation()
                            claimTicket(ticket.id).catch(console.error)
                        }}
                    >
                        {t('helpdesk.claim')}
                    </Button>
                )}
            </VStack>
        </Card>
    )
})
