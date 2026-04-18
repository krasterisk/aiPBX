import { memo, useCallback, useEffect, useRef, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X, type LucideIcon } from 'lucide-react'
import cls from './SettingsPopover.module.scss'

export type SettingsTab = 'prompt' | 'model' | 'vad' | null

interface SettingsPopoverProps {
    isOpen: boolean
    onClose: () => void
    title: string
    icon: LucideIcon
    wide?: boolean
    children: ReactNode
    footer?: ReactNode
}

export const SettingsPopover = memo((props: SettingsPopoverProps) => {
    const { isOpen, onClose, title, icon: Icon, wide, children, footer } = props
    const popoverRef = useRef<HTMLDivElement>(null)

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handler)
        return () => { document.removeEventListener('keydown', handler) }
    }, [isOpen, onClose])

    // Close on outside click
    const handleOverlayClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose()
    }, [onClose])

    if (!isOpen) return null

    return createPortal(
        <div className={cls.popoverOverlay} onClick={handleOverlayClick}>
            <div
                ref={popoverRef}
                className={wide ? cls.popoverWide : cls.popover}
                onClick={(e) => { e.stopPropagation() }}
            >
                <div className={cls.popoverHeader}>
                    <span className={cls.popoverTitle}>
                        <Icon size={16} className={cls.popoverTitleIcon} />
                        {title}
                    </span>
                    <button className={cls.popoverClose} onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                <div className={cls.popoverBody}>
                    {children}
                </div>

                {footer && (
                    <div className={cls.popoverFooter}>
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    )
})
