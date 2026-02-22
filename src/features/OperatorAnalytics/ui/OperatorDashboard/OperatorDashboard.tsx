import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'
import { PieChart } from '@mui/x-charts/PieChart'
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk'
import SpeedIcon from '@mui/icons-material/Speed'
import TimerIcon from '@mui/icons-material/Timer'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { StatCard } from '@/features/Dashboard/ui/StatCard/StatCard'
import { OperatorDashboardResponse, OperatorProject, useGetOperatorProjects } from '@/entities/Report'
import { AiInsightsBanner } from './AiInsightsBanner/AiInsightsBanner'
import { HeatmapCalendar } from './HeatmapCalendar/HeatmapCalendar'
import cls from './OperatorDashboard.module.scss'

// Success rate heuristic:
// backend may send 0–1 (fraction) or 0–100 (percent).
// If value > 1 → already percent. If ≤ 1 → fraction, multiply by 100.
const normalizeRate = (rate?: number): number => {
    if (!rate) return 0
    return rate > 1 ? rate : rate * 100
}

// Emotion sx — inherits CSS vars from the active theme class on the parent element.
// NOTE: --glass-border-subtle is a full border shorthand ("1px solid ..."), invalid for SVG stroke.
// Use explicit color values for SVG axis/grid lines.
const CHART_SX = {
    '& .MuiChartsAxis-line': { stroke: 'var(--text-redesigned) !important', strokeOpacity: '0.4 !important', strokeWidth: '1.5 !important' },
    '& .MuiChartsAxis-tick': { stroke: 'var(--text-redesigned) !important', strokeOpacity: '0.4 !important', strokeWidth: '1.5 !important' },
    '& .MuiChartsGrid-line': { stroke: 'var(--text-redesigned) !important', strokeOpacity: '0.1 !important', strokeDasharray: '4 4' },
    '& .MuiChartsAxis-tickLabel': { fill: 'var(--text-redesigned) !important' },
    '& .MuiChartsAxis-tickLabel tspan': { fill: 'var(--text-redesigned) !important' },
    '& .MuiChartsLegend-label': { color: 'var(--text-redesigned) !important', fill: 'var(--text-redesigned) !important' },
    '& .MuiChartsLabel-root': { color: 'var(--text-redesigned) !important' },
    '& .MuiChartsLegend-root text': { fill: 'var(--text-redesigned) !important' },
    '& text': { fill: 'var(--text-redesigned) !important' },
    '& .MuiLineElement-root': { strokeWidth: 2.5 },
    '& .MuiMarkElement-root': { strokeWidth: 2 },
}

interface OperatorDashboardProps {
    className?: string
    data?: OperatorDashboardResponse
    isLoading?: boolean
    projectId?: string
    onChangeProjectId: (value: string) => void
}

export const OperatorDashboard = memo((props: OperatorDashboardProps) => {
    const { data, isLoading, projectId, onChangeProjectId } = props
    const { t } = useTranslation('reports')
    const { data: projects } = useGetOperatorProjects()

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '0 ' + t('сек')
        const m = Math.floor(seconds / 60)
        const s = Math.floor(seconds % 60)
        return m > 0 ? `${m} ${t('мин')} ${s} ${t('сек')}` : `${s} ${t('сек')}`
    }

    const radarMetrics = data?.aggregatedMetrics ? [
        { label: String(t('Качество приветствия')), value: data.aggregatedMetrics.greeting_quality },
        { label: String(t('Следование скрипту')), value: data.aggregatedMetrics.script_compliance },
        { label: String(t('Вежливость и эмпатия')), value: data.aggregatedMetrics.politeness_empathy },
        { label: String(t('Активное слушание')), value: data.aggregatedMetrics.active_listening },
        { label: String(t('Работа с возражениями')), value: data.aggregatedMetrics.objection_handling },
        { label: String(t('Знание продукта')), value: data.aggregatedMetrics.product_knowledge },
        { label: String(t('Решение проблемы')), value: data.aggregatedMetrics.problem_resolution },
        { label: String(t('Темп речи')), value: data.aggregatedMetrics.speech_clarity_pace },
        { label: String(t('Качество завершения')), value: data.aggregatedMetrics.closing_quality },
    ] : []

    const timeSeriesLabels = data?.timeSeries?.map(p => p.label) ?? []
    const timeSeriesCalls = data?.timeSeries?.map(p => p.callsCount) ?? []

    const sentimentData = [
        { id: 0, value: data?.sentimentDistribution?.positive ?? 0, label: String(t('Positive')), color: 'var(--status-success)' },
        { id: 1, value: data?.sentimentDistribution?.neutral ?? 0, label: String(t('Neutral')), color: 'var(--status-warning)' },
        { id: 2, value: data?.sentimentDistribution?.negative ?? 0, label: String(t('Negative')), color: 'var(--status-error)' },
    ]

    const successRatePct = normalizeRate(data?.successRate)
    const avgCost = data?.totalAnalyzed
        ? (data.totalCost ?? 0) / data.totalAnalyzed
        : 0

    const successData = [
        { id: 0, value: Math.round(successRatePct), label: String(t('Успех')), color: 'var(--status-success)' },
        { id: 1, value: 100 - Math.round(successRatePct), label: String(t('Нет')), color: 'var(--icon-secondary)' },
    ]

    const avgScore = data?.averageScore ?? 0
    const scoreVariant = avgScore >= 80 ? 'success' : avgScore >= 50 ? 'warning' : 'error'
    const successVariant = successRatePct >= 80 ? 'success' : successRatePct >= 50 ? 'warning' : 'error'

    // Build heatmap data from timeSeries
    const heatmapData = useMemo(() => {
        if (!data?.timeSeries) return []
        return data.timeSeries.map(p => ({
            date: p.label,
            callCount: p.callsCount ?? 0,
            avgScore: data.averageScore ?? 0
        }))
    }, [data])

    const activeProject = projects?.find((p: OperatorProject) => p.id === projectId)

    if (isLoading) {
        return (
            <VStack gap={'16'} max>
                <div className={cls.statsGrid}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} variant="rounded" height={100} />
                    ))}
                </div>
                <Skeleton variant="rounded" height={300} />
                <div className={cls.chartsRow}>
                    <Skeleton variant="rounded" height={240} />
                    <Skeleton variant="rounded" height={240} />
                </div>
                <Skeleton variant="rounded" height={280} />
            </VStack>
        )
    }

    return (
        <VStack gap={'16'} max className={cls.OperatorDashboard}>
            {/* AI Insights Banner */}
            <AiInsightsBanner projectName={activeProject?.name} />

            {/* Project filter */}
            {projects && projects.length > 0 && (
                <HStack gap={'8'} align={'center'} wrap={'wrap'}>
                    <Text text={String(t('Проект')) + ':'} />
                    <Card
                        padding={'8'}
                        border={'partial'}
                        variant={!projectId ? 'light' : 'clear'}
                        className={cls.projectChip}
                        onClick={() => onChangeProjectId('')}
                    >
                        <Text text={String(t('Все проекты'))} />
                    </Card>
                    {projects.map((p: OperatorProject) => (
                        <Card
                            key={p.id}
                            padding={'8'}
                            border={'partial'}
                            variant={projectId === p.id ? 'light' : 'clear'}
                            className={cls.projectChip}
                            onClick={() => onChangeProjectId(p.id)}
                        >
                            <Text text={p.name} />
                        </Card>
                    ))}
                </HStack>
            )}

            {/* Stats Row */}
            <div className={cls.statsGrid}>
                <StatCard
                    title={String(t('Всего звонков'))}
                    value={data?.totalAnalyzed ?? 0}
                    description={String(t('Количество совершенных звонков'))}
                    icon={<PhoneInTalkIcon />}
                />
                <StatCard
                    title={String(t('Средняя оценка'))}
                    value={avgScore.toFixed(1)}
                    variant={scoreVariant}
                    icon={<SpeedIcon />}
                />
                <StatCard
                    title={'AHT'}
                    value={formatDuration(data?.averageDuration)}
                    description={String(t('Среднее время разговора'))}
                    icon={<TimerIcon />}
                />
                <StatCard
                    title={String(t('Успешных звонков'))}
                    value={`${successRatePct.toFixed(0)}%`}
                    variant={successVariant}
                    icon={<CheckCircleOutlineIcon />}
                />
                <StatCard
                    title={String(t('Общая стоимость'))}
                    value={`$${(data?.totalCost ?? 0).toFixed(4)}`}
                    description={String(t('Суммарные расходы за период'))}
                    icon={<AttachMoneyIcon />}
                />
                <StatCard
                    title={String(t('Средняя стоимость'))}
                    value={`$${avgCost.toFixed(4)}`}
                    description={String(t('Средняя стоимость разговора'))}
                    icon={<AccountBalanceWalletIcon />}
                />
            </div>

            {/* Time Series Line Chart */}
            {timeSeriesLabels.length > 0 && (
                <Card max variant={'glass'} border={'partial'} padding={'24'}>
                    <VStack gap={'16'} max>
                        <Text title={String(t('Динамика звонков'))} bold />
                        <div className={cls.chartWrapper}>
                            <LineChart
                                xAxis={[{
                                    scaleType: 'band',
                                    data: timeSeriesLabels,
                                }]}
                                series={[
                                    {
                                        data: timeSeriesCalls,
                                        label: String(t('Звонки')),
                                        color: '#5ed3f3',
                                        curve: 'monotoneX',
                                        showMark: true,
                                    }
                                ]}
                                height={300}
                                sx={CHART_SX}
                            />
                        </div>
                    </VStack>
                </Card>

            )}

            {/* Pie Charts Row */}
            <div className={cls.chartsRow}>
                <Card variant={'glass'} border={'partial'} padding={'24'} className={cls.chartCard}>
                    <VStack gap={'12'} max>
                        <Text title={String(t('Настроение клиента'))} bold />
                        <PieChart
                            series={[{
                                data: sentimentData,
                                innerRadius: 50,
                                paddingAngle: 2,
                                cornerRadius: 4,
                                highlightScope: { fade: 'global', highlight: 'item' },
                            }]}
                            height={220}
                            sx={{
                                '& .MuiChartsLegend-label': { fill: 'var(--text-redesigned) !important' },
                                '& .MuiChartsLabel-root': { color: 'var(--text-redesigned) !important' },
                                '& text': { fill: 'var(--text-redesigned) !important' },
                            }}
                            slotProps={{
                                legend: { position: { vertical: 'bottom', horizontal: 'center' } }
                            }}
                            margin={{ bottom: 40 }}
                        />
                    </VStack>
                </Card>
                <Card variant={'glass'} border={'partial'} padding={'24'} className={cls.chartCard}>
                    <VStack gap={'12'} max>
                        <Text title={String(t('Успешных звонков'))} bold />
                        <PieChart
                            series={[{
                                data: successData,
                                innerRadius: 50,
                                paddingAngle: 2,
                                cornerRadius: 4,
                                highlightScope: { fade: 'global', highlight: 'item' },
                            }]}
                            height={220}
                            sx={{
                                '& .MuiChartsLegend-label': { fill: 'var(--text-redesigned) !important' },
                                '& .MuiChartsLabel-root': { color: 'var(--text-redesigned) !important' },
                                '& text': { fill: 'var(--text-redesigned) !important' },
                            }}
                            slotProps={{
                                legend: { position: { vertical: 'bottom', horizontal: 'center' } }
                            }}
                            margin={{ bottom: 40 }}
                        />
                    </VStack>
                </Card>
            </div>

            {/* Avg Score — horizontal bar chart */}
            {radarMetrics.length > 0 && (
                <Card max variant={'glass'} border={'partial'} padding={'24'}>
                    <VStack gap={'16'} max>
                        <Text title={String(t('Средняя оценка'))} bold />
                        <div className={cls.metricBars}>
                            {radarMetrics.map(m => {
                                const level = m.value >= 80 ? 'high' : m.value >= 50 ? 'mid' : 'low'
                                return (
                                    <div key={m.label} className={cls.metricBarRow}>
                                        <div className={cls.metricBarMeta}>
                                            <span className={cls.metricBarLabel}>{m.label}</span>
                                            <span className={cls.metricBarScore} data-level={level}>{m.value}</span>
                                        </div>
                                        <div className={cls.metricBarTrack}>
                                            <div
                                                className={cls.metricBarFill}
                                                data-level={level}
                                                style={{ width: `${m.value}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </VStack>
                </Card>
            )}

            {/* Heatmap Calendar */}
            {heatmapData.length > 0 && (
                <HeatmapCalendar data={heatmapData} />
            )}
        </VStack>
    )
})
