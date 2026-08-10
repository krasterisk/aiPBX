import { memo, useCallback, useState, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
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
    SetupSectionKey,
    resolveExclusiveExpand,
} from '../../model/setupAccordion'
import { PromptSection } from './sections/PromptSection'
import { ParametersSection } from './sections/ParametersSection'
import { VadSection } from './sections/VadSection'
import { ToolsSection } from './sections/ToolsSection'
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
}

const SECTION_TITLE_KEYS: Record<SetupSectionKey, string> = {
    prompt: 'Промпт',
    parameters: 'Параметры',
    vad: 'VAD',
    tools: 'Инструменты',
}

export const AssistantSettingsForm = memo((props: AssistantSettingsFormProps) => {
    const { className, mode: modeProp, translationNs = 'playground' } = props
    const { t } = useTranslation(translationNs)
    const dispatch = useAppDispatch()
    const formFields = useSelector(getAssistantFormData)
    const sliceMode = useSelector(getAssistantFormMode)
    const mode = modeProp ?? sliceMode

    const [expanded, setExpanded] = useState<SetupSectionKey | false>(DEFAULT_SETUP_SECTION)

    const handleAccordionChange = useCallback(
        (panel: SetupSectionKey) => (_: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(resolveExclusiveExpand(expanded, panel, isExpanded))
        },
        [expanded],
    )

    const onChangeText = useCallback((field: keyof Assistant) =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            dispatch(assistantFormActions.updateForm({ [field]: event.target.value }))
        }, [dispatch])

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
    }, [dispatch])

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
                return <PromptSection onChangeText={onChangeText} />
            case 'parameters':
                return (
                    <ParametersSection
                        onChangeText={onChangeText}
                        onChangeSelect={onChangeSelect}
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
            {(Object.keys(SECTION_TITLE_KEYS) as SetupSectionKey[]).map((key) => (
                <Accordion
                    key={key}
                    expanded={expanded === key}
                    onChange={handleAccordionChange(key)}
                    disableGutters
                    className={cls.accordion}
                    data-testid={`AssistantSettingsForm.section.${key}`}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        className={cls.summary}
                        aria-controls={`assistant-settings-${key}-content`}
                        id={`assistant-settings-${key}-header`}
                    >
                        <span className={cls.summaryTitle}>{t(SECTION_TITLE_KEYS[key])}</span>
                    </AccordionSummary>
                    <AccordionDetails className={cls.details}>
                        {renderSectionBody(key)}
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    )
})
