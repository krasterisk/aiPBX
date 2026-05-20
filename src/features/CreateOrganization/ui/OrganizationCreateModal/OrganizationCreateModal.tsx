import { memo, useState, useCallback, useEffect, useMemo } from 'react'

import { useTranslation } from 'react-i18next'

import { useSelector } from 'react-redux'

import { toast } from 'react-toastify'

import { Modal } from '@/shared/ui/redesigned/Modal'

import { VStack, HStack } from '@/shared/ui/redesigned/Stack'

import { Text } from '@/shared/ui/redesigned/Text'

import { Button } from '@/shared/ui/redesigned/Button'

import { Textarea } from '@/shared/ui/mui/Textarea'

import { Combobox } from '@/shared/ui/mui/Combobox'

import {
    useCreateOrganizationMutation,
    useUpdateOrganizationMutation,
    useLazyLookupCounterpartyQuery,
    Organization,
} from '@/entities/Organization'

import { useGetOrganizationDefaultSubjectQuery } from '@/entities/OrganizationDocument'

import { ClientSelect, isUserAdmin } from '@/entities/User'

import { classNames } from '@/shared/lib/classNames/classNames'

import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce'

import { Building2, ChevronDown, ChevronUp } from 'lucide-react'

interface OrganizationCreateModalProps {

    className?: string

    isOpen: boolean

    onClose: () => void

    userId: string

    organization?: Organization

    onCreatedForTenant?: (tenantUserId: string) => void

}

const emptyOrgFields = {

    kpp: '',

    ogrn: '',

    legalForm: '' as '' | 'ul' | 'ip',

    director: '',

    email: '',

    phone: '',

    subject: '',

}

const normalizeInn = (value: string) => value.replace(/\D/g, '')

const normalizeUserId = (value: string | number | null | undefined) => String(value ?? '')

export const OrganizationCreateModal = memo((props: OrganizationCreateModalProps) => {
    const { className, isOpen, onClose, userId, organization, onCreatedForTenant } = props

    const { t } = useTranslation('payment')

    const isAdmin = useSelector(isUserAdmin)

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

    const legalOptions = useMemo(() => [

        { label: t('organization.form.legalForm.ul'), value: 'ul' as const },

        { label: t('organization.form.legalForm.ip'), value: 'ip' as const },

    ], [t])

    const runLookup = useCallback(async (innRaw: string) => {
        const digits = normalizeInn(innRaw)
        if (digits.length !== 10 && digits.length !== 12) return
        try {
            const data = await lookupCounterparty({ inn: digits }).unwrap()
            if (data.name) setName(data.name)
            if (data.address) setAddress(data.address)
            setExtra((s) => ({
                ...s,
                kpp: data.kpp || s.kpp,
                ogrn: data.ogrn || s.ogrn,
                legalForm: data.legalForm || s.legalForm || 'ul',
                director: data.director || s.director,
            }))
            toast.success(t('organization.form.lookupSuccess'))
        } catch {
            toast.info(t('organization.form.lookupFailed'))
        }
    }, [lookupCounterparty, t])

    const debouncedLookup = useDebounce((innRaw: string) => {
        void runLookup(innRaw)
    }, 500)

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
        } else if (!organization && isOpen) {
            setName('')

            setTin('')

            setAddress('')

            setExtra({ ...emptyOrgFields, legalForm: 'ul' })

            setSelectedClientId(normalizeUserId(userId))

            setAdvancedOpen(false)
        }
    }, [organization, isOpen, userId])

    const subjectPlaceholder = defaultSubjectRes?.defaultSubject || ''

    const handleSubmit = useCallback(async () => {
        try {
            const lf = extra.legalForm || 'ul'

            const shared = {

                name,

                tin,

                address,

                legalForm: lf,

                kpp: extra.kpp || null,

                ogrn: extra.ogrn || null,

                director: extra.director || null,

                email: extra.email || null,

                phone: extra.phone || null,

                bankAccount: null,

                bankBic: null,

                bankName: null,

                ...(isAdmin ? { subject: extra.subject?.trim() || null } : {}),

            }

            if (organization) {
                await updateOrganization({

                    id: organization.id,

                    ...shared,

                }).unwrap()
            } else {
                const ownerId = isAdmin ? normalizeUserId(selectedClientId).trim() : normalizeUserId(userId)

                if (isAdmin && !ownerId) {
                    return
                }

                await createOrganization({

                    ...shared,

                    ...(isAdmin ? { ownerUserId: Number(ownerId) } : {}),

                }).unwrap()

                if (isAdmin && onCreatedForTenant) {
                    onCreatedForTenant(ownerId)
                }
            }

            onClose()

            setName('')

            setTin('')

            setAddress('')

            setExtra({ ...emptyOrgFields, legalForm: 'ul' })

            setSelectedClientId(normalizeUserId(userId))
        } catch (e) {
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

        onClose,

        isAdmin,

        selectedClientId,

        onCreatedForTenant,

    ])

    const isLoading = isCreating || isUpdating

    const selectedLegal = legalOptions.find((o) => o.value === (extra.legalForm || 'ul')) || legalOptions[0]

    const canSubmitCreateAsAdmin = !isAdmin || !!normalizeUserId(selectedClientId).trim()

    const canSubmit = !!name.trim() && !!normalizeInn(tin) && !!address.trim() && canSubmitCreateAsAdmin

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

                <Textarea

                    label={t('ИНН') || ''}

                    value={tin}

                    onChange={(e) => {
                        const v = e.target.value
                        setTin(v)
                        debouncedLookup(v)
                    }}

                    disabled={isLoading}

                    minRows={1}

                />

                {isLookupLoading && (
                    <Text text={t('organization.form.lookupLoading')} size="s" />
                )}

                <Textarea

                    label={t('Наименование') || ''}

                    value={name}

                    onChange={(e) => { setName(e.target.value) }}

                    disabled={isLoading}

                    minRows={1}

                />

                <Textarea

                    label={t('organization.form.email')}

                    value={extra.email}

                    onChange={(e) => { setExtra((s) => ({ ...s, email: e.target.value })) }}

                    disabled={isLoading}

                    minRows={1}

                />

                <Button
                    variant="clear"
                    onClick={() => { setAdvancedOpen((o) => !o) }}
                    addonLeft={advancedOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                >
                    {t('organization.form.advanced')}
                </Button>

                {advancedOpen && (
                    <VStack gap="12" max>
                        <HStack gap="16" max wrap="wrap">
                            <Textarea

                                label={t('organization.form.kpp')}

                                value={extra.kpp}

                                onChange={(e) => { setExtra((s) => ({ ...s, kpp: e.target.value })) }}

                                disabled={isLoading}

                                minRows={1}

                            />

                            <Textarea

                                label={t('organization.form.ogrn')}

                                value={extra.ogrn}

                                onChange={(e) => { setExtra((s) => ({ ...s, ogrn: e.target.value })) }}

                                disabled={isLoading}

                                minRows={1}

                            />
                        </HStack>

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

                        <Textarea

                            label={t('Адрес') || ''}

                            value={address}

                            onChange={(e) => { setAddress(e.target.value) }}

                            disabled={isLoading}

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

                <HStack gap="8" max justify="end">

                    <Button

                        onClick={onClose}

                        variant="clear"

                    >

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
