import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import PhoneIcon from '@mui/icons-material/Phone'
import PaidIcon from '@mui/icons-material/Paid'
import TokenIcon from '@mui/icons-material/Token'
import SpeedIcon from '@mui/icons-material/Speed'
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { StatCard } from '../StatCard/StatCard'
import { AIAnalyticsResponse } from '@/entities/Report'

interface SummaryStatsRowProps {
    className?: string
    data?: AIAnalyticsResponse
    isLoading?: boolean
}

export const SummaryStatsRow = memo((props: SummaryStatsRowProps) => {
    const { className, data, isLoading } = props
    const { t } = useTranslation('reports')

    const stats = [
        {
            title: t('Всего звонков'),
            value: data?.totalCalls ?? 0,
            description: t('Количество совершенных звонков'),
            icon: <PhoneIcon sx={{ fontSize: '1.5rem' }} />,
            variant: 'primary' as const
        },
        {
            title: t('Общая стоимость'),
            value: `$${(data?.totalCost ?? 0).toFixed(2)}`,
            description: t('Суммарные расходы за период'),
            icon: <PaidIcon sx={{ fontSize: '1.5rem' }} />,
            variant: 'warning' as const
        },
        {
            title: t('Всего токенов'),
            value: (data?.totalTokens ?? 0).toLocaleString(),
            description: t('Использовано AI токенов'),
            icon: <TokenIcon sx={{ fontSize: '1.5rem' }} />,
            variant: 'primary' as const
        },
        {
            title: t('CSAT'),
            value: `${(data?.metrics?.avgCsat ?? 0).toFixed(1)}/5`,
            description: t('Удовлетворенность'),
            icon: <SentimentSatisfiedIcon sx={{ fontSize: '1.5rem' }} />,
            variant: (data?.metrics?.avgCsat ?? 0) >= 4 ? 'success' as const : 'warning' as const
        },
        {
            title: t('MOS'),
            value: (data?.metrics?.avgMos ?? 0).toFixed(2),
            description: t('Speech and Interaction Quality'),
            icon: <SpeedIcon sx={{ fontSize: '1.5rem' }} />,
            variant: (data?.metrics?.avgMos ?? 0) >= 4 ? 'success' as const : 'warning' as const
        },
        {
            title: t('Automation Rate'),
            value: `${((data?.metrics?.automationRate ?? 0) * 100).toFixed(1)}%`,
            description: t('Business Impact'),
            icon: <SmartToyIcon sx={{ fontSize: '1.5rem' }} />,
            variant: 'success' as const
        }
    ]

    return (
        <Grid container spacing={2} className={className}>
            {stats.map((stat, index) => (
                <Grid size={{ xs: 6, md: 4, lg: 2 }} key={index}>
                    <StatCard
                        title={stat.title}
                        value={stat.value}
                        description={stat.description}
                        icon={stat.icon}
                        isLoading={isLoading}
                        variant={stat.variant}
                    />
                </Grid>
            ))}
        </Grid>
    )
})
