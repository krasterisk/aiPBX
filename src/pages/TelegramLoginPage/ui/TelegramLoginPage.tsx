import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './TelegramLoginPage.module.scss'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'


interface TelegramLoginPageProps {
    className?: string

}

export const TelegramLoginPage = memo((props: TelegramLoginPageProps) => {
    const {
        className
    } = props
    return (
        <div className={classNames(cls.TelegramLoginPage,{}, [className])}>

        </div>
    )
})
