import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Card } from '@/shared/ui/redesigned/Card'
import { Skeleton } from '@mui/material'
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { AllReports } from '@/entities/Report'
import { CallsTable } from '../CallsTable/CallsTable'
import cls from './CallsList.module.scss'

interface CallsListProps {
    reports?: AllReports
    isLoading?: boolean
    sortField?: string
    sortOrder?: 'ASC' | 'DESC'
    onChangeSort: (field: string) => void
    onUpload: () => void
}

export const CallsList = memo((props: CallsListProps) => {
    const { reports, isLoading, sortField, sortOrder, onChangeSort, onUpload } = props
    const { t } = useTranslation('reports')
    const rows = reports?.rows ?? []

    return (
        <VStack gap="16" max>
            {rows.length > 0 && (
                <CallsTable
                    reports={rows}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onChangeSort={onChangeSort}
                />
            )}

            {!isLoading && rows.length === 0 && (
                <Card padding="48" max border="partial" variant="glass">
                    <VStack max align="center" justify="center" gap="16">
                        <HeadsetMicIcon sx={{ fontSize: 56, color: 'var(--icon-redesigned)', opacity: 0.4 }} />
                        <Text align="center" title={String(t('Нет данных'))} />
                        <Text align="center" text={String(t('Загрузите аудио или совершите звонок ботом'))} />
                        <Button
                            variant="glass-action"
                            addonLeft={<UploadFileIcon fontSize="small" />}
                            onClick={onUpload}
                        >
                            {String(t('Загрузить звонок'))}
                        </Button>
                    </VStack>
                </Card>
            )}

            {isLoading && (
                <VStack gap="12" max>
                    {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} variant="rounded" height={64} className={cls.skeleton} />
                    ))}
                </VStack>
            )}
        </VStack>
    )
})
