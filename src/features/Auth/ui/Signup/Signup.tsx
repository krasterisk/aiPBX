import { classNames, Mods } from '@/shared/lib/classNames/classNames'
import cls from './Signup.module.scss'
import React, { memo } from 'react'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { LangSwitcher } from '@/entities/LangSwitcher'
import { useMediaQuery } from '@mui/material'
import { SignupForm } from '../SignupForm/SignupForm'

interface SignupFormProps {
  className?: string
}

export const Signup = memo((props: SignupFormProps) => {
  const {
    className
  } = props

  const isMobile = useMediaQuery('(max-width:768px)')

  const mods: Mods = {
    [cls.SignupContainerDesktop]: !isMobile
  }

  return (
        <div className={classNames(cls.SignupContainer, mods, [className])}>
            <HStack gap={'16'} justify={'end'} max>
                {/* <Icon Svg={AiPbxIcon} width={200} height={50} className={cls.logoIcon}/> */}
                <LangSwitcher short={isMobile} className={cls.lang}/>
            </HStack>
            <HStack max gap={'0'} className={cls.formWrapper} justify={'center'}>
                <Card max padding={'48'} border={'partial'} className={cls.signupCard}>
                    <SignupForm />
                </Card>
            </HStack>
        </div>
  )
})
