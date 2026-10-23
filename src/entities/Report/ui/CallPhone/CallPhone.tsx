import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { PhoneCall, PhoneIncoming, PhoneOutgoing } from 'lucide-react'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Tooltip } from '@/shared/ui/redesign-v3/Tooltip'
import cls from './CallPhone.module.scss'

interface CallPhoneProps {
    phone?: string | null
    callType?: 'incoming' | 'outgoing' | 'internal' | null
}

/** Legacy calls without direction are incoming. */
export const CallPhone = memo(({ phone, callType }: CallPhoneProps) => {
    const { t } = useTranslation('reports')
    const outgoing = callType === 'outgoing'
    const internal = callType === 'internal'
    const Icon = internal ? PhoneCall : outgoing ? PhoneOutgoing : PhoneIncoming
    const label = String(t(internal ? 'Внутренний' : outgoing ? 'Исходящий' : 'Входящий'))
    return (
        <HStack gap="8" wrap="wrap" align="center" className={cls.root}>
            <span className={cls.phone}>{phone || '-'}</span>
            <Tooltip title={label}>
                <span className={cls.direction} role="img" aria-label={label}
                    data-direction={internal ? 'internal' : outgoing ? 'outgoing' : 'incoming'}>
                    <Icon size={14} aria-hidden />
                </span>
            </Tooltip>
        </HStack>
    )
})
