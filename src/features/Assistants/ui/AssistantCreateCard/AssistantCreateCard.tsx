import { useTranslation } from 'react-i18next'
import cls from './AssistantCreateCard.module.scss'
import React, { ChangeEvent, memo, useCallback, useEffect, useState } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Assistant, assistantsPageActions, getAssistantsUser } from '@/entities/Assistants'
import { useSelector } from 'react-redux'
import { ClientOptions, ClientSelect, getUserAuthData, isUserAdmin } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { AssistantCreateCardHeader } from '../AssistantCreateCardHeader/AssistantCreateCardHeader'

interface AssistantCreateCardProps {
  className?: string
  onCreate?: (data: Assistant) => void
  isError?: boolean
  error?: FetchBaseQueryError | SerializedError | undefined
}

export const AssistantCreateCard = memo((props: AssistantCreateCardProps) => {
  const {
    className,
    onCreate,
    isError,
    error
  } = props

  const initAssistant = {
    id: '',
    name: '',
    comment: '',
    userId: '',
    user: {
      id: '',
      username: ''
    }
  }

  const [formFields, setFormFields] = useState<Assistant>(initAssistant)

  const { t } = useTranslation('assistants')

  const isAdmin = useSelector(isUserAdmin)
  const clientData = useSelector(getUserAuthData)
  const clientValues = useSelector(getAssistantsUser)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isAdmin && clientData?.id && clientData.username) {
      dispatch(assistantsPageActions.setUser({
        id: clientData?.vpbx_user_id || clientData.id,
        name: clientData?.username
      }))
      dispatch(assistantsPageActions.setUserId(clientData.id))
      setFormFields({
        ...formFields,
        userId: clientData.id
      })
    }
  }, [clientData, dispatch, formFields, isAdmin])

  const onChangeClientHandler = useCallback((
    event: any,
    newValue: ClientOptions) => {
    dispatch(assistantsPageActions.setUser(newValue))
    dispatch(assistantsPageActions.setUserId(newValue.id))
    setFormFields({
      ...formFields,
      userId: newValue.id,
      user: newValue
    })
  }, [dispatch, formFields])

  const createTextChangeHandler = (field: keyof Assistant) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setFormFields({
        ...formFields,
        [field]: value
      })
    }

  const createHandler = useCallback(() => {
    onCreate?.(formFields)
  }, [formFields, onCreate])

  return (
          <VStack
              gap={'8'}
              max
              className={classNames(cls.AssistantCreateCard, {}, [className])}
          >
            <AssistantCreateCardHeader onCreate={createHandler}/>
            {isError
              ? <ErrorGetData
                    title={t('Ошибка при создании транспорта') || ''}
                    text={
                      error && 'data' in error
                        ? String(t((error.data as { message: string }).message))
                        : String(t('Проверьте заполняемые поля и повторите ещё раз'))
                    }
                />
              : ''}
            <Card
                max
                padding={'8'}
                border={'partial'}
            >
              <VStack gap={'8'} max>
                {isAdmin
                  ? <ClientSelect
                        value={clientValues}
                        clientId={clientValues?.id}
                        onChangeClient={onChangeClientHandler}
                        label={String(t('Клиент'))}
                        className={cls.client}
                        data-testid={'CaskCard.ClientSelect'}
                    />
                  : <Text
                        className={cls.client}
                        title={clientData?.vpbxUser?.name || clientData?.name}
                    />
                }
                <Textarea
                    label={t('Наименование ассистента') ?? ''}
                    onChange={createTextChangeHandler('name')}
                    data-testid={'AssistantCardCreate.name'}
                    value={formFields.name}
                />
                <Textarea
                    label={t('Комментарий') ?? ''}
                    onChange={createTextChangeHandler('comment')}
                    data-testid={'AssistantCardCreate.comment'}
                    value={formFields.comment}
                />
              </VStack>
            </Card>
            <AssistantCreateCardHeader onCreate={createHandler} />
          </VStack>
  )
}
)
