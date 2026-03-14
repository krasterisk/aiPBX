import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { LinearProgress } from '@mui/material'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import CloseIcon from '@mui/icons-material/Close'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import cls from './BatchProgressBar.module.scss'
import type { SingleBatchState } from '../../lib/useBatchProgress'

interface BatchProgressBarProps {
    batches: SingleBatchState[]
    /** Aggregated */
    progress: number
    completed: number
    failed: number
    total: number
    onDismiss: () => void
}

export const BatchProgressBar = memo((props: BatchProgressBarProps) => {
    const { batches, progress, completed, failed, total, onDismiss } = props
    const { t } = useTranslation('reports')
    const done = completed + failed
    const allFinished = batches.length > 0 && batches.every(b => b.finished)

    return (
        <div className={cls.wrapper}>
            <HStack max justify="between" align="center" gap="12">
                <HStack gap="8" align="center" className={cls.info}>
                    {allFinished
                        ? <CheckCircleOutlineIcon fontSize="small" className={cls.doneIcon} />
                        : <AutorenewIcon fontSize="small" className={cls.spinner} />
                    }
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
                    {batches.length > 1 && (
                        // eslint-disable-next-line i18next/no-literal-string
                        <Text
                            text={`(${batches.length})`}
                            size="s"
                            className={cls.count}
                        />
                    )}
                </HStack>

                <Button
                    variant="clear"
                    onClick={onDismiss}
                    className={cls.closeBtn}
                >
                    <CloseIcon fontSize="small" />
                </Button>
            </HStack>

            {batches.length <= 1 ? (
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
                            background: allFinished
                                ? 'linear-gradient(90deg, #4caf50, #66bb6a)'
                                : 'linear-gradient(90deg, #7c4dff, #448aff)'
                        }
                    }}
                />
            ) : (
                <VStack gap="4" max className={cls.multiBar}>
                    {batches.map(b => (
                        <LinearProgress
                            key={b.batchId}
                            variant="determinate"
                            value={b.progress}
                            sx={{
                                height: 3,
                                borderRadius: 2,
                                backgroundColor: 'rgba(255,255,255,0.06)',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 2,
                                    background: b.finished
                                        ? 'linear-gradient(90deg, #4caf50, #66bb6a)'
                                        : 'linear-gradient(90deg, #7c4dff, #448aff)'
                                }
                            }}
                        />
                    ))}
                </VStack>
            )}
        </div>
    )
})
