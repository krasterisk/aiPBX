import { memo, useState, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckIcon from '@mui/icons-material/Check'
import {
    MetricDefinition,
    DefaultMetricKey,
    WebhookEvent,
    ProjectTemplate,
    OperatorProject,
    useCreateOperatorProject,
    useUpdateOperatorProject
} from '@/entities/Report'
import { WizardStep0_Templates } from './WizardStep0_Templates'
import { WizardStep1_Chat } from './WizardStep1_Chat'
import { WizardStep2_MetricBuilder } from './WizardStep2_MetricBuilder'
import { WizardStep3_DefaultMetrics } from './WizardStep3_DefaultMetrics'
import { WizardStep4_Webhook } from './WizardStep4_Webhook'
import cls from './ProjectWizard.module.scss'

const TOTAL_STEPS = 5
const DRAFT_KEY = 'aiPBX_wizard_draft'

const ALL_DEFAULT_METRICS: DefaultMetricKey[] = [
    'greeting_quality', 'script_compliance', 'politeness_empathy',
    'active_listening', 'objection_handling', 'product_knowledge',
    'problem_resolution', 'speech_clarity_pace', 'closing_quality'
]

interface WizardDraft {
    name: string
    description: string
    systemPrompt: string
    customMetricsSchema: MetricDefinition[]
    visibleDefaultMetrics: DefaultMetricKey[]
    webhookUrl: string
    webhookEvents: WebhookEvent[]
    selectedTemplateId?: string
    step: number
}

const getEmptyDraft = (): WizardDraft => ({
    name: '',
    description: '',
    systemPrompt: '',
    customMetricsSchema: [],
    visibleDefaultMetrics: [...ALL_DEFAULT_METRICS],
    webhookUrl: '',
    webhookEvents: [],
    step: 0
})

interface ProjectWizardProps {
    editProject?: OperatorProject
    onClose: () => void
    onSuccess?: () => void
}

export const ProjectWizard = memo(({ editProject, onClose, onSuccess }: ProjectWizardProps) => {
    const { t } = useTranslation('reports')
    const [createProject, { isLoading: isCreating }] = useCreateOperatorProject()
    const [updateProject, { isLoading: isUpdating }] = useUpdateOperatorProject()

    // ── State ─────────────────────────────────────────────────────────────────
    const [step, setStep] = useState(0)
    const [name, setName] = useState(editProject?.name ?? '')
    const [description, setDescription] = useState(editProject?.description ?? '')
    const [systemPrompt, setSystemPrompt] = useState(editProject?.systemPrompt ?? '')
    const [customMetrics, setCustomMetrics] = useState<MetricDefinition[]>(editProject?.customMetricsSchema ?? [])
    const [visibleDefaults, setVisibleDefaults] = useState<DefaultMetricKey[]>(editProject?.visibleDefaultMetrics ?? [...ALL_DEFAULT_METRICS])
    const [webhookUrl, setWebhookUrl] = useState(editProject?.webhookUrl ?? '')
    const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>(editProject?.webhookEvents ?? [])
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>()

    // ── Undo / Redo for metrics ───────────────────────────────────────────────
    const [metricsHistory, setMetricsHistory] = useState<MetricDefinition[][]>([editProject?.customMetricsSchema ?? []])
    const [historyIdx, setHistoryIdx] = useState(0)

    const handleSetMetrics = useCallback((newMetrics: MetricDefinition[]) => {
        setCustomMetrics(newMetrics)
        setMetricsHistory(prev => {
            const trimmed = prev.slice(0, historyIdx + 1)
            return [...trimmed, newMetrics]
        })
        setHistoryIdx(prev => prev + 1)
    }, [historyIdx])

    const canUndo = historyIdx > 0
    const canRedo = historyIdx < metricsHistory.length - 1

    const handleUndo = useCallback(() => {
        if (!canUndo) return
        const newIdx = historyIdx - 1
        setHistoryIdx(newIdx)
        setCustomMetrics(metricsHistory[newIdx])
    }, [canUndo, historyIdx, metricsHistory])

    const handleRedo = useCallback(() => {
        if (!canRedo) return
        const newIdx = historyIdx + 1
        setHistoryIdx(newIdx)
        setCustomMetrics(metricsHistory[newIdx])
    }, [canRedo, historyIdx, metricsHistory])

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                if (e.shiftKey) { handleRedo() } else { handleUndo() }
                e.preventDefault()
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [handleUndo, handleRedo])

    // ── localStorage draft autosave ───────────────────────────────────────────
    const isInitRef = useRef(true)

    useEffect(() => {
        if (editProject) return // skip draft for edit mode
        if (isInitRef.current) {
            isInitRef.current = false
            try {
                const saved = localStorage.getItem(DRAFT_KEY)
                if (saved) {
                    const draft: WizardDraft = JSON.parse(saved)
                    setName(draft.name)
                    setDescription(draft.description)
                    setSystemPrompt(draft.systemPrompt)
                    setCustomMetrics(draft.customMetricsSchema)
                    setVisibleDefaults(draft.visibleDefaultMetrics)
                    setWebhookUrl(draft.webhookUrl)
                    setWebhookEvents(draft.webhookEvents)
                    setSelectedTemplateId(draft.selectedTemplateId)
                    setStep(draft.step)
                }
            } catch { /* ignore */ }
            return
        }
        const draft: WizardDraft = {
            name, description, systemPrompt,
            customMetricsSchema: customMetrics,
            visibleDefaultMetrics: visibleDefaults,
            webhookUrl, webhookEvents, selectedTemplateId,
            step
        }
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    }, [name, description, systemPrompt, customMetrics, visibleDefaults, webhookUrl, webhookEvents, selectedTemplateId, step, editProject])

    // ── Template select ───────────────────────────────────────────────────────
    const handleTemplateSelect = useCallback((template: ProjectTemplate) => {
        setSelectedTemplateId(template.id)
        setSystemPrompt(template.systemPrompt)
        setCustomMetrics(template.customMetricsSchema)
        setVisibleDefaults(template.visibleDefaultMetrics)
        setMetricsHistory([template.customMetricsSchema])
        setHistoryIdx(0)
        if (template.id === 'custom') {
            setStep(1) // go to chat
        } else {
            setStep(2) // skip chat, go to metric builder
        }
    }, [])

    const handleGenerateMetrics = useCallback(() => {
        // stub — in future, call backend SSE endpoint
        setStep(2)
    }, [])

    // ── Submit ────────────────────────────────────────────────────────────────
    const isSaving = isCreating || isUpdating

    const handleFinish = useCallback(async () => {
        try {
            const body = {
                name: name.trim() || t('Новый проект'),
                description: description.trim(),
                systemPrompt: systemPrompt.trim(),
                customMetricsSchema: customMetrics,
                visibleDefaultMetrics: visibleDefaults,
                webhookUrl: webhookUrl.trim() || undefined,
                webhookEvents: webhookEvents.length > 0 ? webhookEvents : undefined,
            }

            if (editProject) {
                await updateProject({ id: editProject.id, ...body }).unwrap()
            } else {
                await createProject(body).unwrap()
            }

            localStorage.removeItem(DRAFT_KEY)
            onSuccess?.()
            onClose()
        } catch (err) {
            console.error('Wizard save error:', err)
        }
    }, [name, description, systemPrompt, customMetrics, visibleDefaults, webhookUrl, webhookEvents, editProject, createProject, updateProject, onClose, onSuccess, t])

    // ── Step Labels ───────────────────────────────────────────────────────────
    const STEP_LABELS = [
        t('Шаблон'), t('AI Интервью'), t('Метрики'),
        t('Стандартные'), t('Webhooks')
    ]

    const canGoNext = step < TOTAL_STEPS - 1
    const canGoBack = step > 0

    return (
        <VStack gap={'16'} max className={cls.ProjectWizard}>
            {/* Name + Description (always visible) */}
            <HStack gap={'12'} max wrap={'wrap'}>
                <Textarea
                    label={String(t('Название проекта'))}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    size={'small'}
                    fullWidth
                    multiline={false}
                />
                <Textarea
                    label={String(t('Описание проекта'))}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    size={'small'}
                    fullWidth
                    multiline={false}
                />
            </HStack>

            {/* Stepper */}
            <div className={cls.stepper}>
                {STEP_LABELS.map((label, i) => (
                    <VStack key={i} align={'center'} gap={'4'}>
                        <button
                            type={'button'}
                            className={`${cls.stepDot} ${i === step ? cls.active : ''} ${i < step ? cls.completed : ''}`}
                            onClick={() => setStep(i)}
                        />
                        <span className={cls.stepLabel}>{label}</span>
                    </VStack>
                ))}
            </div>

            {/* Step Content */}
            <div className={cls.wizardContent}>
                {step === 0 && (
                    <WizardStep0_Templates
                        selectedTemplateId={selectedTemplateId}
                        onSelect={handleTemplateSelect}
                    />
                )}
                {step === 1 && (
                    <WizardStep1_Chat
                        systemPrompt={systemPrompt}
                        onChangeSystemPrompt={setSystemPrompt}
                        onGenerateMetrics={handleGenerateMetrics}
                    />
                )}
                {step === 2 && (
                    <WizardStep2_MetricBuilder
                        metrics={customMetrics}
                        systemPrompt={systemPrompt}
                        visibleDefaultMetrics={visibleDefaults}
                        onChangeMetrics={handleSetMetrics}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                    />
                )}
                {step === 3 && (
                    <WizardStep3_DefaultMetrics
                        visibleMetrics={visibleDefaults}
                        onChange={setVisibleDefaults}
                    />
                )}
                {step === 4 && (
                    <WizardStep4_Webhook
                        webhookUrl={webhookUrl}
                        webhookEvents={webhookEvents}
                        onChangeUrl={setWebhookUrl}
                        onChangeEvents={setWebhookEvents}
                    />
                )}
            </div>

            {/* Navigation */}
            <div className={cls.navButtons}>
                <Button
                    variant={'outline'}
                    onClick={canGoBack ? () => setStep(s => s - 1) : onClose}
                    addonLeft={<ArrowBackIcon fontSize={'small'} />}
                >
                    {canGoBack ? String(t('Назад')) : String(t('Отмена'))}
                </Button>

                {canGoNext ? (
                    <Button
                        variant={'glass-action'}
                        onClick={() => setStep(s => s + 1)}
                        addonRight={<ArrowForwardIcon fontSize={'small'} />}
                    >
                        {String(t('Далее'))}
                    </Button>
                ) : (
                    <Button
                        variant={'glass-action'}
                        onClick={handleFinish}
                        addonRight={<CheckIcon fontSize={'small'} />}
                        disabled={isSaving || !name.trim()}
                    >
                        {isSaving ? String(t('Сохранение...')) : String(t('Завершить'))}
                    </Button>
                )}
            </div>
        </VStack>
    )
})
