import React, { memo } from 'react'
import cls from './AppLogo.module.scss'
import { HStack } from '../../redesigned/Stack'
import AppSvg from '@/shared/assets/icons/app-image.svg'
import { classNames } from '@/shared/lib/classNames/classNames'

interface AppLogoProps {
  className?: string
}

/**
 * @deprecated
 */

export const AppLogo = memo(({ className }: AppLogoProps) => {
  return (
      <HStack
          max
          justify="center"
          className={classNames(cls.appLogoWrapper, {}, [className])}
      >
        <div className={cls.gradientBig} />
        <div className={cls.gradientSmall} />
        <AppSvg className={cls.appLogo} />
      </HStack>
  )
})
