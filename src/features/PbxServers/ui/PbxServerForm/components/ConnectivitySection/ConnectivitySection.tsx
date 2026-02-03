import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mui/material'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { InputPassword } from '@/shared/ui/mui/InputPassword'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ConnectivitySection.module.scss'

interface ConnectivitySectionProps {
    className?: string
    sipHost: string
    onChangeSipHost: (v: string) => void
    wssUrl: string
    onChangeWssUrl: (v: string) => void
    ariUrl: string
    onChangeAriUrl: (v: string) => void
    ariUser: string
    onChangeAriUser: (v: string) => void
    context: string
    onChangeContext: (v: string) => void
    password?: string
    onChangePassword: (v: string) => void
}


export const ConnectivitySection = memo((props: ConnectivitySectionProps) => {
    const {
        className,
        sipHost,
        onChangeSipHost,
        wssUrl,
        onChangeWssUrl,
        ariUrl,
        onChangeAriUrl,
        ariUser,
        onChangeAriUser,
        context,
        onChangeContext,
        password,
        onChangePassword
    } = props

    const { t } = useTranslation('pbx')
    const isMobile = useMediaQuery('(max-width:800px)')

    return (
        <Card
            padding={isMobile ? '16' : '24'}
            max
            className={classNames(cls.ConnectivitySection, {}, [className])}
        >
            <VStack gap="32" max>
                <Text title={t('Подключение и адреса')} bold />

                <Text text={t('Адрес сервера (SIP)')} bold />
                <Textarea
                    fullWidth
                    value={sipHost}
                    onChange={(e) => onChangeSipHost(e.target.value)}
                    placeholder="sip.example.com"
                />
                <Text text={t('WSS URL (WebRTC)')} bold />
                <Textarea
                    fullWidth
                    value={wssUrl}
                    onChange={(e) => onChangeWssUrl(e.target.value)}
                    placeholder="wss://sip.example.com:8089/ws"
                />
                <Text text={t('ARI URL')} bold />
                <Textarea
                    fullWidth
                    value={ariUrl}
                    onChange={(e) => onChangeAriUrl(e.target.value)}
                    placeholder="https://sip.example.com:8088/ari"
                />
                <Text text={t('ARI USER')} bold />
                <Textarea
                    fullWidth
                    value={ariUser}
                    onChange={(e) => onChangeAriUser(e.target.value)}
                    placeholder="asterisk"
                />
                <Text text={t('Контекст')} bold />
                <Textarea
                    fullWidth
                    value={context}
                    onChange={(e) => onChangeContext(e.target.value)}
                    placeholder={t('default') ?? ''}
                />
                <Text text={t('ARI PASSWORD')} bold />
                <InputPassword
                    fullWidth
                    value={password}
                    onChange={(e) => onChangePassword(e.target.value)}
                    placeholder="••••••••"
                />
            </VStack>
        </Card>
    )
})
