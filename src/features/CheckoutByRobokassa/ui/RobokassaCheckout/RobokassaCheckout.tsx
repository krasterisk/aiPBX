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
    const [amountUsd, setAmountUsd] = useState('10')
    const [error, setError] = useState<string | null>(null)

    const [createPayment, { isLoading }] = useCreateRobokassaPaymentMutation()
    const { data: priceData, isLoading: isRateLoading } = usePublicPrices('RUB')

    const rate = priceData?.rate ?? 0

    const amountRub = useMemo(() => {
        const num = Number(amountUsd)
        if (!amountUsd || isNaN(num) || num <= 0 || !rate) return 0
        return Math.ceil(num * rate)
    }, [amountUsd, rate])

    const onAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value
        if (/^\d*\.?\d*$/.test(value)) {
            setAmountUsd(value)
            setError(null)
        }
    }, [])

    const onPay = useCallback(async () => {
        const numAmount = Number(amountUsd)
        if (!amountUsd || isNaN(numAmount) || numAmount <= 0) {
            setError(t('Некорректная сумма'))
            return
        }

        if (!amountRub || amountRub <= 0) {
            setError(t('Не удалось рассчитать сумму в рублях'))
            return
        }

        try {
            const result = await createPayment({
                amount: amountRub
            }).unwrap()

            if (result.paymentUrl) {
                window.location.href = result.paymentUrl
            }
        } catch (e: any) {
            setError(e?.data?.message || t('Ошибка сохранения'))
        }
    }, [amountUsd, amountRub, createPayment, t])

    return (
        <VStack gap="24" max>
            <HStack gap="8" align="center">
                <CreditCard size={22} />
                <Text title={t('Пополнить баланс')} bold />
            </HStack>

            <Text
                text={t('Укажите сумму пополнения в долларах США')}
                size="s"
            />

            <Textarea
                label={t('Сумма (USD)') || ''}
                value={amountUsd}
                onChange={onAmountChange}
                placeholder="0.00"
            />

            {rate > 0 && amountRub > 0 && (
                <VStack gap="4" max>
                    <Text
                        text={`${t('К оплате')}: ₽${amountRub.toLocaleString()}`}
                        bold
                        size="l"
                    />
                    <Text
                        text={`≈ $${Number(amountUsd).toFixed(2)} ${t('по курсу')} 1$ = ₽${rate.toFixed(2)}`}
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
                    disabled={isLoading || isRateLoading || amountRub <= 0}
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
