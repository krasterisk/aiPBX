import { classNames, Mods } from '@/shared/lib/classNames/classNames'
import cls from './Signup.module.scss'
import React, { memo } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { LangSwitcher } from '@/entities/LangSwitcher'
import { useMediaQuery } from '@mui/material'
import { SignupForm } from '../SignupForm/SignupForm'
import { AppLogo } from '@/shared/ui/redesigned/AppLogo'
import { Text } from '@/shared/ui/redesigned/Text'

interface SignupFormProps {
  className?: string
}

export const Signup = memo((props: SignupFormProps) => {
  const { className } = props
  const isMobile = useMediaQuery('(max-width:768px)')

  const mods: Mods = {
    [cls.SignupContainerDesktop]: !isMobile
  }

  return (
    <div className={classNames(cls.SignupContainer, mods, [className])}>
      <div className={cls.backgroundDecoration} />

      <header className={cls.header}>
        <HStack gap="16" justify="between" max>
          <LangSwitcher short={isMobile} className={cls.lang} />
        </HStack>
      </header>

      <VStack max justify="center" align="center" className={cls.formWrapper}>
        <Card
          max
          padding="24"
          border="partial"
          className={cls.signupCard}
        >
          <VStack max gap="24" align="center">
            <div className={cls.logoWrapper}>
              <AppLogo className={cls.logo} variant='3' size={isMobile ? 48 : 56} />
            </div>
            <SignupForm />
          </VStack>
        </Card>
      </VStack>

      <footer className={cls.footer}>
        <Text text={`© ${new Date().getFullYear()} AiPBX. All rights reserved.`} size="s" />
      </footer>
    </div>
  )
})
