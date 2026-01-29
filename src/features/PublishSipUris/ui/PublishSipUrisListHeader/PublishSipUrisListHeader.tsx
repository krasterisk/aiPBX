import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisListHeader.module.scss'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePublishSipUrisCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { IconButton, useMediaQuery } from '@mui/material'
import AddBox from '@mui/icons-material/AddBox'
import { Input } from '@/shared/ui/redesigned/Input'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Text } from '@/shared/ui/redesigned/Text'
import SearchIcon from '@/shared/assets/icons/search.svg'
import { usePublishSipUrisFilters } from '../../model/hooks/usePublishSipUrisFilters'

interface PublishSipUrisListHeaderProps {
    className?: string
}

export const PublishSipUrisListHeader = memo((props: PublishSipUrisListHeaderProps) => {
    const { className } = props
    const { t } = useTranslation('publish-sip')
    const isMobile = useMediaQuery('(max-width:800px)')

    const {
        search,
        onSearchChange
    } = usePublishSipUrisFilters()

    return (
        <VStack max>
            <HStack
                className={classNames(cls.PublishSipUrisListHeader, { [cls.mobileHeader]: isMobile }, [className])}
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
                        title={String(t('Создать SIP URI'))}
                        className={cls.CreateButton}
                        to={getRoutePublishSipUrisCreate()}
                    >
                        <IconButton>
                            <AddBox className={cls.icon} fontSize={'large'} />
                            <Text text={t('Создать SIP URI')} />
                        </IconButton>
                    </AppLink>
                </HStack>
            </HStack>
        </VStack>
    )
})
