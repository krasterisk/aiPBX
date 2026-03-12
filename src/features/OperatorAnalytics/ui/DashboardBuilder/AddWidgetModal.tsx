import { memo, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Radio, RadioGroup, FormControlLabel } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { Card } from '@/shared/ui/redesigned/Card'
import {
    DashboardWidget,
    WidgetType,
    DefaultMetricKey,
    OperatorProject,
} from '@/entities/Report'
import { DEFAULT_METRIC_LABELS } from './useWidgetData'

const WIDGET_TYPE_OPTIONS: Array<{ value: WidgetType, label: string }> = [
    { value: 'stat-card', label: 'Stat Card' },
    { value: 'bar-chart', label: 'Bar Chart' },
    { value: 'line-chart', label: 'Line Chart' },
    { value: 'pie-chart', label: 'Pie Chart' },
    { value: 'sparkline', label: 'Sparkline' },
    { value: 'heatmap', label: 'Heatmap' },
    { value: 'tag-cloud', label: 'Tag Cloud' },
]

const SIZE_OPTIONS = [
    { value: 'sm' as const, label: 'SM' },
    { value: 'md' as const, label: 'MD' },
    { value: 'lg' as const, label: 'LG' },
]

const SPECIAL_METRICS = [
    { id: 'sentiment', name: 'Настроение клиента' },
    { id: 'success_rate', name: 'Успешность звонков' },
]

interface AddWidgetModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (widget: Omit<DashboardWidget, 'id' | 'position'>) => void
    project?: OperatorProject
    editWidget?: DashboardWidget
}

export const AddWidgetModal = memo((props: AddWidgetModalProps) => {
    const { isOpen, onClose, onAdd, project, editWidget } = props
    const { t } = useTranslation('reports')

    const [widgetType, setWidgetType] = useState<WidgetType>(editWidget?.widgetType ?? 'stat-card')
    const [source, setSource] = useState<'default' | 'custom'>(editWidget?.source ?? 'default')
    const [metricId, setMetricId] = useState(editWidget?.metricId ?? '')
    const [size, setSize] = useState<'sm' | 'md' | 'lg'>(editWidget?.size ?? 'sm')
    const [title, setTitle] = useState(editWidget?.title ?? '')

    // Build metric options based on source
    const metricOptions = useMemo(() => {
        if (source === 'default') {
            const defaultOptions = (Object.keys(DEFAULT_METRIC_LABELS) as DefaultMetricKey[]).map(key => ({
                value: key,
                label: DEFAULT_METRIC_LABELS[key],
            }))
            return [...defaultOptions, ...SPECIAL_METRICS.map(m => ({ value: m.id, label: m.name }))]
        }
        // Custom metrics from project schema
        return project?.customMetricsSchema?.map(m => ({
            value: m.id,
            label: m.name,
        })) ?? []
    }, [source, project?.customMetricsSchema])

    const selectedMetricOption = metricOptions.find(o => o.value === metricId) ?? null

    const handleAdd = useCallback(() => {
        if (!metricId) return
        const defaultTitle = title.trim() || selectedMetricOption?.label || metricId
        onAdd({
            title: defaultTitle,
            source,
            metricId,
            widgetType,
            size,
        })
        onClose()
    }, [metricId, title, source, widgetType, size, selectedMetricOption, onAdd, onClose])

    const radioSx = {
        color: 'var(--text-redesigned)',
        '&.Mui-checked': { color: 'var(--accent-redesigned)' },
    }

    const formLabelSx = {
        '& .MuiFormControlLabel-label': {
            color: 'var(--text-redesigned)',
            fontSize: 'var(--font-size-m)',
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} lazy showClose size={'narrow'}>
            <VStack gap={'16'} max>
                <Text
                    title={editWidget ? String(t('Редактировать виджет')) : String(t('Добавить виджет'))}
                    bold
                />

                {/* Widget Type */}
                <Combobox
                    options={WIDGET_TYPE_OPTIONS}
                    getOptionLabel={(o: { value: string, label: string }) => o.label}
                    value={WIDGET_TYPE_OPTIONS.find(o => o.value === widgetType) ?? null}
                    onChange={(_, val) => { val && setWidgetType((val as { value: WidgetType }).value) }}
                    label={String(t('Тип виджета'))}
                    disableClearable
                />

                {/* Source */}
                <VStack gap={'4'}>
                    <Text text={String(t('Источник'))} size={'s'} bold />
                    <RadioGroup
                        row
                        value={source}
                        onChange={e => {
                            setSource(e.target.value as 'default' | 'custom')
                            setMetricId('')
                        }}
                    >
                        <FormControlLabel
                            value="default"
                            control={<Radio sx={radioSx} />}
                            label={String(t('По умолчанию'))}
                            sx={formLabelSx}
                        />
                        <FormControlLabel
                            value="custom"
                            control={<Radio sx={radioSx} />}
                            label={String(t('Кастомная'))}
                            sx={formLabelSx}
                            disabled={!project?.customMetricsSchema?.length}
                        />
                    </RadioGroup>
                </VStack>

                {/* Metric */}
                <Combobox
                    options={metricOptions}
                    getOptionLabel={(o: { value: string, label: string }) => o.label}
                    value={selectedMetricOption}
                    onChange={(_, val) => {
                        const v = val as { value: string, label: string } | null
                        setMetricId(v?.value ?? '')
                        if (!title.trim() && v) setTitle(v.label)
                    }}
                    label={String(t('Метрика'))}
                />

                {/* Size */}
                <VStack gap={'4'}>
                    <Text text={String(t('Размер'))} size={'s'} bold />
                    <RadioGroup
                        row
                        value={size}
                        onChange={e => { setSize(e.target.value as 'sm' | 'md' | 'lg') }}
                    >
                        {SIZE_OPTIONS.map(opt => (
                            <FormControlLabel
                                key={opt.value}
                                value={opt.value}
                                control={<Radio sx={radioSx} />}
                                label={opt.label}
                                sx={formLabelSx}
                            />
                        ))}
                    </RadioGroup>
                </VStack>

                {/* Title */}
                <Textarea
                    label={String(t('Название виджета'))}
                    value={title}
                    onChange={e => { setTitle(e.target.value) }}
                    size={'small'}
                    multiline={false}
                />

                {/* Preview */}
                {metricId && (
                    <Card variant={'glass'} border={'partial'} padding={'16'} max>
                        <VStack gap={'4'}>
                            <Text text={String(t('Превью'))} size={'xs'} />
                            <Text text={`${widgetType}: ${title || metricId}`} size={'s'} bold />
                            <Text text={`${t('Размер')}: ${size.toUpperCase()} | ${t('Источник')}: ${source}`} size={'xs'} />
                        </VStack>
                    </Card>
                )}

                {/* Actions */}
                <HStack max justify={'end'} gap={'12'}>
                    <Button variant={'glass-action'} onClick={onClose}
                        addonLeft={<CloseIcon fontSize={'small'} />}
                    >
                        {String(t('Отмена'))}
                    </Button>
                    <Button
                        variant={'glass-action'}
                        color={'success'}
                        onClick={handleAdd}
                        disabled={!metricId}
                        addonLeft={<AddIcon fontSize={'small'} />}
                    >
                        {editWidget ? String(t('Сохранить')) : String(t('Добавить'))}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    )
})
