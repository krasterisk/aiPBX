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

export function Popover (props: PopoverProps) {
  const {
    className,
    trigger,
    direction: baseDirection = 'bottom-left',
    children
  } = props

  const buttonRef = useRef<HTMLElement | null>(null)
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({})
  const [direction, setDirection] = useState<DropdownDirection>(baseDirection)

  const menuClasses = [mapDirectionClass[direction], popupCls.menu]

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const style: React.CSSProperties = {}
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - rect.bottom
      const spaceAbove = rect.top

      let finalDirection = baseDirection

      if (baseDirection.startsWith('bottom') && spaceBelow < 250 && spaceAbove > spaceBelow) {
        finalDirection = baseDirection.replace('bottom', 'top') as DropdownDirection
      } else if (baseDirection.startsWith('top') && spaceAbove < 250 && spaceBelow > spaceAbove) {
        finalDirection = baseDirection.replace('top', 'bottom') as DropdownDirection
      }

      if (finalDirection !== direction) {
        setDirection(finalDirection)
      }

      // Vertical positioning
      if (finalDirection.startsWith('bottom')) {
        style.top = rect.bottom + 4
      } else {
        style.bottom = window.innerHeight - rect.top + 4
      }

      // Horizontal positioning
      if (finalDirection.endsWith('right')) {
        style.left = rect.left
      } else {
        style.right = window.innerWidth - rect.right
      }

      setPanelStyle(style)
    }
  }

  return (
    <HPopover className={classNames(cls.Popover, {}, [className, popupCls.popup, 'popup-z-index'])}>
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
                className={classNames(cls.panel, {}, [...menuClasses, 'popup-z-index'])}
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
