import { memo, useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { useCreateOrganizationMutation, useUpdateOrganizationMutation } from '@/entities/Organization'
import { Organization } from '@/entities/Organization'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Building2 } from 'lucide-react'

interface OrganizationCreateModalProps {
    className?: string
    isOpen: boolean
    onClose: () => void
    userId: string
    organization?: Organization
}

export const OrganizationCreateModal = memo((props: OrganizationCreateModalProps) => {
    const { className, isOpen, onClose, userId, organization } = props
    const { t } = useTranslation('payment')
    const [createOrganization, { isLoading: isCreating }] = useCreateOrganizationMutation()
    const [updateOrganization, { isLoading: isUpdating }] = useUpdateOrganizationMutation()

    const [name, setName] = useState('')
    const [tin, setTin] = useState('')
    const [address, setAddress] = useState('')

    useEffect(() => {
        if (organization && isOpen) {
            setName(organization.name)
            setTin(organization.tin)
            setAddress(organization.address)
        } else if (!organization && isOpen) {
            setName('')
            setTin('')
            setAddress('')
        }
    }, [organization, isOpen])

    const handleSubmit = useCallback(async () => {
        try {
            if (organization) {
                await updateOrganization({
                    id: organization.id,
                    userId,
                    name,
                    tin,
                    address
                }).unwrap()
            } else {
                await createOrganization({
                    userId,
                    name,
                    tin,
                    address
                }).unwrap()
            }
            onClose()
            setName('')
            setTin('')
            setAddress('')
        } catch (e) {
            console.error(e)
        }
    }, [createOrganization, updateOrganization, organization, userId, name, tin, address, onClose])

    const isLoading = isCreating || isUpdating

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

                <Textarea
                    label={t('Наименование') || ''}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    minRows={1}
                />

                <Textarea
                    label={t('ИНН') || ''}
                    value={tin}
                    onChange={(e) => setTin(e.target.value)}
                    disabled={isLoading}
                    minRows={1}
                />

                <Textarea
                    label={t('Адрес') || ''}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={isLoading}
                />

                <HStack gap="8" max justify="end">
                    <Button
                        onClick={onClose}
                        variant="clear"
                    >
                        {t('Отмена')}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !name || !tin || !address}
                        variant="glass-action"
                    >
                        {t('Сохранить')}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    )
})
