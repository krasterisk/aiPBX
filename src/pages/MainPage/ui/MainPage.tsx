import React, { memo } from 'react'
import { Page } from '@/widgets/Page'
import { StatusPage } from '../../StatusPage'

const MainPage = memo(() => {
  return (
        <Page data-testid={'MainPage'}>
            <StatusPage />
        </Page>
  )
})

export default MainPage
