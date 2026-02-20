import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Menubar.module.scss'
import React, { memo } from 'react'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { MenubarItems } from '../MenubarItems/MenubarItems'
import { LangSwitcher } from '@/entities/LangSwitcher'
import { ThemeSwitcher } from '@/entities/ThemeSwitcher'
import AppLogoV3 from '@/shared/assets/icons/aipbx_logo_v3.svg'

interface MenubarProps {
  className?: string
}

export const Menubar = memo((props: MenubarProps) => {
  const {
    className
  } = props

  return (
    <aside
      data-testid="menubar"
      className={classNames(cls.Menubar, {}, [className])}
    >
      <div className={cls.appLogo}>
        <AppLogoV3 className={cls.logoIcon} />
        {/* eslint-disable-next-line i18next/no-literal-string */}
        <span className={cls.brandText}>AI PBX</span>
      </div>

      <VStack
        role="navigation"
        className={cls.items}
        gap="4"
      >
        <MenubarItems />
      </VStack>

      <HStack className={cls.switchers} justify="center" gap="16">
        <LangSwitcher short />
        <ThemeSwitcher />
      </HStack>
    </aside>
  )
})
