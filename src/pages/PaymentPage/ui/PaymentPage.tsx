import React, { memo, useState, useMemo, useCallback } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PaymentPage.module.scss'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { useTranslation } from 'react-i18next'
import { TabsPanel, TabPanelItem } from '@/shared/ui/mui/TabsPanel'
import { PaymentList } from '@/entities/Payment'
import { UsageLimitsForm } from '@/features/UsageLimits'
import { useSelector } from 'react-redux'
import { getUserAuthData } from '@/entities/User'
import { Text } from '@/shared/ui/redesigned/Text'
import { PaymentOverview } from './PaymentOverview/PaymentOverview'
import { PaymentOrganizations } from './PaymentOrganizations/PaymentOrganizations'
import { Card } from '@/shared/ui/redesigned/Card'

const PaymentPage = memo(() => {
  const { t } = useTranslation('payment')
  const authData = useSelector(getUserAuthData)
  const userId = authData?.id || ''

  const [tabIndex, setTabIndex] = useState(0)

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
  }, [])

  // Helper to switch tab from button
  const onTabChangeByIndex = useCallback((index: number) => {
    setTabIndex(index)
  }, [])

  const tabs: TabPanelItem[] = useMemo(() => [
    { label: t('Обзор'), content: <PaymentOverview onTabChange={onTabChangeByIndex} /> },
    { label: t('История платежей'), content: <PaymentList /> },
    { label: t('Лимиты'), content: <UsageLimitsForm /> },
    { label: t('Организации'), content: <PaymentOrganizations userId={userId} /> }
  ], [t, userId, onTabChangeByIndex])

  return (
    <Page data-testid={'PaymentPage'} className={classNames(cls.PaymentPage, {}, [])}>
      <VStack gap="24" max>
        <Text title={t('Оплата')} />
        <Card max variant='glass' border='partial' padding='0'>
          <TabsPanel
            tabItems={tabs}
            value={tabIndex}
            onChange={handleTabChange}
          />
        </Card>
      </VStack>
    </Page>
  )
})

export default PaymentPage
