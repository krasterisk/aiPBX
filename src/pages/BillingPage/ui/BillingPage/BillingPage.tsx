import React, { memo, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import CheckIcon from '@/shared/assets/icons/check.svg'
import { getRoutePayment } from '@/shared/const/router'
import { loadStripe } from '@stripe/stripe-js'

const STRIPE_KEY = __STRIPE_PUBLISHABLE_KEY__ || ''

const BillingPage = memo(() => {
    const { t } = useTranslation('payment')
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading')

    useEffect(() => {
        const clientSecret = searchParams.get('payment_intent_client_secret')
        const paymentIntentId = searchParams.get('payment_intent')

        // If no required parameters, redirect to payment
        if (!clientSecret || !paymentIntentId) {
            navigate(getRoutePayment())
            return
        }

        // Verify PaymentIntent with Stripe
        const verifyPayment = async () => {
            try {
                const stripe = await loadStripe(STRIPE_KEY)
                if (!stripe) {
                    setVerificationStatus('error')
                    return
                }

                const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)

                if (paymentIntent?.status === 'succeeded') {
                    setVerificationStatus('success')
                } else {
                    setVerificationStatus('error')
                    // Redirect to payment page after 3 seconds
                    setTimeout(() => navigate(getRoutePayment()), 3000)
                }
            } catch (error) {
                console.error('Payment verification failed:', error)
                setVerificationStatus('error')
                setTimeout(() => navigate(getRoutePayment()), 3000)
            }
        }

        verifyPayment()
    }, [searchParams, navigate])

    const onBackToPayment = () => {
        navigate(getRoutePayment())
    }

    if (verificationStatus === 'loading') {
        return (
            <Page data-testid={'BillingPage'}>
                <VStack gap="32" max align="center" justify="center" style={{ minHeight: '60vh' }}>
                    <div style={{ maxWidth: 450, width: '100%' }}>
                        <Card padding="24" max border="round">
                            <VStack gap="24" max align="center">
                                <Text title={t('Verifying Payment')} align="center" />
                                <Text text={t('Please wait...')} align="center" />
                            </VStack>
                        </Card>
                    </div>
                </VStack>
            </Page>
        )
    }

    if (verificationStatus === 'error') {
        return (
            <Page data-testid={'BillingPage'}>
                <VStack gap="32" max align="center" justify="center" style={{ minHeight: '60vh' }}>
                    <div style={{ maxWidth: 450, width: '100%' }}>
                        <Card padding="24" max border="round">
                            <VStack gap="24" max align="center">
                                <Text variant="error" title={t('Payment Verification Failed')} align="center" />
                                <Text text={t('Redirecting...')} align="center" />
                            </VStack>
                        </Card>
                    </div>
                </VStack>
            </Page>
        )
    }

    return (
        <Page data-testid={'BillingPage'}>
            <VStack gap="32" max align="center" justify="center" style={{ minHeight: '60vh' }}>
                <div style={{ maxWidth: 450, width: '100%' }}>
                    <Card padding="24" max border="round">
                        <VStack gap="24" max align="center">
                            <Icon Svg={CheckIcon} width={64} height={64} style={{ color: 'var(--accent-redesigned)' }} />
                            <VStack gap="8" max align="center">
                                <Text title={t('Payment Successful')} align="center" />
                                <Text text={t('Your payment has been processed. Your balance will be updated within a few minutes.')} align="center" />
                            </VStack>
                            <Button
                                variant="filled"
                                onClick={onBackToPayment}
                                fullWidth
                            >
                                {t('Back to Payments')}
                            </Button>
                        </VStack>
                    </Card>
                </div>
            </VStack>
        </Page>
    )
})

export default BillingPage
