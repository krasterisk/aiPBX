import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
    ArrowLeft,
    ArrowRight,
    BarChart3,
    Check,
    Link2,
    Webhook
} from 'lucide-react'
import { Button } from '@/shared/ui/redesign-v3/Button'
import { Input } from '@/shared/ui/redesign-v3/Input'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { onboardingActions } from '../../model/slices/onboardingSlice'
import {
    getOnboardingOaProjectId
} from '../../model/selectors/onboardingSelectors'
import { trackOnboardingEvent } from '../../lib/onboardingAnalytics'
import {
    DefaultMetricKey,
    MetricDefinition,
    ProjectTemplate,
    TagDefinition,
    projectWizardActions,
    useCreateOperatorProject,
    getWizardName,
    getWizardSelectedTemplateId,
    getWizardVisibleDefaultMetrics,
    getWizardCustomMetrics,
    getWizardSystemPrompt,
    getWizardDescription,
    getWizardCallTaxonomy,
} from '@/entities/Report'
import {
    WizardStep0_Templates,
    WizardStep2_MetricBuilder,
    OperatorUploadForm,
    ALL_DEFAULT_METRICS,
    TaxonomyEditor,
} from '@/features/OperatorAnalytics'

import { getRouteAnalyticsApi } from '@/shared/const/router'
import { Link } from 'react-router-dom'
import clsWizard from '../OnboardingWizard/OnboardingWizard.module.scss'
import cls from './OnboardingAnalyticsFlow.module.scss'

// ─── Step 1: Welcome ─────────────────────────────────────────────────────────

export const AnalyticsWelcomeOverviewStep = memo(({ className }: { className?: string }) => {
    const { t } = useTranslation('onboarding')
    const dispatch = useAppDispatch()

    const onNext = useCallback(() => {
        dispatch(onboardingActions.nextStep())
    }, [dispatch])

    const onSkip = useCallback(() => {
        dispatch(onboardingActions.skipOnboarding())
    }, [dispatch])

    return (
        <VStack gap="16" align="center" max className={className}>
            <BarChart3 size={48} />
            <Text
                title={t('analytics_welcome_title', 'Речевая аналитика')}
                text={t(
                    'analytics_welcome_desc',
                    'Создайте проект, загрузите запись звонка и получите AI-инсайты по операторам.'
                )}
                align="center"
                size="l"
            />
            <Button variant="primary" size="l" onClick={onNext} addonRight={<ArrowRight size={18} />}>
                {t('analytics_welcome_continue', 'Начать настройку')}
            </Button>
            <Button variant="clear" size="m" onClick={onSkip} className={clsWizard.skipLink}>
                {t('welcome_skip', 'Пропустить и настроить позже')}
            </Button>
        </VStack>
    )
})

// ─── Step 2: Template + project name ─────────────────────────────────────────

export const AnalyticsProjectSetupStep = memo(({ className }: { className?: string }) => {
    const { t } = useTranslation(['onboarding', 'reports'])
    const dispatch = useAppDispatch()
    const name = useSelector(getWizardName)
    const selectedTemplateId = useSelector(getWizardSelectedTemplateId)
    const initializedRef = useRef(false)

    useEffect(() => {
        if (initializedRef.current) return
        initializedRef.current = true
        // Do not call openCreate(): that flips isOpen and opens the
        // OperatorProjectManager modal on /analytics/projects underneath.
        dispatch(projectWizardActions.initCreateDraft())
        dispatch(projectWizardActions.setMethod('template'))
    }, [dispatch])

    const onBack = useCallback(() => {
        dispatch(onboardingActions.prevStep())
    }, [dispatch])

    const onNext = useCallback(() => {
        if (!name.trim()) {
            dispatch(onboardingActions.setError(t('analytics_project_name_required', 'Укажите название проекта')))
            return
        }
        if (!selectedTemplateId) {
            dispatch(onboardingActions.setError(t('analytics_template_required', 'Выберите шаблон отрасли')))
            return
        }
        dispatch(onboardingActions.setError(null))
        dispatch(onboardingActions.nextStep())
    }, [dispatch, name, selectedTemplateId, t])

    return (
        <VStack gap="16" max className={className}>
            <Text
                title={t('analytics_project_title', 'Проект аналитики')}
                text={t('analytics_project_subtitle', 'Выберите отрасль и назовите проект - мы подготовим метрики под ваши задачи')}
                size="l"
            />

            <Input
                label={String(t('analytics_project_name_label', 'Название проекта'))}
                value={name}
                onChange={(v) => dispatch(projectWizardActions.setName(v))}
                placeholder={String(t('analytics_project_name_placeholder', 'Например: Колл-центр продаж'))}
                fullWidth
            />

            <WizardStep0_Templates
                selectedTemplateId={selectedTemplateId}
                onSelect={(tpl: ProjectTemplate) => dispatch(projectWizardActions.applyTemplate(tpl))}
            />

            <HStack gap="12" justify="between" max className={cls.stepFooter}>
                <Button variant="outline" size="m" onClick={onBack} addonLeft={<ArrowLeft size={16} />}>
                    {t('step_back', 'Назад')}
                </Button>
                <Button variant="primary" size="m" onClick={onNext} addonRight={<ArrowRight size={16} />}>
                    {t('step_next', 'Далее')}
                </Button>
            </HStack>
        </VStack>
    )
})

// ─── Step 3: Metrics ─────────────────────────────────────────────────────────

export const AnalyticsMetricsStep = memo(({ className }: { className?: string }) => {
    const { t } = useTranslation(['onboarding', 'reports'])
    const dispatch = useAppDispatch()
    const systemPrompt = useSelector(getWizardSystemPrompt)
    const customMetrics = useSelector(getWizardCustomMetrics)
    const visibleDefaults = useSelector(getWizardVisibleDefaultMetrics)
    const selectedTemplateId = useSelector(getWizardSelectedTemplateId)
    const [showCustomMetrics, setShowCustomMetrics] = useState(false)
    const isCustomTemplate = selectedTemplateId === 'custom'

    const onBack = useCallback(() => {
        dispatch(onboardingActions.prevStep())
    }, [dispatch])

    const onToggleMetric = useCallback((key: DefaultMetricKey) => {
        dispatch(projectWizardActions.toggleDefaultMetric(key))
    }, [dispatch])

    const onChangeCustomMetrics = useCallback((metrics: MetricDefinition[]) => {
        dispatch(projectWizardActions.setCustomMetrics(metrics))
    }, [dispatch])

    const onNext = useCallback(() => {
        if (visibleDefaults.length === 0) {
            dispatch(onboardingActions.setError(
                t('analytics_metrics_required', 'Выберите хотя бы одну метрику'),
            ))
            return
        }
        dispatch(onboardingActions.setError(null))
        dispatch(onboardingActions.nextStep())
    }, [dispatch, t, visibleDefaults.length])

    const metricsSubtitle = isCustomTemplate
        ? t(
            'analytics_metrics_subtitle_custom',
            'Выберите показатели для оценки звонков — отметьте то, что важно именно вам',
        )
        : t(
            'analytics_metrics_subtitle',
            'Выберите показатели для оценки звонков — шаблон уже предложил набор под вашу отрасль',
        )

    return (
        <VStack gap="16" max className={className}>
            <Text
                title={t('analytics_metrics_title', 'Метрики качества')}
                text={metricsSubtitle}
                size="l"
            />

            <VStack gap="8" max className={cls.metricsList}>
                {ALL_DEFAULT_METRICS.map(({ key, labelKey, descriptionKey }) => {
                    const selected = visibleDefaults.includes(key)
                    return (
                        <HStack
                            key={key}
                            gap="12"
                            align="start"
                            className={cls.metricRow}
                            onClick={() => { onToggleMetric(key) }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter') onToggleMetric(key) }}
                        >
                            <HStack justify="center" align="center" style={{ width: 24, paddingTop: 2 }}>
                                {selected ? <Check size={16} /> : null}
                            </HStack>
                            <VStack gap="4" max className={cls.metricRowContent}>
                                <Text
                                    text={String(t(labelKey, { ns: 'reports', defaultValue: labelKey }))}
                                    size="s"
                                    bold
                                />
                                <Text
                                    text={String(t(descriptionKey, { ns: 'reports', defaultValue: descriptionKey }))}
                                    size="s"
                                    className={cls.metricDescription}
                                />
                            </VStack>
                        </HStack>
                    )
                })}
            </VStack>

            <VStack gap="12" max>
                <Button
                    variant="clear"
                    size="m"
                    onClick={() => { setShowCustomMetrics(prev => !prev) }}
                >
                    {showCustomMetrics
                        ? t('analytics_custom_metrics_hide', 'Скрыть кастомные метрики')
                        : t('analytics_custom_metrics_show', 'Добавить кастомные метрики')}
                </Button>
                {showCustomMetrics && (
                    <>
                        <Text
                            title={t('analytics_custom_metrics_title', 'Кастомные метрики')}
                            text={t('analytics_custom_metrics_subtitle', 'Добавьте свои показатели - AI будет оценивать их по описанию')}
                            size="s"
                            bold
                        />
                        <WizardStep2_MetricBuilder
                            metrics={customMetrics}
                            systemPrompt={systemPrompt}
                            visibleDefaultMetrics={visibleDefaults}
                            onChangeMetrics={onChangeCustomMetrics}
                        />
                    </>
                )}
            </VStack>

            <HStack gap="12" justify="between" max className={cls.stepFooter}>
                <Button variant="outline" size="m" onClick={onBack} addonLeft={<ArrowLeft size={16} />}>
                    {t('step_back', 'Назад')}
                </Button>
                <Button
                    variant="primary"
                    size="m"
                    onClick={onNext}
                    disabled={visibleDefaults.length === 0}
                    addonRight={<ArrowRight size={16} />}
                >
                    {t('step_next', 'Далее')}
                </Button>
            </HStack>
        </VStack>
    )
})

// ─── Step 4: Topics + project create ─────────────────────────────────────────

export const AnalyticsTopicsStep = memo(({ className }: { className?: string }) => {
    const { t } = useTranslation(['onboarding', 'reports'])
    const dispatch = useAppDispatch()
    const name = useSelector(getWizardName)
    const description = useSelector(getWizardDescription)
    const systemPrompt = useSelector(getWizardSystemPrompt)
    const customMetrics = useSelector(getWizardCustomMetrics)
    const visibleDefaults = useSelector(getWizardVisibleDefaultMetrics)
    const callTaxonomy = useSelector(getWizardCallTaxonomy)
    const [createProject, { isLoading }] = useCreateOperatorProject()
    const existingProjectId = useSelector(getOnboardingOaProjectId)

    const onBack = useCallback(() => {
        dispatch(onboardingActions.prevStep())
    }, [dispatch])

    const onCreateAndContinue = useCallback(async () => {
        if (existingProjectId) {
            dispatch(onboardingActions.nextStep())
            return
        }
        dispatch(onboardingActions.setError(null))
        try {
            const project = await createProject({
                name: name.trim() || String(t('Новый проект', { ns: 'reports' })),
                description: description.trim(),
                systemPrompt: systemPrompt.trim(),
                customMetricsSchema: customMetrics,
                visibleDefaultMetrics: visibleDefaults,
                callTaxonomy,
            }).unwrap()

            dispatch(onboardingActions.setOaProjectId(project.id))
            trackOnboardingEvent('oa_project_created', {
                productPath: 'analytics',
                projectId: project.id,
            })
            dispatch(onboardingActions.nextStep())
        } catch (err: unknown) {
            const message = (err as { data?: { message?: string } })?.data?.message ||
                t('analytics_project_create_error', 'Не удалось создать проект')
            dispatch(onboardingActions.setError(String(message)))
        }
    }, [
        createProject,
        callTaxonomy,
        customMetrics,
        description,
        dispatch,
        existingProjectId,
        name,
        systemPrompt,
        t,
        visibleDefaults,
    ])

    return (
        <VStack gap="16" max className={className}>
            <Text
                title={t('analytics_topics_title', 'Темы звонков')}
                text={t(
                    'analytics_topics_subtitle',
                    'Добавьте темы, которые ИИ будет ставить звонкам при анализе. Можно пропустить и настроить позже.',
                )}
                size="l"
            />

            <TaxonomyEditor
                taxonomy={callTaxonomy}
                onChange={(taxonomy: TagDefinition[]) => {
                    dispatch(projectWizardActions.setCallTaxonomy(taxonomy))
                }}
            />

            <HStack gap="12" justify="between" max className={cls.stepFooter}>
                <Button variant="outline" size="m" onClick={onBack} addonLeft={<ArrowLeft size={16} />}>
                    {t('step_back', 'Назад')}
                </Button>
                <Button
                    variant="primary"
                    size="m"
                    onClick={onCreateAndContinue}
                    disabled={isLoading}
                    addonRight={<ArrowRight size={16} />}
                >
                    {isLoading
                        ? t('analytics_project_creating', 'Создаём проект...')
                        : t('analytics_project_create', 'Создать проект и продолжить')}
                </Button>
            </HStack>
        </VStack>
    )
})

// ─── Step 5: Upload ────────────────────────────────────────────────────────

export type AnalyticsUploadPhase = 'idle' | 'processing' | 'success' | 'failed'

interface AnalyticsUploadStepProps {
    className?: string
    onBatchStarted?: (batchId: string) => void
    batchProgress?: number
    batchIsActive?: boolean
    uploadPhase?: AnalyticsUploadPhase
    analysisError?: string | null
    onRetryUpload?: () => void
    onViewDashboard?: () => void
}

export const AnalyticsUploadStep = memo(({
    className,
    onBatchStarted,
    batchProgress = 0,
    batchIsActive = false,
    uploadPhase = 'idle',
    analysisError = null,
    onRetryUpload,
    onViewDashboard
}: AnalyticsUploadStepProps) => {
    const { t } = useTranslation('onboarding')
    const dispatch = useAppDispatch()
    const projectId = useSelector(getOnboardingOaProjectId)
    const [showApiIntro, setShowApiIntro] = useState(false)

    const onBack = useCallback(() => {
        if (!batchIsActive) {
            dispatch(onboardingActions.prevStep())
        }
    }, [dispatch, batchIsActive])

    const onUploadStart = useCallback(() => {
        trackOnboardingEvent('oa_file_uploaded', { productPath: 'analytics', projectId: projectId ?? undefined })
    }, [projectId])

    const onSkip = useCallback(() => {
        dispatch(onboardingActions.skipOnboarding())
    }, [dispatch])

    if (!projectId) {
        return (
            <VStack gap="16" max className={className}>
                <Text text={t('analytics_upload_no_project', 'Сначала создайте проект на предыдущем шаге')} variant="error" />
                <Button variant="outline" size="m" onClick={onBack} addonLeft={<ArrowLeft size={16} />}>
                    {t('step_back', 'Назад')}
                </Button>
            </VStack>
        )
    }

    return (
        <VStack gap="16" max className={className}>
            <Text
                title={t('analytics_upload_title', 'Загрузите запись звонка')}
                text={uploadPhase === 'idle'
                    ? t('analytics_upload_subtitle', 'Загрузите аудиофайл - мы проанализируем разговор и покажем отчёт')
                    : uploadPhase === 'success'
                        ? t('analytics_analysis_complete', 'Анализ завершён! Открываем дашборд с результатами...')
                        : uploadPhase === 'failed'
                            ? t('analytics_analysis_failed_desc', 'Не удалось обработать файл. Попробуйте другую запись или откройте дашборд.')
                            : t('analytics_analysis_progress_desc', 'Обычно это занимает несколько минут. Можно подождать здесь.')}
                size="l"
            />

            {uploadPhase === 'idle' && !showApiIntro && (
                <>
                    <OperatorUploadForm
                        compact
                        fixedProjectId={projectId}
                        onUploadStart={onUploadStart}
                        onBatchStarted={onBatchStarted}
                    />
                    <Button variant="outline" size="m" fullWidth onClick={() => { setShowApiIntro(true) }}>
                        {t('analytics_api_option', 'Подключить API для автоматической выгрузки')}
                    </Button>
                </>
            )}

            {uploadPhase === 'idle' && showApiIntro && (
                <AnalyticsApiIntroPanel onBackToUpload={() => { setShowApiIntro(false) }} />
            )}

            {(uploadPhase === 'processing' || batchIsActive) && (
                <VStack gap="12" max>
                    <Text
                        title={t('analytics_analysis_progress_title', 'Анализируем запись...')}
                        size="s"
                    />
                    <div className={cls.progressBar}>
                        <div className={cls.progressFill} style={{ width: `${batchProgress}%` }} />
                    </div>
                    <Text text={`${batchProgress}%`} align="center" size="xs" />
                </VStack>
            )}

            {uploadPhase === 'success' && (
                <Text
                    text={t('analytics_analysis_complete', 'Анализ завершён! Открываем дашборд с результатами...')}
                    align="center"
                    size="s"
                />
            )}

            {uploadPhase === 'failed' && (
                <VStack gap="12" max align="center">
                    <Text
                        text={t(analysisError ?? 'analytics_analysis_failed', 'Обработка не удалась')}
                        variant="error"
                        align="center"
                        size="s"
                    />
                    <HStack gap="12" wrap="wrap" justify="center">
                        <Button variant="outline" size="m" onClick={onRetryUpload}>
                            {t('analytics_upload_retry', 'Загрузить другой файл')}
                        </Button>
                        <Button variant="primary" size="m" onClick={onViewDashboard}>
                            {t('analytics_view_dashboard', 'Открыть дашборд')}
                        </Button>
                    </HStack>
                </VStack>
            )}

            {uploadPhase === 'idle' && (
                <HStack gap="12" justify="between" max className={cls.stepFooter}>
                    <Button variant="outline" size="m" onClick={onBack} addonLeft={<ArrowLeft size={16} />}>
                        {t('step_back', 'Назад')}
                    </Button>
                    <Button variant="clear" size="m" onClick={onSkip} className={clsWizard.skipLink}>
                        {t('welcome_skip', 'Пропустить и настроить позже')}
                    </Button>
                </HStack>
            )}
        </VStack>
    )
})

// ─── API intro panel (D-09) ────────────────────────────────────────────────

interface AnalyticsApiIntroPanelProps {
    onBackToUpload: () => void
}

export const AnalyticsApiIntroPanel = memo(({ onBackToUpload }: AnalyticsApiIntroPanelProps) => {
    const { t } = useTranslation('onboarding')

    const apiCards = [
        {
            Icon: Webhook,
            titleKey: 'analytics_api_card_upload_title',
            titleFallback: 'Загрузка по API',
            descKey: 'analytics_api_card_upload_desc',
            descFallback: 'Отправляйте записи через analyze-file или analyze-url - удобно для интеграции с АТС'
        },
        {
            Icon: Link2,
            titleKey: 'analytics_api_card_token_title',
            titleFallback: 'API-токены',
            descKey: 'analytics_api_card_token_desc',
            descFallback: 'Создайте токен в разделе API и используйте его в заголовке Authorization'
        }
    ]

    return (
        <VStack gap="16" max>
            <Text
                title={t('analytics_api_intro_title', 'Подключить API для автоматической выгрузки')}
                text={t(
                    'analytics_api_intro_desc',
                    'Для постоянного потока звонков из вашей АТС используйте REST API. Полная настройка коннектора - в документации.'
                )}
                size="l"
            />

            {apiCards.map(({ Icon, titleKey, titleFallback, descKey, descFallback }) => (
                <HStack key={titleKey} gap="16" align="start" className={cls.apiCard}>
                    <Icon size={20} />
                    <VStack gap="4">
                        <Text title={t(titleKey, titleFallback)} size="s" bold />
                        <Text text={t(descKey, descFallback)} size="xs" />
                    </VStack>
                </HStack>
            ))}

            <Button
                variant="outline"
                size="m"
                fullWidth
                addonRight={<Link2 size={16} />}
                onClick={() => window.open(getRouteAnalyticsApi(), '_blank')}
            >
                {t('analytics_api_docs_cta', 'Открыть документацию API')}
            </Button>

            <Link to={getRouteAnalyticsApi()} target="_blank" rel="noopener noreferrer">
                <Text
                    text={t('analytics_api_docs_link', 'Подробнее: эндпоинты analyze-file, batch status и webhooks')}
                    size="xs"
                />
            </Link>

            <Button variant="clear" size="m" onClick={onBackToUpload}>
                {t('analytics_api_back_upload', 'Вернуться к загрузке файла')}
            </Button>
        </VStack>
    )
})
