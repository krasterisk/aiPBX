import { memo, useCallback, useMemo, useState } from 'react'
import { TranscriptItem } from '../../model/types/transcriptItem'
import { Wrench, ChevronDown, Copy } from 'lucide-react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ConversationPanel.module.scss'

interface TranscriptMessageProps {
    item: TranscriptItem
    sessionStartTime: number | null
    onCopy?: (text: string) => void
}

/**
 * Format timestamp relative to session start as MM:SS.mmm
 */
function formatRelativeTime(timestamp: number, sessionStart: number | null): string {
    if (!sessionStart) return ''
    const diff = timestamp - sessionStart
    const totalSeconds = Math.floor(diff / 1000)
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Try to format JSON string for display
 */
function formatJson(str: string): string {
    try {
        return JSON.stringify(JSON.parse(str), null, 2)
    } catch {
        return str
    }
}

const roleLabels: Record<string, string> = {
    user: 'User',
    assistant: 'AI',
    function: 'Function',
    system: 'System',
}

export const TranscriptMessage = memo((props: TranscriptMessageProps) => {
    const { item, sessionStartTime, onCopy } = props
    const [isExpanded, setIsExpanded] = useState(false)

    const relativeTime = useMemo(
        () => formatRelativeTime(item.timestamp, sessionStartTime),
        [item.timestamp, sessionStartTime]
    )

    const handleCopy = useCallback(() => {
        const textToCopy = item.role === 'function'
            ? `${item.functionName}(${item.functionArgs || ''})`
            : item.text
        onCopy?.(textToCopy)
    }, [item, onCopy])

    const toggleExpand = useCallback(() => {
        setIsExpanded(prev => !prev)
    }, [])

    // --- Function call card ---
    if (item.role === 'function') {
        return (
            <div className={cls.messageFunction}>
                <div className={cls.meta}>
                    <span className={cls.role}>{roleLabels.function}</span>
                    <span className={cls.time}>{relativeTime}</span>
                </div>
                <div className={cls.functionCard}>
                    <div className={cls.functionHeader} onClick={toggleExpand}>
                        <Wrench size={14} className={cls.functionIcon} />
                        <span className={cls.functionName}>
                            {item.functionName || 'function_call'}
                        </span>
                        {item.isStreaming && <span className={cls.cursor}>▊</span>}
                        <ChevronDown
                            size={14}
                            className={classNames(
                                cls.functionChevron,
                                { [cls.functionChevronOpen]: isExpanded }
                            )}
                        />
                    </div>
                    {isExpanded && (
                        <div className={cls.functionBody}>
                            {item.functionArgs && (
                                <>
                                    <div className={cls.functionLabel}>Arguments</div>
                                    <pre className={cls.functionCode}>
                                        {formatJson(item.functionArgs)}
                                    </pre>
                                </>
                            )}
                            {item.functionResult && (
                                <>
                                    <div className={cls.functionLabel}>Result</div>
                                    <pre className={cls.functionCode}>
                                        {formatJson(item.functionResult)}
                                    </pre>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // --- System message (errors) ---
    if (item.role === 'system') {
        return (
            <div className={cls.messageSystem}>
                <div className={cls.bubbleSystem}>{item.text}</div>
            </div>
        )
    }

    // --- User / Assistant messages ---
    const messageClass = item.role === 'user' ? cls.messageUser : cls.messageAssistant
    const bubbleClass = item.role === 'user' ? cls.bubbleUser : cls.bubbleAssistant

    return (
        <div className={messageClass}>
            <div className={cls.meta}>
                <span className={cls.role}>{roleLabels[item.role] || item.role}</span>
                <span className={cls.time}>{relativeTime}</span>
                <Copy
                    size={12}
                    style={{ cursor: 'pointer', opacity: 0.4 }}
                    onClick={handleCopy}
                />
            </div>
            <div className={bubbleClass} onClick={handleCopy}>
                {item.text || (item.isStreaming ? '' : '...')}
                {item.isStreaming && <span className={cls.cursor}>▊</span>}
            </div>
        </div>
    )
})
