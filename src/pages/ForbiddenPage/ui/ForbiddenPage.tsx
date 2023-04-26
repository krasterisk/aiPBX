import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ForbiddenPage.module.scss'
import { Page } from '@/widgets/Page/Page'

interface ForbiddenPageProps {
    className?: string
}

const ForbiddenPage = memo(({ className }: ForbiddenPageProps) => {
    const { t } = useTranslation()

    return (
        <Page className={classNames(cls.ForbiddenPage, {}, [className])}>
            {t('Нет доступа')}
        </Page>
    )
})

export default ForbiddenPage
