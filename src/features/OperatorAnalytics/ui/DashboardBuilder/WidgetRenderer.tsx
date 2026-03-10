import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart } from '@mui/x-charts/BarChart'
import { LineChart } from '@mui/x-charts/LineChart'
import { PieChart } from '@mui/x-charts/PieChart'
import { SparkLineChart } from '@mui/x-charts/SparkLineChart'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import SettingsIcon from '@mui/icons-material/Settings'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { DashboardWidget, OperatorDashboardResponse, OperatorProject } from '@/entities/Report'
import { useWidgetData } from './useWidgetData'
import { HeatmapCalendar } from '../OperatorDashboard/HeatmapCalendar/HeatmapCalendar'
import cls from './DashboardBuilder.module.scss'

const CHART_SX = {
    '& .MuiChartsAxis-line': { stroke: 'var(--text-redesigned) !important', strokeOpacity: '0.4 !important' },
    '& .MuiChartsAxis-tick': { stroke: 'var(--text-redesigned) !important', strokeOpacity: '0.4 !important' },
    '& .MuiChartsGrid-line': { stroke: 'var(--text-redesigned) !important', strokeOpacity: '0.1 !important' },
    '& .MuiChartsAxis-tickLabel': { fill: 'var(--text-redesigned) !important' },
    '& .MuiChartsAxis-tickLabel tspan': { fill: 'var(--text-redesigned) !important' },
    '& .MuiChartsLegend-label': { fill: 'var(--text-redesigned) !important' },
    '& .MuiChartsLabel-root': { color: 'var(--text-redesigned) !important' },
    '& text': { fill: 'var(--text-redesigned) !important' },
}

interface WidgetRendererProps {
    widget: DashboardWidget
    dashboardData?: OperatorDashboardResponse
    project?: OperatorProject
    isEditing?: boolean
    onEdit?: (widget: DashboardWidget) => void
    onDelete?: (widgetId: string) => void
}

export const WidgetRenderer = memo((props: WidgetRendererProps) => {
    const { widget, dashboardData, project, isEditing, onEdit, onDelete } = props
    const { t } = useTranslation('reports')
    const data = useWidgetData(widget, dashboardData, project)

    const renderContent = () => {
        switch (widget.widgetType) {
            case 'stat-card': {
                const statValue = data.value ?? 0
                const variant = statValue >= 80 ? 'success' : statValue >= 50 ? 'warning' : 'error'
                return (
                    <VStack gap={'8'} max>
                        <Text text={widget.title} size={'s'} />
                        <Text title={String(statValue.toFixed(1))} bold variant={variant} />
                    </VStack>
                )
            }

            case 'bar-chart': {
                if (!data.barData?.length) return <Text text={String(t('Нет данных'))} size={'s'} />
                return (
                    <VStack gap={'8'} max>
                        <Text text={widget.title} size={'s'} bold />
                        <BarChart
                            xAxis={[{
                                scaleType: 'band',
                                data: data.barData.map(d => d.label),
                            }]}
                            series={[{
                                data: data.barData.map(d => d.value),
                                color: '#5ed3f3',
                            }]}
                            height={200}
                            sx={CHART_SX}
                        />
                    </VStack>
                )
            }

            case 'line-chart': {
                if (!data.timeSeriesData?.length) return <Text text={String(t('Нет данных'))} size={'s'} />
                return (
                    <VStack gap={'8'} max>
                        <Text text={widget.title} size={'s'} bold />
                        <LineChart
                            xAxis={[{
                                scaleType: 'band',
                                data: data.timeSeriesData.map(d => d.label),
                            }]}
                            series={[{
                                data: data.timeSeriesData.map(d => d.value),
                                color: '#5ed3f3',
                                curve: 'monotoneX',
                                showMark: true,
                            }]}
                            height={200}
                            sx={CHART_SX}
                        />
                    </VStack>
                )
            }

            case 'pie-chart': {
                if (!data.pieData?.length) return <Text text={String(t('Нет данных'))} size={'s'} />
                return (
                    <VStack gap={'8'} max>
                        <Text text={widget.title} size={'s'} bold />
                        <PieChart
                            series={[{
                                data: data.pieData,
                                innerRadius: 40,
                                paddingAngle: 2,
                                cornerRadius: 4,
                                highlightScope: { fade: 'global', highlight: 'item' },
                            }]}
                            height={180}
                            sx={CHART_SX}
                            slotProps={{
                                legend: { position: { vertical: 'bottom', horizontal: 'center' } }
                            }}
                            margin={{ bottom: 40 }}
                        />
                    </VStack>
                )
            }

            case 'sparkline': {
                const sparkData = data.timeSeriesData?.map(d => d.value) ?? []
                return (
                    <VStack gap={'4'} max>
                        <HStack max justify={'between'} align={'center'}>
                            <Text text={widget.title} size={'s'} />
                            <Text title={String(data.value?.toFixed(1) ?? 0)} bold size={'s'} />
                        </HStack>
                        {sparkData.length > 0 && (
                            <SparkLineChart
                                data={sparkData}
                                height={40}
                                color={'#5ed3f3'}
                                curve={'monotoneX'}
                            />
                        )}
                    </VStack>
                )
            }

            case 'heatmap': {
                if (!data.heatmapData?.length) return <Text text={String(t('Нет данных'))} size={'s'} />
                return <HeatmapCalendar data={data.heatmapData} />
            }

            case 'tag-cloud': {
                return (
                    <VStack gap={'8'} max>
                        <Text text={widget.title} size={'s'} bold />
                        <Text text={String(t('Tag Cloud — скоро'))} size={'s'} />
                    </VStack>
                )
            }

            default:
                return <Text text={String(t('Неизвестный тип виджета'))} size={'s'} />
        }
    }

    return (
        <Card
            variant={'glass'}
            border={'partial'}
            padding={'16'}
            max
            className={cls.widgetCard}
        >
            <VStack gap={'8'} max>
                {isEditing && (
                    <HStack max justify={'end'} gap={'4'}>
                        <Button
                            variant={'glass-action'}
                            size={'s'}
                            square
                            onClick={() => onEdit?.(widget)}
                        >
                            <SettingsIcon sx={{ fontSize: 16 }} />
                        </Button>
                        <Button
                            variant={'glass-action'}
                            color={'error'}
                            size={'s'}
                            square
                            onClick={() => onDelete?.(widget.id)}
                        >
                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        </Button>
                    </HStack>
                )}
                {renderContent()}
            </VStack>
        </Card>
    )
})
