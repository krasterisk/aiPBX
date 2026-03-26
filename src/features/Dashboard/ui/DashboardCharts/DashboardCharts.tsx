import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { BarsChart } from '@/shared/ui/mui/BarsChart'
import { LinesChart } from '@/shared/ui/mui/LinesChart'
import { ReportFilters } from '@/entities/Report'
import { useSelector } from 'react-redux'
import { getUserAuthData, UserCurrencyValues, currencySymbols } from '@/entities/User'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack } from '@/shared/ui/redesigned/Stack'
import cls from './DashboardCharts.module.scss'

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
    const durationCount = data?.chartData?.map(item => Number(item.durationCount) / 60) || []
    const amount = data?.chartData?.map(item => Number(item.amount)) || []
    const label = data?.chartData?.map(item => String(item.label)) || []

    return (
        <VStack gap="16" max className={cls.DashboardCharts}>
            <div className={cls.chartsGrid}>
                {/* Calls & Duration */}
                <Card max variant="glass" border="partial" padding="24" className={cls.chartCard}>
                    <VStack gap="16" max>
                        <Text title={t('Активность звонков')} bold />
                        <div className={cls.chartWrapper}>
                            <BarsChart
                                xAxis={[{ scaleType: 'band', data: label }]}
                                series={[
                                    { data: ringsCount, label: String(t('Звонки')), color: '#5ed3f3' },
                                    { data: durationCount, label: String(t('Длительность (мин)')), color: '#a78bfa' }
                                ]}
                                height={320}
                            />
                        </div>
                    </VStack>
                </Card>

                {/* Cost */}
                <Card max variant="glass" border="partial" padding="24" className={cls.chartCard}>
                    <VStack gap="16" max>
                        <Text title={t('Расходы')} bold />
                        <div className={cls.chartWrapper}>
                            <BarsChart
                                xAxis={[{ scaleType: 'band', data: label }]}
                                series={[
                                    {
                                        data: amount,
                                        label: `${t('Стоимость')} (${currencySymbol})`,
                                        color: '#10b981'
                                    }
                                ]}
                                height={320}
                            />
                        </div>
                    </VStack>
                </Card>

                {/* Tokens */}
                <Card max variant="glass" border="partial" padding="24" className={cls.chartCard}>
                    <VStack gap="16" max>
                        <Text title={t('Использование токенов')} bold />
                        <div className={cls.chartWrapper}>
                            <LinesChart
                                height={300}
                                series={[
                                    {
                                        data: tokensCount,
                                        label: String(t('Токены')),
                                        color: '#a78bfa',
                                        curve: 'monotoneX',
                                        showMark: true,
                                    }
                                ]}
                                xAxis={[{ scaleType: 'point', data: label }]}
                            />
                        </div>
                    </VStack>
                </Card>

                {/* Calls Trend */}
                <Card max variant="glass" border="partial" padding="24" className={cls.chartCard}>
                    <VStack gap="16" max>
                        <Text title={t('Динамика звонков')} bold />
                        <div className={cls.chartWrapper}>
                            <LinesChart
                                height={300}
                                series={[
                                    {
                                        data: ringsCount,
                                        label: String(t('Звонки')),
                                        curve: 'monotoneX',
                                        color: '#5ed3f3',
                                        showMark: true,
                                    }
                                ]}
                                xAxis={[{ scaleType: 'point', data: label }]}
                            />
                        </div>
                    </VStack>
                </Card>
            </div>
        </VStack>
    )
})
