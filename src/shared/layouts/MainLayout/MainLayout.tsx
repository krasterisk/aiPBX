import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './MainLayout.module.scss'
import { memo, ReactElement } from 'react'
import { useMediaQuery } from '@mui/material'

interface MainLayoutProps {
  className?: string
  header: ReactElement
  content: ReactElement
  sidebar: ReactElement
  toolbar?: ReactElement
}

export const MainLayout = memo((props: MainLayoutProps) => {
  const {
    className,
    header,
    content,
    toolbar,
    sidebar
  } = props

  const isMobile = useMediaQuery('(max-width:800px)')

  return (
    <div className={classNames(cls.MainLayout, { [cls.gridMobile]: isMobile }, [className])}>
      <div className={cls.header}>{header}</div>
      <div className={cls.content}>{content}</div>
      <div className={classNames(cls.sidebar, { [cls.sidebarMobile]: isMobile }, [className])}>{sidebar}</div>
      <div className={cls.rightbar}>
        <div className={cls.toolbar}>{toolbar}</div>
      </div>
    </div>
  )
})
