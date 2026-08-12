import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import { useMediaQuery } from '@mui/material'
import { classNames } from '@/shared/lib/classNames/classNames'
import { PlaygroundEvent } from '../../model/types/playgroundEvent'
import { SessionMetrics, VadState } from '../../model/types/sessionMetrics'
import { StatusBar } from '../StatusBar/StatusBar'
import { DebugPanel } from '../DebugPanel/DebugPanel'
import cls from './DebugSheet.module.scss'

interface DebugSheetProps {
    className?: string
    open: boolean
    onClose: () => void
    events: PlaygroundEvent[]
    metrics: SessionMetrics | null
    vadState: VadState
    sessionStartTime: number | null
    status: 'idle' | 'connecting' | 'connected' | 'error'
    model?: string
    pipelineMode?: string
}

export const DebugSheet = memo((props: DebugSheetProps) => {
    const {
        className,
        open,
        onClose,
        events,
        metrics,
        vadState,
        sessionStartTime,
        status,
        model,
        pipelineMode,
    } = props

    const { t } = useTranslation('playground')
    const isMobile = useMediaQuery('(max-width: 899px)')

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            className={classNames(cls.DebugSheet, {}, [className])}
            PaperProps={{
                className: cls.paper,
                sx: {
                    width: { xs: '100%', md: '50%' },
                    maxWidth: '100%',
                },
            }}
            data-testid="DebugSheet"
        >
            <div className={cls.header}>
                <IconButton
                    onClick={onClose}
                    aria-label={String(t('События'))}
                    size="small"
                    className={cls.backBtn}
                >
                    {isMobile ? <ArrowBackIcon /> : <CloseIcon />}
                </IconButton>
                <Typography className={cls.title} component="h2">
                    {t('События')}
                </Typography>
            </div>

            <div className={cls.metrics} data-testid="DebugSheet.metrics">
                <StatusBar
                    status={status}
                    vadState={vadState}
                    metrics={metrics}
                    model={model}
                    pipelineMode={pipelineMode}
                />
            </div>

            <div className={cls.events}>
                <DebugPanel
                    events={events}
                    metrics={metrics}
                    sessionStartTime={sessionStartTime}
                />
            </div>
        </Drawer>
    )
})
