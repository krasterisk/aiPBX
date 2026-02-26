import { memo, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Phone, Copy } from 'lucide-react'
import { AssistantSelect, AssistantOptions } from '@/entities/Assistants'
import { PbxServerSelect, PbxServerOptions } from '@/entities/PbxServers'
import { ClientSelect } from '@/entities/User'
import { Check } from '@/shared/ui/mui/Check'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { toast } from 'react-toastify'
import { SectionCard } from '../SectionCard/SectionCard'

interface TelephonySipTrunkCardProps {
    className?: string
    selectedAssistant: AssistantOptions | null | undefined
    onChangeAssistant: (_: any, value: AssistantOptions | null) => void
    selectedPbx: PbxServerOptions | null | undefined
    onChangePbx: (_: any, value: PbxServerOptions | null) => void
    active: boolean
    onChangeActive: (e: React.ChangeEvent<HTMLInputElement>) => void
    records: boolean
    onChangeRecords: (e: React.ChangeEvent<HTMLInputElement>) => void
    isEdit?: boolean
    isAdmin?: boolean
    userId?: string
    clientId?: string
    onChangeClient?: (clientId: string) => void
    statusBadge?: ReactNode
}

export const TelephonySipTrunkCard = memo((props: TelephonySipTrunkCardProps) => {
    const {
        selectedAssistant,
        onChangeAssistant,
        selectedPbx,
        onChangePbx,
        active,
        onChangeActive,
        records,
        onChangeRecords,
        isEdit,
        isAdmin,
        userId,
        clientId,
        onChangeClient,
        statusBadge
    } = props
    const { t } = useTranslation('sip-trunks')

    const assistantUserId = isAdmin
        ? (clientId || undefined)
        : userId

    return (
        <SectionCard title={t('Телефония и AI')} icon={Phone} rightElement={statusBadge}>
            {isAdmin && (
                <ClientSelect
                    clientId={String(clientId || '')}
                    onChangeClient={onChangeClient}
                    label={t('Клиент') || ''}
                    fullWidth
                />
            )}

            <AssistantSelect
                label={t('AI Ассистент') || ''}
                value={selectedAssistant}
                onChangeAssistant={onChangeAssistant}
                userId={isEdit ? selectedAssistant?.userId : assistantUserId}
                fullWidth
            />

            <PbxServerSelect
                label={t('Выберите VoIP сервер') || ''}
                value={selectedPbx}
                onChangePbxServer={onChangePbx}
                fetchType="cloud"
                fullWidth
            />

            {selectedPbx?.sip_host && (
                <HStack gap="8" align="center">
                    <Text
                        text={`${t('Адрес сервера')}: ${selectedPbx.sip_host}`}
                        size="s"
                        variant="accent"
                    />
                    <span
                        onClick={() => {
                            navigator.clipboard.writeText(selectedPbx.sip_host || '')
                            toast.success(t('Скопировано в буфер обмена'))
                        }}
                        style={{ cursor: 'pointer', display: 'flex', opacity: 0.6 }}
                        title={t('Скопировать') || ''}
                    >
                        <Copy size={14} />
                    </span>
                </HStack>
            )}

            <Check
                label={t('SIP Trunk активен') || ''}
                checked={active}
                onChange={onChangeActive}
            />

            {isAdmin && (
                <Check
                    label={t('Запись разговоров') || ''}
                    checked={records}
                    onChange={onChangeRecords}
                />
            )}
        </SectionCard>
    )
})
