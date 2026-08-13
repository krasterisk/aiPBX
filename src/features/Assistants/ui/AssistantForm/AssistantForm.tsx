import { memo, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
    assistantFormActions,
    getAssistantFormData,
    useAssistant,
    assistantTemplates,
} from '@/entities/Assistants'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
// eslint-disable-next-line krasterisk-plugin/layer-imports -- Assistants → AssistantSettingsForm (phase 11 D-35/D-36 / RESEARCH A5)
import { AssistantSettingsForm } from '@/features/AssistantSettingsForm'
import { PipelineCard } from './components/PipelineCard/PipelineCard'
import { AssistantFieldError } from '../../model/validateAssistant'

import cls from './AssistantForm.module.scss'

interface AssistantFormProps {
    className?: string
    assistantId?: string
    fieldError?: AssistantFieldError | null
    onClearFieldError?: () => void
}

export const AssistantForm = memo((props: AssistantFormProps) => {
    const {
        className,
        assistantId,
        fieldError,
        onClearFieldError,
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
        skip: !assistantId,
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
                        instruction: prompt,
                    }))
                    isTemplateApplied.current = true
                }
            }

            // Apply generated custom prompt from sessionStorage
            const isGenerated = searchParams.get('generated')
            if (isGenerated === 'true') {
                const generatedInstruction = sessionStorage.getItem('generated_instruction')
                if (generatedInstruction) {
                    dispatch(assistantFormActions.updateForm({
                        instruction: generatedInstruction,
                    }))
                    sessionStorage.removeItem('generated_instruction')
                    isTemplateApplied.current = true
                }
            }

            // Apply copied assistant data from sessionStorage
            const isCopy = searchParams.get('copy')
            if (isCopy === 'true') {
                const copiedData = sessionStorage.getItem('copied_assistant')
                if (copiedData) {
                    try {
                        const parsed = JSON.parse(copiedData)
                        dispatch(assistantFormActions.updateForm(parsed))
                        sessionStorage.removeItem('copied_assistant')
                        isTemplateApplied.current = true
                    } catch (e) {
                        // ignore parse errors
                    }
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
                        name: clientData.name,
                    },
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
                        name: clientData.name,
                    },
                }))
            }
            isFormInited.current = true
        }
    }, [assistant, isEdit, dispatch, isAdmin, clientData, formFields])

    return (
        <div className={classNames(cls.AssistantForm, {}, [className])}>
            <VStack max gap="0" className={cls.content}>
                <AssistantSettingsForm
                    mode={isEdit ? 'edit' : 'create'}
                    translationNs="assistants"
                    fieldError={fieldError}
                    onClearFieldError={onClearFieldError}
                />
                <PipelineCard assistantId={assistantId} />
            </VStack>
        </div>
    )
})
