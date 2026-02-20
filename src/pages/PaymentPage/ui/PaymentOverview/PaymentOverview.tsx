import cls from './PaymentOverview.module.scss'
import { memo, useState, useCallback } from 'react'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { TopUpBalance } from '@/features/TopUpBalance'
import { StripeContainer } from '@/features/CheckoutByStripe'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { useGetUserBalance, UserCurrencyValues } from '@/entities/User'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'

import { Modal } from '@/shared/ui/redesigned/Modal'
import HistoryIcon from '@mui/icons-material/History'
import BusinessIcon from '@mui/icons-material/Business'
import DataUsageIcon from '@mui/icons-material/DataUsage'
import { Plus } from 'lucide-react'

interface PaymentOverviewProps {
    onTabChange: (index: number) => void
}

export const PaymentOverview = memo((props: PaymentOverviewProps) => {
    const { onTabChange } = props
    const { t } = useTranslation('payment')
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)

    const { data: balanceData } = useGetUserBalance(null)
    const formattedBalance = balanceData
        ? formatCurrency(balanceData.balance, UserCurrencyValues.USD, 2)
        : '$0.00'

    const onIntentCreated = useCallback((secret: string) => {
        setClientSecret(secret)
    }, [])

    const onCancel = useCallback(() => {
        setClientSecret(null)
    }, [])

    const handleCloseModal = useCallback(() => {
        setIsTopUpModalOpen(false)
    }, [])

    return (
        <VStack gap="16" max className={cls.PaymentOverview}>
            {/* Balance Section */}
            <Text
                title={t('Оплата снимается по факту использования')}
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

            {/* Quick Actions Section */}
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
                    addonLeft={<HistoryIcon fontSize="small" />}
                >
                    {t('История платежей')}
                </Button>
                <Button
                    className={cls.quickActionCard}
                    onClick={() => { onTabChange(2) }}
                    variant="glass-action"
                    addonLeft={<DataUsageIcon fontSize="small" />}
                >
                    {t('Лимиты')}
                </Button>
                <Button
                    className={cls.quickActionCard}
                    onClick={() => { onTabChange(3) }}
                    variant="glass-action"
                    addonLeft={<BusinessIcon fontSize="small" />}
                >
                    {t('Организации')}
                </Button>
            </HStack>

            {/* Top Up Modal */}
            {
                isTopUpModalOpen && (
                    <Modal isOpen={isTopUpModalOpen} onClose={handleCloseModal}>
                        <VStack className={cls.modalContent}>
                            {!clientSecret
? (
                                <TopUpBalance onSuccess={onIntentCreated} />
                            )
: (
                                <StripeContainer
                                    clientSecret={clientSecret}
                                    onCancel={onCancel}
                                />
                            )}
                        </VStack>
                    </Modal>
                )
            }
        </VStack >
    )
})
