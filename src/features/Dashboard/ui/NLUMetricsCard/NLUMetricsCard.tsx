import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { ProgressRing } from '@/shared/ui/redesigned/ProgressRing'
import { AggregatedAIMetrics } from '@/entities/Report'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './NLUMetricsCard.module.scss'

interface NLUMetricsCardProps {
    className?: string
    metrics?: AggregatedAIMetrics
    isLoading?: boolean
}

const getColorByValue = (value: number): string => {
    if (value >= 90) return 'var(--status-success)'
    if (value >= 70) return 'var(--status-warning)'
    return 'var(--status-error)'
}

export const NLUMetricsCard = memo((props: NLUMetricsCardProps) => {
    const { className, metrics, isLoading } = props
    const { t } = useTranslation('reports')

    const nluMetrics = [
        {
            label: t('Intent Recognition'),
            value: metrics?.avgIntentRecognitionRate || 0
        },
        {
            label: t('Entity Extraction'),
            value: metrics?.avgEntityExtractionRate || 0
        },
        {
            label: t('Dialog Completion'),
            value: (metrics?.dialogCompletionRate || 0) * 100
        },
        {
            label: t('Context Retention'),
            value: metrics?.avgContextRetentionScore || 0
        }
    ]

    return (
        <Card
            max
            border="partial"
            padding="24"
            className={classNames(cls.NLUMetricsCard, {}, [className])}
        >
            <VStack gap="16" max>
                <Text title={t('Natural Language Understanding')} bold />
                <Grid container spacing={3}>
                    {nluMetrics.map((metric, index) => (
                        <Grid size={{ xs: 6, md: 3 }} key={index}>
                            <VStack gap="8" align="center" className={cls.metricWrapper}>
                                <ProgressRing
                                    value={metric.value}
                                    color={getColorByValue(metric.value)}
                                    size={100}
                                    thickness={6}
                                    showPercentage={true}
                                    label=""
                                />
                                <Text
                                    text={metric.label}
                                    className={cls.metricLabel}
                                    align="center"
                                />
                            </VStack>
                        </Grid>
                    ))}
                </Grid>
            </VStack>
        </Card>
    )
})
