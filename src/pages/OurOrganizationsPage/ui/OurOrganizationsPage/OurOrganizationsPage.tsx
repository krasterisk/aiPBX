import { memo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/widgets/Page'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Plus } from 'lucide-react'
import {
    OurOrganizationList,
    useDeleteOurOrganizationMutation,
    type OurOrganization,
} from '@/entities/OurOrganization'
import { OurOrganizationModal } from '@/features/ManageOurOrganization'
import cls from './OurOrganizationsPage.module.scss'

export const OurOrganizationsPage = memo(() => {
    const { t } = useTranslation('admin')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [organizationToEdit, setOrganizationToEdit] = useState<OurOrganization | undefined>()
    const [deleteOrganization] = useDeleteOurOrganizationMutation()

    const handleCreate = useCallback(() => {
        setOrganizationToEdit(undefined)
        setIsModalOpen(true)
    }, [])

    const handleEdit = useCallback((org: OurOrganization) => {
        setOrganizationToEdit(org)
        setIsModalOpen(true)
    }, [])

    const handleDelete = useCallback(async (org: OurOrganization) => {
        if (window.confirm(String(t('ourOrg.confirmDelete')))) {
            try {
                await deleteOrganization(org.id).unwrap()
            } catch (e) {
                console.error(e)
            }
        }
    }, [deleteOrganization, t])

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false)
        setOrganizationToEdit(undefined)
    }, [])

    return (
        <Page data-testid="OurOrganizationsPage" className={cls.OurOrganizationsPage}>
            <VStack gap="24" max>
                <HStack justify="between" max wrap="wrap" gap="16">
                    <VStack gap="8">
                        <Text title={t('ourOrg.pageTitle')} />
                        <Text text={t('ourOrg.pageSubtitle')} size="s" variant="accent" />
                    </VStack>
                    <Button
                        onClick={handleCreate}
                        variant="glass-action"
                        addonLeft={<Plus size={20} />}
                    >
                        {t('ourOrg.add')}
                    </Button>
                </HStack>

                <OurOrganizationList onEdit={handleEdit} onDelete={handleDelete} />

                {isModalOpen && (
                    <OurOrganizationModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        organization={organizationToEdit}
                    />
                )}
            </VStack>
        </Page>
    )
})
