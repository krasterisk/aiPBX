import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useMediaQuery } from '@mui/material'
import { classNames } from '@/shared/lib/classNames/classNames'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { getRoutePbxServers } from '@/shared/const/router'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import {
  useDeletePbxServers,
  useSetPbxServers,
  useUpdatePbxServers,
  usePbxServer,
  usePbxServerStatus,
  PbxServer,
  AsteriskInstructionsModal
} from '@/entities/PbxServers'
import { pbxServerFormActions, pbxServerFormReducer } from '../../model/slices/pbxServerFormSlice'
import { getPbxServerForm } from '../../model/selectors/pbxServerFormSelectors'
import { PbxServerFormHeader } from '../PbxServerFormHeader/PbxServerFormHeader'
import { GeneralSection } from './components/GeneralSection/GeneralSection'
import { ConnectivitySection } from './components/ConnectivitySection/ConnectivitySection'
import { ErrorGetData } from '@/entities/ErrorGetData'
import cls from './PbxServerForm.module.scss'

export interface PbxServerFormProps {
  className?: string
  isEdit?: boolean
  pbxServerId?: string
}

const reducers: ReducersList = {
  pbxServerForm: pbxServerFormReducer
}

export const PbxServerForm = memo((props: PbxServerFormProps) => {
  const { className, isEdit, pbxServerId } = props
  const { t } = useTranslation('pbx')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width:800px)')

  const isAdmin = useSelector(isUserAdmin)
  const clientData = useSelector(getUserAuthData)
  const form = useSelector(getPbxServerForm)

  const [createPbx, { isLoading: isCreating }] = useSetPbxServers()
  const [updatePbx, { isLoading: isUpdating }] = useUpdatePbxServers()
  const [deletePbx, { isLoading: isDeleting }] = useDeletePbxServers()

  const isActionLoading = isCreating || isUpdating || isDeleting

  const { data: serverData, isLoading: isDataLoading, isError, error } = usePbxServer(pbxServerId!, {
    skip: !isEdit || !pbxServerId
  })

  const { data: statusData, isLoading: isStatusLoading } = usePbxServerStatus(serverData?.uniqueId!, {
    skip: !serverData?.uniqueId,
    pollingInterval: 30000,
  })

  useEffect(() => {
    if (isEdit && serverData) {
      dispatch(pbxServerFormActions.initForm(serverData))
    } else if (!isEdit) {
      dispatch(pbxServerFormActions.resetForm())
      // Auto-set userId for non-admin users
      if (!isAdmin && clientData?.id) {
        dispatch(pbxServerFormActions.updateForm({
          userId: String(clientData.id),
          user: { id: String(clientData.id), name: clientData.name || '' }
        }))
      }
    }
  }, [isEdit, serverData, dispatch, isAdmin, clientData])

  const onChangeField = useCallback((field: keyof PbxServer, value: any) => {
    dispatch(pbxServerFormActions.updateForm({ [field]: value }))
  }, [dispatch])

  const onChangeClient = useCallback((id: string) => {
    dispatch(pbxServerFormActions.updateForm({
      user: { id, name: '' },
      userId: id
    }))
  }, [dispatch])

  const onSave = useCallback(async () => {
    if (!form?.name) {
      toast.error(t('Пожалуйста введите название сервера'))
      return
    }

    if (!form.wss_url && !form.ari_url) {
      toast.error(t('WSS или ARI URL должны быть заполнены'))
      return
    }

    try {
      if (isEdit && pbxServerId) {
        await updatePbx(form).unwrap()
        toast.success(t('Сервер успешно обновлен'))
      } else {
        await createPbx(form).unwrap()
        toast.success(t('Сервер успешно создан'))
      }
      navigate(getRoutePbxServers())
    } catch (e) {
      // Error toast handled by global toastMiddleware
    }
  }, [form, isEdit, pbxServerId, updatePbx, createPbx, navigate, t])

  const onClose = useCallback(() => {
    navigate(getRoutePbxServers())
  }, [navigate])

  const onDelete = useCallback(async () => {
    if (!pbxServerId) return
    if (window.confirm(t('Вы уверены, что хотите удалить сервер?') ?? '')) {
      try {
        await deletePbx(pbxServerId).unwrap()
        toast.success(t('Сервер успешно удален'))
        navigate(getRoutePbxServers())
      } catch (e) {
        // Error toast handled by global toastMiddleware
      }
    }
  }, [pbxServerId, deletePbx, navigate, t])

  const onOpenInstructions = useCallback(() => {
    setIsInstructionsModalOpen(true)
  }, [])

  const onCloseInstructions = useCallback(() => {
    setIsInstructionsModalOpen(false)
  }, [])

  if (isError) {
    const errMsg = error && typeof error === 'object' && 'data' in error
      ? String((error.data as { message: string }).message)
      : ''
    return <ErrorGetData text={errMsg} />
  }

  if (isDataLoading && isEdit) {
    return (
      <VStack gap={isMobile ? '8' : '16'} max>
        <Skeleton width="100%" height={80} border="16px" />
        <VStack gap={isMobile ? '16' : '24'} max align="start">
          <Skeleton width="100%" height={400} border="16px" />
          <Skeleton width="100%" height={400} border="16px" />
        </VStack>
      </VStack>
    )
  }

  return (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount>
      <VStack gap="16" max className={classNames(cls.PbxServerForm, {}, [className])}>
        <PbxServerFormHeader
          isEdit={isEdit}
          serverName={form?.name}
          onSave={onSave}
          onClose={onClose}
          onDelete={onDelete}
          isLoading={isActionLoading || isDataLoading}
        />

        <VStack gap={isMobile ? '16' : '24'} max align="center">
          <HStack
            gap={isMobile ? '16' : '24'}
            max
            align="start"
            wrap="wrap"
            className={cls.contentWrapper}
          >
            <VStack gap="24" className={cls.leftColumn}>
              <GeneralSection
                name={form?.name || ''}
                onChangeName={(v: string) => { onChangeField('name', v) }}
                location={form?.location || ''}
                onChangeLocation={(v: string) => { onChangeField('location', v) }}
                comment={form?.comment || ''}
                onChangeComment={(v: string) => { onChangeField('comment', v) }}
                cloudPbx={form?.cloudPbx || false}
                onChangeCloudPbx={(v: boolean) => { onChangeField('cloudPbx', v) }}
                userId={String(form?.userId || '')}
                onChangeClient={onChangeClient}
                isAdmin={isAdmin}
                clientName={clientData?.name}
                isEdit={isEdit}
              />
            </VStack>

            <VStack gap="24" className={cls.rightColumn}>
              <ConnectivitySection
                sipHost={form?.sip_host || ''}
                onChangeSipHost={(v: string) => { onChangeField('sip_host', v) }}
                wssUrl={form?.wss_url || ''}
                onChangeWssUrl={(v: string) => { onChangeField('wss_url', v) }}
                ariUrl={form?.ari_url || ''}
                onChangeAriUrl={(v: string) => { onChangeField('ari_url', v) }}
                ariUser={form?.ari_user || ''}
                onChangeAriUser={(v: string) => { onChangeField('ari_user', v) }}
                context={form?.context || ''}
                onChangeContext={(v: string) => { onChangeField('context', v) }}
                moh={form?.moh || ''}
                onChangeMoh={(v: string) => { onChangeField('moh', v) }}
                recordFormat={form?.recordFormat || ''}
                onChangeRecordFormat={(v: string) => { onChangeField('recordFormat', v) }}
                password={form?.password}
                onChangePassword={(v: string) => { onChangeField('password', v) }}
                onOpenInstructions={onOpenInstructions}
                isEdit={isEdit}
                statusData={statusData}
                isStatusLoading={isStatusLoading}
              />
            </VStack>
          </HStack>
        </VStack>

        <AsteriskInstructionsModal
          isOpen={isInstructionsModalOpen}
          onClose={onCloseInstructions}
        />

        <PbxServerFormHeader
          isEdit={isEdit}
          serverName={form?.name}
          onSave={onSave}
          onClose={onClose}
          onDelete={onDelete}
          isLoading={isActionLoading || isDataLoading}
          variant="diviner-bottom"
        />
      </VStack>
    </DynamicModuleLoader>
  )
})
