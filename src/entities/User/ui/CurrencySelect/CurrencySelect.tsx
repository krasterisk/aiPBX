import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './CurrencySelect.module.scss'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'


interface CurrencySelectProps {
    className?: string

}

export const CurrencySelect = memo((props: CurrencySelectProps) => {
    const {
        className
    } = props
    return (
        <div className={classNames(cls.CurrencySelect,{}, [className])}>

        </div>
    )
})
