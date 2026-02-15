import { Mail, Calendar, Send, MessageCircle, Hash, type LucideIcon } from 'lucide-react'
import { Bitrix24Icon } from '@/shared/ui/icons/Bitrix24Icon'
import { type ComponentType } from 'react'

export interface McpServerTemplate {
    id: string
    toolkit: string
    nameKey: string
    descriptionKey: string
    Icon: LucideIcon | ComponentType<{ size?: number }>
    colorClass: string
    authType: 'oauth' | 'api_key' | 'chat_id' | 'webhook'
}

export const mcpServerTemplates: McpServerTemplate[] = [
    {
        id: 'gmail',
        toolkit: 'gmail',
        nameKey: 'template_gmail',
        descriptionKey: 'template_gmail_desc',
        Icon: Mail,
        colorClass: 'gmail',
        authType: 'oauth',
    },
    {
        id: 'google_calendar',
        toolkit: 'googlecalendar',
        nameKey: 'template_google_calendar',
        descriptionKey: 'template_google_calendar_desc',
        Icon: Calendar,
        colorClass: 'google_calendar',
        authType: 'oauth',
    },
    {
        id: 'outlook',
        toolkit: 'outlook',
        nameKey: 'template_outlook',
        descriptionKey: 'template_outlook_desc',
        Icon: Mail,
        colorClass: 'outlook',
        authType: 'oauth',
    },
    {
        id: 'bitrix24',
        toolkit: 'bitrix24',
        nameKey: 'template_bitrix24',
        descriptionKey: 'template_bitrix24_desc',
        Icon: Bitrix24Icon,
        colorClass: 'bitrix24',
        authType: 'webhook',
    },
    {
        id: 'telegram',
        toolkit: 'telegram',
        nameKey: 'template_telegram',
        descriptionKey: 'template_telegram_desc',
        Icon: Send,
        colorClass: 'telegram',
        authType: 'chat_id',
    },
    {
        id: 'whatsapp',
        toolkit: 'whatsapp',
        nameKey: 'template_whatsapp',
        descriptionKey: 'template_whatsapp_desc',
        Icon: MessageCircle,
        colorClass: 'whatsapp',
        authType: 'api_key',
    },
    {
        id: 'slack',
        toolkit: 'slack',
        nameKey: 'template_slack',
        descriptionKey: 'template_slack_desc',
        Icon: Hash,
        colorClass: 'slack',
        authType: 'oauth',
    },
]
