import { memo, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { PlaygroundEvent, EventCategory, getEventCategory } from '../../model/types/playgroundEvent'
import { SessionMetrics } from '../../model/types/sessionMetrics'
import cls from './DebugPanel.module.scss'
import { useTranslation } from 'react-i18next'

interface DebugPanelProps {
    className?: string
    events: PlaygroundEvent[]
    metrics?: SessionMetrics | null
    sessionStartTime: number | null
}

const CATEGORY_DOT: Record<EventCategory, string> = {
    audio: cls.dotAudio,
    transcript: cls.dotTranscript,
    function: cls.dotFunction,
    response: cls.dotResponse,
    session: cls.dotSession,
    error: cls.dotError,
    vad: cls.dotVad,
}

function formatEventTime(ts: number, sessionStart: number | null): string {
    if (!sessionStart) return '00:00.000'
    const diff = ts - sessionStart
    const totalMs = Math.max(0, diff)
    const m = Math.floor(totalMs / 60000)
    const s = Math.floor((totalMs % 60000) / 1000)
    const ms = totalMs % 1000
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`
}

export const DebugPanel = memo((props: DebugPanelProps) => {
    const { className, events, sessionStartTime } = props

    const { t } = useTranslation('playground')

    const [activeFilters, setActiveFilters] = useState<Set<EventCategory>>(
        () => new Set<EventCategory>(['transcript', 'function', 'response', 'session', 'error', 'vad'])
    )
    const [expandedEventIdx, setExpandedEventIdx] = useState<number | null>(null)
    const eventListRef = useRef<HTMLDivElement>(null)

    // Auto-scroll event log
    useEffect(() => {
        if (eventListRef.current) {
            eventListRef.current.scrollTop = eventListRef.current.scrollHeight
        }
    }, [events.length])

    const toggleFilter = useCallback((category: EventCategory) => {
        setActiveFilters(prev => {
            const next = new Set(prev)
            if (next.has(category)) {
                next.delete(category)
            } else {
                next.add(category)
            }
            return next
        })
    }, [])

    const filteredEvents = useMemo(() => {
        return events.filter(e => activeFilters.has(getEventCategory(e.type)))
    }, [events, activeFilters])

    const toggleExpand = useCallback((idx: number) => {
        setExpandedEventIdx(prev => prev === idx ? null : idx)
    }, [])

    const CATEGORY_LABELS: Record<EventCategory, string> = {
        audio: t('Аудио'),
        transcript: t('Текст'),
        function: t('Функции'),
        response: t('Ответы'),
        session: t('Сессия'),
        error: t('Ошибки'),
        vad: 'VAD',
    }

    return (
        <div className={classNames(cls.DebugPanel, {}, [className])}>
            {/* Header: Event counts */}
            <div className={cls.header}>
                <span className={cls.headerTitle}>{t('События')} ({events.length})</span>
            </div>

            <div className={cls.tabContent}>
                {/* Filters */}
                <div className={cls.eventFilter}>
                    {(Object.keys(CATEGORY_LABELS) as EventCategory[]).map(cat => (
                        <button
                            key={cat}
                            className={activeFilters.has(cat) ? cls.filterChipActive : cls.filterChip}
                            onClick={() => { toggleFilter(cat) }}
                        >
                            {CATEGORY_LABELS[cat]}
                        </button>
                    ))}
                </div>

                {/* Event list */}
                <div className={cls.eventList} ref={eventListRef}>
                    {filteredEvents.map((event, idx) => {
                        const category = getEventCategory(event.type)
                        const dotClass = CATEGORY_DOT[category] || cls.dotSession
                        const isExpanded = expandedEventIdx === idx

                        return (
                            <div key={idx}>
                                <div
                                    className={cls.eventItem}
                                    onClick={() => { toggleExpand(idx) }}
                                >
                                    <span className={cls.eventTime}>
                                        {formatEventTime(event.timestamp, sessionStartTime)}
                                    </span>
                                    <span className={classNames(cls.eventDot, {}, [dotClass])} />
                                    <span className={cls.eventType}>
                                        {event.type}
                                    </span>
                                    {event.delta && (
                                        <span className={cls.eventDelta}>
                                            "{event.delta.slice(0, 30)}"
                                        </span>
                                    )}
                                </div>
                                {isExpanded && (
                                    <div className={cls.eventExpanded}>
                                        <pre className={cls.eventJson}>
                                            {JSON.stringify(event._raw, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
})
