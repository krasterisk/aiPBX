import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SavingsIcon from '@mui/icons-material/Savings'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { TrendIndicator } from '@/shared/ui/redesigned/TrendIndicator'
import { AggregatedAIMetrics } from '@/entities/Report'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './BusinessImpactCard.module.scss'

interface BusinessImpactCardProps {
    className?: string
    metrics?: AggregatedAIMetrics
    isLoading?: boolean
}

export const BusinessImpactCard = memo((props: BusinessImpactCardProps) => {
    const { className, metrics, isLoading } = props
    const { t } = useTranslation('reports')

    const businessMetrics = [
        {
            icon: <TrendingDownIcon sx={{ fontSize: '1.5rem' }} />,
            label: t('Escalation Rate'),
            value: `${((metrics?.escalationRate || 0) * 100).toFixed(1)}%`
        },
        {
            icon: <SmartToyIcon sx={{ fontSize: '1.5rem' }} />,
            label: t('Automation Rate'),
            value: `${((metrics?.automationRate || 0) * 100).toFixed(1)}%`
        },
        {
            icon: <SavingsIcon sx={{ fontSize: '1.5rem' }} />,
            label: t('Cost Savings'),
            value: `${((metrics?.avgCostSavingsEstimated || 0) * 100).toFixed(1)}%`
        }
    ]

    return (
        <Card
            max
            variant="glass"
            border="partial"
            padding="24"
            className={classNames(cls.BusinessImpactCard, {}, [className])}
        >
            <div className={cls.cardContent}>
                <Text title={t('Business Impact')} bold />
                <div className={cls.metricsGrid}>
                    {businessMetrics.map((metric, index) => (
                        <div className={cls.metricItem} key={index}>
                            <div className={cls.iconWrapper}>{metric.icon}</div>
                            <Text text={metric.label} className={cls.label} />
                            <Text title={metric.value} className={cls.value} bold />
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
})
