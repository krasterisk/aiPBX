import { memo, useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
// @ts-ignore – react-grid-layout v2 types conflict with moduleResolution:node
import { Responsive } from 'react-grid-layout'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import RestoreIcon from '@mui/icons-material/Restore'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Combobox } from '@/shared/ui/mui/Combobox'
import {
    DashboardWidget,
    DashboardConfig,
    OperatorDashboardResponse,
    OperatorProject,
    useUpdateOperatorProject,
    useGetOperatorProjects,
} from '@/entities/Report'
import { WidgetRenderer } from './WidgetRenderer'
import { AddWidgetModal } from './AddWidgetModal'
import { WidgetSettingsPopover } from './WidgetSettingsPopover'
import cls from './DashboardBuilder.module.scss'

// ─── Size → grid unit mapping ────────────────────────────────────────────────
const sizeToW = (size: string): number => {
    switch (size) {
        case 'sm': return 3
        case 'md': return 6
        case 'lg': return 12
        default: return 4
    }
}

const sizeToH = (widgetType: string): number => {
    switch (widgetType) {
        case 'stat-card': return 2
        case 'sparkline': return 2
        case 'bar-chart': return 4
        case 'line-chart': return 4
        case 'pie-chart': return 4
        case 'heatmap': return 4
        case 'tag-cloud': return 3
        default: return 3
    }
}

// ─── Preset definitions (Phase 4) ────────────────────────────────────────────
interface PresetConfig {
    id: string
    nameKey: string
    descriptionKey: string
    icon: string
    widgets: Omit<DashboardWidget, 'id'>[]
}

const PRESETS: PresetConfig[] = [
    {
        id: 'overview',
        nameKey: 'Обзорный',
        descriptionKey: 'Основные показатели + графики',
        icon: '📊',
        widgets: [
            { title: 'Качество приветствия', source: 'default', metricId: 'greeting_quality', widgetType: 'stat-card', size: 'sm', position: 0 },
            { title: 'Следование скрипту', source: 'default', metricId: 'script_compliance', widgetType: 'stat-card', size: 'sm', position: 1 },
            { title: 'Вежливость', source: 'default', metricId: 'politeness_empathy', widgetType: 'stat-card', size: 'sm', position: 2 },
            { title: 'Активное слушание', source: 'default', metricId: 'active_listening', widgetType: 'stat-card', size: 'sm', position: 3 },
            { title: 'Знание продукта', source: 'default', metricId: 'product_knowledge', widgetType: 'stat-card', size: 'sm', position: 4 },
            { title: 'Решение проблемы', source: 'default', metricId: 'problem_resolution', widgetType: 'stat-card', size: 'sm', position: 5 },
            { title: 'Динамика звонков', source: 'default', metricId: 'calls', widgetType: 'line-chart', size: 'lg', position: 6 },
            { title: 'Настроение', source: 'default', metricId: 'sentiment', widgetType: 'pie-chart', size: 'md', position: 7 },
        ],
    },
    {
        id: 'detailed',
        nameKey: 'Детальный',
        descriptionKey: 'Все метрики + heatmap + графики',
        icon: '🔍',
        widgets: [
            { title: 'Качество приветствия', source: 'default', metricId: 'greeting_quality', widgetType: 'stat-card', size: 'sm', position: 0 },
            { title: 'Следование скрипту', source: 'default', metricId: 'script_compliance', widgetType: 'stat-card', size: 'sm', position: 1 },
            { title: 'Вежливость', source: 'default', metricId: 'politeness_empathy', widgetType: 'stat-card', size: 'sm', position: 2 },
            { title: 'Активное слушание', source: 'default', metricId: 'active_listening', widgetType: 'stat-card', size: 'sm', position: 3 },
            { title: 'Работа с возражениями', source: 'default', metricId: 'objection_handling', widgetType: 'stat-card', size: 'sm', position: 4 },
            { title: 'Знание продукта', source: 'default', metricId: 'product_knowledge', widgetType: 'stat-card', size: 'sm', position: 5 },
            { title: 'Решение проблемы', source: 'default', metricId: 'problem_resolution', widgetType: 'stat-card', size: 'sm', position: 6 },
            { title: 'Темп речи', source: 'default', metricId: 'speech_clarity_pace', widgetType: 'stat-card', size: 'sm', position: 7 },
            { title: 'Качество завершения', source: 'default', metricId: 'closing_quality', widgetType: 'stat-card', size: 'sm', position: 8 },
            { title: 'Метрики', source: 'default', metricId: 'all', widgetType: 'bar-chart', size: 'lg', position: 9 },
            { title: 'Динамика', source: 'default', metricId: 'calls', widgetType: 'line-chart', size: 'md', position: 10 },
            { title: 'Настроение', source: 'default', metricId: 'sentiment', widgetType: 'pie-chart', size: 'md', position: 11 },
            { title: 'Активность', source: 'default', metricId: 'activity', widgetType: 'heatmap', size: 'lg', position: 12 },
        ],
    },
    {
        id: 'minimal',
        nameKey: 'Минимальный',
        descriptionKey: '3 ключевых показателя',
        icon: '⚡',
        widgets: [
            { title: 'Качество приветствия', source: 'default', metricId: 'greeting_quality', widgetType: 'stat-card', size: 'sm', position: 0 },
            { title: 'Следование скрипту', source: 'default', metricId: 'script_compliance', widgetType: 'stat-card', size: 'sm', position: 1 },
            { title: 'Решение проблемы', source: 'default', metricId: 'problem_resolution', widgetType: 'stat-card', size: 'sm', position: 2 },
        ],
    },
]

// ─── Component ───────────────────────────────────────────────────────────────

interface DashboardBuilderProps {
    project: OperatorProject
    dashboardData?: OperatorDashboardResponse
    onClose: () => void
}

export const DashboardBuilder = memo((props: DashboardBuilderProps) => {
    const { project, dashboardData, onClose } = props
    const { t } = useTranslation('reports')
    const [updateProject] = useUpdateOperatorProject()
    const { data: allProjects } = useGetOperatorProjects()

    // Local widget state
    const [widgets, setWidgets] = useState<DashboardWidget[]>(
        project.dashboardConfig?.widgets ?? []
    )
    const [isEditing, setIsEditing] = useState(false)
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [editingWidget, setEditingWidget] = useState<DashboardWidget | undefined>()
    const [settingsWidget, setSettingsWidget] = useState<DashboardWidget | null>(null)
    const [settingsAnchor, setSettingsAnchor] = useState<HTMLElement | null>(null)

    // Container width for grid (manual ResizeObserver instead of useContainerWidth)
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(0)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const ro = new ResizeObserver(entries => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width)
            }
        })
        ro.observe(el)
        setContainerWidth(el.getBoundingClientRect().width)
        return () => ro.disconnect()
    }, [widgets.length])

    // Debounced save ref
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

    // ── Save to backend ─────────────────────────────────────────────────────
    const saveConfig = useCallback((updatedWidgets: DashboardWidget[]) => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

        saveTimeoutRef.current = setTimeout(async () => {
            try {
                await updateProject({
                    id: project.id,
                    dashboardConfig: {
                        widgets: updatedWidgets,
                        maxWidgets: 20,
                    },
                }).unwrap()
            } catch (err) {
                console.error('Failed to save dashboard config:', err)
            }
        }, 1500) // Debounce 1.5s
    }, [updateProject, project.id])

    // ── Widget CRUD ──────────────────────────────────────────────────────────
    const handleAddWidget = useCallback((widgetData: Omit<DashboardWidget, 'id' | 'position'>) => {
        const newWidget: DashboardWidget = {
            ...widgetData,
            id: `widget_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            position: widgets.length,
        }
        const updated = [...widgets, newWidget]
        setWidgets(updated)
        saveConfig(updated)
    }, [widgets, saveConfig])

    const handleDeleteWidget = useCallback((widgetId: string) => {
        const updated = widgets.filter(w => w.id !== widgetId)
            .map((w, i) => ({ ...w, position: i }))
        setWidgets(updated)
        saveConfig(updated)
    }, [widgets, saveConfig])

    const handleUpdateWidget = useCallback((updated: DashboardWidget) => {
        const newWidgets = widgets.map(w => w.id === updated.id ? updated : w)
        setWidgets(newWidgets)
        saveConfig(newWidgets)
    }, [widgets, saveConfig])

    const handleEditWidget = useCallback((widget: DashboardWidget) => {
        setEditingWidget(widget)
        setAddModalOpen(true)
    }, [])

    // ── Grid DnD (Phase 3) ───────────────────────────────────────────────────
    const layouts = useMemo(() => {
        return {
            lg: widgets.map((widget, index) => ({
                i: widget.id,
                x: (index * sizeToW(widget.size)) % 12,
                y: Math.floor((index * sizeToW(widget.size)) / 12),
                w: sizeToW(widget.size),
                h: sizeToH(widget.widgetType),
                minW: 2,
                maxW: 12,
                static: !isEditing,
            })),
        }
    }, [widgets, isEditing])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleLayoutChange = useCallback((layout: any, _layouts?: any) => {
        if (!isEditing) return
        const updated = widgets.map(w => {
            const item = layout.find((l: any) => l.i === w.id)
            if (item) {
                return { ...w, position: item.y * 12 + item.x }
            }
            return w
        }).sort((a, b) => a.position - b.position)
        setWidgets(updated)
        saveConfig(updated)
    }, [isEditing, widgets, saveConfig])

    // ── Presets (Phase 4) ────────────────────────────────────────────────────
    const handleApplyPreset = useCallback((preset: PresetConfig) => {
        const newWidgets = preset.widgets.map((w, i) => ({
            ...w,
            id: `widget_${Date.now()}_${i}`,
        })) as DashboardWidget[]
        setWidgets(newWidgets)
        saveConfig(newWidgets)
    }, [saveConfig])

    const handleReset = useCallback(() => {
        setWidgets([])
        saveConfig([])
    }, [saveConfig])

    // Phase 4: Copy layout from another project
    const otherProjects = allProjects?.filter(p => p.id !== project.id) ?? []
    const projectOptions = otherProjects.map(p => ({
        value: p.id,
        label: p.name,
        config: p.dashboardConfig,
    }))

    const handleCopyFromProject = useCallback((projectConfig: DashboardConfig | undefined) => {
        if (!projectConfig?.widgets?.length) return
        const newWidgets = projectConfig.widgets.map((w, i) => ({
            ...w,
            id: `widget_${Date.now()}_${i}`,
        }))
        setWidgets(newWidgets)
        saveConfig(newWidgets)
    }, [saveConfig])

    // Phase 4: Export config as JSON
    const handleExport = useCallback(() => {
        const config: DashboardConfig = { widgets, maxWidgets: 20 }
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `dashboard_${project.name.replace(/\s+/g, '_')}.json`
        a.click()
        URL.revokeObjectURL(url)
    }, [widgets, project.name])

    return (
        <VStack gap={'16'} max className={cls.DashboardBuilder}>
            {/* Header */}
            <HStack max justify={'between'} align={'center'} wrap={'wrap'} gap={'8'}>
                <HStack gap={'8'} align={'center'}>
                    <Button variant={'glass-action'} size={'s'} onClick={onClose}
                        addonLeft={<ArrowBackIcon fontSize={'small'} />}
                    >
                        {String(t('Назад'))}
                    </Button>
                    <Text title={`${t('Конструктор дашборда')} — ${project.name}`} bold size={'s'} />
                </HStack>

                <HStack gap={'8'} wrap={'wrap'}>
                    <Button variant={'glass-action'} size={'s'} onClick={() => setIsEditing(!isEditing)}
                        addonLeft={<EditIcon fontSize={'small'} />}
                    >
                        {isEditing ? String(t('Готово')) : String(t('Редактировать'))}
                    </Button>
                    <Button variant={'glass-action'} color={'success'} size={'s'} onClick={() => {
                        setEditingWidget(undefined)
                        setAddModalOpen(true)
                    }}
                        addonLeft={<AddIcon fontSize={'small'} />}
                        disabled={widgets.length >= 20}
                    >
                        {String(t('Добавить виджет'))}
                    </Button>
                </HStack>
            </HStack>

            {/* Presets toolbar (Phase 4) */}
            <Card max variant={'glass'} border={'partial'} padding={'16'}>
                <VStack gap={'12'} max>
                    <Text text={String(t('Пресеты и инструменты'))} bold size={'s'} />
                    <HStack gap={'8'} wrap={'wrap'} align={'center'}>
                        {PRESETS.map(preset => (
                            <Button
                                key={preset.id}
                                variant={'glass-action'}
                                size={'s'}
                                onClick={() => handleApplyPreset(preset)}
                                addonLeft={<DashboardIcon fontSize={'small'} />}
                            >
                                {`${preset.icon} ${t(preset.nameKey)}`}
                            </Button>
                        ))}

                        <Button variant={'glass-action'} color={'error'} size={'s'} onClick={handleReset}
                            addonLeft={<RestoreIcon fontSize={'small'} />}
                        >
                            {String(t('Сбросить'))}
                        </Button>

                        <Button variant={'glass-action'} size={'s'} onClick={handleExport}
                            addonLeft={<FileDownloadIcon fontSize={'small'} />}
                        >
                            {String(t('Экспорт JSON'))}
                        </Button>

                        {projectOptions.length > 0 && (
                            <Combobox
                                options={projectOptions}
                                getOptionLabel={(o: { label: string }) => o.label}
                                onChange={(_, val) => {
                                    const v = val as { config?: DashboardConfig } | null
                                    handleCopyFromProject(v?.config)
                                }}
                                label={String(t('Копировать из проекта'))}
                                value={null}
                                sx={{ minWidth: 200, maxWidth: 300 }}
                                size={'small'}
                            />
                        )}
                    </HStack>
                </VStack>
            </Card>

            {/* Widget count info */}
            <HStack max justify={'between'} align={'center'}>
                <Text text={`${widgets.length} / 20 ${t('виджетов')}`} size={'s'} />
                {isEditing && (
                    <Text text={String(t('Перетаскивайте виджеты для изменения порядка'))} size={'s'} variant={'accent'} />
                )}
            </HStack>

            {/* Grid (Phase 3) */}
            {widgets.length > 0 ? (
                <div ref={containerRef} className={cls.gridContainer}>
                    {containerWidth > 0 && (
                        <Responsive
                            className="dashboard-grid"
                            width={containerWidth}
                            layouts={layouts}
                            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                            cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
                            rowHeight={60}
                            // @ts-ignore - v2 Layout type compat
                            onLayoutChange={handleLayoutChange}
                            margin={[12, 12]}
                        >
                            {widgets.map(widget => (
                                <div key={widget.id}>
                                    <WidgetRenderer
                                        widget={widget}
                                        dashboardData={dashboardData}
                                        project={project}
                                        isEditing={isEditing}
                                        onEdit={handleEditWidget}
                                        onDelete={handleDeleteWidget}
                                    />
                                </div>
                            ))}
                        </Responsive>
                    )}
                </div>
            ) : (
                <VStack max className={cls.emptyState}>
                    <VStack gap={'8'} align={'center'}>
                        <DashboardIcon sx={{ fontSize: 48, color: 'var(--hint-redesigned)', opacity: 0.5 }} />
                        <Text text={String(t('Нет виджетов'))} size={'l'} />
                        <Text text={String(t('Добавьте виджеты или выберите пресет'))} size={'s'} />
                        <Button
                            variant={'glass-action'}
                            color={'success'}
                            onClick={() => {
                                setEditingWidget(undefined)
                                setAddModalOpen(true)
                            }}
                            addonLeft={<AddIcon fontSize={'small'} />}
                        >
                            {String(t('Добавить первый виджет'))}
                        </Button>
                    </VStack>
                </VStack>
            )}

            {/* Add/Edit Widget Modal */}
            <AddWidgetModal
                isOpen={addModalOpen}
                onClose={() => {
                    setAddModalOpen(false)
                    setEditingWidget(undefined)
                }}
                onAdd={handleAddWidget}
                project={project}
                editWidget={editingWidget}
            />

            {/* Widget Settings Popover */}
            {settingsWidget && (
                <WidgetSettingsPopover
                    widget={settingsWidget}
                    anchorEl={settingsAnchor}
                    onClose={() => {
                        setSettingsWidget(null)
                        setSettingsAnchor(null)
                    }}
                    onSave={handleUpdateWidget}
                />
            )}
        </VStack>
    )
})
