import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportExpandedPanel.module.scss'
import React, { memo, useState, useCallback } from 'react'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Report, ReportDialog } from '../../model/types/report'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getUserAuthData, UserCurrencyValues } from '@/entities/User'
import { ReportShowDialog } from '../ReportShowDialog/ReportShowDialog'
import { ReportShowAnalytics } from '../ReportShowAnalytics/ReportShowAnalytics'
import { BillingBreakdown } from '../BillingBreakdown/BillingBreakdown'
import { Button } from '@/shared/ui/redesigned/Button'
import { Loader } from '@/shared/ui/Loader'
import {
    MessageSquareText,
    Receipt,
    BarChart3,
    Sparkles
} from 'lucide-react'

type TabType = 'dialog' | 'billing' | 'analytics'

interface ReportExpandedPanelProps {
    className?: string
    report: Report
    dialogs?: ReportDialog[]
    isDialogLoading: boolean
    isDialogError: boolean
    mediaUrl?: string
    onGetAnalytics: (e: React.MouseEvent) => void
    isAnalyticsLoading: boolean
}

export const ReportExpandedPanel = memo((props: ReportExpandedPanelProps) => {
    const {
        className,
        report,
        dialogs,
        isDialogLoading,
        isDialogError,
        mediaUrl,
        onGetAnalytics,
        isAnalyticsLoading
    } = props

    const { t } = useTranslation('reports')
    const authData = useSelector(getUserAuthData)
    const userCurrency = UserCurrencyValues.USD || authData?.currency

    const [activeTab, setActiveTab] = useState<TabType>('dialog')

    const onTabChange = useCallback((tab: TabType) => {
        setActiveTab(tab)
    }, [])

    const tabs: { key: TabType; label: string; icon: React.ElementType; badge?: string }[] = [
        {
            key: 'dialog',
            label: t('Диалог'),
            icon: MessageSquareText
        },
        {
            key: 'billing',
            label: t('Биллинг'),
            icon: Receipt,
            badge: report.billingRecords?.length
                ? String(report.billingRecords.length)
                : undefined
        },
        {
            key: 'analytics',
            label: t('Аналитика'),
            icon: BarChart3,
            badge: report.analytics?.csat
                ? `★ ${report.analytics.csat}`
                : undefined
        }
    ]

    const renderAnalyticsContent = () => {
        if (report.analytics) {
            return <ReportShowAnalytics analytics={report.analytics} />
        }

        return (
            <VStack max align="center" justify="center" gap="16" className={cls.emptyState}>
                <Sparkles size={48} className={cls.emptyIcon} />
                <Text
                    text={t('Получить аналитику')}
                    size="m"
                />
                <Button
                    variant="filled"
                    onClick={onGetAnalytics}
                    disabled={isAnalyticsLoading}
                    className={cls.getAnalyticsBtn}
                    id="get-analytics-button"
                >
                    {isAnalyticsLoading
                        ? <Loader className={cls.btnLoader} />
                        : (
                            <HStack gap="8" align="center">
                                <Sparkles size={18} />
                                <span>{t('Получить аналитику')}</span>
                            </HStack>
                        )
                    }
                </Button>
            </VStack>
        )
    }

    return (
        <VStack
            gap="0"
            max
            className={classNames(cls.ReportExpandedPanel, {}, [className])}
        >
            {/* Tab Bar */}
            <div className={cls.tabBar} role="tablist">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.key
                    return (
                        <button
                            key={tab.key}
                            role="tab"
                            id={`report-tab-${tab.key}`}
                            aria-selected={isActive}
                            className={classNames(cls.tab, {
                                [cls.tabActive]: isActive
                            })}
                            onClick={() => onTabChange(tab.key)}
                        >
                            <Icon size={16} className={cls.tabIcon} />
                            <span className={cls.tabLabel}>{tab.label}</span>
                            {tab.badge && (
                                <span className={cls.tabBadge}>{tab.badge}</span>
                            )}
                            {isActive && <div className={cls.tabIndicator} />}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            <div className={cls.tabContent}>
                {activeTab === 'dialog' && (
                    <div className={cls.fadeIn}>
                        <ReportShowDialog
                            Dialogs={dialogs}
                            isDialogLoading={isDialogLoading}
                            isDialogError={isDialogError}
                            mediaUrl={mediaUrl}
                        />
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className={cls.fadeIn}>
                        <BillingBreakdown
                            billingRecords={report.billingRecords}
                            userCurrency={userCurrency}
                        />
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className={cls.fadeIn}>
                        {renderAnalyticsContent()}
                    </div>
                )}
            </div>
        </VStack>
    )
})
