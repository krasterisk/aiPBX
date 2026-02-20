import { classNames } from '@/shared/lib/classNames/classNames'
import { useTranslation } from 'react-i18next'
import cls from './PlaygroundAssistantSettings.module.scss'
import { memo, useCallback, useEffect, useRef } from 'react'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { ModelSelect, VoiceSelect, Assistant, useUpdateAssistant } from '@/entities/Assistants'
import { Tool, ToolsSelect } from '@/entities/Tools'
import { McpServer, McpServerSelect } from '@/entities/Mcp'
import { Slider } from '@/shared/ui/mui/Slider/Slider'
import { Tooltip } from '@mui/material'
import { Info, MessageSquareText, Settings2, Save } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
// eslint-disable-next-line krasterisk-plugin/layer-imports
import { getPlaygroundFormData, getPlaygroundFormLoading, playgroundAssistantFormActions } from '@/pages/Playground'

import { getUserAuthData, isUserAdmin } from '@/entities/User'

import { Textarea } from '@/shared/ui/mui/Textarea'
import { Check } from '@/shared/ui/mui/Check'
import { toast } from 'react-toastify'
import { SectionCard } from '../components/SectionCard/SectionCard'

interface PlaygroundAssistantSettingsProps {
    className?: string
}

export const PlaygroundAssistantSettings = memo((props: PlaygroundAssistantSettingsProps) => {
    const { className } = props
    const { t } = useTranslation('playground')
    const dispatch = useDispatch()

    const formData = useSelector(getPlaygroundFormData)
    const isLoading = useSelector(getPlaygroundFormLoading)
    const userData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)

    const [updateAssistant, { isLoading: isUpdating }] = useUpdateAssistant()

    const userId = isAdmin ? formData?.userId : userData?.id
    const prevModelRef = useRef<string | undefined>(formData?.model)

    // Clear voice when model changes
    useEffect(() => {
        if (formData?.model && prevModelRef.current && formData.model !== prevModelRef.current) {
            dispatch(playgroundAssistantFormActions.updateFormField({ voice: '' }))
        }
        prevModelRef.current = formData?.model
    }, [formData?.model, dispatch])

    const onChangeSelectHandler = useCallback((field: keyof Assistant) => (event: any, newValue: string) => {
        dispatch(playgroundAssistantFormActions.updateFormField({ [field]: newValue }))
    }, [dispatch])

    const onChangeToolsHandler = useCallback((event: any, value: Tool[]) => {
        dispatch(playgroundAssistantFormActions.updateFormField({ tools: value }))
    }, [dispatch])

    const onChangeMcpServersHandler = useCallback((event: any, value: McpServer[]) => {
        dispatch(playgroundAssistantFormActions.updateFormField({ mcpServers: value }))
    }, [dispatch])

    const onChangeSliderHandler = useCallback((field: keyof Assistant) => (value: number) => {
        dispatch(playgroundAssistantFormActions.updateFormField({ [field]: String(value) }))
    }, [dispatch])

    const onChangeTextHandler = useCallback((field: keyof Assistant) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(playgroundAssistantFormActions.updateFormField({ [field]: event.target.value }))
    }, [dispatch])

    const onChangeCheckboxHandler = useCallback((field: keyof Assistant) => (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(playgroundAssistantFormActions.updateFormField({ [field]: event.target.checked }))
    }, [dispatch])

    const handleApply = useCallback(async () => {
        if (!formData || !formData.id) return

        try {
            dispatch(playgroundAssistantFormActions.setLoading(true))
            await updateAssistant({
                id: formData.id,
                model: formData.model,
                voice: formData.voice,
                tools: formData.tools,
                mcpServers: formData.mcpServers,
                instruction: formData.instruction,
                temperature: formData.temperature,
                turn_detection_threshold: formData.turn_detection_threshold,
                turn_detection_prefix_padding_ms: formData.turn_detection_prefix_padding_ms,
                turn_detection_silence_duration_ms: formData.turn_detection_silence_duration_ms,
                idle_timeout_ms: formData.idle_timeout_ms,
                analytic: formData.analytic,
                allowHangup: formData.allowHangup,
                allowTransfer: formData.allowTransfer
            }).unwrap()
            dispatch(playgroundAssistantFormActions.setError(undefined))
            toast.success(t('Сохранено успешно'))
        } catch (error) {
            dispatch(playgroundAssistantFormActions.setError(String(error)))
            // Error toast handled by global toastMiddleware
        } finally {
            dispatch(playgroundAssistantFormActions.setLoading(false))
        }
    }, [formData, updateAssistant, dispatch, t])

    if (!formData) {
        return null
    }

    return (
        <VStack gap="24" max className={classNames('', {}, [className])}>
            <HStack
                gap="24"
                max
                align="start"
                wrap="wrap"
            >
                {/* Prompt Section */}
                <VStack gap="24" className={cls.leftColumn}>
                    <SectionCard
                        title={t('Промпт')}
                        icon={MessageSquareText}
                        rightElement={
                            <Button
                                variant="outline"
                                color="success"
                                size="s"
                                onClick={handleApply}
                                disabled={isLoading || isUpdating}
                                addonLeft={<Save size={16} />}
                            >
                                {isUpdating ? t('Применение...') : t('Применить')}
                            </Button>
                        }
                    >
                        <Textarea
                            label={t('Инструкция для ассистента') || ''}
                            value={formData.instruction || ''}
                            onChange={onChangeTextHandler('instruction')}
                            minRows={10}
                            multiline
                            fullWidth
                            placeholder={t('Введите инструкции для ИИ...') || ''}
                            className={cls.promptTextarea}
                        />
                    </SectionCard>
                </VStack>

                {/* Model Settings Section */}
                <VStack gap="24" className={cls.rightColumn}>
                    <SectionCard
                        title={t('Настройки модели')}
                        icon={Settings2}
                    >
                        <VStack gap="16" max>
                            <ModelSelect
                                label={String(t('Модель'))}
                                value={formData.model || ''}
                                onChangeValue={onChangeSelectHandler('model')}
                                fullWidth
                            />

                            <VoiceSelect
                                label={String(t('Голос'))}
                                value={formData.voice ?? ''}
                                model={formData.model}
                                onChangeValue={onChangeSelectHandler('voice')}
                                fullWidth
                            />

                            <ToolsSelect
                                label={t('Функции') || ''}
                                value={formData.tools || []}
                                userId={userId}
                                onChangeTool={onChangeToolsHandler}
                                fullWidth
                            />

                            <McpServerSelect
                                label={t('MCP серверы') || ''}
                                value={formData.mcpServers || []}
                                userId={userId}
                                onChangeMcpServers={onChangeMcpServersHandler}
                                fullWidth
                            />

                            <VStack gap="4">
                                <Check
                                    checked={formData.analytic ?? true}
                                    onChange={onChangeCheckboxHandler('analytic')}
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
                                    checked={formData.allowHangup ?? false}
                                    onChange={onChangeCheckboxHandler('allowHangup')}
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
                                    checked={formData.allowTransfer ?? false}
                                    onChange={onChangeCheckboxHandler('allowTransfer')}
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

                            {/* Temperature */}
                            <div className={cls.vadItem}>
                                <div className={cls.vadHeader}>
                                    <div className={cls.vadLabel}>
                                        {t('Температура')}
                                        <Tooltip
                                            title={t('tooltip_temperature') || ''}
                                            arrow
                                            placement="top"
                                            enterTouchDelay={0}
                                            leaveTouchDelay={3000}
                                            slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                                        >
                                            <span className={cls.tooltipIcon}><Info size={16} /></span>
                                        </Tooltip>
                                    </div>
                                    <span className={cls.vadValue}>{parseFloat(formData.temperature || '0.8').toFixed(1)}</span>
                                </div>
                                <Slider
                                    value={parseFloat(formData.temperature || '0.8') || 0.8}
                                    onChange={onChangeSliderHandler('temperature')}
                                    min={0.6}
                                    max={1.2}
                                    step={0.1}
                                />
                            </div>

                            {/* VAD Settings */}
                            <VStack gap="16" max className={cls.vadContainer}>
                                <Text text={t('Настройки VAD')} bold />

                                {/* Threshold */}
                                <div className={cls.vadItem}>
                                    <div className={cls.vadHeader}>
                                        <div className={cls.vadLabel}>
                                            {t('Порог')}
                                            <Tooltip
                                                title={t('tooltip_threshold') || ''}
                                                arrow
                                                placement="top"
                                                enterTouchDelay={0}
                                                leaveTouchDelay={3000}
                                                slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                                            >
                                                <span className={cls.tooltipIcon}><Info size={16} /></span>
                                            </Tooltip>
                                        </div>
                                        <span className={cls.vadValue}>{formData.turn_detection_threshold || '0.5'}</span>
                                    </div>
                                    <Slider
                                        value={Number(formData.turn_detection_threshold) || 0.5}
                                        onChange={onChangeSliderHandler('turn_detection_threshold')}
                                        min={0}
                                        max={1}
                                        step={0.1}
                                    />
                                </div>

                                {/* Prefix Padding */}
                                <div className={cls.vadItem}>
                                    <div className={cls.vadHeader}>
                                        <div className={cls.vadLabel}>
                                            {t('Префиксный отступ (мс)')}
                                            <Tooltip
                                                title={t('tooltip_prefix_padding') || ''}
                                                arrow
                                                placement="top"
                                                enterTouchDelay={0}
                                                leaveTouchDelay={3000}
                                                slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                                            >
                                                <span className={cls.tooltipIcon}><Info size={16} /></span>
                                            </Tooltip>
                                        </div>
                                        <span className={cls.vadValue}>{formData.turn_detection_prefix_padding_ms || '500'}</span>
                                    </div>
                                    <Slider
                                        value={Number(formData.turn_detection_prefix_padding_ms) || 500}
                                        onChange={onChangeSliderHandler('turn_detection_prefix_padding_ms')}
                                        min={0}
                                        max={2000}
                                        step={100}
                                    />
                                </div>

                                {/* Silence Duration */}
                                <div className={cls.vadItem}>
                                    <div className={cls.vadHeader}>
                                        <div className={cls.vadLabel}>
                                            {t('Длительность тишины (мс)')}
                                            <Tooltip
                                                title={t('tooltip_silence_duration') || ''}
                                                arrow
                                                placement="top"
                                                enterTouchDelay={0}
                                                leaveTouchDelay={3000}
                                                slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                                            >
                                                <span className={cls.tooltipIcon}><Info size={16} /></span>
                                            </Tooltip>
                                        </div>
                                        <span className={cls.vadValue}>{formData.turn_detection_silence_duration_ms || '1000'}</span>
                                    </div>
                                    <Slider
                                        value={Number(formData.turn_detection_silence_duration_ms) || 1000}
                                        onChange={onChangeSliderHandler('turn_detection_silence_duration_ms')}
                                        min={200}
                                        max={3000}
                                        step={100}
                                    />
                                </div>

                                {/* Idle Timeout */}
                                <div className={cls.vadItem}>
                                    <div className={cls.vadHeader}>
                                        <div className={cls.vadLabel}>
                                            {t('Время простоя (мс)')}
                                            <Tooltip
                                                title={t('tooltip_idle_timeout') || ''}
                                                arrow
                                                placement="top"
                                                enterTouchDelay={0}
                                                leaveTouchDelay={3000}
                                                slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                                            >
                                                <span className={cls.tooltipIcon}><Info size={16} /></span>
                                            </Tooltip>
                                        </div>
                                        <span className={cls.vadValue}>{formData.idle_timeout_ms || '10000'}</span>
                                    </div>
                                    <Slider
                                        value={Number(formData.idle_timeout_ms) || 10000}
                                        onChange={onChangeSliderHandler('idle_timeout_ms')}
                                        min={1000}
                                        max={60000}
                                        step={1000}
                                    />
                                </div>
                            </VStack>
                        </VStack>
                    </SectionCard>
                </VStack>
            </HStack>
        </VStack>
    )
})
