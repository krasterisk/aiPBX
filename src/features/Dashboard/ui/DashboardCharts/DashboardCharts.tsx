import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { BarsChart } from '@/shared/ui/mui/BarsChart'
import { LinesChart } from '@/shared/ui/mui/LinesChart'
import { Grid } from '@mui/material'
import { ReportFilters } from '@/entities/Report'
import { useSelector } from 'react-redux'
import { getUserAuthData, UserCurrencyValues } from '@/entities/User'
import { currencySymbols } from '@/entities/User/model/consts/consts'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack } from '@/shared/ui/redesigned/Stack'

interface DashboardChartsProps {
    data?: ReportFilters
}

export const DashboardCharts = memo(({ data }: DashboardChartsProps) => {
    const { t } = useTranslation('reports')
    const authData = useSelector(getUserAuthData)
    const userCurrency = UserCurrencyValues.USD || authData?.currency
    const currencySymbol = currencySymbols[userCurrency] || '$'

    const ringsCount = data?.chartData?.map(item => Number(item.allCount)) || []
    const tokensCount = data?.chartData?.map(item => Number(item.tokensCount)) || []
    const durationCount = data?.chartData?.map(item => Number(item.durationCount) / 60) || [] // Convert to minutes
    const amount = data?.chartData?.map(item => Number(item.amount)) || []
    const label = data?.chartData?.map(item => String(item.label)) || []

    return (
        <Grid container spacing={3}>
            {/* Main Overview: Calls & Duration */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Card max border="partial" padding="24">
                    <VStack gap="16" max>
                        <Text title={t('Активность звонков')} bold />
                        <BarsChart
                            xAxis={[{ scaleType: 'band', data: label }]}
                            series={[
                                { data: ringsCount, label: String(t('Звонки')) },
                                { data: durationCount, label: String(t('Длительность (мин)')) }
                            ]}
                            height={350}
                        />
                    </VStack>
                </Card>
            </Grid>

            {/* Financials: Cost */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Card max border="partial" padding="24" className="fullHeight">
                    <VStack gap="16" max>
                        <Text title={t('Расходы')} bold />
                        <BarsChart
                            xAxis={[{ scaleType: 'band', data: label }]}
                            series={[
                                {
                                    data: amount,
                                    label: `${t('Стоимость')} (${currencySymbol})`,
                                    color: '#10b981' // --chart-success
                                }
                            ]}
                            height={350}
                        />
                    </VStack>
                </Card>
            </Grid>

            {/* AI Usage: Tokens */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Card max border="partial" padding="24">
                    <VStack gap="16" max>
                        <Text title={t('Использование токенов')} bold />
                        <LinesChart
                            height={300}
                            series={[
                                {
                                    data: tokensCount,
                                    label: String(t('Токены')),
                                    color: '#a78bfa' // --chart-purple
                                }
                            ]}
                            xAxis={[{ scaleType: 'point', data: label }]}
                        />
                    </VStack>
                </Card>
            </Grid>

            {/* Trend Analysis: Calls (Line) */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Card max border="partial" padding="24">
                    <VStack gap="16" max>
                        <Text title={t('Динамика звонков')} bold />
                        <LinesChart
                            height={300}
                            series={[
                                {
                                    data: ringsCount,
                                    label: String(t('Звонки')),
                                    curve: 'linear',
                                    color: '#3b82f6' // --chart-info
                                }
                            ]}
                            xAxis={[{ scaleType: 'point', data: label }]}
                        />
                    </VStack>
                </Card>
            </Grid>
        </Grid>
    )
})
