import { memo, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Tooltip } from '@mui/material'
import { Info } from 'lucide-react'

import { Textarea } from '@/shared/ui/mui/Textarea'
import { ClientSelect, getUserAuthData, isUserAdmin } from '@/entities/User'
import { Tool, ToolsSelect } from '@/entities/Tools'
import { McpServer, McpServerSelect } from '@/entities/Mcp'
import { Check } from '@/shared/ui/mui/Check'
import { VoiceSelect, ModelSelect, Assistant, getAssistantFormData } from '@/entities/Assistants'

import cls from './MainInfoCard.module.scss'

interface MainInfoCardProps {
    className?: string
    onChangeTextHandler?: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onChangeSelectHandler?: (field: keyof Assistant) => (event: any, newValue: string) => void
    onChangeClientHandler?: (clientId: string) => void
    onChangeToolsHandler?: (event: any, value: Tool[]) => void
    onChangeMcpServersHandler?: (event: any, value: McpServer[]) => void
    onChangeCheckboxHandler?: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement>) => void
}

export const MainInfoCard = memo((props: MainInfoCardProps) => {
    const {
        className,
        onChangeTextHandler,
        onChangeSelectHandler,
        onChangeClientHandler,
        onChangeToolsHandler,
        onChangeMcpServersHandler,
        onChangeCheckboxHandler
    } = props

    const { t } = useTranslation('assistants')
    const isAdmin = useSelector(isUserAdmin)
    const clientData = useSelector(getUserAuthData)
    const formFields = useSelector(getAssistantFormData)

    const userId = isAdmin ? formFields?.userId : clientData?.id

    return (
        <div className={classNames(cls.MainInfoCard, {}, [className])}>
            <Text
                title={t('Настройки')}
                className={cls.cardTitle}
                bold
            />

            <VStack max gap="16">
                {isAdmin && (
                    <ClientSelect
                        clientId={String(formFields?.userId || '')}
                        onChangeClient={onChangeClientHandler}
                        label={String(t('Клиент'))}
                        data-testid="AssistantForm.ClientSelect"
                    />
                )}

                <Textarea
                    label={t('Наименование ассистента') ?? ''}
                    onChange={onChangeTextHandler?.('name')}
                    data-testid="AssistantForm.name"
                    value={formFields?.name || ''}
                    placeholder={t('Название вашего ассистента') ?? ''}
                    required
                    fullWidth
                />

                <ModelSelect
                    label={String(t('Модель'))}
                    value={formFields?.model || ''}
                    onChangeValue={onChangeSelectHandler?.('model')}
                    required
                />

                <VoiceSelect
                    label={String(t('Голос'))}
                    value={formFields?.voice ?? ''}
                    model={formFields?.model}
                    onChangeValue={onChangeSelectHandler?.('voice')}
                    required
                />

                <ToolsSelect
                    label={t('Функции') || ''}
                    value={formFields?.tools || []}
                    userId={userId}
                    onChangeTool={onChangeToolsHandler}
                />

                <McpServerSelect
                    label={t('MCP серверы') || ''}
                    value={formFields?.mcpServers || []}
                    userId={userId}
                    onChangeMcpServers={onChangeMcpServersHandler}
                />

                <VStack gap="4">
                    <Check
                        checked={formFields?.analytic ?? true}
                        onChange={onChangeCheckboxHandler?.('analytic')}
                        label={
                            <HStack gap="4" align="center">
                                {t('Аналитика разговора')}
                                <Tooltip
                                    title={t('analyticTooltip')}
                                    arrow
                                    placement="top"
                                    enterTouchDelay={0}
                                    leaveTouchDelay={3000}
                                    slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                                >
                                    <span className={cls.tooltipIcon}><Info size={16} /></span>
                                </Tooltip>
                            </HStack>
                        }
                    />

                    <Check
                        checked={formFields?.allowHangup ?? false}
                        onChange={onChangeCheckboxHandler?.('allowHangup')}
                        label={
                            <HStack gap="4" align="center">
                                {t('Завершать вызов')}
                                <Tooltip
                                    title={t('allowHangupTooltip')}
                                    arrow
                                    placement="top"
                                    enterTouchDelay={0}
                                    leaveTouchDelay={3000}
                                    slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                                >
                                    <span className={cls.tooltipIcon}><Info size={16} /></span>
                                </Tooltip>
                            </HStack>
                        }
                    />

                    <Check
                        checked={formFields?.allowTransfer ?? false}
                        onChange={onChangeCheckboxHandler?.('allowTransfer')}
                        label={
                            <HStack gap="4" align="center">
                                {t('Переводить вызов')}
                                <Tooltip
                                    title={t('allowTransferTooltip')}
                                    arrow
                                    placement="top"
                                    enterTouchDelay={0}
                                    leaveTouchDelay={3000}
                                    slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                                >
                                    <span className={cls.tooltipIcon}><Info size={16} /></span>
                                </Tooltip>
                            </HStack>
                        }
                    />
                </VStack>

                <Textarea
                    label={t('Комментарий') ?? ''}
                    onChange={onChangeTextHandler?.('comment')}
                    data-testid="AssistantForm.comment"
                    value={formFields?.comment || ''}
                    placeholder={t('Добавьте комментарий (необязательно)') ?? ''}
                    minRows={2}
                    multiline
                />
            </VStack>
        </div>
    )
})
