import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesign-v3/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { onboardingActions } from '../../model/slices/onboardingSlice'
import AipbxLogo from '@/shared/assets/icons/aipbx_logo_v3.svg'
import { OnboardingStepLayout } from '../components/OnboardingStepLayout/OnboardingStepLayout'
import cls from '../OnboardingWizard/OnboardingWizard.module.scss'
import { ArrowRight } from 'lucide-react'

interface WelcomeStepProps {
    className?: string
}

export const WelcomeStep = memo(({ className }: WelcomeStepProps) => {
    const { t } = useTranslation('onboarding')
    const dispatch = useAppDispatch()

    const onStart = useCallback(() => {
        dispatch(onboardingActions.nextStep())
    }, [dispatch])

    const onSkip = useCallback(() => {
        dispatch(onboardingActions.skipOnboarding())
    }, [dispatch])

    return (
        <OnboardingStepLayout
            className={className}
            footerAlign="end"
            footer={(
                <Button
                    variant="clear"
                    size="m"
                    onClick={onSkip}
                    className={cls.skipLink}
                >
                    {t('welcome_skip', 'Пропустить и настроить позже')}
                </Button>
            )}
        >
            <AipbxLogo width={56} height={56} />

            <Text
                title={t('welcome_title', 'Добро пожаловать в AI PBX!') }
                align="center"
                size="l"
            />

            <Text
                text={t('welcome_subtitle', 'Голосовые помощники для вашего бизнеса!') }
                align="center"
                size="m"
                bold
            />

            <Text
                text={t('welcome_description', 'Давайте создадим вашего первого ассистента, чтобы разобраться, как это работает!') }
                align="center"
                size="s"
            />

            <Button
                variant="primary"
                size="l"
                onClick={onStart}
                addonRight={<ArrowRight size={18} />}
            >
                {t('welcome_start', 'Поехали!')}
            </Button>
        </OnboardingStepLayout>
    )
})
