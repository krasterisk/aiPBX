import React, { memo, useCallback, useState } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Navbar.module.scss'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { LoginModal } from '@/features/AuthByUsername'
import { useSelector } from 'react-redux'
import { getUserAuthData, UserBalance } from '@/entities/User'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { AvatarDropdown } from '@/features/avatarDropdown'
import { IconButton, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { MenubarItems } from '../../Menubar/ui/MenubarItems/MenubarItems'
import { LangSwitcher } from '@/entities/LangSwitcher'
import { ThemeSwitcher } from '@/entities/ThemeSwitcher'

interface NavbarProps {
  className?: string
}

export const Navbar = memo(({ className }: NavbarProps) => {
  const { t } = useTranslation()
  const authData = useSelector(getUserAuthData)
  const [isAuthModal, setIsAuthModal] = useState(false)
  const isMobile = useMediaQuery('(max-width:800px)')
  const [openDrawer, setOpenDrawer] = React.useState(false)

  const toggleDrawer = (newOpen: boolean) => {
    setOpenDrawer(newOpen)
  }

  const onCloseModal = useCallback(() => {
    setIsAuthModal(false)
  }, [])

  const onShowModal = useCallback(() => {
    setIsAuthModal(true)
  }, [])

  if (authData) {
    return (
            <header className={classNames(cls.Navbar, {}, [className])}>
                <HStack gap="16" justify={'start'}>
                    {isMobile && (
                        <>
                            <IconButton onClick={() => { toggleDrawer(true) }}>
                                <MenuIcon className={cls.menuButton}/>
                            </IconButton>
                            <MenubarItems
                                isMobile={isMobile}
                                openDrawer={openDrawer}
                                onDrawerClose={() => { toggleDrawer(false) }}
                            />
                        </>
                    )}
                    <LangSwitcher short={isMobile} />
                    <ThemeSwitcher />
                </HStack>

                <HStack gap="16" className={cls.actions}>
                    {/* <NotificationButton/> */}
                    <UserBalance />
                    <AvatarDropdown/>
                </HStack>
            </header>
    )
  }
  return (
        <header className={classNames(cls.Navbar, {}, [className])}>
            <Button
                variant={'clear'}
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
