import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisForm.module.scss'
import { memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { AssistantOptions } from '@/entities/Assistants'
import {
    useCreateSipUri,
    useUpdateSipUri,
    useDeleteSipUri,
    PbxServerOptions
} from '@/entities/PbxServers'
import {
    getPublishSipUrisFormSelectedAssistant,
    getPublishSipUrisFormSelectedPbx,
    getPublishSipUrisFormIpAddress,
    getPublishSipUrisFormRecords,
    getPublishSipUrisFormTls,
    getPublishSipUrisFormActive,
    getPublishSipUrisFormUserId
} from '../../model/selectors/publishSipUrisFormSelectors'
import { publishSipUrisFormActions } from '../../model/slices/publishSipUrisFormSlice'
import { isUserAdmin, getUserAuthData } from '@/entities/User'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { getRoutePublishSipUris } from '@/shared/const/router'
import { PublishSipUrisFormHeader } from '../PublishSipUrisFormHeader/PublishSipUrisFormHeader'
import { TelephonySipCard } from './components/TelephonySipCard/TelephonySipCard'
import { SecuritySipCard } from './components/SecuritySipCard/SecuritySipCard'
import { useMediaQuery } from '@mui/material'

interface PublishSipUrisFormProps {
    className?: string
    isEdit?: boolean
}

export const PublishSipUrisForm = memo((props: PublishSipUrisFormProps) => {
    const { className, isEdit } = props
    const { t } = useTranslation('publish-sip')
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const selectedAssistant = useSelector(getPublishSipUrisFormSelectedAssistant)
    const selectedPbx = useSelector(getPublishSipUrisFormSelectedPbx)
    const ipAddress = useSelector(getPublishSipUrisFormIpAddress)
    const records = useSelector(getPublishSipUrisFormRecords)
    const tls = useSelector(getPublishSipUrisFormTls)
    const active = useSelector(getPublishSipUrisFormActive)
    const isAdmin = useSelector(isUserAdmin)
    const userData = useSelector(getUserAuthData)
    const formUserId = useSelector(getPublishSipUrisFormUserId)

    const [createSip, { isLoading: isCreating }] = useCreateSipUri()
    const [updateSip, { isLoading: isUpdating }] = useUpdateSipUri()
    const [deleteSip, { isLoading: isDeleting }] = useDeleteSipUri()

    const isLoading = isCreating || isUpdating || isDeleting
    const isMobile = useMediaQuery('(max-width:800px)')

    // Auto-set userId for non-admin users
    useEffect(() => {
        if (!isAdmin && userData?.id && !formUserId) {
            dispatch(publishSipUrisFormActions.setUserId(String(userData.id)))
        }
    }, [isAdmin, userData, formUserId, dispatch])

    const onClose = useCallback(() => {
        navigate(getRoutePublishSipUris())
    }, [navigate])

    const onChangeAssistant = useCallback((_: any, value: AssistantOptions | null) => {
        dispatch(publishSipUrisFormActions.setSelectedAssistant(value))
    }, [dispatch])

    const onChangePbx = useCallback((_: any, value: PbxServerOptions | null) => {
        dispatch(publishSipUrisFormActions.setSelectedPbx(value))
    }, [dispatch])

    const onChangeIp = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(publishSipUrisFormActions.setIpAddress(e.target.value))
    }, [dispatch])

    const onChangeRecords = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(publishSipUrisFormActions.setRecords(e.target.checked))
    }, [dispatch])

    const onChangeTls = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(publishSipUrisFormActions.setTls(e.target.checked))
    }, [dispatch])

    const onChangeActive = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(publishSipUrisFormActions.setActive(e.target.checked))
    }, [dispatch])

    const onChangeClient = useCallback((clientId: string) => {
        dispatch(publishSipUrisFormActions.setUserId(clientId))
        // Reset assistant when client changes
        dispatch(publishSipUrisFormActions.setSelectedAssistant(null))
    }, [dispatch])

    const onDelete = useCallback(async () => {
        if (!selectedAssistant) return

        const confirmed = window.confirm(t('Вы уверены, что хотите удалить SIP URI?') ?? '')
        if (!confirmed) return

        try {
            await deleteSip({ assistantId: String(selectedAssistant.id) }).unwrap()
            toast.success(t('SIP URI успешно удален'))
            navigate(getRoutePublishSipUris())
            dispatch(publishSipUrisFormActions.resetForm())
        } catch (e) {
            // Error toast handled by global toastMiddleware
        }
    }, [deleteSip, selectedAssistant, t, navigate, dispatch])

    const onSave = useCallback(async () => {
        if (!selectedAssistant || !selectedPbx || !ipAddress) {
            toast.error(t('Пожалуйста заполни все поля'))
            return
        }

        const payload = {
            assistantId: String(selectedAssistant.id),
            serverId: String(selectedPbx.id),
            ipAddress,
            records,
            tls,
            active
        }

        try {
            if (isEdit) {
                await updateSip(payload).unwrap()
                toast.success(t('SIP URI успешно обновлен'))
            } else {
                await createSip(payload).unwrap()
                toast.success(t('SIP URI успешно создан'))
            }

            navigate(getRoutePublishSipUris())
            dispatch(publishSipUrisFormActions.resetForm())
        } catch (e) {
            // Error toast handled by global toastMiddleware
        }
    }, [selectedAssistant, selectedPbx, ipAddress, records, tls, active, updateSip, createSip, t, isEdit, navigate, dispatch])

    return (
        <VStack gap={'16'} max className={classNames(cls.PublishSipUrisForm, {}, [className])}>
            <PublishSipUrisFormHeader
                onSave={onSave}
                onClose={onClose}
                onDelete={onDelete}
                isEdit={isEdit}
                isLoading={isLoading}
                assistantName={selectedAssistant?.name}
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
                        <TelephonySipCard
                            selectedAssistant={selectedAssistant}
                            onChangeAssistant={onChangeAssistant}
                            selectedPbx={selectedPbx}
                            onChangePbx={onChangePbx}
                            active={active || false}
                            onChangeActive={onChangeActive}
                            isEdit={isEdit}
                            isAdmin={isAdmin}
                            userId={String(userData?.id || '')}
                            clientId={formUserId}
                            onChangeClient={onChangeClient}
                        />
                    </VStack>

                    <VStack gap="24" className={cls.rightColumn}>
                        <SecuritySipCard
                            ipAddress={ipAddress}
                            onChangeIp={onChangeIp}
                            records={records || false}
                            onChangeRecords={onChangeRecords}
                            tls={tls || false}
                            onChangeTls={onChangeTls}
                        />
                    </VStack>
                </HStack>
            </VStack>

            <PublishSipUrisFormHeader
                onSave={onSave}
                onClose={onClose}
                onDelete={onDelete}
                isEdit={isEdit}
                isLoading={isLoading}
                variant={'diviner-bottom'}
                assistantName={selectedAssistant?.name}
            />
        </VStack>
    )
})
