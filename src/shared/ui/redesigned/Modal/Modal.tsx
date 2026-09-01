import cls from './Modal.module.scss'
import React, { ReactNode, useEffect, useRef } from 'react'
import { classNames, Mods } from '@/shared/lib/classNames/classNames'
import { Portal } from '../Portal/Portal'
import { Overlay } from '../Overlay/Overlay'
import { useModal } from '@/shared/lib/hooks/useModal/useModal'
import { useTheme } from '@/shared/lib/hooks/useTheme/useTheme'
import { Icon } from '../Icon'
import CloseIcon from '@/shared/assets/icons/close.svg'

export type ModalSize = 'narrow' | 'wide'

function shouldBlockBackgroundWheel(
    root: HTMLElement,
    target: EventTarget | null,
    deltaY: number,
): boolean {
    let node = target instanceof HTMLElement ? target : null
    while (node && root.contains(node)) {
        const overflowY = window.getComputedStyle(node).overflowY
        const canScroll = (overflowY === 'auto' || overflowY === 'scroll') &&
            node.scrollHeight > node.clientHeight + 1
        if (canScroll) {
            if (deltaY < 0 && node.scrollTop <= 0) return true
            if (deltaY > 0 && node.scrollTop + node.clientHeight >= node.scrollHeight - 1) return true
            return false
        }
        if (node === root) break
        node = node.parentElement
    }
    return true
}

interface ModalProps {
  className?: string
  children?: ReactNode
  isOpen?: boolean
  onClose?: () => void
  lazy?: boolean
  contentClassName?: string
  /** Modal width preset: 'narrow' (520px) or 'wide' (960px). Default: 'narrow' */
  size?: ModalSize
  /** Show a fixed close button in the top-right corner */
  showClose?: boolean
  /** Stack above another open modal (nested confirm dialogs) */
  elevated?: boolean
}

export const Modal = (props: ModalProps) => {
  const {
    className,
    children,
    isOpen,
    onClose,
    lazy,
    contentClassName,
    size = 'narrow',
    showClose = false,
    elevated = false,
  } = props

  const { close, isClosing, isMounted } = useModal({ animationDelay: 300, onClose, isOpen })
  const rootRef = useRef<HTMLDivElement>(null)

  const { theme } = useTheme()

  useEffect(() => {
      const root = rootRef.current
      if (!root || !isOpen) return

      const onWheel = (event: WheelEvent) => {
          if (shouldBlockBackgroundWheel(root, event.target, event.deltaY)) {
              event.preventDefault()
          }
      }

      root.addEventListener('wheel', onWheel, { passive: false })
      return () => {
          root.removeEventListener('wheel', onWheel)
      }
  }, [isOpen])

  const mods: Mods = {
    [cls.opened]: isOpen,
    [cls.isClosing]: isClosing,
    [cls.wide]: size === 'wide',
    [cls.elevated]: elevated,
  }

  if (lazy && !isMounted) {
    return null
  }

  return (
    <Portal element={document.getElementById('app') ?? document.body}>
      <div
        ref={rootRef}
        className={classNames(cls.Modal, mods, [
        className,
        theme,
        'app_modal',
        cls.modalNew
      ])}
      >
        <Overlay onClick={close} />
        <div
          className={classNames(cls.content, { [cls.isClosing]: isClosing }, [contentClassName])}
        >
          {showClose && (
            <button
              type='button'
              className={cls.closeBtn}
              onClick={close}
              aria-label='Close'
            >
              <Icon Svg={CloseIcon} className={cls.closeBtnIcon} />
            </button>
          )}
          {children}
        </div>
      </div>
    </Portal>
  )
}
