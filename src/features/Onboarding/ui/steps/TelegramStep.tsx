import React, { memo, useCallback, useState } from 'react'
import cls from '../OnboardingWizard/OnboardingWizard.module.scss'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { Input } from '@/shared/ui/mui/Input'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useSelector } from 'react-redux'
import { onboardingActions } from '../../model/slices/onboardingSlice'
import {
    getOnboardingTemplateId,
    getOnboardingTelegramChatId,
    getOnboardingTelegramConnected
} from '../../model/selectors/onboardingSelectors'
import { TelegramMockup } from '../components/TelegramMockup/TelegramMockup'
import { useComposioConnectApiKey } from '@/entities/Mcp/api/mcpApi'
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    ExternalLink,
    Loader2,
    AlertTriangle
} from 'lucide-react'

interface TelegramStepProps {
    className?: string
}

export const TelegramStep = memo(({ className }: TelegramStepProps) => {
    const { t } = useTranslation('onboarding')
    const dispatch = useAppDispatch()
    const templateId = useSelector(getOnboardingTemplateId)
    const chatId = useSelector(getOnboardingTelegramChatId)
    const isConnected = useSelector(getOnboardingTelegramConnected)
    const [connectTelegram, { isLoading }] = useComposioConnectApiKey()
    const [error, setError] = useState<string | null>(null)

    const onChatIdChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        dispatch(onboardingActions.setTelegramChatId(e.target.value))
        setError(null)
    }, [dispatch])

    const onConnect = useCallback(async () => {
        if (!chatId.trim()) return

        try {
            setError(null)
            await connectTelegram({ toolkit: 'telegram', chatId: chatId.trim() }).unwrap()
            dispatch(onboardingActions.setTelegramConnected(true))
        } catch (err: any) {
            setError(err?.data?.message || t('telegram_error', 'Ошибка подключения') as string)
        }
    }, [chatId, connectTelegram, dispatch, t])

    const onNext = useCallback(() => {
        dispatch(onboardingActions.nextStep())
    }, [dispatch])

    const onBack = useCallback(() => {
        dispatch(onboardingActions.prevStep())
    }, [dispatch])

    return (
        <VStack gap="16" align="center" max className={className}>
            <Text
                title={t('telegram_title') as string}
                align="center"
                size="l"
            />
            <Text
                text={t('telegram_integrations_hint') as string}
                align="center"
                size="s"
            />
            <Text
                text={t('telegram_subtitle') as string}
                align="center"
                size="s"
                bold
            />

            <HStack gap="24" align="start" max className={cls.telegramLayout}>
                <TelegramMockup templateId={templateId} />

                <VStack gap="16" max>
                    {isConnected ? (
                        <HStack gap="12" className={cls.connectedBanner}>
                            <CheckCircle2 size={22} />
                            <Text
                                text={t('telegram_connected', 'Telegram подключен!') as string}
                                bold
                                variant="success"
                            />
                        </HStack>
                    ) : (
                        <>
                            <VStack gap="12">
                                <Text
                                    text={t('telegram_instruction_title', 'Подключить за 2 шага:') as string}
                                    bold
                                    size="s"
                                />
                                <HStack gap="12">
                                    <HStack justify="center" align="center" className={cls.instructionNum}>
                                        1
                                    </HStack>
                                    <HStack gap="4" align="center" wrap="wrap">
                                        <Text
                                            text={t('telegram_instruction_1', 'Откройте нашего бота:') as string}
                                            size="s"
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
                                    </HStack>
                                </HStack>
                                <HStack gap="12">
                                    <HStack justify="center" align="center" className={cls.instructionNum}>
                                        2
                                    </HStack>
                                    <Text
                                        text={t('telegram_instruction_2', 'Нажмите «Start» — бот пришлёт ваш ID. Вставьте его сюда:') as string}
                                        size="s"
                                    />
                                </HStack>
                            </VStack>

                            <HStack gap="8" max>
                                <Input
                                    value={chatId}
                                    onChange={onChatIdChange}
                                    placeholder={t('telegram_chatid_placeholder', 'Ваш Chat ID') as string}
                                    disabled={isLoading}
                                    size="small"
                                />
                                <Button
                                    variant="glass-action"
                                    size="m"
                                    onClick={onConnect}
                                    disabled={!chatId.trim() || isLoading}
                                    addonLeft={isLoading
                                        ? <Loader2 size={14} className={cls.loadingSpinnerIcon} />
                                        : <CheckCircle2 size={14} />
                                    }
                                >
                                    {isLoading
                                        ? t('telegram_connecting', 'Подключаем...')
                                        : t('telegram_connect_btn', 'Подключить')
                                    }
                                </Button>
                            </HStack>

                            {error && (
                                <HStack gap="8">
                                    <AlertTriangle size={14} className={cls.errorIcon} />
                                    <Text text={error} variant="error" size="xs" />
                                </HStack>
                            )}
                        </>
                    )}
                </VStack>
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
                    {isConnected
                        ? t('next', 'Далее')
                        : t('telegram_skip', 'Пропустить')
                    }
                </Button>
            </HStack>
        </VStack>
    )
})
