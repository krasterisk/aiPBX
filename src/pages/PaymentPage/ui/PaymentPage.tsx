import React, { memo, useState, useCallback } from 'react'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { TopUpBalance } from '@/features/TopUpBalance'
import { StripeContainer } from '@/features/CheckoutByStripe'

const PaymentPage = memo(() => {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const onIntentCreated = useCallback((secret: string) => {
    setClientSecret(secret)
  }, [])

  const onCancel = useCallback(() => {
    setClientSecret(null)
  }, [])

  return (
    <Page data-testid={'PaymentPage'}>
      <VStack gap="32" max align="center" justify="center" style={{ minHeight: '60vh' }}>
        <div style={{ maxWidth: 450, width: '100%' }}>
          {!clientSecret ? (
            <TopUpBalance onSuccess={onIntentCreated} />
          ) : (
            <StripeContainer
              clientSecret={clientSecret}
              onCancel={onCancel}
            />
          )}
        </div>
      </VStack>
    </Page>
  )
})

export default PaymentPage
