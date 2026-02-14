import { memo, useCallback, ChangeEvent, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { classNames } from '@/shared/lib/classNames/classNames'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
    Assistant,
    assistantFormActions,
    getAssistantFormData,
    useAssistant
} from '@/entities/Assistants'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { Tool, toolsPageActions } from '@/entities/Tools'
import { McpServer } from '@/entities/Mcp'
import { PromptSection } from './components/PromptSection'
import { MainInfoCard } from './components/MainInfoCard'
import { ModelParametersCard } from './components/ModelParametersCard'
import { SpeechSettingsCard } from './components/SpeechSettingsCard'
import { assistantTemplates } from '@/entities/Assistants/model/const/assistantTemplates'
import cls from './AssistantForm.module.scss'

interface AssistantFormProps {
    className?: string
    assistantId?: string
}

export const AssistantForm = memo((props: AssistantFormProps) => {
    const {
        className,
        assistantId
    } = props

    const dispatch = useAppDispatch()
    const { i18n } = useTranslation()
    const isAdmin = useSelector(isUserAdmin)
    const clientData = useSelector(getUserAuthData)
    const formFields = useSelector(getAssistantFormData)
    const isFormInited = useRef(false)
    const isTemplateApplied = useRef(false)
    const [searchParams] = useSearchParams()

    const { data: assistant } = useAssistant(assistantId ?? '', {
        skip: !assistantId
    })

    const isEdit = !!assistantId

    // Init form effect
    useEffect(() => {
        if (formFields === undefined) return

        if (!isEdit && !assistant && !isFormInited.current) {
            dispatch(assistantFormActions.initCreate())
            isFormInited.current = true
        }
    }, [assistant, dispatch, isEdit, formFields])

    // Apply template effect
    useEffect(() => {
        if (!isEdit && isFormInited.current && !isTemplateApplied.current && formFields) {
            const templateId = searchParams.get('template')
            if (templateId) {
                const template = assistantTemplates.find(t => t.id === templateId)
                if (template) {
                    const lang = i18n.language?.substring(0, 2) ?? 'ru'
                    const prompt = template.prompts[lang] ?? template.prompts.en ?? template.prompts.ru
                    dispatch(assistantFormActions.updateForm({
                        instruction: prompt
                    }))
                    isTemplateApplied.current = true
                }
            }
        }
    }, [isEdit, formFields, searchParams, dispatch, i18n.language])

    // Set user data effect
    useEffect(() => {
        if (formFields && !isEdit && !assistant && !isAdmin && clientData) {
            if (formFields.userId !== clientData.id) {
                dispatch(assistantFormActions.updateForm({
                    userId: clientData.id,
                    user: {
                        id: clientData.id,
                        name: clientData.name
                    }
                }))
            }
        }
    }, [assistant, dispatch, isEdit, isAdmin, clientData, formFields])

    // Init edit effect
    useEffect(() => {
        if (formFields === undefined) return

        if (isEdit && assistant && !isFormInited.current) {
            dispatch(assistantFormActions.initEdit(assistant))
            if (!isAdmin && clientData) {
                dispatch(assistantFormActions.updateForm({
                    userId: clientData.id,
                    user: {
                        id: clientData.id,
                        name: clientData.name
                    }
                }))
            }
            isFormInited.current = true
        }
    }, [assistant, isEdit, dispatch, isAdmin, clientData, formFields])

    const onChangeToolsHandler = useCallback((
        event: any,
        value: Tool[]
    ) => {
        const updatedFields = {
            ...formFields,
            tools: value
        }
        dispatch(assistantFormActions.updateForm(updatedFields))
    }, [dispatch, formFields])

    const onChangeMcpServersHandler = useCallback((
        event: any,
        value: McpServer[]
    ) => {
        const updatedFields = {
            ...formFields,
            mcpServers: value
        }
        dispatch(assistantFormActions.updateForm(updatedFields))
    }, [dispatch, formFields])

    const onChangeClientHandler = useCallback((id: string) => {
        const updatedForm = {
            ...formFields,
            user: {
                id: id,
                name: ''
            },
            userId: id
        }
        dispatch(assistantFormActions.updateForm(updatedForm))
        if (!id) {
            dispatch(toolsPageActions.setUser({ id: '', name: '' }))
        }
    }, [dispatch, formFields])

    const onChangeSelectHandler = useCallback((field: keyof Assistant) => (
        event: any,
        newValue: string
    ) => {
        const updatedFields = {
            ...formFields,
            [field]: newValue
        }

        if (field === 'model') {
            updatedFields.voice = ''

            if (newValue.startsWith('qwen')) {
                updatedFields.input_audio_format = 'pcm16'
                updatedFields.output_audio_format = 'pcm16'
            } else if (newValue.startsWith('gpt')) {
                updatedFields.input_audio_format = 'g711_alaw'
                updatedFields.output_audio_format = 'g711_alaw'
            }
        }

        dispatch(assistantFormActions.updateForm(updatedFields))
    }, [dispatch, formFields])

    const onChangeTextHandler = useCallback((field: keyof Assistant) =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = event.target.value
            const updatedFields = {
                ...formFields,
                [field]: value
            }
            dispatch(assistantFormActions.updateForm(updatedFields))
        }, [dispatch, formFields])

    const onChangeCheckboxHandler = useCallback((field: keyof Assistant) =>
        (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.checked
            const updatedFields = {
                ...formFields,
                [field]: value
            }
            dispatch(assistantFormActions.updateForm(updatedFields))
        }, [dispatch, formFields])

    return (
        <div className={classNames(cls.AssistantForm, {}, [className])}>
            <HStack max gap="16" align="start" className={cls.content}>
                {/* Left Column - Prompt Section (60-70% width) */}
                <div className={cls.leftColumn}>
                    <PromptSection
                        onChangeTextHandler={onChangeTextHandler}
                    />
                </div>

                {/* Right Column - Main, Parameters, VAD (30-40% width) */}
                <div className={cls.rightColumn}>
                    <VStack max gap="16">
                        {/* Main Info Card */}
                        <MainInfoCard
                            onChangeTextHandler={onChangeTextHandler}
                            onChangeSelectHandler={onChangeSelectHandler}
                            onChangeClientHandler={onChangeClientHandler}
                            onChangeToolsHandler={onChangeToolsHandler}
                            onChangeMcpServersHandler={onChangeMcpServersHandler}
                            onChangeCheckboxHandler={onChangeCheckboxHandler}
                        />



                        {/* Model Parameters Card (VAD + Temp) */}
                        <ModelParametersCard
                            onChangeTextHandler={onChangeTextHandler}
                        />

                        {/* Advanced Settings Card (Admin only) */}
                        <SpeechSettingsCard
                            onChangeTextHandler={onChangeTextHandler}
                        />
                    </VStack>
                </div>
            </HStack>
        </div>
    )
})
