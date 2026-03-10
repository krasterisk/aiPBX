import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton, Grid } from '@mui/material'
import { LinesChart } from '@/shared/ui/mui/LinesChart'
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk'
import SpeedIcon from '@mui/icons-material/Speed'
import TimerIcon from '@mui/icons-material/Timer'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import SettingsIcon from '@mui/icons-material/Settings'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { StatCard } from '@/features/Dashboard/ui/StatCard/StatCard'
import {
    DefaultMetricKey,
    OperatorDashboardResponse,
    OperatorProject,
    useGetOperatorProjects,
} from '@/entities/Report'
import { AiInsightsBanner } from './AiInsightsBanner/AiInsightsBanner'
import { HeatmapCalendar } from './HeatmapCalendar/HeatmapCalendar'
import { DonutChart } from '@/shared/ui/redesigned/DonutChart'
import cls from './OperatorDashboard.module.scss'

// Success rate heuristic:
// backend may send 0–1 (fraction) or 0–100 (percent).
// If value > 1 → already percent. If ≤ 1 → fraction, multiply by 100.
const normalizeRate = (rate?: number): number => {
    if (!rate) return 0
    return rate > 1 ? rate : rate * 100
}

// Full default metric key → translation map
const ALL_DEFAULT_METRICS: { key: DefaultMetricKey; labelKey: string }[] = [
    { key: 'greeting_quality', labelKey: 'Качество приветствия' },
    { key: 'script_compliance', labelKey: 'Следование скрипту' },
    { key: 'politeness_empathy', labelKey: 'Вежливость и эмпатия' },
    { key: 'active_listening', labelKey: 'Активное слушание' },
    { key: 'objection_handling', labelKey: 'Работа с возражениями' },
    { key: 'product_knowledge', labelKey: 'Знание продукта' },
    { key: 'problem_resolution', labelKey: 'Решение проблемы' },
    { key: 'speech_clarity_pace', labelKey: 'Темп речи' },
    { key: 'closing_quality', labelKey: 'Качество завершения' },
]

// Emotion sx — inherits CSS vars from the active theme class on the parent element.
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
    onOpenDashboardBuilder?: () => void
}

export const OperatorDashboard = memo((props: OperatorDashboardProps) => {
    const { data, isLoading, projectId, onChangeProjectId, onOpenDashboardBuilder } = props
    const { t } = useTranslation('reports')
    const { data: projects } = useGetOperatorProjects()

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '0 ' + t('сек')
        const m = Math.floor(seconds / 60)
        const s = Math.floor(seconds % 60)
        return m > 0 ? `${m} ${t('мин')} ${s} ${t('сек')}` : `${s} ${t('сек')}`
    }

    const activeProject = projects?.find((p: OperatorProject) => p.id === projectId)

    // Phase 1: Filter radarMetrics by visibleDefaultMetrics when project is selected
    const radarMetrics = useMemo(() => {
        if (!data?.aggregatedMetrics) return []

        const visibleKeys = activeProject?.visibleDefaultMetrics
        const metricsToShow = visibleKeys?.length
            ? ALL_DEFAULT_METRICS.filter(m => visibleKeys.includes(m.key))
            : ALL_DEFAULT_METRICS

        return metricsToShow.map(m => ({
            label: String(t(m.labelKey)),
            value: data.aggregatedMetrics[m.key] ?? 0,
            key: m.key,
        }))
    }, [data?.aggregatedMetrics, activeProject?.visibleDefaultMetrics, t])

    // Phase 1: Custom metrics from project schema
    const customMetricsList = useMemo(() => {
        if (!activeProject?.customMetricsSchema?.length) return []
        return activeProject.customMetricsSchema
    }, [activeProject?.customMetricsSchema])

    const timeSeriesLabels = data?.timeSeries?.map(p => p.label) ?? []
    const timeSeriesCalls = data?.timeSeries?.map(p => p.callsCount) ?? []

    const sentimentData = [
        { id: 0, value: data?.sentimentDistribution?.positive ?? 0, label: String(t('Positive')), color: '#22c55e' },
        { id: 1, value: data?.sentimentDistribution?.neutral ?? 0, label: String(t('Neutral')), color: '#f59e0b' },
        { id: 2, value: data?.sentimentDistribution?.negative ?? 0, label: String(t('Negative')), color: '#ef4444' },
    ]

    const successRatePct = normalizeRate(data?.successRate)
    const avgCost = data?.totalAnalyzed
        ? (data.totalCost ?? 0) / data.totalAnalyzed
        : 0

    const successData = [
        { id: 0, value: Math.round(successRatePct), label: String(t('Успех')), color: '#22c55e' },
        { id: 1, value: 100 - Math.round(successRatePct), label: String(t('Нет')), color: '#64748b' },
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

    if (isLoading || !data) {
        return (
            <VStack gap={'16'} max>
                <HStack gap={'8'} max>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} variant="rounded" height={100} sx={{ flex: 1 }} />
                    ))}
                </HStack>
                <Skeleton variant="rounded" height={300} width="100%" />
                <HStack gap={'16'} max>
                    <Skeleton variant="rounded" height={240} sx={{ flex: 1 }} />
                    <Skeleton variant="rounded" height={240} sx={{ flex: 1 }} />
                </HStack>
                <Skeleton variant="rounded" height={280} width="100%" />
            </VStack>
        )
    }

    return (
        <VStack gap={'16'} max className={cls.OperatorDashboard}>
            {/* AI Insights Banner */}
            <AiInsightsBanner projectName={activeProject?.name} />

            {/* Project filter + Dashboard Builder button */}
            <HStack max justify={'between'} align={'center'} wrap={'wrap'} gap={'12'}>
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

                {onOpenDashboardBuilder && projectId && (
                    <Button
                        variant={'glass-action'}
                        size={'s'}
                        onClick={onOpenDashboardBuilder}
                        addonLeft={<SettingsIcon fontSize={'small'} />}
                    >
                        {String(t('Настроить дашборд'))}
                    </Button>
                )}
            </HStack>

            {/* Stats Row */}
            <HStack gap={'12'} max wrap={'wrap'} className={cls.statsGrid}>
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
            </HStack>

            {/* Time Series Line Chart */}
            {timeSeriesLabels.length > 0 && (
                <Card max variant={'glass'} border={'partial'} padding={'24'}>
                    <VStack gap={'16'} max>
                        <Text title={String(t('Динамика звонков'))} bold />
                        <LinesChart
                            xAxis={[{ scaleType: 'band', data: timeSeriesLabels }]}
                            series={[{
                                data: timeSeriesCalls,
                                label: String(t('Звонки')),
                                color: '#5ed3f3',
                                curve: 'monotoneX',
                                showMark: true,
                            }]}
                            height={300}
                            margin={{ left: 60, right: 24, top: 16, bottom: 40 }}
                        />
                    </VStack>
                </Card>
            )}

            {/* Pie Charts Row */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card max variant={'glass'} border={'partial'} padding={'24'}>
                        <VStack gap={'12'} max>
                            <Text title={String(t('Настроение клиента'))} bold />
                            <DonutChart data={sentimentData} />
                        </VStack>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card max variant={'glass'} border={'partial'} padding={'24'}>
                        <VStack gap={'12'} max>
                            <Text title={String(t('Успешных звонков'))} bold />
                            <DonutChart data={successData} />
                        </VStack>
                    </Card>
                </Grid>
            </Grid>

            {/* Avg Score — horizontal bar chart (filtered by visibleDefaultMetrics) */}
            {radarMetrics.length > 0 && (
                <Card max variant={'glass'} border={'partial'} padding={'24'}>
                    <VStack gap={'16'} max>
                        <HStack max justify={'between'} align={'center'}>
                            <Text title={String(t('Средняя оценка'))} bold />
                            {activeProject?.visibleDefaultMetrics && (
                                <Text
                                    text={`${radarMetrics.length} / ${ALL_DEFAULT_METRICS.length} ${t('метрик')}`}
                                    size={'s'}
                                />
                            )}
                        </HStack>
                        <VStack gap={'8'} max className={cls.metricBars}>
                            {radarMetrics.map(m => {
                                const level = m.value >= 80 ? 'high' : m.value >= 50 ? 'mid' : 'low'
                                const color = level === 'high' ? 'var(--status-success)' : level === 'mid' ? 'var(--status-warning)' : 'var(--status-error)'
                                return (
                                    <VStack key={m.key} gap={'4'} max>
                                        <HStack max justify={'between'}>
                                            <Text text={m.label} size={'s'} />
                                            <Text text={String(m.value)} size={'s'} bold variant={level === 'high' ? 'success' : level === 'mid' ? 'warning' : 'error'} />
                                        </HStack>
                                        <div className={cls.metricBarTrack}>
                                            <div
                                                className={cls.metricBarFill}
                                                style={{ width: `${m.value}%`, backgroundColor: color }}
                                            />
                                        </div>
                                    </VStack>
                                )
                            })}
                        </VStack>
                    </VStack>
                </Card>
            )}

            {/* Phase 1: Custom Metrics Section */}
            {customMetricsList.length > 0 && (
                <Card max variant={'glass'} border={'partial'} padding={'24'}>
                    <VStack gap={'16'} max>
                        <Text title={String(t('Кастомные метрики'))} bold />
                        <Text text={String(t('Пользовательские метрики проекта') + ` "${activeProject?.name}"`)} size={'s'} />
                        <VStack gap={'8'} max>
                            {customMetricsList.map(metric => (
                                <Card key={metric.id} padding={'16'} border={'partial'} variant={'light'}>
                                    <HStack max justify={'between'} align={'center'}>
                                        <VStack gap={'4'}>
                                            <Text text={metric.name} bold size={'s'} />
                                            <Text text={metric.description} size={'s'} />
                                        </VStack>
                                        <Text
                                            text={metric.type}
                                            size={'xs'}
                                            variant={'accent'}
                                        />
                                    </HStack>
                                </Card>
                            ))}
                        </VStack>
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
