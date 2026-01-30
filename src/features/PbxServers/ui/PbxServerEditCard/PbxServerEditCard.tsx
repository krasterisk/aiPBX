import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServerEditCard.module.scss'
import React, { ChangeEvent, memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { getPbxServersEditForm, PbxServer, pbxServersPageActions, usePbxServer } from '@/entities/PbxServers'
import { PbxServerEditCardHeader } from '../PbxServerEditCardHeader/PbxServerEditCardHeader'
import { useSelector } from 'react-redux'
import { ClientOptions, ClientSelect, getUserAuthData, isUserAdmin } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'

interface UserEditCardProps {
  className?: string
  onEdit?: (data: PbxServer) => void
  pbxServerId?: string
  onDelete?: (id: string) => void
}

export const PbxServerEditCard = memo((props: UserEditCardProps) => {
  const {
    className,
    onEdit,
    pbxServerId,
    onDelete
  } = props

  const { t } = useTranslation('pbx')

  const { data: pbxServer, isError, isLoading } = usePbxServer(pbxServerId!, {
    skip: !pbxServerId
  })

  const dispatch = useAppDispatch()
  const clientData = useSelector(getUserAuthData)
  const isAdmin = useSelector(isUserAdmin)
  const formFields = useSelector(getPbxServersEditForm)

  useEffect(() => {
    if (pbxServer) {
      dispatch(pbxServersPageActions.updatePbxServerEditForm(pbxServer))
    }
  }, [dispatch, pbxServer])

  const onChangeClientHandler = useCallback((
    event: any,
    newValue: ClientOptions | null) => {
    if (newValue) {
      dispatch(pbxServersPageActions.setUser(newValue))
    } else {
      dispatch(pbxServersPageActions.setUser({ id: '', name: '' }))
    }
  }, [dispatch])

  const editTextChangeHandler = (field: keyof PbxServer) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value

      const updatedForm = {
        ...formFields,
        [field]: value
      }
      dispatch(pbxServersPageActions.updatePbxServerEditForm(updatedForm))
    }

  const IsAdminOptions = (
    <>
      <ClientSelect
        value={pbxServer?.user as ClientOptions}
        onChangeClient={onChangeClientHandler}
        label={String(t('Клиент'))}
        className={cls.client}
        data-testid={'PbxServerEditCard.ClientSelect'}
      />
    </>
  )

  const editHandler = useCallback(() => {
    if (formFields) {
      onEdit?.(formFields)
    }
  }, [formFields, onEdit])

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
      className={classNames(cls.PbxServerEditCard, {}, [className])}
    >
      <PbxServerEditCardHeader onEdit={editHandler} onDelete={onDelete} />
      <Card
        max
        padding={'16'}
        border={'partial'}
      >
        <VStack gap={'16'} max>
          {!isAdmin ? <Text title={clientData?.name} /> : IsAdminOptions}

          <Textarea
            label={t('Наименование сервера') ?? ''}
            onChange={editTextChangeHandler('name')}
            data-testid={'PbxServerCardEdit.name'}
            value={formFields?.name || ''}
          />
          <Textarea
            label={t('Локация') ?? ''}
            onChange={editTextChangeHandler('location')}
            data-testid={'PbxServerCardEdit.location'}
            value={formFields?.location || ''}
            minRows={3}
            multiline
          />
          <Textarea
            label={t('Адрес сервера') ?? ''}
            onChange={editTextChangeHandler('sip_host')}
            data-testid={'PbxServerCardEdit.host'}
            value={formFields?.sip_host || ''}
          />
          <Textarea
            label={t('WSS URL (WebRTC)') ?? ''}
            onChange={editTextChangeHandler('wss_url')}
            data-testid={'PbxServerCardEdit.wss_url'}
            value={formFields?.wss_url || ''}
          />
          <Textarea
            label={t('ARI URL') ?? ''}
            onChange={editTextChangeHandler('ari_url')}
            data-testid={'PbxServerCardEdit.ari_url'}
            value={formFields?.ari_url || ''}
          />
          <Textarea
            label={t('ARI USER') ?? ''}
            onChange={editTextChangeHandler('ari_user')}
            data-testid={'PbxServerCardEdit.ari_user'}
            value={formFields?.ari_user || ''}
          />
          <Textarea
            label={t('ARI PASSWORD') ?? ''}
            onChange={editTextChangeHandler('password')}
            data-testid={'PbxServerCardEdit.password'}
            value={formFields?.password || ''}
          />
          <Textarea
            label={t('Комментарий') ?? ''}
            onChange={editTextChangeHandler('comment')}
            data-testid={'PbxServerCardEdit.comment'}
            value={formFields?.comment || ''}
          />
        </VStack>
      </Card>
    </VStack>
  )
})
