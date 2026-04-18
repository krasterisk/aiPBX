import { memo, useCallback, useEffect, useRef, useState, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '@/shared/ui/redesigned/Button'
import { AssistantOptions, AssistantSelect, Assistant, useUpdateAssistant, assistantFormActions, getAssistantFormData } from '@/entities/Assistants'
import {
    Play, Square, Terminal, AlertTriangle,
    MessageSquareText, Settings2, Mic,
    Save, Send,
} from 'lucide-react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { toast } from 'react-toastify'
// eslint-disable-next-line krasterisk-plugin/layer-imports
import { getPlaygroundFormData, getPlaygroundFormLoading, playgroundAssistantFormActions } from '@/pages/Playground'
import { Textarea } from '@/shared/ui/mui/Textarea'
// Reuse existing AssistantForm sub-components (FSD: features → entities)
// eslint-disable-next-line krasterisk-plugin/layer-imports
import { MainInfoCard, ModelParametersCard, VadSettingsCard } from '@/features/Assistants'
import { SettingsPopover, SettingsTab } from '../SettingsPopover/SettingsPopover'
import cls from './PlaygroundHeader.module.scss'
import popCls from '../SettingsPopover/SettingsPopover.module.scss'
import { Tool } from '@/entities/Tools'
import { McpServer } from '@/entities/Mcp'

interface PlaygroundHeaderProps {
    className?: string
    selectedAssistant: AssistantOptions | null
    onSelectAssistant: (event: any, value: AssistantOptions | null) => void
    isSessionActive: boolean
    isConnecting: boolean
    onStartSession: () => void
    onStopSession: () => void
    onUpdateSession?: (params: Record<string, unknown>) => void
    userId?: string
    isAdmin?: boolean
    hasAssistant?: boolean
}

function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const PlaygroundHeader = memo((props: PlaygroundHeaderProps) => {
    const {
        className,
        selectedAssistant,
        onSelectAssistant,
        isSessionActive,
        isConnecting,
        onStartSession,
        onStopSession,
        onUpdateSession,
        userId,
        isAdmin,
        hasAssistant,
    } = props

    const { t } = useTranslation('playground')
    const dispatch = useDispatch()

    const formData = useSelector(getPlaygroundFormData)
    const entityFormData = useSelector(getAssistantFormData)
    const isLoading = useSelector(getPlaygroundFormLoading)

    const [updateAssistant, { isLoading: isUpdating }] = useUpdateAssistant()

    // Timer
    const [elapsed, setElapsed] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (isSessionActive) {
            setElapsed(0)
            intervalRef.current = setInterval(() => { setElapsed(prev => prev + 1) }, 1000)
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current)
            setElapsed(0)
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    }, [isSessionActive])

    // Active popover
    const [activeTab, setActiveTab] = useState<SettingsTab>(null)

    const toggleTab = useCallback((tab: SettingsTab) => {
        setActiveTab(prev => prev === tab ? null : tab)
    }, [])

    const closePopover = useCallback(() => { setActiveTab(null) }, [])

    // Prompt handler — directly dispatches to playground form
    const onChangePrompt = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(playgroundAssistantFormActions.updateFormField({ instruction: e.target.value }))
    }, [dispatch])

    // Generic handlers for MainInfoCard (it expects these signatures)
    const onChangeSelectHandler = useCallback((field: keyof Assistant) => (event: any, newValue: string) => {
        dispatch(assistantFormActions.updateForm({ [field]: newValue }))
    }, [dispatch])

    const onChangeTextHandler = useCallback((field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(assistantFormActions.updateForm({ [field]: event.target.value }))
    }, [dispatch])

    const onChangeCheckboxHandler = useCallback((field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(assistantFormActions.updateForm({ [field]: event.target.checked }))
    }, [dispatch])

    const onChangeToolsHandler = useCallback((_: any, value: Tool[]) => {
        dispatch(assistantFormActions.updateForm({ tools: value }))
    }, [dispatch])

    const onChangeMcpServersHandler = useCallback((_: any, value: McpServer[]) => {
        dispatch(assistantFormActions.updateForm({ mcpServers: value }))
    }, [dispatch])

    // Save to DB — reads from entity form (sub-components write there)
    const handleSave = useCallback(async () => {
        const data = entityFormData
        if (!data || !data.id) return
        try {
            dispatch(playgroundAssistantFormActions.setLoading(true))
            // Sync entity form back to playground form before saving
            dispatch(playgroundAssistantFormActions.updateFormField(data))
            await updateAssistant(data).unwrap()
            dispatch(playgroundAssistantFormActions.setError(undefined))
            toast.success(t('Сохранено успешно'))
            closePopover()
        } catch (error) {
            dispatch(playgroundAssistantFormActions.setError(String(error)))
        } finally {
            dispatch(playgroundAssistantFormActions.setLoading(false))
        }
    }, [entityFormData, updateAssistant, dispatch, t, closePopover])

    // Apply live to session — also reads from entity form
    const handleApplyToSession = useCallback(() => {
        const data = entityFormData
        if (!data || !onUpdateSession) return
        // Sync entity form back to playground form
        dispatch(playgroundAssistantFormActions.updateFormField(data))
        onUpdateSession({
            instruction: data.instruction,
            temperature: data.temperature,
            turn_detection_threshold: data.turn_detection_threshold,
            turn_detection_prefix_padding_ms: data.turn_detection_prefix_padding_ms,
            turn_detection_silence_duration_ms: data.turn_detection_silence_duration_ms,
            idle_timeout_ms: data.idle_timeout_ms,
            interrupt_response: data.interrupt_response,
        })
        toast.info(t('Настройки применены к сессии'))
    }, [entityFormData, onUpdateSession, t, dispatch])

    const hasMic = typeof navigator !== 'undefined' && !!navigator.mediaDevices

    // Footer buttons shared across popovers
    const popoverFooter = formData ? (
        <>
            {isSessionActive && onUpdateSession && (
                <Button variant="outline" onClick={handleApplyToSession} addonLeft={<Send size={14} />} size="s">
                    {t('Применить к сессии')}
                </Button>
            )}
            <div style={{ flex: 1 }} />
            <Button variant="glass-action" onClick={handleSave} disabled={isLoading || isUpdating} addonLeft={<Save size={14} />} size="s">
                {isUpdating ? t('Применение...') : t('Применить')}
            </Button>
        </>
    ) : undefined

    return (
        <>
            <div className={classNames(cls.PlaygroundHeader, {}, [className])}>
                <div className={cls.leftSection}>
                    <span className={cls.title}>
                        <Terminal size={18} className={cls.titleIcon} />
                        {t('Песочница')}
                    </span>

                    <div className={cls.assistantSelect}>
                        <AssistantSelect
                            label={t('Выберите ассистента') || 'Assistant'}
                            value={selectedAssistant}
                            onChangeAssistant={onSelectAssistant}
                            userId={isAdmin ? undefined : userId}
                            fullWidth
                        />
                    </div>

                    {!hasMic && (
                        <span className={cls.micError}>
                            <AlertTriangle size={14} />
                            {t('Микрофон недоступен. Для работы микрофона требуется HTTPS или localhost.')}
                        </span>
                    )}
                </div>

                {/* Settings buttons — only shown when assistant is selected */}
                {hasAssistant && formData && (
                    <div className={popCls.settingsButtons}>
                        <button
                            className={activeTab === 'prompt' ? popCls.settingsBtnActive : popCls.settingsBtn}
                            onClick={() => { toggleTab('prompt') }}
                        >
                            <MessageSquareText size={14} />
                            {t('Промпт')}
                        </button>
                        <button
                            className={activeTab === 'model' ? popCls.settingsBtnActive : popCls.settingsBtn}
                            onClick={() => { toggleTab('model') }}
                        >
                            <Settings2 size={14} />
                            {t('Параметры')}
                        </button>
                        <button
                            className={activeTab === 'vad' ? popCls.settingsBtnActive : popCls.settingsBtn}
                            onClick={() => { toggleTab('vad') }}
                        >
                            <Mic size={14} />
                            VAD
                        </button>
                    </div>
                )}

                <div className={cls.rightSection}>
                    {isSessionActive && (
                        <span className={classNames(cls.timer, { [cls.timerActive]: isSessionActive })}>
                            {formatDuration(elapsed)}
                        </span>
                    )}

                    {!isSessionActive ? (
                        <Button
                            variant="glass-action"
                            disabled={!selectedAssistant || isConnecting || !hasMic}
                            onClick={onStartSession}
                            addonLeft={<Play size={16} />}
                            size="s"
                        >
                            {isConnecting ? t('Подключение...') : t('Начать сессию')}
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            color="error"
                            onClick={onStopSession}
                            addonLeft={<Square size={16} />}
                            size="s"
                        >
                            {t('Завершить сессию')}
                        </Button>
                    )}
                </div>
            </div>

            {/* ===== PROMPT POPOVER ===== */}
            <SettingsPopover
                isOpen={activeTab === 'prompt'}
                onClose={closePopover}
                title={t('Промпт')}
                icon={MessageSquareText}
                wide
                footer={popoverFooter}
            >
                {formData && (
                    <Textarea
                        label={t('Инструкция для ассистента') || ''}
                        value={formData.instruction || ''}
                        onChange={onChangePrompt}
                        minRows={8}
                        multiline
                        fullWidth
                        placeholder={t('Введите инструкции для ИИ...') || ''}
                        className={popCls.promptTextarea}
                    />
                )}
            </SettingsPopover>

            {/* ===== MODEL/SETTINGS POPOVER — reuses existing AssistantForm components ===== */}
            <SettingsPopover
                isOpen={activeTab === 'model'}
                onClose={closePopover}
                title={t('Параметры')}
                icon={Settings2}
                wide
                footer={popoverFooter}
            >
                <MainInfoCard
                    onChangeTextHandler={onChangeTextHandler}
                    onChangeSelectHandler={onChangeSelectHandler}
                    onChangeToolsHandler={onChangeToolsHandler}
                    onChangeMcpServersHandler={onChangeMcpServersHandler}
                    onChangeCheckboxHandler={onChangeCheckboxHandler}
                />
                <ModelParametersCard
                    onChangeTextHandler={onChangeTextHandler}
                    initialExpanded
                />
            </SettingsPopover>

            {/* ===== VAD POPOVER — reuses existing VadSettingsCard ===== */}
            <SettingsPopover
                isOpen={activeTab === 'vad'}
                onClose={closePopover}
                title="VAD"
                icon={Mic}
                wide
                footer={popoverFooter}
            >
                <VadSettingsCard
                    onChangeTextHandler={onChangeTextHandler}
                    onChangeSelectHandler={onChangeSelectHandler}
                    onChangeCheckboxHandler={onChangeCheckboxHandler}
                    initialExpanded
                />
            </SettingsPopover>
        </>
    )
})
