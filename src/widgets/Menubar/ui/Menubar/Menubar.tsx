import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Menubar.module.scss'
import React, { memo } from 'react'

import { VStack } from '@/shared/ui/redesigned/Stack'
import { AppLogo } from '@/shared/ui/redesigned/AppLogo'
import { MenubarItems } from '../MenubarItems/MenubarItems'
import { LangSwitcher } from '@/entities/LangSwitcher'
import { ThemeSwitcher } from '@/entities/ThemeSwitcher'
import { HStack } from '@/shared/ui/redesigned/Stack'

interface MenubarProps {
  className?: string
}

export const Menubar = memo((props: MenubarProps) => {
  const {
    className
  } = props

  return (
    <section
      data-testid="menubar"
      className={classNames(cls.Menubar, {}, [className])}
    >
      <AppLogo className={cls.appLogo} />
      <VStack
        role="navigation"
        className={cls.items}
      >
        <MenubarItems />
      </VStack>
      <HStack className={cls.switchers}>
        <LangSwitcher />
        <ThemeSwitcher />
      </HStack>
    </section>
  )
})
