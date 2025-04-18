import { useTranslation } from 'react-i18next'
import cls from './ToolCreateCard.module.scss'
import React, { ChangeEvent, memo, useCallback, useEffect } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { classNames } from '@/shared/lib/classNames/classNames'
import {
  Tool,
  toolsPageActions,
  getToolsUser, getToolsCreateForm
} from '@/entities/Tools'
import { useSelector } from 'react-redux'
import { ClientOptions, ClientSelect, getUserAuthData, isUserAdmin } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { ToolCreateCardHeader } from '../ToolCreateCardHeader/ToolCreateCardHeader'
import { Check } from '@/shared/ui/mui/Check'
import { ToolAddParam } from '../ToolAddParam/ToolAddParam'

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
  const clientData = useSelector(getUserAuthData)
  const clientValues = useSelector(getToolsUser)

  const dispatch = useAppDispatch()

  const formFields = useSelector(getToolsCreateForm)

  useEffect(() => {
    dispatch(toolsPageActions.resetToolCreateForm())
  }, [dispatch])

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
    console.log('formfields: ', formFields)
    if (formFields) {
      onCreate?.(formFields)
    }
  }, [formFields, onCreate])

  return (
            <VStack
                gap={'8'}
                max
                className={classNames(cls.ToolCreateCard, {}, [className])}
            >
                <ToolCreateCardHeader onCreate={createHandler} variant={'diviner-top'}/>
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
                        {!isAdmin ? <Text title={clientData?.name}/> : IsAdminOptions}
                        <Textarea
                            label={t('Наименование функции') ?? ''}
                            onChange={createTextChangeHandler('name')}
                            data-testid={'ToolCardCreate.name'}
                            value={formFields?.name || ''}
                        />
                        <Textarea
                            label={t('Описание функции') ?? ''}
                            onChange={createTextChangeHandler('description')}
                            data-testid={'ToolCardCreate.description'}
                            value={formFields?.description || ''}
                            minRows={3}
                            multiline
                        />
                        <Check
                            label={t('Строгий режим вызова функции') || ''}
                            onChange={toggleStrictHandler}
                            checked={formFields?.strict || false}
                        />
                        <ToolAddParam
                            parameters={formFields?.parameters}
                            toolName={formFields?.name || ''}
                        />
                        <Textarea
                            label={t('Адрес вебхука') ?? ''}
                            onChange={createTextChangeHandler('webhook')}
                            data-testid={'ToolCardCreate.webhook'}
                            value={formFields?.webhook || ''}
                        />
                        <Textarea
                            label={t('Комментарий') ?? ''}
                            onChange={createTextChangeHandler('comment')}
                            data-testid={'ToolCardCreate.comment'}
                            value={formFields?.comment || ''}
                        />
                    </VStack>
                </Card>
                <ToolCreateCardHeader onCreate={createHandler} variant={'diviner-bottom'}/>
            </VStack>
  )
}
)
