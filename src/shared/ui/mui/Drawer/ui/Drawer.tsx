import { classNames } from '@/shared/lib/classNames/classNames'
import { memo, ReactNode } from 'react'
import { Drawer as MuiDrawer } from '@mui/material'

interface DrawerProps {
  className?: string
  children: ReactNode
  isOpen?: boolean
  onClose?: () => void
}

export const Drawer = memo((props: DrawerProps) => {
  const {
    className,
    children,
    isOpen,
    onClose
  } = props

  return (
    <MuiDrawer
      open={isOpen}
      onClose={onClose}
      className={classNames('', {}, [className])}
      sx={{
        '& .MuiDrawer-paper': {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '80vw',
          maxWidth: '320px',
          padding: '8px',
          boxSizing: 'border-box',
          overflowX: 'visible',
          overflowY: 'auto',
          background: 'var(--bg-redesigned)',
          color: 'var(--text-redesigned)',
          borderRight: '1px solid var(--glass-border-primary)',
        }
      }}
    >
      {children}
    </MuiDrawer>
  )
})
