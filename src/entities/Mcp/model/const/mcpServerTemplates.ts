import { Mail, Calendar, Send, MessageCircle, Hash, type LucideIcon } from 'lucide-react'

export interface McpServerTemplate {
    id: string
    toolkit: string
    nameKey: string
    descriptionKey: string
    Icon: LucideIcon
    colorClass: string
}

export const mcpServerTemplates: McpServerTemplate[] = [
    {
        id: 'gmail',
        toolkit: 'gmail',
        nameKey: 'template_gmail',
        descriptionKey: 'template_gmail_desc',
        Icon: Mail,
        colorClass: 'gmail',
    },
    {
        id: 'google_calendar',
        toolkit: 'googlecalendar',
        nameKey: 'template_google_calendar',
        descriptionKey: 'template_google_calendar_desc',
        Icon: Calendar,
        colorClass: 'google_calendar',
    },
    {
        id: 'outlook_mail',
        toolkit: 'outlook',
        nameKey: 'template_outlook_mail',
        descriptionKey: 'template_outlook_mail_desc',
        Icon: Mail,
        colorClass: 'outlook',
    },
    {
        id: 'telegram',
        toolkit: 'telegram',
        nameKey: 'template_telegram',
        descriptionKey: 'template_telegram_desc',
        Icon: Send,
        colorClass: 'telegram',
    },
    {
        id: 'whatsapp',
        toolkit: 'whatsapp',
        nameKey: 'template_whatsapp',
        descriptionKey: 'template_whatsapp_desc',
        Icon: MessageCircle,
        colorClass: 'whatsapp',
    },
    {
        id: 'slack',
        toolkit: 'slack',
        nameKey: 'template_slack',
        descriptionKey: 'template_slack_desc',
        Icon: Hash,
        colorClass: 'slack',
    },
]
