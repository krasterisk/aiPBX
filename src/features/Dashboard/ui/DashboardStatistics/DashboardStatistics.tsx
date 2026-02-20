import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Grid } from '@mui/material'
import { getUserAuthData, UserCurrencyValues } from '@/entities/User'
import { ReportFilters } from '@/entities/Report'
import { StatCard } from '../StatCard/StatCard'
import { formatTime } from '@/shared/lib/functions/formatTime'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'
import PhoneIcon from '@mui/icons-material/Phone'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import VpnKeyIcon from '@mui/icons-material/VpnKey' // Using for tokens/key
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import MemoryIcon from '@mui/icons-material/Memory'

interface DashboardStatisticsProps {
    data?: ReportFilters
    isLoading?: boolean
}

export const DashboardStatistics = memo(({ data, isLoading }: DashboardStatisticsProps) => {
    const { t } = useTranslation('reports')
    const authData = useSelector(getUserAuthData)
    const userCurrency = UserCurrencyValues.USD || authData?.currency

    const stats = useMemo(() => {
        const totalCalls = data?.allCount || 0
        const totalCost = data?.allCost || 0
        const totalDuration = data?.allDurationCount || 0
        const totalTokens = data?.allTokensCount || 0

        const avgCost = totalCalls > 0 ? totalCost / totalCalls : 0
        const avgDuration = totalCalls > 0 ? totalDuration / totalCalls : 0

        return [
            {
                title: t('Всего звонков'),
                value: totalCalls,
                icon: <PhoneIcon sx={{ fontSize: '3rem' }} />,
                description: t('Количество совершенных звонков')
            },
            {
                title: t('Средняя длительность'),
                value: formatTime(avgDuration, t),
                icon: <AccessTimeIcon sx={{ fontSize: '3rem' }} />,
                description: t('Среднее время разговора')
            },
            {
                title: t('Общая стоимость'),
                value: formatCurrency(totalCost, userCurrency),
                icon: <AttachMoneyIcon sx={{ fontSize: '3rem' }} />,
                description: t('Суммарные расходы за период')
            },
            {
                title: t('Средняя стоимость'),
                value: formatCurrency(avgCost, userCurrency),
                icon: <MonetizationOnIcon sx={{ fontSize: '3rem' }} />,
                description: t('Средняя стоимость разговора')
            },
            {
                title: t('Всего токенов'),
                value: new Intl.NumberFormat('ru-RU').format(totalTokens),
                icon: <VpnKeyIcon sx={{ fontSize: '3rem' }} />,
                description: t('Использовано AI токенов')
            },
            {
                title: t('Среднее количество токенов'),
                value: new Intl.NumberFormat('ru-RU').format(Math.round(totalCalls > 0 ? totalTokens / totalCalls : 0)),
                icon: <MemoryIcon sx={{ fontSize: '3rem' }} />,
                description: t('Среднее потребление токенов за звонок')
            }
        ]
    }, [data, t, userCurrency])

    return (
        <Grid container spacing={3}>
            {stats.map((stat, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <StatCard
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        description={stat.description}
                    />
                </Grid>
            ))}
        </Grid>
    )
})
