import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart3, PieChart } from 'lucide-react'
import type { OperatorTopicStats } from '@/entities/Report'
import { Card } from '@/shared/ui/redesigned/Card'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { DonutChart } from '@/shared/ui/redesigned/DonutChart'
import { DashboardHint } from '../DashboardHint'
import { topicCountHint, type SelectTopicCalls } from './OperatorTopics'
import { topicTone } from './topicVisual'
import visuals from './TopicVisuals.module.scss'
import cls from './TopicCharts.module.scss'

interface TopicChartsProps { stats: OperatorTopicStats, onSelect?: SelectTopicCalls }

export const TopicCharts = memo(({ stats, onSelect }: TopicChartsProps) => {
    const { t } = useTranslation('reports')
    const [expanded, setExpanded] = useState(false)
    if (!stats.totalCalls) return null
    const sorted = [...stats.topics].sort((a, b) => b.callsCount - a.callsCount)
    const withoutTopic = sorted.find(topic => topic.tagId === null)?.callsCount ?? 0
    const withTopic = Math.max(0, stats.totalCalls - withoutTopic)
    const visible = expanded || sorted.length <= 8 ? sorted : [
        ...sorted.filter(topic => topic.tagId !== null).slice(0, 7),
        ...sorted.filter(topic => topic.tagId === null),
    ]
    const share = (count: number) => (count / stats.totalCalls * 100).toFixed(1)
    return <HStack gap="16" align="start" max className={cls.charts} data-testid="topic-charts">
        <Card variant="glass" padding="24" border="partial" className={cls.volumeCard}>
            <VStack gap="16" max>
                <HStack gap="8" wrap="wrap">
                    <BarChart3 size={20} className={cls.icon} aria-hidden />
                    <Text title={String(t('TOPIC_VOLUME_TITLE'))} bold size="s" />
                    <DashboardHint hint={topicCountHint(key => String(t(key)), stats.hasMultipleTopics)} />
                </HStack>
                <VStack gap="8" max>
                    {visible.map(topic => {
                        const name = topic.tagId === null ? String(t('Без темы')) : topic.name
                        return <Button key={JSON.stringify(topic.tagId)} variant="clear" fullWidth className={`${cls.barButton} ${visuals[topicTone(topic.tagId)]}`}
                            disabled={!onSelect || !topic.callsCount} aria-label={`${name}: ${topic.callsCount} (${share(topic.callsCount)}%)`}
                            onClick={event => { onSelect?.(topic.tagId, undefined, topic.callsCount, event.currentTarget) }}>
                            <VStack gap="4" max>
                                <HStack gap="8" max justify="between">
                                    <HStack gap="8" className={visuals.identity}><span className={visuals.dot} aria-hidden /><Text text={name} size="s" /></HStack>
                                    <HStack gap="8" className={cls.barValues}><Text text={String(topic.callsCount)} bold /><Text text={`${share(topic.callsCount)}%`} size="xs" className={cls.muted} /></HStack>
                                </HStack>
                                <svg viewBox="0 0 100 6" preserveAspectRatio="none" className={cls.bar} aria-hidden>
                                    <rect width="100" height="6" rx="3" className={cls.track} />
                                    <rect width={topic.callsCount / stats.totalCalls * 100} height="6" rx="3" className={cls.fill} />
                                </svg>
                            </VStack>
                        </Button>
                    })}
                </VStack>
                {sorted.length > 8 && <Button variant="clear" size="s" onClick={() => { setExpanded(value => !value) }}>
                    {String(t(expanded ? 'TOPIC_CHART_COLLAPSE' : 'Показать все ({{count}})', { count: sorted.length }))}
                </Button>}
            </VStack>
        </Card>
        <Card variant="glass" padding="24" border="partial" className={cls.coverageCard} data-testid="topic-coverage">
            <VStack gap="16" max>
                <HStack gap="8" wrap="wrap">
                    <PieChart size={20} className={cls.icon} aria-hidden />
                    <Text title={String(t('TOPIC_COVERAGE_TITLE'))} bold size="s" />
                    <DashboardHint hint={String(t('TOPIC_COVERAGE_HINT'))} />
                </HStack>
                <div className={cls.donut}>
                    <DonutChart size={180} innerRadius={66} data={[
                        { id: 'classified', label: String(t('TOPIC_CLASSIFIED')), value: withTopic, color: 'var(--chart-info)' },
                        { id: 'unclassified', label: String(t('Без темы')), value: withoutTopic, color: 'var(--chart-warning)' },
                    ].filter(segment => segment.value > 0)} />
                    <VStack gap="4" align="center" className={cls.donutValue}>
                        <Text text={`${share(withTopic)}%`} bold size="l" />
                        <Text text={String(t('TOPIC_CLASSIFIED'))} size="xs" />
                    </VStack>
                </div>
                <HStack gap="8" max justify="between" wrap="wrap" className={cls.coverageTotals}>
                    <Text text={`${String(t('TOPIC_CLASSIFIED'))}: ${withTopic}`} size="s" />
                    <Text text={`${String(t('Без темы'))}: ${withoutTopic}`} size="s" />
                </HStack>
            </VStack>
        </Card>
    </HStack>
})
