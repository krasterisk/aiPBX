import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Shield } from 'lucide-react'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Check } from '@/shared/ui/mui/Check'
import { Text } from '@/shared/ui/redesigned/Text'
import { SectionCard } from '../SectionCard/SectionCard'

interface SecuritySipCardProps {
    className?: string
    ipAddress: string | undefined
    onChangeIp: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    records: boolean
    onChangeRecords: (e: React.ChangeEvent<HTMLInputElement>) => void
    tls: boolean
    onChangeTls: (e: React.ChangeEvent<HTMLInputElement>) => void
    isAdmin?: boolean
}

export const SecuritySipCard = memo((props: SecuritySipCardProps) => {
    const {
        ipAddress,
        onChangeIp,
        records,
        onChangeRecords,
        tls,
        onChangeTls,
        isAdmin
    } = props
    const { t } = useTranslation('publish-sip')

    return (
        <SectionCard title={t('Безопасность')} icon={Shield}>
            <Textarea
                label={t('Ваш IP Адрес') || ''}
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

            {isAdmin && (
                <Check
                    label={t('Запись разговоров') || ''}
                    checked={records}
                    onChange={onChangeRecords}
                />
            )}

            <Check
                label={t('TLS/SRTP Шифрование') || ''}
                checked={tls}
                onChange={onChangeTls}
            />
        </SectionCard>
    )
})
