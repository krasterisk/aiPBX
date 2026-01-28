import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisPage.module.scss'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { useAssistantsAll } from '@/entities/Assistants'
import { useSelector } from 'react-redux'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { PublishSipUrisHeader, PublishSipUrisList } from '@/features/PublishSipUris'

interface PublishSipUrisPageProps {
    className?: string
}

const PublishSipUrisPage = memo((props: PublishSipUrisPageProps) => {
    const { className } = props
    const { t } = useTranslation('publish-sip')
    const userData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)

    const { data: assistants = [], isLoading } = useAssistantsAll({})

    const filteredAssistants = isAdmin
        ? assistants
        : assistants.filter(a => a.userId === userData?.id)

    const assistantsWithSip = filteredAssistants.filter(a => a.sipAccount)

    return (
        <Page className={classNames(cls.PublishSipUrisPage, {}, [className])}>
            <VStack gap="24" max>
                <PublishSipUrisHeader />
                <PublishSipUrisList
                    assistants={assistantsWithSip}
                    isLoading={isLoading}
                />
            </VStack>
        </Page>
    )
})

export default PublishSipUrisPage
