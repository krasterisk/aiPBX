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
          width: '50vw',
          maxWidth: '50vw',
          padding: '16px',
          boxSizing: 'border-box',
          overflowX: 'visible',
          overflowY: 'auto',
          backgroundColor: '#fff',
          color: '#000',
          '--text-redesigned': '#000',
          '& *': {
            color: '#000 !important',
            opacity: '1 !important'
          }
        }
      }}
    >
      {children}
    </MuiDrawer>
  )
})
