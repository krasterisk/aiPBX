import { memo, useCallback, useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Drawer from '@mui/material/Drawer'
import { AssistantOptions, useAssistant, assistantFormActions, assistantFormReducer } from '@/entities/Assistants'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
// eslint-disable-next-line krasterisk-plugin/layer-imports
import { playgroundAssistantFormActions } from '@/pages/Playground'
import { usePlaygroundSession, DisconnectInfo } from '../../model/usePlaygroundSession'
import { CallChrome } from '../CallChrome/CallChrome'
import { ConversationPanel } from '../ConversationPanel/ConversationPanel'
import { PlaygroundEvent } from '../../model/types/playgroundEvent'
import { ProcessorState, createInitialProcessorState, processEvent } from '../../lib/eventProcessor'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import {
    PlaygroundMode,
    modeAfterAssistantSelect,
    resolveModeTransition,
} from '../../model/playgroundMode'
import callChromeCls from '../CallChrome/CallChrome.module.scss'

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

    // --- Assistant selection ---
    const [selectedAssistant, setSelectedAssistant] = useState<AssistantOptions | null>(null)

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
            dispatch(playgroundAssistantFormActions.initForm(assistantData))
            dispatch(assistantFormActions.initEdit(assistantData))
        } else {
            dispatch(playgroundAssistantFormActions.resetForm())
        }
    }, [assistantData, selectedAssistant, dispatch])

    // --- Session hook stays mounted across mode toggles (RESEARCH Pitfall 1) ---
    const { status, connect, disconnect, events, analyserNode } = usePlaygroundSession({
        onDisconnect: onSessionDisconnect
    })

    // --- Event processor ---
    const processorRef = useRef<ProcessorState>(createInitialProcessorState())
    const [processorState, setProcessorState] = useState<ProcessorState>(createInitialProcessorState())
    const lastProcessedCountRef = useRef(0)
    const [typedEvents, setTypedEvents] = useState<PlaygroundEvent[]>([])

    useEffect(() => {
        if (events.length <= lastProcessedCountRef.current) {
            if (events.length === 0 && lastProcessedCountRef.current > 0) {
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

    // --- Session controls ---
    const handleStartSession = useCallback(() => {
        if (selectedAssistant) {
            processorRef.current = createInitialProcessorState()
            processorRef.current.metrics.sessionStartTime = Date.now()
            lastProcessedCountRef.current = 0
            setProcessorState(createInitialProcessorState())
            setTypedEvents([])
            connect(selectedAssistant.id)
        }
    }, [connect, selectedAssistant])

    const handleStopSession = useCallback(() => {
        disconnect()
    }, [disconnect])

    const handleSelectAssistant = useCallback((_: any, value: AssistantOptions | null) => {
        setSelectedAssistant(value)
        if (value) {
            setMode(modeAfterAssistantSelect())
        }
    }, [])

    const handleOpenSetup = useCallback(() => {
        setMode(prev => resolveModeTransition(prev, 'setup', status))
    }, [status])

    const handleOpenDebug = useCallback(() => {
        setMode(prev => resolveModeTransition(prev, 'debug', status))
    }, [status])

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

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
            <CallChrome
                className={className}
                selectedAssistant={selectedAssistant}
                onSelectAssistant={handleSelectAssistant}
                status={status}
                onStartSession={handleStartSession}
                onStopSession={handleStopSession}
                onOpenSetup={handleOpenSetup}
                onOpenDebug={handleOpenDebug}
                userId={userData?.id}
                isAdmin={admin}
                secondaryChrome={secondaryChrome}
            >
                <ConversationPanel
                    transcript={processorState.transcript}
                    sessionStartTime={processorState.metrics.sessionStartTime}
                    analyserNode={analyserNode || undefined}
                    onClearTranscript={handleClearTranscript}
                    onExportTranscript={handleExportTranscript}
                />
            </CallChrome>

            {/* Setup stub drawer — full form lands in 11-02; closed by default (D-09/D-10) */}
            <Drawer
                anchor="right"
                open={mode === 'setup'}
                onClose={handleCloseOverlay}
                PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, maxWidth: '100%' } }}
            >
                <div className={callChromeCls.drawerBody}>
                    <h2 className={callChromeCls.drawerTitle}>{t('Открыть настройки')}</h2>
                    <p className={callChromeCls.drawerStub}>{t('Параметры')}</p>
                </div>
            </Drawer>

            {/* Debug stub drawer — Events sheet lands in 11-03; closed by default (D-09/D-10) */}
            <Drawer
                anchor="right"
                open={mode === 'debug'}
                onClose={handleCloseOverlay}
                PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, maxWidth: '100%' } }}
            >
                <div className={callChromeCls.drawerBody}>
                    <h2 className={callChromeCls.drawerTitle}>{t('Открыть события')}</h2>
                    <p className={callChromeCls.drawerStub}>{t('События')}</p>
                </div>
            </Drawer>
        </DynamicModuleLoader>
    )
})
