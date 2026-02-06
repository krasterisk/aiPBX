import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Server } from 'lucide-react'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Check } from '@/shared/ui/mui/Check'
import { ClientSelect } from '@/entities/User'
import { SectionCard } from '../SectionCard/SectionCard'

interface GeneralSectionProps {
    className?: string
    name: string
    onChangeName: (v: string) => void
    location: string
    onChangeLocation: (v: string) => void
    comment: string
    onChangeComment: (v: string) => void
    cloudPbx: boolean
    onChangeCloudPbx: (v: boolean) => void
    userId?: string
    onChangeClient: (clientId: string) => void
    isAdmin?: boolean
    clientName?: string
    isEdit?: boolean
}

export const GeneralSection = memo((props: GeneralSectionProps) => {
    const {
        className,
        name,
        onChangeName,
        location,
        onChangeLocation,
        comment,
        onChangeComment,
        cloudPbx,
        onChangeCloudPbx,
        userId,
        onChangeClient,
        isAdmin,
    } = props

    const { t } = useTranslation('pbx')

    return (
        <SectionCard
            title={t('Информация')}
            icon={Server}
            className={className}
        >
            {isAdmin && (
                <>
                    <Check
                        label={t('Облачная АТС') || ''}
                        checked={cloudPbx}
                        onChange={(e) => onChangeCloudPbx(e.target.checked)}
                    />
                    <ClientSelect
                        clientId={userId}
                        onChangeClient={onChangeClient}
                        label={t('Клиент') || ''}
                        fullWidth
                    />
                    <Textarea
                        fullWidth
                        label={t('Локация') || ''}
                        value={location}
                        onChange={(e) => onChangeLocation(e.target.value)}
                        placeholder={t('Где находится сервер?') ?? ''}
                    />
                </>
            )}

            <Textarea
                fullWidth
                label={t('Наименование сервера') || ''}
                value={name}
                onChange={(e) => onChangeName(e.target.value)}
                placeholder={t('Введите название...') ?? ''}
            />

            <Textarea
                fullWidth
                label={t('Комментарий') || ''}
                value={comment}
                onChange={(e) => onChangeComment(e.target.value)}
                multiline
                minRows={3}
                placeholder={t('Любая дополнительная информация...') ?? ''}
            />
        </SectionCard>
    )
})
