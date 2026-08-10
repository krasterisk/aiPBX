import { memo, ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Slider from '@mui/material/Slider'
import { Settings2, ListTree, Play, Square, MicOff, Volume2 } from 'lucide-react'
import { AssistantOptions, AssistantSelect } from '@/entities/Assistants'
import { classNames } from '@/shared/lib/classNames/classNames'
import {
    PlaygroundSessionStatus,
    formatCallTimer,
    statusLabelKey,
} from '../../model/playgroundMode'
import cls from './CallChrome.module.scss'

interface CallChromeProps {
    className?: string
    selectedAssistant: AssistantOptions | null
    onSelectAssistant: (event: any, value: AssistantOptions | null) => void
    status: PlaygroundSessionStatus
    onStartSession: () => void
    onStopSession: () => void
    onOpenSetup: () => void
    onOpenDebug: () => void
    userId?: string
    isAdmin?: boolean
    /** When true, Setup/Debug look secondary (onboarding). */
    secondaryChrome?: boolean
    /** Disable Start (e.g. mic not ready) — wired fully in Task 2. */
    startDisabled?: boolean
    /** Show timer after hangup for current session summary (Task 2). */
    showPostCallTimer?: boolean
    postCallElapsedSeconds?: number
    /** Mute/volume placeholders — wired in Task 2. */
    muted?: boolean
    volume?: number
    onToggleMute?: () => void
    onVolumeChange?: (value: number) => void
    children: ReactNode
}

function statusDotClass (status: PlaygroundSessionStatus): string {
    switch (status) {
        case 'connecting':
            return cls.statusDotConnecting
        case 'connected':
            return cls.statusDotConnected
        case 'error':
            return cls.statusDotError
        default:
            return ''
    }
}

export const CallChrome = memo((props: CallChromeProps) => {
    const {
        className,
        selectedAssistant,
        onSelectAssistant,
        status,
        onStartSession,
        onStopSession,
        onOpenSetup,
        onOpenDebug,
        userId,
        isAdmin,
        secondaryChrome = false,
        startDisabled = false,
        showPostCallTimer = false,
        postCallElapsedSeconds = 0,
        muted = false,
        volume = 1,
        onToggleMute,
        onVolumeChange,
        children,
    } = props

    const { t } = useTranslation('playground')
    const isConnected = status === 'connected'
    const isConnecting = status === 'connecting'
    const selectDisabled = isConnected

    const [elapsed, setElapsed] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (isConnected) {
            setElapsed(0)
            intervalRef.current = setInterval(() => {
                setElapsed(prev => prev + 1)
            }, 1000)
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isConnected])

    const showTimer = isConnected || showPostCallTimer
    const timerSeconds = isConnected ? elapsed : postCallElapsedSeconds

    const openSettingsLabel = t('Открыть настройки')
    const openEventsLabel = t('Открыть события')
    const muteLabel = muted ? t('Включить звук') : t('Выключить звук')

    return (
        <div className={classNames(cls.CallChrome, {}, [className])}>
            <header className={cls.header}>
                <div className={cls.left}>
                    <div className={cls.assistantSelect}>
                        <AssistantSelect
                            label={t('Выберите ассистента') || 'Assistant'}
                            value={selectedAssistant}
                            onChangeAssistant={onSelectAssistant}
                            userId={isAdmin ? undefined : userId}
                            disabled={selectDisabled}
                            fullWidth
                        />
                    </div>

                    <div
                        className={classNames(cls.secondaryActions, {
                            [cls.secondarySubdued]: secondaryChrome,
                        })}
                    >
                        <Tooltip title={openSettingsLabel}>
                            <span>
                                <Button
                                    size="small"
                                    variant="text"
                                    color="inherit"
                                    startIcon={<Settings2 size={16} />}
                                    onClick={onOpenSetup}
                                    disabled={!canClickSetup(status)}
                                    aria-label={openSettingsLabel}
                                >
                                    <span className={cls.desktopLabel}>{openSettingsLabel}</span>
                                </Button>
                            </span>
                        </Tooltip>
                        <Tooltip title={openEventsLabel}>
                            <span>
                                <Button
                                    size="small"
                                    variant="text"
                                    color="inherit"
                                    startIcon={<ListTree size={16} />}
                                    onClick={onOpenDebug}
                                    aria-label={openEventsLabel}
                                >
                                    <span className={cls.desktopLabel}>{openEventsLabel}</span>
                                </Button>
                            </span>
                        </Tooltip>
                    </div>
                </div>

                <div className={cls.statusBlock}>
                    <span
                        className={classNames(cls.statusDot, {}, [statusDotClass(status)])}
                        aria-hidden
                    />
                    <span className={cls.statusLabel}>{t(statusLabelKey(status))}</span>
                    {showTimer && (
                        <span className={cls.timer} aria-live="polite">
                            {formatCallTimer(timerSeconds)}
                        </span>
                    )}
                </div>

                <div className={cls.primaryActions}>
                    {(isConnected || selectedAssistant) && (
                        <>
                            <Tooltip title={muteLabel}>
                                <IconButton
                                    size="small"
                                    aria-label={muteLabel}
                                    onClick={onToggleMute}
                                    color={muted ? 'warning' : 'default'}
                                >
                                    {muted ? <MicOff size={18} /> : <Volume2 size={18} />}
                                </IconButton>
                            </Tooltip>
                            {onVolumeChange && (
                                <Slider
                                    size="small"
                                    value={Math.round(volume * 100)}
                                    onChange={(_, v) => {
                                        onVolumeChange((Array.isArray(v) ? v[0] : v) / 100)
                                    }}
                                    aria-label={t('Аудио')}
                                    sx={{ width: 72, mx: 0.5 }}
                                    disabled={!isConnected && !selectedAssistant}
                                />
                            )}
                        </>
                    )}

                    {!isConnected ? (
                        <Button
                            variant="contained"
                            size="small"
                            disabled={!selectedAssistant || isConnecting || startDisabled}
                            onClick={onStartSession}
                            startIcon={<Play size={16} />}
                            sx={{
                                backgroundColor: 'var(--accent-redesigned, #00c8ff)',
                                color: '#0c1214',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': { backgroundColor: 'var(--accent-redesigned, #00c8ff)', filter: 'brightness(0.95)' },
                            }}
                        >
                            {isConnecting ? t('Подключение…') : t('Начать тест')}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={onStopSession}
                            startIcon={<Square size={16} />}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                            {t('Завершить звонок')}
                        </Button>
                    )}
                </div>
            </header>

            <div className={cls.center}>{children}</div>
        </div>
    )
})

function canClickSetup (status: PlaygroundSessionStatus): boolean {
    return status !== 'connecting' && status !== 'connected'
}
