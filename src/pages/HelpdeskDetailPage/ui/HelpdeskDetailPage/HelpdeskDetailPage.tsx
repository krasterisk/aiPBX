import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Page } from '@/widgets/Page'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Card } from '@/shared/ui/redesigned/Card'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import {
    HelpdeskLlmContextTabs,
    resolveHelpdeskClientKey,
    useAddHelpdeskMessageMutation,
    useClaimHelpdeskTicketMutation,
    useGetHelpdeskTicketByIdQuery,
    useUpdateHelpdeskTicketMutation,
    type HelpdeskTicketStatus,
} from '@/entities/Helpdesk'
import cls from './HelpdeskDetailPage.module.scss'

const STATUS_OPTIONS: HelpdeskTicketStatus[] = [
    'new',
    'in_progress',
    'waiting_client',
    'resolved',
    'closed',
]

export const HelpdeskDetailPage = memo(() => {
    const { t } = useTranslation('admin')
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const ticketId = Number(id)
    const { data: ticket, isLoading, isError } = useGetHelpdeskTicketByIdQuery(ticketId, {
        skip: !ticketId,
    })
    const [updateTicket] = useUpdateHelpdeskTicketMutation()
    const [claimTicket, { isLoading: isClaiming }] = useClaimHelpdeskTicketMutation()
    const [addMessage, { isLoading: isAddingMessage }] = useAddHelpdeskMessageMutation()
    const [note, setNote] = useState('')

    const clientKey = useMemo(() => (ticket ? resolveHelpdeskClientKey(ticket) : null), [ticket])

    const statusOptions = useMemo(
        () => STATUS_OPTIONS.map((value) => ({
            value,
            label: t(`helpdesk.status.${value}`),
        })),
        [t],
    )

    const handleStatusChange = useCallback(async (_event: unknown, option: { value: string, label: string } | null) => {
        if (!ticket || !option) return
        await updateTicket({ id: ticket.id, status: option.value as HelpdeskTicketStatus })
    }, [ticket, updateTicket])

    const handleAddMessage = useCallback(async () => {
        if (!ticket || !note.trim()) return
        await addMessage({ id: ticket.id, content: note.trim(), role: 'operator' })
        setNote('')
    }, [addMessage, note, ticket])

    if (isLoading) {
        return (
            <Page data-testid="HelpdeskDetailPage">
                <Text text={t('Loading...')} />
            </Page>
        )
    }

    if (isError || !ticket) {
        return (
            <Page data-testid="HelpdeskDetailPage">
                <Text text={t('helpdesk.notFound')} variant="error" />
                <Button variant="clear" onClick={() => { navigate('/admin/helpdesk') }}>
                    {t('helpdesk.backToList')}
                </Button>
            </Page>
        )
    }

    const selectedStatus = statusOptions.find((o) => o.value === ticket.status) || null

    return (
        <Page data-testid="HelpdeskDetailPage" className={cls.HelpdeskDetailPage}>
            <VStack gap="24" max>
                <HStack justify="between" max wrap="wrap" gap="16">
                    <VStack gap="8">
                        <Button variant="clear" onClick={() => { navigate('/admin/helpdesk') }}>
                            {t('helpdesk.backToList')}
                        </Button>
                        <Text title={`#${ticket.id} - ${ticket.subject}`} />
                        <Text
                            text={ticket.clientName || t('helpdesk.table.unidentified')}
                            size="s"
                            variant="accent"
                        />
                    </VStack>
                    <HStack gap="12" wrap="wrap">
                        {ticket.assigneeId == null && (
                            <Button
                                variant="glass-action"
                                disabled={isClaiming}
                                onClick={() => { claimTicket(ticket.id).catch(console.error) }}
                            >
                                {t('helpdesk.claim')}
                            </Button>
                        )}
                        <Combobox
                            label={String(t('helpdesk.detail.status'))}
                            options={statusOptions}
                            getOptionLabel={(option: { label: string }) => option.label}
                            isOptionEqualToValue={(a: { value: string }, b: { value: string }) => a.value === b.value}
                            value={selectedStatus}
                            onChange={handleStatusChange}
                        />
                    </HStack>
                </HStack>

                <HStack gap="16" align="start" max wrap="wrap">
                    <Card variant="glass" padding="16" className={cls.mainColumn}>
                        <VStack gap="16" max>
                            <Text title={t('helpdesk.detail.clientInfo')} size="m" />
                            <Text text={`${t('helpdesk.detail.inn')}: ${ticket.inn || '-'}`} size="s" />
                            <Text text={`${t('helpdesk.detail.phone')}: ${ticket.callerPhone || ticket.contactPhone || '-'}`} size="s" />

                            {ticket.transcript && (
                                <VStack gap="8" max>
                                    <Text title={t('helpdesk.detail.transcript')} size="s" />
                                    <pre className={cls.transcript}>{ticket.transcript}</pre>
                                </VStack>
                            )}

                            <Text title={t('helpdesk.detail.messages')} size="m" />
                            <VStack gap="8" max>
                                {(ticket.messages || []).map((msg) => (
                                    <Card key={msg.id} variant="outlined" padding="8">
                                        <Text text={`[${msg.role}] ${msg.content}`} size="s" />
                                    </Card>
                                ))}
                            </VStack>

                            <VStack gap="8" max>
                                <Textarea
                                    multiline
                                    minRows={3}
                                    fullWidth
                                    value={note}
                                    onChange={(e) => { setNote(e.target.value) }}
                                    placeholder={String(t('helpdesk.detail.notePlaceholder'))}
                                />
                                <Button
                                    variant="glass-action"
                                    disabled={isAddingMessage || !note.trim()}
                                    onClick={() => { handleAddMessage().catch(console.error) }}
                                >
                                    {t('helpdesk.detail.addNote')}
                                </Button>
                            </VStack>
                        </VStack>
                    </Card>

                    <Card variant="glass" padding="16" className={cls.sideColumn}>
                        <HelpdeskLlmContextTabs clientKey={clientKey} />
                    </Card>
                </HStack>
            </VStack>
        </Page>
    )
})
