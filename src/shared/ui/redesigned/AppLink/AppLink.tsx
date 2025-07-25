import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AppLink.module.scss'
import { forwardRef, memo, ReactNode } from 'react'
import { type LinkProps, NavLink } from 'react-router-dom'

export type AppLinkVariant = 'primary' | 'red'

interface AppLinkProps extends LinkProps {
  className?: string
  variant?: AppLinkVariant
  children?: ReactNode
  activeClassName?: string
}

export const AppLink = memo(forwardRef<HTMLAnchorElement, AppLinkProps>((props: AppLinkProps, ref) => {
  const {
    to,
    className,
    children,
    variant = 'primary',
    activeClassName = '',
    ...otherProps
  } = props

  return (
        <NavLink
            to={to}
            ref={ref}
            className={({ isActive }) =>
              classNames(cls.AppLink, { [activeClassName]: isActive }, [className, cls[variant]])}
            {...otherProps}
        >
            {children}
        </NavLink>
  )
}))
