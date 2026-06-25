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
    projectWizardActions,
    useCreateOperatorProject,
    getWizardName,
    getWizardSelectedTemplateId,
    getWizardVisibleDefaultMetrics,
    getWizardCustomMetrics,
    getWizardSystemPrompt,
    getWizardDescription
} from '@/entities/Report'
import { WizardStep0_Templates } from '@/features/OperatorAnalytics/ui/ProjectWizard/WizardStep0_Templates'
import { OperatorUploadForm } from '@/features/OperatorAnalytics/ui/OperatorUploadForm/OperatorUploadForm'
import { getRouteAnalyticsApi } from '@/shared/const/router'
import { Link } from 'react-router-dom'
import clsWizard from '../OnboardingWizard/OnboardingWizard.module.scss'
import cls from './OnboardingAnalyticsFlow.module.scss'

const DEFAULT_METRIC_LABELS: Record<DefaultMetricKey, string> = {
    greeting_quality: 'Качество приветствия',
    script_compliance: 'Следование скрипту',
    politeness_empathy: 'Вежливость и эмпатия',
    active_listening: 'Активное слушание',
    objection_handling: 'Работа с возражениями',
    product_knowledge: 'Знание продукта',
    problem_resolution: 'Решение проблемы',
    speech_clarity_pace: 'Темп речи',
    closing_quality: 'Качество завершения'
}

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
            <Button variant="clear" size="s" onClick={onSkip} className={clsWizard.skipLink}>
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
        dispatch(projectWizardActions.openCreate())
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
                text={t('analytics_project_subtitle', 'Выберите отрасль и назовите проект — мы подготовим метрики под ваши задачи')}
                size="l"
            />

            <Input
                label={t('analytics_project_name_label', 'Название проекта')}
                value={name}
                onChange={(v) => dispatch(projectWizardActions.setName(v))}
                placeholder={t('analytics_project_name_placeholder', 'Например: Колл-центр продаж')}
                fullWidth
            />

            <WizardStep0_Templates
                selectedTemplateId={selectedTemplateId}
                onSelect={(tpl) => dispatch(projectWizardActions.applyTemplate(tpl))}
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

// ─── Step 3: Metrics + project create ────────────────────────────────────────

export const AnalyticsMetricsStep = memo(({ className }: { className?: string }) => {
    const { t } = useTranslation(['onboarding', 'reports'])
    const dispatch = useAppDispatch()
    const name = useSelector(getWizardName)
    const description = useSelector(getWizardDescription)
    const systemPrompt = useSelector(getWizardSystemPrompt)
    const customMetrics = useSelector(getWizardCustomMetrics)
    const visibleDefaults = useSelector(getWizardVisibleDefaultMetrics)
    const [createProject, { isLoading }] = useCreateOperatorProject()
    const existingProjectId = useSelector(getOnboardingOaProjectId)

    const onBack = useCallback(() => {
        dispatch(onboardingActions.prevStep())
    }, [dispatch])

    const onToggleMetric = useCallback((key: DefaultMetricKey) => {
        dispatch(projectWizardActions.toggleDefaultMetric(key))
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
                visibleDefaultMetrics: visibleDefaults
            }).unwrap()

            dispatch(onboardingActions.setOaProjectId(project.id))
            trackOnboardingEvent('oa_project_created', {
                productPath: 'analytics',
                projectId: project.id
            })
            dispatch(onboardingActions.nextStep())
        } catch (err: unknown) {
            const message = (err as { data?: { message?: string } })?.data?.message
                || t('analytics_project_create_error', 'Не удалось создать проект')
            dispatch(onboardingActions.setError(String(message)))
        }
    }, [
        createProject,
        customMetrics,
        description,
        dispatch,
        existingProjectId,
        name,
        systemPrompt,
        t,
        visibleDefaults
    ])

    return (
        <VStack gap="16" max className={className}>
            <Text
                title={t('analytics_metrics_title', 'Метрики качества')}
                text={t('analytics_metrics_subtitle', 'Выберите показатели для оценки звонков — шаблон уже предложил набор под вашу отрасль')}
                size="l"
            />

            <VStack gap="8" max className={cls.metricsList}>
                {(Object.keys(DEFAULT_METRIC_LABELS) as DefaultMetricKey[]).map((key) => {
                    const selected = visibleDefaults.includes(key)
                    return (
                        <HStack
                            key={key}
                            gap="12"
                            align="center"
                            className={cls.metricRow}
                            onClick={() => onToggleMetric(key)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter') onToggleMetric(key) }}
                        >
                            <HStack justify="center" align="center" style={{ width: 24 }}>
                                {selected ? <Check size={16} /> : null}
                            </HStack>
                            <Text text={String(t(DEFAULT_METRIC_LABELS[key], { ns: 'reports', defaultValue: DEFAULT_METRIC_LABELS[key] }))} size="s" />
                        </HStack>
                    )
                })}
            </VStack>

            {customMetrics.length > 0 && (
                <VStack gap="8" max>
                    <Text title={t('analytics_custom_metrics_title', 'Дополнительные метрики шаблона')} size="s" bold />
                    {customMetrics.map((m) => (
                        <Text key={m.id} text={`• ${m.name}`} size="xs" />
                    ))}
                </VStack>
            )}

            <HStack gap="12" justify="between" max className={cls.stepFooter}>
                <Button variant="outline" size="m" onClick={onBack} addonLeft={<ArrowLeft size={16} />}>
                    {t('step_back', 'Назад')}
                </Button>
                <Button
                    variant="primary"
                    size="m"
                    onClick={onCreateAndContinue}
                    disabled={isLoading || visibleDefaults.length === 0}
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

// ─── Step 4: Upload (placeholder for task 2) ─────────────────────────────────

interface AnalyticsUploadStepProps {
    className?: string
    onBatchStarted?: (batchId: string) => void
    batchProgress?: number
    batchIsActive?: boolean
    analysisComplete?: boolean
}

export const AnalyticsUploadStep = memo(({
    className,
    onBatchStarted,
    batchProgress = 0,
    batchIsActive = false,
    analysisComplete = false
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
                text={t('analytics_upload_subtitle', 'Загрузите аудиофайл — мы проанализируем разговор и покажем отчёт')}
                size="l"
            />

            {!batchIsActive && !analysisComplete && !showApiIntro && (
                <>
                    <OperatorUploadForm
                        compact
                        fixedProjectId={projectId}
                        onUploadStart={onUploadStart}
                        onBatchStarted={onBatchStarted}
                    />
                    <Button variant="outline" size="m" fullWidth onClick={() => setShowApiIntro(true)}>
                        {t('analytics_api_option', 'Подключить API для автоматической выгрузки')}
                    </Button>
                </>
            )}

            {!batchIsActive && !analysisComplete && showApiIntro && (
                <AnalyticsApiIntroPanel onBackToUpload={() => setShowApiIntro(false)} />
            )}

            {batchIsActive && (
                <VStack gap="12" max>
                    <Text
                        title={t('analytics_analysis_progress_title', 'Анализируем запись...')}
                        text={t('analytics_analysis_progress_desc', 'Обычно это занимает несколько минут. Можно подождать здесь.')}
                        size="s"
                    />
                    <div className={cls.progressBar}>
                        <div className={cls.progressFill} style={{ width: `${batchProgress}%` }} />
                    </div>
                    <Text text={`${batchProgress}%`} align="center" size="xs" />
                </VStack>
            )}

            {analysisComplete && (
                <Text
                    text={t('analytics_analysis_complete', 'Анализ завершён! Открываем дашборд...')}
                    align="center"
                    size="s"
                />
            )}

            {!batchIsActive && (
                <HStack gap="12" justify="between" max className={cls.stepFooter}>
                    <Button variant="outline" size="m" onClick={onBack} addonLeft={<ArrowLeft size={16} />}>
                        {t('step_back', 'Назад')}
                    </Button>
                    <Button variant="clear" size="s" onClick={onSkip} className={clsWizard.skipLink}>
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
            descFallback: 'Отправляйте записи через analyze-file или analyze-url — удобно для интеграции с АТС'
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
                    'Для постоянного потока звонков из вашей АТС используйте REST API. Полная настройка коннектора — в документации.'
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

            <Button variant="clear" size="s" onClick={onBackToUpload}>
                {t('analytics_api_back_upload', 'Вернуться к загрузке файла')}
            </Button>
        </VStack>
    )
})