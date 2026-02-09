import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'
import { BarChart } from '@mui/x-charts/BarChart'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { TimeSeriesPoint } from '@/entities/Report'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './TimeSeriesCharts.module.scss'

interface TimeSeriesChartsProps {
    className?: string
    timeSeries?: TimeSeriesPoint[]
    isLoading?: boolean
}

// Resolved color constants (MUI X Charts can't use CSS vars)
const CHART_COLORS = {
    calls: '#5ed3f3',
    csat: '#4caf50',
    mos: '#ff9800',
    automation: '#9c27b0',
    cost: '#f44336',
    tokens: '#2196f3'
}

export const TimeSeriesCharts = memo((props: TimeSeriesChartsProps) => {
    const { className, timeSeries = [], isLoading } = props
    const { t } = useTranslation('reports')

    const labels = useMemo(() => timeSeries.map(p => p.label), [timeSeries])
    const callsData = useMemo(() => timeSeries.map(p => p.callsCount), [timeSeries])
    const csatData = useMemo(() => timeSeries.map(p => p.avgCsat), [timeSeries])
    const mosData = useMemo(() => timeSeries.map(p => p.avgMos), [timeSeries])
    const automationData = useMemo(() => timeSeries.map(p => p.automationRate * 100), [timeSeries])
    const costData = useMemo(() => timeSeries.map(p => p.totalCost), [timeSeries])
    const tokensData = useMemo(() => timeSeries.map(p => p.totalTokens), [timeSeries])

    if (timeSeries.length === 0) {
        return null
    }

    const commonXAxis = [{
        scaleType: 'band' as const,
        data: labels,
        tickLabelStyle: {
            fill: '#8b96a5',
            fontSize: 11
        }
    }]

    return (
        <VStack gap="16" max className={classNames(cls.TimeSeriesCharts, {}, [className])}>
            {/* Row 1: Calls Activity + Cost */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card max border="partial" padding="24" className={cls.chartCard}>
                        <VStack gap="12" max>
                            <Text title={t('Активность звонков')} bold />
                            <div className={cls.chartWrapper}>
                                <BarChart
                                    xAxis={commonXAxis}
                                    series={[{
                                        data: callsData,
                                        label: String(t('Звонки')),
                                        color: CHART_COLORS.calls
                                    }]}
                                    height={280}
                                    hideLegend
                                    sx={{
                                        '& .MuiChartsAxis-tickLabel': {
                                            fill: '#8b96a5 !important'
                                        },
                                        '& .MuiChartsAxis-label': {
                                            fill: '#8b96a5 !important'
                                        }
                                    }}
                                />
                            </div>
                        </VStack>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card max border="partial" padding="24" className={cls.chartCard}>
                        <VStack gap="12" max>
                            <Text title={t('Расходы')} bold />
                            <div className={cls.chartWrapper}>
                                <LineChart
                                    xAxis={commonXAxis}
                                    series={[{
                                        data: costData,
                                        label: String(t('Стоимость')),
                                        color: CHART_COLORS.cost,
                                        area: true
                                    }]}
                                    height={280}
                                    hideLegend
                                    sx={{
                                        '& .MuiChartsAxis-tickLabel': {
                                            fill: '#8b96a5 !important'
                                        },
                                        '& .MuiAreaElement-root': {
                                            opacity: 0.15
                                        }
                                    }}
                                />
                            </div>
                        </VStack>
                    </Card>
                </Grid>
            </Grid>

            {/* Row 2: CSAT & MOS Trends + Automation Rate */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card max border="partial" padding="24" className={cls.chartCard}>
                        <VStack gap="12" max>
                            <Text title={t('CSAT') + ' & ' + t('MOS')} bold />
                            <div className={cls.chartWrapper}>
                                <LineChart
                                    xAxis={commonXAxis}
                                    yAxis={[
                                        { id: 'csat', min: 0, max: 5 }
                                    ]}
                                    series={[
                                        {
                                            data: csatData,
                                            label: 'CSAT',
                                            color: CHART_COLORS.csat,
                                            yAxisId: 'csat'
                                        },
                                        {
                                            data: mosData,
                                            label: 'MOS',
                                            color: CHART_COLORS.mos,
                                            yAxisId: 'csat'
                                        }
                                    ]}
                                    height={280}
                                    slotProps={{
                                        legend: {
                                            position: { vertical: 'top', horizontal: 'end' }
                                        }
                                    }}
                                    sx={{
                                        '& .MuiChartsAxis-tickLabel': {
                                            fill: '#8b96a5 !important'
                                        },
                                        '& .MuiChartsLegend-label': {
                                            fill: '#8b96a5 !important'
                                        }
                                    }}
                                />
                            </div>
                        </VStack>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <Card max border="partial" padding="24" className={cls.chartCard}>
                        <VStack gap="12" max>
                            <Text title={t('Использование токенов')} bold />
                            <div className={cls.chartWrapper}>
                                <BarChart
                                    xAxis={commonXAxis}
                                    series={[{
                                        data: tokensData,
                                        label: String(t('Токены')),
                                        color: CHART_COLORS.tokens
                                    }]}
                                    height={280}
                                    hideLegend
                                    sx={{
                                        '& .MuiChartsAxis-tickLabel': {
                                            fill: '#8b96a5 !important'
                                        }
                                    }}
                                />
                            </div>
                        </VStack>
                    </Card>
                </Grid>
            </Grid>
        </VStack>
    )
})
