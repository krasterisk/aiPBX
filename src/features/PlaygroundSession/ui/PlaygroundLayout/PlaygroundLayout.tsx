import { memo, ReactNode } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PlaygroundLayout.module.scss'
import { useDevice } from '@/shared/lib/hooks/useDevice/useDevice'

interface PlaygroundLayoutProps {
    className?: string
    header: ReactNode
    conversationPanel: ReactNode
    debugPanel: ReactNode
    statusBar: ReactNode
}

export const PlaygroundLayout = memo((props: PlaygroundLayoutProps) => {
    const {
        className,
        header,
        conversationPanel,
        debugPanel,
        statusBar,
    } = props

    const isMobile = useDevice()

    return (
        <div className={classNames(cls.PlaygroundLayout, {}, [className])}>
            {header}

            <Group
                orientation={isMobile ? 'vertical' : 'horizontal'}
                id="playground-layout"
                className={cls.panelGroup}
            >
                <Panel
                    defaultSize="65%"
                    minSize="40%"
                    id="conversation"
                >
                    <div className={cls.conversationPanel}>
                        {conversationPanel}
                    </div>
                </Panel>

                <Separator className={cls.resizeHandle} id="sep-main" />

                <Panel
                    defaultSize="35%"
                    minSize="20%"
                    collapsible
                    id="debug"
                >
                    <div className={cls.debugPanel}>
                        {debugPanel}
                    </div>
                </Panel>
            </Group>

            {statusBar}
        </div>
    )
})
