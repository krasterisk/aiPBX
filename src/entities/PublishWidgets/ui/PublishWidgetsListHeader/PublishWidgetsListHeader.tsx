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
import { Button } from '@/shared/ui/redesigned/Button'
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
        <VStack max className={classNames(cls.PublishWidgetsListHeader, { [cls.mobileHeader]: isMobile }, [className])}>
            <HStack
                justify={'between'}
                max
                gap={'16'}
                wrap={isMobile ? 'wrap' : 'nowrap'}
            >
                <HStack gap={'8'} justify={'start'} max={isMobile}>
                    <Input
                        className={cls.searchInput}
                        placeholder={t('Поиск') ?? ''}
                        size={'s'}
                        onChange={onSearchChange}
                        addonLeft={<Icon Svg={SearchIcon} width={20} height={20} />}
                        value={search}
                    />
                </HStack>
                <HStack max={isMobile} justify={isMobile ? 'center' : 'end'}>
                    <AppLink
                        to={getRoutePublishWidgetsCreate()}
                    >
                        <Button
                            variant={'clear'}
                            addonLeft={<Icon Svg={AddBox} width={20} height={20} />}
                        >
                            {t('Создать виджет')}
                        </Button>
                    </AppLink>
                </HStack>
            </HStack>
        </VStack>
    )
})
