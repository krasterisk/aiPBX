import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsListHeader.module.scss'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePublishWidgetsCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { IconButton, useMediaQuery } from '@mui/material'
import AddBox from '@mui/icons-material/AddBox'
import { Input } from '@/shared/ui/redesigned/Input'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Text } from '@/shared/ui/redesigned/Text'
import SearchIcon from '@/shared/assets/icons/search.svg'
import { usePublishWidgetsFilters } from '../../model/hooks/usePublishWidgetsFilters'

interface PublishWidgetsListHeaderProps {
    className?: string
}

export const PublishWidgetsListHeader = memo((props: PublishWidgetsListHeaderProps) => {
    const { className } = props
    const {
        search,
        onSearchChange
    } = usePublishWidgetsFilters()

    const { t } = useTranslation('publish-widgets')
    const isMobile = useMediaQuery('(max-width:800px)')

    return (
        <VStack max>
            <HStack
                className={classNames(cls.PublishWidgetsListHeader, { [cls.mobileHeader]: isMobile }, [className])}
                justify={'between'}
                max
            >
                <HStack gap={'8'} justify={'start'}>
                    <Input
                        className={cls.searchInput}
                        placeholder={t('Поиск') ?? ''}
                        size={'s'}
                        onChange={onSearchChange}
                        addonLeft={<Icon Svg={SearchIcon} />}
                        value={search}
                    />
                </HStack>
                <HStack>
                    <AppLink
                        title={String(t('Создать виджет'))}
                        className={cls.CreateButton}
                        to={getRoutePublishWidgetsCreate()}
                    >
                        <IconButton>
                            <AddBox className={cls.icon} fontSize={'large'} />
                            <Text text={t('Создать виджет')} />
                        </IconButton>
                    </AppLink>
                </HStack>
            </HStack>
        </VStack>
    )
})
