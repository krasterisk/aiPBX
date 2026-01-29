import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisForm.module.scss'
import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { AssistantSelect, AssistantOptions } from '@/entities/Assistants'
import { PbxServerSelect, useCreateSipUri, PbxServerOptions } from '@/entities/PbxServers'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Card } from '@/shared/ui/redesigned/Card'
import {
    getPublishSipUrisFormSelectedAssistant,
    getPublishSipUrisFormSelectedPbx,
    getPublishSipUrisFormIpAddress
} from '../../model/selectors/publishSipUrisFormSelectors'
import { publishSipUrisFormActions } from '../../model/slices/publishSipUrisFormSlice'
import { isUserAdmin, getUserAuthData } from '@/entities/User'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { useNavigate } from 'react-router-dom'
import { getRoutePublishSipUris } from '@/shared/const/router'
import { PublishSipUrisFormHeader } from '../PublishSipUrisFormHeader/PublishSipUrisFormHeader'

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
    const isAdmin = useSelector(isUserAdmin)
    const userData = useSelector(getUserAuthData)

    const [createSip, { isLoading }] = useCreateSipUri()

    const onChangeAssistant = useCallback((_: any, value: AssistantOptions | null) => {
        dispatch(publishSipUrisFormActions.setSelectedAssistant(value))
    }, [dispatch])

    const onChangePbx = useCallback((_: any, value: PbxServerOptions | null) => {
        dispatch(publishSipUrisFormActions.setSelectedPbx(value))
    }, [dispatch])

    const onChangeIp = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(publishSipUrisFormActions.setIpAddress(e.target.value))
    }, [dispatch])

    const onSave = useCallback(async () => {
        if (!selectedAssistant || !selectedPbx || !ipAddress) {
            toast.error(t('Пожалуйста заполни все поля'))
            return
        }

        try {
            await createSip({
                assistantId: selectedAssistant.id,
                serverId: selectedPbx.id,
                ipAddress
            }).unwrap()

            toast.success(isEdit ? t('SIP URI успешно обновлен') : t('SIP URI успешно создан'))
            navigate(getRoutePublishSipUris())
            dispatch(publishSipUrisFormActions.resetForm())
        } catch (e) {
            toast.error(getErrorMessage(e))
        }
    }, [selectedAssistant, selectedPbx, ipAddress, createSip, t, isEdit, navigate, dispatch])

    return (
        <VStack gap={'8'} max className={classNames(cls.PublishSipUrisForm, {}, [className])}>
            <PublishSipUrisFormHeader
                onSave={onSave}
                isEdit={isEdit}
                isLoading={isLoading}
            />

            <Card padding={'24'} max border={'partial'}>
                <VStack gap={'16'} max>
                    <AssistantSelect
                        key={selectedAssistant?.id}
                        label={t('AI Ассистент') || ''}
                        value={selectedAssistant}
                        onChangeAssistant={onChangeAssistant}
                        userId={isEdit ? selectedAssistant?.userId : (isAdmin ? undefined : userData?.id)}
                    />

                    <PbxServerSelect
                        key={selectedPbx?.id}
                        label={t('Выберите VoIP сервер') || ''}
                        value={selectedPbx}
                        onChangePbxServer={onChangePbx}
                    />

                    <Textarea
                        label={t('Ваш IP Адрес') || ''}
                        value={ipAddress}
                        onChange={onChangeIp}
                        placeholder={t('Введите IP адрес') || '1.2.3.4'}
                    />
                </VStack>
            </Card>

            <PublishSipUrisFormHeader
                onSave={onSave}
                isEdit={isEdit}
                isLoading={isLoading}
                variant={'diviner-bottom'}
            />
        </VStack>
    )
})
