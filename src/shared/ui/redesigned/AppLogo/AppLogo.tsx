import React, { memo } from 'react'
import cls from './AppLogo.module.scss'
import { HStack } from '../Stack'
import AppSvg from '@/shared/assets/icons/aipbx_logo_new.svg'
import { classNames } from '@/shared/lib/classNames/classNames'

interface AppLogoProps {
  className?: string
  size?: number
  width?: number
  height?: number
}

export const AppLogo = memo(({ className, size, width, height }: AppLogoProps) => {
  // Определяем размеры: если указан size, используем его для вычисления пропорций
  // Иначе используем заданные width/height или дефолтные значения
  const logoWidth = size ? size * 2.4 : (width ?? 120)
  const logoHeight = size ? size : (height ?? 50)

  return (
    <HStack
      max
      justify="center"
      className={classNames(cls.appLogoWrapper, {}, [className])}
    >
      <AppSvg
        width={logoWidth}
        height={logoHeight}
        className={cls.appLogo}
      />
      <div className={cls.gradientBig} />
      <div className={cls.gradientSmall} />

    </HStack>
  )
})
