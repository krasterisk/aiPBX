import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VadState, SessionMetrics } from '../../model/types/sessionMetrics'
import cls from './StatusBar.module.scss'

interface StatusBarProps {
    className?: string
    status: 'idle' | 'connecting' | 'connected' | 'error'
    vadState: VadState
    metrics: SessionMetrics | null
    model?: string
    pipelineMode?: string
}

export const StatusBar = memo((props: StatusBarProps) => {
    const {
        className,
        status,
        vadState,
        metrics,
        model,
        pipelineMode,
    } = props

    const { t } = useTranslation('playground')

    const connectionDotClass = useMemo(() => {
        switch (status) {
            case 'connected': return cls.dotConnected
            case 'connecting': return cls.dotIdle
            case 'error': return cls.dotError
            default: return cls.dotIdle
        }
    }, [status])

    const connectionLabel = useMemo(() => {
        switch (status) {
            case 'connected': return t('Подключено')
            case 'connecting': return t('Подключение...')
            case 'error': return t('Ошибка')
            default: return t('Отключено')
        }
    }, [status, t])

    const vadDotClass = useMemo(() => {
        switch (vadState) {
            case 'listening': return cls.dotListening
            case 'speaking': return cls.dotSpeaking
            default: return cls.dotIdle
        }
    }, [vadState])

    const vadLabel = useMemo(() => {
        switch (vadState) {
            case 'listening': return `VAD: ${t('Слушает')}`
            case 'speaking': return `VAD: ${t('Говорит')}`
            default: return `VAD: ${t('Ожидание')}`
        }
    }, [vadState, t])

    return (
        <div className={classNames(cls.StatusBar, {}, [className])}>
            <div className={cls.leftSection}>
                <span className={cls.statusItem}>
                    <span className={classNames(cls.dot, {}, [connectionDotClass])} />
                    {connectionLabel}
                </span>

                {status === 'connected' && (
                    <>
                        <span className={cls.separator} />
                        <span className={cls.statusItem}>
                            <span className={classNames(cls.dot, {}, [vadDotClass])} />
                            {vadLabel}
                        </span>
                    </>
                )}

                {model && (
                    <>
                        <span className={cls.separator} />
                        <span className={cls.statusItem}>
                            {model}
                        </span>
                    </>
                )}

                {pipelineMode && (
                    <>
                        <span className={cls.separator} />
                        <span className={cls.statusItem}>
                            {pipelineMode}
                        </span>
                    </>
                )}
            </div>

            {metrics && status === 'connected' && (
                <div className={cls.rightSection}>
                    {metrics.firstResponseLatencyMs !== null && (
                        <span className={cls.statusItem}>
                            {t('Задержка')}: {metrics.avgResponseLatencyMs}{t('мс')}
                        </span>
                    )}
                    {(metrics.totalTokensIn > 0 || metrics.totalTokensOut > 0) && (
                        <>
                            <span className={cls.separator} />
                            <span className={cls.statusItem}>
                                {t('Токены')}: {metrics.totalTokensIn + metrics.totalTokensOut}
                            </span>
                        </>
                    )}
                    <span className={cls.separator} />
                    <span className={cls.statusItem}>
                        {t('Реплики')}: {metrics.turnCount}
                    </span>
                </div>
            )}
        </div>
    )
})
