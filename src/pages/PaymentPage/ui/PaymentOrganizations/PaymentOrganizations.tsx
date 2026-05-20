import cls from './PaymentOrganizations.module.scss'

import { memo, useState, useCallback, useEffect } from 'react'

import { VStack, HStack } from '@/shared/ui/redesigned/Stack'

import { Button } from '@/shared/ui/redesigned/Button'

import { Text } from '@/shared/ui/redesigned/Text'

import { useTranslation } from 'react-i18next'

import { useSelector } from 'react-redux'

import { Plus } from 'lucide-react'

import { OrganizationList, Organization, useDeleteOrganizationMutation } from '@/entities/Organization'

import { OrganizationCreateModal } from '@/features/CreateOrganization'

import { OrganizationInvoiceModal } from '@/features/IssueInvoice'

import { ClientSelect, isUserAdmin, getBillingOwnerUserId } from '@/entities/User'

interface PaymentOrganizationsProps {

    userId: string

}

export const PaymentOrganizations = memo((props: PaymentOrganizationsProps) => {
    const { userId } = props

    const { t } = useTranslation('payment')

    const isAdmin = useSelector(isUserAdmin)

    const billingOwnerUserId = useSelector(getBillingOwnerUserId)

    const [listUserId, setListUserId] = useState(billingOwnerUserId || userId)

    useEffect(() => {
        if (isAdmin) {
            setListUserId(billingOwnerUserId || userId)
        } else {
            setListUserId(billingOwnerUserId)
        }
    }, [isAdmin, billingOwnerUserId, userId])

    const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState(false)

    const [organizationToEdit, setOrganizationToEdit] = useState<Organization | undefined>(undefined)

    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)

    const [invoiceOrgId, setInvoiceOrgId] = useState<string | undefined>(undefined)

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
        if (window.confirm(String(t('organization.confirmDelete')))) {
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

    const handleIssueInvoice = useCallback((org: Organization) => {
        setInvoiceOrgId(String(org.id))

        setIsInvoiceOpen(true)
    }, [])

    const handleCloseInvoice = useCallback(() => {
        setIsInvoiceOpen(false)

        setInvoiceOrgId(undefined)
    }, [])

    return (

        <VStack gap="16" max className={cls.PaymentOrganizations}>

            <HStack justify="between" max wrap="wrap" className={cls.header}>

                <Text title={t('tabs.organizations')} className={cls.title} />

                <HStack gap="8" wrap="wrap" className={cls.actions}>

                    <Button

                        className={cls.actionBtn}

                        onClick={() => {
                            setInvoiceOrgId(undefined)

                            setIsInvoiceOpen(true)
                        }}

                        variant="glass-action"

                    >

                        {t('invoice.issue')}

                    </Button>

                    <Button

                        className={cls.actionBtn}

                        onClick={handleCreate}

                        variant="glass-action"

                        addonLeft={<Plus size={20} />}

                    >

                        {t('Добавить организацию')}

                    </Button>

                </HStack>

            </HStack>

            {isAdmin && (

                <ClientSelect

                    label={String(t('organization.form.client'))}

                    clientId={listUserId}

                    allowAll

                    onChangeClient={(id) => {
                        setListUserId(id)
                    }}

                />

            )}

            <OrganizationList

                className={cls.list}

                userId={listUserId || undefined}

                canDeleteDocuments={isAdmin}

                onEdit={handleEdit}

                onDelete={handleDelete}

                onIssueInvoice={handleIssueInvoice}

            />

            {isAddOrgModalOpen && (

                <OrganizationCreateModal

                    isOpen={isAddOrgModalOpen}

                    onClose={handleCloseModal}

                    userId={listUserId || userId}

                    organization={organizationToEdit}

                    onCreatedForTenant={isAdmin && listUserId ? setListUserId : undefined}

                />

            )}

            {isInvoiceOpen && (

                <OrganizationInvoiceModal

                    isOpen={isInvoiceOpen}

                    onClose={handleCloseInvoice}

                    userId={listUserId || userId}

                    preselectedOrganizationId={invoiceOrgId}

                />

            )}

        </VStack>

    )
})
