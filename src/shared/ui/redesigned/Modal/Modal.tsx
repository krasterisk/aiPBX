import cls from './Modal.module.scss'
import React, { ReactNode } from 'react'
import { classNames, Mods } from '@/shared/lib/classNames/classNames'
import { Portal } from '../Portal/Portal'
import { Overlay } from '../Overlay/Overlay'
import { useModal } from '@/shared/lib/hooks/useModal/useModal'
import { useTheme } from '@/shared/lib/hooks/useTheme/useTheme'
import { Icon } from '../Icon'
import CloseIcon from '@/shared/assets/icons/close.svg'

export type ModalSize = 'narrow' | 'wide'

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
    showClose = false
  } = props

  const { close, isClosing, isMounted } = useModal({ animationDelay: 300, onClose, isOpen })

  const { theme } = useTheme()

  const mods: Mods = {
    [cls.opened]: isOpen,
    [cls.isClosing]: isClosing,
    [cls.wide]: size === 'wide'
  }

  if (lazy && !isMounted) {
    return null
  }

  return (
    <Portal element={document.getElementById('app') ?? document.body}>
      <div className={classNames(cls.Modal, mods, [
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
