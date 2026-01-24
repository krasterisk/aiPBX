import { memo, useState, useCallback } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { useTranslation } from 'react-i18next'
import { OrganizationList, Organization, useDeleteOrganizationMutation } from '@/entities/Organization'
import { OrganizationCreateModal } from '@/features/CreateOrganization' // Import from features

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
        <VStack gap="16" max>
            <Button onClick={handleCreate}>
                {t('Добавить организацию')}
            </Button>
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
