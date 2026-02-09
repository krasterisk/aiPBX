import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Phone } from 'lucide-react'
import { AssistantSelect, AssistantOptions } from '@/entities/Assistants'
import { PbxServerSelect, PbxServerOptions } from '@/entities/PbxServers'
import { ClientSelect } from '@/entities/User'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Check } from '@/shared/ui/mui/Check'
import { SectionCard } from '../SectionCard/SectionCard'

interface TelephonyAiCardProps {
    selectedAssistant: AssistantOptions | null | undefined
    onChangeAssistant: (_: unknown, v: AssistantOptions | null) => void
    selectedPbxServer: PbxServerOptions | null | undefined
    onChangePbxServer: (_: unknown, v: PbxServerOptions | null) => void
    name: string
    onChangeName: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    isActive: boolean
    onChangeIsActive: (e: React.ChangeEvent<HTMLInputElement>) => void
    isAdmin: boolean
    userId?: string
    clientId?: string
    onChangeClient?: (clientId: string) => void
}

export const TelephonyAiCard = memo((props: TelephonyAiCardProps) => {
    const {
        selectedAssistant,
        onChangeAssistant,
        selectedPbxServer,
        onChangePbxServer,
        name,
        onChangeName,
        isActive,
        onChangeIsActive,
        isAdmin,
        userId,
        clientId,
        onChangeClient
    } = props
    const { t } = useTranslation('publish-widgets')

    const filterUserId = isAdmin
        ? (clientId || undefined)
        : userId

    return (
        <SectionCard title={t('Телефония и AI')} icon={Phone}>
            {isAdmin && (
                <ClientSelect
                    clientId={String(clientId || '')}
                    onChangeClient={onChangeClient}
                    label={t('Клиент') || ''}
                    fullWidth
                />
            )}

            <Textarea
                label={t('Название виджета') || ''}
                value={name}
                onChange={onChangeName}
                placeholder={t('Напр. Служба поддержки') || ''}
                rows={1}
            />

            <AssistantSelect
                key={selectedAssistant?.id}
                label={t('AI Ассистент') || ''}
                value={selectedAssistant}
                onChangeAssistant={onChangeAssistant}
                userId={filterUserId}
            />

            <PbxServerSelect
                label={t('PBX Сервер') || ''}
                value={selectedPbxServer}
                onChangePbxServer={onChangePbxServer}
                userId={filterUserId}
                fetchType="cloud-and-user"
            />

            <Check
                label={t('Виджет активен') || ''}
                checked={isActive}
                onChange={onChangeIsActive}
            />
        </SectionCard>
    )
})
