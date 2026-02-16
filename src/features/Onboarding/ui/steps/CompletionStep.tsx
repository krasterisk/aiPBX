import React, { memo, useCallback } from 'react'
import cls from '../OnboardingWizard/OnboardingWizard.module.scss'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { onboardingActions } from '../../model/slices/onboardingSlice'
import {
    getOnboardingTelegramConnected
} from '../../model/selectors/onboardingSelectors'
import { getRoutePlayground, getRouteDashboardOverview, getRouteDocs } from '@/shared/const/router'
import { AppLogo } from '@/shared/ui/redesigned/AppLogo'
import {
    CheckCircle2,
    SkipForward,
    Mic,
    Globe,
    Settings,
    LayoutDashboard,
    BookOpen
} from 'lucide-react'

interface CompletionStepProps {
    className?: string
}

export const CompletionStep = memo(({ className }: CompletionStepProps) => {
    const { t } = useTranslation('onboarding')
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const telegramConnected = useSelector(getOnboardingTelegramConnected)

    const onGoPlayground = useCallback(() => {
        dispatch(onboardingActions.completeOnboarding())
        navigate(getRoutePlayground())
    }, [dispatch, navigate])

    const onGoDashboard = useCallback(() => {
        dispatch(onboardingActions.completeOnboarding())
        navigate(getRouteDashboardOverview())
    }, [dispatch, navigate])

    const onGoDocs = useCallback(() => {
        dispatch(onboardingActions.completeOnboarding())
        navigate(getRouteDocs())
    }, [dispatch, navigate])

    return (
        <VStack gap="16" align="center" max className={className}>
            <AppLogo variant="3" size={48} />

            <Text
                title={t('completion_title', 'Поздравляем! Ваш ассистент готов к работе!') as string}
                align="center"
                size="l"
            />

            <VStack gap="12" className={cls.completionChecklist}>
                <HStack gap="12">
                    <CheckCircle2 size={18} className={cls.checkIconSuccess} />
                    <Text text={t('completion_check_assistant', 'Ассистент создан') as string} size="s" />
                </HStack>
                <HStack gap="12">
                    <CheckCircle2 size={18} className={cls.checkIconSuccess} />
                    <Text text={t('completion_check_prompt', 'Инструкции настроены') as string} size="s" />
                </HStack>
                <HStack gap="12">
                    {telegramConnected ? (
                        <CheckCircle2 size={18} className={cls.checkIconSuccess} />
                    ) : (
                        <SkipForward size={18} className={cls.checkIconSkipped} />
                    )}
                    <Text
                        text={telegramConnected
                            ? t('completion_check_telegram_yes', 'Telegram подключен') as string
                            : t('completion_check_telegram_no', 'Telegram — подключите позже в настройках') as string
                        }
                        size="s"
                    />
                </HStack>
            </VStack>

            <VStack gap="12" max className={cls.completionActions}>
                <Text
                    title={t('completion_whats_next', 'Что дальше?') as string}
                    size="s"
                    bold
                />
                <HStack gap="12">
                    <HStack justify="center" align="center" className={cls.nextStepIcon}>
                        <Mic size={14} />
                    </HStack>
                    <Text
                        text={t('completion_next_playground', 'Протестируйте ассистента голосом в Playground') as string}
                        size="xs"
                    />
                </HStack>
                <HStack gap="12">
                    <HStack justify="center" align="center" className={cls.nextStepIcon}>
                        <Globe size={14} />
                    </HStack>
                    <Text
                        text={t('completion_next_publish', 'Опубликуйте — добавьте виджет или подключите к телефонии') as string}
                        size="xs"
                    />
                </HStack>
                <HStack gap="12">
                    <HStack justify="center" align="center" className={cls.nextStepIcon}>
                        <Settings size={14} />
                    </HStack>
                    <Text
                        text={t('completion_next_customize', 'Настройте детали — голос, инструкции, интеграции') as string}
                        size="xs"
                    />
                </HStack>
                <HStack gap="12">
                    <HStack justify="center" align="center" className={cls.nextStepIcon}>
                        <BookOpen size={14} />
                    </HStack>
                    <Text
                        text={t('completion_next_docs', 'Изучите документацию — подробные гайды и примеры') as string}
                        size="xs"
                    />
                </HStack>
            </VStack>

            <Button
                variant="glass-action"
                size="l"
                onClick={onGoPlayground}
                addonLeft={<Mic size={16} />}
            >
                {t('completion_go_playground', 'Перейти в Playground')}
            </Button>

            <HStack gap="12" justify="center">
                <Button
                    variant="clear"
                    size="s"
                    onClick={onGoDashboard}
                    addonLeft={<LayoutDashboard size={14} />}
                    className={cls.skipLink}
                >
                    {t('completion_go_dashboard', 'Перейти в Dashboard')}
                </Button>
                <Button
                    variant="clear"
                    size="s"
                    onClick={onGoDocs}
                    addonLeft={<BookOpen size={14} />}
                    className={cls.skipLink}
                >
                    {t('completion_go_docs', 'Документация')}
                </Button>
            </HStack>
        </VStack>
    )
})
