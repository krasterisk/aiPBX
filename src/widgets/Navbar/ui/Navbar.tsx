import React, { memo, useCallback, useState } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Navbar.module.scss'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { LoginModal } from '@/features/AuthByUsername'
import { useSelector } from 'react-redux'
import { getUserAuthData } from '@/entities/User'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { NotificationButton } from '@/features/notificationButton'
import { AvatarDropdown } from '@/features/avatarDropdown'

interface NavbarProps {
  className?: string
}

export const Navbar = memo(({ className }: NavbarProps) => {
  const { t } = useTranslation()
  const [isAuthModal, setIsAuthModal] = useState(false)
  const authData = useSelector(getUserAuthData)

  const onCloseModal = useCallback(() => {
    setIsAuthModal(false)
  }, [])

  const onShowModal = useCallback(() => {
    setIsAuthModal(true)
  }, [])

  const mainClass = cls.NavbarRedesigned

  if (authData) {
    return (
          <header className={classNames(mainClass, {}, [className])}>
                              <HStack gap='16' className={cls.actions}>
                                  <NotificationButton />
                                  <AvatarDropdown />
                              </HStack>
                          </header>
    )
  }
  return (
        <header className={classNames(mainClass, {}, [className])}>
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
