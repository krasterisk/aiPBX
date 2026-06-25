import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart3, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { onboardingActions } from '../../model/slices/onboardingSlice'
import cls from '../OnboardingWizard/OnboardingWizard.module.scss'

interface AnalyticsWelcomeStepProps {
    className?: string
}

/** Wave 1 analytics entry — full flow in plan 02-03 */
export const AnalyticsWelcomeStep = memo(({ className }: AnalyticsWelcomeStepProps) => {
    const { t } = useTranslation('onboarding')
    const dispatch = useAppDispatch()

    const onSkip = useCallback(() => {
        dispatch(onboardingActions.skipOnboarding())
    }, [dispatch])

    return (
        <VStack gap="16" align="center" max className={className}>
            <HStack justify="center" align="center">
                <BarChart3 size={48} />
            </HStack>

            <Text
                title={t('analytics_welcome_title', 'Речевая аналитика')}
                align="center"
                size="l"
            />

            <Text
                text={t('analytics_welcome_desc', 'Создайте проект, загрузите запись звонка и получите AI-инсайты по операторам. Полный мастер настройки — в следующем шаге онбординга.')}
                align="center"
                size="s"
            />

            <Button
                variant="glass-action"
                size="l"
                onClick={onSkip}
                addonRight={<ArrowRight size={18} />}
            >
                {t('analytics_welcome_continue', 'Перейти в аналитику')}
            </Button>

            <Button
                variant="clear"
                size="s"
                onClick={onSkip}
                className={cls.skipLink}
            >
                {t('welcome_skip', 'Пропустить и настроить позже')}
            </Button>
        </VStack>
    )
})
