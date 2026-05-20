import { memo, useState, useCallback, useEffect, useMemo } from 'react'
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
import { useLazyLookupCounterpartyQuery } from '@/entities/Organization'
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce'
import { Building2 } from 'lucide-react'
import { classNames } from '@/shared/lib/classNames/classNames'

interface OurOrganizationModalProps {
    className?: string
    isOpen: boolean
    onClose: () => void
    organization?: OurOrganization
}

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

const normalizeInn = (value: string) => value.replace(/\D/g, '')

export const OurOrganizationModal = memo((props: OurOrganizationModalProps) => {
    const { className, isOpen, onClose, organization } = props
    const { t } = useTranslation('admin')

    const [createOrg, { isLoading: isCreating }] = useCreateOurOrganizationMutation()
    const [updateOrg, { isLoading: isUpdating }] = useUpdateOurOrganizationMutation()
    const [lookupCounterparty, { isFetching: isLookupLoading }] = useLazyLookupCounterpartyQuery()

    const [name, setName] = useState('')
    const [tin, setTin] = useState('')
    const [address, setAddress] = useState('')
    const [extra, setExtra] = useState(emptyFields)

    const legalOptions = useMemo(() => [
        { label: t('ourOrg.form.legalForm.ul'), value: 'ul' as const },
        { label: t('ourOrg.form.legalForm.ip'), value: 'ip' as const },
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
            toast.success(t('ourOrg.form.lookupSuccess'))
        } catch {
            toast.info(t('ourOrg.form.lookupFailed'))
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
                legalForm: organization.legalForm || 'ul',
                director: organization.director || '',
                isPrimary: organization.isPrimary,
                bankName: organization.bankName || '',
                bankBranchName: organization.bankBranchName || '',
                bankBic: organization.bankBic || '',
                bankAccount: organization.bankAccount || '',
                bankCorrAccount: organization.bankCorrAccount || '',
            })
        } else if (!organization && isOpen) {
            setName('')
            setTin('')
            setAddress('')
            setExtra({ ...emptyFields })
        }
    }, [organization, isOpen])

    const handleSubmit = useCallback(async () => {
        const body = {
            name: name.trim(),
            tin: normalizeInn(tin),
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
    }, [createOrg, updateOrg, organization, name, tin, address, extra, onClose])

    const isLoading = isCreating || isUpdating
    const selectedLegal = legalOptions.find((o) => o.value === extra.legalForm) || legalOptions[0]
    const canSubmit = !!name.trim() && !!normalizeInn(tin) && !!address.trim()

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

                <Textarea
                    label={t('ourOrg.table.inn')}
                    value={tin}
                    onChange={(e) => {
                        const v = e.target.value
                        setTin(v)
                        debouncedLookup(v)
                    }}
                    disabled={isLoading || isLookupLoading}
                />

                <Textarea
                    label={t('Name')}
                    value={name}
                    onChange={(e) => { setName(e.target.value) }}
                    disabled={isLoading}
                />

                <Textarea
                    label={t('ourOrg.table.address')}
                    value={address}
                    onChange={(e) => { setAddress(e.target.value) }}
                    disabled={isLoading}
                    minRows={2}
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

                <Textarea
                    label={t('ourOrg.table.kpp')}
                    value={extra.kpp}
                    onChange={(e) => { setExtra((s) => ({ ...s, kpp: e.target.value })) }}
                    disabled={isLoading}
                />

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
