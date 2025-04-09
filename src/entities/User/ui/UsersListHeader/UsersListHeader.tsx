import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UsersListHeader.module.scss'
import React, { memo } from 'react'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteUserCreate } from '@/shared/const/router'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { IconButton, useMediaQuery } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { ContentViewSelector } from '../../../Content'
import { useUserFilters } from '../../lib/hooks/useUserFilters'
import { UsersFilters } from '../UsersFilters/UsersFilters'
import { useTranslation } from 'react-i18next'

interface UsersListHeaderProps {
  className?: string
}

export const UsersListHeader = memo((props: UsersListHeaderProps) => {
  const {
    className
  } = props

  const {
    search,
    view,
    sort,
    onChangeView,
    onChangeSearch,
    onChangeSort
  } = useUserFilters()

  const { t } = useTranslation('profile')

  const isMobile = useMediaQuery('(max-width:800px)')

  return (
        <HStack
            className={classNames(cls.UsersListHeader, { [cls.mobileHeader]: isMobile }, [className])}
            justify={'start'}
            gap={'8'}
        >
            <ContentViewSelector view={view} onViewClick={onChangeView}/>
            <UsersFilters
                search={search}
                sort={sort}
                onChangeSort={onChangeSort}
                onChangeSearch={onChangeSearch}
            />
            <AppLink
                title={String(t('Добавить клиента'))}
                to={getRouteUserCreate()}
            >
                <IconButton>
                    <PersonAddIcon className={cls.icon} fontSize={'large'}/>
                </IconButton>
            </AppLink>

        </HStack>
  )
})
