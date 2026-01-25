import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolEditCard.module.scss'
import React, { ChangeEvent, memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import {
  getToolsEditForm,
  Tool,
  toolsPageActions,
  ToolType,
  ToolTypeSelect,
  useTool
} from '@/entities/Tools'
import { ToolEditCardHeader } from '../ToolEditCardHeader/ToolEditCardHeader'
import { useSelector } from 'react-redux'
import { ClientOptions, ClientSelect, getUserAuthData, isUserAdmin } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Check } from '@/shared/ui/mui/Check'
import { ToolAddParam } from '../ToolAddParam/ToolAddParam'
import { Combobox } from '@/shared/ui/mui/Combobox'

interface UserEditCardProps {
  className?: string
  onEdit?: (data: Tool) => void
  toolId?: string
  onDelete?: (id: string) => void
}

export const ToolEditCard = memo((props: UserEditCardProps) => {
  const {
    className,
    onEdit,
    toolId,
    onDelete
  } = props

  const { t } = useTranslation('tools')
  const [jsonText, setJsonText] = useState(() =>
    formFields?.toolData ? JSON.stringify(formFields.toolData, null, 2) : ''
  )
  const [headersText, setHeadersText] = useState(() =>
    formFields?.headers ? JSON.stringify(formFields.headers, null, 2) : ''
  )

  const { data: tool, isError, isLoading } = useTool(toolId!, {
    skip: !toolId
  })

  const dispatch = useAppDispatch()
  const clientData = useSelector(getUserAuthData)
  const isAdmin = useSelector(isUserAdmin)
  const formFields = useSelector(getToolsEditForm)

  useEffect(() => {
    if (tool) {
      dispatch(toolsPageActions.updateToolEditForm(tool))
    }
  }, [dispatch, tool])

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

  const onChangeClientHandler = useCallback((
    event: any,
    newValue: ClientOptions | null) => {
    if (newValue) {
      dispatch(toolsPageActions.setUser(newValue))
    } else {
      dispatch(toolsPageActions.setUser({ id: '', name: '' }))
    }
  }, [dispatch])

  const editTextChangeHandler = (field: keyof Tool) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value

      const updatedForm = {
        ...formFields,
        [field]: value
      }
      dispatch(toolsPageActions.updateToolEditForm(updatedForm))
    }

  const toggleStrictHandler = useCallback(() => {
    const updatedForm = {
      ...formFields,
      strict: !formFields?.strict
    }
    dispatch(toolsPageActions.updateToolEditForm(updatedForm))
  }, [dispatch, formFields])

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
        dispatch(toolsPageActions.updateToolEditForm(updatedForm))
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
        dispatch(toolsPageActions.updateToolEditForm(updatedForm))
      } catch {
        // невалидный JSON
      }
    },
    [dispatch, formFields]
  )

  const [hasWebhook, setHasWebhook] = useState(false)

  useEffect(() => {
    if (tool?.webhook) {
      setHasWebhook(true)
    }
  }, [tool])

  const onToggleWebhookHandler = useCallback(() => {
    setHasWebhook(prev => {
      const newVal = !prev
      if (!newVal) {
        dispatch(toolsPageActions.updateToolEditForm({
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
      dispatch(toolsPageActions.updateToolEditForm(updatedForm))
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

    dispatch(toolsPageActions.updateToolEditForm({
      ...formFields,
      headers: newHeaders
    }))
  }, [dispatch, formFields, currentToken, currentUsername, currentPassword])

  const IsAdminOptions = (
    <>
      <ClientSelect
        value={tool?.user as ClientOptions}
        onChangeClient={onChangeClientHandler}
        label={String(t('Клиент'))}
        className={cls.client}
        data-testid={'ToolEditCard.ClientSelect'}
      />
    </>
  )

  const editHandler = useCallback(() => {
    if (formFields) {
      onEdit?.(formFields)
    }
  }, [formFields, onEdit])

  const changeTypeHandler = (event: any, functionType: ToolType) => {
    const type = functionType.value
    dispatch(toolsPageActions.updateToolEditType(type))
  }

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
        onChange={editTextChangeHandler('description')}
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
        isEdit
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
            onChange={editTextChangeHandler('webhook')}
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

  if (isError) {
    return (
      <ErrorGetData />
    )
  }

  if (isLoading) {
    return (
      <VStack gap={'16'} max>
        <Card max>
          <Skeleton width='100%' border='8px' height='44px' />
        </Card>
        <Skeleton width='100%' border='8px' height='80px' />
        <Skeleton width='100%' border='8px' height='80px' />
        <Skeleton width='100%' border='8px' height='80px' />
      </VStack>
    )
  }

  return (
    <VStack
      gap={'8'}
      max
      className={classNames(cls.ToolCreateCard, {}, [className])}
    >
      <ToolEditCardHeader
        onEdit={editHandler}
        onDelete={onDelete}
        toolId={toolId}
      />
      <Card
        max
        padding={'16'}
        border={'partial'}
      >
        <VStack gap={'16'} max>
          {!isAdmin ? <Text title={clientData?.name} /> : IsAdminOptions}

          <Textarea
            label={t('Наименование функции') ?? ''}
            onChange={editTextChangeHandler('name')}
            data-testid={'ToolCardCreate.name'}
            value={formFields?.name || ''}
          />
          <ToolTypeSelect
            label={t('Тип') ?? ''}
            value={formFields?.type}
            onChangeToolType={changeTypeHandler}
            data-testid={'ToolCardCreate.type'}
          />

          {formFields?.type && formFields?.type === 'function' && functionType}
          {formFields?.type && formFields?.type !== 'function' && toolType}

          <Textarea
            label={t('Комментарий') ?? ''}
            onChange={editTextChangeHandler('comment')}
            data-testid={'ToolCardCreate.comment'}
            value={formFields?.comment || ''}
          />
        </VStack>
      </Card>
      <ToolEditCardHeader
        onEdit={editHandler}
        variant={'diviner-bottom'}
        toolId={toolId}
      />
    </VStack>
  )
})
