import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@mui/material'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { ReportShowAnalytics, useGetOperatorAnalysis } from '@/entities/Report'
import type { Analytics } from '@/entities/Report'
import cls from './OperatorPanelBody.module.scss'

interface CallPanelBodyProps {
    channelId: string
}

function toAnalytics(data: Record<string, unknown>): Analytics | null {
    if (data.analytics && typeof data.analytics === 'object') {
        return data.analytics as Analytics
    }
    const metrics = data.metrics as Record<string, unknown> | undefined
    if (!metrics && !data.summary) return null
    return {
        channelId: String(data.id ?? data.channelId ?? ''),
        metrics: {
            ...metrics,
            custom_metrics: data.customMetrics,
            summary: data.summary,
            success: data.success,
        } as Analytics['metrics'],
        summary: typeof data.summary === 'string' ? data.summary : null,
    }
}

export const CallPanelBody = memo(({ channelId }: CallPanelBodyProps) => {
    const { t } = useTranslation('reports')
    const { data, isLoading, isError, refetch } = useGetOperatorAnalysis(channelId, {
        skip: !channelId,
    })

    const analytics = useMemo(
        () => (data ? toAnalytics(data as unknown as Record<string, unknown>) : null),
        [data],
    )

    if (isLoading && !data) {
        return (
            <VStack gap="8" max className={cls.root} data-testid="call-panel-loading">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} variant="rounded" height={80} width="100%" />
                ))}
            </VStack>
        )
    }

    if (isError || !analytics) {
        return (
            <div className={cls.errorBlock} data-testid="call-panel-error">
                <Text title={String(t('Не удалось загрузить разбор'))} bold />
                <Text
                    text={String(t(
                        isError
                            ? 'Разбор звонка не найден. Возможно, запись удалена или недоступна для вашего аккаунта.'
                            : 'У этой записи нет сохранённых метрик анализа.',
                    ))}
                    size="m"
                />
                <Button variant="glass-action" size="s" onClick={() => { void refetch() }}>
                    {String(t('Повторить'))}
                </Button>
            </div>
        )
    }

    return (
        <div data-testid="call-panel-body">
            <ReportShowAnalytics analytics={analytics} channelId={channelId} />
        </div>
    )
})
