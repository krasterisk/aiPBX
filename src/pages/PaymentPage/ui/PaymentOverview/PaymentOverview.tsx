import cls from './PaymentOverview.module.scss'
import { memo, useState, useCallback, type ReactNode } from 'react'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { TopUpBalance } from '@/features/TopUpBalance'
import { StripeContainer } from '@/features/CheckoutByStripe'
import { RobokassaCheckout } from '@/features/CheckoutByRobokassa'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { useTranslation } from 'react-i18next'
import { useGetUserBalance } from '@/entities/User'
import { formatTenantMoney } from '@/shared/lib/functions/formatDisplayMoney'
import { getDomainConfig } from '@/shared/lib/domain'
import { PaymentBillingExplainer } from '../PaymentBillingExplainer/PaymentBillingExplainer'
import {
    History,
    Building2,
    BarChart3,
    Receipt,
    CreditCard,
    FileText,
    Plus,
} from 'lucide-react'

interface PaymentOverviewProps {
    onTabChange: (index: number) => void
    organizationsTabIndex?: number
}

interface QuickNavItem {
    tabIndex: number
    label: string
    icon: ReactNode
}

export const PaymentOverview = memo((props: PaymentOverviewProps) => {
    const { onTabChange, organizationsTabIndex } = props
    const { t } = useTranslation('payment')
    const showInvoiceTopUp = organizationsTabIndex !== undefined

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

    const quickNavItems: QuickNavItem[] = [
        { tabIndex: 1, label: t('tabs.usage'), icon: <BarChart3 size={20} /> },
        { tabIndex: 2, label: t('tabs.history'), icon: <History size={20} /> },
        { tabIndex: 3, label: t('tabs.limits'), icon: <Receipt size={20} /> },
    ]
    if (organizationsTabIndex !== undefined) {
        quickNavItems.push({
            tabIndex: organizationsTabIndex,
            label: t('tabs.organizations'),
            icon: <Building2 size={20} />,
        })
    }

    return (
        <VStack gap="24" max className={cls.PaymentOverview}>
            <PaymentBillingExplainer />

            <VStack gap="8" max align="start" className={cls.balanceSection}>
                <Text text={`${t('Текущий баланс')}:`} />
                <Text
                    title={formattedBalance}
                    size="l"
                    bold
                    className={cls.balanceAmount}
                />
                <Text text={t('billing.explainer.paygShort')} size="s" />
                {showInvoiceTopUp ? (
                    <HStack gap="12" wrap="wrap" className={cls.balanceActions}>
                        <Button
                            onClick={() => { setIsTopUpModalOpen(true) }}
                            variant="glass-action"
                            addonLeft={<CreditCard size={20} />}
                        >
                            {t('overview.payByCard')}
                        </Button>
                        <Button
                            onClick={() => { onTabChange(organizationsTabIndex) }}
                            variant="glass-action"
                            addonLeft={<FileText size={20} />}
                        >
                            {t('overview.issueInvoice')}
                        </Button>
                    </HStack>
                ) : (
                    <Button
                        onClick={() => { setIsTopUpModalOpen(true) }}
                        variant="glass-action"
                        addonLeft={<Plus size={20} />}
                    >
                        {t('Пополнить баланс')}
                    </Button>
                )}
            </VStack>

            <VStack gap="12" max>
                <Text title={t('Быстрые действия')} bold size="s" />
                <div className={cls.navGrid}>
                    {quickNavItems.map((item) => (
                        <Button
                            key={item.tabIndex}
                            className={cls.navCard}
                            variant="glass-action"
                            onClick={() => { onTabChange(item.tabIndex) }}
                            addonLeft={item.icon}
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>
            </VStack>

            {isTopUpModalOpen && (
                <Modal isOpen={isTopUpModalOpen} onClose={handleCloseModal}>
                    <VStack className={cls.modalContent}>
                        {renderModalContent()}
                    </VStack>
                </Modal>
            )}
        </VStack>
    )
})
