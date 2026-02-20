import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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

/**
 * Chart color palette — resolved hex values matching CSS vars from design-system.scss
 * MUI X Charts require resolved hex in series[].color (CSS vars not supported)
 *
 * --chart-primary   = --accent-redesigned  = #5ed3f3
 * --chart-success   = --status-success     = #10b981
 * --chart-warning   = --status-warning     = #f59e0b
 * --chart-error     = --status-error       = #ef4444
 * --chart-info      = --status-info        = #3b82f6
 * --chart-purple    =                        #a78bfa
 */
const CHART_COLORS = {
    calls: '#5ed3f3', // --chart-primary
    csat: '#10b981', // --chart-success
    mos: '#f59e0b', // --chart-warning
    automation: '#a78bfa', // --chart-purple
    cost: '#ef4444', // --chart-error
    tokens: '#3b82f6' // --chart-info
}

/** Common MUI chart sx: axis labels & legend use system CSS vars */
const chartSxBase = {
    '& .MuiChartsAxis-tickLabel': {
        fill: 'var(--chart-axis-label) !important'
    },
    '& .MuiChartsAxis-label': {
        fill: 'var(--chart-axis-label) !important'
    },
    '& .MuiChartsLegend-label': {
        fill: 'var(--chart-legend-label) !important'
    }
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
            fill: '#74a2b2', // --icon-redesigned (resolved for XAxis which needs inline)
            fontSize: 11
        }
    }]

    return (
        <VStack gap="16" max className={classNames(cls.TimeSeriesCharts, {}, [className])}>
            {/* Row 1: Calls Activity + Cost */}
            <div className={cls.row}>
                <div className={cls.col50}>
                    <Card max variant="glass" border="partial" padding="24" className={cls.chartCard}>
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
                                    sx={chartSxBase}
                                />
                            </div>
                        </VStack>
                    </Card>
                </div>
                <div className={cls.col50}>
                    <Card max variant="glass" border="partial" padding="24" className={cls.chartCard}>
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
                                        ...chartSxBase,
                                        '& .MuiAreaElement-root': {
                                            opacity: 0.15
                                        }
                                    }}
                                />
                            </div>
                        </VStack>
                    </Card>
                </div>
            </div>

            {/* Row 2: CSAT & MOS Trends + Token Usage */}
            <div className={cls.row}>
                <div className={cls.col50}>
                    <Card max variant="glass" border="partial" padding="24" className={cls.chartCard}>
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
                                    sx={chartSxBase}
                                />
                            </div>
                        </VStack>
                    </Card>
                </div>
                <div className={cls.col50}>
                    <Card max variant="glass" border="partial" padding="24" className={cls.chartCard}>
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
                                    sx={chartSxBase}
                                />
                            </div>
                        </VStack>
                    </Card>
                </div>
            </div>
        </VStack>
    )
})
