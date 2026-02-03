import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mui/material'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { AssistantSelect, AssistantOptions } from '@/entities/Assistants'
import { PbxServerSelect, PbxServerOptions } from '@/entities/PbxServers'
import { Check } from '@/shared/ui/mui/Check'

import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './TelephonySipCard.module.scss'

interface TelephonySipCardProps {
    className?: string
    selectedAssistant: AssistantOptions | null | undefined
    onChangeAssistant: (_: any, value: AssistantOptions | null) => void
    selectedPbx: PbxServerOptions | null | undefined
    onChangePbx: (_: any, value: PbxServerOptions | null) => void
    active: boolean
    onChangeActive: (e: React.ChangeEvent<HTMLInputElement>) => void
    isEdit?: boolean
    isAdmin?: boolean
    userId?: string
}

export const TelephonySipCard = memo((props: TelephonySipCardProps) => {
    const {
        className,
        selectedAssistant,
        onChangeAssistant,
        selectedPbx,
        onChangePbx,
        active,
        onChangeActive,
        isEdit,
        isAdmin,
        userId
    } = props
    const { t } = useTranslation('publish-sip')
    const isMobile = useMediaQuery('(max-width:800px)')

    return (
        <Card
            padding={isMobile ? '16' : '24'}
            max
            className={classNames(cls.TelephonySipCard, {}, [className])}
        >
            <VStack gap="32" max align="start">
                <Text title={t('Телефония и AI')} bold />

                <VStack gap="12" max align="start">
                    <Text text={t('AI Ассистент')} bold />
                    <AssistantSelect
                        label=""
                        value={selectedAssistant}
                        onChangeAssistant={onChangeAssistant}
                        userId={isEdit ? selectedAssistant?.userId : (isAdmin ? undefined : userId)}
                        fullWidth
                    />
                </VStack>

                <VStack gap="12" max align="start">
                    <Text text={t('Выберите VoIP сервер')} bold />
                    <PbxServerSelect
                        label=""
                        value={selectedPbx}
                        onChangePbxServer={onChangePbx}
                        fetchType="cloud"
                        fullWidth
                    />
                </VStack>

                <HStack gap="12" align="center">
                    <Check
                        checked={active}
                        onChange={onChangeActive}
                    />
                    <Text text={t('SIP URI активен')} bold />
                </HStack>
            </VStack>
        </Card>
    )
})
