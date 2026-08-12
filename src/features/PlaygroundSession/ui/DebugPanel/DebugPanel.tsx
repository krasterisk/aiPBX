import { memo, useCallback, useMemo, useRef, useState, useEffect, type MouseEvent } from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { classNames } from '@/shared/lib/classNames/classNames'
import { PlaygroundEvent, EventCategory, getEventCategory } from '../../model/types/playgroundEvent'
import { SessionMetrics } from '../../model/types/sessionMetrics'
import { createDefaultDebugFilters } from '../../model/debugFilters'
import cls from './DebugPanel.module.scss'
import { useTranslation } from 'react-i18next'

interface DebugPanelProps {
    className?: string
    events: PlaygroundEvent[]
    metrics?: SessionMetrics | null
    sessionStartTime: number | null
}

const CATEGORY_ORDER: EventCategory[] = [
    'audio',
    'transcript',
    'function',
    'response',
    'session',
    'error',
    'vad',
]

const CATEGORY_DOT: Record<EventCategory, string> = {
    audio: cls.dotAudio,
    transcript: cls.dotTranscript,
    function: cls.dotFunction,
    response: cls.dotResponse,
    session: cls.dotSession,
    error: cls.dotError,
    vad: cls.dotVad,
}

function formatEventTime (ts: number, sessionStart: number | null): string {
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

    const [activeFilters, setActiveFilters] = useState<EventCategory[]>(
        () => Array.from(createDefaultDebugFilters())
    )
    const [expandedEventIdx, setExpandedEventIdx] = useState<number | null>(null)
    const eventListRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (eventListRef.current) {
            eventListRef.current.scrollTop = eventListRef.current.scrollHeight
        }
    }, [events.length])

    const handleFiltersChange = useCallback((
        _: MouseEvent<HTMLElement>,
        next: EventCategory[],
    ) => {
        // Keep at least one filter so the list never goes blank accidentally
        if (next.length === 0) return
        setActiveFilters(next)
        setExpandedEventIdx(null)
    }, [])

    const filterSet = useMemo(() => new Set(activeFilters), [activeFilters])

    const filteredEvents = useMemo(() => {
        return events.filter(e => filterSet.has(getEventCategory(e.type)))
    }, [events, filterSet])

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
            <div className={cls.header}>
                <span className={cls.headerTitle}>{t('События')} ({events.length})</span>
            </div>

            <div className={cls.tabContent}>
                <div className={cls.eventFilter}>
                    <ToggleButtonGroup
                        value={activeFilters}
                        onChange={handleFiltersChange}
                        size="small"
                        aria-label={String(t('События'))}
                        className={cls.filterGroup}
                    >
                        {CATEGORY_ORDER.map(cat => (
                            <ToggleButton
                                key={cat}
                                value={cat}
                                aria-label={CATEGORY_LABELS[cat]}
                                className={cls.filterToggle}
                            >
                                <span className={classNames(cls.filterDot, {}, [CATEGORY_DOT[cat]])} />
                                {CATEGORY_LABELS[cat]}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </div>

                <div className={cls.eventList} ref={eventListRef}>
                    {filteredEvents.length === 0 && (
                        <div className={cls.eventEmpty}>{t('Нет событий')}</div>
                    )}
                    {filteredEvents.map((event, idx) => {
                        const category = getEventCategory(event.type)
                        const dotClass = CATEGORY_DOT[category] || cls.dotSession
                        const isExpanded = expandedEventIdx === idx

                        return (
                            <div
                                key={`${event.timestamp}-${event.type}-${idx}`}
                                className={classNames(cls.eventBlock, {
                                    [cls.eventBlockExpanded]: isExpanded,
                                })}
                            >
                                <button
                                    type="button"
                                    className={cls.eventItem}
                                    onClick={() => { toggleExpand(idx) }}
                                    aria-expanded={isExpanded}
                                >
                                    <span className={cls.eventTime}>
                                        {formatEventTime(event.timestamp, sessionStartTime)}
                                    </span>
                                    <span className={classNames(cls.eventDot, {}, [dotClass])} />
                                    <span className={cls.eventMain}>
                                        <span className={cls.eventType}>{event.type}</span>
                                        {event.delta && (
                                            <span className={cls.eventDelta}>
                                                {event.delta.slice(0, 80)}
                                            </span>
                                        )}
                                    </span>
                                </button>
                                {isExpanded && (
                                    <pre className={cls.eventJson}>
                                        {JSON.stringify(event._raw, null, 2)}
                                    </pre>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
})
