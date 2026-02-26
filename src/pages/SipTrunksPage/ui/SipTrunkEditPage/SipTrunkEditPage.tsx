import { classNames } from '@/shared/lib/classNames/classNames'
import { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { SipTrunkForm, sipTrunkFormReducer, sipTrunkFormActions } from '@/features/SipTrunks'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useParams } from 'react-router-dom'
import { useSipTrunk } from '@/entities/SipTrunks'
import { Loader } from '@/shared/ui/Loader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'

interface SipTrunkEditPageProps {
    className?: string
}

const reducers: ReducersList = {
    sipTrunkForm: sipTrunkFormReducer
}

const SipTrunkEditPage = memo((props: SipTrunkEditPageProps) => {
    const { className } = props
    const { t } = useTranslation('sip-trunks')
    const { id } = useParams<{ id: string }>()
    const dispatch = useAppDispatch()

    const { data: trunk, isLoading } = useSipTrunk(id || '', {
        skip: !id
    })

    useEffect(() => {
        if (trunk) {
            dispatch(sipTrunkFormActions.initForm({
                assistant: trunk.assistant
                    ? {
                        id: String(trunk.assistant.id),
                        name: trunk.assistant.name || '',
                        uniqueId: trunk.assistant.uniqueId
                    }
                    : null as any,
                pbx: trunk.server
                    ? {
                        id: String(trunk.server.id),
                        name: trunk.server.name || '',
                        location: trunk.server.location,
                        sip_host: trunk.server.sip_host
                    }
                    : null as any,
                name: trunk.name,
                trunkType: trunk.trunkType ?? 'registration',
                sipServerAddress: trunk.sipServerAddress,
                transport: trunk.transport ?? 'udp',
                authName: trunk.authName ?? '',
                password: trunk.password ?? '',
                domain: trunk.domain ?? '',
                callerId: trunk.callerId ?? '',
                providerIp: trunk.providerIp ?? '',
                active: trunk.active,
                userId: trunk.userId ? String(trunk.userId) : ''
            }))
        }
    }, [trunk, dispatch])

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
                    <SipTrunkForm isEdit />
                </VStack>
            </Page>
        </DynamicModuleLoader>
    )
})

export default SipTrunkEditPage
