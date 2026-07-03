import { Page } from '@/widgets/Page'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Card } from '@/shared/ui/redesigned/Card'
import { getRouteHelpdesk } from '@/shared/const/router'

const AdminPage = memo(() => {
  const { t } = useTranslation('admin')
  const navigate = useNavigate()

  return (
        <Page data-testid={'AdminPage'}>
            <VStack gap="24" max>
                <Text title={t('Панель администратора')} />
                <Card variant="glass" padding="16">
                    <VStack gap="12">
                        <Text text={t('helpdesk.pageSubtitle')} size="s" variant="accent" />
                        <Button variant="glass-action" onClick={() => { navigate(getRouteHelpdesk()) }}>
                            {t('helpdesk.adminLink')}
                        </Button>
                    </VStack>
                </Card>
            </VStack>
        </Page>
  )
})

export default AdminPage
