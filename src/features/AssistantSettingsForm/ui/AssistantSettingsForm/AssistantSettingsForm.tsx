import { memo, useCallback, useState, useEffect, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { FileText, Wrench, SlidersHorizontal, AudioLines, LucideIcon } from 'lucide-react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
    Assistant,
    assistantFormActions,
    getAssistantFormData,
    getAssistantFormMode,
} from '@/entities/Assistants'
import { Tool, toolsPageActions } from '@/entities/Tools'
import { McpServer } from '@/entities/Mcp'
import {
    DEFAULT_SETUP_SECTION,
    SETUP_SECTIONS,
    SetupSectionKey,
    resolveExclusiveExpand,
} from '../../model/setupAccordion'
import { PromptSection } from './sections/PromptSection'
import { ParametersSection } from './sections/ParametersSection'
import { VadSection } from './sections/VadSection'
import { ToolsSection } from './sections/ToolsSection'
import { SettingsAccordion } from './SettingsAccordion'
import cls from './AssistantSettingsForm.module.scss'

interface AssistantSettingsFormProps {
    className?: string
    /** When true, shows create-only fields (e.g. admin ClientSelect). Playground uses edit. */
    mode?: 'create' | 'edit'
    /**
     * i18n namespace for accordion section titles.
     * Playground Setup uses `playground`; Assistants page prefers `assistants` (D-44).
     */
    translationNs?: 'playground' | 'assistants'
    fieldError?: {
        field: 'name' | 'instruction' | 'model' | 'voice'
        section: SetupSectionKey
        messageKey: string
    } | null
    onClearFieldError?: () => void
}

const SECTION_TITLE_KEYS: Record<SetupSectionKey, string> = {
    prompt: 'Промпт',
    tools: 'Инструменты',
    parameters: 'Параметры',
    vad: 'VAD',
}

const SECTION_ICONS: Record<SetupSectionKey, LucideIcon> = {
    prompt: FileText,
    tools: Wrench,
    parameters: SlidersHorizontal,
    vad: AudioLines,
}

const focusSettingsField = (field: string) => {
    const root = document.querySelector(`[data-testid="AssistantSettingsForm.${field}"]`)
    const el = root?.querySelector<HTMLElement>('input, textarea')
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el?.focus()
}

export const AssistantSettingsForm = memo((props: AssistantSettingsFormProps) => {
    const {
        className,
        mode: modeProp,
        translationNs = 'playground',
        fieldError,
        onClearFieldError,
    } = props
    const { t } = useTranslation(translationNs)
    const dispatch = useAppDispatch()
    const formFields = useSelector(getAssistantFormData)
    const sliceMode = useSelector(getAssistantFormMode)
    const mode = modeProp ?? sliceMode

    const [expanded, setExpanded] = useState<SetupSectionKey | false>(DEFAULT_SETUP_SECTION)

    useEffect(() => {
        if (!fieldError) return
        setExpanded(fieldError.section)
        const timer = window.setTimeout(() => {
            focusSettingsField(fieldError.field)
        }, 350)
        return () => { window.clearTimeout(timer) }
    }, [fieldError])

    const onChangeText = useCallback((field: keyof Assistant) =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            dispatch(assistantFormActions.updateForm({ [field]: event.target.value }))
            if (fieldError?.field === field) {
                onClearFieldError?.()
            }
        }, [dispatch, fieldError, onClearFieldError])

    const onChangeSelect = useCallback((field: keyof Assistant) => (
        _event: any,
        newValue: string,
    ) => {
        const updated: Partial<Assistant> = { [field]: newValue }
        if (field === 'model') {
            updated.voice = ''
            if (newValue.startsWith('qwen')) {
                updated.input_audio_format = 'pcm16'
                updated.output_audio_format = 'pcm16'
            } else if (newValue.startsWith('gpt')) {
                updated.input_audio_format = 'g711_alaw'
                updated.output_audio_format = 'g711_alaw'
            }
        }
        dispatch(assistantFormActions.updateForm(updated))
        if (fieldError?.field === field || (field === 'model' && fieldError?.field === 'voice')) {
            onClearFieldError?.()
        }
    }, [dispatch, fieldError, onClearFieldError])

    const onChangeCheckbox = useCallback((field: keyof Assistant) =>
        (event: ChangeEvent<HTMLInputElement>) => {
            dispatch(assistantFormActions.updateForm({ [field]: event.target.checked }))
        }, [dispatch])

    const onChangeTools = useCallback((
        _event: any,
        value: Tool[],
    ) => {
        dispatch(assistantFormActions.updateForm({
            ...formFields,
            tools: value,
        }))
    }, [dispatch, formFields])

    const onChangeMcpServers = useCallback((
        _event: any,
        value: McpServer[],
    ) => {
        dispatch(assistantFormActions.updateForm({
            ...formFields,
            mcpServers: value,
        }))
    }, [dispatch, formFields])

    const onChangeClient = useCallback((id: string) => {
        dispatch(assistantFormActions.updateForm({
            ...formFields,
            user: { id, name: '' },
            userId: id,
        }))
        if (!id) {
            dispatch(toolsPageActions.setUser({ id: '', name: '' }))
        }
    }, [dispatch, formFields])

    const renderSectionBody = (key: SetupSectionKey) => {
        switch (key) {
            case 'prompt':
                return (
                    <PromptSection
                        onChangeText={onChangeText}
                        errorMessage={fieldError?.field === 'instruction' ? String(t(fieldError.messageKey)) : undefined}
                    />
                )
            case 'parameters':
                return (
                    <ParametersSection
                        onChangeText={onChangeText}
                        onChangeSelect={onChangeSelect}
                        fieldError={fieldError}
                        errorMessage={fieldError ? String(t(fieldError.messageKey)) : undefined}
                    />
                )
            case 'vad':
                return (
                    <VadSection
                        onChangeText={onChangeText}
                        onChangeCheckbox={onChangeCheckbox}
                    />
                )
            case 'tools':
                return (
                    <ToolsSection
                        mode={mode}
                        onChangeTools={onChangeTools}
                        onChangeMcpServers={onChangeMcpServers}
                        onChangeCheckbox={onChangeCheckbox}
                        onChangeClient={onChangeClient}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div
            className={classNames(cls.AssistantSettingsForm, {}, [className])}
            data-testid="AssistantSettingsForm"
        >
            {fieldError && (
                <p className={cls.formError} role="alert">
                    {t(fieldError.messageKey)}
                </p>
            )}
            {SETUP_SECTIONS.map((key) => (
                <SettingsAccordion
                    key={key}
                    id={`assistant-settings-${key}`}
                    title={String(t(SECTION_TITLE_KEYS[key]) ?? '')}
                    icon={SECTION_ICONS[key]}
                    expanded={expanded === key}
                    onChange={(isExpanded) => {
                        setExpanded(resolveExclusiveExpand(expanded, key, isExpanded))
                    }}
                    error={fieldError?.section === key}
                    data-testid={`AssistantSettingsForm.section.${key}`}
                >
                    {renderSectionBody(key)}
                </SettingsAccordion>
            ))}
        </div>
    )
})
