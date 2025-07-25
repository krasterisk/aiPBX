import React, { memo } from 'react'
import { Page } from '@/widgets/Page'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/ui/redesigned/Text'

const MainPage = memo(() => {
  const { t } = useTranslation('main')

  return (
  <Page data-testid={'MainPage'}>
       <Text title={t('Главная страница')}/>
  </Page>
  )
})

export default MainPage
