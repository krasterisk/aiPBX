import React, { memo } from 'react'
import { Page } from '@/widgets/Page'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/ui/redesigned/Text'

const PaymentPage = memo(() => {
  const { t } = useTranslation('payment')

  return (
        <Page data-testid={'PaymentPage'}>
            <Text title={t('Страница оплаты')}/>
        </Page>
  )
})

export default PaymentPage
