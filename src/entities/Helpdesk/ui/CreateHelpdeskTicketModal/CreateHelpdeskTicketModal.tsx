import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Input } from '@/shared/ui/mui/Input'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import {
    AlfawebhookClient,
    HelpdeskTicketCategory,
    HelpdeskTicketPriority,
} from '../../model/types/helpdesk'
import {
    useCreateHelpdeskTicketMutation,
    useIdentifyHelpdeskClientMutation,
} from '../../api/helpdeskApi'
import cls from './CreateHelpdeskTicketModal.module.scss'

const CATEGORIES: HelpdeskTicketCategory[] = ['technical', 'billing', 'sales', 'other']
const PRIORITIES: HelpdeskTicketPriority[] = ['urgent', 'high', 'normal', 'low']

interface CreateHelpdeskTicketModalProps {
    isOpen: boolean
    onClose: () => void
}

function formatClientLabel(client: AlfawebhookClient): string {
    const parts = [client.name, client.inn ? `ИНН ${client.inn}` : ''].filter(Boolean)
    return parts.join(' - ') || client.id || '-'
}

export const CreateHelpdeskTicketModal = memo((props: CreateHelpdeskTicketModalProps) => {
    const { isOpen, onClose } = props
    const { t } = useTranslation('admin')
    const navigate = useNavigate()

    const [subject, setSubject] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState<HelpdeskTicketCategory>('technical')
    const [priority, setPriority] = useState<HelpdeskTicketPriority>('normal')
    const [callerPhone, setCallerPhone] = useState('')
    const [contactPhone, setContactPhone] = useState('')
    const [inn, setInn] = useState('')
    const [clientName, setClientName] = useState('')
    const [alfawebhookClientId, setAlfawebhookClientId] = useState<string | undefined>()
    const [identifyMessage, setIdentifyMessage] = useState<string | null>(null)
    const [candidates, setCandidates] = useState<AlfawebhookClient[]>([])

    const [createTicket, { isLoading: isCreating }] = useCreateHelpdeskTicketMutation()
    const [identifyClient, { isLoading: isIdentifying }] = useIdentifyHelpdeskClientMutation()

    const resetForm = useCallback(() => {
        setSubject('')
        setDescription('')
        setCategory('technical')
        setPriority('normal')
        setCallerPhone('')
        setContactPhone('')
        setInn('')
        setClientName('')
        setAlfawebhookClientId(undefined)
        setIdentifyMessage(null)
        setCandidates([])
    }, [])

    useEffect(() => {
        if (!isOpen) {
            resetForm()
        }
    }, [isOpen, resetForm])

    const categoryOptions = useMemo(
        () => CATEGORIES.map((value) => ({ value, label: t(`helpdesk.category.${value}`) })),
        [t],
    )

    const priorityOptions = useMemo(
        () => PRIORITIES.map((value) => ({ value, label: t(`helpdesk.priority.${value}`) })),
        [t],
    )

    const candidateOptions = useMemo(
        () => candidates.map((client) => ({
            value: client.id ?? '',
            label: formatClientLabel(client),
            client,
        })),
        [candidates],
    )

    const applyClient = useCallback((client: AlfawebhookClient) => {
        setAlfawebhookClientId(client.id)
        setInn(client.inn ?? '')
        setClientName(client.name ?? '')
        if (client.phone && !callerPhone) {
            setCallerPhone(client.phone)
        }
        setCandidates([])
        setIdentifyMessage(t('helpdesk.create.clientLinked'))
    }, [callerPhone, t])

    const handleIdentify = useCallback(async () => {
        setIdentifyMessage(null)
        setCandidates([])
        const result = await identifyClient({
            phone: callerPhone.trim() || undefined,
            inn: inn.trim() || undefined,
            name: clientName.trim() || undefined,
        }).unwrap()

        if (result.found && result.client) {
            applyClient(result.client)
            setIdentifyMessage(result.message ?? null)
            return
        }

        if (result.candidates?.length) {
            setCandidates(result.candidates)
            setIdentifyMessage(result.message ?? t('helpdesk.create.pickCandidate'))
            return
        }

        setIdentifyMessage(result.message ?? t('helpdesk.create.clientNotFound'))
    }, [applyClient, callerPhone, clientName, identifyClient, inn, t])

    const handleCandidatePick = useCallback((_event: unknown, option: { client: AlfawebhookClient } | null) => {
        if (!option?.client) return
        applyClient(option.client)
    }, [applyClient])

    const handleSubmit = useCallback(async () => {
        const trimmedSubject = subject.trim()
        if (!trimmedSubject) return

        const ticket = await createTicket({
            subject: trimmedSubject,
            description: description.trim() || undefined,
            category,
            priority,
            callerPhone: callerPhone.trim() || undefined,
            contactPhone: contactPhone.trim() || undefined,
            inn: inn.trim() || undefined,
            clientName: clientName.trim() || undefined,
            alfawebhookClientId,
            source: 'manual',
        }).unwrap()

        onClose()
        navigate(`/admin/helpdesk/${ticket.id}`)
    }, [
        alfawebhookClientId,
        callerPhone,
        category,
        clientName,
        contactPhone,
        createTicket,
        description,
        inn,
        navigate,
        onClose,
        priority,
        subject,
    ])

    const canSubmit = subject.trim().length > 0 && !isCreating

    return (
        <Modal isOpen={isOpen} onClose={onClose} lazy size="wide" showClose>
            <VStack gap="24" max className={cls.modal}>
                <Text title={t('helpdesk.create.title')} bold />

                <Input
                    label={t('helpdesk.create.subject')}
                    value={subject}
                    onChange={(e) => { setSubject(e.target.value) }}
                    required
                    fullWidth
                    size="small"
                />

                <HStack gap="12" max wrap="wrap">
                    <Combobox
                        options={categoryOptions}
                        getOptionLabel={(o) => o.label}
                        value={categoryOptions.find((o) => o.value === category) ?? null}
                        onChange={(_e, val) => {
                            if (val) setCategory(val.value as HelpdeskTicketCategory)
                        }}
                        label={String(t('helpdesk.create.category'))}
                        size="small"
                        sx={{ minWidth: 200, flex: 1 }}
                    />
                    <Combobox
                        options={priorityOptions}
                        getOptionLabel={(o) => o.label}
                        value={priorityOptions.find((o) => o.value === priority) ?? null}
                        onChange={(_e, val) => {
                            if (val) setPriority(val.value as HelpdeskTicketPriority)
                        }}
                        label={String(t('helpdesk.create.priority'))}
                        size="small"
                        sx={{ minWidth: 200, flex: 1 }}
                    />
                </HStack>

                <Textarea
                    label={t('helpdesk.create.description')}
                    value={description}
                    onChange={(e) => { setDescription(e.target.value) }}
                    minRows={3}
                    fullWidth
                />

                <VStack gap="12" max className={cls.clientBlock}>
                    <Text text={t('helpdesk.create.clientSection')} bold size="s" />
                    <HStack gap="12" max wrap="wrap">
                        <Input
                            label={t('helpdesk.detail.phone')}
                            value={callerPhone}
                            onChange={(e) => { setCallerPhone(e.target.value) }}
                            size="small"
                            sx={{ flex: 1, minWidth: 160 }}
                        />
                        <Input
                            label={t('helpdesk.detail.inn')}
                            value={inn}
                            onChange={(e) => { setInn(e.target.value) }}
                            size="small"
                            sx={{ flex: 1, minWidth: 160 }}
                        />
                    </HStack>
                    <Input
                        label={t('helpdesk.table.client')}
                        value={clientName}
                        onChange={(e) => { setClientName(e.target.value) }}
                        fullWidth
                        size="small"
                    />
                    <Input
                        label={t('helpdesk.create.contactPhone')}
                        value={contactPhone}
                        onChange={(e) => { setContactPhone(e.target.value) }}
                        fullWidth
                        size="small"
                    />
                    <HStack gap="8" wrap="wrap" align="center">
                        <Button
                            variant="glass-action"
                            size="s"
                            onClick={handleIdentify}
                            disabled={isIdentifying || (!callerPhone.trim() && !inn.trim() && !clientName.trim())}
                        >
                            {t('helpdesk.create.findClient')}
                        </Button>
                        {identifyMessage && (
                            <Text text={identifyMessage} size="s" variant="accent" />
                        )}
                    </HStack>
                    {candidateOptions.length > 0 && (
                        <Combobox
                            options={candidateOptions}
                            getOptionLabel={(o) => o.label}
                            onChange={handleCandidatePick}
                            label={String(t('helpdesk.create.pickCandidate'))}
                            size="small"
                            value={null}
                        />
                    )}
                </VStack>

                <HStack gap="12" justify="end" max>
                    <Button variant="clear" onClick={onClose} disabled={isCreating}>
                        {t('helpdesk.create.cancel')}
                    </Button>
                    <Button
                        variant="glass-action"
                        color="success"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                    >
                        {t('helpdesk.create.submit')}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    )
})
