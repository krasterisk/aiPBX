import cls from './PaymentOverview.module.scss'
import { memo, useState, useCallback } from 'react'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { TopUpBalance } from '@/features/TopUpBalance'
import { StripeContainer } from '@/features/CheckoutByStripe'
import { RobokassaCheckout } from '@/features/CheckoutByRobokassa'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { useGetUserBalance } from '@/entities/User'
import { formatTenantMoney } from '@/shared/lib/functions/formatDisplayMoney'
import { getDomainConfig } from '@/shared/lib/domain'
import { PaymentBillingExplainer } from '../PaymentBillingExplainer/PaymentBillingExplainer'

import { Modal } from '@/shared/ui/redesigned/Modal'
import HistoryIcon from '@mui/icons-material/History'
import BusinessIcon from '@mui/icons-material/Business'
import DataUsageIcon from '@mui/icons-material/DataUsage'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import { Plus } from 'lucide-react'

interface PaymentOverviewProps {
    onTabChange: (index: number) => void
    organizationsTabIndex?: number
}

export const PaymentOverview = memo((props: PaymentOverviewProps) => {
    const { onTabChange, organizationsTabIndex } = props
    const { t } = useTranslation('payment')
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)

    const { paymentSystem } = getDomainConfig()
    const isRobokassa = paymentSystem === 'robokassa'

    const { data: balanceData } = useGetUserBalance(null, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    })
    const formattedBalance = balanceData
        ? formatTenantMoney(balanceData.balance, 2)
        : formatTenantMoney(0, 2)

    const onIntentCreated = useCallback((secret: string) => {
        setClientSecret(secret)
    }, [])

    const onCancel = useCallback(() => {
        setClientSecret(null)
    }, [])

    const handleCloseModal = useCallback(() => {
        setIsTopUpModalOpen(false)
        setClientSecret(null)
    }, [])

    const renderModalContent = () => {
        if (isRobokassa) {
            return <RobokassaCheckout onCancel={handleCloseModal} />
        }

        if (!clientSecret) {
            return <TopUpBalance onSuccess={onIntentCreated} />
        }

        return (
            <StripeContainer
                clientSecret={clientSecret}
                onCancel={onCancel}
            />
        )
    }

    return (
        <VStack gap="16" max className={cls.PaymentOverview}>
            <PaymentBillingExplainer />
            <Text
                title={t('billing.explainer.paygShort')}
                bold
                size='s'
            />
            <VStack max gap='8'>
                <Text
                    text={`${t('Текущий баланс')}:`}
                    align='center'

                />
                <Text
                    title={formattedBalance}
                    size="l"
                    bold
                    align='center'
                    className={cls.balanceAmount}
                />
                <Button
                    onClick={() => { setIsTopUpModalOpen(true) }}
                    variant="glass-action"
                    addonLeft={<Plus size={20} />}
                >
                    {t('Пополнить баланс')}
                </Button>
            </VStack>

            <Text
                title={t('Быстрые действия')}
                bold
                size='s'
            />
            <HStack gap="16" max wrap="wrap" className={cls.quickActionsGrid}>
                <Button
                    className={cls.quickActionCard}
                    onClick={() => { onTabChange(1) }}
                    variant="glass-action"
                    addonLeft={<ReceiptLongIcon fontSize="small" />}
                >
                    {t('tabs.usage')}
                </Button>
                <Button
                    className={cls.quickActionCard}
                    onClick={() => { onTabChange(2) }}
                    variant="glass-action"
                    addonLeft={<HistoryIcon fontSize="small" />}
                >
                    {t('tabs.history')}
                </Button>
                <Button
                    className={cls.quickActionCard}
                    onClick={() => { onTabChange(3) }}
                    variant="glass-action"
                    addonLeft={<DataUsageIcon fontSize="small" />}
                >
                    {t('tabs.limits')}
                </Button>
                {organizationsTabIndex !== undefined && (
                    <Button
                        className={cls.quickActionCard}
                        onClick={() => { onTabChange(organizationsTabIndex) }}
                        variant="glass-action"
                        addonLeft={<BusinessIcon fontSize="small" />}
                    >
                        {t('tabs.organizations')}
                    </Button>
                )}
            </HStack>

            {
                isTopUpModalOpen && (
                    <Modal isOpen={isTopUpModalOpen} onClose={handleCloseModal}>
                        <VStack className={cls.modalContent}>
                            {renderModalContent()}
                        </VStack>
                    </Modal>
                )
            }
        </VStack >
    )
})
