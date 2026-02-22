import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { OperatorAnalysisResult } from '@/entities/Report'
import { MediaPlayer } from '@/shared/ui/MediaPlayer'
import { Mic, BookText } from 'lucide-react'
import cls from './OperatorCallDetail.module.scss'

// ─── Props ────────────────────────────────────────────────────────────────────

interface OperatorCallDetailProps {
    record: OperatorAnalysisResult
    colSpan: number
}

// ─── Metric keys (9 numeric scores, excluding summary/success) ────────────────

const METRIC_KEYS = [
    { key: 'greeting_quality', labelKey: 'Качество приветствия' },
    { key: 'script_compliance', labelKey: 'Следование скрипту' },
    { key: 'politeness_empathy', labelKey: 'Вежливость и эмпатия' },
    { key: 'active_listening', labelKey: 'Активное слушание' },
    { key: 'objection_handling', labelKey: 'Работа с возражениями' },
    { key: 'product_knowledge', labelKey: 'Знание продукта' },
    { key: 'problem_resolution', labelKey: 'Решение проблемы' },
    { key: 'speech_clarity_pace', labelKey: 'Темп речи' },
    { key: 'closing_quality', labelKey: 'Качество завершения' },
] as const

const SENTIMENT_COLOR: Record<string, string> = {
    Positive: 'var(--status-success)',
    Neutral: 'var(--status-warning)',
    Negative: 'var(--status-error)',
}

// ─── Horizontal metric bar ─────────────────────────────────────────────────────

interface MetricBarProps {
    label: string
    value: number
}

const MetricBar = memo(({ label, value }: MetricBarProps) => {
    const level = value >= 80 ? 'high' : value >= 50 ? 'mid' : 'low'

    return (
        <div className={cls.metricBar}>
            <div className={cls.metricBarLabel}>
                <span className={cls.metricBarName}>{label}</span>
                <span className={cls.metricBarValue} data-level={level}>{value}</span>
            </div>
            <div className={cls.metricBarTrack}>
                <div
                    className={cls.metricBarFill}
                    data-level={level}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    )
})

// ─── Main ─────────────────────────────────────────────────────────────────────

export const OperatorCallDetail = memo(({ record, colSpan }: OperatorCallDetailProps) => {
    const { t } = useTranslation('reports')

    const metrics = METRIC_KEYS.map(m => ({
        label: String(t(m.labelKey)),
        value: record.metrics?.[m.key] ?? 0,
    }))

    const avgScore = record.metrics
        ? Math.round(metrics.reduce((a, m) => a + m.value, 0) / metrics.length)
        : null

    // summary lives inside metrics object (backend shape)
    const summary = record.metrics?.summary ?? record.summary

    return (
        <tr className={cls.accordionRow}>
            <td colSpan={colSpan} className={cls.accordionCell}>
                <div className={cls.accordionContent}>
                    <div className={cls.detailGrid}>

                        {/* ── Left: transcript + summary ── */}
                        <VStack gap={'12'} className={cls.leftCol}>
                            {/* Аудио плеер если есть запись */}
                            {record.recordUrl && (
                                <Card variant="glass" border="partial" padding="16" max>
                                    <VStack gap="8" max>
                                        <HStack gap="8" align="center">
                                            <Mic size={18} className={cls.summaryIcon} />
                                            <Text text={String(t('Запись звонка'))} bold />
                                        </HStack>
                                        <MediaPlayer src={record.recordUrl} />
                                    </VStack>
                                </Card>
                            )}

                            {/* Summary — from metrics.summary or record.summary */}
                            {summary && (
                                <Card variant={'glass'} border={'partial'} padding={'16'} max>
                                    <VStack gap={'8'} max>
                                        <HStack gap={'8'} align={'center'}>
                                            <BookText size={18} className={cls.summaryIcon} />
                                            <Text text={String(t('Саммари'))} bold />
                                        </HStack>
                                        <p className={cls.summary}>{summary}</p>
                                    </VStack>
                                </Card>
                            )}
                        </VStack>

                        {/* ── Right: sentiment + score bars + custom metrics ── */}
                        <VStack gap={'12'} className={cls.rightCol}>

                            {/* Sentiment + avg score */}
                            <Card variant={'glass'} border={'partial'} padding={'16'} max>
                                <HStack max justify={'between'} align={'center'} wrap={'wrap'} gap={'12'}>
                                    {record.metrics?.customer_sentiment && (
                                        <HStack gap={'8'} align={'center'}>
                                            <Text text={String(t('Настроение')) + ':'} bold />
                                            <span
                                                className={cls.sentimentBadge}
                                                style={{ color: SENTIMENT_COLOR[record.metrics.customer_sentiment] }}
                                            >
                                                {String(t(record.metrics.customer_sentiment))}
                                            </span>
                                        </HStack>
                                    )}

                                    {avgScore !== null && (
                                        <HStack gap={'8'} align={'center'}>
                                            <Text text={String(t('Средний скоринг')) + ':'} bold />
                                            <span
                                                className={cls.avgBadge}
                                                data-level={avgScore >= 80 ? 'high' : avgScore >= 50 ? 'mid' : 'low'}
                                            >
                                                {avgScore}
                                                <span className={cls.avgBadgeMax}>{'/100'}</span>
                                            </span>
                                        </HStack>
                                    )}
                                </HStack>
                            </Card>

                            {/* Metric bars */}
                            {record.metrics && (
                                <Card variant={'glass'} border={'partial'} padding={'16'} max>
                                    <VStack gap={'12'} max>
                                        <Text text={String(t('Детализация оценок'))} bold />
                                        <VStack gap={'8'} max>
                                            {metrics.map(m => (
                                                <MetricBar key={m.label} label={m.label} value={m.value} />
                                            ))}
                                        </VStack>
                                    </VStack>
                                </Card>
                            )}

                            {/* Custom metrics */}
                            {record.customMetrics && Object.keys(record.customMetrics).length > 0 && (
                                <Card variant={'glass'} border={'partial'} padding={'16'} max>
                                    <VStack gap={'8'} max>
                                        <Text text={String(t('Пользовательские метрики'))} bold />
                                        {Object.entries(record.customMetrics).map(([k, v]) => (
                                            <HStack key={k} gap={'8'} justify={'between'} max>
                                                <Text text={k} />
                                                <Text text={String(v)} bold />
                                            </HStack>
                                        ))}
                                    </VStack>
                                </Card>
                            )}
                        </VStack>
                    </div>
                </div>
            </td>
        </tr>
    )
})
