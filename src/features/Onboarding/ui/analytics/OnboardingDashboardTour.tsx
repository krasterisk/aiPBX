import React, { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { Button } from '@/shared/ui/redesign-v3/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { onboardingActions } from '../../model/slices/onboardingSlice'

import cls from './OnboardingDashboardTour.module.scss'

const TOUR_TARGETS = [
    'oa-insights',
    'oa-scorecard',
    'oa-upload-entry'
] as const

interface SpotlightRect {
    top: number
    left: number
    width: number
    height: number
}

interface OnboardingDashboardTourProps {
    active: boolean
    onFinished?: () => void
}

export const OnboardingDashboardTour = memo(({ active, onFinished }: OnboardingDashboardTourProps) => {
    const { t } = useTranslation('onboarding')
    const dispatch = useAppDispatch()
    const [stepIndex, setStepIndex] = useState(0)
    const [rect, setRect] = useState<SpotlightRect | null>(null)

    const stepKeys = [
        {
            title: 'analytics_tour_insights_title',
            titleFallback: 'AI-инсайты',
            desc: 'analytics_tour_insights_desc',
            descFallback: 'Здесь появляются выводы по звонкам: тренды, проблемы и рекомендации для руководителя.'
        },
        {
            title: 'analytics_tour_scorecard_title',
            titleFallback: 'Рейтинг операторов',
            desc: 'analytics_tour_scorecard_desc',
            descFallback: 'Таблица оценок по каждому оператору — основа отчётов для супервайзера.'
        },
        {
            title: 'analytics_tour_upload_title',
            titleFallback: 'Проекты и загрузка',
            desc: 'analytics_tour_upload_desc',
            descFallback: 'Переключайте проекты и загружайте новые записи — отсюда же доступ к API.'
        }
    ] as const

    const currentTarget = TOUR_TARGETS[stepIndex]
    const currentStep = stepKeys[stepIndex]
    const isLast = stepIndex >= stepKeys.length - 1

    const measureTarget = useCallback(() => {
        let el = document.querySelector(`[data-tour-id="${currentTarget}"]`)
        if (!el && currentTarget === 'oa-insights') {
            el = document.querySelector('[data-tour-id="oa-stats"]')
        }
        if (!el) {
            setRect(null)
            return
        }
        const box = el.getBoundingClientRect()
        const padding = 8
        setRect({
            top: box.top - padding + window.scrollY,
            left: box.left - padding + window.scrollX,
            width: box.width + padding * 2,
            height: box.height + padding * 2
        })
    }, [currentTarget])

    useLayoutEffect(() => {
        if (!active) return
        measureTarget()
        const onResize = () => measureTarget()
        window.addEventListener('resize', onResize)
        window.addEventListener('scroll', onResize, true)
        const timer = window.setTimeout(measureTarget, 300)
        return () => {
            window.removeEventListener('resize', onResize)
            window.removeEventListener('scroll', onResize, true)
            window.clearTimeout(timer)
        }
    }, [active, measureTarget, stepIndex])

    useEffect(() => {
        if (active) {
            setStepIndex(0)
        }
    }, [active])

    const onSkip = useCallback(() => {
        dispatch(onboardingActions.skipOnboarding())
        onFinished?.()
    }, [dispatch, onFinished])

    const onNext = useCallback(() => {
        if (isLast) {
            dispatch(onboardingActions.completeOnboarding())
            onFinished?.()
            return
        }
        setStepIndex((i) => i + 1)
    }, [dispatch, isLast, onFinished])

    if (!active) return null

    const cardTop = rect ? Math.min(rect.top + rect.height + 16, window.innerHeight - 220) : 120
    const cardLeft = rect ? Math.min(rect.left, window.innerWidth - 380) : 24

    return createPortal(
        <div className={cls.tourOverlay} data-testid="onboarding-dashboard-tour">
            {!rect && <div className={cls.tourBackdrop} />}
            {rect && (
                <div
                    className={cls.tourSpotlight}
                    style={{
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height
                    }}
                />
            )}
            <VStack
                gap="12"
                className={cls.tourCard}
                style={{ top: cardTop, left: Math.max(16, cardLeft) }}
            >
                <Text
                    title={t(currentStep.title, currentStep.titleFallback)}
                    text={t(currentStep.desc, currentStep.descFallback)}
                    size="s"
                />
                <Text
                    text={t('analytics_tour_step_counter', '{{current}} из {{total}}', {
                        current: stepIndex + 1,
                        total: stepKeys.length
                    })}
                    size="xs"
                />
                <HStack gap="12" justify="between" className={cls.tourActions}>
                    <Button variant="clear" size="s" onClick={onSkip}>
                        {t('analytics_tour_skip', 'Пропустить')}
                    </Button>
                    <Button variant="primary" size="m" onClick={onNext}>
                        {isLast
                            ? t('analytics_tour_finish', 'Готово')
                            : t('analytics_tour_next', 'Далее')}
                    </Button>
                </HStack>
            </VStack>
        </div>,
        document.body
    )
})
