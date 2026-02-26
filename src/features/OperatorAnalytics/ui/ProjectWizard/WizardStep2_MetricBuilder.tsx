import { memo, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Card } from '@/shared/ui/redesigned/Card'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { MetricDefinition, DefaultMetricKey } from '@/entities/Report'
import { isUserAdmin } from '@/entities/User'

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
}

const generateId = (name: string): string =>
    name.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') || `metric_${Date.now()}`

export const WizardStep2_MetricBuilder = memo((props: WizardStep2Props) => {
    const {
        metrics, systemPrompt, visibleDefaultMetrics,
        onChangeMetrics
    } = props
    const { t } = useTranslation('reports')
    const isAdmin = useSelector(isUserAdmin)
    const [promptOpen, setPromptOpen] = useState(false)

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
            {/* Metric cards */}
            <VStack gap={'12'} max>
                {metrics.map((metric, idx) => (
                    <Card
                        key={idx}
                        variant={'glass'}
                        border={'partial'}
                        padding={'16'}
                        max
                    >
                        <VStack gap={'12'} max>
                            {/* Card header — name + delete */}
                            <HStack max justify={'between'} align={'center'}>
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
                            </HStack>

                            {/* Fields — name + type side by side */}
                            <HStack gap={'12'} max wrap={'wrap'}>
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
                            </HStack>

                            {/* Enum values — before description, only for enum type */}
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

                            {/* Description — full width */}
                            <Textarea
                                label={String(t('Описание для LLM'))}
                                value={metric.description}
                                onChange={e => handleChange(idx, 'description', e.target.value)}
                                size={'small'}
                                fullWidth
                                multiline
                                rows={2}
                                helperText={`${metric.description.length}/500`}
                            />
                        </VStack>
                    </Card>
                ))}
            </VStack>

            <Button
                variant={'glass-action'}
                addonLeft={<AddIcon fontSize={'small'} />}
                onClick={handleAdd}
            >
                {String(t('Добавить метрику'))}
            </Button>

            {/* Prompt Preview — collapsible, admin only */}
            {isAdmin && (
                <VStack gap={'0'} max>
                    <Button
                        variant={'clear'}
                        onClick={() => setPromptOpen(prev => !prev)}
                        addonRight={promptOpen
                            ? <ExpandLessIcon fontSize={'small'} />
                            : <ExpandMoreIcon fontSize={'small'} />
                        }
                    >
                        {String(t('Предпросмотр промпта'))}
                    </Button>
                    {promptOpen && (
                        <Card variant={'outlined'} border={'partial'} padding={'16'} max>
                            <Text
                                text={promptPreview}
                                size={'s'}
                            />
                        </Card>
                    )}
                </VStack>
            )}
        </VStack>
    )
})

