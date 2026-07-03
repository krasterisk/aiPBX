import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/widgets/Page'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Card } from '@/shared/ui/redesigned/Card'
import {
    HelpdeskTicketTable,
    HelpdeskTicketKanban,
    CreateHelpdeskTicketModal,
    useGetHelpdeskTicketsQuery,
} from '@/entities/Helpdesk'
import cls from './HelpdeskListPage.module.scss'

type ViewMode = 'table' | 'kanban'

export const HelpdeskListPage = memo(() => {
    const { t } = useTranslation('admin')
    const [viewMode, setViewMode] = useState<ViewMode>('table')
    const [createOpen, setCreateOpen] = useState(false)
    const { data: tickets = [], isLoading, isError } = useGetHelpdeskTicketsQuery()

    const setTableView = useCallback(() => { setViewMode('table') }, [])
    const setKanbanView = useCallback(() => { setViewMode('kanban') }, [])
    const openCreate = useCallback(() => { setCreateOpen(true) }, [])
    const closeCreate = useCallback(() => { setCreateOpen(false) }, [])

    return (
        <Page data-testid="HelpdeskListPage" className={cls.HelpdeskListPage}>
            <VStack gap="24" max>
                <HStack justify="between" max wrap="wrap" gap="16">
                    <VStack gap="8">
                        <Text title={t('helpdesk.pageTitle')} />
                        <Text text={t('helpdesk.pageSubtitle')} size="s" variant="accent" />
                    </VStack>
                    <HStack gap="8">
                        <Button variant="glass-action" color="success" onClick={openCreate}>
                            {t('helpdesk.create.open')}
                        </Button>
                        <Button
                            variant={viewMode === 'table' ? 'glass-action' : 'clear'}
                            onClick={setTableView}
                        >
                            {t('helpdesk.view.table')}
                        </Button>
                        <Button
                            variant={viewMode === 'kanban' ? 'glass-action' : 'clear'}
                            onClick={setKanbanView}
                        >
                            {t('helpdesk.view.kanban')}
                        </Button>
                    </HStack>
                </HStack>

                <Card variant="glass" padding="16" max>
                    {isError && <Text text={t('helpdesk.loadError')} variant="error" />}
                    {viewMode === 'table' ? (
                        <HelpdeskTicketTable tickets={tickets} isLoading={isLoading} />
                    ) : (
                        <HelpdeskTicketKanban tickets={tickets} />
                    )}
                </Card>
            </VStack>
            <CreateHelpdeskTicketModal isOpen={createOpen} onClose={closeCreate} />
        </Page>
    )
})
