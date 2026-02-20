import { classNames } from '@/shared/lib/classNames/classNames'
import { useTranslation } from 'react-i18next'
import cls from './Playground.module.scss'
import { memo } from 'react'
import { Page } from '@/widgets/Page'
import { PlaygroundSession } from '@/features/PlaygroundSession'

interface PlaygroundPageProps {
    className?: string
}

const PlaygroundPage = memo((props: PlaygroundPageProps) => {
    const { className } = props
    const { t } = useTranslation('playground')

    return (
        <Page data-testid={'PlaygroundPage'} className={classNames(cls.Playground, {}, [className])}>
            <PlaygroundSession />
        </Page>
    )
})

export default PlaygroundPage
