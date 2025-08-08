import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantOptionSelector.module.scss'
import { useTranslation } from 'react-i18next'
import React, { ChangeEvent, memo, useCallback, useEffect, useState } from 'react'
import {
  Assistant,
  AssistantOptionsMain,
  AssistantOptionsModel,
  AssistantOptionsPrompts,
  assistantsPageActions,
  getAssistantsCreateFormFields,
  getAssistantsEditFormFields, initAssistant,
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

interface AddistantOptionSelecterProps {
  className?: string
  isEdit: boolean
  onCreate?: (data: Assistant) => void
  onEdit?: (data: Assistant) => void
  assistantId?: string
  onDelete?: (id: string) => void
  error?: FetchBaseQueryError | SerializedError | undefined
}

export const AssistantOptionSelector = memo((props: AddistantOptionSelecterProps) => {
  const {
    className,
    onEdit,
    onDelete,
    error,
    isEdit,
    assistantId,
    onCreate
  } = props

  const { t } = useTranslation('assistants')
  const isAdmin = useSelector(isUserAdmin)
  const clientData = useSelector(getUserAuthData)
  const editFields = useSelector(getAssistantsEditFormFields)
  const createFields = useSelector(getAssistantsCreateFormFields)
  const formFields = isEdit ? editFields : createFields
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const { data: assistant, isError, isLoading } = useAssistant(assistantId!, {
    skip: !assistantId
  })

  const updateAction = isEdit
    ? assistantsPageActions.updateAssistantsEditForm
    : assistantsPageActions.updateAssistantsCreateForm

  useEffect(() => {
    if (!isEdit && !isAdmin && clientData?.id && clientData.username) {
      dispatch(updateAction({
        ...createFields,
        user: {
          id: clientData?.vpbx_user_id || clientData.id,
          name: clientData?.username
        },
        userId: clientData.id
      }))
    }
  }, [clientData, isAdmin, isEdit, dispatch, updateAction, createFields])

  useEffect(() => {
    if (isEdit && assistant) {
      dispatch(updateAction(assistant))
    }
  }, [assistant, isEdit, dispatch, updateAction])

  useEffect(() => {
    if (!isEdit) {
      dispatch(updateAction(initAssistant))
    }
  }, [dispatch, isEdit])

  const onChangeToolsHandler = useCallback((
    event: any,
    value: Tool[]) => {
    const updatedFields = {
      ...formFields,
      tools: value
    }
    dispatch(updateAction(updatedFields))
  }, [dispatch, formFields, updateAction])

  const onChangeClientHandler = useCallback((
    event: any,
    newValue: ClientOptions | null) => {
    if (newValue) {
      const updateForm = {
        ...formFields,
        user: {
          id: newValue.id,
          name: newValue.name
        },
        userId: newValue.id
      }
      dispatch(updateAction(updateForm))
      // dispatch(assistantsPageActions.setUser(newValue))
    } else {
      const updateForm = {
        ...formFields,
        user: {
          id: '',
          name: ''
        },
        userId: ''
      }
      dispatch(updateAction(updateForm))
      dispatch(toolsPageActions.setUser({ id: '', name: '' }))
    }
  }, [dispatch, formFields, updateAction])

  const onChangeSelectHandler = useCallback((field: keyof Assistant) => (
    event: any,
    newValue: string
  ) => {
    const updatedFields = {
      ...formFields,
      [field]: newValue
    }
    dispatch(updateAction(updatedFields))
  }, [dispatch, formFields, updateAction])

  const onChangeTextHandler = useCallback((field: keyof Assistant) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      const updatedFields = {
        ...formFields,
        [field]: value
      }
      dispatch(updateAction(updatedFields))
    }, [dispatch, formFields, updateAction])

  const tabItems: TabPanelItem[] = [
    {
      label: t('Главное'),
      content:
                    <AssistantOptionsMain
                        isEdit={isEdit}
                        onChangeToolsHandler={onChangeToolsHandler}
                        onChangeSelectHandler={onChangeSelectHandler}
                        onChangeTextHandler={onChangeTextHandler}
                        onChangeClientHandler={onChangeClientHandler}
                    />
    },
    {
      label: t('Инструкции для модели'),
      content:
                  <AssistantOptionsPrompts
                      isEdit={isEdit}
                        onTextChangeHandler={onChangeTextHandler}
                  />
    },
    {
      label: t('Параметры модели'),
      content:
                    <AssistantOptionsModel
                        isEdit={isEdit}
                        onTextChangeHandler={onChangeTextHandler}
                        onChangeSelectHandler={onChangeTextHandler}
                    />
    }

  ]

  const actionHandler = useCallback(() => {
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
                  ? <AssistantCreateCardHeader onCreate={actionHandler} variant={'diviner-top'}/>
                  : <AssistantEditCardHeader
                        onEdit={actionHandler}
                        onDelete={onDelete}
                        assistantId={assistantId}
                        assistantName={formFields.name}
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
