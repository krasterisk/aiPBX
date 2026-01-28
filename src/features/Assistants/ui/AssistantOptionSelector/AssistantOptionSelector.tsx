import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantOptionSelector.module.scss'
import { useTranslation } from 'react-i18next'
import React, { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from 'react'

import {
  Assistant,
  assistantFormActions,
  AssistantOptionsMain,
  AssistantOptionsModel,
  AssistantOptionsPrompts,
  getAssistantFormData,
  getAssistantFormMode,
  useAssistant
} from '@/entities/Assistants'

import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { ClientOptions, getUserAuthData, isUserAdmin } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { Tool, toolsPageActions } from '@/entities/Tools'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { TabPanelItem, TabsPanel } from '@/shared/ui/mui/TabsPanel'
import { AssistantCreateCardHeader } from '../AssistantCreateCardHeader/AssistantCreateCardHeader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { AssistantEditCardHeader } from '../AssistantEditCardHeader/AssistantEditCardHeader'

interface AssistantOptionsSelectorProps {
  className?: string
  onCreate?: (data: Assistant) => void
  onEdit?: (data: Assistant) => void
  assistantId?: string
  onDelete?: (id: string) => void
  error?: FetchBaseQueryError | SerializedError | undefined
}

export const AssistantOptionSelector = memo((props: AssistantOptionsSelectorProps) => {
  const {
    className,
    onEdit,
    onDelete,
    error,
    assistantId,
    onCreate
  } = props

  const { t } = useTranslation('assistants')
  const isAdmin = useSelector(isUserAdmin)
  const clientData = useSelector(getUserAuthData)
  const formFields = useSelector(getAssistantFormData)
  const mode = useSelector(getAssistantFormMode)
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState(0)
  const isFormInited = useRef(false)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const { data: assistant, isError } = useAssistant(assistantId ?? '', {
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
    value: Tool[]) => {
    const updatedFields = {
      ...formFields,
      tools: value
    }
    dispatch(assistantFormActions.updateForm(updatedFields))
  }, [dispatch, formFields])

  const onChangeClientHandler = useCallback((
    event: any,
    newValue: ClientOptions | null) => {
    if (newValue) {
      const updatedForm = {
        ...formFields,
        user: {
          id: newValue.id,
          name: newValue.name
        },
        userId: newValue.id
      }
      dispatch(assistantFormActions.updateForm(updatedForm))
      // dispatch(assistantsPageActions.setUser(newValue))
    } else {
      const updatedForm = {
        ...formFields,
        user: {
          id: '',
          name: ''
        },
        userId: ''
      }
      dispatch(assistantFormActions.updateForm(updatedForm))
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

  const tabItems: TabPanelItem[] = [
    {
      label: t('Главное'),
      content:
        <AssistantOptionsMain
          onChangeToolsHandler={onChangeToolsHandler}
          onChangeSelectHandler={onChangeSelectHandler}
          onChangeTextHandler={onChangeTextHandler}
          onChangeClientHandler={onChangeClientHandler}
        />
    },
    {
      label: t('Инструкции'),
      content:
        <AssistantOptionsPrompts
          onTextChangeHandler={onChangeTextHandler}
        />
    },
    ...(isAdmin
      ? [{
        label: t('Параметры'),
        content:
          <AssistantOptionsModel
            onTextChangeHandler={onChangeTextHandler}
          />
      }]
      : []
    )
  ]

  const actionHandler = useCallback(() => {
    if (!formFields) return

    if (isEdit) {
      onEdit?.(formFields)
    } else {
      onCreate?.(formFields)
    }
  }, [formFields, isEdit, onCreate, onEdit])

  return (
    <VStack
      gap={'8'}
      max
      className={classNames(cls.AssistantOptionSelector, {}, [className])}
    >
      {!isEdit
        ? <AssistantCreateCardHeader
          onCreate={actionHandler}
          variant={'diviner-top'}
        />
        : <AssistantEditCardHeader
          onEdit={actionHandler}
          onDelete={onDelete}
          assistantId={assistantId}
          assistantName={formFields?.name || ''}
        />
      }

      {isError
        ? <ErrorGetData
          title={!isEdit
            ? t('Ошибка при создании ассистента') || ''
            : t('Ошибка при обновлении ассистента') || ''
          }
          text={
            error && 'data' in error
              ? String(t((error.data as { message: string }).message))
              : String(t('Проверьте заполняемые поля и повторите ещё раз'))
          }
        />
        : ''}
      <TabsPanel
        className={cls.tab}
        tabItems={tabItems}
        value={activeTab}
        onChange={handleTabChange}

      />
    </VStack>
  )
}
)
