import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Drawer.module.scss'
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
    <div
      className={classNames(cls.Drawer, {}, [className])}
    >
      <MuiDrawer
        open={isOpen}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 'fit-content',
            minWidth: '280px',
            maxWidth: { xs: '85vw', sm: '50vw' },
            padding: '16px',
            boxSizing: 'border-box',
            overflowX: 'hidden',
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
    </div>
  )
})
