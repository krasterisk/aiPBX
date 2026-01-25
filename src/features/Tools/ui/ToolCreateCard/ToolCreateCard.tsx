import { useTranslation } from 'react-i18next'
import cls from './ToolCreateCard.module.scss'
import React, { ChangeEvent, memo, useCallback, useEffect, useState } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { classNames } from '@/shared/lib/classNames/classNames'
import {
  Tool,
  toolsPageActions,
  getToolsUser,
  getToolsCreateForm,
  ToolTypeSelect,
  ToolType
} from '@/entities/Tools'
import { useSelector } from 'react-redux'
import { ClientOptions, ClientSelect, getUserAuthData, isUserAdmin } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { ToolCreateCardHeader } from '../ToolCreateCardHeader/ToolCreateCardHeader'
import { Check } from '@/shared/ui/mui/Check'
import { ToolAddParam } from '../ToolAddParam/ToolAddParam'
import { Combobox } from '@/shared/ui/mui/Combobox'

interface ToolCreateCardProps {
  className?: string
  onCreate?: (data: Tool) => void
  isError?: boolean
  error?: FetchBaseQueryError | SerializedError | undefined
}

export const ToolCreateCard = memo((props: ToolCreateCardProps) => {
  const {
    className,
    onCreate,
    isError,
    error
  } = props

  const { t } = useTranslation('tools')
  const isAdmin = useSelector(isUserAdmin)
  const authData = useSelector(getUserAuthData)
  const clientValues = useSelector(getToolsUser)
  const dispatch = useAppDispatch()
  const formFields = useSelector(getToolsCreateForm)
  const [jsonText, setJsonText] = useState(() =>
    formFields?.toolData ? JSON.stringify(formFields.toolData, null, 2) : ''
  )
  const [headersText, setHeadersText] = useState(() =>
    formFields?.headers ? JSON.stringify(formFields.headers, null, 2) : ''
  )

  useEffect(() => {
    dispatch(toolsPageActions.resetToolCreateForm())
  }, [dispatch])

  useEffect(() => {
    if (formFields?.toolData) {
      setJsonText(JSON.stringify(formFields.toolData, null, 2))
    }
  }, [formFields?.toolData])

  useEffect(() => {
    if (formFields?.headers) {
      setHeadersText(JSON.stringify(formFields.headers, null, 2))
    }
  }, [formFields?.headers])

  useEffect(() => {
    if (!isAdmin && authData && formFields?.userId !== authData.id) {
      const updatedForm = {
        ...formFields,
        user: { id: authData.id, name: authData.username || authData.name || '' },
        userId: authData.id
      }
      dispatch(toolsPageActions.updateToolsCreateForm(updatedForm))
    }
  }, [authData, dispatch, formFields, isAdmin])

  const onJsonChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const text = event.target.value
      setJsonText(text)

      try {
        const parsed = JSON.parse(text)
        const updatedForm = {
          ...formFields,
          toolData: parsed
        }
        dispatch(toolsPageActions.updateToolsCreateForm(updatedForm))
      } catch {
        // невалидный JSON — просто не трогаем store
      }
    },
    [dispatch, formFields]
  )

  const onHeadersChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const text = event.target.value
      setHeadersText(text)

      try {
        const parsed = JSON.parse(text)
        const updatedForm = {
          ...formFields,
          headers: parsed
        }
        dispatch(toolsPageActions.updateToolsCreateForm(updatedForm))
      } catch {
        // невалидный JSON
      }
    },
    [dispatch, formFields]
  )

  const [hasWebhook, setHasWebhook] = useState(false)

  const onToggleWebhookHandler = useCallback(() => {
    setHasWebhook(prev => {
      const newVal = !prev
      if (!newVal) {
        dispatch(toolsPageActions.updateToolsCreateForm({
          ...formFields,
          webhook: ''
        }))
      }
      return newVal
    })
  }, [dispatch, formFields])

  const onChangeMethodHandler = useCallback((event: any, newValue: { value: string, descriptions: string } | null) => {
    if (newValue) {
      const updatedForm = {
        ...formFields,
        method: newValue.value
      }
      dispatch(toolsPageActions.updateToolsCreateForm(updatedForm))
    }
  }, [dispatch, formFields])

  const authHeader = (formFields?.headers as Record<string, string>)?.Authorization || ''
  let currentAuthType = 'none'
  let currentToken = ''
  let currentUsername = ''
  let currentPassword = ''

  if (authHeader.startsWith('Bearer ')) {
    currentAuthType = 'bearer'
    currentToken = authHeader.substring(7)
  } else if (authHeader.startsWith('Basic ')) {
    currentAuthType = 'basic'
    try {
      const decoded = atob(authHeader.substring(6))
      const [u, p] = decoded.split(':')
      currentUsername = u || ''
      currentPassword = p || ''
    } catch (e) { }
  }

  const updateAuthHeader = useCallback((type: string, data: { token?: string, username?: string, password?: string }) => {
    const newHeaders = { ...(formFields?.headers || {}) } as Record<string, string>
    if (type === 'none') {
      delete newHeaders.Authorization
    } else if (type === 'bearer') {
      newHeaders.Authorization = `Bearer ${data.token ?? currentToken}`
    } else if (type === 'basic') {
      const u = data.username ?? currentUsername
      const p = data.password ?? currentPassword
      newHeaders.Authorization = `Basic ${btoa(`${u}:${p}`)}`
    }

    dispatch(toolsPageActions.updateToolsCreateForm({
      ...formFields,
      headers: newHeaders
    }))
  }, [dispatch, formFields, currentToken, currentUsername, currentPassword])

  const onChangeClientHandler = useCallback((
    event: any,
    newValue: ClientOptions | null) => {
    if (newValue) {
      const updatedForm = {
        ...formFields,
        user: newValue,
        userId: newValue.id
      }

      dispatch(toolsPageActions.setUser(newValue))
      dispatch(toolsPageActions.updateToolsCreateForm(updatedForm))
    } else {
      dispatch(toolsPageActions.setUser({ id: '', name: '' }))
      dispatch(toolsPageActions.updateToolsCreateForm({
        user: { id: '', name: '' },
        userId: ''
      }))
    }
  }, [dispatch, formFields])

  const createTextChangeHandler = (field: keyof Tool) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value

      const updatedForm = {
        ...formFields,
        [field]: value
      }
      dispatch(toolsPageActions.updateToolsCreateForm(updatedForm))
    }

  const createChangeTypeHandler = (event: any, functionType: ToolType) => {
    const type = functionType.value
    dispatch(toolsPageActions.updateToolCreateType(type))
  }

  const toggleStrictHandler = useCallback(() => {
    const updatedForm = {
      ...formFields,
      strict: !formFields?.strict
    }
    dispatch(toolsPageActions.updateToolsCreateForm(updatedForm))
  }, [dispatch, formFields])

  const IsAdminOptions = (
    <>
      <ClientSelect
        value={clientValues}
        onChangeClient={onChangeClientHandler}
        label={String(t('Клиент'))}
        className={cls.client}
        data-testid={'ToolCreateCard.ClientSelect'}
      />
    </>
  )

  const createHandler = useCallback(() => {
    if (formFields) {
      onCreate?.(formFields)
    }
  }, [formFields, onCreate])

  const methods = [
    { value: 'GET', descriptions: 'GET' },
    { value: 'POST', descriptions: 'POST' },
    { value: 'PUT', descriptions: 'PUT' },
    { value: 'PATCH', descriptions: 'PATCH' },
    { value: 'DELETE', descriptions: 'DELETE' }
  ]

  const authTypes = [
    { value: 'none', descriptions: t('Нет') },
    { value: 'bearer', descriptions: t('Bearer Token') },
    { value: 'basic', descriptions: t('Basic Auth') }
  ]

  const functionType = (
    <>
      <Textarea
        label={t('Описание') ?? ''}
        onChange={createTextChangeHandler('description')}
        data-testid={'ToolCardCreate.description'}
        value={formFields?.description || ''}
        minRows={3}
        multiline
      />
      <Check
        label={t('Строгий режим вызова') || ''}
        onChange={toggleStrictHandler}
        checked={formFields?.strict || false}
      />
      <ToolAddParam
        parameters={formFields?.parameters}
        toolName={formFields?.name || ''}
      />
      <Check
        label={t('Вебхук') || ''}
        onChange={onToggleWebhookHandler}
        checked={hasWebhook}
      />
      {hasWebhook && (
        <>
          <Textarea
            label={t('Адрес вебхука') ?? ''}
            onChange={createTextChangeHandler('webhook')}
            data-testid={'ToolCardCreate.webhook'}
            value={formFields?.webhook || ''}
          />
          <Combobox
            label={t('Метод запроса') ?? ''}
            options={methods}
            value={methods.find(m => m.value === (formFields?.method || 'GET')) || methods[0]}
            onChange={onChangeMethodHandler}
            getOptionLabel={(option) => option.descriptions}
            getOptionKey={(option) => option.value}
            disableClearable
          />
          <Combobox
            label={t('Тип авторизации') ?? ''}
            options={authTypes}
            value={authTypes.find(a => a.value === currentAuthType) || authTypes[0]}
            onChange={(e, v) => v && updateAuthHeader(v.value, {})}
            getOptionLabel={(option) => option.descriptions}
            getOptionKey={(option) => option.value}
            disableClearable
          />
          {currentAuthType === 'bearer' && (
            <Textarea
              label={t('Токен') ?? ''}
              onChange={(e) => updateAuthHeader('bearer', { token: e.target.value })}
              value={currentToken}
            />
          )}
          {currentAuthType === 'basic' && (
            <>
              <Textarea
                label={t('Логин') ?? ''}
                onChange={(e) => updateAuthHeader('basic', { username: e.target.value })}
                value={currentUsername}
              />
              <Textarea
                label={t('Пароль') ?? ''}
                onChange={(e) => updateAuthHeader('basic', { password: e.target.value })}
                value={currentPassword}
              />
            </>
          )}
          <Textarea
            label={t('Заголовки (JSON)') ?? ''}
            onChange={onHeadersChangeHandler}
            data-testid={'ToolCardCreate.headers'}
            value={headersText}
            minRows={3}
            multiline
          />
        </>
      )}
    </>
  )

  const toolType = (
    <>
      <Textarea
        label={t('Параметры') ?? ''}
        onChange={onJsonChangeHandler}
        data-testid={'ToolCardCreate.mcp'}
        value={jsonText}
        minRows={3}
        multiline
      />
    </>
  )

  return (
    <VStack
      gap={'8'}
      max
      className={classNames(cls.ToolCreateCard, {}, [className])}
    >
      <ToolCreateCardHeader onCreate={createHandler} variant={'diviner-top'} />
      {isError
        ? <ErrorGetData
          title={t('Ошибка при создании функции') || ''}
          text={
            error && 'data' in error
              ? String(t((error.data as { message: string }).message))
              : String(t('Проверьте заполняемые поля и повторите ещё раз'))
          }
        />
        : ''}
      <Card
        max
        padding={'16'}
        border={'partial'}
      >
        <VStack gap={'16'} max>
          {isAdmin && IsAdminOptions}

          <Textarea
            label={t('Наименование') ?? ''}
            onChange={createTextChangeHandler('name')}
            data-testid={'ToolCardCreate.name'}
            value={formFields?.name || ''}
          />
          <ToolTypeSelect
            label={t('Тип') ?? ''}
            value={formFields?.type}
            onChangeToolType={createChangeTypeHandler}
            data-testid={'ToolCardCreate.type'}
          />
          {formFields?.type && formFields?.type === 'function' && functionType}
          {formFields?.type && formFields?.type !== 'function' && toolType}
          <Textarea
            label={t('Комментарий') ?? ''}
            onChange={createTextChangeHandler('comment')}
            data-testid={'ToolCardCreate.comment'}
            value={formFields?.comment || ''}
          />
        </VStack>
      </Card>
    </VStack>
  )
}
)
