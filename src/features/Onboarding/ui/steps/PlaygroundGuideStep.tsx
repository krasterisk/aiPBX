import React, { memo, useCallback } from 'react'
import cls from '../OnboardingWizard/OnboardingWizard.module.scss'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesign-v3/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { onboardingActions } from '../../model/slices/onboardingSlice'
import { getOnboardingCreatedAssistantId } from '../../model/selectors/onboardingSelectors'
import {
    getRoutePlayground,
    getRouteDashboardOverview,
    getRouteDocs,
    getRouteAssistants
} from '@/shared/const/router'
import {
    ArrowLeft,
    Mic,
    LayoutDashboard,
    BookOpen,
    Bot
} from 'lucide-react'

interface PlaygroundGuideStepProps {
    className?: string
}

export const PlaygroundGuideStep = memo(({ className }: PlaygroundGuideStepProps) => {
    const { t } = useTranslation('onboarding')
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const createdAssistantId = useSelector(getOnboardingCreatedAssistantId)

    const onGoPlayground = useCallback(() => {
        dispatch(onboardingActions.pauseOnboardingOverlay())
        const params = new URLSearchParams({ onboarding: 'assistants' })
        if (createdAssistantId) {
            params.set('assistantId', createdAssistantId)
        }
        navigate(`${getRoutePlayground()}?${params.toString()}`)
    }, [dispatch, navigate, createdAssistantId])

    const onGoDashboard = useCallback(() => {
        dispatch(onboardingActions.skipOnboarding())
        navigate(getRouteDashboardOverview())
    }, [dispatch, navigate])

    const onGoDocs = useCallback(() => {
        dispatch(onboardingActions.skipOnboarding())
        navigate(getRouteDocs())
    }, [dispatch, navigate])

    const onGoAssistants = useCallback(() => {
        dispatch(onboardingActions.skipOnboarding())
        navigate(getRouteAssistants())
    }, [dispatch, navigate])

    const onBack = useCallback(() => {
        dispatch(onboardingActions.prevStep())
    }, [dispatch])

    const onSkip = useCallback(() => {
        dispatch(onboardingActions.skipOnboarding())
    }, [dispatch])

    return (
        <VStack gap="16" align="center" max className={className}>
            <Text
                title={t('playground_guide_title', 'Проверьте ассистента голосом')}
                text={t(
                    'playground_guide_subtitle',
                    'Следующий шаг — звонок в Playground. Это займёт пару минут и покажет, как ассистент отвечает клиентам.'
                )}
                align="center"
                size="l"
            />

            <VStack gap="8" max className={cls.completionActions}>
                <HStack gap="12">
                    <HStack justify="center" align="center" className={cls.nextStepIcon}>
                        <Mic size={14} />
                    </HStack>
                    <Text
                        text={t(
                            'playground_guide_hint',
                            'Нажмите «Позвонить в Playground», разрешите микрофон и поговорите с ассистентом не менее 10 секунд.'
                        )}
                        size="xs"
                    />
                </HStack>
            </VStack>

            <Button
                variant="primary"
                size="l"
                onClick={onGoPlayground}
                addonLeft={<Mic size={16} />}
                fullWidth
            >
                {t('playground_guide_cta', 'Позвонить в Playground')}
            </Button>

            <HStack gap="12" justify="center" wrap="wrap">
                <Button
                    variant="clear"
                    size="m"
                    onClick={onGoAssistants}
                    addonLeft={<Bot size={14} />}
                    className={cls.skipLink}
                >
                    {t('completion_go_assistants', 'Перейти к ассистентам')}
                </Button>
                <Button
                    variant="clear"
                    size="m"
                    onClick={onGoDashboard}
                    addonLeft={<LayoutDashboard size={14} />}
                    className={cls.skipLink}
                >
                    {t('completion_go_dashboard', 'Перейти в Dashboard')}
                </Button>
                <Button
                    variant="clear"
                    size="m"
                    onClick={onGoDocs}
                    addonLeft={<BookOpen size={14} />}
                    className={cls.skipLink}
                >
                    {t('completion_go_docs', 'Документация')}
                </Button>
            </HStack>

            <HStack gap="16" justify="center" max>
                <Button
                    variant="clear"
                    size="m"
                    onClick={onBack}
                    addonLeft={<ArrowLeft size={14} />}
                >
                    {t('back', 'Назад')}
                </Button>
                <Button
                    variant="clear"
                    size="m"
                    onClick={onSkip}
                    className={cls.skipLink}
                >
                    {t('welcome_skip', 'Пропустить и настроить позже')}
                </Button>
            </HStack>
        </VStack>
    )
})
