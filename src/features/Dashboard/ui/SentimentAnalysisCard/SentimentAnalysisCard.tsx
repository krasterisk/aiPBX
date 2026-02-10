import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { PieChart } from '@mui/x-charts/PieChart'
import StarIcon from '@mui/icons-material/Star'
import WarningIcon from '@mui/icons-material/Warning'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { AggregatedAIMetrics } from '@/entities/Report'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './SentimentAnalysisCard.module.scss'

interface SentimentAnalysisCardProps {
    className?: string
    metrics?: AggregatedAIMetrics
    isLoading?: boolean
}

export const SentimentAnalysisCard = memo((props: SentimentAnalysisCardProps) => {
    const { className, metrics, isLoading } = props
    const { t } = useTranslation('reports')

    // Using design system status colors
    const sentimentData = [
        {
            id: 0,
            value: metrics?.sentimentDistribution?.positive || 0,
            label: t('Positive'),
            color: '#10b981' // --status-success
        },
        {
            id: 1,
            value: metrics?.sentimentDistribution?.neutral || 0,
            label: t('Neutral'),
            color: '#9ca3af' // --status-neutral
        },
        {
            id: 2,
            value: metrics?.sentimentDistribution?.negative || 0,
            label: t('Negative'),
            color: '#ef4444' // --status-error
        }
    ]

    const additionalMetrics = [
        {
            icon: <StarIcon />,
            label: t('CSAT'),
            value: `${(metrics?.avgCsat || 0).toFixed(1)}/5`,
            color: 'var(--status-success)'
        },
        {
            icon: <WarningIcon />,
            label: t('Frustration Detected'),
            value: `${(metrics?.frustrationDetectedRate || 0).toFixed(1)}%`,
            color: 'var(--status-warning)'
        },
        {
            icon: <ExitToAppIcon />,
            label: t('Bail Out Rate'),
            value: `${(metrics?.bailOutRate || 0).toFixed(1)}%`,
            color: 'var(--status-error)'
        }
    ]

    return (
        <Card
            max
            variant="glass"
            border="partial"
            padding="24"
            className={classNames(cls.SentimentAnalysisCard, {}, [className])}
        >
            <VStack gap="16" max>
                <Text title={t('Customer Sentiment')} bold />
                <div className={cls.layout}>
                    <div className={cls.chartSection}>
                        <PieChart
                            series={[
                                {
                                    data: sentimentData,
                                    highlightScope: { fade: 'global', highlight: 'item' },
                                    innerRadius: 40,
                                    outerRadius: 80,
                                    paddingAngle: 2,
                                    cornerRadius: 4
                                }
                            ]}
                            height={220}
                            margin={{ top: 10, bottom: 50, left: 0, right: 0 }}
                            slotProps={{
                                legend: {
                                    position: { vertical: 'bottom', horizontal: 'center' },
                                }
                            }}
                            sx={{
                                '& .MuiChartsLegend-series': {
                                    gap: '16px'
                                },
                                '& .MuiChartsLegend-label': {
                                    color: 'var(--text-redesigned) !important',
                                    fill: 'var(--text-redesigned) !important'
                                }
                            }}
                        />
                    </div>
                    <div className={cls.metricsSection}>
                        {additionalMetrics.map((metric, index) => (
                            <HStack key={index} gap="12" align="center" className={cls.metricRow}>
                                <div className={cls.iconWrapper} style={{ color: metric.color }}>
                                    {metric.icon}
                                </div>
                                <VStack gap="4" max>
                                    <Text text={metric.label} className={cls.metricLabel} />
                                    <Text title={metric.value} bold />
                                </VStack>
                            </HStack>
                        ))}
                    </div>
                </div>
            </VStack>
        </Card>
    )
})
