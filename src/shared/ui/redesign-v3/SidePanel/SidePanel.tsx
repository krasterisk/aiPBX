import { classNames } from '@/shared/lib/classNames/classNames'
import { Drawer as MuiDrawer } from '@mui/material'
import { ChevronLeft, X } from 'lucide-react'
import { memo, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import cls from './SidePanel.module.scss'

export interface SidePanelProps {
    isOpen: boolean
    onClose: () => void
    onBack?: () => void
    backLabel?: string
    title: string
    children: ReactNode
    className?: string
}

export const SidePanel = memo((props: SidePanelProps) => {
    const {
        isOpen,
        onClose,
        onBack,
        backLabel,
        title,
        children,
        className,
    } = props

    const { t } = useTranslation('reports')

    return (
        <MuiDrawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
            className={classNames('', {}, [className])}
            PaperProps={{
                'aria-label': title,
                className: cls.paper,
            }}
        >
            <header className={cls.header}>
                <div className={cls.headerStart}>
                    {onBack && (
                        <button
                            type="button"
                            className={cls.backButton}
                            onClick={onBack}
                            aria-label={backLabel ?? String(t('Назад'))}
                        >
                            <ChevronLeft size={20} aria-hidden />
                            {backLabel && (
                                <span className={cls.backLabel}>{backLabel}</span>
                            )}
                        </button>
                    )}
                    <h2 className={cls.title}>{title}</h2>
                </div>
                <button
                    type="button"
                    className={cls.iconButton}
                    onClick={onClose}
                    aria-label={String(t('Закрыть панель'))}
                >
                    <X size={20} aria-hidden />
                </button>
            </header>
            <div className={cls.body}>
                {children}
            </div>
        </MuiDrawer>
    )
})
