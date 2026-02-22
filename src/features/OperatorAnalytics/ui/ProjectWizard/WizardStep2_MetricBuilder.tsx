import { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import { MetricDefinition, DefaultMetricKey } from '@/entities/Report'
import { IconButton } from '@mui/material'
import cls from './ProjectWizard.module.scss'

const METRIC_TYPES = [
    { label: 'Boolean (Да/Нет)', value: 'boolean' },
    { label: 'Number (Число)', value: 'number' },
    { label: 'Enum (Список)', value: 'enum' },
    { label: 'String (Текст)', value: 'string' },
]

interface WizardStep2Props {
    metrics: MetricDefinition[]
    systemPrompt: string
    visibleDefaultMetrics: DefaultMetricKey[]
    onChangeMetrics: (metrics: MetricDefinition[]) => void
    canUndo: boolean
    canRedo: boolean
    onUndo: () => void
    onRedo: () => void
}

const generateId = (name: string): string =>
    name.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') || `metric_${Date.now()}`

export const WizardStep2_MetricBuilder = memo((props: WizardStep2Props) => {
    const {
        metrics, systemPrompt, visibleDefaultMetrics,
        onChangeMetrics, canUndo, canRedo, onUndo, onRedo
    } = props
    const { t } = useTranslation('reports')

    const handleAdd = useCallback(() => {
        onChangeMetrics([
            ...metrics,
            { id: `metric_${Date.now()}`, name: '', type: 'boolean', description: '' }
        ])
    }, [metrics, onChangeMetrics])

    const handleRemove = useCallback((idx: number) => {
        onChangeMetrics(metrics.filter((_, i) => i !== idx))
    }, [metrics, onChangeMetrics])

    const handleChange = useCallback((idx: number, field: keyof MetricDefinition, value: any) => {
        const updated = metrics.map((m, i) => {
            if (i !== idx) return m
            const newMetric = { ...m, [field]: value }
            if (field === 'name') {
                newMetric.id = generateId(value)
            }
            return newMetric
        })
        onChangeMetrics(updated)
    }, [metrics, onChangeMetrics])

    // Build prompt preview
    const promptPreview = useMemo(() => {
        const lines: string[] = []
        if (systemPrompt) {
            lines.push(`[System Context]\n${systemPrompt}\n`)
        }
        lines.push('[Default Metrics]')
        visibleDefaultMetrics.forEach(m => lines.push(`  - ${m}`))
        lines.push('')
        if (metrics.length > 0) {
            lines.push('[Custom Metrics]')
            metrics.forEach(m => {
                lines.push(`  - ${m.id} (${m.type}): ${m.description || '—'}`)
                if (m.type === 'enum' && m.enumValues?.length) {
                    lines.push(`    Values: ${m.enumValues.join(', ')}`)
                }
            })
        }
        return lines.join('\n')
    }, [systemPrompt, visibleDefaultMetrics, metrics])

    return (
        <VStack gap={'16'} max>
            <HStack max justify={'between'} align={'center'} wrap={'wrap'} gap={'8'}>
                <Text title={String(t('Кастомные метрики'))} bold />
                <HStack gap={'8'} align={'center'} className={cls.undoRedoToolbar}>
                    <IconButton size={'small'} onClick={onUndo} disabled={!canUndo} className={cls.iconBtn}>
                        <UndoIcon fontSize={'small'} />
                    </IconButton>
                    <IconButton size={'small'} onClick={onRedo} disabled={!canRedo} className={cls.iconBtn}>
                        <RedoIcon fontSize={'small'} />
                    </IconButton>
                </HStack>
            </HStack>

            <div className={cls.metricsGrid}>
                {metrics.map((metric, idx) => (
                    <div key={metric.id + idx} className={cls.metricCard}>
                        <div className={cls.metricHeader}>
                            <Text text={metric.name || String(t('Новая метрика'))} bold />
                            <Button
                                variant={'glass-action'}
                                color={'error'}
                                size={'s'}
                                onClick={() => handleRemove(idx)}
                                addonLeft={<DeleteOutlineIcon fontSize={'small'} />}
                            >
                                {String(t('Удалить'))}
                            </Button>
                        </div>
                        <div className={cls.metricFields}>
                            <Textarea
                                label={String(t('Название метрики'))}
                                value={metric.name}
                                onChange={e => handleChange(idx, 'name', e.target.value)}
                                size={'small'}
                                fullWidth
                                multiline={false}
                            />
                            <Combobox
                                options={METRIC_TYPES}
                                value={METRIC_TYPES.find(o => o.value === metric.type) || null}
                                onChange={(_, val: any) => handleChange(idx, 'type', val?.value || 'boolean')}
                                getOptionLabel={(o: any) => o.label || ''}
                                isOptionEqualToValue={(o: any, v: any) => o.value === v.value}
                                label={String(t('Тип метрики'))}
                                disableClearable
                            />
                            <Textarea
                                label={String(t('Описание для LLM'))}
                                value={metric.description}
                                onChange={e => handleChange(idx, 'description', e.target.value)}
                                size={'small'}
                                fullWidth
                                multiline
                                rows={2}
                                inputProps={{ maxLength: 500 }}
                                helperText={`${metric.description.length}/500`}
                            />
                            {metric.type === 'enum' && (
                                <Textarea
                                    label={String(t('Значения (через запятую)'))}
                                    value={metric.enumValues?.join(', ') || ''}
                                    onChange={e => handleChange(idx, 'enumValues', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
                                    size={'small'}
                                    fullWidth
                                    multiline={false}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Button
                variant={'glass-action'}
                addonLeft={<AddIcon fontSize={'small'} />}
                onClick={handleAdd}
            >
                {String(t('Добавить метрику'))}
            </Button>

            {/* Prompt Preview */}
            <VStack gap={'8'} max>
                <Text text={String(t('Предпросмотр промпта'))} bold />
                <div className={cls.promptPreview}>
                    <pre className={cls.promptText}>{promptPreview}</pre>
                </div>
            </VStack>
        </VStack>
    )
})
