import { memo, MouseEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Settings2, ListTree, Square, Mic, MicOff, Volume2 } from 'lucide-react'
import { AssistantOptions, AssistantSelect } from '@/entities/Assistants'
import { classNames } from '@/shared/lib/classNames/classNames'
import {
    PlaygroundSessionStatus,
    formatCallTimer,
    statusLabelKey,
} from '../../model/playgroundMode'
import { MicChecklistItem } from '../../model/useMicPermission'
import {
    MicDeviceOption,
    pickDefaultMicDeviceId,
    resolveMicDeviceOption,
    toMicDeviceOptions,
} from '../../model/micDeviceSelect'
import cls from './CallChrome.module.scss'

/** UI-SPEC mobile breakpoint — prefer matchMedia over useDevice (Pitfall 8). */
export const PLAYGROUND_MOBILE_MQ = '(max-width: 899px)'

interface CallChromeProps {
    className?: string
    selectedAssistant: AssistantOptions | null
    onSelectAssistant: (event: any, value: AssistantOptions | null) => void
    status: PlaygroundSessionStatus
    onStopSession: () => void
    onOpenSetup: () => void
    onOpenDebug: () => void
    userId?: string
    isAdmin?: boolean
    /** When true, Setup/Debug look secondary (onboarding). */
    secondaryChrome?: boolean
    /** Show timer after hangup for current session summary. */
    showPostCallTimer?: boolean
    postCallElapsedSeconds?: number
    muted?: boolean
    onToggleMute?: () => void
    micChecklist?: MicChecklistItem
    onRetryMic?: () => void
    micDeviceId?: string | null
    onMicDeviceChange?: (deviceId: string | null) => void
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
        onStopSession,
        onOpenSetup,
        onOpenDebug,
        userId,
        isAdmin,
        secondaryChrome = false,
        showPostCallTimer = false,
        postCallElapsedSeconds = 0,
        muted = false,
        onToggleMute,
        micChecklist,
        onRetryMic,
        micDeviceId = null,
        onMicDeviceChange,
        children,
    } = props

    const { t } = useTranslation('playground')
    const isMobile = useMediaQuery(PLAYGROUND_MOBILE_MQ)
    const isConnected = status === 'connected'
    const selectDisabled = isConnected

    const [elapsed, setElapsed] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const [micOptions, setMicOptions] = useState<MicDeviceOption[]>([])
    const [micMenuAnchor, setMicMenuAnchor] = useState<HTMLElement | null>(null)

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

    const enumerateMics = useCallback(async () => {
        if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) {
            setMicOptions([])
            return
        }
        try {
            const devices = await navigator.mediaDevices.enumerateDevices()
            const options = toMicDeviceOptions(devices)
            setMicOptions(options)
            if (!micDeviceId && onMicDeviceChange) {
                const fallback = pickDefaultMicDeviceId(options)
                if (fallback) onMicDeviceChange(fallback)
            }
        } catch {
            setMicOptions([])
        }
    }, [micDeviceId, onMicDeviceChange])

    useEffect(() => {
        if (micChecklist?.status !== 'ok') return
        void enumerateMics()
    }, [micChecklist?.status, enumerateMics])

    const showTimer = isConnected || showPostCallTimer
    const timerSeconds = isConnected ? elapsed : postCallElapsedSeconds

    const openSettingsLabel = t('Настройки')
    const openEventsLabel = t('События')
    const muteLabel = muted ? t('Включить звук') : t('Выключить звук')

    const micOk = micChecklist?.status === 'ok'
    const micPending = micChecklist?.status === 'pending'
    const micLabel = micChecklist ? t(micChecklist.labelKey) : ''
    const selectedMic = resolveMicDeviceOption(micOptions, micDeviceId)
    const micMenuOpen = Boolean(micMenuAnchor)
    const micTooltip = micChecklist?.tooltipKey
        ? t(micChecklist.tooltipKey)
        : selectedMic?.label
            ? `${micLabel}: ${selectedMic.label}`
            : micLabel

    const closeMicMenu = useCallback(() => {
        setMicMenuAnchor(null)
    }, [])

    const handleMicButtonClick = useCallback((event: MouseEvent<HTMLElement>) => {
        if (!micChecklist) return
        if (micChecklist.showRetry && !micOk) {
            onRetryMic?.()
            return
        }
        if (!micOk || !onMicDeviceChange) return
        setMicMenuAnchor(event.currentTarget)
        void enumerateMics()
    }, [micChecklist, micOk, onRetryMic, onMicDeviceChange, enumerateMics])

    const handleMicDevicePick = useCallback((deviceId: string) => {
        onMicDeviceChange?.(deviceId || pickDefaultMicDeviceId(micOptions))
        closeMicMenu()
    }, [onMicDeviceChange, micOptions, closeMicMenu])

    const micButtonSx = micOk
        ? {
            bgcolor: '#12b76a',
            color: '#fff',
            border: '1px solid #12b76a',
            '&:hover': { bgcolor: '#0f9f5c' },
        }
        : micPending
            ? {
                bgcolor: '#e5e7eb',
                color: '#374151',
                border: '1px solid #d1d5db',
                '&:hover': { bgcolor: '#d1d5db' },
            }
            : {
                bgcolor: '#f04438',
                color: '#fff',
                border: '1px solid #f04438',
                '&:hover': { bgcolor: '#d92d20' },
            }

    const micControl = micChecklist
        ? (
            <div className={cls.micGroup} data-testid="CallChrome.micGroup">
                <Tooltip title={micTooltip}>
                    <IconButton
                        size="small"
                        className={cls.micButton}
                        sx={micButtonSx}
                        onClick={handleMicButtonClick}
                        aria-label={micLabel}
                        aria-haspopup={micOk ? 'menu' : undefined}
                        aria-expanded={micOk ? micMenuOpen : undefined}
                        data-testid="CallChrome.micStatus"
                    >
                        <Mic size={18} />
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={micMenuAnchor}
                    open={micMenuOpen}
                    onClose={closeMicMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    MenuListProps={{
                        'aria-label': String(t('Устройство микрофона')),
                        dense: true,
                    }}
                    data-testid="CallChrome.micMenu"
                >
                    {micOptions.length === 0 ? (
                        <MenuItem disabled>
                            {t('Устройство микрофона')}
                        </MenuItem>
                    ) : (
                        micOptions.map((opt: MicDeviceOption) => (
                            <MenuItem
                                key={opt.deviceId}
                                selected={opt.deviceId === selectedMic?.deviceId}
                                onClick={() => { handleMicDevicePick(opt.deviceId) }}
                            >
                                {opt.label}
                            </MenuItem>
                        ))
                    )}
                </Menu>
            </div>
        )
        : null

    const stopButton = (
        <Button
            variant="contained"
            size="small"
            color="error"
            onClick={onStopSession}
            startIcon={<Square size={16} />}
            fullWidth={isMobile}
            sx={{ textTransform: 'none', fontWeight: 600 }}
        >
            {t('Завершить звонок')}
        </Button>
    )

    return (
        <div
            className={classNames(cls.CallChrome, {
                [cls.CallChromeMobile]: isMobile,
                [cls.CallChromeMobileConnected]: isMobile && isConnected,
            }, [className])}
        >
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
                                    disabled={!canClickSetup(status) || !selectedAssistant}
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

                {!isMobile && (
                    <div className={cls.primaryActions}>
                        {(isConnected || selectedAssistant) && (
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
                        )}
                        {isConnected && stopButton}
                    </div>
                )}

                {micControl}
            </header>

            <div className={cls.center}>{children}</div>

            {isMobile && isConnected && (
                <div className={cls.stickyBar} data-testid="playground-sticky-bar">
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
                    <div className={cls.stickyStartStop}>{stopButton}</div>
                </div>
            )}
        </div>
    )
})

function canClickSetup (status: PlaygroundSessionStatus): boolean {
    return status !== 'connecting' && status !== 'connected'
}
