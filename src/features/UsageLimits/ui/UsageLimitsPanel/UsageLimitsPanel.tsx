import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Table } from '@/shared/ui/redesigned/Table'
import { Loader } from '@/shared/ui/Loader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import {
    ClientSelect,
    getBillingOwnerUserId,
    getUserAuthData,
    isUserAdmin,
} from '@/entities/User'
import {
    useGetBalanceAlertsQuery,
    useDeleteBalanceAlertMutation,
    type BalanceThresholdAlert,
} from '@/entities/BalanceAlert'
import { getTenantCurrencyCode } from '@/shared/lib/domain'
import { BalanceAlertModal } from '../BalanceAlertModal/BalanceAlertModal'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import cls from './UsageLimitsPanel.module.scss'

interface UsageLimitsPanelProps {
    className?: string
}

export const UsageLimitsPanel = memo((props: UsageLimitsPanelProps) => {
    const { className } = props
    const { t } = useTranslation('payment')

    const isAdmin = useSelector(isUserAdmin)
    const authData = useSelector(getUserAuthData)
    const billingOwnerUserId = useSelector(getBillingOwnerUserId)
    const userId = String(authData?.id ?? '')

    const [filterUserId, setFilterUserId] = useState(billingOwnerUserId || userId)
    const ownerUserId = isAdmin ? filterUserId : (billingOwnerUserId || userId)

    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<BalanceThresholdAlert | null>(null)

    const { data: alerts, isLoading, isError } = useGetBalanceAlertsQuery(ownerUserId, {
        skip: !ownerUserId,
    })

    const [deleteAlert, { isLoading: isDeleting }] = useDeleteBalanceAlertMutation()

    const currency = getTenantCurrencyCode()
    const currencyLabel = currency === 'RUB' ? 'USD' : currency

    const openCreate = useCallback(() => {
        setEditing(null)
        setModalOpen(true)
    }, [])

    const openEdit = useCallback((row: BalanceThresholdAlert) => {
        setEditing(row)
        setModalOpen(true)
    }, [])

    const handleDelete = useCallback(async (row: BalanceThresholdAlert) => {
        if (!window.confirm(String(t('limits.deleteConfirm')))) return
        try {
            await deleteAlert({ id: row.id, ownerUserId }).unwrap()
        } catch (e) {
            console.error(e)
        }
    }, [deleteAlert, ownerUserId, t])

    const columns = useMemo(() => [
        {
            header: t('limits.table.threshold'),
            accessorKey: 'limitAmount',
            cell: (info: { getValue: () => number }) => `${info.getValue()} ${currencyLabel}`,
        },
        {
            header: t('limits.table.emails'),
            accessorKey: 'emails',
            cell: (info: { getValue: () => string[] }) => (info.getValue() || []).join(', '),
        },
        {
            header: t('limits.table.invoice'),
            id: 'invoice',
            cell: (info: { row: { original: BalanceThresholdAlert } }) => {
                const row = info.row.original
                if (!row.sendInvoice) return t('limits.table.invoiceOff')
                if (row.invoiceAmountMode === 'average_monthly') {
                    return t('limits.table.invoiceAverage')
                }
                return `${row.invoiceAmountRub ?? ''} RUB`
            },
        },
        {
            id: 'actions',
            header: t('organization.table.actions'),
            cell: (info: { row: { original: BalanceThresholdAlert } }) => (
                <HStack gap="8" wrap="wrap" className={cls.actionsCell}>
                    <Button
                        className={cls.iconBtn}
                        variant="clear"
                        addonLeft={<EditIcon fontSize="small" />}
                        title={String(t('limits.edit'))}
                        aria-label={String(t('limits.edit'))}
                        onClick={() => { openEdit(info.row.original) }}
                        disabled={isDeleting}
                    />
                    <Button
                        className={cls.iconBtn}
                        variant="clear"
                        color="error"
                        addonLeft={<DeleteIcon fontSize="small" />}
                        title={String(t('limits.delete'))}
                        aria-label={String(t('limits.delete'))}
                        onClick={() => { void handleDelete(info.row.original) }}
                        disabled={isDeleting}
                    />
                </HStack>
            ),
        },
    ], [t, currencyLabel, openEdit, handleDelete, isDeleting])

    if (!ownerUserId) {
        return null
    }

    return (
        <VStack gap="16" max className={className}>
            <Text
                title={t('limits.title')}
                text={t('limits.description')}
            />

            {isAdmin && (
                <ClientSelect
                    label={String(t('organization.form.client'))}
                    clientId={filterUserId}
                    onChangeClient={(id) => { setFilterUserId(id || userId) }}
                />
            )}

            <HStack gap="8" max justify="end">
                <Button variant="glass-action" onClick={openCreate}>
                    {t('limits.add')}
                </Button>
            </HStack>

            {isLoading && <Loader />}
            {isError && <ErrorGetData />}
            {!isLoading && !isError && (
                <Table
                    data={alerts || []}
                    columns={columns}
                    rowVariant="glass"
                />
            )}

            <BalanceAlertModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false) }}
                ownerUserId={ownerUserId}
                editing={editing}
                isAdmin={isAdmin}
            />
        </VStack>
    )
})
