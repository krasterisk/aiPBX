import { memo, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckIcon from '@mui/icons-material/Check'
import {
    OperatorProject,
    useCreateOperatorProject,
    projectWizardActions,
    getWizardMethod,
    getWizardMethodStepDone,
    getWizardName,
    getWizardDescription,
    getWizardSystemPrompt,
    getWizardCustomMetrics,
    getWizardVisibleDefaultMetrics,
    getWizardWebhookUrl,
    getWizardWebhookHeaders,
    getWizardWebhookEvents,
    getWizardSelectedTemplateId,
} from '@/entities/Report'
import { WizardMethodChooser } from './WizardMethodChooser'
import { WizardPhaseIndicator } from './WizardPhaseIndicator'
import { WizardReviewSection } from './WizardReviewSection'
import { WizardHeader } from './WizardHeader'
import { ProjectSettingsForm } from './ProjectSettingsForm'
import { WizardStep0_Templates } from './WizardStep0_Templates'
import { WizardStep1_Chat } from './WizardStep1_Chat'
import cls from './ProjectWizard.module.scss'

interface ProjectWizardProps {
    editProject?: OperatorProject
    onClose: () => void
    onSuccess?: () => void
}

export const ProjectWizard = memo(({ editProject, onClose, onSuccess }: ProjectWizardProps) => {
    const { t } = useTranslation('reports')
    const dispatch = useAppDispatch()
    const [createProject, { isLoading: isCreating }] = useCreateOperatorProject()

    // ── Init on mount ─────────────────────────────────────────────────────────
    const initializedRef = useRef(false)
    useEffect(() => {
        if (initializedRef.current) return
        initializedRef.current = true
        if (editProject) {
            dispatch(projectWizardActions.openEdit(editProject))
        } else {
            dispatch(projectWizardActions.openCreate())
        }
    }, [dispatch, editProject])

    // ── Edit mode → flat settings form ────────────────────────────────────────
    if (editProject) {
        return (
            <ProjectSettingsForm
                editProject={editProject}
                onClose={onClose}
                onSuccess={onSuccess}
            />
        )
    }

    // ── Create mode → wizard flow ─────────────────────────────────────────────
    return (
        <WizardCreateFlow
            onClose={onClose}
            onSuccess={onSuccess}
            isCreating={isCreating}
            createProject={createProject}
        />
    )
})

// ═══════════════════════════════════════════════════════════════════════════════
// Create-mode wizard flow (internal component)
// ═══════════════════════════════════════════════════════════════════════════════

interface WizardCreateFlowProps {
    onClose: () => void
    onSuccess?: () => void
    isCreating: boolean
    createProject: ReturnType<typeof useCreateOperatorProject>[0]
}

const WizardCreateFlow = memo(({ onClose, onSuccess, isCreating, createProject }: WizardCreateFlowProps) => {
    const { t } = useTranslation('reports')
    const dispatch = useAppDispatch()

    const method = useSelector(getWizardMethod)
    const methodStepDone = useSelector(getWizardMethodStepDone)
    const name = useSelector(getWizardName)
    const description = useSelector(getWizardDescription)
    const systemPrompt = useSelector(getWizardSystemPrompt)
    const customMetrics = useSelector(getWizardCustomMetrics)
    const visibleDefaults = useSelector(getWizardVisibleDefaultMetrics)
    const webhookUrl = useSelector(getWizardWebhookUrl)
    const webhookHeaders = useSelector(getWizardWebhookHeaders)
    const webhookEvents = useSelector(getWizardWebhookEvents)
    const selectedTemplateId = useSelector(getWizardSelectedTemplateId)

    const isChoosingMethod = !method
    const isInMethodStep = !!method && !methodStepDone
    const isInReview = !!method && methodStepDone

    const handleBackToMethodSelect = useCallback(() => {
        dispatch(projectWizardActions.backToMethodSelect())
    }, [dispatch])

    const handleCreate = useCallback(async () => {
        try {
            await createProject({
                name: name.trim() || t('Новый проект'),
                description: description.trim(),
                systemPrompt: systemPrompt.trim(),
                customMetricsSchema: customMetrics,
                visibleDefaultMetrics: visibleDefaults,
                webhookUrl: webhookUrl.trim() || undefined,
                webhookHeaders: Object.keys(webhookHeaders).length > 0 ? webhookHeaders : undefined,
                webhookEvents: webhookEvents.length > 0 ? webhookEvents : undefined,
            }).unwrap()

            dispatch(projectWizardActions.close())
            onSuccess?.()
            onClose()
        } catch (err) {
            console.error('Wizard create error:', err)
        }
    }, [name, description, systemPrompt, customMetrics, visibleDefaults, webhookUrl, webhookHeaders, webhookEvents, createProject, dispatch, onClose, onSuccess, t])

    // ── Step content ──────────────────────────────────────────────────────────
    const renderStepContent = () => {
        if (!method) return null

        if (!methodStepDone) {
            switch (method) {
                case 'template':
                    return (
                        <WizardStep0_Templates
                            selectedTemplateId={selectedTemplateId}
                            onSelect={(tpl) => dispatch(projectWizardActions.applyTemplate(tpl))}
                        />
                    )
                case 'ai_interview':
                    return (
                        <WizardStep1_Chat
                            systemPrompt={systemPrompt}
                            onChangeSystemPrompt={(v) => dispatch(projectWizardActions.setSystemPrompt(v))}
                            onMetricsGenerated={(m, p) => dispatch(projectWizardActions.applyGeneratedMetrics({ metrics: m, prompt: p }))}
                        />
                    )
                default:
                    return null
            }
        }

        return <WizardReviewSection />
    }

    return (
        <VStack gap={'16'} max className={cls.ProjectWizard}>
            <WizardHeader
                title={name.trim() || String(t('Новый проект'))}
                onClose={onClose}
            />
            {/* Name + Description */}
            <HStack gap={'12'} max wrap={'wrap'}>
                <Textarea
                    label={String(t('Название проекта'))}
                    value={name}
                    onChange={e => dispatch(projectWizardActions.setName(e.target.value))}
                    size={'small'}
                    fullWidth
                    multiline={false}
                />
                <Textarea
                    label={String(t('Описание проекта'))}
                    value={description}
                    onChange={e => dispatch(projectWizardActions.setDescription(e.target.value))}
                    size={'small'}
                    fullWidth
                    multiline={false}
                />
            </HStack>

            {/* Phase indicator — not shown for manual (no intermediate step) */}
            {method && method !== 'manual' && (
                <WizardPhaseIndicator
                    method={method}
                    isInMethodStep={isInMethodStep}
                    isInReview={isInReview}
                    onBackToMethod={handleBackToMethodSelect}
                    onBackToStep={() => dispatch(projectWizardActions.setMethodStepDone(false))}
                />
            )}

            {/* Content */}
            <VStack max className={cls.wizardContent}>
                {isChoosingMethod && (
                    <WizardMethodChooser
                        onSelect={(m) => dispatch(projectWizardActions.setMethod(m))}
                    />
                )}
                {!isChoosingMethod && renderStepContent()}
            </VStack>

            {/* Navigation */}
            <HStack max justify={'end'} align={'center'} gap={'12'} wrap={'wrap'} className={cls.navSeparator}>
                <Button variant={'glass-action'}
                    onClick={
                        isInReview
                            ? (method === 'manual'
                                ? handleBackToMethodSelect
                                : () => dispatch(projectWizardActions.setMethodStepDone(false)))
                            : isInMethodStep
                                ? handleBackToMethodSelect
                                : onClose
                    }
                    addonLeft={<ArrowBackIcon fontSize={'small'} />}>
                    {isChoosingMethod ? String(t('Закрыть')) : String(t('Назад'))}
                </Button>

                {isInReview && (
                    <Button variant={'glass-action'} color={'success'}
                        onClick={handleCreate}
                        addonRight={<CheckIcon fontSize={'small'} />}
                        disabled={isCreating || !name.trim()}>
                        {isCreating ? String(t('Сохранение...')) : String(t('Создать'))}
                    </Button>
                )}
            </HStack>
        </VStack>
    )
})
