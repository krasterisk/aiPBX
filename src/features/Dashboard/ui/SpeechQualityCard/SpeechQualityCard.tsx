import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { LinearProgress } from '@mui/material'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { AggregatedAIMetrics } from '@/entities/Report'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './SpeechQualityCard.module.scss'

interface SpeechQualityCardProps {
    className?: string
    metrics?: AggregatedAIMetrics
    isLoading?: boolean
}

interface QualityBarProps {
    label: string
    value: number
    max: number
    color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

const QualityBar = memo(({ label, value, max, color }: QualityBarProps) => {
    const percentage = Math.min((value / max) * 100, 100)
    const barColor = color || (percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'error')

    return (
        <div className={cls.barItem}>
            <div className={cls.barHeader}>
                <Text text={label} className={cls.barLabel} />
                <Text text={`${value.toFixed(1)}${max === 5 ? '/5' : '%'}`} className={cls.barValue} bold />
            </div>
            <LinearProgress
                variant="determinate"
                value={percentage}
                color={barColor}
                sx={{
                    height: 8,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--glass-overlay-medium)',
                    '& .MuiLinearProgress-bar': {
                        borderRadius: 'var(--radius-sm)'
                    }
                }}
            />
        </div>
    )
})

export const SpeechQualityCard = memo((props: SpeechQualityCardProps) => {
    const { className, metrics, isLoading } = props
    const { t } = useTranslation('reports')

    const qualityMetrics = [
        {
            label: t('WER Score'),
            value: metrics?.avgWerEstimated || 0,
            max: 100
        },
        {
            label: t('Response Latency'),
            value: metrics?.avgResponseLatencyScore || 0,
            max: 100
        },
        {
            label: t('MOS'),
            value: metrics?.avgMos || 0,
            max: 5
        },
        {
            label: t('Self Recovery'),
            value: (metrics?.selfRecoveryRate || 0) * 100,
            max: 100
        }
    ]

    return (
        <Card
            max
            variant="glass"
            border="partial"
            padding="24"
            className={classNames(cls.SpeechQualityCard, {}, [className])}
        >
            <VStack gap="16" max>
                <Text title={t('Speech and Interaction Quality')} bold />
                <div className={cls.barsGrid}>
                    {qualityMetrics.map((metric, index) => (
                        <QualityBar
                            key={index}
                            label={metric.label}
                            value={metric.value}
                            max={metric.max}
                        />
                    ))}
                </div>
            </VStack>
        </Card>
    )
})
