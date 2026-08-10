import { memo, useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Tooltip from '@mui/material/Tooltip'
import { CheckCircle2, XCircle, Circle, Mic } from 'lucide-react'
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
import { MicChecklistItem } from '../../model/useMicPermission'
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
    micChecklist: MicChecklistItem
    onRetryMic: () => void
    onCancelConnecting: () => void
    micLostDuringCall?: boolean
    modelReady?: boolean
    onClearTranscript?: () => void
    onExportTranscript?: () => void
    onConnectingTimeout?: () => void
}

function ChecklistRow (props: {
    ok: boolean
    pending?: boolean
    label: string
    action?: ReactNode
}) {
    const { ok, pending, label, action } = props
    const Icon = ok ? CheckCircle2 : pending ? Circle : XCircle
    return (
        <div
            className={classNames(cls.checklistItem, {
                [cls.checklistItemOk]: ok,
                [cls.checklistItemBad]: !ok && !pending,
                [cls.checklistItemPending]: !!pending,
            })}
        >
            <Icon size={16} aria-hidden />
            <span>{label}</span>
            {action}
        </div>
    )
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
        micChecklist,
        onRetryMic,
        onCancelConnecting,
        micLostDuringCall = false,
        modelReady = true,
        onClearTranscript,
        onExportTranscript,
        onConnectingTimeout,
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

    // checklist (idle / error recovery) — D-13 / D-14
    const micOk = micChecklist.status === 'ok'
    const micPending = micChecklist.status === 'pending'
    const micLabel = t(micChecklist.labelKey)
    const retryBtn = micChecklist.showRetry
        ? (
            <Button size="small" onClick={onRetryMic} sx={{ textTransform: 'none', ml: 1 }}>
                {t('Повторить проверку')}
            </Button>
            )
        : null

    const micChipColor = micOk ? 'success' : micPending ? 'default' : 'error'

    return (
        <div className={classNames(cls.CallCenter, {}, [className, cls.checklist])}>
            <div className={cls.checklistItems}>
                <Tooltip
                    title={micChecklist.tooltipKey ? t(micChecklist.tooltipKey) : ''}
                    disableHoverListener={!micChecklist.tooltipKey}
                >
                    <div>
                        <ChecklistRow
                            ok={micOk}
                            pending={micPending}
                            label={micLabel}
                            action={retryBtn}
                        />
                    </div>
                </Tooltip>
                <ChecklistRow
                    ok={hasSelectedAssistant}
                    label={t('Ассистент')}
                />
                <ChecklistRow
                    ok={!!modelReady && hasSelectedAssistant}
                    pending={hasSelectedAssistant && !modelReady}
                    label={t('Модель')}
                />
            </div>

            <div className={cls.chips}>
                <Tooltip
                    title={micChecklist.tooltipKey ? t(micChecklist.tooltipKey) : ''}
                    disableHoverListener={!micChecklist.tooltipKey}
                >
                    <Chip
                        size="small"
                        icon={<Mic size={14} />}
                        label={micLabel}
                        color={micChipColor}
                        onClick={micChecklist.showRetry ? onRetryMic : undefined}
                    />
                </Tooltip>
                <Chip
                    size="small"
                    label={t('Ассистент')}
                    color={hasSelectedAssistant ? 'success' : 'default'}
                />
                <Chip
                    size="small"
                    label={t('Модель')}
                    color={modelReady && hasSelectedAssistant ? 'success' : 'default'}
                />
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
