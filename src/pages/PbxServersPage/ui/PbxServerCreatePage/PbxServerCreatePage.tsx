import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServerCreatePage.module.scss'
import { memo } from 'react'

interface PbxServerCreatePageProps {
  className?: string

}

const PbxServerCreatePage = memo((props: PbxServerCreatePageProps) => {
  const {
    className
  } = props
  return (
        <div className={classNames(cls.PbxServerCreatePage, {}, [className])}>

        </div>
  )
})

export default PbxServerCreatePage
