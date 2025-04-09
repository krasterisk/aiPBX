import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ContentViewSelector.module.scss'
import { memo, SVGProps, VFC } from 'react'
import ListIcon from '@/shared/assets/icons/burger.svg'
import TiledIcon from '@/shared/assets/icons/tile.svg'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { ContentView } from '../../../Content'

interface ViewSelectorProps {
  className?: string
  view: ContentView
  onViewClick: (view: ContentView) => void
}

interface viewsAttr {
  view: ContentView
  icon: VFC<SVGProps<SVGSVGElement>>
}

const viewTypes: viewsAttr[] = [
  {
    view: 'SMALL',
    icon: TiledIcon
  },
  {
    view: 'BIG',
    icon: ListIcon
  }
]

export const ContentViewSelector = memo((props: ViewSelectorProps) => {
  const {
    className,
    view,
    onViewClick
  } = props

  const onClick = (newView: ContentView) => () => {
    onViewClick?.(newView)
  }

  return (
        <Card
            className={classNames(
              cls.ContentViewSelector,
              {},
              [className]
            )}
            border={'partial'}
        >
            <HStack gap="8">
                {viewTypes.map(viewType => (
                    <Icon
                        key={viewType.view.length * 2}
                        clickable
                        onClick={onClick(viewType.view)}
                        width={24}
                        height={24}
                        Svg={viewType.icon}
                        className={classNames('', { [cls.notSelected]: viewType.view !== view })}
                    />
                ))}
            </HStack>
        </Card>
  )
})
