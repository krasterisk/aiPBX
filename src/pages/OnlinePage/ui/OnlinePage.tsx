import React, { memo } from 'react'
import { Page } from '@/widgets/Page'
import { StatusPage } from '../../StatusPage'

const OnlinePage = memo(() => {
  return (
        <Page data-testid={'OnlinePage'}>
            <StatusPage />
        </Page>
  )
})

export default OnlinePage
