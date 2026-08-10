import { memo, useCallback, useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { toast } from 'react-toastify'
import {
    AssistantOptions,
    useAssistant,
    useAssistantsAll,
    assistantFormActions,
    assistantFormReducer,
} from '@/entities/Assistants'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { usePlaygroundSession, DisconnectInfo } from '../../model/usePlaygroundSession'
import { CallChrome } from '../CallChrome/CallChrome'
import { CallCenter } from '../CallCenter/CallCenter'
import { SetupSheet } from '../SetupSheet/SetupSheet'
import { DebugSheet } from '../DebugSheet/DebugSheet'
import { PlaygroundEvent } from '../../model/types/playgroundEvent'
import { ProcessorState, createInitialProcessorState, processEvent } from '../../lib/eventProcessor'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import {
    PlaygroundMode,
    modeAfterAssistantSelect,
    resolveModeTransition,
} from '../../model/playgroundMode'
import { buildSessionSummary, SessionSummary } from '../../model/callCenterState'
import { useMicPermission } from '../../model/useMicPermission'
import { useAutosaveAssistant } from '../../model/useAutosaveAssistant'
import { resolveMicDeviceIdForConnect } from '../../model/micDeviceSelect'

const reducers: ReducersList = {
    assistantForm: assistantFormReducer
}

interface PlaygroundSessionV2Props {
    className?: string
    preselectedAssistantId?: string
    onSessionDisconnect?: (info: DisconnectInfo) => void
    /** Onboarding assistants path — Setup/Debug subdued (D-22/D-23). */
    secondaryChrome?: boolean
}

export const PlaygroundSessionV2 = memo((props: PlaygroundSessionV2Props) => {
    const { className, preselectedAssistantId, onSessionDisconnect, secondaryChrome = false } = props
    const { t } = useTranslation('playground')
    const dispatch = useDispatch()
    const userData = useSelector(getUserAuthData)
    const admin = useSelector(isUserAdmin)

    // --- Mode (Call-first; Setup/Debug closed by default) ---
    const [mode, setMode] = useState<PlaygroundMode>('call')

    // Session-only mic device (D-28) — Debug sheet; no localStorage
    const [micDeviceId, setMicDeviceId] = useState<string | null>(null)

    // --- Assistant selection ---
    const [selectedAssistant, setSelectedAssistant] = useState<AssistantOptions | null>(null)

    const { data: assistantsList } = useAssistantsAll({
        userId: admin ? undefined : userData?.id,
    })
    const hasAssistants = (assistantsList?.length ?? 0) > 0

    const { data: assistantData } = useAssistant(selectedAssistant?.id || '', {
        skip: !selectedAssistant?.id
    })

    const { data: preselectedAssistantData } = useAssistant(preselectedAssistantId || '', {
        skip: !preselectedAssistantId
    })

    useEffect(() => {
        if (!preselectedAssistantId || !preselectedAssistantData?.id || selectedAssistant) return
        setSelectedAssistant({
            id: preselectedAssistantData.id,
            name: preselectedAssistantData.name || preselectedAssistantId
        })
        setMode(modeAfterAssistantSelect())
    }, [preselectedAssistantId, preselectedAssistantData, selectedAssistant])

    useEffect(() => {
        if (assistantData && selectedAssistant) {
            dispatch(assistantFormActions.initEdit(assistantData))
        } else {
            dispatch(assistantFormActions.resetForm())
        }
    }, [assistantData, selectedAssistant, dispatch])

    // --- Autosave (D-05 / D-06 / D-42) ---
    const { autosave } = useAutosaveAssistant()
    const autosaveRef = useRef(autosave)
    autosaveRef.current = autosave
    const [autosaveError, setAutosaveError] = useState<string | null>(null)
    const modeRef = useRef(mode)
    modeRef.current = mode

    // Silent autosave on unmount during Setup (D-42) — no beforeunload
    useEffect(() => {
        return () => {
            if (modeRef.current === 'setup') {
                void autosaveRef.current()
            }
        }
    }, [])

    // --- Mic checklist (D-25…D-27) — probe when assistant selected / Call entered ---
    const micEnabled = !!selectedAssistant
    const { checklist: micChecklist, startDisabled: micStartDisabled, retry: retryMic } = useMicPermission({
        enabled: micEnabled,
    })

    // --- Session hook stays mounted across mode toggles (RESEARCH Pitfall 1) ---
    const handleSessionError = useCallback((error: string) => {
        if (error === 'microphone_lost') return
        toast.error(t('Ошибка соединения. Подробности — в «События».'))
    }, [t])

    const handleMicLost = useCallback(() => {
        toast.error(t('Нет доступа к микрофону'))
    }, [t])

    const {
        status,
        connect,
        disconnect,
        events,
        analyserNode,
        muted,
        setMuted,
        volume,
        setVolume,
        micLostDuringCall,
    } = usePlaygroundSession({
        onDisconnect: onSessionDisconnect,
        onError: handleSessionError,
        onMicLost: handleMicLost,
    })

    // --- Event processor ---
    const processorRef = useRef<ProcessorState>(createInitialProcessorState())
    const [processorState, setProcessorState] = useState<ProcessorState>(createInitialProcessorState())
    const lastProcessedCountRef = useRef(0)
    const [typedEvents, setTypedEvents] = useState<PlaygroundEvent[]>([])
    const [hasCompletedSession, setHasCompletedSession] = useState(false)
    const [lastSummary, setLastSummary] = useState<SessionSummary | null>(null)
    const [postCallElapsedSeconds, setPostCallElapsedSeconds] = useState(0)
    const connectedStartedAtRef = useRef<number | null>(null)
    const [pendingAssistant, setPendingAssistant] = useState<AssistantOptions | null | undefined>(undefined)

    useEffect(() => {
        if (status === 'connected') {
            connectedStartedAtRef.current = Date.now()
        }
    }, [status])

    useEffect(() => {
        if (events.length <= lastProcessedCountRef.current) {
            if (events.length === 0 && lastProcessedCountRef.current > 0) {
                // New connect clears events — reset processor for live session
                processorRef.current = createInitialProcessorState()
                lastProcessedCountRef.current = 0
                setProcessorState(createInitialProcessorState())
                setTypedEvents([])
            }
            return
        }

        const newRawEvents = events.slice(lastProcessedCountRef.current)
        lastProcessedCountRef.current = events.length

        const newTypedEvents: PlaygroundEvent[] = newRawEvents.map(raw => ({
            type: raw.type || 'error',
            timestamp: Date.now(),
            item_id: raw.item_id,
            response_id: raw.response_id,
            delta: raw.delta,
            transcript: raw.transcript,
            item: raw.item,
            error: raw.error,
            usage: raw.usage,
            name: raw.name,
            call_id: raw.call_id,
            _raw: raw,
        }))

        setTypedEvents(prev => {
            const next = [...prev, ...newTypedEvents]
            if (next.length > 2000) return next.slice(next.length - 2000)
            return next
        })

        let state = processorRef.current
        for (const event of newTypedEvents) {
            state = processEvent(state, event)
        }
        processorRef.current = state
        setProcessorState({ ...state })
    }, [events])

    // Capture post-call summary on hangup (D-16)
    const prevStatusRef = useRef(status)
    useEffect(() => {
        const prev = prevStatusRef.current
        prevStatusRef.current = status
        if (prev === 'connected' && status === 'idle') {
            const started = connectedStartedAtRef.current
            const durationMs = started ? Date.now() - started : 0
            connectedStartedAtRef.current = null
            setPostCallElapsedSeconds(Math.floor(durationMs / 1000))
            setLastSummary(buildSessionSummary({
                durationMs,
                errorCount: processorRef.current.metrics.errorCount,
                functionCallCount: processorRef.current.metrics.functionCallCount,
            }))
            setHasCompletedSession(true)
        }
        if (prev === 'connecting' && status === 'error') {
            toast.error(t('Ошибка соединения. Подробности — в «События».'))
        }
    }, [status, t])

    // --- Session controls ---
    const handleStartSession = useCallback(async () => {
        if (!selectedAssistant) return

        const ok = await autosave()
        if (!ok) {
            setAutosaveError(t('Не удалось сохранить настройки. Исправьте ошибки и попробуйте снова.'))
            setMode('setup')
            return
        }
        setAutosaveError(null)

        processorRef.current = createInitialProcessorState()
        processorRef.current.metrics.sessionStartTime = Date.now()
        lastProcessedCountRef.current = 0
        setProcessorState(createInitialProcessorState())
        setTypedEvents([])
        setHasCompletedSession(false)
        setLastSummary(null)
        connect(selectedAssistant.id, resolveMicDeviceIdForConnect(micDeviceId))
    }, [autosave, connect, micDeviceId, selectedAssistant, t])

    const handleStopSession = useCallback(() => {
        disconnect()
    }, [disconnect])

    const applyAssistantSelection = useCallback((value: AssistantOptions | null) => {
        setSelectedAssistant(value)
        if (value) {
            setMode(modeAfterAssistantSelect())
        }
        // Clear prior transcript/history on confirmed switch (D-37)
        processorRef.current = createInitialProcessorState()
        lastProcessedCountRef.current = 0
        setProcessorState(createInitialProcessorState())
        setTypedEvents([])
        setHasCompletedSession(false)
        setLastSummary(null)
    }, [])

    const handleSelectAssistant = useCallback((_: any, value: AssistantOptions | null) => {
        if (status === 'connected') return

        const hasHistory = processorState.transcript.length > 0 || hasCompletedSession
        const isSwitch = !!selectedAssistant && value?.id !== selectedAssistant.id

        if (hasHistory && isSwitch) {
            setPendingAssistant(value)
            return
        }

        applyAssistantSelection(value)
    }, [
        status,
        processorState.transcript.length,
        hasCompletedSession,
        selectedAssistant,
        applyAssistantSelection,
    ])

    const handleConfirmSwitch = useCallback(() => {
        if (pendingAssistant === undefined) return
        applyAssistantSelection(pendingAssistant)
        setPendingAssistant(undefined)
    }, [pendingAssistant, applyAssistantSelection])

    const handleDismissSwitch = useCallback(() => {
        setPendingAssistant(undefined)
    }, [])

    const handleOpenSetup = useCallback(() => {
        setMode(prev => resolveModeTransition(prev, 'setup', status))
    }, [status])

    const handleOpenDebug = useCallback(() => {
        setMode(prev => resolveModeTransition(prev, 'debug', status))
    }, [status])

    const handleCloseSetup = useCallback(async () => {
        const ok = await autosave()
        if (!ok) {
            setAutosaveError(t('Не удалось сохранить настройки. Исправьте ошибки и попробуйте снова.'))
            setMode('setup')
            return
        }
        setAutosaveError(null)
        setMode('call')
    }, [autosave, t])

    const handleCloseOverlay = useCallback(() => {
        setMode('call')
    }, [])

    const handleClearTranscript = useCallback(() => {
        processorRef.current = { ...processorRef.current, transcript: [] }
        setProcessorState(prev => ({ ...prev, transcript: [] }))
    }, [])

    const handleExportTranscript = useCallback(() => {
        const exportData = {
            assistantId: selectedAssistant?.id,
            assistantName: selectedAssistant?.name,
            startTime: processorState.metrics.sessionStartTime,
            endTime: Date.now(),
            transcript: processorState.transcript,
            events: typedEvents,
            metrics: processorState.metrics,
        }
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `playground-session-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
    }, [selectedAssistant, processorState, typedEvents])

    const handleToggleMute = useCallback(() => {
        setMuted(!muted)
    }, [muted, setMuted])

    const modelReady = !!(assistantData?.model)

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
            <CallChrome
                className={className}
                selectedAssistant={selectedAssistant}
                onSelectAssistant={handleSelectAssistant}
                status={status === 'error' ? 'error' : status}
                onStartSession={handleStartSession}
                onStopSession={handleStopSession}
                onOpenSetup={handleOpenSetup}
                onOpenDebug={handleOpenDebug}
                userId={userData?.id}
                isAdmin={admin}
                secondaryChrome={secondaryChrome}
                startDisabled={micStartDisabled}
                showPostCallTimer={hasCompletedSession && status === 'idle'}
                postCallElapsedSeconds={postCallElapsedSeconds}
                muted={muted}
                volume={volume}
                onToggleMute={handleToggleMute}
                onVolumeChange={setVolume}
            >
                <CallCenter
                    hasAssistants={hasAssistants}
                    hasSelectedAssistant={!!selectedAssistant}
                    status={status}
                    hasCompletedSession={hasCompletedSession}
                    transcript={processorState.transcript}
                    sessionStartTime={processorState.metrics.sessionStartTime}
                    analyserNode={analyserNode || undefined}
                    summary={lastSummary}
                    micChecklist={micChecklist}
                    onRetryMic={retryMic}
                    onCancelConnecting={handleStopSession}
                    micLostDuringCall={micLostDuringCall}
                    modelReady={modelReady}
                    onClearTranscript={handleClearTranscript}
                    onExportTranscript={handleExportTranscript}
                />
            </CallChrome>

            <SetupSheet
                open={mode === 'setup'}
                onClose={handleCloseSetup}
                autosaveError={autosaveError}
            />

            <DebugSheet
                open={mode === 'debug'}
                onClose={handleCloseOverlay}
                events={typedEvents}
                metrics={processorState.metrics}
                vadState={processorState.vadState}
                sessionStartTime={processorState.metrics.sessionStartTime}
                status={status === 'error' ? 'error' : status}
                model={assistantData?.model}
                pipelineMode={assistantData?.pipelineMode ?? undefined}
                micDeviceId={micDeviceId}
                onMicDeviceChange={setMicDeviceId}
            />
            {/* Assistant switch confirm (D-37) */}
            <Dialog
                open={pendingAssistant !== undefined}
                onClose={handleDismissSwitch}
            >
                <DialogTitle>{t('Сменить ассистента?')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('Сменить ассистента: история текущего теста будет очищена. Продолжить?')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDismissSwitch} sx={{ textTransform: 'none' }}>
                        {t('Оставить текущего')}
                    </Button>
                    <Button onClick={handleConfirmSwitch} color="error" sx={{ textTransform: 'none' }} autoFocus>
                        {t('Сменить ассистента')}
                    </Button>
                </DialogActions>
            </Dialog>
        </DynamicModuleLoader>
    )
})
