import React, { memo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { useCreateIntentMutation } from '@/entities/Payment'
import { useSelector } from 'react-redux'
import { getUserAuthData } from '@/entities/User'
import { Textarea } from '@/shared/ui/mui/Textarea'

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
            setError(t('Invalid amount'))
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
            setError(e?.data?.message || t('Failed to create payment intent'))
        }
    }, [amount, createIntent, onSuccess, t, userData?.id])

    return (
        <Card padding="24" max border="round">
            <VStack gap="24" max>
                <Text title={t('Refill Balance')} />

                <VStack gap="16" max>
                    <Textarea
                        label={t('Amount (USD)')}
                        value={amount}
                        onChange={onAmountChange}
                        placeholder="0.00"
                    />

                    {error && (
                        <Text variant="error" text={error} />
                    )}

                    <Button
                        variant="filled"
                        color="normal"
                        onClick={onContinue}
                        disabled={isLoading}
                        fullWidth
                        size="l"
                    >
                        {isLoading ? t('Loading...') : t('Continue')}
                    </Button>
                </VStack>
            </VStack>
        </Card>
    )
})
