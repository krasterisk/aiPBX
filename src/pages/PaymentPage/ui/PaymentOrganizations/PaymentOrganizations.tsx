import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PaymentOrganizations.module.scss'
import { memo, useState, useCallback } from 'react'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { OrganizationList, Organization, useDeleteOrganizationMutation } from '@/entities/Organization'
import { OrganizationCreateModal } from '@/features/CreateOrganization'

interface PaymentOrganizationsProps {
    userId: string
}

export const PaymentOrganizations = memo((props: PaymentOrganizationsProps) => {
    const { userId } = props
    const { t } = useTranslation('payment')
    const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState(false)
    const [organizationToEdit, setOrganizationToEdit] = useState<Organization | undefined>(undefined)
    const [deleteOrganization] = useDeleteOrganizationMutation()

    const handleCreate = useCallback(() => {
        setOrganizationToEdit(undefined)
        setIsAddOrgModalOpen(true)
    }, [])

    const handleEdit = useCallback((org: Organization) => {
        setOrganizationToEdit(org)
        setIsAddOrgModalOpen(true)
    }, [])

    const handleDelete = useCallback(async (org: Organization) => {
        if (window.confirm(t('Вы действительно хотите удалить организацию?') || '')) {
            try {
                await deleteOrganization(org.id).unwrap()
            } catch (e) {
                console.error(e)
            }
        }
    }, [deleteOrganization, t])

    const handleCloseModal = useCallback(() => {
        setIsAddOrgModalOpen(false)
        setOrganizationToEdit(undefined)
    }, [])

    return (
        <VStack gap="16" max className={cls.PaymentOrganizations}>
            <HStack justify="between" max wrap="wrap" gap="16" className={cls.header}>
                <Text title={t('Организации')} />
                <Button
                    onClick={handleCreate}
                    variant="glass-action"
                    addonLeft={<Plus size={20} />}
                >
                    {t('Добавить организацию')}
                </Button>
            </HStack>
            <OrganizationList
                userId={userId}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            {isAddOrgModalOpen && (
                <OrganizationCreateModal
                    isOpen={isAddOrgModalOpen}
                    onClose={handleCloseModal}
                    userId={userId}
                    organization={organizationToEdit}
                />
            )}
        </VStack>
    )
})
