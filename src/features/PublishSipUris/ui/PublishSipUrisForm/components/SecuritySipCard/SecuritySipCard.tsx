import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mui/material'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Check } from '@/shared/ui/mui/Check'

import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './SecuritySipCard.module.scss'

interface SecuritySipCardProps {
    className?: string
    ipAddress: string | undefined
    onChangeIp: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    records: boolean
    onChangeRecords: (e: React.ChangeEvent<HTMLInputElement>) => void
    tls: boolean
    onChangeTls: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const SecuritySipCard = memo((props: SecuritySipCardProps) => {
    const {
        className,
        ipAddress,
        onChangeIp,
        records,
        onChangeRecords,
        tls,
        onChangeTls
    } = props
    const { t } = useTranslation('publish-sip')
    const isMobile = useMediaQuery('(max-width:800px)')

    return (
        <Card
            padding={isMobile ? '16' : '24'}
            max
            className={classNames(cls.SecuritySipCard, {}, [className])}
        >
            <VStack gap="32" max align="start">
                <Text title={t('Безопасность')} bold />

                <VStack gap="12" max align="start">
                    <Text text={t('Ваш IP Адрес')} bold />
                    <Textarea
                        label=""
                        value={ipAddress ?? ''}
                        onChange={onChangeIp}
                        placeholder={t('Введите IP адрес') || '1.2.3.4'}
                        fullWidth
                        minRows={2}
                    />
                    <Text
                        text={t('Укажите статический IP-адрес вашего сервера АТС или SIP-клиента для ограничения доступа к SIP URI')}
                        size="s"
                        variant="accent"
                    />
                </VStack>

                <VStack gap="16" max align="start">
                    <HStack gap="12" align="center">
                        <Check
                            checked={records}
                            onChange={onChangeRecords}
                        />
                        <Text text={t('Запись разговоров')} bold />
                    </HStack>

                    <HStack gap="12" align="center">
                        <Check
                            checked={tls}
                            onChange={onChangeTls}
                        />
                        <Text text={t('TLS/SRTP Шифрование')} bold />
                    </HStack>
                </VStack>

            </VStack>
        </Card>
    )
})
