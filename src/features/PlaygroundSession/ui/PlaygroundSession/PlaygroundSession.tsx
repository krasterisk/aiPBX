import { classNames } from '@/shared/lib/classNames/classNames'
import { useTranslation } from 'react-i18next'
import cls from './PlaygroundSession.module.scss'
import { memo, useCallback, useState, useEffect } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { useSelector, useDispatch } from 'react-redux'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { AssistantOptions, AssistantSelect, useAssistant } from '@/entities/Assistants'
import { usePlaygroundSession } from '../../model/usePlaygroundSession'
import { PlaygroundCall } from '../../ui/PlaygroundCall/PlaygroundCall'
import { PlaygroundAssistantSettings } from '../PlaygroundAssistantSettings/PlaygroundAssistantSettings'
// eslint-disable-next-line krasterisk-plugin/layer-imports
import { playgroundAssistantFormActions } from '@/pages/Playground'
import { SectionCard } from '../components/SectionCard/SectionCard'
import { UserCheck, Play, Square } from 'lucide-react'

interface PlaygroundSessionProps {
    className?: string
}

export const PlaygroundSession = memo((props: PlaygroundSessionProps) => {
    const { className } = props
    const { t } = useTranslation('playground')
    const dispatch = useDispatch()
    const userData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)

    const [selectedAssistant, setSelectedAssistant] = useState<AssistantOptions | null>(null)

    const { data: assistantData } = useAssistant(selectedAssistant?.id || '', {
        skip: !selectedAssistant?.id
    })

    const { status, connect, disconnect, events, analyserNode } = usePlaygroundSession()

    // Status derivatives
    const isSessionActive = status === 'connected'
    const isLoading = status === 'connecting'

    // Initialize form when assistant is selected
    useEffect(() => {
        if (assistantData && selectedAssistant) {
            dispatch(playgroundAssistantFormActions.initForm(assistantData))
        } else {
            dispatch(playgroundAssistantFormActions.resetForm())
        }
    }, [assistantData, selectedAssistant, dispatch])

    const handleStartSession = useCallback(() => {
        if (selectedAssistant) {
            connect(selectedAssistant.id)
        }
    }, [connect, selectedAssistant])

    const handleStopSession = useCallback(() => {
        disconnect()
    }, [disconnect])

    const RightElement = (
        <HStack gap="8">
            {!isSessionActive
                ? (
                    <Button
                        variant="outline"
                        disabled={!selectedAssistant || isLoading || !navigator.mediaDevices}
                        onClick={handleStartSession}
                        addonLeft={<Play size={18} />}
                    >
                        {isLoading ? t('Подключение...') : t('Начать сессию')}
                    </Button>
                )
                : (
                    <Button
                        variant="outline"
                        color="error"
                        onClick={handleStopSession}
                        addonLeft={<Square size={18} />}
                    >
                        {t('Завершить сессию')}
                    </Button>
                )}
        </HStack>
    )

    return (
        <VStack gap="24" max className={classNames(cls.PlaygroundSession, {}, [className])}>
            <SectionCard
                title={t('Ассистент')}
                icon={UserCheck}
                rightElement={RightElement}
            >
                <VStack gap="16" max>
                    <AssistantSelect
                        label={t('Выберите ассистента') || 'Assistant'}
                        value={selectedAssistant}
                        onChangeAssistant={(_, newValue) => { setSelectedAssistant(newValue) }}
                        userId={isAdmin ? undefined : userData?.id}
                        fullWidth
                    />

                    {!navigator.mediaDevices && (
                        <Text
                            variant="error"
                            text={t('Микрофон недоступен. Для работы микрофона требуется HTTPS или localhost.')}
                        />
                    )}
                </VStack>
            </SectionCard>

            {/* Show settings when assistant is selected but session is not active */}
            {selectedAssistant && !isSessionActive && assistantData && (
                <PlaygroundAssistantSettings />
            )}

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
