import React, { memo, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { useCreateRobokassaPaymentMutation } from '@/entities/Payment'
import { usePublicPrices } from '@/entities/Price'
import { CreditCard } from 'lucide-react'

interface RobokassaCheckoutProps {
    onCancel?: () => void
}

export const RobokassaCheckout = memo((props: RobokassaCheckoutProps) => {
    const { onCancel } = props
    const { t } = useTranslation('payment')
    const [amountRub, setAmountRub] = useState('1000')
    const [error, setError] = useState<string | null>(null)

    const [createPayment, { isLoading }] = useCreateRobokassaPaymentMutation()
    const { data: priceData, isLoading: isRateLoading } = usePublicPrices('RUB')

    const rate = priceData?.rate ?? 0

    const amountUsdCredit = useMemo(() => {
        const num = Number(amountRub)
        if (!amountRub || isNaN(num) || num <= 0 || !rate) return 0
        return Math.round((num / rate) * 100) / 100
    }, [amountRub, rate])

    const onAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setAmountRub(value)
            setError(null)
        }
    }, [])

    const onPay = useCallback(async () => {
        const numRub = Number(amountRub)
        if (!amountRub || isNaN(numRub) || numRub <= 0) {
            setError(t('Некорректная сумма'))
            return
        }

        const payRub = Math.round(numRub * 100) / 100
        if (payRub <= 0) {
            setError(t('Некорректная сумма'))
            return
        }

        try {
            const result = await createPayment({
                amount: payRub,
            }).unwrap()

            if (result.paymentUrl) {
                window.location.href = result.paymentUrl
            }
        } catch (e: unknown) {
            const err = e as { data?: { message?: string } }
            setError(err?.data?.message || t('Ошибка сохранения'))
        }
    }, [amountRub, createPayment, t])

    const rubDisplay = amountRub && Number(amountRub) > 0
        ? `${parseFloat(Number(amountRub).toFixed(2))} ₽`
        : ''

    return (
        <VStack gap="24" max>
            <HStack gap="8" align="center">
                <CreditCard size={22} />
                <Text title={t('Пополнить баланс')} bold />
            </HStack>

            <Text text={t('billing.topup.rubHint')} size="s" />

            <Textarea
                label={t('billing.topup.amountRub') || ''}
                value={amountRub}
                onChange={onAmountChange}
                placeholder="0"
            />

            {rate > 0 && amountUsdCredit > 0 && (
                <VStack gap="4" max>
                    <Text
                        text={`${t('К оплате')}: ${rubDisplay}`}
                        bold
                        size="l"
                    />
                    <Text
                        text={t('billing.topup.creditUsd', {
                            usd: amountUsdCredit.toFixed(2),
                            rate: rate.toFixed(2),
                        })}
                        size="s"
                    />
                </VStack>
            )}

            {isRateLoading && (
                <Text text={t('Загрузка...')} size="s" />
            )}

            {error && (
                <Text variant="error" text={error} />
            )}

            <VStack gap="8" max>
                <Button
                    variant="filled"
                    color="success"
                    onClick={onPay}
                    disabled={isLoading || isRateLoading || amountUsdCredit <= 0}
                    fullWidth
                    size="l"
                >
                    {isLoading ? t('Processing...') : t('Оплатить через Робокассу')}
                </Button>

                {onCancel && (
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        fullWidth
                        size="l"
                        disabled={isLoading}
                    >
                        {t('Отмена')}
                    </Button>
                )}
            </VStack>
        </VStack>
    )
})
