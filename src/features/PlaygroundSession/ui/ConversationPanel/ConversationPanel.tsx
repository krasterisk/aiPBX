import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { classNames } from '@/shared/lib/classNames/classNames'
import { TranscriptItem } from '../../model/types/transcriptItem'
import { TranscriptMessage } from './TranscriptMessage'
import { Download, Trash2, MessageSquare } from 'lucide-react'
import cls from './ConversationPanel.module.scss'

interface ConversationPanelProps {
    className?: string
    transcript: TranscriptItem[]
    sessionStartTime: number | null
    analyserNode?: AnalyserNode
    onClearTranscript?: () => void
    onExportTranscript?: () => void
}

export const ConversationPanel = memo((props: ConversationPanelProps) => {
    const {
        className,
        transcript,
        sessionStartTime,
        analyserNode,
        onClearTranscript,
        onExportTranscript,
    } = props

    const { t } = useTranslation('playground')

    // --- Auto-scroll logic (mirrors Page widget pattern with IntersectionObserver) ---
    const scrollRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const [isAutoScroll, setIsAutoScroll] = useState(true)

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (isAutoScroll && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [transcript.length, isAutoScroll])

    // Detect manual scroll-up to disable auto-scroll
    const handleScroll = useCallback(() => {
        const el = scrollRef.current
        if (!el) return
        const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50
        setIsAutoScroll(isAtBottom)
    }, [])

    const handleScrollToBottom = useCallback(() => {
        setIsAutoScroll(true)
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [])

    const handleCopyMessage = useCallback((text: string) => {
        navigator.clipboard.writeText(text)
    }, [])

    if (transcript.length === 0) {
        return (
            <div className={classNames(cls.ConversationPanel, {}, [className])}>
                <div className={cls.toolbar}>
                    <span className={cls.toolbarTitle}>{t('Транскрипт')}</span>
                </div>
                <div className={cls.emptyState}>
                    <MessageSquare size={48} className={cls.emptyIcon} />
                    <span className={cls.emptyTitle}>{t('Начните сессию')}</span>
                    <span className={cls.emptyDescription}>
                        {t('Выберите ассистента и нажмите «Начать сессию» для тестирования')}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className={classNames(cls.ConversationPanel, {}, [className])}>
            {/* Toolbar */}
            <div className={cls.toolbar}>
                <span className={cls.toolbarTitle}>
                    {t('Транскрипт')} ({transcript.length})
                </span>
                <div className={cls.toolbarActions}>
                    {onExportTranscript && (
                        <button className={cls.toolbarBtn} onClick={onExportTranscript} title={t('Экспорт JSON') || ''}>
                            <Download size={14} />
                            {t('Экспорт')}
                        </button>
                    )}
                    {onClearTranscript && (
                        <button className={cls.toolbarBtn} onClick={onClearTranscript} title={t('Очистить') || ''}>
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Transcript messages */}
            <div className={cls.transcriptWrapper}>
                <div
                    ref={scrollRef}
                    className={cls.transcriptScroll}
                    onScroll={handleScroll}
                >
                    {transcript.map((item) => (
                        <TranscriptMessage
                            key={item.id}
                            item={item}
                            sessionStartTime={sessionStartTime}
                            onCopy={handleCopyMessage}
                        />
                    ))}
                    <div ref={bottomRef} className={cls.scrollAnchor} />
                </div>

                {!isAutoScroll && (
                    <button
                        className={cls.scrollToBottom}
                        onClick={handleScrollToBottom}
                    >
                        ↓ {t('Новые сообщения')}
                    </button>
                )}
            </div>

            {/* Audio visualizer strip */}
            {analyserNode && (
                <div className={cls.visualizerStrip}>
                    <canvas className={cls.visualizerCanvas} />
                </div>
            )}
        </div>
    )
})
