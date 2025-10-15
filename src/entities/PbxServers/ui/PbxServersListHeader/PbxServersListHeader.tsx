import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServersListHeader.module.scss'
import { memo } from 'react'

interface PbxServersListHeaderProps {
  className?: string

}

export const PbxServersListHeader = memo((props: PbxServersListHeaderProps) => {
  const {
    className
  } = props
  return (
        <div className={classNames(cls.PbxServersListHeader, {}, [className])}>

        </div>
  )
})
