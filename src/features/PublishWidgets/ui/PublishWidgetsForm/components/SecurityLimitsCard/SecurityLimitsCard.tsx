import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ShieldCheck } from 'lucide-react'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { SectionCard } from '../SectionCard/SectionCard'
import { DomainsTagInput } from '../DomainsTagInput/DomainsTagInput'

interface SecurityLimitsCardProps {
    allowedDomains: string
    onChangeDomains: (val: string) => void
    maxSessions: number
    onChangeMaxSessions: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    maxSessionDuration: number
    onChangeMaxSessionDuration: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    isMobile?: boolean
}

export const SecurityLimitsCard = memo((props: SecurityLimitsCardProps) => {
    const {
        allowedDomains,
        onChangeDomains,
        maxSessions,
        onChangeMaxSessions,
        maxSessionDuration,
        onChangeMaxSessionDuration,
        isMobile
    } = props
    const { t } = useTranslation('publish-widgets')

    return (
        <SectionCard title={t('Безопасность и лимиты')} icon={ShieldCheck}>
            <DomainsTagInput
                value={allowedDomains}
                onChange={onChangeDomains}
            />

            <HStack gap="16" max wrap={isMobile ? 'wrap' : 'nowrap'}>
                <Textarea
                    style={{ flex: isMobile ? undefined : 1, width: isMobile ? '100%' : undefined }}
                    label={t('Максимум сессий') || ''}
                    type="number"
                    value={maxSessions}
                    onChange={onChangeMaxSessions}
                    error={maxSessions < 1 || maxSessions > 100}
                    helperText={maxSessions < 1 || maxSessions > 100 ? t('Значение должно быть от 1 до 100') : t('Макс. одновременных сессий')}
                    inputProps={{ min: 1, max: 100 }}
                />

                <Textarea
                    style={{ flex: isMobile ? undefined : 1, width: isMobile ? '100%' : undefined }}
                    label={t('Длительность сессии (сек)') || ''}
                    type="number"
                    value={maxSessionDuration}
                    onChange={onChangeMaxSessionDuration}
                    error={maxSessionDuration < 60 || maxSessionDuration > 3600}
                    helperText={maxSessionDuration < 60 || maxSessionDuration > 3600 ? t('Значение должно быть от 60 до 3600') : t('Макс. длительность')}
                    inputProps={{ min: 60, max: 3600 }}
                />
            </HStack>
        </SectionCard>
    )
})
