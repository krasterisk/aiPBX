import { memo, useCallback, useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { AssistantOptions, useAssistant, assistantFormActions, assistantFormReducer } from '@/entities/Assistants'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
// eslint-disable-next-line krasterisk-plugin/layer-imports
import { playgroundAssistantFormActions } from '@/pages/Playground'
import { usePlaygroundSession } from '../../model/usePlaygroundSession'
import { PlaygroundLayout } from '../PlaygroundLayout/PlaygroundLayout'
import { PlaygroundHeader } from '../PlaygroundHeader/PlaygroundHeader'
import { StatusBar } from '../StatusBar/StatusBar'
import { ConversationPanel } from '../ConversationPanel/ConversationPanel'
import { DebugPanel } from '../DebugPanel/DebugPanel'
import { PlaygroundEvent } from '../../model/types/playgroundEvent'
import { ProcessorState, createInitialProcessorState, processEvent } from '../../lib/eventProcessor'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'

const reducers: ReducersList = {
    assistantForm: assistantFormReducer
}

interface PlaygroundSessionV2Props {
    className?: string
}

export const PlaygroundSessionV2 = memo((props: PlaygroundSessionV2Props) => {
    const { className } = props
    const { t } = useTranslation('playground')
    const dispatch = useDispatch()
    const userData = useSelector(getUserAuthData)
    const admin = useSelector(isUserAdmin)

    // --- Assistant selection ---
    const [selectedAssistant, setSelectedAssistant] = useState<AssistantOptions | null>(null)

    const { data: assistantData } = useAssistant(selectedAssistant?.id || '', {
        skip: !selectedAssistant?.id
    })

    useEffect(() => {
        if (assistantData && selectedAssistant) {
            dispatch(playgroundAssistantFormActions.initForm(assistantData))
            // Also init entity slice — reused components (MainInfoCard, VadSettingsCard, etc.) read from it
            dispatch(assistantFormActions.initEdit(assistantData))
        } else {
            dispatch(playgroundAssistantFormActions.resetForm())
        }
    }, [assistantData, selectedAssistant, dispatch])

    // --- Session hook ---
    const { status, connect, disconnect, updateSession, events, analyserNode } = usePlaygroundSession()

    const isSessionActive = status === 'connected'
    const isConnecting = status === 'connecting'

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
    }, [])

    // --- Transcript actions ---
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
            <PlaygroundLayout
                className={className}
                header={
                    <PlaygroundHeader
                        selectedAssistant={selectedAssistant}
                        onSelectAssistant={handleSelectAssistant}
                        isSessionActive={isSessionActive}
                        isConnecting={isConnecting}
                        onStartSession={handleStartSession}
                        onStopSession={handleStopSession}
                        onUpdateSession={updateSession}
                        userId={userData?.id}
                        isAdmin={admin}
                        hasAssistant={!!(selectedAssistant && assistantData)}
                    />
                }
                conversationPanel={
                    <ConversationPanel
                        transcript={processorState.transcript}
                        sessionStartTime={processorState.metrics.sessionStartTime}
                        analyserNode={analyserNode || undefined}
                        onClearTranscript={handleClearTranscript}
                        onExportTranscript={handleExportTranscript}
                    />
                }
                debugPanel={
                    <DebugPanel
                        events={typedEvents}
                        metrics={processorState.metrics}
                        sessionStartTime={processorState.metrics.sessionStartTime}
                    />
                }
                statusBar={
                    <StatusBar
                        status={status}
                        vadState={processorState.vadState}
                        metrics={processorState.metrics}
                        model={assistantData?.model}
                        pipelineMode={assistantData?.pipelineMode || undefined}
                    />
                }
            />
        </DynamicModuleLoader>
    )
})
