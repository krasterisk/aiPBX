import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportShowAnalytics.module.scss'
import React, { memo } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Card } from '@/shared/ui/redesigned/Card'
import { Analytics } from '../../model/types/report'
import { useTranslation } from 'react-i18next'
import {
    GitBranch,
    Smile,
    Star,
    Target,
    TrendingUp,
    MessageSquareText
} from 'lucide-react'

interface ReportShowAnalyticsProps {
    className?: string
    analytics: Analytics
}

export const ReportShowAnalytics = memo((props: ReportShowAnalyticsProps) => {
    const {
        className,
        analytics
    } = props

    const { t } = useTranslation('reports')

    const metrics = analytics.metrics

    const businessImpact = metrics?.business_impact
    const scenarioAnalysis = metrics?.scenario_analysis
    const userSatisfaction = metrics?.user_satisfaction
    const accuracyAndEfficiency = metrics?.accuracy_and_efficiency
    // const speechAndInteractionQuality = metrics?.speech_and_interaction_quality

    // Fallback values if metrics is missing or partial
    const sentiment = userSatisfaction?.sentiment || analytics.sentiment
    const csat = userSatisfaction?.csat ?? analytics.csat
    const summary = scenarioAnalysis?.summary || analytics.summary

    const renderMetricItem = (label: string, value: React.ReactNode) => (
        <HStack justify="between" max>
            <Text text={label} size="s" className={cls.metricLabel} />
            <Text text={String(value ?? '-')} size="s" bold />
        </HStack>
    )

    const renderCardTitle = (title: string, Icon: React.ElementType) => (
        <HStack gap="8" className={cls.titleRow}>
            <div className={cls.iconWrapper}>
                <Icon size={20} />
            </div>
            <Text title={title} size="m" bold />
        </HStack>
    )

    return (
        <VStack
            gap="16"
            className={classNames(cls.ReportShowAnalytics, {}, [className])}
            max
        >
            {/* Main Summary */}
            {summary && (
                <Card variant="outlined" className={cls.summaryCard} max>
                    <VStack gap="8">
                        {renderCardTitle(t('Саммари диалога'), MessageSquareText)}
                        <Text text={summary} />
                    </VStack>
                </Card>
            )}

            <div className={cls.gridContainer}>
                {/* Business Impact */}
                {businessImpact && (
                    <Card variant="light" className={cls.gridItem}>
                        <VStack gap="12" max>
                            {renderCardTitle(t('Влияние на бизнес'), TrendingUp)}
                            <VStack gap="8" max>
                                {renderMetricItem(t('Уровень автоматизации'), businessImpact.automation_rate)}
                                {renderMetricItem(t('Уровень эскалации'), businessImpact.escalation_rate)}
                                {renderMetricItem(t('Экономия затрат'), businessImpact.cost_savings_estimated)}
                            </VStack>
                        </VStack>
                    </Card>
                )}

                {/* Scenario Analysis */}
                {scenarioAnalysis && (
                    <Card variant="light" className={cls.gridItem}>
                        <VStack gap="12" max>
                            {renderCardTitle(t('Анализ сценария'), GitBranch)}
                            <VStack gap="8" max>
                                {renderMetricItem(t('Успех'), scenarioAnalysis.success ? t('Да') : t('Нет'))}
                                {renderMetricItem(t('Причина эскалации'), scenarioAnalysis.escalation_reason || '-')}
                            </VStack>
                        </VStack>
                    </Card>
                )}

                {/* User Satisfaction */}
                {userSatisfaction && (
                    <Card variant="light" className={cls.gridItem}>
                        <VStack gap="12" max>
                            {renderCardTitle(t('Удовлетворенность'), Smile)}
                            <VStack gap="8" max>
                                {renderMetricItem(t('Сентимент'), sentiment || '-')}
                                {renderMetricItem(t('Отказ'), userSatisfaction.bail_out_rate ? t('Да') : t('Нет'))}
                                {renderMetricItem(t('Фрустрация'), userSatisfaction.frustration_detected ? t('Да') : t('Нет'))}
                            </VStack>
                        </VStack>
                    </Card>
                )}

                {/* Accuracy & Efficiency */}
                {accuracyAndEfficiency && (
                    <Card variant="light" className={cls.gridItem}>
                        <VStack gap="12" max>
                            {renderCardTitle(t('Точность и эффективность'), Target)}
                            <VStack gap="8" max>
                                {renderMetricItem(t('Среднее кол-во ходов'), accuracyAndEfficiency.average_turns)}
                                {renderMetricItem(t('Завершение диалога'), accuracyAndEfficiency.dialog_completion_rate)}
                                {renderMetricItem(t('Извлечение сущностей'), `${accuracyAndEfficiency.entity_extraction_rate}%`)}
                                {renderMetricItem(t('Удержание контекста'), `${accuracyAndEfficiency.context_retention_score}%`)}
                            </VStack>
                        </VStack>
                    </Card>
                )}
            </div>
        </VStack>
    )
})
