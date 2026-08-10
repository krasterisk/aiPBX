import { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import { useMediaQuery } from '@mui/material'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { PlaygroundEvent } from '../../model/types/playgroundEvent'
import { SessionMetrics, VadState } from '../../model/types/sessionMetrics'
import {
    MicDeviceOption,
    toMicDeviceOptions,
} from '../../model/micDeviceSelect'
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
    /** Session-only mic device id (D-28); null = browser default. */
    micDeviceId?: string | null
    onMicDeviceChange?: (deviceId: string | null) => void
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
        micDeviceId = null,
        onMicDeviceChange,
    } = props

    const { t } = useTranslation('playground')
    const isMobile = useMediaQuery('(max-width: 899px)')
    const [micOptions, setMicOptions] = useState<MicDeviceOption[]>([])

    const enumerateMics = useCallback(async () => {
        if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) {
            setMicOptions([])
            return
        }
        try {
            const devices = await navigator.mediaDevices.enumerateDevices()
            setMicOptions(toMicDeviceOptions(devices))
        } catch {
            setMicOptions([])
        }
    }, [])

    useEffect(() => {
        if (!open) return
        void enumerateMics()
    }, [open, enumerateMics])

    const selectedOption = micOptions.find(o => o.deviceId === micDeviceId) ?? null

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            className={classNames(cls.DebugSheet, {}, [className])}
            PaperProps={{
                className: cls.paper,
                sx: {
                    width: { xs: '100%', sm: 400 },
                    maxWidth: '100%',
                },
            }}
            data-testid="DebugSheet"
        >
            <div className={cls.header}>
                <IconButton
                    onClick={onClose}
                    aria-label={String(t('Открыть события'))}
                    size="small"
                    className={cls.backBtn}
                >
                    {isMobile ? <ArrowBackIcon /> : <CloseIcon />}
                </IconButton>
                <Typography className={cls.title} component="h2">
                    {t('Открыть события')}
                </Typography>
            </div>

            {/* Dense metrics live here only — not in Call chrome (D-12) */}
            <div className={cls.metrics} data-testid="DebugSheet.metrics">
                <StatusBar
                    status={status}
                    vadState={vadState}
                    metrics={metrics}
                    model={model}
                    pipelineMode={pipelineMode}
                />
            </div>

            {/* Power-user mic device select — Debug only (D-28) */}
            {onMicDeviceChange && (
                <div className={cls.micSelect} data-testid="DebugSheet.micSelect">
                    <Combobox
                        size="small"
                        options={micOptions}
                        value={selectedOption}
                        onChange={(_, value: MicDeviceOption | null) => {
                            onMicDeviceChange(value?.deviceId ?? null)
                        }}
                        getOptionLabel={(opt: MicDeviceOption) => opt.label}
                        isOptionEqualToValue={(a: MicDeviceOption, b: MicDeviceOption) =>
                            a.deviceId === b.deviceId
                        }
                        label={String(t('Устройство микрофона'))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('Устройство микрофона')}
                                placeholder={String(t('По умолчанию'))}
                                size="small"
                            />
                        )}
                    />
                </div>
            )}

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
