import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Mic, BarChart3 } from 'lucide-react'
import { Button } from '@/shared/ui/redesign-v3/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { onboardingActions } from '../../model/slices/onboardingSlice'
import { OnboardingProductPath } from '../../model/types/onboarding'
import { trackOnboardingEvent } from '../../lib/onboardingAnalytics'
import AipbxLogo from '@/shared/assets/icons/aipbx_logo_v3.svg'
import cls from './ProductForkStep.module.scss'
import clsWizard from '../OnboardingWizard/OnboardingWizard.module.scss'

interface ProductForkStepProps {
    className?: string
}

export const ProductForkStep = memo(({ className }: ProductForkStepProps) => {
    const { t } = useTranslation('onboarding')
    const dispatch = useAppDispatch()

    const onSelect = useCallback((path: OnboardingProductPath) => {
        trackOnboardingEvent(
            path === 'assistants' ? 'onboarding_product_assistants' : 'onboarding_product_analytics',
            { productPath: path }
        )
        dispatch(onboardingActions.setProductPath(path))
        trackOnboardingEvent('onboarding_step_1', { productPath: path, step: 1 })
    }, [dispatch])

    const onSkip = useCallback(() => {
        dispatch(onboardingActions.skipOnboarding())
    }, [dispatch])

    return (
        <VStack
            gap="16"
            align="center"
            max
            className={className}
            data-testid="onboarding-product-fork"
        >
            <AipbxLogo width={56} height={56} />

            <Text
                title={t('fork_title', 'Выберите продукт')}
                align="center"
                size="l"
            />

            <Text
                text={t('fork_subtitle', 'С чего начнём? Вы сможете попробовать второй продукт позже.')}
                align="center"
                size="s"
            />

            <HStack gap="16" max wrap="wrap" className={cls.productCards}>
                <VStack
                    gap="12"
                    align="center"
                    className={cls.productCard}
                    onClick={() => { onSelect('assistants') }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSelect('assistants') }}
                >
                    <HStack justify="center" align="center" className={cls.iconBox}>
                        <Mic size={24} />
                    </HStack>
                    <Text
                        title={t('fork_assistants_title', 'Голосовые ассистенты')}
                        align="center"
                        size="s"
                    />
                    <Text
                        text={t('fork_assistants_desc', 'Создайте AI-бота для звонков и приёма заявок')}
                        align="center"
                        size="xs"
                    />
                    <Button variant="primary" size="m" fullWidth>
                        {t('fork_assistants_cta', 'Начать с ассистентов')}
                    </Button>
                </VStack>

                <VStack
                    gap="12"
                    align="center"
                    className={cls.productCard}
                    onClick={() => { onSelect('analytics') }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSelect('analytics') }}
                >
                    <HStack justify="center" align="center" className={cls.iconBox}>
                        <BarChart3 size={24} />
                    </HStack>
                    <Text
                        title={t('fork_analytics_title', 'Речевая аналитика')}
                        align="center"
                        size="s"
                    />
                    <Text
                        text={t('fork_analytics_desc', 'Анализируйте записи звонков и отчёты операторов')}
                        align="center"
                        size="xs"
                    />
                    <Button variant="outline" size="m" fullWidth>
                        {t('fork_analytics_cta', 'Начать с аналитики')}
                    </Button>
                </VStack>
            </HStack>

            <Button
                variant="clear"
                size="m"
                onClick={onSkip}
                className={clsWizard.skipLink}
            >
                {t('welcome_skip', 'Пропустить и настроить позже')}
            </Button>
        </VStack>
    )
})
