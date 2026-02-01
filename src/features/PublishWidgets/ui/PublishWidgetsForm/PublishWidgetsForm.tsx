import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsForm.module.scss'
import { memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { AssistantOptions } from '@/entities/Assistants'
import { PbxServerOptions, usePbxServersAll } from '@/entities/PbxServers'
import {
    getPublishWidgetsFormName,
    getPublishWidgetsFormSelectedAssistant,
    getPublishWidgetsFormSelectedPbxServer,
    getPublishWidgetsFormAllowedDomains,
    getPublishWidgetsFormMaxSessions,
    getPublishWidgetsFormMaxSessionDuration,
    getPublishWidgetsFormIsActive,
    getPublishWidgetsFormAppearance
} from '../../model/selectors/publishWidgetsFormSelectors'
import { publishWidgetsFormActions } from '../../model/slices/publishWidgetsFormSlice'
import { isUserAdmin, getUserAuthData } from '@/entities/User'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { useNavigate } from 'react-router-dom'
import { getRoutePublishWidgets } from '@/shared/const/router'
import { useCreateWidgetKey, useUpdateWidgetKey } from '@/entities/WidgetKeys'
import { PublishWidgetsFormHeader } from '../PublishWidgetsFormHeader/PublishWidgetsFormHeader'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { TelephonyAiCard } from './components/TelephonyAiCard/TelephonyAiCard'
import { SecurityLimitsCard } from './components/SecurityLimitsCard/SecurityLimitsCard'
import { StyleSettingsCard } from './components/StyleSettingsCard/StyleSettingsCard'
import { WidgetPreviewCard } from './components/WidgetPreviewCard/WidgetPreviewCard'
import { useMediaQuery } from '@mui/material'

interface PublishWidgetsFormProps {
    className?: string
    isEdit?: boolean
    widgetId?: string
}

export const PublishWidgetsForm = memo((props: PublishWidgetsFormProps) => {
    const { className, isEdit, widgetId } = props
    const { t } = useTranslation('publish-widgets')
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const name = useSelector(getPublishWidgetsFormName)
    const selectedAssistant = useSelector(getPublishWidgetsFormSelectedAssistant)
    const selectedPbxServer = useSelector(getPublishWidgetsFormSelectedPbxServer)
    const allowedDomains = useSelector(getPublishWidgetsFormAllowedDomains)
    const maxSessions = useSelector(getPublishWidgetsFormMaxSessions)
    const maxSessionDuration = useSelector(getPublishWidgetsFormMaxSessionDuration)
    const isActive = useSelector(getPublishWidgetsFormIsActive)
    const appearance = useSelector(getPublishWidgetsFormAppearance)
    const isAdmin = useSelector(isUserAdmin)
    const userData = useSelector(getUserAuthData)

    const [createWidget, { isLoading: isCreating }] = useCreateWidgetKey()
    const [updateWidget, { isLoading: isUpdating }] = useUpdateWidgetKey()
    const isLoading = isCreating || isUpdating

    const isMobile = useMediaQuery('(max-width:800px)')

    const { data: allPbxServers, isLoading: isServersLoading } = usePbxServersAll(null)

    useEffect(() => {
        if (selectedPbxServer && !selectedPbxServer.wss_url && allPbxServers) {
            const fullServerData = allPbxServers.find(s => String(s.id) === String(selectedPbxServer.id))
            if (fullServerData && fullServerData.wss_url) {
                dispatch(publishWidgetsFormActions.setSelectedPbxServer({
                    id: String(fullServerData.id),
                    name: fullServerData.name || '',
                    wss_url: fullServerData.wss_url,
                    uniqueId: fullServerData.uniqueId
                }))
            }
        }
    }, [selectedPbxServer, allPbxServers, dispatch])

    const onChangeName = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => dispatch(publishWidgetsFormActions.setName(e.target.value)),
        [dispatch]
    )

    const onChangeAssistant = useCallback(
        (_: unknown, v: AssistantOptions | null) => dispatch(publishWidgetsFormActions.setSelectedAssistant(v)),
        [dispatch]
    )

    const onChangePbxServer = useCallback(
        (_: unknown, v: PbxServerOptions | null) => dispatch(publishWidgetsFormActions.setSelectedPbxServer(v)),
        [dispatch]
    )

    const onChangeDomains = useCallback(
        (val: string) => dispatch(publishWidgetsFormActions.setAllowedDomains(val)),
        [dispatch]
    )

    const onChangeMaxSessions = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            dispatch(publishWidgetsFormActions.setMaxConcurrentSessions(Number(e.target.value))),
        [dispatch]
    )

    const onChangeMaxSessionDuration = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            dispatch(publishWidgetsFormActions.setMaxSessionDuration(Number(e.target.value))),
        [dispatch]
    )

    const onChangeIsActive = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => dispatch(publishWidgetsFormActions.setIsActive(e.target.checked)),
        [dispatch]
    )

    const onChangeAppearance = useCallback(
        (field: string, value: unknown) => dispatch(publishWidgetsFormActions.setAppearance({ [field]: value })),
        [dispatch]
    )

    const onSave = useCallback(async () => {
        if (!name || !selectedAssistant) {
            toast.error(t('Пожалуйста заполните обязательные поля'))
            return
        }

        if (!selectedPbxServer) {
            toast.error(t('Пожалуйста выберите PBX сервер'))
            return
        }

        const domainsArray = allowedDomains
            ? allowedDomains.split(/[\n,]/).map(d => d.trim()).filter(Boolean)
            : []

        if (domainsArray.length === 0) {
            toast.error(t('Пожалуйста добавьте хотя бы один разрешенный домен'))
            return
        }

        const data = {
            name,
            assistantId: Number(selectedAssistant.id),
            pbxServerId: selectedPbxServer ? Number(selectedPbxServer.id) : undefined,
            allowedDomains: JSON.stringify(domainsArray),
            maxConcurrentSessions: maxSessions,
            maxSessionDuration,
            isActive,
            appearance: JSON.stringify(appearance),
            language: appearance?.language,
            logo: appearance?.logo
        }

        try {
            if (isEdit && widgetId) {
                await updateWidget({ id: Number(widgetId), ...data }).unwrap()
                toast.success(t('Виджет успешно обновлен'))
            } else {
                await createWidget(data).unwrap()
                toast.success(t('Виджет успешно создан'))
            }
            navigate(getRoutePublishWidgets())
            dispatch(publishWidgetsFormActions.resetForm())
        } catch (e) {
            toast.error(getErrorMessage(e))
        }
    }, [name, selectedAssistant, selectedPbxServer, allowedDomains, maxSessions, maxSessionDuration, isActive, appearance, isEdit, widgetId, updateWidget, createWidget, navigate, dispatch, t])

    if ((isLoading || isServersLoading) && isEdit) {
        return (
            <VStack gap="16" max>
                <Skeleton width="100%" height={100} border="12px" />
                <HStack gap="24" max align="start" wrap={isMobile ? 'wrap' : 'nowrap'}>
                    <VStack gap="16" style={{ flex: 1 }} max>
                        <Skeleton width="100%" height={300} border="16px" />
                        <Skeleton width="100%" height={200} border="16px" />
                    </VStack>
                    <VStack gap="16" style={{ width: isMobile ? '100%' : '400px' }} max>
                        <Skeleton width="100%" height={250} border="16px" />
                        <Skeleton width="100%" height={400} border="16px" />
                    </VStack>
                </HStack>
            </VStack>
        )
    }

    return (
        <VStack gap="16" max className={classNames(cls.PublishWidgetsForm, {}, [className])}>
            <PublishWidgetsFormHeader
                onSave={onSave}
                isEdit={isEdit}
                isLoading={isLoading}
            />

            {/* Content: Sections */}
            <VStack gap="24" max align="center">
                <HStack gap="24" max align="start" className={cls.contentWrapper}>
                    {/* Left Column: Configuration */}
                    <VStack gap="24" className={cls.leftColumn}>
                        <TelephonyAiCard
                            selectedAssistant={selectedAssistant}
                            onChangeAssistant={onChangeAssistant}
                            selectedPbxServer={selectedPbxServer}
                            onChangePbxServer={onChangePbxServer}
                            name={name}
                            onChangeName={onChangeName}
                            isActive={isActive}
                            onChangeIsActive={onChangeIsActive}
                            isAdmin={isAdmin}
                            userId={userData?.id}
                        />

                        <SecurityLimitsCard
                            allowedDomains={allowedDomains}
                            onChangeDomains={onChangeDomains}
                            maxSessions={maxSessions}
                            onChangeMaxSessions={onChangeMaxSessions}
                            maxSessionDuration={maxSessionDuration}
                            onChangeMaxSessionDuration={onChangeMaxSessionDuration}
                            isMobile={isMobile}
                        />
                    </VStack>

                    {/* Right Column: Style */}
                    <VStack gap="24" className={cls.rightColumn}>
                        <StyleSettingsCard
                            appearance={appearance}
                            onChangeAppearance={onChangeAppearance}
                        />
                    </VStack>
                </HStack>

                {/* Preview: Centered Below */}
                <WidgetPreviewCard appearance={appearance} name={name} />
            </VStack>

            <PublishWidgetsFormHeader
                onSave={onSave}
                isEdit={isEdit}
                isLoading={isLoading}
                variant={'diviner-bottom'}
            />
        </VStack>
    )
})
