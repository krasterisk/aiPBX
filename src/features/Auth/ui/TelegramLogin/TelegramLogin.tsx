import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './TelegramLogin.module.scss'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'


interface TelegramLoginProps {
    className?: string

}

export const TelegramLogin = memo((props: TelegramLoginProps) => {
    const {
        className
    } = props
    return (
        <div className={classNames(cls.TelegramLogin,{}, [className])}>

        </div>
    )
})
