import { ReactNode, useRef, useState } from 'react'
import { Popover as HPopover } from '@headlessui/react'
import { DropdownDirection } from '@/shared/types/ui'
import { mapDirectionClass } from '../../styles/consts'
import popupCls from '../../styles/popup.module.scss'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Popover.module.scss'

interface PopoverProps {
  className?: string
  trigger?: ReactNode
  direction?: DropdownDirection
  children?: ReactNode
}

export function Popover(props: PopoverProps) {
  const {
    className,
    trigger,
    direction = 'bottom-left',
    children
  } = props

  const buttonRef = useRef<HTMLElement | null>(null)
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({})

  const menuClasses = [mapDirectionClass[direction], popupCls.menu]

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const style: React.CSSProperties = {}

      // Vertical positioning
      if (direction.startsWith('bottom')) {
        style.top = rect.bottom + 4
      } else {
        style.bottom = window.innerHeight - rect.top + 4
      }

      // Horizontal positioning
      if (direction.endsWith('right')) {
        style.left = rect.left
      } else {
        style.right = window.innerWidth - rect.right
      }

      setPanelStyle(style)
    }
  }

  return (
    <HPopover className={classNames(cls.Popover, {}, [className, popupCls.popup])}>
      {({ open }) => {
        if (open) {
          setTimeout(updatePosition, 0)
        }

        return (
          <>
            <HPopover.Button
              as={'div'}
              className={popupCls.trigger}
              ref={(el: HTMLElement | null) => { buttonRef.current = el }}
            >
              {trigger}
            </HPopover.Button>

            {open && (
              <HPopover.Panel
                className={classNames(cls.panel, {}, menuClasses)}
                style={panelStyle}
                static
              >
                {children}
              </HPopover.Panel>
            )}
          </>
        )
      }}
    </HPopover>
  )
}
