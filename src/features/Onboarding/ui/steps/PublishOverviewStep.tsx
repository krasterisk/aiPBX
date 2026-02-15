import React, { memo, useCallback } from 'react'
import cls from '../OnboardingWizard/OnboardingWizard.module.scss'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { onboardingActions } from '../../model/slices/onboardingSlice'
import {
    Globe,
    PhoneCall,
    Mic,
    ArrowLeft,
    ArrowRight,
    Info
} from 'lucide-react'

interface PublishOverviewStepProps {
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
        badgeFallback: 'Попробуйте прямо сейчас',
        descFallback: 'Позвоните ассистенту прямо сейчас с микрофона в браузере.'
    }
]

export const PublishOverviewStep = memo(({ className }: PublishOverviewStepProps) => {
    const { t } = useTranslation('onboarding')
    const dispatch = useAppDispatch()

    const onNext = useCallback(() => {
        dispatch(onboardingActions.nextStep())
    }, [dispatch])

    const onBack = useCallback(() => {
        dispatch(onboardingActions.prevStep())
    }, [dispatch])

    return (
        <VStack gap="16" align="center" max className={className}>
            <Text
                title={t('publish_title', 'Как клиенты будут звонить?') as string}
                text={t('publish_subtitle', 'Ваш ассистент уже создан и готов к работе! Есть 3 способа:') as string}
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
                            <Text
                                title={t(titleKey, titleFallback) as string}
                                size="s"
                                bold
                            />
                            <Text
                                text={t(badgeKey, badgeFallback) as string}
                                variant="accent"
                                size="xs"
                            />
                            <Text
                                text={t(descKey, descFallback) as string}
                                size="xs"
                            />
                        </VStack>
                    </HStack>
                ))}
            </VStack>

            <HStack gap="8" align="center">
                <Info size={14} className={cls.hintIcon} />
                <Text
                    text={t('publish_hint', 'Всё это можно настроить позже в разделе «Публикация»') as string}
                    size="xs"
                />
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
                    variant="glass-action"
                    size="l"
                    onClick={onNext}
                    addonRight={<ArrowRight size={16} />}
                >
                    {t('next', 'Далее')}
                </Button>
            </HStack>
        </VStack>
    )
})
