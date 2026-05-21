import React, { memo, useState, useMemo, useCallback } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PaymentPage.module.scss'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { useTranslation } from 'react-i18next'
import { TabsPanel, TabPanelItem } from '@/shared/ui/mui/TabsPanel'
import { PaymentList } from '@/entities/Payment'
import { UsageLimitsPanel } from '@/features/UsageLimits'
import { useSelector } from 'react-redux'
import { getUserAuthData, useGetUserBalance } from '@/entities/User'
import { Text } from '@/shared/ui/redesigned/Text'
import { PaymentOverview } from './PaymentOverview/PaymentOverview'
import { PaymentOrganizations } from './PaymentOrganizations/PaymentOrganizations'
import { UsageTab } from './UsageTab/UsageTab'
import { isPaymentOrganizationsTabVisible } from '@/shared/lib/domain'

const PaymentPage = memo(() => {
    const { t } = useTranslation('payment')
    const authData = useSelector(getUserAuthData)
    const userId = String(authData?.id ?? '')

    const [tabIndex, setTabIndex] = useState(0)

    const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue)
    }, [])

    const onTabChangeByIndex = useCallback((index: number) => {
        setTabIndex(index)
    }, [])

    const showOrganizationsTab = isPaymentOrganizationsTabVisible()
    const organizationsTabIndex = showOrganizationsTab ? 4 : undefined

    const { data: balanceData } = useGetUserBalance(null, {
        skip: !showOrganizationsTab,
        refetchOnFocus: true,
    })

    const tabs: TabPanelItem[] = useMemo(() => {
        const base: TabPanelItem[] = [
            {
                label: t('tabs.overview'),
                content: (
                    <PaymentOverview
                        onTabChange={onTabChangeByIndex}
                        organizationsTabIndex={organizationsTabIndex}
                    />
                ),
            },
            { label: t('tabs.usage'), content: <UsageTab /> },
            { label: t('tabs.history'), content: <PaymentList /> },
            { label: t('tabs.limits'), content: <UsageLimitsPanel /> },
        ]
        if (showOrganizationsTab) {
            base.push({
                label: t('tabs.organizations'),
                content: <PaymentOrganizations userId={userId} />,
            })
        }
        return base
    }, [t, userId, onTabChangeByIndex, showOrganizationsTab, organizationsTabIndex])

    return (
        <Page data-testid="PaymentPage" className={classNames(cls.PaymentPage, {}, [])}>
            <VStack gap="24" max>
                <VStack gap="8" align="start" max className={cls.pageHeader}>
                    <Text title={t('page.title')} />
                    {showOrganizationsTab && balanceData?.personalAccountNumber && (
                        <VStack gap="4" align="start">
                            <Text text={t('personalAccount.label')} size="s" variant="accent" />
                            <Text
                                text={balanceData.personalAccountNumber}
                                size="xl"
                                bold
                                className={cls.personalAccountNumber}
                            />
                        </VStack>
                    )}
                </VStack>

                <TabsPanel
                    tabItems={tabs}
                    value={tabIndex}
                    onChange={handleTabChange}
                />
            </VStack>
        </Page>
    )
})

export default PaymentPage
