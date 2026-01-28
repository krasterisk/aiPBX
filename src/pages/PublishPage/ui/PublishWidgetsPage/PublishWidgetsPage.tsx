import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsPage.module.scss'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { useWidgetKeys } from '@/entities/WidgetKeys'
import { useSelector } from 'react-redux'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { PublishWidgetsHeader, PublishWidgetsList } from '@/features/PublishWidgets'
import { useAssistantsAll } from '@/entities/Assistants'

interface PublishWidgetsPageProps {
    className?: string
}

const PublishWidgetsPage = memo((props: PublishWidgetsPageProps) => {
    const { className } = props
    const { t } = useTranslation('publish-widgets')
    const userData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)

    const { data: widgets = [], isLoading } = useWidgetKeys()
    const { data: assistants = [] } = useAssistantsAll({})

    const filteredWidgets = isAdmin
        ? widgets
        : widgets.filter(w => {
            const assistant = assistants.find(a => a.id === String(w.assistantId))
            return assistant?.userId === userData?.id
        })

    return (
        <Page className={classNames(cls.PublishWidgetsPage, {}, [className])}>
            <VStack gap="24" max>
                <PublishWidgetsHeader />
                <PublishWidgetsList
                    widgets={filteredWidgets}
                    isLoading={isLoading}
                />
            </VStack>
        </Page>
    )
})

export default PublishWidgetsPage
