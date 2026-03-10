import { memo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Popover } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { DashboardWidget, WidgetType } from '@/entities/Report'

const WIDGET_TYPE_OPTIONS: { value: WidgetType; label: string }[] = [
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

interface WidgetSettingsPopoverProps {
    widget: DashboardWidget
    anchorEl: HTMLElement | null
    onClose: () => void
    onSave: (updated: DashboardWidget) => void
}

export const WidgetSettingsPopover = memo((props: WidgetSettingsPopoverProps) => {
    const { widget, anchorEl, onClose, onSave } = props
    const { t } = useTranslation('reports')

    const [title, setTitle] = useState(widget.title)
    const [widgetType, setWidgetType] = useState(widget.widgetType)
    const [size, setSize] = useState(widget.size)

    const handleSave = useCallback(() => {
        onSave({
            ...widget,
            title: title.trim() || widget.title,
            widgetType,
            size,
        })
        onClose()
    }, [widget, title, widgetType, size, onSave, onClose])

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            slotProps={{
                paper: {
                    sx: {
                        background: 'var(--glass-bg-primary)',
                        backdropFilter: 'var(--glass-blur-md)',
                        border: 'var(--glass-border-primary)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--card-padding-md)',
                        minWidth: 280,
                        color: 'var(--text-redesigned)',
                    },
                },
            }}
        >
            <VStack gap={'12'}>
                <Text text={String(t('Настройки виджета'))} bold size={'s'} />

                <Textarea
                    label={String(t('Название'))}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    size={'small'}
                    multiline={false}
                />

                <Combobox
                    options={WIDGET_TYPE_OPTIONS}
                    getOptionLabel={(o: { value: string; label: string }) => o.label}
                    value={WIDGET_TYPE_OPTIONS.find(o => o.value === widgetType) ?? null}
                    onChange={(_, val) => val && setWidgetType((val as { value: WidgetType }).value)}
                    label={String(t('Тип'))}
                    disableClearable
                />

                <Combobox
                    options={SIZE_OPTIONS}
                    getOptionLabel={(o: { value: string; label: string }) => o.label}
                    value={SIZE_OPTIONS.find(o => o.value === size) ?? null}
                    onChange={(_, val) => val && setSize((val as { value: typeof size }).value)}
                    label={String(t('Размер'))}
                    disableClearable
                />

                <Button
                    variant={'glass-action'}
                    color={'success'}
                    size={'s'}
                    fullWidth
                    onClick={handleSave}
                    addonLeft={<SaveIcon fontSize={'small'} />}
                >
                    {String(t('Сохранить'))}
                </Button>
            </VStack>
        </Popover>
    )
})
