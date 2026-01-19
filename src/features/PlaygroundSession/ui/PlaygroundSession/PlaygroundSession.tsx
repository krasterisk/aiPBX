import { classNames } from '@/shared/lib/classNames/classNames'
import { useTranslation } from 'react-i18next'
import cls from './PlaygroundSession.module.scss'
import { memo, useCallback, useEffect, useState } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { AssistantSelectSingle } from '@/entities/Assistants'
import { useSelector } from 'react-redux'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { AssistantOptions } from '@/entities/Assistants'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { usePlaygroundSession } from '../../model/usePlaygroundSession'

interface PlaygroundSessionProps {
    className?: string
}

export const PlaygroundSession = memo((props: PlaygroundSessionProps) => {
    const { className } = props
    const { t } = useTranslation('playground')
    const userData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)

    const [selectedAssistant, setSelectedAssistant] = useState<AssistantOptions | null>(null)
    const [mics, setMics] = useState<MediaDeviceInfo[]>([])
    const [selectedMic, setSelectedMic] = useState<string>('')

    const { status, connect, disconnect } = usePlaygroundSession()

    // Status derivatives
    const isSessionActive = status === 'connected'
    const isLoading = status === 'connecting'

    const getDevices = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices()
            const audioInputDevices = devices.filter((device) => device.kind === 'audioinput')
            setMics(audioInputDevices)
            if (audioInputDevices.length > 0 && !selectedMic) {
                setSelectedMic(audioInputDevices[0].deviceId)
            }
        } catch (e) {
            console.error('Error enumerating devices:', e)
        }
    }, [selectedMic])

    useEffect(() => {
        getDevices()
        navigator.mediaDevices.ondevicechange = getDevices
        return () => {
            navigator.mediaDevices.ondevicechange = null
        }
    }, [getDevices])

    const handleStartSession = useCallback(() => {
        if (selectedAssistant) {
            connect(selectedAssistant.id, selectedMic)
        }
    }, [connect, selectedAssistant, selectedMic])

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

                        <Combobox
                            label={t('Микрофон') || 'Microphone'}
                            options={mics}
                            value={mics.find(m => m.deviceId === selectedMic) || null}
                            getOptionLabel={(option) => option.label || 'Microphone ' + option.deviceId.slice(0, 5)}
                            onChange={(_, newValue) => setSelectedMic(newValue?.deviceId || '')}
                            className={cls.select}
                        />
                    </HStack>

                    <HStack justify={'end'} max>
                        {!isSessionActive ? (
                            <Button
                                variant={'outline'}
                                color={'success'}
                                disabled={!selectedAssistant || isLoading}
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
                <Card max padding={'24'}>
                    <VStack gap={'16'} align={'center'} max>
                        <div className={cls.visualizer}>
                            <div className={classNames(cls.pulse, { [cls.active]: isSessionActive })} />
                        </div>
                        <Text text={t('Идет разговор с ') + (selectedAssistant?.name || '')} />
                    </VStack>
                </Card>
            )}
        </VStack>
    )
})