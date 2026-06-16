import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportExpandedPanel.module.scss'
import React, { memo, useState, useCallback } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Report, ReportDialog } from '../../model/types/report'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getUserAuthData, isUserAdmin, UserCurrencyValues } from '@/entities/User'
import { useDeleteReport } from '../../api/reportApi'
import { ReportShowDialog } from '../ReportShowDialog/ReportShowDialog'
import { ReportShowAnalytics } from '../ReportShowAnalytics/ReportShowAnalytics'
import { BillingBreakdown } from '../BillingBreakdown/BillingBreakdown'
import { Loader } from '@/shared/ui/Loader'
import {
    MessageSquareText,
    Receipt,
    BarChart3,
    Sparkles,
    RefreshCw,
    Trash2
} from 'lucide-react'

type TabType = 'dialog' | 'billing' | 'analytics'

interface ReportExpandedPanelProps {
    className?: string
    report: Report
    dialogs?: ReportDialog[]
    isDialogLoading: boolean
    isDialogError: boolean
    mediaUrl?: string
    onGetAnalytics?: (e: React.MouseEvent) => void
    onRegenerateAnalytics?: (e: React.MouseEvent) => void
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
        onRegenerateAnalytics,
        isAnalyticsLoading
    } = props

    const { t } = useTranslation('reports')
    const authData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)
    const userCurrency = UserCurrencyValues.USD || authData?.currency

    const [deleteReport, { isLoading: isDeleteLoading }] = useDeleteReport()
    const [activeTab, setActiveTab] = useState<TabType>('analytics')

    const onTabChange = useCallback((tab: TabType) => {
        setActiveTab(tab)
    }, [])

    const onDeleteReport = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!window.confirm(String(t('Вы уверены, что хотите удалить запись?')))) return
        try {
            await deleteReport(report.id).unwrap()
        } catch (err) {
            console.error(err)
        }
    }, [deleteReport, report.id, t])

    const tabs: Array<{ key: TabType, label: string, icon: React.ElementType, badge?: string }> = [
        {
            key: 'analytics',
            label: t('Аналитика'),
            icon: BarChart3,
            badge: report.analytics?.csat
                ? `★ ${report.analytics.csat}`
                : undefined
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
            key: 'dialog',
            label: t('Диалог'),
            icon: MessageSquareText
        }
    ]

    const renderAnalyticsContent = () => {
        if (report.analytics) {
            return (
                <VStack gap="16" max>
                    {onRegenerateAnalytics && (
                        <HStack justify="end" max>
                            <Button
                                variant="glass-action"
                                size="m"
                                onClick={onRegenerateAnalytics}
                                disabled={isAnalyticsLoading}
                                id="regenerate-analytics-button"
                                addonLeft={isAnalyticsLoading
                                    ? <Loader className={cls.btnLoader} />
                                    : <RefreshCw size={16} />
                                }
                            >
                                {String(t('Переформировать аналитику'))}
                            </Button>
                        </HStack>
                    )}
                    <ReportShowAnalytics analytics={report.analytics} />
                </VStack>
            )
        }

        if (!onGetAnalytics && !onRegenerateAnalytics) {
            return (
                <VStack max align="center" justify="center" className={cls.emptyState}>
                    <Text text={String(t('Нет данных аналитики'))} />
                </VStack>
            )
        }

        const onEmptyAction = onGetAnalytics || onRegenerateAnalytics

        return (
            <VStack
                max
                align="center"
                justify="center"
                className={cls.emptyState}
            >
                <Button
                    variant="glass-action"
                    size="m"
                    onClick={onEmptyAction}
                    disabled={isAnalyticsLoading}
                    id="get-analytics-button"
                    addonLeft={isAnalyticsLoading
                        ? <Loader className={cls.btnLoader} />
                        : <Sparkles size={16} />
                    }
                >
                    {String(t('Получить аналитику'))}
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
            {isAdmin && (
                <HStack justify="end" max className={cls.actionsBar}>
                    <Button
                        variant="glass-action"
                        color="error"
                        size="m"
                        onClick={onDeleteReport}
                        disabled={isDeleteLoading}
                        id="delete-report-button"
                        addonLeft={isDeleteLoading
                            ? <Loader className={cls.btnLoader} />
                            : <Trash2 size={16} />
                        }
                    >
                        {String(t('Удалить запись'))}
                    </Button>
                </HStack>
            )}

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
                            onClick={() => { onTabChange(tab.key) }}
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
                            transcription={report.transcription}
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
