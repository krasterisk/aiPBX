import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mui/material'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Check } from '@/shared/ui/mui/Check'
import { ClientSelect } from '@/entities/User'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './GeneralSection.module.scss'

interface GeneralSectionProps {
    className?: string
    name: string
    onChangeName: (v: string) => void
    location: string
    onChangeLocation: (v: string) => void
    comment: string
    onChangeComment: (v: string) => void
    cloudPbx: boolean
    onChangeCloudPbx: (v: boolean) => void
    userId?: string
    onChangeClient: (clientId: string) => void
    isAdmin?: boolean
    clientName?: string
}

export const GeneralSection = memo((props: GeneralSectionProps) => {
    const {
        className,
        name,
        onChangeName,
        location,
        onChangeLocation,
        comment,
        onChangeComment,
        cloudPbx,
        onChangeCloudPbx,
        userId,
        onChangeClient,
        isAdmin,
    } = props

    const { t } = useTranslation('pbx')
    const isMobile = useMediaQuery('(max-width:800px)')

    return (
        <Card
            padding={isMobile ? '16' : '24'}
            max
            className={classNames(cls.GeneralSection, {}, [className])}
        >
            <VStack gap="32" max align='start'>
                <Text title={t('Основные настройки')} bold />


                {isAdmin && (
                    <VStack gap="24" max align='start'>
                        <HStack max gap="24" align="start" className={cls.fieldRow}>
                            <Text text={t('Облачная АТС')} bold />
                            <Check
                                checked={cloudPbx}
                                onChange={(e) => onChangeCloudPbx(e.target.checked)}
                            />
                        </HStack>
                        <Text text={t('Клиент')} bold />
                        <ClientSelect
                            clientId={userId}
                            onChangeClient={onChangeClient}
                            label=""
                            fullWidth
                        />
                        <Text text={t('Локация')} bold />
                        <Textarea
                            fullWidth
                            value={location}
                            onChange={(e) => onChangeLocation(e.target.value)}
                            multiline
                            minRows={2}
                            placeholder={t('Где находится сервер?') ?? ''}
                        />
                    </VStack>

                )}

                <Text text={t('Наименование сервера')} bold />
                <Textarea
                    fullWidth
                    value={name}
                    onChange={(e) => onChangeName(e.target.value)}
                    placeholder={t('Введите название...') ?? ''}
                />

                <Text text={t('Комментарий')} bold />
                <Textarea
                    fullWidth
                    value={comment}
                    onChange={(e) => onChangeComment(e.target.value)}
                    multiline
                    minRows={3}
                    placeholder={t('Любая дополнительная информация...') ?? ''}
                />
            </VStack>
        </Card >
    )
})
