import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { LinearProgress } from '@mui/material'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import CloseIcon from '@mui/icons-material/Close'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import cls from './BatchProgressBar.module.scss'

interface BatchProgressBarProps {
    progress: number
    completed: number
    failed: number
    total: number
    onDismiss: () => void
}

export const BatchProgressBar = memo((props: BatchProgressBarProps) => {
    const { progress, completed, failed, total, onDismiss } = props
    const { t } = useTranslation('reports')
    const done = completed + failed
    const isFinished = progress >= 100

    return (
        <div className={cls.wrapper}>
            <HStack max justify="between" align="center" gap="12">
                <HStack gap="8" align="center" className={cls.info}>
                    {!isFinished && (
                        <AutorenewIcon fontSize="small" className={cls.spinner} />
                    )}
                    <Text
                        text={String(t('Обработка файлов'))}
                        bold
                        size="s"
                    />
                    {/* eslint-disable-next-line i18next/no-literal-string */}
                    <Text
                        text={`${done} / ${total}`}
                        size="s"
                        className={cls.count}
                    />
                    {/* eslint-disable-next-line i18next/no-literal-string */}
                    <Text
                        text={`${Math.round(progress)}%`}
                        bold
                        size="s"
                        className={cls.percent}
                    />
                </HStack>

                <Button
                    variant="clear"
                    onClick={onDismiss}
                    className={cls.closeBtn}
                >
                    <CloseIcon fontSize="small" />
                </Button>
            </HStack>

            <LinearProgress
                variant="determinate"
                value={progress}
                className={cls.bar}
                sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                        borderRadius: 2,
                        background: isFinished
                            ? 'linear-gradient(90deg, #4caf50, #66bb6a)'
                            : 'linear-gradient(90deg, #7c4dff, #448aff)'
                    }
                }}
            />
        </div>
    )
})
