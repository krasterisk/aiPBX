import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Network, Info } from 'lucide-react'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { InputPassword } from '@/shared/ui/mui/InputPassword'
import { SectionCard } from '../SectionCard/SectionCard'
import { Button } from '@/shared/ui/redesigned/Button'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from '../../PbxServerForm.module.scss'

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
    moh: string
    onChangeMoh: (v: string) => void
    recordFormat: string
    onChangeRecordFormat: (v: string) => void
    password?: string
    onChangePassword: (v: string) => void
    onOpenInstructions?: () => void
    isEdit?: boolean
    statusData?: { online: boolean }
    isStatusLoading?: boolean
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
        moh,
        onChangeMoh,
        recordFormat,
        onChangeRecordFormat,
        password,
        onChangePassword,
        onOpenInstructions,
        isEdit,
        statusData,
        isStatusLoading
    } = props

    const { t } = useTranslation('pbx')

    const statusBadge = isEdit
? (
        <HStack gap="8" align="center" className={cls.statusBadgeSection}>
            <div
                className={classNames(cls.statusIndicator, {
                    [cls.online]: statusData?.online,
                    [cls.offline]: statusData && !statusData.online,
                    [cls.loading]: isStatusLoading
                })}
            />
            <Text
                text={isStatusLoading ? t('Загрузка...') : (statusData?.online ? t('В сети') : t('Не в сети'))}
                size="s"
            />
        </HStack>
    )
: null

    return (
        <SectionCard
            title={t('Подключение и адреса')}
            icon={Network}
            className={className}
            rightElement={statusBadge}
        >
            <HStack max justify="end">
                <Button variant="clear" onClick={onOpenInstructions}>
                    <HStack gap="4" align="center">
                        <Info size={16} />
                        <Text text={t('Инструкции')} size="s" bold variant="accent" />
                    </HStack>
                </Button>
            </HStack>
            <Textarea
                fullWidth
                label={t('Адрес сервера (SIP)') || ''}
                value={sipHost}
                onChange={(e) => { onChangeSipHost(e.target.value) }}
                placeholder="sip.example.com"
            />
            <Textarea
                fullWidth
                label={t('WSS URL (WebRTC)') || ''}
                value={wssUrl}
                onChange={(e) => { onChangeWssUrl(e.target.value) }}
                placeholder="wss://sip.example.com:8089/ws"
            />
            <Textarea
                fullWidth
                label={t('ARI URL') || ''}
                value={ariUrl}
                onChange={(e) => { onChangeAriUrl(e.target.value) }}
                placeholder="https://sip.example.com:8088/ari"
            />
            <Textarea
                fullWidth
                label={t('ARI USER') || ''}
                value={ariUser}
                onChange={(e) => { onChangeAriUser(e.target.value) }}
                placeholder="asterisk"
            />
            <InputPassword
                fullWidth
                label={t('ARI PASSWORD') || ''}
                value={password}
                onChange={(e) => { onChangePassword(e.target.value) }}
                placeholder="••••••••"
            />
            <Textarea
                fullWidth
                label={t('Контекст') || ''}
                value={context}
                onChange={(e) => { onChangeContext(e.target.value) }}
                placeholder={t('default') ?? ''}
                helperText={t('Контекст используется для возврата звонка от ассистента в вашу PBX, например при переводе')}
            />
            <Textarea
                fullWidth
                label={t('MOH (Music On Hold)') || ''}
                value={moh}
                onChange={(e) => { onChangeMoh(e.target.value) }}
                placeholder="default"
                helperText={t('Класс музыки во время ожидания. Этот класс будет запускаться как фоновая музыка во время ответов ассистента')}
            />
            <Textarea
                fullWidth
                label={t('Формат записи') || ''}
                value={recordFormat}
                onChange={(e) => { onChangeRecordFormat(e.target.value) }}
                placeholder="wav"
                helperText={t('Формат, в котором будет производиться запись разговоров (например, wav, mp3, sln)')}
            />

        </SectionCard>
    )
})
