import { memo } from 'react'
import { DocumentationLayout } from '@/widgets/DocumentationLayout'
import cls from './DocsPage.module.scss'

const DocsPage = memo(() => {
    return (
        <div data-testid={'DocsPage'} className={cls.DocsPage}>
            <DocumentationLayout />
        </div>
    )
})

export default DocsPage
