import { memo, useCallback, useMemo, useState, type ElementType } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@mui/material'
import { BarChart3, MessageSquareText } from 'lucide-react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { MediaPlayer } from '@/shared/ui/MediaPlayer'
import {
    ReportShowAnalytics,
    ReportShowDialog,
    useGetOperatorAnalysis,
} from '@/entities/Report'
import type { Analytics } from '@/entities/Report'
import cls from './CallPanelBody.module.scss'

type CallPanelTab = 'analytics' | 'dialog'

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
    const [activeTab, setActiveTab] = useState<CallPanelTab>('analytics')
    const { data, isLoading, isError, refetch } = useGetOperatorAnalysis(channelId, {
        skip: !channelId,
    })

    const analytics = useMemo(
        () => (data ? toAnalytics(data as unknown as Record<string, unknown>) : null),
        [data],
    )

    const recordUrl = useMemo(() => {
        const raw = data?.recordUrl
        return typeof raw === 'string' && raw.trim() ? raw : undefined
    }, [data])

    const transcription = useMemo(() => {
        const raw = data?.transcription
        return typeof raw === 'string' && raw.trim() ? raw : undefined
    }, [data])

    const onTabChange = useCallback((tab: CallPanelTab) => {
        setActiveTab(tab)
    }, [])

    const tabs: Array<{ key: CallPanelTab, label: string, icon: ElementType }> = [
        { key: 'analytics', label: String(t('Аналитика')), icon: BarChart3 },
        { key: 'dialog', label: String(t('Диалог')), icon: MessageSquareText },
    ]

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
        <VStack gap="0" max align="stretch" className={cls.root} data-testid="call-panel-body">
            {recordUrl && (
                <div className={cls.recording} data-testid="call-panel-recording">
                    <MediaPlayer src={recordUrl} />
                </div>
            )}

            <div className={cls.tabBar} role="tablist" data-testid="call-panel-tabs">
                {tabs.map(tab => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.key
                    return (
                        <button
                            key={tab.key}
                            type="button"
                            role="tab"
                            id={`call-panel-tab-${tab.key}`}
                            aria-selected={isActive}
                            className={classNames(cls.tab, { [cls.tabActive]: isActive })}
                            onClick={() => { onTabChange(tab.key) }}
                            data-testid={`call-panel-tab-${tab.key}`}
                        >
                            <Icon size={16} className={cls.tabIcon} aria-hidden />
                            <span className={cls.tabLabel}>{tab.label}</span>
                            {isActive && <div className={cls.tabIndicator} />}
                        </button>
                    )
                })}
            </div>

            <div className={cls.tabContent}>
                {activeTab === 'analytics' && (
                    <ReportShowAnalytics analytics={analytics} channelId={channelId} />
                )}

                {activeTab === 'dialog' && (
                    <div data-testid="call-panel-dialog">
                        {transcription
                            ? (
                                <ReportShowDialog
                                    isDialogLoading={false}
                                    isDialogError={false}
                                    transcription={transcription}
                                />
                            )
                            : <Text text={String(t('Диалог отсутствует'))} size="m" />}
                    </div>
                )}
            </div>
        </VStack>
    )
})
