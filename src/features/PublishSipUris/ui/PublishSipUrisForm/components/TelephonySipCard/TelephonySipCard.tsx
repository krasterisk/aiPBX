import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Phone } from 'lucide-react'
import { AssistantSelect, AssistantOptions } from '@/entities/Assistants'
import { PbxServerSelect, PbxServerOptions } from '@/entities/PbxServers'
import { Check } from '@/shared/ui/mui/Check'
import { SectionCard } from '../SectionCard/SectionCard'

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

    return (
        <SectionCard title={t('Телефония и AI')} icon={Phone}>
            <AssistantSelect
                label={t('AI Ассистент') || ''}
                value={selectedAssistant}
                onChangeAssistant={onChangeAssistant}
                userId={isEdit ? selectedAssistant?.userId : (isAdmin ? undefined : userId)}
                fullWidth
            />

            <PbxServerSelect
                label={t('Выберите VoIP сервер') || ''}
                value={selectedPbx}
                onChangePbxServer={onChangePbx}
                fetchType="cloud"
                fullWidth
            />

            <Check
                label={t('SIP URI активен') || ''}
                checked={active}
                onChange={onChangeActive}
            />
        </SectionCard>
    )
})
