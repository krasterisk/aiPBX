import { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import { Play } from 'lucide-react'
import { getRouteAssistantCreate } from '@/shared/const/router'
import { classNames } from '@/shared/lib/classNames/classNames'
import { TranscriptItem } from '../../model/types/transcriptItem'
import {
    CONNECTING_TIMEOUT_MS,
    CallCenterView,
    SessionSummary,
    formatSummaryDuration,
    resolveCallCenterView,
} from '../../model/callCenterState'
import { ConversationPanel } from '../ConversationPanel/ConversationPanel'
import cls from './CallCenter.module.scss'

interface CallCenterProps {
    className?: string
    hasAssistants: boolean
    hasSelectedAssistant: boolean
    status: 'idle' | 'connecting' | 'connected' | 'error'
    hasCompletedSession: boolean
    transcript: TranscriptItem[]
    sessionStartTime: number | null
    analyserNode?: AnalyserNode
    summary: SessionSummary | null
    onCancelConnecting: () => void
    micLostDuringCall?: boolean
    onClearTranscript?: () => void
    onExportTranscript?: () => void
    onConnectingTimeout?: () => void
    onStartSession?: () => void
    startDisabled?: boolean
}

function SummaryStrip (props: { summary: SessionSummary }) {
    const { t } = useTranslation('playground')
    const { summary } = props
    return (
        <div className={cls.summaryStrip}>
            <h2 className={cls.summaryTitle}>{t('Итог теста')}</h2>
            <div className={cls.summaryMetric}>
                <span className={cls.summaryMetricLabel}>{t('Длительность')}</span>
                <span className={cls.summaryMetricValue}>
                    {formatSummaryDuration(summary.durationMs)}
                </span>
            </div>
            <div className={cls.summaryMetric}>
                <span className={cls.summaryMetricLabel}>{t('Ошибки')}</span>
                <span className={cls.summaryMetricValue}>{summary.errorCount}</span>
            </div>
            <div className={cls.summaryMetric}>
                <span className={cls.summaryMetricLabel}>{t('Вызовы инструментов')}</span>
                <span className={cls.summaryMetricValue}>{summary.functionCallCount}</span>
            </div>
        </div>
    )
}

export const CallCenter = memo((props: CallCenterProps) => {
    const {
        className,
        hasAssistants,
        hasSelectedAssistant,
        status,
        hasCompletedSession,
        transcript,
        sessionStartTime,
        analyserNode,
        summary,
        onCancelConnecting,
        micLostDuringCall = false,
        onClearTranscript,
        onExportTranscript,
        onConnectingTimeout,
        onStartSession,
        startDisabled = false,
    } = props

    const { t } = useTranslation('playground')
    const navigate = useNavigate()
    const [connectingTimedOut, setConnectingTimedOut] = useState(false)
    const [expandLastTest, setExpandLastTest] = useState(false)

    const view: CallCenterView = resolveCallCenterView({
        hasAssistants,
        hasSelectedAssistant,
        status,
        hasCompletedSession,
        transcriptLength: transcript.length,
    })

    useEffect(() => {
        if (status !== 'connecting') {
            setConnectingTimedOut(false)
            return
        }
        const timer = window.setTimeout(() => {
            setConnectingTimedOut(true)
            onConnectingTimeout?.()
        }, CONNECTING_TIMEOUT_MS)
        return () => { window.clearTimeout(timer) }
    }, [status, onConnectingTimeout])

    useEffect(() => {
        if (status === 'connected' || status === 'connecting') {
            setExpandLastTest(false)
        }
    }, [status])

    if (view === 'empty') {
        return (
            <div className={classNames(cls.CallCenter, {}, [className, cls.empty])}>
                <h2 className={cls.emptyTitle}>{t('Нет ассистентов')}</h2>
                <p className={cls.emptyBody}>
                    {t('Создайте ассистента, чтобы начать тест голосового сценария.')}
                </p>
                <Button
                    variant="contained"
                    onClick={() => { navigate(getRouteAssistantCreate()) }}
                    sx={{
                        backgroundColor: 'var(--accent-redesigned, #00c8ff)',
                        color: '#0c1214',
                        textTransform: 'none',
                        fontWeight: 600,
                    }}
                >
                    {t('Создать ассистента')}
                </Button>
            </div>
        )
    }

    if (view === 'connecting') {
        return (
            <div className={classNames(cls.CallCenter, {}, [className, cls.connecting])}>
                <span className={cls.connectingLabel}>{t('Подключение…')}</span>
                <div className={cls.progressWrap}>
                    <LinearProgress color="inherit" />
                </div>
                {connectingTimedOut && (
                    <p className={cls.timeoutWarning}>
                        {t('Не удалось подключиться вовремя. Проверьте сеть и попробуйте снова.')}
                    </p>
                )}
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onCancelConnecting}
                    sx={{ textTransform: 'none' }}
                >
                    {t('Отменить подключение')}
                </Button>
            </div>
        )
    }

    if (view === 'connected' || view === 'postCall') {
        return (
            <div className={classNames(cls.CallCenter, {}, [className])}>
                {micLostDuringCall && status === 'connected' && (
                    <div className={cls.micLostBanner} role="alert">
                        {t('Нет доступа к микрофону')}
                    </div>
                )}
                {view === 'postCall' && summary && <SummaryStrip summary={summary} />}
                <div className={cls.transcriptWrap}>
                    <ConversationPanel
                        transcript={transcript}
                        sessionStartTime={sessionStartTime}
                        analyserNode={status === 'connected' ? analyserNode : undefined}
                        onClearTranscript={onClearTranscript}
                        onExportTranscript={onExportTranscript}
                    />
                </div>
            </div>
        )
    }

    // Idle — Start CTA centered in chat panel
    return (
        <div className={classNames(cls.CallCenter, {}, [className, cls.idle])}>
            <div className={cls.idleHero}>
                <Button
                    variant="contained"
                    size="large"
                    disabled={!hasSelectedAssistant || startDisabled}
                    onClick={onStartSession}
                    startIcon={<Play size={22} />}
                    className={cls.startHeroBtn}
                    sx={{
                        backgroundColor: 'var(--accent-redesigned, #00c8ff)',
                        color: '#0c1214',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: 18,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        minWidth: 220,
                        '&:hover': {
                            backgroundColor: 'var(--accent-redesigned, #00c8ff)',
                            filter: 'brightness(0.95)',
                        },
                    }}
                    data-testid="CallCenter.startTest"
                >
                    {t('Начать тест')}
                </Button>
            </div>

            {transcript.length > 0 && (
                <button
                    type="button"
                    className={cls.lastTest}
                    onClick={() => { setExpandLastTest(v => !v) }}
                >
                    {t('Последний тест · {{n}} реплик', { n: transcript.length })}
                </button>
            )}

            {expandLastTest && (
                <div className={cls.transcriptWrap}>
                    <ConversationPanel
                        transcript={transcript}
                        sessionStartTime={sessionStartTime}
                        onClearTranscript={onClearTranscript}
                        onExportTranscript={onExportTranscript}
                    />
                </div>
            )}
        </div>
    )
})
