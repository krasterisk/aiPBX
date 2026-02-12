import React, { memo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { useCreateIntentMutation } from '@/entities/Payment'
import { useSelector } from 'react-redux'
import { getUserAuthData } from '@/entities/User'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { CreditCard } from 'lucide-react'

interface TopUpBalanceProps {
    onSuccess: (clientSecret: string) => void
}

export const TopUpBalance = memo((props: TopUpBalanceProps) => {
    const { onSuccess } = props
    const { t } = useTranslation('payment')
    const [amount, setAmount] = useState('10')
    const [error, setError] = useState<string | null>(null)

    const userData = useSelector(getUserAuthData)
    const [createIntent, { isLoading }] = useCreateIntentMutation()

    const onAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value)
            setError(null)
        }
    }, [])

    const onContinue = useCallback(async () => {
        const numAmount = Number(amount)
        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            setError(t('Некорректная сумма'))
            return
        }

        try {
            const userId = userData?.id || 'unknown'
            const result = await createIntent({
                userId,
                amount: numAmount,
                currency: 'usd'
            }).unwrap()

            if (result.clientSecret) {
                onSuccess(result.clientSecret)
            }
        } catch (e: any) {
            setError(e?.data?.message || t('Ошибка сохранения'))
        }
    }, [amount, createIntent, onSuccess, t, userData?.id])

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
                value={amount}
                onChange={onAmountChange}
                placeholder="0.00"
            />

            {error && (
                <Text variant="error" text={error} />
            )}

            <Button
                variant="glass-action"
                onClick={onContinue}
                disabled={isLoading}
                fullWidth
            >
                {isLoading ? t('Загрузка...') : t('Продолжить')}
            </Button>
        </VStack>
    )
})
