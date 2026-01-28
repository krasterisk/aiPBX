import { classNames } from '@/shared/lib/classNames/classNames'
import { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { PublishSipUrisForm, publishSipUrisFormReducer, publishSipUrisFormActions } from '@/features/PublishSipUris'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useParams } from 'react-router-dom'
import { useAssistant } from '@/entities/Assistants'
import { usePbxServer } from '@/entities/PbxServers'
import { skipToken } from '@reduxjs/toolkit/query/react'
import { Loader } from '@/shared/ui/Loader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'

interface PublishSipUriEditPageProps {
    className?: string
}

const reducers: ReducersList = {
    publishSipUrisForm: publishSipUrisFormReducer
}

const PublishSipUriEditPage = memo((props: PublishSipUriEditPageProps) => {
    const { className } = props
    const { t } = useTranslation('publish-sip')
    const { id } = useParams<{ id: string }>()
    const dispatch = useAppDispatch()

    const { data: assistant, isLoading } = useAssistant(id || '', {
        skip: !id
    })

    const { data: pbxServer } = usePbxServer(assistant?.sipAccount?.pbxId || skipToken)

    useEffect(() => {
        if (assistant && assistant.id) {
            dispatch(publishSipUrisFormActions.initForm({
                assistant: {
                    id: String(assistant.id),
                    name: assistant.name || '',
                    userId: assistant.userId
                },
                pbx: {
                    id: assistant.sipAccount?.pbxId || '',
                    name: pbxServer?.name || ''
                },
                ip: assistant.sipAccount?.ipAddress || ''
            }))
        }
    }, [assistant, dispatch, pbxServer])

    if (isLoading) {
        return (
            <Page>
                <Loader />
            </Page>
        )
    }

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount>
            <Page className={classNames('', {}, [className])}>
                <VStack gap="24" max>
                    <Text title={`${t('Редактирование SIP URI')}: ${assistant?.name}`} size="l" bold />
                    <PublishSipUrisForm isEdit />
                </VStack>
            </Page>
        </DynamicModuleLoader>
    )
})

export default PublishSipUriEditPage
