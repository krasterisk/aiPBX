import React, { memo, useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack } from '@/shared/ui/redesigned/Stack'

interface CheckoutFormProps {
    onSuccess?: () => void
    onCancel?: () => void
}

export const CheckoutForm = memo((props: CheckoutFormProps) => {
    const { onSuccess, onCancel } = props
    const stripe = useStripe()
    const elements = useElements()
    const { t } = useTranslation('payment')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsProcessing(true)
        setErrorMessage(null)

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/billing?status=success`
            }
        })

        if (error) {
            setErrorMessage(error.message || t('An unexpected error occurred.'))
            setIsProcessing(false)
        } else {
            onSuccess?.()
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <VStack gap="24" max>
                <PaymentElement />

                {errorMessage && (
                    <Text variant="error" text={t(errorMessage)} />
                )}

                <VStack gap="8" max>
                    <Button
                        variant="filled"
                        color="success"
                        type="submit"
                        disabled={!stripe || isProcessing}
                        fullWidth
                        size="l"
                    >
                        {isProcessing ? t('Processing...') : t('Pay')}
                    </Button>

                    {onCancel && (
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            fullWidth
                            size="l"
                            disabled={isProcessing}
                        >
                            {t('Back')}
                        </Button>
                    )}
                </VStack>
            </VStack>
        </form>
    )
})
