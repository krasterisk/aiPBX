import { memo, useState, useCallback } from 'react'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { TopUpBalance } from '@/features/TopUpBalance'
import { StripeContainer } from '@/features/CheckoutByStripe'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { useGetUserBalance } from '@/entities/User'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'
import { UserCurrencyValues } from '@/entities/User'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { Card } from '@/shared/ui/redesigned/Card'
import HistoryIcon from '@mui/icons-material/History'
import BusinessIcon from '@mui/icons-material/Business'
import DataUsageIcon from '@mui/icons-material/DataUsage'


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
        // Reset state on close if needed, but maybe we want to keep it if user accidentally closed
        // For now let's keep clientSecret if they just click outside, 
        // but usually one restarts flow. Let's keep it simple.
    }, [])

    return (
        <VStack gap="32" max align="start">
            <Card max padding="24">
                <VStack gap="16" max align="start">
                    <Text
                        title={t('Оплата снимается по факту использования')}
                    />
                    <Text
                        text={`${t('Ваш текущий кредитный баланс')}:`}
                    />
                    <Text
                        text={formattedBalance}
                        size="l"
                        bold
                    />
                    <Button
                        onClick={() => setIsTopUpModalOpen(true)}
                        variant="filled"
                    >
                        {t('Пополнить баланс')}
                    </Button>
                </VStack>
            </Card>

            <HStack gap="16" justify="center" max wrap="wrap">
                <Button
                    onClick={() => onTabChange(1)}
                    variant="clear"
                    addonLeft={<HistoryIcon />}
                >
                    {t('История платежей')}
                </Button>
                <Button
                    onClick={() => onTabChange(2)}
                    variant="clear"
                    addonLeft={<DataUsageIcon />}
                >
                    {t('Лимиты')}
                </Button>
                <Button
                    onClick={() => onTabChange(3)}
                    variant="clear"
                    addonLeft={<BusinessIcon />}
                >
                    {t('Организации')}
                </Button>
            </HStack>

            {isTopUpModalOpen && (
                <Modal isOpen={isTopUpModalOpen} onClose={handleCloseModal}>
                    <div style={{ padding: 20, minWidth: 300 }}>
                        {!clientSecret ? (
                            <TopUpBalance onSuccess={onIntentCreated} />
                        ) : (
                            <StripeContainer
                                clientSecret={clientSecret}
                                onCancel={onCancel}
                            />
                        )}
                    </div>
                </Modal>
            )}
        </VStack>
    )
})
