import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@mui/material'
import { ChevronRight } from 'lucide-react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { TabsPanel } from '@/shared/ui/mui/TabsPanel'
import type { OperatorTopicStats, TagStat } from '@/entities/Report'
import { scoreVariant } from '../../../lib/metricVisual'
import { DashboardHint } from '../DashboardHint'
import { OperatorTopicMatrix, type SelectTopicCalls, type SelectTopicOperator } from '../OperatorTopics/OperatorTopics'
import { TopicCharts } from '../OperatorTopics/TopicCharts'
import { topicTone } from '../OperatorTopics/topicVisual'
import visuals from '../OperatorTopics/TopicVisuals.module.scss'
import cls from './TopicsSection.module.scss'

const DISPLAY_THRESHOLD = 8
const LOADING_SKELETON_COUNT = 4

export interface TopicsSectionProps {
    tagStats?: TagStat[]
    topicStats?: OperatorTopicStats
    hasTaxonomy: boolean
    isLoading?: boolean
    onSelectTag: (stat: TagStat, element: HTMLElement | null) => void
    onSelectTopicCalls?: SelectTopicCalls
    onSelectOperator?: SelectTopicOperator
}

export const TopicsSection = memo((props: TopicsSectionProps) => {
    const { tagStats, topicStats, hasTaxonomy, isLoading, onSelectTag, onSelectTopicCalls, onSelectOperator } = props
    const { t } = useTranslation('reports')
    const [expanded, setExpanded] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const visibleStats = useMemo(() => {
        const stats = tagStats ?? []
        return expanded ? stats : stats.slice(0, DISPLAY_THRESHOLD)
    }, [tagStats, expanded])
    const hiddenCount = Math.max(0, (tagStats?.length ?? 0) - DISPLAY_THRESHOLD)
    const handleCardActivate = useCallback((stat: TagStat, event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
        onSelectTag(stat, event.currentTarget)
    }, [onSelectTag])
    const handleCardKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>, stat: TagStat) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleCardActivate(stat, event)
        }
    }, [handleCardActivate])
    if (!hasTaxonomy) return null

    const overview = isLoading ? (
        <div className={cls.cardGrid} data-testid="topics-section-loading">
            {Array.from({ length: LOADING_SKELETON_COUNT }, (_, i) => <Skeleton key={i} variant="rounded" height={120} className={cls.skeletonCard} />)}
        </div>
    ) : !tagStats?.length ? (
        <HStack gap="8" wrap="wrap" data-testid="topics-empty-zero-matches">
            <Text title={String(t('Совпадений по темам нет'))} bold />
            <DashboardHint hint={String(t('За выбранный период ни один звонок не получил тему. Измените период или уточните описания тем в настройках проекта.'))} />
        </HStack>
    ) : (
        <VStack gap="16" max>
            <div className={cls.cardGrid} data-testid="topics-card-grid">
                {visibleStats.map(stat => <button key={stat.tagId} type="button" className={`${cls.topicCard} ${visuals[topicTone(stat.tagId)]}`} aria-label={stat.name} title={stat.name}
                    onClick={e => { handleCardActivate(stat, e) }} onKeyDown={e => { handleCardKeyDown(e, stat) }} data-testid={`topic-card-${stat.tagId}`}>
                    <HStack gap="8" max justify="between">
                        <Text text={stat.name} bold size="m" className={cls.themeName} />
                        <ChevronRight size={16} className={cls.cardChevron} aria-hidden />
                    </HStack>
                    <span className={cls.callsCount}>{stat.callsCount}</span>
                    <Text text={`${String(t('Средний балл'))}: ${stat.scoredCalls === 0 ? '-' : stat.averageScore.toFixed(1)}`} size="s" className={`${cls.scoreLine} ${stat.scoredCalls === 0 ? '' : cls[scoreVariant(stat.averageScore) ?? ''] ?? ''}`} />
                </button>)}
            </div>
            {!expanded && hiddenCount > 0 && <Button variant="glass-action" size="s" className={cls.expandControl} onClick={() => { setExpanded(true) }} data-testid="topics-expand-control">
                {String(t('Показать все ({{count}})', { count: tagStats.length }))}
            </Button>}
        </VStack>
    )
    const views = [{
        id: 'overview',
        label: String(t('Темы')),
        content: <VStack gap="24" max>
            {!isLoading && topicStats && <TopicCharts stats={topicStats} onSelect={onSelectTopicCalls} />}
            {overview}
        </VStack>
    }]
    if (topicStats && onSelectTopicCalls) {
        views.push({ id: 'matrix', label: String(t('Операторы по темам')), content: <OperatorTopicMatrix stats={topicStats} onSelect={onSelectTopicCalls} onSelectOperator={onSelectOperator} /> })
    }
    const selectedTab = Math.max(0, views.findIndex(view => view.id === activeTab))
    return <Card max variant="glass" border="partial" padding="24" className={cls.section} data-testid="oa-section-topics" data-tour-id="oa-topics">
        <VStack gap="16" max>
            <HStack gap="8" wrap="wrap">
                <Text title={String(t('Темы звонков'))} bold />
                <DashboardHint hint={String(t('Нажмите на тему, чтобы увидеть её звонки и статистику'))} />
            </HStack>
            <TabsPanel embedded ariaLabel={String(t('Темы звонков'))} tabItems={views} value={selectedTab} onChange={(_, value) => { setActiveTab(views[value].id) }} />
        </VStack>
    </Card>
})
