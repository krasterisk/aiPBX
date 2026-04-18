import { memo, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { PlaygroundEvent, EventCategory, getEventCategory } from '../../model/types/playgroundEvent'
import { SessionMetrics } from '../../model/types/sessionMetrics'
import cls from './DebugPanel.module.scss'
import { useTranslation } from 'react-i18next'

interface DebugPanelProps {
    className?: string
    events: PlaygroundEvent[]
    metrics: SessionMetrics | null
    sessionStartTime: number | null
}

type DebugTab = 'events' | 'metrics'

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
    const { className, events, metrics, sessionStartTime } = props

    const { t } = useTranslation('playground')

    const [activeTab, setActiveTab] = useState<DebugTab>('events')
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
            {/* Tabs */}
            <div className={cls.tabs}>
                <button
                    className={activeTab === 'events' ? cls.tabActive : cls.tab}
                    onClick={() => { setActiveTab('events') }}
                >
                    {t('События')} ({events.length})
                </button>
                <button
                    className={activeTab === 'metrics' ? cls.tabActive : cls.tab}
                    onClick={() => { setActiveTab('metrics') }}
                >
                    {t('Метрики')}
                </button>
            </div>

            <div className={cls.tabContent}>
                {activeTab === 'events' && (
                    <>
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
                    </>
                )}

                {activeTab === 'metrics' && metrics && (
                    <div className={cls.metricsGrid}>
                        <div className={cls.metricCardPrimary}>
                            <span className={cls.metricLabel}>{t('Первый ответ')}</span>
                            <span className={cls.metricValue}>
                                {metrics.firstResponseLatencyMs !== null
                                    ? `${metrics.firstResponseLatencyMs}`
                                    : '—'}
                                <span className={cls.metricUnit}> {t('мс')}</span>
                            </span>
                        </div>
                        <div className={cls.metricCardPrimary}>
                            <span className={cls.metricLabel}>{t('Ср. задержка')}</span>
                            <span className={cls.metricValue}>
                                {metrics.avgResponseLatencyMs || '—'}
                                <span className={cls.metricUnit}> {t('мс')}</span>
                            </span>
                        </div>
                        <div className={cls.metricCard}>
                            <span className={cls.metricLabel}>{t('Реплики')}</span>
                            <span className={cls.metricValue}>{metrics.turnCount}</span>
                        </div>
                        <div className={cls.metricCard}>
                            <span className={cls.metricLabel}>{t('Прерывания')}</span>
                            <span className={cls.metricValue}>{metrics.interruptCount}</span>
                        </div>
                        <div className={cls.metricCard}>
                            <span className={cls.metricLabel}>{t('Входящие токены')}</span>
                            <span className={cls.metricValue}>
                                {metrics.totalTokensIn.toLocaleString()}
                            </span>
                        </div>
                        <div className={cls.metricCard}>
                            <span className={cls.metricLabel}>{t('Исходящие токены')}</span>
                            <span className={cls.metricValue}>
                                {metrics.totalTokensOut.toLocaleString()}
                            </span>
                        </div>
                        <div className={cls.metricCard}>
                            <span className={cls.metricLabel}>{t('Вызовы функций')}</span>
                            <span className={cls.metricValue}>{metrics.functionCallCount}</span>
                        </div>
                        <div className={cls.metricCard}>
                            <span className={cls.metricLabel}>{t('События VAD')}</span>
                            <span className={cls.metricValue}>{metrics.vadEvents.length}</span>
                        </div>

                        {/* Latency sparkline */}
                        {metrics.responseTimes.length > 1 && (
                            <div className={cls.metricCardWide}>
                                <span className={cls.metricLabel}>{t('График задержки ответов')}</span>
                                <svg className={cls.sparkline} viewBox={`0 0 ${metrics.responseTimes.length * 20} 40`}>
                                    <polyline
                                        fill="none"
                                        stroke="var(--accent-redesigned, #60a5fa)"
                                        strokeWidth="2"
                                        points={metrics.responseTimes
                                            .map((v, i) => {
                                                const maxV = Math.max(...metrics.responseTimes, 1)
                                                const x = i * 20 + 10
                                                const y = 38 - (v / maxV) * 34
                                                return `${x},${y}`
                                            })
                                            .join(' ')}
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'metrics' && !metrics && (
                    <div className={cls.metricsEmpty}>
                        {t('Начните сессию для просмотра метрик')}
                    </div>
                )}
            </div>
        </div>
    )
})
