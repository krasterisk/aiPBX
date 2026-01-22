import { classNames } from '@/shared/lib/classNames/classNames'
import { useTranslation } from 'react-i18next'
import cls from './PlaygroundSession.module.scss'
import { memo, useCallback, useState } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { AssistantSelectSingle } from '@/entities/Assistants'
import { useSelector } from 'react-redux'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { AssistantOptions } from '@/entities/Assistants'
import { usePlaygroundSession } from '../../model/usePlaygroundSession'
import { PlaygroundCall } from '../../ui/PlaygroundCall/PlaygroundCall'

interface PlaygroundSessionProps {
    className?: string
}

export const PlaygroundSession = memo((props: PlaygroundSessionProps) => {
    const { className } = props
    const { t } = useTranslation('playground')
    const userData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)

    const [selectedAssistant, setSelectedAssistant] = useState<AssistantOptions | null>(null)

    const { status, connect, disconnect, events, analyserNode } = usePlaygroundSession()

    // Status derivatives
    const isSessionActive = status === 'connected'
    const isLoading = status === 'connecting'

    const handleStartSession = useCallback(() => {
        if (selectedAssistant) {
            // No micDeviceId - will use default microphone
            connect(selectedAssistant.id)
        }
    }, [connect, selectedAssistant])

    const handleStopSession = useCallback(() => {
        disconnect()
    }, [disconnect])

    return (
        <VStack gap={'24'} max className={classNames(cls.PlaygroundSession, {}, [className])}>
            <Card max padding={'24'}>
                <VStack gap={'16'} max>
                    <Text title={t('Настройка сессии')} />

                    <HStack gap={'16'} max wrap={'wrap'}>
                        <AssistantSelectSingle
                            label={t('Выберите ассистента') || 'Assistant'}
                            value={selectedAssistant}
                            onChangeAssistant={(_, newValue) => setSelectedAssistant(newValue)}
                            userId={isAdmin ? undefined : userData?.id}
                            className={cls.select}
                        />
                    </HStack>

                    {!navigator.mediaDevices && (
                        <Text
                            variant={'error'}
                            text={t('Микрофон недоступен. Для работы микрофона требуется HTTPS или localhost.')}
                        />
                    )}

                    <HStack justify={'end'} max>
                        {!isSessionActive ? (
                            <Button
                                variant={'outline'}
                                color={'success'}
                                disabled={!selectedAssistant || isLoading || !navigator.mediaDevices}
                                onClick={handleStartSession}
                            >
                                {isLoading ? t('Подключение...') : t('Начать сессию')}
                            </Button>
                        ) : (
                            <Button
                                variant={'outline'}
                                color={'error'}
                                onClick={handleStopSession}
                            >
                                {t('Завершить сессию')}
                            </Button>
                        )}
                    </HStack>
                </VStack>
            </Card>

            {isSessionActive && (
                <PlaygroundCall
                    status={status}
                    events={events}
                    analyserNode={analyserNode || undefined}
                    assistantName={selectedAssistant?.name}
                />
            )}
        </VStack>
    )
})