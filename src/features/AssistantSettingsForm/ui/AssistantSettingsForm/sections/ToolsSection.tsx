import { memo, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Tooltip } from '@mui/material'
import { Info } from 'lucide-react'
import { Check } from '@/shared/ui/mui/Check'
import { Tool, ToolsSelect } from '@/entities/Tools'
import { McpServer, McpServerSelect } from '@/entities/Mcp'
import { getAssistantFormData, Assistant } from '@/entities/Assistants'
import { ClientSelect, getUserAuthData, isUserAdmin } from '@/entities/User'
import cls from '../AssistantSettingsForm.module.scss'

interface ToolsSectionProps {
    mode?: 'create' | 'edit'
    onChangeTools: (event: any, value: Tool[]) => void
    onChangeMcpServers: (event: any, value: McpServer[]) => void
    onChangeCheckbox: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement>) => void
    onChangeClient?: (clientId: string) => void
}

export const ToolsSection = memo((props: ToolsSectionProps) => {
    const {
        mode = 'edit',
        onChangeTools,
        onChangeMcpServers,
        onChangeCheckbox,
        onChangeClient,
    } = props
    const { t } = useTranslation(['playground', 'assistants'])
    const isAdmin = useSelector(isUserAdmin)
    const clientData = useSelector(getUserAuthData)
    const formFields = useSelector(getAssistantFormData)
    const userId = isAdmin ? formFields?.userId : clientData?.id

    return (
        <div className={cls.fieldsGrid}>
            {isAdmin && mode === 'create' && onChangeClient && (
                <div className={cls.fullWidth}>
                    <ClientSelect
                        clientId={String(formFields?.userId || '')}
                        onChangeClient={onChangeClient}
                        label={String(t('Клиент', { ns: 'assistants' }))}
                        data-testid="AssistantSettingsForm.ClientSelect"
                    />
                </div>
            )}

            <div className={cls.fullWidth}>
                <ToolsSelect
                    label={t('Функции') || ''}
                    value={formFields?.tools || []}
                    userId={userId}
                    onChangeTool={onChangeTools}
                />
            </div>

            <div className={cls.fullWidth}>
                <McpServerSelect
                    label={t('MCP серверы') || ''}
                    value={formFields?.mcpServers || []}
                    userId={userId}
                    onChangeMcpServers={onChangeMcpServers}
                />
            </div>

            <div className={`${cls.checkStack} ${cls.fullWidth}`}>
                <Check
                    checked={formFields?.analytic ?? true}
                    onChange={onChangeCheckbox('analytic')}
                    label={
                        <span className={cls.sliderLabel}>
                            {t('Аналитика разговора')}
                            <Tooltip title={t('analyticTooltip')} arrow placement="top">
                                <span className={cls.helpIcon}><Info size={14} /></span>
                            </Tooltip>
                        </span>
                    }
                />
                <Check
                    checked={formFields?.allowHangup ?? false}
                    onChange={onChangeCheckbox('allowHangup')}
                    label={
                        <span className={cls.sliderLabel}>
                            {t('Завершать вызов')}
                            <Tooltip title={t('allowHangupTooltip')} arrow placement="top">
                                <span className={cls.helpIcon}><Info size={14} /></span>
                            </Tooltip>
                        </span>
                    }
                />
                <Check
                    checked={formFields?.allowTransfer ?? false}
                    onChange={onChangeCheckbox('allowTransfer')}
                    label={
                        <span className={cls.sliderLabel}>
                            {t('Переводить вызов')}
                            <Tooltip title={t('allowTransferTooltip')} arrow placement="top">
                                <span className={cls.helpIcon}><Info size={14} /></span>
                            </Tooltip>
                        </span>
                    }
                />
            </div>
        </div>
    )
})
