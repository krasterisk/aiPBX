import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './SipTrunkForm.module.scss'
import { memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { AssistantOptions } from '@/entities/Assistants'
import { PbxServerOptions } from '@/entities/PbxServers'
import {
    getSipTrunkFormSelectedAssistant,
    getSipTrunkFormSelectedPbx,
    getSipTrunkFormName,
    getSipTrunkFormTrunkType,
    getSipTrunkFormSipServerAddress,
    getSipTrunkFormTransport,
    getSipTrunkFormAuthName,
    getSipTrunkFormPassword,
    getSipTrunkFormDomain,
    getSipTrunkFormCallerId,
    getSipTrunkFormProviderIp,
    getSipTrunkFormActive,
    getSipTrunkFormRecords,
    getSipTrunkFormUserId
} from '../../model/selectors/sipTrunkFormSelectors'
import { sipTrunkFormActions } from '../../model/slices/sipTrunkFormSlice'
import { SipTrunkType, SipTransport } from '../../model/types/sipTrunkFormSchema'
import { isUserAdmin, getUserAuthData } from '@/entities/User'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { getRouteSipTrunks } from '@/shared/const/router'
import { SipTrunkFormHeader } from '../SipTrunkFormHeader/SipTrunkFormHeader'
import { TelephonySipTrunkCard } from './components/TelephonySipTrunkCard/TelephonySipTrunkCard'
import { PropertiesSipTrunkCard } from './components/PropertiesSipTrunkCard/PropertiesSipTrunkCard'
import { useMediaQuery } from '@mui/material'
import { useSipTrunkStatus, useCreateSipTrunk, useUpdateSipTrunk, useDeleteSipTrunk } from '@/entities/SipTrunks'
import { SectionCard } from './components/SectionCard/SectionCard'
import { Activity } from 'lucide-react'
import { Text } from '@/shared/ui/redesigned/Text'

interface SipTrunkFormProps {
    className?: string
    isEdit?: boolean
}

export const SipTrunkForm = memo((props: SipTrunkFormProps) => {
    const { className, isEdit } = props
    const { t } = useTranslation('sip-trunks')
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()

    const selectedAssistant = useSelector(getSipTrunkFormSelectedAssistant)
    const selectedPbx = useSelector(getSipTrunkFormSelectedPbx)
    const name = useSelector(getSipTrunkFormName)
    const trunkType = useSelector(getSipTrunkFormTrunkType)
    const sipServerAddress = useSelector(getSipTrunkFormSipServerAddress)
    const transport = useSelector(getSipTrunkFormTransport)
    const authName = useSelector(getSipTrunkFormAuthName)
    const password = useSelector(getSipTrunkFormPassword)
    const domain = useSelector(getSipTrunkFormDomain)
    const callerId = useSelector(getSipTrunkFormCallerId)
    const providerIp = useSelector(getSipTrunkFormProviderIp)
    const active = useSelector(getSipTrunkFormActive)
    const records = useSelector(getSipTrunkFormRecords)
    const isAdmin = useSelector(isUserAdmin)
    const userData = useSelector(getUserAuthData)
    const formUserId = useSelector(getSipTrunkFormUserId)

    const [createSipTrunk, { isLoading: isCreating }] = useCreateSipTrunk()
    const [updateSipTrunk, { isLoading: isUpdating }] = useUpdateSipTrunk()
    const [deleteSipTrunk, { isLoading: isDeleting }] = useDeleteSipTrunk()

    const isLoading = isCreating || isUpdating || isDeleting
    const isMobile = useMediaQuery('(max-width:800px)')

    // Poll trunk registration status in edit mode
    const { data: trunkStatus } = useSipTrunkStatus(id || '', {
        pollingInterval: 15000,
        skip: !isEdit || !id || !active
    })

    // Auto-set userId for non-admin users
    useEffect(() => {
        if (!isAdmin && userData?.id && !formUserId) {
            dispatch(sipTrunkFormActions.setUserId(String(userData.id)))
        }
    }, [isAdmin, userData, formUserId, dispatch])

    const onClose = useCallback(() => {
        navigate(getRouteSipTrunks())
    }, [navigate])

    const onChangeAssistant = useCallback((_: any, value: AssistantOptions | null) => {
        dispatch(sipTrunkFormActions.setSelectedAssistant(value))
    }, [dispatch])

    const onChangePbx = useCallback((_: any, value: PbxServerOptions | null) => {
        dispatch(sipTrunkFormActions.setSelectedPbx(value))
    }, [dispatch])

    const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(sipTrunkFormActions.setName(e.target.value))
    }, [dispatch])

    const onChangeTrunkType = useCallback((type: SipTrunkType) => {
        dispatch(sipTrunkFormActions.setTrunkType(type))
    }, [dispatch])

    const onChangeSipServerAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(sipTrunkFormActions.setSipServerAddress(e.target.value))
    }, [dispatch])

    const onChangeTransport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(sipTrunkFormActions.setTransport(e.target.value as SipTransport))
    }, [dispatch])

    const onChangeAuthName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(sipTrunkFormActions.setAuthName(e.target.value))
    }, [dispatch])

    const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(sipTrunkFormActions.setPassword(e.target.value))
    }, [dispatch])

    const onChangeDomain = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(sipTrunkFormActions.setDomain(e.target.value))
    }, [dispatch])

    const onChangeCallerId = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(sipTrunkFormActions.setCallerId(e.target.value))
    }, [dispatch])

    const onChangeProviderIp = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(sipTrunkFormActions.setProviderIp(e.target.value))
    }, [dispatch])

    const onChangeActive = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(sipTrunkFormActions.setActive(e.target.checked))
    }, [dispatch])

    const onChangeRecords = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(sipTrunkFormActions.setRecords(e.target.checked))
    }, [dispatch])

    const onChangeClient = useCallback((clientId: string) => {
        dispatch(sipTrunkFormActions.setUserId(clientId))
        dispatch(sipTrunkFormActions.setSelectedAssistant(null))
    }, [dispatch])

    const onDelete = useCallback(async () => {
        if (!id) return

        const confirmed = window.confirm(t('Вы уверены, что хотите удалить SIP Trunk?') ?? '')
        if (!confirmed) return

        try {
            await deleteSipTrunk(id).unwrap()
            toast.success(t('SIP Trunk успешно удален'))
            navigate(getRouteSipTrunks())
            dispatch(sipTrunkFormActions.resetForm())
        } catch (e) {
            // Error handled by toastMiddleware
        }
    }, [id, t, navigate, dispatch, deleteSipTrunk])

    const onSave = useCallback(async () => {
        if (!selectedAssistant || !selectedPbx || !name || !sipServerAddress) {
            toast.error(t('Пожалуйста заполните все обязательные поля'))
            return
        }

        if (trunkType === 'registration' && (!authName || !password)) {
            toast.error(t('Заполните поля авторизации'))
            return
        }

        if (trunkType === 'ip' && !callerId) {
            toast.error(t('Укажите А-номер (CallerID)'))
            return
        }

        const payload = {
            assistantId: String(selectedAssistant.id),
            serverId: String(selectedPbx.id),
            name,
            trunkType,
            sipServerAddress,
            transport,
            authName: trunkType === 'registration' ? authName : null,
            password: trunkType === 'registration' ? password : null,
            domain: trunkType === 'registration' ? (domain || null) : null,
            callerId: trunkType === 'ip' ? callerId : null,
            providerIp: trunkType === 'ip' ? (providerIp || null) : null,
            active,
            records
        }

        try {
            if (isEdit && id) {
                await updateSipTrunk({ id, ...payload }).unwrap()
                toast.success(t('SIP Trunk успешно обновлен'))
            } else {
                await createSipTrunk(payload).unwrap()
                toast.success(t('SIP Trunk успешно создан'))
            }

            navigate(getRouteSipTrunks())
            dispatch(sipTrunkFormActions.resetForm())
        } catch (e) {
            // Error handled by toastMiddleware
        }
    }, [selectedAssistant, selectedPbx, name, trunkType, sipServerAddress, transport, authName, password, domain, callerId, providerIp, active, t, isEdit, id, navigate, dispatch, createSipTrunk, updateSipTrunk])

    return (
        <VStack gap={'16'} max className={classNames(cls.SipTrunkForm, {}, [className])}>
            <SipTrunkFormHeader
                onSave={onSave}
                onClose={onClose}
                onDelete={onDelete}
                isEdit={isEdit}
                isLoading={isLoading}
                trunkName={name || selectedAssistant?.name}
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
                        <TelephonySipTrunkCard
                            selectedAssistant={selectedAssistant}
                            onChangeAssistant={onChangeAssistant}
                            selectedPbx={selectedPbx}
                            onChangePbx={onChangePbx}
                            active={active || false}
                            onChangeActive={onChangeActive}
                            records={records || false}
                            onChangeRecords={onChangeRecords}
                            isEdit={isEdit}
                            isAdmin={isAdmin}
                            userId={String(userData?.id || '')}
                            clientId={formUserId}
                            onChangeClient={onChangeClient}
                            statusBadge={isEdit && id ? (
                                <HStack gap="8" align="center">
                                    <div
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            background: trunkStatus?.registered ? '#10b981' : '#f87171',
                                            boxShadow: trunkStatus?.registered
                                                ? '0 0 6px rgba(16, 185, 129, 0.5)'
                                                : '0 0 6px rgba(248, 113, 113, 0.5)',
                                        }}
                                    />
                                    <Text
                                        text={trunkStatus?.registered ? t('Зарегистрирован') : t('Не зарегистрирован')}
                                        size="s"
                                        bold
                                    />
                                </HStack>
                            ) : undefined}
                        />
                    </VStack>

                    <VStack gap="24" className={cls.rightColumn}>
                        <PropertiesSipTrunkCard
                            name={name}
                            onChangeName={onChangeName}
                            trunkType={trunkType}
                            onChangeTrunkType={onChangeTrunkType}
                            sipServerAddress={sipServerAddress}
                            onChangeSipServerAddress={onChangeSipServerAddress}
                            transport={transport}
                            onChangeTransport={onChangeTransport}
                            authName={authName}
                            onChangeAuthName={onChangeAuthName}
                            password={password}
                            onChangePassword={onChangePassword}
                            domain={domain}
                            onChangeDomain={onChangeDomain}
                            callerId={callerId}
                            onChangeCallerId={onChangeCallerId}
                            providerIp={providerIp}
                            onChangeProviderIp={onChangeProviderIp}
                        />
                    </VStack>
                </HStack>
            </VStack>

            <SipTrunkFormHeader
                onSave={onSave}
                onClose={onClose}
                onDelete={onDelete}
                isEdit={isEdit}
                isLoading={isLoading}
                variant={'diviner-bottom'}
                trunkName={name || selectedAssistant?.name}
            />
        </VStack>
    )
})
