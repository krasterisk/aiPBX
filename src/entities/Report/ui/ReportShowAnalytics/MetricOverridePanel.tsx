import React, { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Card } from '@/shared/ui/redesigned/Card'
import { Button } from '@/shared/ui/redesigned/Button'
import { Input } from '@/shared/ui/redesigned/Input'
import { Trash2, UserPen } from 'lucide-react'
import { AnalyticsMetrics, MetricOverride, MetricOverrideInput, MetricOverrideOrigin } from '../../model/types/report'
import {
    useGetMetricOverrides,
    useSaveMetricOverrides,
    useDeleteMetricOverride,
} from '../../api/reportApi'
import cls from './ReportShowAnalytics.module.scss'

type ValueKind = 'number' | 'boolean' | 'enum' | 'string'

interface OverridableMetric {
    metricId: string
    label: string
    origin: MetricOverrideOrigin
    kind: ValueKind
    min?: number
    max?: number
    enumValues?: string[]
}

const DEFAULT_METRIC_LABELS: Record<string, string> = {
    greeting_quality: 'Качество приветствия',
    script_compliance: 'Следование скрипту',
    politeness_empathy: 'Вежливость и эмпатия',
    active_listening: 'Активное слушание',
    objection_handling: 'Работа с возражениями',
    product_knowledge: 'Знание продукта',
    problem_resolution: 'Решение проблемы',
    speech_clarity_pace: 'Темп речи',
    closing_quality: 'Качество завершения',
}

const SENTIMENT_VALUES = ['Positive', 'Neutral', 'Negative']

interface MetricOverridePanelProps {
    channelId: string
    metrics: AnalyticsMetrics
    className?: string
}

export const MetricOverridePanel = memo((props: MetricOverridePanelProps) => {
    const { channelId, metrics, className } = props
    const { t } = useTranslation('reports')

    const { data: overrides } = useGetMetricOverrides(channelId, { skip: !channelId })
    const [saveOverrides, { isLoading: isSaving }] = useSaveMetricOverrides()
    const [deleteOverride] = useDeleteMetricOverride()

    const [expanded, setExpanded] = useState(false)
    const [selectedMetric, setSelectedMetric] = useState('')
    const [valueInput, setValueInput] = useState('')
    const [noteInput, setNoteInput] = useState('')

    const overridable = useMemo<OverridableMetric[]>(() => {
        const list: OverridableMetric[] = []
        for (const key of Object.keys(DEFAULT_METRIC_LABELS)) {
            if (typeof metrics[key as keyof AnalyticsMetrics] === 'number') {
                list.push({ metricId: key, label: String(t(DEFAULT_METRIC_LABELS[key])), origin: 'default', kind: 'number', min: 0, max: 100 })
            }
        }
        if (typeof metrics.csat === 'number') {
            list.push({ metricId: 'csat', label: String(t('Удовлетворённость клиента (CSAT)')), origin: 'summary', kind: 'number', min: 1, max: 5 })
        }
        if (metrics.customer_sentiment != null) {
            list.push({ metricId: 'customer_sentiment', label: String(t('Эмоциональный настрой клиента')), origin: 'summary', kind: 'enum', enumValues: SENTIMENT_VALUES })
        }
        if (metrics.success != null) {
            list.push({ metricId: 'success', label: String(t('Итог обращения')), origin: 'summary', kind: 'boolean' })
        }
        const custom = metrics.custom_metrics 
        const meta = metrics._custom_meta
        if (custom && typeof custom === 'object') {
            for (const id of Object.keys(custom)) {
                if (id.startsWith('_')) continue
                const m = meta?.[id]
                const kind: ValueKind = m?.type === 'boolean' ? 'boolean'
                    : m?.type === 'number' ? 'number'
                        : m?.type === 'enum' ? 'enum' : 'string'
                list.push({
                    metricId: id,
                    label: m?.name || id,
                    origin: 'custom',
                    kind,
                    min: m?.min,
                    max: m?.max,
                    enumValues: m?.enumValues,
                })
            }
        }
        return list
    }, [metrics, t])

    const selected = overridable.find(m => m.metricId === selectedMetric)
    const overrideMap = useMemo(() => {
        const map = new Map<string, MetricOverride>()
        for (const o of overrides || []) map.set(o.metricId, o)
        return map
    }, [overrides])

    const formatOverrideValue = (o: MetricOverride): string => {
        if (o.boolValue != null) return o.boolValue ? String(t('Да')) : String(t('Нет'))
        if (o.numValue != null) return String(o.numValue)
        if (o.strValue != null) return String(t(o.strValue))
        return '—'
    }

    const labelFor = (metricId: string): string =>
        overridable.find(m => m.metricId === metricId)?.label || metricId

    const buildPayload = (): MetricOverrideInput | null => {
        if (!selected) return null
        const base: MetricOverrideInput = {
            metricId: selected.metricId,
            origin: selected.origin,
            note: noteInput.trim() || null,
        }
        if (selected.kind === 'boolean') {
            if (valueInput !== 'true' && valueInput !== 'false') return null
            return { ...base, boolValue: valueInput === 'true' }
        }
        if (selected.kind === 'number') {
            const n = Number(valueInput.replace(',', '.'))
            if (!Number.isFinite(n)) return null
            return { ...base, numValue: n }
        }
        // enum / string
        if (!valueInput.trim()) return null
        return { ...base, strValue: valueInput.trim() }
    }

    const handleSave = async () => {
        const payload = buildPayload()
        if (!payload) return
        try {
            await saveOverrides({ id: channelId, overrides: [payload] }).unwrap()
            setSelectedMetric('')
            setValueInput('')
            setNoteInput('')
        } catch {
            // surfaced via RTK error state; keep form intact for retry
        }
    }

    const handleDelete = async (metricId: string) => {
        try {
            await deleteOverride({ id: channelId, metricId }).unwrap()
        } catch {
            // no-op
        }
    }

    if (!overridable.length) return null

    return (
        <Card variant="light" className={className} max data-testid="metric-override-panel">
            <VStack gap="12" max>
                <HStack justify="between" max>
                    <HStack gap="8">
                        <div className={cls.iconWrapper}><UserPen size={20} /></div>
                        <Text title={String(t('Корректировки супервизора'))} size="m" bold />
                    </HStack>
                    <Button variant="clear" onClick={() => { setExpanded(e => !e) }}>
                        {expanded ? String(t('Свернуть')) : String(t('Изменить'))}
                    </Button>
                </HStack>

                {(overrides?.length ?? 0) > 0 && (
                    <VStack gap="8" max>
                        {overrides!.map(o => (
                            <HStack key={o.metricId} justify="between" max className={cls.overrideRow}>
                                <VStack gap="4">
                                    <Text text={`${labelFor(o.metricId)}: ${formatOverrideValue(o)}`} size="s" bold />
                                    {o.note && <Text text={o.note} size="xs" className={cls.metricHint} />}
                                </VStack>
                                <Button variant="clear" onClick={async () => { await handleDelete(o.metricId) }} aria-label={String(t('Удалить'))}>
                                    <Trash2 size={16} />
                                </Button>
                            </HStack>
                        ))}
                    </VStack>
                )}

                {expanded && (
                    <VStack gap="8" max className={cls.overrideForm}>
                        <Text text={String(t('Скорректированные оценки хранятся отдельно от оценок ИИ и используются для калибровки'))} size="xs" className={cls.metricHint} />
                        <select
                            className={cls.overrideSelect}
                            value={selectedMetric}
                            onChange={e => { setSelectedMetric(e.target.value); setValueInput('') }}
                            data-testid="override-metric-select"
                        >
                            <option value="">{String(t('Выберите метрику'))}</option>
                            {overridable.map(m => (
                                <option key={m.metricId} value={m.metricId}>{m.label}</option>
                            ))}
                        </select>

                        {selected && selected.kind === 'boolean' && (
                            <select className={cls.overrideSelect} value={valueInput} onChange={e => { setValueInput(e.target.value) }}>
                                <option value="">{String(t('Выберите значение'))}</option>
                                <option value="true">{String(t('Да'))}</option>
                                <option value="false">{String(t('Нет'))}</option>
                            </select>
                        )}
                        {selected && selected.kind === 'enum' && (
                            <select className={cls.overrideSelect} value={valueInput} onChange={e => { setValueInput(e.target.value) }}>
                                <option value="">{String(t('Выберите значение'))}</option>
                                {(selected.enumValues || []).map(v => (
                                    <option key={v} value={v}>{String(t(v))}</option>
                                ))}
                            </select>
                        )}
                        {selected && (selected.kind === 'number') && (
                            <Input
                                type="number"
                                value={valueInput}
                                onChange={setValueInput}
                                placeholder={`${selected.min ?? 0}..${selected.max ?? 100}`}
                            />
                        )}
                        {selected && selected.kind === 'string' && (
                            <Input value={valueInput} onChange={setValueInput} placeholder={String(t('Значение'))} />
                        )}

                        {selected && (
                            <Input value={noteInput} onChange={setNoteInput} placeholder={String(t('Комментарий (необязательно)'))} />
                        )}

                        <HStack gap="8">
                            <Button
                                disabled={!buildPayload() || isSaving}
                                onClick={handleSave}
                                data-testid="override-save-btn"
                            >
                                {String(t('Сохранить'))}
                            </Button>
                        </HStack>
                    </VStack>
                )}
            </VStack>
        </Card>
    )
})
