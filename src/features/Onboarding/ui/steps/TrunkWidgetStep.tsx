import React, { memo, useCallback } from 'react'
import cls from '../OnboardingWizard/OnboardingWizard.module.scss'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesign-v3/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useNavigate } from 'react-router-dom'
import { onboardingActions } from '../../model/slices/onboardingSlice'
import {
    getRoutePublishWidgetsCreate,
    getRoutePublishSipUrisCreate,
    getRouteDocs
} from '@/shared/const/router'
import {
    Globe,
    PhoneCall,
    Mic,
    CheckCircle2,
    ExternalLink,
    Info
} from 'lucide-react'

interface TrunkWidgetStepProps {
    className?: string
}

const publishMethods = [
    {
        Icon: Globe,
        titleKey: 'publish_widget_title',
        badgeKey: 'publish_widget_badge',
        descKey: 'publish_widget_desc',
        titleFallback: 'Кнопка на вашем сайте',
        badgeFallback: 'Самый простой способ',
        descFallback: 'Добавьте виджет на сайт — клиенты смогут позвонить ассистенту прямо из браузера.'
    },
    {
        Icon: PhoneCall,
        titleKey: 'publish_telephony_title',
        badgeKey: 'publish_telephony_badge',
        descKey: 'publish_telephony_desc',
        titleFallback: 'Подключить к телефонии',
        badgeFallback: 'Для тех, у кого есть АТС',
        descFallback: 'Подключите ассистента как внутренний номер вашей телефонной системы.'
    },
    {
        Icon: Mic,
        titleKey: 'publish_playground_title',
        badgeKey: 'publish_playground_badge',
        descKey: 'publish_playground_desc',
        titleFallback: 'Тест в Playground',
        badgeFallback: 'Вы уже попробовали',
        descFallback: 'Playground всегда доступен для повторных тестов голосом.'
    }
]

export const TrunkWidgetStep = memo(({ className }: TrunkWidgetStepProps) => {
    const { t } = useTranslation('onboarding')
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const onFinish = useCallback(() => {
        dispatch(onboardingActions.completeOnboarding())
    }, [dispatch])

    const onDefer = useCallback(() => {
        dispatch(onboardingActions.skipOnboarding())
    }, [dispatch])

    const onOpenWidgetDocs = useCallback(() => {
        navigate(getRoutePublishWidgetsCreate())
        dispatch(onboardingActions.completeOnboarding())
    }, [dispatch, navigate])

    const onOpenSipDocs = useCallback(() => {
        navigate(getRoutePublishSipUrisCreate())
        dispatch(onboardingActions.completeOnboarding())
    }, [dispatch, navigate])

    const onOpenDocs = useCallback(() => {
        navigate(getRouteDocs())
        dispatch(onboardingActions.completeOnboarding())
    }, [dispatch, navigate])

    return (
        <VStack gap="16" align="center" max className={className}>
            <HStack gap="12" className={cls.connectedBanner}>
                <CheckCircle2 size={22} />
                <Text
                    text={t('trunk_widget_success', 'Звонок в Playground прошёл успешно!')}
                    bold
                    variant="success"
                />
            </HStack>

            <Text
                title={t('trunk_widget_title', 'Как подключить ассистента к клиентам?')}
                text={t(
                    'trunk_widget_subtitle',
                    'Выберите способ публикации — можно настроить сейчас или вернуться позже.'
                )}
                align="center"
                size="l"
            />

            <VStack gap="12" max>
                {publishMethods.map(({ Icon, titleKey, badgeKey, descKey, titleFallback, badgeFallback, descFallback }) => (
                    <HStack key={titleKey} gap="16" align="start" className={cls.publishCard}>
                        <HStack justify="center" align="center" className={cls.publishCardIconBox}>
                            <Icon size={20} />
                        </HStack>
                        <VStack gap="4">
                            <Text title={t(titleKey, titleFallback)} size="s" bold />
                            <Text text={t(badgeKey, badgeFallback)} variant="accent" size="xs" />
                            <Text text={t(descKey, descFallback)} size="xs" />
                        </VStack>
                    </HStack>
                ))}
            </VStack>

            <HStack gap="8" align="center">
                <Info size={16} className={cls.hintIcon} />
                <Text
                    text={t('publish_hint', 'Всё это можно настроить позже в разделе «Публикация»')}
                    size="s"
                />
            </HStack>

            <VStack gap="8" max>
                <Button
                    variant="primary"
                    size="l"
                    onClick={onOpenWidgetDocs}
                    addonRight={<ExternalLink size={14} />}
                    fullWidth
                >
                    {t('trunk_widget_widget_cta', 'Создать виджет для сайта')}
                </Button>
                <Button
                    variant="outline"
                    size="l"
                    onClick={onOpenSipDocs}
                    addonRight={<ExternalLink size={14} />}
                    fullWidth
                >
                    {t('trunk_widget_sip_cta', 'Настроить SIP / АТС')}
                </Button>
            </VStack>

            <HStack gap="12" justify="center" wrap="wrap">
                <Button variant="clear" size="m" onClick={onOpenDocs} className={cls.skipLink}>
                    {t('trunk_widget_docs', 'Документация')}
                </Button>
                <Button variant="clear" size="m" onClick={onDefer} className={cls.skipLink}>
                    {t('trunk_widget_defer', 'Настрою позже')}
                </Button>
            </HStack>

            <Button variant="primary" size="m" onClick={onFinish}>
                {t('trunk_widget_finish', 'Завершить обучение')}
            </Button>
        </VStack>
    )
})
