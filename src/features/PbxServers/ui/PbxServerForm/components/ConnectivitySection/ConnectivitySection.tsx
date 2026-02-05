import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Network } from 'lucide-react'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { InputPassword } from '@/shared/ui/mui/InputPassword'
import { SectionCard } from '../SectionCard/SectionCard'

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

    return (
        <SectionCard
            title={t('Подключение и адреса')}
            icon={Network}
            className={className}
        >
            <Textarea
                fullWidth
                label={t('Адрес сервера (SIP)') || ''}
                value={sipHost}
                onChange={(e) => onChangeSipHost(e.target.value)}
                placeholder="sip.example.com"
            />
            <Textarea
                fullWidth
                label={t('WSS URL (WebRTC)') || ''}
                value={wssUrl}
                onChange={(e) => onChangeWssUrl(e.target.value)}
                placeholder="wss://sip.example.com:8089/ws"
            />
            <Textarea
                fullWidth
                label={t('ARI URL') || ''}
                value={ariUrl}
                onChange={(e) => onChangeAriUrl(e.target.value)}
                placeholder="https://sip.example.com:8088/ari"
            />
            <Textarea
                fullWidth
                label={t('ARI USER') || ''}
                value={ariUser}
                onChange={(e) => onChangeAriUser(e.target.value)}
                placeholder="asterisk"
            />
            <Textarea
                fullWidth
                label={t('Контекст') || ''}
                value={context}
                onChange={(e) => onChangeContext(e.target.value)}
                placeholder={t('default') ?? ''}
            />
            <InputPassword
                fullWidth
                label={t('ARI PASSWORD') || ''}
                value={password}
                onChange={(e) => onChangePassword(e.target.value)}
                placeholder="••••••••"
            />
        </SectionCard>
    )
})
