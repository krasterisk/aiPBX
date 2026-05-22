import { memo, useCallback, useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { useSelector } from 'react-redux'

import { Modal } from '@/shared/ui/redesigned/Modal'

import { VStack, HStack } from '@/shared/ui/redesigned/Stack'

import { Text } from '@/shared/ui/redesigned/Text'

import { Button } from '@/shared/ui/redesigned/Button'

import { Textarea } from '@/shared/ui/mui/Textarea'

import { Combobox } from '@/shared/ui/mui/Combobox'
import { Check } from '@/shared/ui/mui/Check'

import { useGetOrganizationsQuery, type Organization } from '@/entities/Organization'

import {
    useCreateOrganizationInvoiceMutation,
    useGetOrganizationDefaultSubjectQuery,
    joinApiUrl,
    openPdfUrlWithAuth,
    type CreateInvoiceBody,
} from '@/entities/OrganizationDocument'

import { ClientSelect, isUserAdmin, useGetUser, getBillingOwnerUserId } from '@/entities/User'
import { OurOrganizationSelect } from '@/entities/OurOrganization'

interface OrganizationInvoiceModalProps {
    isOpen: boolean
    onClose: () => void
    userId: string
    preselectedOrganizationId?: string
}

export const OrganizationInvoiceModal = memo((props: OrganizationInvoiceModalProps) => {
    const { isOpen, onClose, userId, preselectedOrganizationId } = props

    const { t } = useTranslation('payment')

    const isAdmin = useSelector(isUserAdmin)
    const billingOwnerUserId = useSelector(getBillingOwnerUserId)

    const [filterUserId, setFilterUserId] = useState(billingOwnerUserId || userId)

    useEffect(() => {
        if (isOpen) {
            setFilterUserId(isAdmin ? userId : (billingOwnerUserId || userId))
        }
    }, [isOpen, userId, isAdmin, billingOwnerUserId])

    const effectiveUserId = isAdmin ? filterUserId : (billingOwnerUserId || userId)

    const { data: tenantUser } = useGetUser(effectiveUserId, {
        skip: !isOpen || !isAdmin || !effectiveUserId,
    })

    const { data: orgData } = useGetOrganizationsQuery(
        { userId: effectiveUserId },
        { skip: !effectiveUserId || !isOpen },
    )

    const { data: defaultSubjectData } = useGetOrganizationDefaultSubjectQuery(undefined, {
        skip: !isOpen,
    })

    const [createInvoice, { isLoading: isMutationLoading }] = useCreateOrganizationInvoiceMutation()

    const organizations = orgData?.rows || []

    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)

    const [amountRub, setAmountRub] = useState('')

    const [subject, setSubject] = useState('')

    const [ourOrganizationId, setOurOrganizationId] = useState('')
    const [sendViaEdo, setSendViaEdo] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const busy = isMutationLoading || isSubmitting

    const handleClose = useCallback(() => {
        if (!busy) {
            onClose()
        }
    }, [busy, onClose])

    useEffect(() => {
        if (!isOpen || !isAdmin) return
        const fromUser = tenantUser?.ourOrganizationId ?? tenantUser?.our_organization_id
        setOurOrganizationId(fromUser != null && fromUser !== '' ? String(fromUser) : '')
    }, [isOpen, isAdmin, tenantUser?.ourOrganizationId, tenantUser?.our_organization_id, effectiveUserId])

    useEffect(() => {
        if (!isOpen) return
        setSendViaEdo(false)
        setIsSubmitting(false)

        const presetId = preselectedOrganizationId

        const preset = presetId
            ? organizations.find((o) => String(o.id) === presetId)
            : organizations[0]

        setSelectedOrg(preset || null)
    }, [isOpen, preselectedOrganizationId, organizations])

    useEffect(() => {
        if (!isOpen || !selectedOrg) return
        if (!isAdmin) return

        const subj = selectedOrg.subject?.trim() ||
            defaultSubjectData?.defaultSubject ||
            ''

        setSubject(subj)
    }, [isOpen, isAdmin, selectedOrg, defaultSubjectData?.defaultSubject])

    const parsedAmount = parseFloat(amountRub.replace(',', '.'))
    const edoReady = selectedOrg?.edo?.edoReady === true ||
        selectedOrg?.edoInvitationStateCode === 7
    const edoPending = selectedOrg?.edoInvitationStateCode === 2
    const canSubmit = !!selectedOrg &&
        !!effectiveUserId &&
        !Number.isNaN(parsedAmount) &&
        parsedAmount > 0

    const handleSubmit = useCallback(async () => {
        if (!selectedOrg || !canSubmit) return

        setIsSubmitting(true)
        try {
            const body: CreateInvoiceBody = { amountRub: parsedAmount }

            if (isAdmin && subject.trim()) {
                body.subject = subject.trim()
            }

            if (isAdmin && ourOrganizationId) {
                body.ourOrganizationId = Number(ourOrganizationId)
            }

            if (sendViaEdo) {
                body.sendViaEdo = true
            }

            const res = await createInvoice({
                organizationId: String(selectedOrg.id),
                body,
            }).unwrap()

            const url = res.pdfUrl.startsWith('http')
                ? res.pdfUrl
                : joinApiUrl(res.pdfUrl)

            await openPdfUrlWithAuth(url)
            onClose()
        } catch (e) {
            console.error(e)
        } finally {
            setIsSubmitting(false)
        }
    }, [
        canSubmit,
        parsedAmount,
        createInvoice,
        onClose,
        selectedOrg,
        subject,
        isAdmin,
        ourOrganizationId,
        sendViaEdo,
    ])

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <VStack gap="16" max>
                    <Text title={t('invoice.modalTitle')} bold />

                    {isAdmin && (
                        <ClientSelect
                            label={String(t('organization.form.client'))}
                            clientId={filterUserId}
                            required
                            disabled={busy}
                            onChangeClient={(id) => {
                                setFilterUserId(id || userId)
                                setSelectedOrg(null)
                            }}
                        />
                    )}

                    {isAdmin && (
                        <VStack gap="8" max>
                            <OurOrganizationSelect
                                label={String(t('invoice.ourOrganization'))}
                                organizationId={ourOrganizationId}
                                onChangeOrganization={setOurOrganizationId}
                                disabled={busy}
                            />
                            <Text text={t('invoice.ourOrganization.hint')} size="xs" variant="accent" />
                        </VStack>
                    )}

                    <Combobox
                        label={String(t('invoice.organization'))}
                        options={organizations}
                        getOptionLabel={(o) => o.name}
                        isOptionEqualToValue={(a, b) => String(a.id) === String(b.id)}
                        value={selectedOrg}
                        onChange={(_, v) => { setSelectedOrg(v) }}
                        required
                        disabled={busy}
                    />

                    <Textarea
                        label={t('invoice.amountRub')}
                        value={amountRub}
                        onChange={(e) => { setAmountRub(e.target.value) }}
                        minRows={1}
                        required
                        disabled={busy}
                    />

                    {isAdmin && (
                        <>
                            <Textarea
                                label={t('invoice.subject.label')}
                                value={subject}
                                onChange={(e) => { setSubject(e.target.value) }}
                                minRows={2}
                                disabled={busy}
                            />
                            <Text text={t('invoice.subject.hint')} size="s" />
                        </>
                    )}

                    <Check
                        checked={sendViaEdo}
                        onChange={(e) => { setSendViaEdo(e.target.checked) }}
                        label={String(t('invoice.sendViaEdo'))}
                        disabled={busy || !edoReady}
                    />
                    {sendViaEdo && !edoReady && (
                        <Text
                            text={
                                edoPending
                                    ? t('invoice.sendViaEdoPending')
                                    : t('invoice.sendViaEdoNotReady')
                            }
                            size="s"
                        />
                    )}

                    <HStack gap="8" max justify="end">
                        <Button variant="clear" onClick={handleClose} disabled={busy}>
                            {t('invoice.cancel')}
                        </Button>
                        <Button
                            variant="glass-action"
                            onClick={() => { void handleSubmit() }}
                            disabled={busy || !canSubmit}
                        >
                            {busy ? t('invoice.loading') : t('invoice.create')}
                        </Button>
                    </HStack>
            </VStack>
        </Modal>
    )
})
