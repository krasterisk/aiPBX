import React, { memo } from 'react'
import cls from './AppLogo.module.scss'
import { HStack } from '../Stack'
import AppSvgV1 from '@/shared/assets/icons/aipbx_logo_v1.svg'
import AppSvgV3 from '@/shared/assets/icons/aipbx_logo_v3.svg'
import { classNames } from '@/shared/lib/classNames/classNames'

interface AppLogoProps {
  className?: string
  size?: number
  width?: number
  height?: number
  variant?: '1' | '3' // Variant 1: full logo, Variant 3: icon only
}

export const AppLogo = memo(({ className, size, width, height, variant = '1' }: AppLogoProps) => {
  // Определяем размеры: если указан size, используем его для вычисления пропорций
  // Иначе используем заданные width/height или дефолтные значения

  // Variant 3 (icon only) has 1:1 aspect ratio
  const isIconOnly = variant === '3'
  const logoWidth = size ? (isIconOnly ? size : size * 2.4) : (width ?? (isIconOnly ? 50 : 100))
  const logoHeight = size || (height ?? 50)

  // Choose SVG based on variant
  const AppSvg = variant === '3' ? AppSvgV3 : AppSvgV1

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
