import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportShowAnalytics.module.scss'
import React, { memo } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Card } from '@/shared/ui/redesigned/Card'
import { Analytics, DefaultMetricKey } from '../../model/types/report'
import { useTranslation } from 'react-i18next'
import {
    GitBranch,
    Smile,
    Target,
    TrendingUp,
    MessageSquareText,
    BarChart3,
    CheckCircle,
    AlertCircle,
    Puzzle
} from 'lucide-react'

// ── Operator metric labels (reused from OperatorDashboard) ───────────────────
const OPERATOR_METRIC_LABELS: Array<{ key: DefaultMetricKey, labelKey: string }> = [
    { key: 'greeting_quality', labelKey: 'Качество приветствия' },
    { key: 'script_compliance', labelKey: 'Следование скрипту' },
    { key: 'politeness_empathy', labelKey: 'Вежливость и эмпатия' },
    { key: 'active_listening', labelKey: 'Активное слушание' },
    { key: 'objection_handling', labelKey: 'Работа с возражениями' },
    { key: 'product_knowledge', labelKey: 'Знание продукта' },
    { key: 'problem_resolution', labelKey: 'Решение проблемы' },
    { key: 'speech_clarity_pace', labelKey: 'Темп речи' },
    { key: 'closing_quality', labelKey: 'Качество завершения' },
]

/**
 * Detect whether metrics object contains flat operator metrics
 * (greeting_quality, script_compliance, etc.) vs nested bot-call metrics.
 */
const isOperatorMetrics = (metrics: Record<string, any>): boolean => {
    return typeof metrics.greeting_quality === 'number'
}

/** All known (non-custom) metric keys in the flat operator format */
const KNOWN_METRIC_KEYS = new Set([
    ...OPERATOR_METRIC_LABELS.map(m => m.key),
    'customer_sentiment', 'summary', 'success', 'csat',
])

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

    // ── Common helpers ────────────────────────────────────────────────────────
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

    // ── Operator analytics (flat metrics) ─────────────────────────────────────
    if (metrics && isOperatorMetrics(metrics)) {
        const summary = metrics.summary || analytics.summary
        const sentiment = metrics.customer_sentiment || analytics.sentiment
        const success = metrics.success
        const csat = metrics.csat ?? analytics.csat

        const barMetrics = OPERATOR_METRIC_LABELS
            .filter(m => metrics[m.key] != null)
            .map(m => ({
                key: m.key,
                label: String(t(m.labelKey)),
                value: metrics[m.key] as number,
            }))

        return (
            <VStack
                gap="16"
                className={classNames(cls.ReportShowAnalytics, {}, [className])}
                max
                data-testid="analytics-operator"
            >
                {/* Summary */}
                {summary && (
                    <Card variant="outlined" className={cls.summaryCard} max>
                        <VStack gap="8">
                            {renderCardTitle(t('Саммари диалога'), MessageSquareText)}
                            <Text text={summary} />
                        </VStack>
                    </Card>
                )}

                {/* Info badges: sentiment, success, csat */}
                <div className={cls.operatorInfoRow}>
                    {sentiment && (
                        <span
                            className={cls.sentimentBadge}
                            data-sentiment={sentiment.toLowerCase()}
                        >
                            <Smile size={14} />
                            {String(t(sentiment))}
                        </span>
                    )}
                    {success != null && (
                        <span
                            className={cls.successBadge}
                            data-success={String(success)}
                        >
                            {success
                                ? <><CheckCircle size={14} /> {String(t('Успех'))}</>
                                : <><AlertCircle size={14} /> {String(t('Неуспешно'))}</>
                            }
                        </span>
                    )}
                    {csat != null && (
                        <span className={cls.sentimentBadge} data-sentiment="positive">
                            ★ {csat}
                        </span>
                    )}
                </div>

                {/* Progress bars for numeric metrics */}
                {barMetrics.length > 0 && (
                    <Card variant="light" className={cls.gridItem} max>
                        <VStack gap="12" max>
                            {renderCardTitle(t('Оценка оператора'), BarChart3)}
                            <VStack gap="8" max>
                                {barMetrics.map(m => {
                                    const level = m.value >= 80 ? 'high' : m.value >= 50 ? 'mid' : 'low'
                                    const color = level === 'high'
                                        ? 'var(--status-success, #22c55e)'
                                        : level === 'mid'
                                            ? 'var(--status-warning, #f59e0b)'
                                            : 'var(--status-error, #ef4444)'
                                    return (
                                        <VStack key={m.key} gap="4" max>
                                            <HStack max justify="between">
                                                <Text text={m.label} size="s" />
                                                <Text
                                                    text={String(m.value)}
                                                    size="s"
                                                    bold
                                                    variant={level === 'high' ? 'success' : level === 'mid' ? 'warning' : 'error'}
                                                />
                                            </HStack>
                                            <div className={cls.metricBarTrack}>
                                                <div
                                                    className={cls.metricBarFill}
                                                    style={{ width: `${m.value}%`, backgroundColor: color }}
                                                    data-testid={`metric-bar-${m.key}`}
                                                />
                                            </div>
                                        </VStack>
                                    )
                                })}
                            </VStack>
                        </VStack>
                    </Card>
                )}

                {/* Custom metrics — all keys not in KNOWN_METRIC_KEYS */}
                {(() => {
                    const customEntries = Object.entries(metrics)
                        .filter(([key]) => !KNOWN_METRIC_KEYS.has(key))
                    if (!customEntries.length) return null
                    return (
                        <Card variant="light" className={cls.gridItem} max data-testid="custom-metrics-card">
                            <VStack gap="12" max>
                                {renderCardTitle(t('Кастомные метрики'), Puzzle)}
                                <VStack gap="8" max>
                                    {customEntries.map(([key, value]) => {
                                        if (typeof value === 'boolean') {
                                            return (
                                                <HStack key={key} justify="between" max>
                                                    <Text text={key} size="s" className={cls.metricLabel} />
                                                    <span
                                                        className={cls.successBadge}
                                                        data-success={String(value)}
                                                    >
                                                        {value
                                                            ? <><CheckCircle size={14} /> {String(t('Да'))}</>
                                                            : <><AlertCircle size={14} /> {String(t('Нет'))}</>
                                                        }
                                                    </span>
                                                </HStack>
                                            )
                                        }
                                        if (typeof value === 'number') {
                                            const level = value >= 80 ? 'high' : value >= 50 ? 'mid' : 'low'
                                            const color = level === 'high'
                                                ? 'var(--status-success, #22c55e)'
                                                : level === 'mid'
                                                    ? 'var(--status-warning, #f59e0b)'
                                                    : 'var(--status-error, #ef4444)'
                                            return (
                                                <VStack key={key} gap="4" max>
                                                    <HStack max justify="between">
                                                        <Text text={key} size="s" />
                                                        <Text
                                                            text={String(value)}
                                                            size="s"
                                                            bold
                                                            variant={level === 'high' ? 'success' : level === 'mid' ? 'warning' : 'error'}
                                                        />
                                                    </HStack>
                                                    <div className={cls.metricBarTrack}>
                                                        <div
                                                            className={cls.metricBarFill}
                                                            style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
                                                            data-testid={`metric-bar-custom-${key}`}
                                                        />
                                                    </div>
                                                </VStack>
                                            )
                                        }
                                        // string / enum
                                        return renderMetricItem(key, String(value ?? '-'))
                                    })}
                                </VStack>
                            </VStack>
                        </Card>
                    )
                })()}
            </VStack>
        )
    }

    // ── Bot-call analytics (nested metrics) ───────────────────────────────────
    const businessImpact = metrics?.business_impact
    const scenarioAnalysis = metrics?.scenario_analysis
    const userSatisfaction = metrics?.user_satisfaction
    const accuracyAndEfficiency = metrics?.accuracy_and_efficiency

    const sentiment = userSatisfaction?.sentiment || analytics.sentiment
    const csat = userSatisfaction?.csat ?? analytics.csat
    const summary = scenarioAnalysis?.summary || analytics.summary

    return (
        <VStack
            gap="16"
            className={classNames(cls.ReportShowAnalytics, {}, [className])}
            max
            data-testid="analytics-bot"
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
