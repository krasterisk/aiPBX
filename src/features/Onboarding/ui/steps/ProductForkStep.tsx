import React, { memo, useCallback, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Mic, BarChart3, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/ui/redesign-v3/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack } from '@/shared/ui/redesigned/Stack'
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

interface ProductOption {
    path: OnboardingProductPath
    Icon: typeof Mic
    titleKey: string
    titleFallback: string
    descKey: string
    descFallback: string
    ctaKey: string
    ctaFallback: string
    testId: string
}

const PRODUCT_OPTIONS: ProductOption[] = [
    {
        path: 'assistants',
        Icon: Mic,
        titleKey: 'fork_assistants_title',
        titleFallback: 'Голосовые ассистенты',
        descKey: 'fork_assistants_desc',
        descFallback: 'Создайте AI-бота для звонков и приёма заявок',
        ctaKey: 'fork_assistants_cta',
        ctaFallback: 'Начать с ассистентов',
        testId: 'onboarding-fork-assistants',
    },
    {
        path: 'analytics',
        Icon: BarChart3,
        titleKey: 'fork_analytics_title',
        titleFallback: 'Речевая аналитика',
        descKey: 'fork_analytics_desc',
        descFallback: 'Анализируйте записи звонков и отчёты операторов',
        ctaKey: 'fork_analytics_cta',
        ctaFallback: 'Начать с аналитики',
        testId: 'onboarding-fork-analytics',
    },
]

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

    const onCardKeyDown = useCallback((
        e: KeyboardEvent<HTMLDivElement>,
        path: OnboardingProductPath,
    ) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect(path)
        }
    }, [onSelect])

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

            <div
                className={cls.productCards}
                role="group"
                aria-label={String(t('fork_title', 'Выберите продукт'))}
            >
                {PRODUCT_OPTIONS.map(({
                    path, Icon, titleKey, titleFallback, descKey, descFallback,
                    ctaKey, ctaFallback, testId,
                }) => (
                    <div
                        key={path}
                        className={cls.productCard}
                        onClick={() => { onSelect(path) }}
                        role="button"
                        tabIndex={0}
                        data-testid={testId}
                        aria-label={String(t(titleKey, titleFallback))}
                        onKeyDown={(e) => { onCardKeyDown(e, path) }}
                    >
                        <div className={cls.iconBox} aria-hidden>
                            <Icon size={24} strokeWidth={1.75} />
                        </div>
                        <Text
                            className={cls.title}
                            title={t(titleKey, titleFallback)}
                            align="center"
                            size="s"
                        />
                        <Text
                            className={cls.description}
                            text={t(descKey, descFallback)}
                            align="center"
                            size="xs"
                        />
                        <span className={cls.cta}>
                            {t(ctaKey, ctaFallback)}
                            <ChevronRight className={cls.ctaChevron} size={16} aria-hidden />
                        </span>
                    </div>
                ))}
            </div>

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
