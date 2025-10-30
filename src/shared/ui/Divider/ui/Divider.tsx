import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Divider.module.scss'
import { memo, ReactNode } from 'react'

interface DividerProps {
  className?: string
  children?: ReactNode
}

export const Divider = memo((props: DividerProps) => {
  const {
    className,
    children
  } = props
  return (
        <div className={classNames(cls.Divider, {}, [className])}>
            {children && <span>{children}</span>}
        </div>
  )
})
