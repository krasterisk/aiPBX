import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './SnackAlert.module.scss'
import { memo } from 'react'
import { Alert, Snackbar } from '@mui/material'

export type AlertColor = 'success' | 'info' | 'warning' | 'error'
export type AlertVariant = 'filled' | 'standard' | 'outlined'
export type VerticalPos = 'top' | 'bottom'
export type HorizontalPos = 'center' | 'left' | 'right'

interface SnackalertProps {
  className?: string
  message: string
  open: boolean
  onClose: () => void
  severity: AlertColor
  variant: AlertVariant
  vertical?: VerticalPos
  horizontal?: HorizontalPos
  autoHideDuration?: number
}

export const SnackAlert = memo((props: SnackalertProps) => {
  const {
    className,
    message,
    open,
    onClose,
    severity,
    variant,
    vertical = 'top',
    horizontal = 'center',
    autoHideDuration
  } = props

  const cStyle = {
    zIndex: 'var(--modal-z-index+1)'
  }

  return (
            <Snackbar
                className={classNames(cls.SnackAlert, {}, [className])}
                open={open}
                onClose={onClose}
                anchorOrigin={{ vertical, horizontal }}
                autoHideDuration={autoHideDuration}
                sx={cStyle}
            >
                <Alert onClose={onClose} severity={severity} variant={variant}>
                    {message}
                </Alert>
            </Snackbar>
  )
})
