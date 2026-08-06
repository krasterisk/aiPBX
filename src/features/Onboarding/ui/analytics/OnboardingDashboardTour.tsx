import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { Button } from '@/shared/ui/redesign-v3/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { onboardingActions } from '../../model/slices/onboardingSlice'
import {
    DASHBOARD_TOUR_STEPS,
    placeTourCard,
    resolveVisibleTourSteps,
    spotlightFromElement,
    type DashboardTourStepDef,
    type ViewportBox,
} from '../../lib/dashboardTourSteps'

import cls from './OnboardingDashboardTour.module.scss'

interface OnboardingDashboardTourProps {
    active: boolean
    /** Wait until the dashboard finished loading so tour anchors exist. */
    ready?: boolean
    onFinished?: () => void
}

function queryTourTarget(id: string): Element | null {
    return document.querySelector(`[data-tour-id="${id}"]`)
}

export const OnboardingDashboardTour = memo(({
    active,
    ready = true,
    onFinished,
}: OnboardingDashboardTourProps) => {
    const { t } = useTranslation('onboarding')
    const dispatch = useAppDispatch()
    const [stepIndex, setStepIndex] = useState(0)
    const [rect, setRect] = useState<ViewportBox | null>(null)
    const [visibleSteps, setVisibleSteps] = useState<DashboardTourStepDef[]>([])

    const refreshVisibleSteps = useCallback(() => {
        const next = resolveVisibleTourSteps(
            DASHBOARD_TOUR_STEPS,
            id => Boolean(queryTourTarget(id)),
        )
        setVisibleSteps(next)
        setStepIndex(i => Math.min(i, Math.max(0, next.length - 1)))
        return next
    }, [])

    const currentStep = visibleSteps[stepIndex] ?? null
    const isLast = visibleSteps.length > 0 && stepIndex >= visibleSteps.length - 1

    const measureTarget = useCallback(async (step?: DashboardTourStepDef | null) => {
        const target = step ?? currentStep
        if (!target) {
            setRect(null)
            return
        }

        const el = queryTourTarget(target.id)
        if (!el) {
            setRect(null)
            return
        }

        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
        await new Promise<void>(resolve => {
            window.setTimeout(resolve, 350)
        })

        const stillThere = queryTourTarget(target.id)
        if (!stillThere) {
            setRect(null)
            return
        }
        setRect(spotlightFromElement(stillThere))
    }, [currentStep])

    useEffect(() => {
        if (!active || !ready) return
        setStepIndex(0)
        refreshVisibleSteps()
    }, [active, ready, refreshVisibleSteps])

    useLayoutEffect(() => {
        if (!active || !ready || !currentStep) return

        let cancelled = false
        const run = async () => {
            await measureTarget(currentStep)
            if (cancelled) {
                setRect(null)
            }
        }
        void run()

        const onResize = () => {
            const el = queryTourTarget(currentStep.id)
            if (el) setRect(spotlightFromElement(el))
        }
        window.addEventListener('resize', onResize)
        window.addEventListener('scroll', onResize, true)

        return () => {
            cancelled = true
            window.removeEventListener('resize', onResize)
            window.removeEventListener('scroll', onResize, true)
        }
    }, [active, ready, currentStep, measureTarget, stepIndex])

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
        setStepIndex(i => i + 1)
    }, [dispatch, isLast, onFinished])

    const cardPos = useMemo(() => {
        if (!rect) {
            return { top: 96, left: 24 }
        }
        return placeTourCard(rect, {
            width: window.innerWidth,
            height: window.innerHeight,
        })
    }, [rect])

    if (!active) return null

    if (!ready) {
        return createPortal(
            <div className={cls.tourOverlay} data-testid="onboarding-dashboard-tour">
                <div className={cls.tourBackdrop} />
                <VStack gap="12" className={cls.tourCard} style={{ top: 96, left: 24 }}>
                    <Text
                        title={t('analytics_tour_loading_title', 'Загружаем дашборд...')}
                        text={t(
                            'analytics_tour_loading_desc',
                            'Сейчас подтянем результаты анализа и покажем короткий обзор разделов.',
                        )}
                        size="s"
                    />
                </VStack>
            </div>,
            document.body,
        )
    }

    if (!currentStep) return null

    return createPortal(
        <div className={cls.tourOverlay} data-testid="onboarding-dashboard-tour">
            {!rect && <div className={cls.tourBackdrop} />}
            {rect && (
                <div
                    className={cls.tourSpotlight}
                    data-testid="onboarding-dashboard-tour-spotlight"
                    style={{
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                    }}
                />
            )}
            <VStack
                gap="12"
                className={cls.tourCard}
                data-testid="onboarding-dashboard-tour-card"
                style={{ top: cardPos.top, left: cardPos.left }}
            >
                <Text
                    title={t(currentStep.titleKey, currentStep.titleFallback)}
                    text={t(currentStep.descKey, currentStep.descFallback)}
                    size="s"
                />
                <Text
                    text={t('analytics_tour_step_counter', '{{current}} из {{total}}', {
                        current: stepIndex + 1,
                        total: visibleSteps.length,
                    })}
                    size="xs"
                />
                <HStack gap="12" justify="between" className={cls.tourActions}>
                    <Button variant="clear" size="m" onClick={onSkip}>
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
        document.body,
    )
})
