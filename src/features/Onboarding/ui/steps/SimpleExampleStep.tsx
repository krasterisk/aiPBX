import React, { memo, useCallback } from 'react'
import cls from '../OnboardingWizard/OnboardingWizard.module.scss'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesign-v3/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useSelector } from 'react-redux'
import { onboardingActions } from '../../model/slices/onboardingSlice'
import { getOnboardingTemplateId } from '../../model/selectors/onboardingSelectors'
import { OnboardingStepLayout } from '../components/OnboardingStepLayout/OnboardingStepLayout'
import {
    ArrowLeft,
    ArrowRight,
    MessageSquare,
    Mic,
    Settings2
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
        descFallback: 'Ассистент отвечает голосом в реальном времени - как живой оператор на ресепшене.'
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

    const scenarioKey = templateId === 'hotel_reception' || templateId === 'dental_clinic'
        ? 'simple_example_scenario_reception'
        : 'simple_example_scenario_default'

    const onNext = useCallback(() => {
        dispatch(onboardingActions.nextStep())
    }, [dispatch])

    const onBack = useCallback(() => {
        dispatch(onboardingActions.prevStep())
    }, [dispatch])

    return (
        <OnboardingStepLayout
            className={className}
            footer={(
                <>
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
                </>
            )}
        >
            <Text
                title={t('simple_example_title', 'Простой пример')}
                text={t(scenarioKey, 'Посмотрите, как работает ваш ассистент на примере записи клиента на приём.')}
                align="center"
                size="l"
            />

            <VStack gap="12" max className={cls.cardsStack}>
                {exampleCards.map(({ Icon, titleKey, descKey, titleFallback, descFallback }) => (
                    <HStack key={titleKey} gap="16" align="start" className={cls.publishCard}>
                        <HStack justify="center" align="center" className={cls.publishCardIconBox}>
                            <Icon size={20} />
                        </HStack>
                        <VStack gap="4" max>
                            <Text title={t(titleKey, titleFallback)} size="s" bold />
                            <Text text={t(descKey, descFallback)} size="xs" />
                        </VStack>
                    </HStack>
                ))}
            </VStack>
        </OnboardingStepLayout>
    )
})
