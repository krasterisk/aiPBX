import { memo } from 'react'
import { Page } from '@/widgets/Page'
import { DocumentationLayout } from '@/widgets/DocumentationLayout'
import cls from './DocsPage.module.scss'

const DocsPage = memo(() => {
    return (
        <Page data-testid={'DocsPage'} className={cls.DocsPage}>
            <DocumentationLayout />
        </Page>
    )
})

export default DocsPage
