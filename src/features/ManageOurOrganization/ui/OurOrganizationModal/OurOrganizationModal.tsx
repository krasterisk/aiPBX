import { memo, useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Check } from '@/shared/ui/mui/Check'
import {
    useCreateOurOrganizationMutation,
    useUpdateOurOrganizationMutation,
    type OurOrganization,
} from '@/entities/OurOrganization'
import {
    useLazyLookupCounterpartyQuery,
    applyCounterpartyToForm,
    clearLookupPopulatedFields,
    isValidOrganizationKpp,
    normalizeOrganizationInn,
    normalizeOrganizationKpp,
} from '@/entities/Organization'
import type { CounterpartyLookupItem, CounterpartyLookupResponse } from '@/entities/Organization'
import { isPaymentOrganizationsTabVisible } from '@/shared/lib/domain'
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce'
import { Building2 } from 'lucide-react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './OurOrganizationModal.module.scss'

interface OurOrganizationModalProps {
    className?: string
    isOpen: boolean
    onClose: () => void
    organization?: OurOrganization
}

type LookupUiState = 'idle' | 'loading' | 'ok' | 'choose' | 'requires_kpp' | 'failed'

const emptyFields = {
    kpp: '',
    ogrn: '',
    legalForm: 'ul' as 'ul' | 'ip',
    director: '',
    isPrimary: false,
    bankName: '',
    bankBranchName: '',
    bankBic: '',
    bankAccount: '',
    bankCorrAccount: '',
}

export const OurOrganizationModal = memo((props: OurOrganizationModalProps) => {
    const { className, isOpen, onClose, organization } = props
    const { t } = useTranslation('admin')
    const sbisEnabled = isPaymentOrganizationsTabVisible()

    const [createOrg, { isLoading: isCreating }] = useCreateOurOrganizationMutation()
    const [updateOrg, { isLoading: isUpdating }] = useUpdateOurOrganizationMutation()
    const [lookupCounterparty, { isFetching: isLookupLoading }] = useLazyLookupCounterpartyQuery()

    const [name, setName] = useState('')
    const [tin, setTin] = useState('')
    const [address, setAddress] = useState('')
    const [extra, setExtra] = useState(emptyFields)
    const [lookupState, setLookupState] = useState<LookupUiState>('idle')
    const [candidates, setCandidates] = useState<CounterpartyLookupItem[]>([])
    const lookupRequestId = useRef(0)

    const innDigits = normalizeOrganizationInn(tin)
    const kppDigits = normalizeOrganizationKpp(extra.kpp)
    const isLegalEntityInn = innDigits.length === 10
    const kppRequired = sbisEnabled && isLegalEntityInn &&
        (lookupState === 'requires_kpp' || !!kppDigits || lookupState === 'choose')

    const legalOptions = useMemo(() => [
        { label: t('ourOrg.form.legalForm.ul'), value: 'ul' as const },
        { label: t('ourOrg.form.legalForm.ip'), value: 'ip' as const },
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
            toast.success(t('ourOrg.form.lookupSuccess'))
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

        const digits = normalizeOrganizationInn(innRaw)
        if (digits.length !== 10 && digits.length !== 12) return

        const kpp = kppRaw ? normalizeOrganizationKpp(kppRaw) : ''
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
            toast.info(t('ourOrg.form.lookupFailed'))
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
                legalForm: organization.legalForm || 'ul',
                director: organization.director || '',
                isPrimary: organization.isPrimary,
                bankName: organization.bankName || '',
                bankBranchName: organization.bankBranchName || '',
                bankBic: organization.bankBic || '',
                bankAccount: organization.bankAccount || '',
                bankCorrAccount: organization.bankCorrAccount || '',
            })
            setLookupState('idle')
            setCandidates([])
        } else if (!organization && isOpen) {
            setName('')
            setTin('')
            setAddress('')
            setExtra({ ...emptyFields })
            setLookupState('idle')
            setCandidates([])
        }
    }, [organization, isOpen])

    const innHint = useMemo(() => {
        if (!sbisEnabled || !innDigits) return sbisEnabled ? t('ourOrg.form.innHint') : null
        if (innDigits.length === 10 || innDigits.length === 12) return null
        const target = innDigits.length < 10 ? 10 : 12
        const remaining = target - innDigits.length
        return t('ourOrg.form.innHintIncomplete', { count: remaining })
    }, [innDigits, t, sbisEnabled])

    const handleSubmit = useCallback(async () => {
        const body = {
            name: name.trim(),
            tin: innDigits,
            address: address.trim(),
            legalForm: extra.legalForm,
            kpp: extra.kpp || null,
            ogrn: extra.ogrn || null,
            director: extra.director || null,
            isPrimary: extra.isPrimary,
            bankName: extra.bankName.trim() || null,
            bankBranchName: extra.bankBranchName.trim() || null,
            bankBic: extra.bankBic.replace(/\D/g, '') || null,
            bankAccount: extra.bankAccount.replace(/\D/g, '') || null,
            bankCorrAccount: extra.bankCorrAccount.replace(/\D/g, '') || null,
        }
        try {
            if (organization) {
                await updateOrg({ id: organization.id, body }).unwrap()
            } else {
                await createOrg(body).unwrap()
            }
            onClose()
        } catch (e) {
            console.error(e)
        }
    }, [createOrg, updateOrg, organization, name, innDigits, address, extra, onClose])

    const isLoading = isCreating || isUpdating
    const selectedLegal = legalOptions.find((o) => o.value === extra.legalForm) || legalOptions[0]
    const hasValidKpp = !sbisEnabled || !isLegalEntityInn || isValidOrganizationKpp(kppDigits, innDigits)
    const canSubmit = !!name.trim() && !!innDigits && !!address.trim() && hasValidKpp

    return (
        <Modal className={classNames('', {}, [className])} isOpen={isOpen} onClose={onClose}>
            <VStack gap="16" max>
                <HStack gap="8" align="center">
                    <Building2 size={22} />
                    <Text
                        title={organization ? t('ourOrg.editTitle') : t('ourOrg.createTitle')}
                        bold
                    />
                </HStack>

                <Text text={t('ourOrg.form.hint')} size="xs" variant="accent" />

                <VStack gap="8" max>
                    <Textarea
                        label={t('ourOrg.table.inn')}
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
                        disabled={isLoading || isLookupLoading}
                        minRows={1}
                    />
                    {sbisEnabled && innHint && (
                        <Text text={innHint} size="s" className={cls.lookupHint} />
                    )}
                    {sbisEnabled && (isLookupLoading || lookupState === 'loading') && (
                        <Text text={t('ourOrg.form.lookupLoading')} size="s" className={cls.lookupHint} />
                    )}
                    {sbisEnabled && lookupState === 'requires_kpp' && (
                        <div className={classNames(cls.lookupStatus, {}, [cls.lookupHintWarn])}>
                            <Text text={t('ourOrg.form.lookupRequiresKpp')} size="s" />
                        </div>
                    )}
                    {sbisEnabled && lookupState === 'choose' && candidates.length > 0 && (
                        <VStack gap="8" max className={cls.lookupStatus}>
                            <Text text={t('ourOrg.form.chooseBranch')} size="s" />
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
                                    ? `${t('ourOrg.table.kpp')} *`
                                    : String(t('ourOrg.table.kpp'))
                            }
                            value={extra.kpp}
                            onChange={(e) => {
                                const v = e.target.value
                                setExtra((s) => ({ ...s, kpp: v }))
                                const digits = normalizeOrganizationKpp(v)
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
                                    ? t('ourOrg.form.kppRequired')
                                    : t('ourOrg.form.kppHint')
                            }
                            size="s"
                            className={classNames(cls.lookupHint, {
                                [cls.lookupHintWarn]: lookupState === 'requires_kpp',
                            })}
                        />
                        <Combobox
                            label={String(t('ourOrg.form.legalForm.label'))}
                            options={legalOptions}
                            value={selectedLegal}
                            onChange={(_e, v) => {
                                if (v?.value) {
                                    setExtra((s) => ({ ...s, legalForm: v.value }))
                                }
                            }}
                            getOptionLabel={(o) => o.label}
                            isOptionEqualToValue={(a, b) => a.value === b.value}
                            disabled={isLoading}
                        />
                    </VStack>
                )}

                {sbisEnabled && !isLegalEntityInn && innDigits.length === 12 && (
                    <Combobox
                        label={String(t('ourOrg.form.legalForm.label'))}
                        options={legalOptions}
                        value={selectedLegal}
                        onChange={(_e, v) => {
                            if (v?.value) {
                                setExtra((s) => ({ ...s, legalForm: v.value }))
                            }
                        }}
                        getOptionLabel={(o) => o.label}
                        isOptionEqualToValue={(a, b) => a.value === b.value}
                        disabled={isLoading}
                    />
                )}

                <VStack gap="8" max>
                    <Textarea
                        label={t('Name')}
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                        disabled={isLoading}
                        minRows={1}
                    />
                    <Textarea
                        label={t('ourOrg.table.address')}
                        value={address}
                        onChange={(e) => { setAddress(e.target.value) }}
                        disabled={isLoading}
                        minRows={2}
                    />
                    {sbisEnabled && (
                        <Textarea
                            label={t('ourOrg.form.director')}
                            value={extra.director}
                            onChange={(e) => { setExtra((s) => ({ ...s, director: e.target.value })) }}
                            disabled={isLoading}
                            minRows={1}
                        />
                    )}
                </VStack>

                {sbisEnabled && (
                    <Textarea
                        label={t('ourOrg.form.ogrn')}
                        value={extra.ogrn}
                        onChange={(e) => { setExtra((s) => ({ ...s, ogrn: e.target.value })) }}
                        disabled={isLoading}
                        minRows={1}
                    />
                )}

                <Text text={t('ourOrg.form.bankSection')} size="s" bold />

                <Textarea
                    label={t('ourOrg.form.bankName')}
                    value={extra.bankName}
                    onChange={(e) => { setExtra((s) => ({ ...s, bankName: e.target.value })) }}
                    disabled={isLoading}
                />

                <Textarea
                    label={t('ourOrg.form.bankBranchName')}
                    value={extra.bankBranchName}
                    onChange={(e) => { setExtra((s) => ({ ...s, bankBranchName: e.target.value })) }}
                    disabled={isLoading}
                />

                <Textarea
                    label={t('ourOrg.form.bankBic')}
                    value={extra.bankBic}
                    onChange={(e) => { setExtra((s) => ({ ...s, bankBic: e.target.value })) }}
                    disabled={isLoading}
                />

                <Textarea
                    label={t('ourOrg.form.bankAccount')}
                    value={extra.bankAccount}
                    onChange={(e) => { setExtra((s) => ({ ...s, bankAccount: e.target.value })) }}
                    disabled={isLoading}
                />

                <Textarea
                    label={t('ourOrg.form.bankCorrAccount')}
                    value={extra.bankCorrAccount}
                    onChange={(e) => { setExtra((s) => ({ ...s, bankCorrAccount: e.target.value })) }}
                    disabled={isLoading}
                />

                <Check
                    checked={extra.isPrimary}
                    onChange={(e) => { setExtra((s) => ({ ...s, isPrimary: e.target.checked })) }}
                    label={t('ourOrg.form.isPrimary') ?? ''}
                    disabled={isLoading}
                />

                {sbisEnabled && !hasValidKpp && isLegalEntityInn && (
                    <Text text={t('ourOrg.form.kppRequired')} size="s" className={cls.lookupHintWarn} />
                )}

                <HStack justify="end" gap="16" max wrap="wrap">
                    <Button onClick={onClose} variant="clear" disabled={isLoading}>
                        {t('Cancel')}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="glass-action"
                        disabled={!canSubmit || isLoading}
                    >
                        {organization ? t('Save') : t('Create')}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    )
})
