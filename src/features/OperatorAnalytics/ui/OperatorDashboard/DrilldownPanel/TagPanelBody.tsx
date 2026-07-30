import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@mui/material'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { useGetOperatorCdrs } from '@/entities/Report'
import type { PanelEntry } from '../../../model/panelStack'
import { normalizeRate, scoreVariant } from '../../../lib/metricVisual'
import type { DashboardFilters } from './OperatorPanelBody'
import cls from './TagPanelBody.module.scss'

const PAGE_SIZE = 20

interface TagPanelBodyProps {
    entry: Extract<PanelEntry, { kind: 'tag' }>
    filters: DashboardFilters
    onOpenCall: (channelId: string, fromLabel: string) => void
}

function formatSentimentMix(
    sentiment: { positive: number, neutral: number, negative: number },
    t: (key: string) => string,
): string {
    return [
        `${t('Positive')}: ${sentiment.positive}`,
        `${t('Neutral')}: ${sentiment.neutral}`,
        `${t('Negative')}: ${sentiment.negative}`,
    ].join(' · ')
}

export const TagPanelBody = memo((props: TagPanelBodyProps) => {
    const { entry, filters, onOpenCall } = props
    const { stat } = entry
    const { t } = useTranslation('reports')
    const [page, setPage] = useState(1)

    const cdrArgs = useMemo(() => ({
        startDate: filters.startDate,
        endDate: filters.endDate,
        projectId: filters.projectId,
        theme: stat.tagId,
        page,
        limit: PAGE_SIZE,
    }), [filters, stat.tagId, page])

    const { data, isLoading, isFetching, isError, refetch } = useGetOperatorCdrs(cdrArgs, {
        skip: !stat.tagId,
    })

    const loading = (isLoading || isFetching) && !data
    const total = data?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const successRatePct = normalizeRate(stat.successRate)

    if (loading) {
        return (
            <VStack gap="8" max className={cls.root} data-testid="tag-panel-loading">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} variant="rounded" height={56} width="100%" />
                ))}
            </VStack>
        )
    }

    if (isError) {
        return (
            <div className={cls.errorBlock} data-testid="tag-panel-error">
                <Text title={String(t('Не удалось загрузить разбор'))} bold />
                <Text
                    text={String(t('Проверьте соединение и повторите. Если ошибка повторяется, обновите страницу.'))}
                    size="m"
                />
                <Button variant="glass-action" size="s" onClick={() => { void refetch() }}>
                    {String(t('Повторить'))}
                </Button>
            </div>
        )
    }

    return (
        <VStack gap="16" max className={cls.root} data-testid="tag-panel-body">
            <div className={cls.headline} data-testid="tag-panel-headline">
                {stat.callsCount}
            </div>

            <div className={cls.statStrip} data-testid="tag-panel-stat-strip">
                <div className={cls.statItem}>
                    <Text text={String(t('Средняя оценка'))} size="xs" className={cls.statLabel} />
                    <Text
                        text={stat.averageScore.toFixed(1)}
                        size="m"
                        bold
                        variant={scoreVariant(stat.averageScore)}
                        className={cls.statValue}
                    />
                </div>
                <div className={cls.statItem}>
                    <Text text={String(t('Настроение клиента'))} size="xs" className={cls.statLabel} />
                    <Text
                        text={formatSentimentMix(stat.sentiment, t)}
                        size="m"
                        className={cls.statValue}
                    />
                </div>
                <div className={cls.statItem}>
                    <Text text={String(t('Успешных звонков'))} size="xs" className={cls.statLabel} />
                    <Text
                        text={`${successRatePct.toFixed(0)}%`}
                        size="m"
                        bold
                        variant={scoreVariant(successRatePct)}
                        className={cls.statValue}
                    />
                </div>
            </div>

            {(stat.shareOfPeriodCalls != null || stat.deltaVsPeriodAverage != null) && (
                <VStack gap="4" max className={cls.secondaryMeta}>
                    {stat.shareOfPeriodCalls != null && (
                        <Text
                            text={String(t('TOPICS_SHARE_OF_PERIOD', { value: stat.shareOfPeriodCalls.toFixed(1) }))}
                            size="xs"
                        />
                    )}
                    {stat.deltaVsPeriodAverage != null && (
                        <Text
                            text={String(t('TOPICS_DELTA_VS_PERIOD', { value: stat.deltaVsPeriodAverage.toFixed(1) }))}
                            size="xs"
                        />
                    )}
                </VStack>
            )}

            <div data-testid="tag-panel-call-count">
                <Text
                    text={String(t('TOPICS_CALL_LIST_HEADER', { count: total }))}
                    size="xs"
                    className={cls.callListHeader}
                />
            </div>

            <div className={cls.callList} data-testid="tag-panel-call-list">
                {(data?.data.length ?? 0) === 0 ? (
                    <div className={cls.emptyBlock} data-testid="tag-panel-calls-empty">
                        <Text text={String(t('Звонков за период нет'))} size="m" />
                    </div>
                ) : data?.data.map(call => (
                    <button
                        key={call.id}
                        type="button"
                        className={cls.callRow}
                        onClick={() => { onOpenCall(call.id, stat.name) }}
                        data-testid={`tag-call-row-${call.id}`}
                    >
                        <Text text={call.filename || call.id} size="m" />
                        <Text
                            text={new Date(call.createdAt).toLocaleDateString()}
                            size="xs"
                            className={cls.secondaryMeta}
                        />
                    </button>
                ))}
            </div>

            {totalPages > 1 && (
                <HStack max justify="between" align="center" className={cls.pagination} data-testid="tag-panel-pagination">
                    <Button
                        variant="glass-action"
                        size="s"
                        disabled={page <= 1}
                        onClick={() => { setPage(p => Math.max(1, p - 1)) }}
                        data-testid="tag-panel-prev-page"
                    >
                        {String(t('Назад'))}
                    </Button>
                    <Text
                        text={String(t('TOPICS_PAGE_INDICATOR', { page, totalPages }))}
                        size="xs"
                    />
                    <Button
                        variant="glass-action"
                        size="s"
                        disabled={page >= totalPages}
                        onClick={() => { setPage(p => Math.min(totalPages, p + 1)) }}
                        data-testid="tag-panel-next-page"
                    >
                        {String(t('Далее'))}
                    </Button>
                </HStack>
            )}
        </VStack>
    )
})
