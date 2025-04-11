import React, { memo } from 'react'
import cls from './AppLogo.module.scss'
import { HStack } from '../Stack'
import AppSvg from '@/shared/assets/icons/aipbx_logo.svg'
import { classNames } from '@/shared/lib/classNames/classNames'

interface AppLogoProps {
  className?: string
  size?: number
  width?: number
  height?: number
}

export const AppLogo = memo(({ className, width = 120, height = 50 }: AppLogoProps) => {
  return (
      <HStack
          max
          justify="center"
          className={classNames(cls.appLogoWrapper, {}, [className])}
      >
          <AppSvg
              width={width}
              height={height}
              // fill={'orange'}
              // color="black"
              className={cls.appLogo}
          />
          <div className={cls.gradientBig} />
          <div className={cls.gradientSmall} />

      </HStack>
  )
})
