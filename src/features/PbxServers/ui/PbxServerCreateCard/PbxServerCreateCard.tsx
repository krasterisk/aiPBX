import { useTranslation } from 'react-i18next'
import cls from './PbxServerCreateCard.module.scss'
import React, { ChangeEvent, memo, useCallback, useEffect } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { classNames } from '@/shared/lib/classNames/classNames'
import {
  PbxServer,
  pbxServersPageActions,
  getPbxServersUser, getPbxServersCreateForm
} from '@/entities/PbxServers'
import { useSelector } from 'react-redux'
import { ClientOptions, ClientSelect, getUserAuthData, isUserAdmin } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { PbxServerCreateCardHeader } from '../PbxServerCreateCardHeader/PbxServerCreateCardHeader'

interface PbxServerCreateCardProps {
  className?: string
  onCreate?: (data: PbxServer) => void
  isError?: boolean
  error?: FetchBaseQueryError | SerializedError | undefined
}

export const PbxServerCreateCard = memo((props: PbxServerCreateCardProps) => {
  const {
    className,
    onCreate,
    isError,
    error
  } = props

  const { t } = useTranslation('pbx')

  const isAdmin = useSelector(isUserAdmin)
  const clientData = useSelector(getUserAuthData)
  const clientValues = useSelector(getPbxServersUser)

  const dispatch = useAppDispatch()

  const formFields = useSelector(getPbxServersCreateForm)

  useEffect(() => {
    dispatch(pbxServersPageActions.resetPbxServerCreateForm())
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

      dispatch(pbxServersPageActions.setUser(newValue))
      dispatch(pbxServersPageActions.updatePbxServersCreateForm(updatedForm))
    } else {
      dispatch(pbxServersPageActions.setUser({ id: '', name: '' }))
      dispatch(pbxServersPageActions.updatePbxServersCreateForm({
        user: { id: '', name: '' },
        userId: ''
      }))
    }
  }, [dispatch, formFields])

  const createTextChangeHandler = (field: keyof PbxServer) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value

      const updatedForm = {
        ...formFields,
        [field]: value
      }
      dispatch(pbxServersPageActions.updatePbxServersCreateForm(updatedForm))
    }

  const IsAdminOptions = (
          <>
            <ClientSelect
                value={clientValues}
                onChangeClient={onChangeClientHandler}
                label={String(t('Клиент'))}
                className={cls.client}
                data-testid={'PbxServerCreateCard.ClientSelect'}
            />
          </>
  )

  const createHandler = useCallback(() => {
    if (formFields) {
      onCreate?.(formFields)
    }
  }, [formFields, onCreate])

  return (
          <VStack
              gap={'8'}
              max
              className={classNames(cls.PbxServerCreateCard, {}, [className])}
          >
            <PbxServerCreateCardHeader onCreate={createHandler} variant={'diviner-top'}/>
            <Card
                max
                padding={'16'}
                border={'partial'}
            >
              <VStack gap={'16'} max>
                {!isAdmin ? <Text title={clientData?.name}/> : IsAdminOptions}
                <Textarea
                    label={t('Наименование сервера') ?? ''}
                    onChange={createTextChangeHandler('name')}
                    data-testid={'PbxServerCardCreate.name'}
                    value={formFields?.name || ''}
                />
                <Textarea
                    label={t('Локация') ?? ''}
                    onChange={createTextChangeHandler('location')}
                    data-testid={'PbxServerCardCreate.location'}
                    value={formFields?.location || ''}
                    minRows={3}
                    multiline
                />
                <Textarea
                    label={t('Адрес сервера') ?? ''}
                    onChange={createTextChangeHandler('sip_host')}
                    data-testid={'PbxServerCardCreate.host'}
                    value={formFields?.sip_host || ''}
                />
                <Textarea
                    label={t('ARI URL') ?? ''}
                    onChange={createTextChangeHandler('ari_url')}
                    data-testid={'PbxServerCardCreate.ari_url'}
                    value={formFields?.ari_url || ''}
                />
                <Textarea
                    label={t('ARI USER') ?? ''}
                    onChange={createTextChangeHandler('ari_user')}
                    data-testid={'PbxServerCardCreate.ari_user'}
                    value={formFields?.ari_user || ''}
                />
                <Textarea
                    label={t('ARI PASSWORD') ?? ''}
                    onChange={createTextChangeHandler('password')}
                    data-testid={'PbxServerCardCreate.password'}
                    value={formFields?.password || ''}
                />
                <Textarea
                    label={t('Комментарий') ?? ''}
                    onChange={createTextChangeHandler('comment')}
                    data-testid={'PbxServerCardCreate.comment'}
                    value={formFields?.comment || ''}
                />
              </VStack>
            </Card>
            <PbxServerCreateCardHeader onCreate={createHandler} variant={'diviner-bottom'}/>
          </VStack>
  )
}
)
