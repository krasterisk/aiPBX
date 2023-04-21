import React, { memo, useCallback, useState } from 'react'
import { classNames } from 'shared/lib/classNames/classNames'
import cls from './Navbar.module.scss'
import { useTranslation } from 'react-i18next'
import { Button, ButtonTheme } from 'shared/ui/Button/Button'
import { Text, TextTheme } from 'shared/ui/Text/Text'
import { LoginModal } from 'features/AuthByUsername'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAuthData, isUserAdmin, isUserVPBXAdmin, userActions } from 'entities/User'
import { AppLink, AppLinkTheme } from 'shared/ui/AppLink/AppLink'
import { RoutePath } from 'shared/config/routeConfig/routeConfig'
import { Dropdown } from 'shared/ui/Dropdown/Dropdown'
import { Avatar } from 'shared/ui/Avatar/Avatar'
import { getTokenAllData } from 'shared/api/getTokenData/getTokenData'
import { HStack } from 'shared/ui/Stack'

interface NavbarProps {
    className?: string
}

export const Navbar = memo(({ className }: NavbarProps) => {
    const { t } = useTranslation()
    const [isAuthModal, setIsAuthModal] = useState(false)
    const authData = useSelector(getUserAuthData)
    const dispatch = useDispatch()
    const userData = getTokenAllData(authData?.token)
    const isVPBXAdmin = useSelector(isUserVPBXAdmin)
    const isAdmin = useSelector(isUserAdmin)

    const onCloseModal = useCallback(() => {
        setIsAuthModal(false)
    }, [])

    const onShowModal = useCallback(() => {
        setIsAuthModal(true)
    }, [])

    const onLogout = useCallback(() => {
        dispatch(userActions.logout())
    }, [dispatch])

    const isAdminAvailable = isAdmin || isVPBXAdmin

    if (authData) {
        return (
            <header className={classNames(cls.Navbar, {}, [className])}>
                <Text
                    className={cls.appName}
                    title={t('Krasterisk')}
                    theme={TextTheme.INVERTED}
                />
                <AppLink
                    to={RoutePath.manuals_create}
                    theme={AppLinkTheme.SECONDARY}
                    className={cls.createBtn}
                >
                    {t('Создать статью')}
                </AppLink>
                <HStack gap='16'>
                    <Dropdown
                        direction={'bottom-left'}
                        className={cls.dropdown}
                        items={[
                            ...(isAdminAvailable
                                ? [{
                                    content: t('Админ'),
                                    href: RoutePath.admin
                                }]
                                : []),
                            {
                                content: t('Профиль'),
                                href: RoutePath.profile + String(userData?.id)
                            },
                            {
                                content: t('Выйти'),
                                onClick: onLogout
                            }
                        ]}
                        trigger={<Avatar size={30} src={userData?.avatar}/>}
                    />
                </HStack>
            </header>
        )
    }
    return (
        <header className={classNames(cls.Navbar, {}, [className])}>
            <Button
                theme={ButtonTheme.CLEAR_INVERTED}
                className={cls.links}
                onClick={onShowModal}
            >
                {t('Вход')}
            </Button>
            {isAuthModal && (
                <LoginModal
                    isOpen={isAuthModal}
                    onClose={onCloseModal}
                />
            )}
        </header>
    )
})
