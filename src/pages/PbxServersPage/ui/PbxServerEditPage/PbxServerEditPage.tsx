import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServerEditPage.module.scss'
import { memo } from 'react'

interface PbxServerEditPageProps {
  className?: string

}

const PbxServerEditPage = memo((props: PbxServerEditPageProps) => {
  const {
    className
  } = props
  return (
        <div className={classNames(cls.PbxServerEditPage, {}, [className])}>

        </div>
  )
})

export default PbxServerEditPage
