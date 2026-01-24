import { Menu } from '@headlessui/react'
import cls from './Dropdown.module.scss'
import { classNames } from '../../../../../lib/classNames/classNames'
import { Fragment, ReactNode } from 'react'
import { DropdownDirection } from '../../../../../types/ui'
import { AppLink } from '../../../AppLink/AppLink'
import popupCls from '../../styles/popup.module.scss'
import { useTheme } from '@/shared/lib/hooks/useTheme/useTheme'

export interface DropDownItem {
  disabled?: boolean
  content?: ReactNode
  onClick?: () => void
  href?: string
}

interface DropdownProps {
  className?: string
  items: DropDownItem[]
  trigger?: ReactNode
  direction?: DropdownDirection
}

export function Dropdown(props: DropdownProps) {
  const {
    className,
    trigger,
    items,
    direction = 'bottom-left'
  } = props

  const { theme } = useTheme()

  const mapDirectionToAnchor = (dir: DropdownDirection) => {
    switch (dir) {
      case 'bottom-left': return 'bottom end'
      case 'bottom-right': return 'bottom start'
      case 'top-left': return 'top end'
      case 'top-right': return 'top start'
      default: return 'bottom start'
    }
  }

  return (
    <Menu as="div" className={classNames(cls.Dropdown, {}, [className, popupCls.popup])}>
      <Menu.Button className={popupCls.trigger}>
        {trigger}
      </Menu.Button>
      <Menu.Items
        anchor={mapDirectionToAnchor(direction) as any}
        className={classNames(cls.menu, {}, [popupCls.menu, theme, 'app_redesigned', 'popup-z-index'])}
      >
        {items.map((item, index) => {
          const content = ({ active }: { active: boolean }) => (
            <button
              type={'button'}
              onClick={item.onClick}
              disabled={item.disabled}
              className={classNames(cls.item, { [popupCls.active]: active }, [])}
            >
              {item.content}
            </button>
          )
          if (item.href) {
            return (
              <Menu.Item
                as={AppLink}
                to={item.href}
                disabled={item.disabled}
                key={`drop-down-key-${index}`}
              >
                {content}
              </Menu.Item>
            )
          }
          return (
            <Menu.Item
              as={Fragment}
              disabled={item.disabled}
              key={`drop-down-key-${index}`}
            >
              {content}
            </Menu.Item>
          )
        })}
      </Menu.Items>
    </Menu>
  )
}
