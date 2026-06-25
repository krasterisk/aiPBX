import React, { memo, useCallback, useState } from 'react'
import cls from '../OnboardingWizard/OnboardingWizard.module.scss'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesign-v3/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useSelector } from 'react-redux'
import { onboardingActions } from '../../model/slices/onboardingSlice'
import { getOnboardingTemplateId } from '../../model/selectors/onboardingSelectors'
import {
    ArrowLeft,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    MessageSquare,
    Mic,
    Settings2,
    ExternalLink
} from 'lucide-react'

interface SimpleExampleStepProps {
    className?: string
}

const exampleCards = [
    {
        Icon: Settings2,
        titleKey: 'simple_example_prompt_title',
        descKey: 'simple_example_prompt_desc',
        titleFallback: 'Инструкции ассистента',
        descFallback: 'Вы задали сценарий: приветствие, сбор данных клиента и запись на приём.'
    },
    {
        Icon: Mic,
        titleKey: 'simple_example_voice_title',
        descKey: 'simple_example_voice_desc',
        titleFallback: 'Голос и диалог',
        descFallback: 'Ассистент отвечает голосом в реальном времени — как живой оператор на ресепшене.'
    },
    {
        Icon: MessageSquare,
        titleKey: 'simple_example_result_title',
        descKey: 'simple_example_result_desc',
        titleFallback: 'Результат звонка',
        descFallback: 'После разговора вы получаете заявку: имя, телефон, время визита.'
    }
]

export const SimpleExampleStep = memo(({ className }: SimpleExampleStepProps) => {
    const { t } = useTranslation('onboarding')
    const dispatch = useAppDispatch()
    const templateId = useSelector(getOnboardingTemplateId)
    const [telegramExpanded, setTelegramExpanded] = useState(false)

    const scenarioKey = templateId === 'hotel_reception' || templateId === 'dental_clinic'
        ? 'simple_example_scenario_reception'
        : 'simple_example_scenario_default'

    const onNext = useCallback(() => {
        dispatch(onboardingActions.nextStep())
    }, [dispatch])

    const onBack = useCallback(() => {
        dispatch(onboardingActions.prevStep())
    }, [dispatch])

    const toggleTelegram = useCallback(() => {
        setTelegramExpanded(prev => !prev)
    }, [])

    return (
        <VStack gap="16" align="center" max className={className}>
            <Text
                title={t('simple_example_title', 'Простой пример')}
                text={t(scenarioKey, 'Посмотрите, как работает ваш ассистент на примере записи клиента на приём.')}
                align="center"
                size="l"
            />

            <VStack gap="12" max>
                {exampleCards.map(({ Icon, titleKey, descKey, titleFallback, descFallback }) => (
                    <HStack key={titleKey} gap="16" align="start" className={cls.publishCard}>
                        <HStack justify="center" align="center" className={cls.publishCardIconBox}>
                            <Icon size={20} />
                        </HStack>
                        <VStack gap="4">
                            <Text title={t(titleKey, titleFallback)} size="s" bold />
                            <Text text={t(descKey, descFallback)} size="xs" />
                        </VStack>
                    </HStack>
                ))}
            </VStack>

            <VStack gap="8" max className={cls.featuresBlock}>
                <Button
                    variant="clear"
                    size="s"
                    onClick={toggleTelegram}
                    addonRight={telegramExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                >
                    {t('simple_example_telegram_toggle', 'Подключить Telegram (необязательно)')}
                </Button>
                {telegramExpanded && (
                    <VStack gap="8">
                        <Text
                            text={t(
                                'simple_example_telegram_desc',
                                'Telegram можно подключить позже для уведомлений о заявках. В некоторых регионах сервис недоступен — это не блокирует работу ассистента.'
                            )}
                            size="xs"
                        />
                        <a
                            href="https://t.me/AIPBXbot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cls.botLink}
                        >
                            @AIPBXbot
                            <ExternalLink size={12} />
                        </a>
                    </VStack>
                )}
            </VStack>

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
                    variant="primary"
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
