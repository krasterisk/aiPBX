import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@mui/material'
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
import { StatCard } from '@/features/Dashboard'
import { formatTenantMoney } from '@/shared/lib/functions/formatDisplayMoney'
import {
    OperatorDashboardResponse,
    OperatorProject,
    TagStat,
    useGetOperatorProjects,
} from '@/entities/Report'
import { AiInsightsBanner } from './AiInsightsBanner/AiInsightsBanner'
import { DashboardConfigGrid } from '../DashboardBuilder/DashboardConfigGrid'
import { OperatorScoreTable } from './OperatorScoreTable/OperatorScoreTable'
import { DonutChart, type DonutSegment } from '@/shared/ui/redesigned/DonutChart'
import { SidePanel } from '@/shared/ui/redesign-v3'
import {
    clearPanelStack,
    getCurrentPanelEntry,
    popPanelEntry,
    pushPanelEntry,
    resolveBackLabel,
    resolvePanelTitle,
    type DistributionSegment,
    type PanelEntry,
} from '../../model/panelStack'
import { DrilldownPanel } from './DrilldownPanel'
import { TopicsSection } from './TopicsSection'
import { ALL_DEFAULT_METRICS, getDefaultMetricDescriptionKey, metricVisual, normalizeRate } from '../../lib/metricVisual'
import cls from './OperatorDashboard.module.scss'

interface OperatorDashboardProps {
    className?: string
    data?: OperatorDashboardResponse
    isLoading?: boolean
    projectId?: string
    startDate?: string
    endDate?: string
    userId?: string | number
    onChangeProjectId: (value: string) => void
    onOpenDashboardBuilder?: () => void
}

export const OperatorDashboard = memo((props: OperatorDashboardProps) => {
    const { data, isLoading, projectId, startDate, endDate, userId, onChangeProjectId, onOpenDashboardBuilder } = props
    const { t } = useTranslation('reports')
    const { data: projects } = useGetOperatorProjects()
    const [panelStack, setPanelStack] = useState<PanelEntry[]>([])
    const lastFocusedRowRef = useRef<HTMLElement | null>(null)

    const dashboardFilters = useMemo(() => ({
        startDate,
        endDate,
        projectId: projectId || undefined,
        userId: userId != null && userId !== '' ? String(userId) : undefined,
    }), [startDate, endDate, projectId, userId])

    const currentEntry = getCurrentPanelEntry(panelStack)
    const previousEntry = panelStack.length > 1 ? panelStack[panelStack.length - 2] : undefined
    const panelTitle = resolvePanelTitle(currentEntry, t)
    const backLabel = resolveBackLabel(previousEntry, t)
    const isPanelOpen = panelStack.length > 0

    const handleSelectOperator = useCallback((operatorName: string, rowElement: HTMLElement | null) => {
        lastFocusedRowRef.current = rowElement
        setPanelStack([{ kind: 'operator', operatorName }])
    }, [])

    const handleClosePanel = useCallback(() => {
        setPanelStack(clearPanelStack())
        lastFocusedRowRef.current?.focus()
    }, [])

    const handlePanelBack = useCallback(() => {
        setPanelStack(prev => popPanelEntry(prev))
    }, [])

    const handleSelectMetric = useCallback((metricId: string, metricLabel: string) => {
        if (!currentEntry || currentEntry.kind !== 'operator') return
        setPanelStack(prev => pushPanelEntry(prev, {
            kind: 'operatorMetric',
            operatorName: currentEntry.operatorName,
            metricId,
            metricLabel,
        }))
    }, [currentEntry])

    const handleSelectProjectMetric = useCallback((metricId: string, metricLabel: string) => {
        setPanelStack([{
            kind: 'operatorMetric',
            metricId,
            metricLabel,
        }])
    }, [])

    const handleOpenCall = useCallback((channelId: string, fromLabel: string) => {
        setPanelStack(prev => pushPanelEntry(prev, {
            kind: 'call',
            channelId,
            fromLabel,
        }))
    }, [])

    const handleSelectTag = useCallback((stat: TagStat, rowElement: HTMLElement | null) => {
        lastFocusedRowRef.current = rowElement
        setPanelStack([{ kind: 'tag', stat }])
    }, [])

    const handleSentimentSegmentClick = useCallback((segment: DonutSegment) => {
        const id = String(segment.id) as Extract<DistributionSegment, 'positive' | 'neutral' | 'negative'>
        const labelKey = {
            positive: 'Позитивное настроение',
            neutral: 'Нейтральное настроение',
            negative: 'Негативное настроение',
        }[id]
        if (!labelKey) return
        setPanelStack([{
            kind: 'distribution',
            chart: 'sentiment',
            segment: id,
            label: String(t(labelKey)),
        }])
    }, [t])

    const handleSuccessSegmentClick = useCallback((segment: DonutSegment) => {
        const id = String(segment.id) as Extract<DistributionSegment, 'success' | 'fail'>
        const labelKey = {
            success: 'Успешные звонки',
            fail: 'Неуспешные звонки',
        }[id]
        if (!labelKey) return
        setPanelStack([{
            kind: 'distribution',
            chart: 'success',
            segment: id,
            label: String(t(labelKey)),
        }])
    }, [t])

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '0 ' + t('сек')
        const m = Math.floor(seconds / 60)
        const s = Math.floor(seconds % 60)
        return m > 0 ? `${m} ${t('мин')} ${s} ${t('сек')}` : `${s} ${t('сек')}`
    }

    const activeProject = projects?.find(
        (p: OperatorProject) => String(p.id) === String(projectId ?? ''),
    )

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

    // Phase 1: Custom metrics from project schema with aggregated values
    const customMetricsList = useMemo(() => {
        if (!activeProject?.customMetricsSchema?.length) return []
        const aggregated = data?.customMetricsAggregated ?? {}
        return activeProject.customMetricsSchema.map(metric => ({
            ...metric,
            aggregated: aggregated[metric.id],
        }))
    }, [activeProject?.customMetricsSchema, data?.customMetricsAggregated])

    const customDashboardWidgets = useMemo(() => {
        const widgets = activeProject?.dashboardConfig?.widgets
        if (!widgets?.length) return []
        return [...widgets].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    }, [activeProject?.dashboardConfig?.widgets])

    const hasCustomDashboard = customDashboardWidgets.length > 0

    const sentimentData = useMemo(() => [
        { id: 'positive', value: data?.sentimentDistribution?.positive ?? 0, label: String(t('Positive')), color: '#22c55e' },
        { id: 'neutral', value: data?.sentimentDistribution?.neutral ?? 0, label: String(t('Neutral')), color: '#f59e0b' },
        { id: 'negative', value: data?.sentimentDistribution?.negative ?? 0, label: String(t('Negative')), color: '#ef4444' },
    ], [data?.sentimentDistribution, t])

    const successRatePct = normalizeRate(data?.successRate)
    const totalDisplayCost = data?.totalAmountCurrency ?? data?.totalCost ?? 0
    const avgCost = data?.totalAnalyzed
        ? totalDisplayCost / data.totalAnalyzed
        : 0

    const totalAnalyzed = data?.totalAnalyzed ?? 0
    const successCount = Math.round(totalAnalyzed * successRatePct / 100)
    const failCount = Math.max(0, totalAnalyzed - successCount)

    const successData = useMemo(() => [
        { id: 'success', value: successCount, label: String(t('Успех')), color: '#22c55e' },
        { id: 'fail', value: failCount, label: String(t('Нет')), color: '#64748b' },
    ], [successCount, failCount, t])

    const avgScore = data?.averageScore ?? 0
    const scoreVariant = avgScore >= 80 ? 'success' : avgScore >= 50 ? 'warning' : 'error'
    const successVariant = successRatePct >= 80 ? 'success' : successRatePct >= 50 ? 'warning' : 'error'

    if (isLoading || !data) {
        return (
            <VStack gap={'24'} max>
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
        <VStack gap={'24'} max className={cls.OperatorDashboard}>
            {(data?.excludedLowQualityCount ?? 0) > 0 && (
                <Text
                    text={String(t('DASHBOARD_EXCLUDED_LOW_QUALITY', { count: data?.excludedLowQualityCount }))}
                    size="s"
                    variant="warning"
                />
            )}

            {/* Project filter + Dashboard Builder button */}
            <HStack max justify={'between'} align={'center'} wrap={'wrap'} gap={'12'} data-tour-id="oa-upload-entry">
                {projects && projects.length > 0 && (
                    <HStack gap={'8'} align={'center'} wrap={'wrap'}>
                        <Text text={String(t('Проект')) + ':'} />
                        <Card
                            padding={'8'}
                            border={'partial'}
                            variant={!projectId ? 'light' : 'clear'}
                            className={cls.projectChip}
                            onClick={() => { onChangeProjectId('') }}
                        >
                            <Text text={String(t('Все проекты'))} />
                        </Card>
                        {projects.map((p: OperatorProject) => (
                            <Card
                                key={p.id}
                                padding={'8'}
                                border={'partial'}
                                variant={String(projectId) === String(p.id) ? 'light' : 'clear'}
                                className={cls.projectChip}
                                onClick={() => { onChangeProjectId(String(p.id)) }}
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
            <HStack
                gap={'12'}
                max
                wrap={'wrap'}
                className={cls.statsGrid}
                data-tour-id="oa-stats"
                data-testid="oa-section-stats"
            >
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
                    value={formatTenantMoney(totalDisplayCost, 2)}
                    description={String(t('Суммарные расходы за период'))}
                    icon={<AttachMoneyIcon />}
                />
                <StatCard
                    title={String(t('Средняя стоимость'))}
                    value={formatTenantMoney(avgCost, 2)}
                    description={String(t('Средняя стоимость разговора'))}
                    icon={<AccountBalanceWalletIcon />}
                />
            </HStack>

            {data?.insightsAvailable && (
                <div
                    data-tour-id="oa-insights"
                    data-testid="oa-section-insights"
                    className={cls.insightsSection}
                >
                    <AiInsightsBanner
                        projectName={activeProject?.name}
                        queryParams={{
                            startDate,
                            endDate,
                            projectId,
                            userId: userId != null && userId !== '' ? String(userId) : undefined,
                        }}
                    />
                </div>
            )}

            {hasCustomDashboard ? (
                <DashboardConfigGrid
                    widgets={customDashboardWidgets}
                    dashboardData={data}
                    project={activeProject}
                    title={String(t('DASHBOARD_CUSTOM_LAYOUT'))}
                />
            ) : (
                <div data-testid="oa-section-mid-charts" data-tour-id="oa-charts" className={cls.midChartsSection}>
            {/* Sentiment / success - adaptive row */}
            <div className={cls.chartsRow}>
                <Card max variant={'glass'} border={'partial'} padding={'24'} className={cls.chartCard}>
                    <VStack gap={'12'} max>
                        <Text title={String(t('Настроение клиента'))} bold />
                        <Text text={String(t('Нажмите на сегмент, чтобы увидеть звонки'))} size="xs" />
                        <DonutChart data={sentimentData} onSegmentClick={handleSentimentSegmentClick} />
                    </VStack>
                </Card>
                <Card max variant={'glass'} border={'partial'} padding={'24'} className={cls.chartCard}>
                    <VStack gap={'12'} max>
                        <Text title={String(t('Успешных звонков'))} bold />
                        <Text text={String(t('Нажмите на сегмент, чтобы увидеть звонки'))} size="xs" />
                        <DonutChart data={successData} onSegmentClick={handleSuccessSegmentClick} />
                    </VStack>
                </Card>
            </div>

            {(radarMetrics.length > 0 || customMetricsList.length > 0) && (
                <Card
                    max
                    variant={'glass'}
                    border={'partial'}
                    padding={'24'}
                    className={cls.chartCard}
                    data-testid="oa-section-metrics"
                    data-tour-id="oa-metrics"
                >
                    <VStack gap={'16'} max>
                        <VStack gap={'4'} max>
                            <Text title={String(t('Метрики'))} bold />
                            <Text
                                text={String(t('METRICS_CARD_HINT'))}
                                size={'s'}
                            />
                        </VStack>

                        {radarMetrics.length > 0 && (
                            <VStack gap={'8'} max className={cls.metricBars}>
                                {radarMetrics.map(m => {
                                    const level = m.value >= 80 ? 'high' : m.value >= 50 ? 'mid' : 'low'
                                    const color = level === 'high'
                                        ? 'var(--status-success)'
                                        : level === 'mid'
                                            ? 'var(--status-warning)'
                                            : 'var(--status-error)'
                                    const descriptionKey = getDefaultMetricDescriptionKey(m.key)
                                    return (
                                        <button
                                            key={m.key}
                                            type="button"
                                            className={cls.metricClickRow}
                                            onClick={() => { handleSelectProjectMetric(m.key, m.label) }}
                                            data-testid={`oa-metric-row-${m.key}`}
                                        >
                                            <HStack max justify={'between'} align={'start'} gap={'12'}>
                                                <VStack gap={'4'} max className={cls.metricClickMain}>
                                                    <Text text={m.label} size={'s'} bold />
                                                    {descriptionKey && (
                                                        <Text
                                                            text={String(t(descriptionKey))}
                                                            size={'xs'}
                                                            className={cls.metricDesc}
                                                        />
                                                    )}
                                                </VStack>
                                                <Text
                                                    text={String(m.value)}
                                                    size={'s'}
                                                    bold
                                                    variant={level === 'high' ? 'success' : level === 'mid' ? 'warning' : 'error'}
                                                />
                                            </HStack>
                                            <div className={cls.metricBarTrack}>
                                                <div
                                                    className={cls.metricBarFill}
                                                    style={{ width: `${m.value}%`, backgroundColor: color }}
                                                />
                                            </div>
                                        </button>
                                    )
                                })}
                            </VStack>
                        )}

                        {customMetricsList.length > 0 && (
                            <VStack gap={'8'} max>
                                {radarMetrics.length > 0 && (
                                    <Text
                                        text={String(t('Кастомные метрики проекта'))}
                                        size={'s'}
                                        bold
                                        className={cls.metricGroupLabel}
                                    />
                                )}
                                {customMetricsList.map(metric => {
                                    const agg = metric.aggregated
                                    const description = metric.description?.trim()
                                    let valueText = String(t('Нет данных за выбранный период'))
                                    let barPct: number | null = null
                                    let barColor = 'var(--accent-redesigned)'

                                    if (agg?.type === 'boolean' && agg.value != null) {
                                        const vis = metricVisual(agg.value, {
                                            isRate: true,
                                            polarity: metric.polarity ?? 'neutral',
                                        })
                                        valueText = `${agg.value}%`
                                        barPct = vis.pct
                                        barColor = vis.color
                                    } else if (agg?.type === 'number' && agg.value != null) {
                                        const vis = metricVisual(agg.value, {
                                            min: metric.min,
                                            max: metric.max,
                                            polarity: metric.polarity ?? 'positive',
                                        })
                                        valueText = metric.unit
                                            ? `${agg.value} ${metric.unit}`
                                            : (metric.max != null && metric.max !== 100)
                                                ? `${agg.value} / ${metric.max}`
                                                : String(agg.value)
                                        barPct = vis.pct
                                        barColor = vis.color
                                    } else if (agg?.distribution) {
                                        const top = Object.entries(agg.distribution)
                                            .sort((a, b) => Number(b[1]) - Number(a[1]))[0]
                                        valueText = top
                                            ? `${top[0]}: ${top[1]}`
                                            : valueText
                                    }

                                    return (
                                        <button
                                            key={metric.id}
                                            type="button"
                                            className={cls.metricClickRow}
                                            onClick={() => { handleSelectProjectMetric(metric.id, metric.name) }}
                                            data-testid={`oa-metric-row-${metric.id}`}
                                        >
                                            <HStack max justify={'between'} align={'start'} gap={'12'}>
                                                <VStack gap={'4'} max className={cls.metricClickMain}>
                                                    <Text text={metric.name} size={'s'} bold />
                                                    {description && (
                                                        <Text
                                                            text={description}
                                                            size={'xs'}
                                                            className={cls.metricDesc}
                                                        />
                                                    )}
                                                </VStack>
                                                <Text text={valueText} size={'s'} bold />
                                            </HStack>
                                            {barPct != null && (
                                                <div className={cls.metricBarTrack}>
                                                    <div
                                                        className={cls.metricBarFill}
                                                        style={{ width: `${barPct}%`, backgroundColor: barColor }}
                                                    />
                                                </div>
                                            )}
                                            {agg?.distribution && !barPct && (
                                                <VStack gap={'4'} max>
                                                    {Object.entries(agg.distribution).map(([label, count]) => (
                                                        <HStack key={label} max justify={'between'}>
                                                            <Text text={label} size={'xs'} className={cls.metricDesc} />
                                                            <Text text={String(count)} size={'xs'} bold />
                                                        </HStack>
                                                    ))}
                                                </VStack>
                                            )}
                                        </button>
                                    )
                                })}
                            </VStack>
                        )}
                    </VStack>
                </Card>
            )}
                </div>
            )}

            {projectId && (
                <TopicsSection
                    tagStats={data?.tagStats}
                    hasTaxonomy={(activeProject?.callTaxonomy?.length ?? 0) > 0}
                    isLoading={isLoading}
                    onSelectTag={handleSelectTag}
                />
            )}

            {/* Operator quality ranking - bottom section */}
            <Card
                max
                variant={'glass'}
                border={'partial'}
                padding={'24'}
                className={cls.chartCard}
                data-tour-id="oa-scorecard"
                data-testid="oa-section-ranking"
            >
                <VStack gap={'16'} max>
                    <VStack gap={'4'} max>
                        <Text title={String(t('Рейтинг операторов'))} bold />
                        <Text
                            text={String(t('OPERATOR_SCORE_RANKING_SUBTITLE'))}
                            size={'s'}
                        />
                    </VStack>
                    {(data?.agentScorecards?.length ?? 0) > 0
                        ? (
                            <OperatorScoreTable
                                rows={data.agentScorecards!}
                                onSelectOperator={handleSelectOperator}
                            />
                        )
                        : (
                            <Text
                                text={String(t('OPERATOR_SCORE_EMPTY', 'Данные появятся после анализа первых звонков'))}
                                size="s"
                            />
                        )}
                </VStack>
            </Card>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                onBack={panelStack.length > 1 ? handlePanelBack : undefined}
                backLabel={backLabel}
                title={panelTitle}
            >
                {currentEntry && (
                    <DrilldownPanel
                        entry={currentEntry}
                        filters={dashboardFilters}
                        onSelectMetric={handleSelectMetric}
                        onOpenCall={handleOpenCall}
                    />
                )}
            </SidePanel>
        </VStack>
    )
})
