import React, { memo, useMemo } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useTranslation } from 'react-i18next'
import { CheckoutForm } from '../CheckoutForm/CheckoutForm'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack } from '@/shared/ui/redesigned/Stack'

const STRIPE_KEY = __STRIPE_PUBLISHABLE_KEY__ || ''

if (!STRIPE_KEY) {
    console.warn('Stripe publishable key is missing')
}

const stripePromise = loadStripe(STRIPE_KEY)

interface StripeContainerProps {
    clientSecret: string
    onCancel?: () => void
}

export const StripeContainer = memo((props: StripeContainerProps) => {
    const { clientSecret, onCancel } = props
    const { t } = useTranslation('payment')

    const options = useMemo(() => ({
        clientSecret,
        appearance: {
            theme: 'stripe' as const
        }
    }), [clientSecret])

    return (
        <Card padding="24" max border="round">
            <VStack gap="24" max align="center">
                <Text title={t('Complete Payment')} />

                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm onCancel={onCancel} />
                </Elements>
            </VStack>
        </Card>
    )
})
