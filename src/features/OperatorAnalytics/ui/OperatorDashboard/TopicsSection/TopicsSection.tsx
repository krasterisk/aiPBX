import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from '@mui/material'
import { ChevronRight } from 'lucide-react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import type { TagStat } from '@/entities/Report'
import { getRouteAnalyticsProjects } from '@/shared/const/router'
import { scoreVariant } from '../../../lib/metricVisual'
import cls from './TopicsSection.module.scss'

const DISPLAY_THRESHOLD = 8
const LOADING_SKELETON_COUNT = 4

export interface TopicsSectionProps {
    tagStats?: TagStat[]
    hasTaxonomy: boolean
    isLoading?: boolean
    onSelectTag: (stat: TagStat, element: HTMLElement | null) => void
}

export const TopicsSection = memo((props: TopicsSectionProps) => {
    const { tagStats, hasTaxonomy, isLoading, onSelectTag } = props
    const { t } = useTranslation('reports')
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState(false)

    const visibleStats = useMemo(() => {
        const stats = tagStats ?? []
        if (expanded || stats.length <= DISPLAY_THRESHOLD) {
            return stats
        }
        return stats.slice(0, DISPLAY_THRESHOLD)
    }, [tagStats, expanded])

    const hiddenCount = Math.max(0, (tagStats?.length ?? 0) - DISPLAY_THRESHOLD)

    const handleCardActivate = useCallback((
        stat: TagStat,
        event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
    ) => {
        onSelectTag(stat, event.currentTarget)
    }, [onSelectTag])

    const handleCardKeyDown = useCallback((
        event: React.KeyboardEvent<HTMLButtonElement>,
        stat: TagStat,
    ) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleCardActivate(stat, event)
        }
    }, [handleCardActivate])

    const handleOpenProjectSettings = useCallback(() => {
        navigate(getRouteAnalyticsProjects())
    }, [navigate])

    if (isLoading) {
        return (
            <Card
                max
                variant="glass"
                border="partial"
                padding="24"
                className={cls.section}
                data-testid="oa-section-topics"
            >
                <VStack gap="16" max>
                    <VStack gap="4" max>
                        <Text title={String(t('Темы'))} bold />
                        <Text
                            text={String(t('Нажмите на тему, чтобы увидеть её звонки и статистику'))}
                            size="s"
                        />
                    </VStack>
                    <div className={cls.cardGrid} data-testid="topics-section-loading">
                        {Array.from({ length: LOADING_SKELETON_COUNT }, (_, i) => (
                            <Skeleton
                                key={i}
                                variant="rounded"
                                height={120}
                                className={cls.skeletonCard}
                            />
                        ))}
                    </div>
                </VStack>
            </Card>
        )
    }

    if (!hasTaxonomy) {
        return (
            <Card
                max
                variant="glass"
                border="partial"
                padding="24"
                className={cls.section}
                data-testid="oa-section-topics"
            >
                <VStack gap="16" max>
                    <VStack gap="4" max>
                        <Text title={String(t('Темы'))} bold />
                        <Text
                            text={String(t('Нажмите на тему, чтобы увидеть её звонки и статистику'))}
                            size="s"
                        />
                    </VStack>
                    <div className={cls.emptyState} data-testid="topics-empty-not-configured">
                        <Text title={String(t('Темы звонков не настроены'))} bold />
                        <Text
                            text={String(t('Добавьте темы и ключевые слова в настройках проекта — звонки начнут размечаться при следующем анализе.'))}
                            size="m"
                        />
                        <Button variant="accent" size="s" onClick={handleOpenProjectSettings}>
                            {String(t('Настроить темы проекта'))}
                        </Button>
                    </div>
                </VStack>
            </Card>
        )
    }

    if (!tagStats?.length) {
        return (
            <Card
                max
                variant="glass"
                border="partial"
                padding="24"
                className={cls.section}
                data-testid="oa-section-topics"
            >
                <VStack gap="16" max>
                    <VStack gap="4" max>
                        <Text title={String(t('Темы'))} bold />
                        <Text
                            text={String(t('Нажмите на тему, чтобы увидеть её звонки и статистику'))}
                            size="s"
                        />
                    </VStack>
                    <div className={cls.emptyState} data-testid="topics-empty-zero-matches">
                        <Text title={String(t('Совпадений по темам нет'))} bold />
                        <Text
                            text={String(t('За выбранный период ни один звонок не совпал со словарём тем. Измените период или дополните синонимы темы.'))}
                            size="m"
                        />
                    </div>
                </VStack>
            </Card>
        )
    }

    return (
        <Card
            max
            variant="glass"
            border="partial"
            padding="24"
            className={cls.section}
            data-testid="oa-section-topics"
        >
            <VStack gap="16" max>
                <VStack gap="4" max>
                    <Text title={String(t('Темы'))} bold />
                    <Text
                        text={String(t('Нажмите на тему, чтобы увидеть её звонки и статистику'))}
                        size="s"
                    />
                </VStack>

                <div className={cls.cardGrid} data-testid="topics-card-grid">
                    {visibleStats.map(stat => (
                        <button
                            key={stat.tagId}
                            type="button"
                            className={cls.topicCard}
                            aria-label={stat.name}
                            title={stat.name}
                            onClick={(e) => { handleCardActivate(stat, e) }}
                            onKeyDown={(e) => { handleCardKeyDown(e, stat) }}
                            data-testid={`topic-card-${stat.tagId}`}
                        >
                            <div className={cls.cardHeader}>
                                <Text text={stat.name} bold size="m" className={cls.themeName} />
                                <ChevronRight size={16} className={cls.cardChevron} aria-hidden />
                            </div>
                            <span className={cls.callsCount}>{stat.callsCount}</span>
                            <Text
                                text={`${String(t('Средний балл'))}: ${stat.averageScore.toFixed(1)}`}
                                size="s"
                                variant={scoreVariant(stat.averageScore)}
                            />
                        </button>
                    ))}
                </div>

                {!expanded && hiddenCount > 0 && (
                    <Button
                        variant="glass-action"
                        size="s"
                        className={cls.expandControl}
                        onClick={() => { setExpanded(true) }}
                        data-testid="topics-expand-control"
                    >
                        {String(t('Показать все ({{count}})', { count: tagStats.length }))}
                    </Button>
                )}
            </VStack>
        </Card>
    )
})
