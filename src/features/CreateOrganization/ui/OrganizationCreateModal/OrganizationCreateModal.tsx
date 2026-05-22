import { memo, useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Check } from '@/shared/ui/mui/Check'
import {
    useCreateOrganizationMutation,
    useUpdateOrganizationMutation,
    useCheckEdoRouteMutation,
    useLazyLookupCounterpartyQuery,
    Organization,
    getOrganizationEdoStatusLabel,
    applyCounterpartyToForm,
    clearLookupPopulatedFields,
    isValidOrganizationKpp,
    normalizeOrganizationInn,
    normalizeOrganizationKpp,
} from '@/entities/Organization'
import type { CounterpartyLookupItem, CounterpartyLookupResponse } from '@/entities/Organization'

import { isPaymentOrganizationsTabVisible } from '@/shared/lib/domain'

import { useGetOrganizationDefaultSubjectQuery } from '@/entities/OrganizationDocument'
import { ClientSelect, isUserAdmin } from '@/entities/User'
import { classNames } from '@/shared/lib/classNames/classNames'
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce'
import { Building2, ChevronDown, ChevronUp } from 'lucide-react'
import cls from './OrganizationCreateModal.module.scss'

interface OrganizationCreateModalProps {
    className?: string
    isOpen: boolean
    onClose: () => void
    userId: string
    organization?: Organization
    onCreatedForTenant?: (tenantUserId: string) => void
}

type LookupUiState = 'idle' | 'loading' | 'ok' | 'choose' | 'requires_kpp' | 'failed'

const emptyOrgFields = {
    kpp: '',
    ogrn: '',
    legalForm: '' as '' | 'ul' | 'ip',
    director: '',
    email: '',
    phone: '',
    subject: '',
}

const normalizeInn = normalizeOrganizationInn
const normalizeKpp = normalizeOrganizationKpp
const normalizeUserId = (value: string | number | null | undefined) => String(value ?? '')

export const OrganizationCreateModal = memo((props: OrganizationCreateModalProps) => {
    const { className, isOpen, onClose, userId, organization, onCreatedForTenant } = props
    const { t } = useTranslation('payment')
    const isAdmin = useSelector(isUserAdmin)
    const sbisEnabled = isPaymentOrganizationsTabVisible()

    const [createOrganization, { isLoading: isCreating }] = useCreateOrganizationMutation()
    const [updateOrganization, { isLoading: isUpdating }] = useUpdateOrganizationMutation()
    const [lookupCounterparty, { isFetching: isLookupLoading }] = useLazyLookupCounterpartyQuery()
    const { data: defaultSubjectRes } = useGetOrganizationDefaultSubjectQuery(undefined, {
        skip: !isOpen || !isAdmin,
    })

    const [name, setName] = useState('')
    const [tin, setTin] = useState('')
    const [address, setAddress] = useState('')
    const [extra, setExtra] = useState(emptyOrgFields)
    const [selectedClientId, setSelectedClientId] = useState('')
    const [advancedOpen, setAdvancedOpen] = useState(false)
    const [lookupState, setLookupState] = useState<LookupUiState>('idle')
    const [candidates, setCandidates] = useState<CounterpartyLookupItem[]>([])
    const [edoParticipantId, setEdoParticipantId] = useState('')
    const [sendEdoInvitation, setSendEdoInvitation] = useState(false)
    const [edoStatusAfterCheck, setEdoStatusAfterCheck] = useState<Organization['edo'] | null>(null)
    const lookupRequestId = useRef(0)

    const [checkEdoRoute, { isLoading: isCheckingEdoStatus }] = useCheckEdoRouteMutation()

    const innDigits = normalizeInn(tin)
    const kppDigits = normalizeKpp(extra.kpp)
    const isLegalEntityInn = innDigits.length === 10
    const kppRequired = sbisEnabled && isLegalEntityInn &&
        (lookupState === 'requires_kpp' || !!kppDigits || lookupState === 'choose')

    const legalOptions = useMemo(() => [
        { label: t('organization.form.legalForm.ul'), value: 'ul' as const },
        { label: t('organization.form.legalForm.ip'), value: 'ip' as const },
    ], [t])

    const applyLookupResult = useCallback((
        response: CounterpartyLookupResponse,
        requestId: number,
    ) => {
        if (requestId !== lookupRequestId.current) return

        if (response.status === 'single') {
            applyCounterpartyToForm(response.data, setName, setAddress, setExtra)
            setCandidates([])
            setLookupState('ok')
            toast.success(t('organization.form.lookupSuccess'))
            return
        }
        if (response.status === 'choose') {
            setCandidates(response.candidates)
            setLookupState('choose')
            setExtra((s) => ({ ...s, legalForm: 'ul' }))
            return
        }
        if (response.status === 'requires_kpp') {
            setCandidates([])
            setLookupState('requires_kpp')
            setExtra((s) => ({
                ...s,
                legalForm: 'ul',
                kpp: s.kpp && isValidOrganizationKpp(s.kpp, innDigits) ? s.kpp : '',
            }))
        }
    }, [t, innDigits])

    const runLookup = useCallback(async (innRaw: string, kppRaw?: string) => {
        if (!sbisEnabled) return

        const digits = normalizeInn(innRaw)
        if (digits.length !== 10 && digits.length !== 12) return

        const kpp = kppRaw ? normalizeKpp(kppRaw) : ''
        if (digits.length === 10 && kpp && !isValidOrganizationKpp(kpp, digits)) return
        if (digits.length === 10 && kpp && kpp.length !== 9) return

        const requestId = ++lookupRequestId.current
        clearLookupPopulatedFields(setName, setAddress, setExtra, { keepKpp: kpp.length === 9 })
        setLookupState('loading')

        try {
            const response = await lookupCounterparty({
                inn: digits,
                ...(kpp.length === 9 ? { kpp } : {}),
            }).unwrap()
            applyLookupResult(response, requestId)
        } catch {
            if (requestId !== lookupRequestId.current) return
            setCandidates([])
            setLookupState('failed')
            toast.info(t('organization.form.lookupFailed'))
        }
    }, [lookupCounterparty, applyLookupResult, t, sbisEnabled])

    const debouncedInnLookup = useDebounce((innRaw: string) => {
        void runLookup(innRaw)
    }, 500)

    const debouncedKppLookup = useDebounce((innRaw: string, kppRaw: string) => {
        void runLookup(innRaw, kppRaw)
    }, 500)

    const handleSelectCandidate = useCallback(async (candidate: CounterpartyLookupItem) => {
        applyCounterpartyToForm(candidate, setName, setAddress, setExtra)
        setCandidates([])
        setLookupState('loading')
        if (candidate.kpp) {
            await runLookup(candidate.inn, candidate.kpp)
        } else {
            setLookupState('requires_kpp')
        }
    }, [runLookup])

    useEffect(() => {
        if (organization && isOpen) {
            setName(organization.name)
            setTin(organization.tin)
            setAddress(organization.address)
            setExtra({
                kpp: organization.kpp || '',
                ogrn: organization.ogrn || '',
                legalForm: (organization.legalForm as 'ul' | 'ip') || 'ul',
                director: organization.director || '',
                email: organization.email || '',
                phone: organization.phone || '',
                subject: organization.subject || '',
            })
            setSelectedClientId(normalizeUserId(organization.userId ?? userId))
            setEdoParticipantId(organization.edoParticipantId || '')
            setSendEdoInvitation(false)
            setEdoStatusAfterCheck(null)
            setLookupState('idle')
            setCandidates([])
        } else if (!organization && isOpen) {
            setName('')
            setTin('')
            setAddress('')
            setExtra({ ...emptyOrgFields, legalForm: 'ul' })
            setSelectedClientId(normalizeUserId(userId))
            setAdvancedOpen(false)
            setLookupState('idle')
            setCandidates([])
            setEdoParticipantId('')
            setSendEdoInvitation(false)
        }
    }, [organization, isOpen, userId])

    const innHint = useMemo(() => {
        if (!sbisEnabled || !innDigits) return sbisEnabled ? t('organization.form.innHint') : null
        if (innDigits.length === 10 || innDigits.length === 12) return null
        const target = innDigits.length < 10 ? 10 : 12
        const remaining = target - innDigits.length
        return t('organization.form.innHintIncomplete', { count: remaining })
    }, [innDigits, t, sbisEnabled])

    const subjectPlaceholder = defaultSubjectRes?.defaultSubject || ''

    const buildSharedOrgPayload = useCallback(() => {
        const lf = extra.legalForm || (innDigits.length === 12 ? 'ip' : 'ul')
        return {
            name,
            tin,
            address,
            legalForm: lf,
            kpp: sbisEnabled ? (extra.kpp || null) : null,
            ogrn: sbisEnabled ? (extra.ogrn || null) : null,
            director: sbisEnabled ? (extra.director || null) : null,
            email: sbisEnabled ? (extra.email || null) : null,
            phone: sbisEnabled ? (extra.phone || null) : null,
            bankAccount: null,
            bankBic: null,
            bankName: null,
            ...(isAdmin && sbisEnabled ? { subject: extra.subject?.trim() || null } : {}),
        }
    }, [name, tin, address, extra, innDigits, isAdmin, sbisEnabled])

    const handleCheckEdoStatus = useCallback(async () => {
        if (!organization || !isAdmin) return

        const edoId = edoParticipantId.trim()
        if (!edoId) {
            toast.error(t('organization.form.edoCheckRequiresId'))
            return
        }

        try {
            const savedId = (organization.edoParticipantId || '').trim()
            if (edoId !== savedId) {
                await updateOrganization({
                    id: organization.id,
                    ...buildSharedOrgPayload(),
                    edoParticipantId: edoId,
                }).unwrap()
            }

            const result = await checkEdoRoute({ organizationId: organization.id }).unwrap()
            setEdoStatusAfterCheck(result.edo ?? null)

            const code = result.edo?.edoInvitationStateCode
            if (result.edo?.edoReady || code === 7) {
                toast.success(t('organization.form.edoCheckConnected'))
            } else if (code === 2) {
                toast.info(
                    result.source === 'probe'
                        ? t('organization.form.edoCheckProbePending')
                        : t('organization.form.edoCheckPending'),
                )
            } else {
                toast.warning(t('organization.form.edoCheckNotFound'))
            }
        } catch (e: unknown) {
            const apiMessage = (e as { data?: { message?: string | string[] } })?.data?.message
            const msg = Array.isArray(apiMessage)
                ? apiMessage.join('; ')
                : (typeof apiMessage === 'string' ? apiMessage : null)
            toast.error(msg || t('organization.form.edoCheckFailed'))
            console.error(e)
        }
    }, [
        organization,
        isAdmin,
        edoParticipantId,
        buildSharedOrgPayload,
        updateOrganization,
        checkEdoRoute,
        t,
    ])

    const handleSubmit = useCallback(async () => {
        try {
            const shared = buildSharedOrgPayload()

            if (organization) {
                await updateOrganization({
                    id: organization.id,
                    ...shared,
                    ...(isAdmin && sbisEnabled && edoParticipantId.trim()
                        ? { edoParticipantId: edoParticipantId.trim() }
                        : {}),
                }).unwrap()
            } else {
                const ownerId = isAdmin ? normalizeUserId(selectedClientId).trim() : normalizeUserId(userId)
                if (isAdmin && !ownerId) return

                const result = await createOrganization({
                    ...shared,
                    ...(isAdmin ? { ownerUserId: Number(ownerId) } : {}),
                    ...(sbisEnabled && sendEdoInvitation ? {
                        edoParticipantId: edoParticipantId.trim(),
                        sendEdoInvitation: true,
                    } : {}),
                }).unwrap()

                if (isAdmin && onCreatedForTenant) {
                    onCreatedForTenant(ownerId)
                }

                if (result.edo?.success === false) {
                    toast.error(
                        t('organization.form.edoCreatePartial', { error: result.edo.error }),
                    )
                    return
                }

                if (sendEdoInvitation && result.edo?.success) {
                    toast.success(t('organization.form.edoInviteSent'))
                }
            }

            onClose()
            setName('')
            setTin('')
            setAddress('')
            setExtra({ ...emptyOrgFields, legalForm: 'ul' })
            setSelectedClientId(normalizeUserId(userId))
            setLookupState('idle')
            setCandidates([])
            setEdoParticipantId('')
            setSendEdoInvitation(false)
        } catch (e: unknown) {
            const apiMessage = (e as { data?: { message?: string | string[] } })?.data?.message
            const msg = Array.isArray(apiMessage)
                ? apiMessage.join('; ')
                : (typeof apiMessage === 'string' ? apiMessage : null)
            if (msg) toast.error(msg)
            console.error(e)
        }
    }, [
        createOrganization,
        updateOrganization,
        organization,
        userId,
        name,
        tin,
        address,
        extra,
        innDigits,
        onClose,
        isAdmin,
        selectedClientId,
        onCreatedForTenant,
        sbisEnabled,
        edoParticipantId,
        sendEdoInvitation,
        buildSharedOrgPayload,
    ])

    const isLoading = isCreating || isUpdating || isCheckingEdoStatus
    const adminEditEdoOrg: Organization | null = organization
        ? {
            ...organization,
            edoParticipantId: edoParticipantId.trim() || organization.edoParticipantId,
            edoInvitationStateCode:
                edoStatusAfterCheck?.edoInvitationStateCode ?? organization.edoInvitationStateCode,
            edoInvitationId: edoStatusAfterCheck?.edoInvitationId ?? organization.edoInvitationId,
            edo: edoStatusAfterCheck ?? organization.edo,
        }
        : null
    const selectedLegal = legalOptions.find((o) => o.value === (extra.legalForm || 'ul')) || legalOptions[0]
    const canSubmitCreateAsAdmin = !isAdmin || !!normalizeUserId(selectedClientId).trim()
    const hasValidKpp = !sbisEnabled || !isLegalEntityInn || isValidOrganizationKpp(kppDigits, innDigits)
    const edoIdRequired = sbisEnabled && !organization && sendEdoInvitation
    const canSubmit = !!name.trim() && !!innDigits && !!address.trim() && canSubmitCreateAsAdmin && hasValidKpp &&
        (!edoIdRequired || !!edoParticipantId.trim())

    return (
        <Modal
            className={classNames('', {}, [className])}
            isOpen={isOpen}
            onClose={onClose}
        >
            <VStack gap="16" max>
                <HStack gap="8" align="center">
                    <Building2 size={22} />
                    <Text
                        title={organization ? t('Редактировать организацию') : t('Добавить организацию')}
                        bold
                    />
                </HStack>

                {isAdmin && !organization && (
                    <ClientSelect
                        label={String(t('organization.form.client'))}
                        clientId={selectedClientId}
                        onChangeClient={(id) => { setSelectedClientId(normalizeUserId(id)) }}
                    />
                )}

                <VStack gap="8" max>
                    <Textarea
                        label={t('ИНН') || ''}
                        value={tin}
                        onChange={(e) => {
                            const v = e.target.value
                            setTin(v)
                            if (sbisEnabled) {
                                setLookupState('idle')
                                setCandidates([])
                                clearLookupPopulatedFields(setName, setAddress, setExtra)
                                debouncedInnLookup(v)
                            }
                        }}
                        disabled={isLoading}
                        minRows={1}
                    />
                    {sbisEnabled && innHint && (
                        <Text text={innHint} size="s" className={cls.lookupHint} />
                    )}
                    {sbisEnabled && (isLookupLoading || lookupState === 'loading') && (
                        <Text text={t('organization.form.lookupLoading')} size="s" className={cls.lookupHint} />
                    )}
                    {sbisEnabled && lookupState === 'requires_kpp' && (
                        <div className={classNames(cls.lookupStatus, {}, [cls.lookupHintWarn])}>
                            <Text text={t('organization.form.lookupRequiresKpp')} size="s" />
                        </div>
                    )}
                    {sbisEnabled && lookupState === 'choose' && candidates.length > 0 && (
                        <VStack gap="8" max className={cls.lookupStatus}>
                            <Text text={t('organization.form.chooseBranch')} size="s" />
                            <div className={cls.candidateList}>
                                {candidates.map((c) => (
                                    <Button
                                        key={`${c.kpp || 'no-kpp'}-${c.name}`}
                                        variant="outline"
                                        className={cls.candidateBtn}
                                        onClick={() => { void handleSelectCandidate(c) }}
                                        disabled={isLoading || isLookupLoading}
                                    >
                                        {c.name}{c.kpp ? ` · КПП ${c.kpp}` : ''}
                                    </Button>
                                ))}
                            </div>
                        </VStack>
                    )}
                </VStack>

                {sbisEnabled && isLegalEntityInn && (
                    <VStack gap="8" max>
                        <Textarea
                            label={
                                kppRequired
                                    ? `${t('organization.form.kpp')} *`
                                    : String(t('organization.form.kpp'))
                            }
                            value={extra.kpp}
                            onChange={(e) => {
                                const v = e.target.value
                                setExtra((s) => ({ ...s, kpp: v }))
                                const digits = normalizeKpp(v)
                                if (digits.length === 9 && isValidOrganizationKpp(digits, tin)) {
                                    debouncedKppLookup(tin, v)
                                }
                            }}
                            disabled={isLoading}
                            minRows={1}
                        />
                        <Text
                            text={
                                lookupState === 'requires_kpp'
                                    ? t('organization.form.kppRequired')
                                    : t('organization.form.kppHint')
                            }
                            size="s"
                            className={classNames(cls.lookupHint, {
                                [cls.lookupHintWarn]: lookupState === 'requires_kpp',
                            })}
                        />

                        <Combobox
                            label={String(t('organization.form.legalForm'))}
                            options={legalOptions}
                            getOptionLabel={(o) => o.label}
                            isOptionEqualToValue={(a, b) => a.value === b.value}
                            value={selectedLegal}
                            onChange={(_, v) => {
                                setExtra((s) => ({ ...s, legalForm: (v?.value || 'ul') as 'ul' | 'ip' }))
                            }}
                        />
                    </VStack>
                )}

                {sbisEnabled && !isLegalEntityInn && innDigits.length === 12 && (
                    <Combobox
                        label={String(t('organization.form.legalForm'))}
                        options={legalOptions}
                        getOptionLabel={(o) => o.label}
                        isOptionEqualToValue={(a, b) => a.value === b.value}
                        value={selectedLegal}
                        onChange={(_, v) => {
                            setExtra((s) => ({ ...s, legalForm: (v?.value || 'ip') as 'ul' | 'ip' }))
                        }}
                    />
                )}

                <VStack gap="8" max>
                    <Textarea
                        label={t('Наименование') || ''}
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                        disabled={isLoading}
                        minRows={1}
                    />
                    <Textarea
                        label={t('Адрес') || ''}
                        value={address}
                        onChange={(e) => { setAddress(e.target.value) }}
                        disabled={isLoading}
                    />
                    {sbisEnabled && (
                        <Textarea
                            label={t('organization.form.email')}
                            value={extra.email}
                            onChange={(e) => { setExtra((s) => ({ ...s, email: e.target.value })) }}
                            disabled={isLoading}
                            minRows={1}
                        />
                    )}
                </VStack>

                {sbisEnabled && (
                    <>
                        <Button
                            variant="clear"
                            onClick={() => { setAdvancedOpen((o) => !o) }}
                            addonLeft={advancedOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        >
                            {t('organization.form.advanced')}
                        </Button>

                        {advancedOpen && (
                            <VStack gap="12" max>
                                <Textarea
                                    label={t('organization.form.ogrn')}
                                    value={extra.ogrn}
                                    onChange={(e) => { setExtra((s) => ({ ...s, ogrn: e.target.value })) }}
                                    disabled={isLoading}
                                    minRows={1}
                                />

                                <Textarea
                                    label={t('organization.form.director')}
                                    value={extra.director}
                                    onChange={(e) => { setExtra((s) => ({ ...s, director: e.target.value })) }}
                                    disabled={isLoading}
                                    minRows={1}
                                />

                                <Textarea
                                    label={t('organization.form.phone')}
                                    value={extra.phone}
                                    onChange={(e) => { setExtra((s) => ({ ...s, phone: e.target.value })) }}
                                    disabled={isLoading}
                                    minRows={1}
                                />

                                {isAdmin && (
                                    <>
                                        <Textarea
                                            label={t('organization.form.subject')}
                                            placeholder={subjectPlaceholder}
                                            value={extra.subject}
                                            onChange={(e) => { setExtra((s) => ({ ...s, subject: e.target.value })) }}
                                            disabled={isLoading}
                                            minRows={2}
                                        />
                                        <Text text={t('organization.form.subjectHint')} size="s" />
                                    </>
                                )}
                            </VStack>
                        )}
                    </>
                )}

                {sbisEnabled && !hasValidKpp && isLegalEntityInn && (
                    <Text text={t('organization.form.kppRequired')} size="s" className={cls.lookupHintWarn} />
                )}

                {sbisEnabled && isAdmin && organization && (
                    <VStack gap="8" max>
                        <Text text={t('organization.form.edoSection')} size="s" bold />
                        <HStack gap="8" max align="end" className={cls.edoIdRow}>
                            <Textarea
                                label={String(t('organization.form.edoParticipantId'))}
                                value={edoParticipantId}
                                onChange={(e) => { setEdoParticipantId(e.target.value) }}
                                disabled={isLoading}
                                minRows={1}
                            />
                            <Button
                                className={cls.edoCheckBtn}
                                variant="outline"
                                onClick={() => { void handleCheckEdoStatus() }}
                                disabled={isLoading || !edoParticipantId.trim()}
                            >
                                {t('organization.form.edoCheckStatus')}
                            </Button>
                        </HStack>
                        <Text
                            text={t('organization.form.edoCheckHint')}
                            size="xs"
                            className={cls.lookupHint}
                        />
                        {adminEditEdoOrg && (
                            <Text
                                text={`${t('organization.table.edoStatus')}: ${getOrganizationEdoStatusLabel(adminEditEdoOrg, t)}`}
                                size="s"
                            />
                        )}
                    </VStack>
                )}

                {sbisEnabled && !organization && (
                    <VStack gap="8" max>
                        <Text text={t('organization.form.edoSection')} size="s" bold />
                        <Check
                            checked={sendEdoInvitation}
                            onChange={(e) => {
                                const checked = e.target.checked
                                setSendEdoInvitation(checked)
                                if (!checked) setEdoParticipantId('')
                            }}
                            label={String(t('organization.form.connectEdo'))}
                            disabled={isLoading}
                        />
                        {sendEdoInvitation && (
                            <>
                                <Textarea
                                    label={`${t('organization.form.edoParticipantId')} *`}
                                    value={edoParticipantId}
                                    onChange={(e) => { setEdoParticipantId(e.target.value) }}
                                    disabled={isLoading}
                                    minRows={1}
                                />
                                <Text
                                    text={t('organization.form.edoParticipantIdHint')}
                                    size="xs"
                                    className={cls.lookupHint}
                                />
                            </>
                        )}
                        <Text text={t('organization.form.connectEdoHint')} size="xs" className={cls.lookupHint} />
                    </VStack>
                )}

                <HStack gap="8" max justify="end">
                    <Button onClick={onClose} variant="clear">
                        {t('Отмена')}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !canSubmit}
                        variant="glass-action"
                    >
                        {t('Сохранить')}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    )
})
