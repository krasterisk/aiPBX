import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@mui/material'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Card } from '@/shared/ui/redesigned/Card'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { OperatorInsight, useLazyGetOperatorInsights } from '@/entities/Report'
import cls from './AiInsightsBanner.module.scss'

interface AiInsightsBannerProps {
    projectName?: string
    queryParams?: {
        startDate?: string
        endDate?: string
        projectId?: string
        userId?: string
        operatorName?: string
    }
}

function serializeQueryKey(params?: AiInsightsBannerProps['queryParams']): string {
    if (!params) return ''
    return JSON.stringify({
        startDate: params.startDate ?? '',
        endDate: params.endDate ?? '',
        projectId: params.projectId ?? '',
        userId: params.userId ?? '',
        operatorName: params.operatorName ?? '',
    })
}

function priorityClass(priority: OperatorInsight['priority']): string {
    switch (priority) {
        case 'high': return cls.priorityHigh
        case 'medium': return cls.priorityMedium
        default: return cls.priorityLow
    }
}

function formatEvidence(insight: OperatorInsight): string | null {
    const { evidence } = insight
    if (evidence.metric != null && evidence.value != null) {
        return `${evidence.metric}: ${evidence.value}`
    }
    if (evidence.operators?.length) {
        return evidence.operators.join(', ')
    }
    if (evidence.periodLabel) {
        return evidence.periodLabel
    }
    return null
}

export const AiInsightsBanner = memo(({ projectName, queryParams }: AiInsightsBannerProps) => {
    const { t } = useTranslation('reports')
    const [triggerInsights, { data, isLoading, isFetching, isError }] = useLazyGetOperatorInsights()
    const queryKey = useMemo(() => serializeQueryKey(queryParams), [queryParams])
    const lastFetchedKeyRef = useRef<string | null>(null)

    useEffect(() => {
        if (lastFetchedKeyRef.current !== null && lastFetchedKeyRef.current !== queryKey) {
            lastFetchedKeyRef.current = null
        }
    }, [queryKey])

    const handleFetch = useCallback(() => {
        triggerInsights(queryParams ?? {})
        lastFetchedKeyRef.current = queryKey
    }, [triggerInsights, queryParams, queryKey])

    const handleRefresh = useCallback(() => {
        triggerInsights({ ...(queryParams ?? {}), refresh: true })
        lastFetchedKeyRef.current = queryKey
    }, [triggerInsights, queryParams, queryKey])

    const isStale = data != null && lastFetchedKeyRef.current !== queryKey
    const insights = isStale ? [] : (data?.insights ?? [])
    const loading = isLoading || isFetching
    const showData = data != null && !isStale

    return (
        <Card max variant={'glass'} border={'partial'} padding={'16'} className={cls.banner}>
            <VStack gap={'12'} max>
                <HStack max justify={'between'} align={'center'} wrap={'wrap'} gap={'8'}>
                    <HStack gap={'8'} align={'center'}>
                        <AutoAwesomeIcon sx={{ color: 'var(--accent-redesigned)', fontSize: 20 }} />
                        <Text text={String(t('AI Инсайты'))} bold />
                        {projectName && <Text text={`— ${projectName}`} size={'s'} />}
                    </HStack>

                    <HStack gap={'8'}>
                        {!showData && !loading && (
                            <Button variant={'glass-action'} size={'s'} onClick={handleFetch}>
                                {String(t('Получить инсайты'))}
                            </Button>
                        )}
                        {showData && !loading && (
                            <Button variant={'glass-action'} size={'s'} onClick={handleRefresh}>
                                {String(t('INSIGHTS_REFRESH'))}
                            </Button>
                        )}
                    </HStack>
                </HStack>

                {loading && (
                    <VStack gap={'8'} max>
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} variant="rounded" height={72} width="100%" />
                        ))}
                    </VStack>
                )}

                {isError && (
                    <Text text={String(t('INSIGHTS_ERROR'))} size={'s'} variant={'warning'} />
                )}

                {showData && data.lowConfidence && (
                    <div className={cls.lowConfidenceBanner}>
                        <Text
                            text={String(t('INSIGHTS_LOW_CONFIDENCE', { count: data.sampleSize }))}
                            size={'s'}
                            variant={'warning'}
                        />
                    </div>
                )}

                {insights.length > 0 && (
                    <VStack gap={'8'} max className={cls.insightsList}>
                        {insights.map((insight, i) => {
                            const evidenceText = formatEvidence(insight)
                            return (
                                <div
                                    key={`${insight.title}-${i}`}
                                    className={`${cls.insightCard} ${priorityClass(insight.priority)}`}
                                >
                                    <VStack gap={'8'} max>
                                        <HStack gap={'8'} align={'center'} wrap={'wrap'}>
                                            <span className={cls.priorityBadge}>
                                                {String(t(`INSIGHT_PRIORITY_${insight.priority}`))}
                                            </span>
                                            <span className={cls.typeBadge}>
                                                {String(t(`INSIGHT_TYPE_${insight.type}`))}
                                            </span>
                                        </HStack>
                                        <Text text={insight.title} bold size={'s'} />
                                        <Text text={insight.observation} size={'s'} />
                                        {insight.recommendation && (
                                            <Text text={insight.recommendation} size={'s'} className={cls.recommendation} />
                                        )}
                                        {evidenceText && (
                                            <span className={cls.evidenceChip}>{evidenceText}</span>
                                        )}
                                    </VStack>
                                </div>
                            )
                        })}
                        {data?.generatedAt && (
                            <Text
                                text={`${t('Сгенерировано')}: ${new Date(data.generatedAt).toLocaleString()}`}
                                size={'xs'}
                                className={cls.hint}
                            />
                        )}
                    </VStack>
                )}

                {showData && insights.length === 0 && !loading && (
                    <Text text={String(t('Недостаточно данных для генерации инсайтов'))} size={'s'} />
                )}
            </VStack>
        </Card>
    )
})
