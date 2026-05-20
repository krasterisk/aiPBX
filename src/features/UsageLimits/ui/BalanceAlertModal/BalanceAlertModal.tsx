import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Input } from '@/shared/ui/mui/Input'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Check } from '@/shared/ui/mui/Check'
import {
    ClientSelect,
    getBillingOwnerUserId,
    getUserAuthData,
    parseNotifyEmails,
    TenantNotifyEmailsSelect,
} from '@/entities/User'
import { useGetOrganizationsQuery, type Organization } from '@/entities/Organization'
import {
    type BalanceThresholdAlert,
    type CreateBalanceAlertBody,
    useCreateBalanceAlertMutation,
    useUpdateBalanceAlertMutation,
 InvoiceAmountMode 
} from '@/entities/BalanceAlert'
import { getRoutePayment } from '@/shared/const/router'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { isPaymentOrganizationsTabVisible } from '@/shared/lib/domain'
import { canSubmitBalanceAlert } from '../../lib/balanceAlertForm'

interface BalanceAlertModalProps {
    isOpen: boolean
    onClose: () => void
    /** Tenant owner for non-admin; initial client for admin */
    ownerUserId: string
    editing?: BalanceThresholdAlert | null
    isAdmin?: boolean
}

export const BalanceAlertModal = memo((props: BalanceAlertModalProps) => {
    const {
        isOpen,
        onClose,
        ownerUserId: ownerUserIdProp,
        editing,
        isAdmin,
    } = props

    const { t } = useTranslation('payment')
    const showInvoiceOption = isPaymentOrganizationsTabVisible()
    const authData = useSelector(getUserAuthData)
    const billingOwnerUserId = useSelector(getBillingOwnerUserId)
    const selfUserId = String(authData?.id ?? '')

    const [createAlert, { isLoading: isCreating }] = useCreateBalanceAlertMutation()
    const [updateAlert, { isLoading: isUpdating }] = useUpdateBalanceAlertMutation()

    const [tenantClientId, setTenantClientId] = useState(ownerUserIdProp)
    const effectiveOwnerId = isAdmin ? tenantClientId : (billingOwnerUserId || ownerUserIdProp || selfUserId)

    const { data: orgData } = useGetOrganizationsQuery(
        { userId: effectiveOwnerId },
        { skip: !isOpen || !effectiveOwnerId },
    )
    const organizations = orgData?.rows || []

    const [limitAmount, setLimitAmount] = useState('')
    const [emails, setEmails] = useState<string[]>([])
    const [emailsRaw, setEmailsRaw] = useState('')
    const [notifyUserIds, setNotifyUserIds] = useState<number[]>([])
    const [sendInvoice, setSendInvoice] = useState(false)
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
    const [amountMode, setAmountMode] = useState<InvoiceAmountMode>('average_monthly')
    const [invoiceAmountRub, setInvoiceAmountRub] = useState('')
    const [sendViaEdo, setSendViaEdo] = useState(false)

    const busy = isCreating || isUpdating
    const prevTenantClientRef = useRef<string | null>(null)

    useEffect(() => {
        if (!isOpen) {
            prevTenantClientRef.current = null
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen || showInvoiceOption) return
        setSendInvoice(false)
        setSendViaEdo(false)
    }, [isOpen, showInvoiceOption])

    useEffect(() => {
        if (!isOpen) return

        const initialClient = editing
            ? String(editing.ownerUserId)
            : ownerUserIdProp

        if (isAdmin) {
            setTenantClientId(initialClient)
        }
    }, [isOpen, editing, isAdmin, ownerUserIdProp])

    useEffect(() => {
        if (!isOpen) return

        if (editing) {
            setLimitAmount(String(editing.limitAmount))
            setEmails(editing.emails || [])
            setEmailsRaw((editing.emails || []).join(', '))
            setNotifyUserIds(editing.notifyUserIds || [])
            setSendInvoice(editing.sendInvoice)
            setAmountMode(editing.invoiceAmountMode || 'average_monthly')
            setInvoiceAmountRub(editing.invoiceAmountRub != null ? String(editing.invoiceAmountRub) : '')
            setSendViaEdo(editing.sendViaEdo)
            const org = organizations.find(
                (o) => editing.organizationId != null && Number(o.id) === editing.organizationId,
            ) || null
            setSelectedOrg(org)
        } else {
            setLimitAmount('')
            setEmails([])
            setEmailsRaw('')
            setNotifyUserIds([])
            setSendInvoice(false)
            setSelectedOrg(organizations[0] || null)
            setAmountMode('average_monthly')
            setInvoiceAmountRub('')
            setSendViaEdo(false)
        }
    }, [isOpen, editing, organizations])

    useEffect(() => {
        if (!isOpen || editing || !organizations.length) return
        setSelectedOrg(organizations[0])
    }, [isOpen, editing, organizations])

    useEffect(() => {
        if (!isOpen || !isAdmin) return
        const prev = prevTenantClientRef.current
        prevTenantClientRef.current = tenantClientId
        if (prev !== null && prev !== tenantClientId) {
            setEmails([])
            setNotifyUserIds([])
            setSelectedOrg(null)
        }
    }, [isOpen, isAdmin, tenantClientId])

    const parsedLimit = parseFloat(limitAmount.replace(',', '.'))
    const parsedInvoiceAmount = parseFloat(invoiceAmountRub.replace(',', '.'))

    const resolvedEmails = isAdmin ? emails : parseNotifyEmails(emailsRaw)

    const canSubmit = canSubmitBalanceAlert({
        limitAmountRaw: limitAmount,
        emails: resolvedEmails,
        ownerUserId: effectiveOwnerId,
        showInvoiceOption,
        sendInvoice,
        selectedOrgId: selectedOrg?.id,
        amountMode,
        invoiceAmountRubRaw: invoiceAmountRub,
    })

    const handleTenantEmailsChange = useCallback((nextEmails: string[], userIds: number[]) => {
        setEmails(nextEmails)
        setNotifyUserIds(userIds)
    }, [])

    const handleSubmit = useCallback(async () => {
        if (!canSubmit) return

        const invoiceEnabled = showInvoiceOption && sendInvoice

        const body: CreateBalanceAlertBody = {
            ownerUserId: effectiveOwnerId,
            limitAmount: parsedLimit,
            emails: resolvedEmails,
            notifyUserIds,
            sendInvoice: invoiceEnabled,
            sendViaEdo: invoiceEnabled ? sendViaEdo : false,
        }

        if (invoiceEnabled && selectedOrg) {
            body.organizationId = Number(selectedOrg.id)
            body.invoiceAmountMode = amountMode
            if (amountMode === 'fixed') {
                body.invoiceAmountRub = parsedInvoiceAmount
            }
        }

        try {
            if (editing) {
                const { ownerUserId: _owner, ...updateBody } = body
                await updateAlert({
                    id: editing.id,
                    ownerUserId: effectiveOwnerId,
                    body: updateBody,
                }).unwrap()
            } else {
                await createAlert(body).unwrap()
            }
            onClose()
        } catch (e) {
            console.error(e)
        }
    }, [
        canSubmit,
        parsedLimit,
        resolvedEmails,
        notifyUserIds,
        sendInvoice,
        sendViaEdo,
        showInvoiceOption,
        isAdmin,
        effectiveOwnerId,
        selectedOrg,
        amountMode,
        parsedInvoiceAmount,
        editing,
        createAlert,
        updateAlert,
        onClose,
    ])

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="wide">
            <VStack gap="16" max>
                <Text
                    title={editing ? t('limits.modal.editTitle') : t('limits.modal.createTitle')}
                    bold
                />

                {isAdmin && (
                    <ClientSelect
                        label={String(t('organization.form.client'))}
                        clientId={tenantClientId}
                        required
                        disabled={busy}
                        onChangeClient={(id) => { setTenantClientId(id || ownerUserIdProp) }}
                    />
                )}

                <Textarea
                    label={t('limits.thresholdAmount')}
                    value={limitAmount}
                    onChange={(e) => { setLimitAmount(e.target.value) }}
                    minRows={1}
                    required
                    disabled={busy}
                />

                {isAdmin ? (
                    <TenantNotifyEmailsSelect
                        ownerUserId={effectiveOwnerId}
                        emails={emails}
                        onChange={handleTenantEmailsChange}
                        disabled={busy || !effectiveOwnerId}
                    />
                ) : (
                    <Input
                        label={t('limits.emails')}
                        value={emailsRaw}
                        onChange={(e) => { setEmailsRaw(e.target.value) }}
                        helperText={String(t('limits.emailsHint'))}
                        required
                        disabled={busy}
                    />
                )}

                {showInvoiceOption && (
                    <Check
                        checked={sendInvoice}
                        onChange={(e) => { setSendInvoice(e.target.checked) }}
                        label={String(t('limits.sendInvoice'))}
                        disabled={busy}
                    />
                )}

                {showInvoiceOption && sendInvoice && (
                    <VStack gap="12" max>
                        {!organizations.length ? (
                            <VStack gap="8" max>
                                <Text text={t('limits.noOrganizations')} size="s" variant="accent" />
                                <AppLink to={getRoutePayment()}>
                                    {t('limits.goToOrganizations')}
                                </AppLink>
                            </VStack>
                        ) : (
                            <>
                                <Combobox
                                    label={String(t('limits.invoiceOrganization'))}
                                    options={organizations}
                                    getOptionLabel={(o) => o.name}
                                    isOptionEqualToValue={(a, b) => String(a.id) === String(b.id)}
                                    value={selectedOrg}
                                    onChange={(_, v) => { setSelectedOrg(v) }}
                                    required
                                    disabled={busy}
                                />

                                <Check
                                    checked={amountMode === 'average_monthly'}
                                    onChange={(e) => {
                                        setAmountMode(e.target.checked ? 'average_monthly' : 'fixed')
                                    }}
                                    label={String(t('limits.averageMonthlyAmount'))}
                                    disabled={busy}
                                />

                                {amountMode === 'fixed' && (
                                    <Textarea
                                        label={t('limits.invoiceAmountRub')}
                                        value={invoiceAmountRub}
                                        onChange={(e) => { setInvoiceAmountRub(e.target.value) }}
                                        minRows={1}
                                        required
                                        disabled={busy}
                                    />
                                )}

                                {amountMode === 'average_monthly' && (
                                    <Text text={t('limits.averageMonthlyHint')} size="s" />
                                )}

                                <Check
                                    checked={sendViaEdo}
                                    onChange={(e) => { setSendViaEdo(e.target.checked) }}
                                    label={String(t('invoice.sendViaEdo'))}
                                    disabled={busy}
                                />
                            </>
                        )}
                    </VStack>
                )}

                <HStack gap="8" max justify="end">
                    <Button variant="clear" onClick={onClose} disabled={busy}>
                        {t('invoice.cancel')}
                    </Button>
                    <Button
                        variant="glass-action"
                        onClick={() => { void handleSubmit() }}
                        disabled={busy || !canSubmit}
                    >
                        {busy ? t('limits.saving') : t('Сохранить')}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    )
})
