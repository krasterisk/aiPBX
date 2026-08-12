import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import { useMediaQuery } from '@mui/material'
import { classNames } from '@/shared/lib/classNames/classNames'
// eslint-disable-next-line krasterisk-plugin/layer-imports -- PlaygroundSession → AssistantSettingsForm (phase 11 A5 / RESEARCH)
import { AssistantSettingsForm } from '@/features/AssistantSettingsForm'
import cls from './SetupSheet.module.scss'

interface SetupSheetProps {
    className?: string
    open: boolean
    onClose: () => void
    autosaveError?: string | null
}

export const SetupSheet = memo((props: SetupSheetProps) => {
    const { className, open, onClose, autosaveError } = props
    const { t } = useTranslation('playground')
    const isMobile = useMediaQuery('(max-width: 899px)')

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            className={classNames(cls.SetupSheet, {}, [className])}
            PaperProps={{
                className: cls.paper,
                sx: {
                    width: { xs: '100%', md: '50%' },
                    maxWidth: '100%',
                },
            }}
            data-testid="SetupSheet"
        >
            <div className={cls.header}>
                <IconButton
                    onClick={onClose}
                    aria-label={String(t('Настройки'))}
                    size="small"
                    className={cls.backBtn}
                >
                    {isMobile ? <ArrowBackIcon /> : <CloseIcon />}
                </IconButton>
                <Typography className={cls.title} component="h2">
                    {t('Настройки')}
                </Typography>
            </div>

            {autosaveError && (
                <div className={cls.error} role="alert" data-testid="SetupSheet.autosaveError">
                    {autosaveError}
                </div>
            )}

            <div className={cls.body}>
                <AssistantSettingsForm mode="edit" />
            </div>
        </Drawer>
    )
})
