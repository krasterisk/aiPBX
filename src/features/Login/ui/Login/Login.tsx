import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Login.module.scss'
import { useTranslation } from 'react-i18next'
import React, { memo, useCallback, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Input } from '@/shared/ui/redesigned/Input'
import { Button } from '@/shared/ui/redesigned/Button'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useSelector } from 'react-redux'
import { useLoginUser, userActions } from '@/entities/User'
import { getLoginPassword } from '../../../AuthByUsername/model/selectors/getLoginPassword/getLoginPassword'
import { getLoginEmail } from '../../../AuthByUsername/model/selectors/getLoginEmail/getLoginEmail'
import { loginActions } from '../../../AuthByUsername/model/slice/loginSlice'
import AiPbxIcon from '@/shared/assets/icons/ai-pbx-icon.svg'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Card } from '@/shared/ui/redesigned/Card'
import { Loader } from '@/shared/ui/Loader'
import { LangSwitcher } from '@/entities/LangSwitcher'
import { useMediaQuery } from '@mui/material'

interface LoginFormProps {
  className?: string
}

export const Login = memo((props: LoginFormProps) => {
  const {
    className
  } = props

  const { t } = useTranslation('login')

  const dispatch = useAppDispatch()
  const password = useSelector(getLoginPassword)
  const email = useSelector(getLoginEmail)
  const [isFormError, setFormError] = useState<boolean>(false)
  const [isToggleShowPassword, setToggleShowPassword] = useState<boolean>(false)
  const isMobile = useMediaQuery('(max-width:800px)')

  const togglePasswordVisibility = useCallback(() => {
    setToggleShowPassword(!isToggleShowPassword)
  }, [isToggleShowPassword])

  const [userLoginMutation,
    {
      isError: isLoginError,
      isLoading: isLoginLoading,
      error: loginError,
      isSuccess: isLoginSuccess
    }
  ] = useLoginUser()

  const onLoginClick = useCallback(async () => {
    if (!email || !password) {
      setFormError(true)
      return
    }
    userLoginMutation({ email, password })
      .unwrap()
      .then((data) => {
        const token = data.token
        if (token) {
          dispatch(userActions.setToken(token))
        }
      })
      .catch(() => {
        setFormError(true)
      })
  }, [dispatch, email, password, userLoginMutation])

  const onChangeEmail = useCallback((value: string) => {
    dispatch(loginActions.setEmail(value))
  }, [dispatch])

  const onChangePassword = useCallback((value: string) => {
    dispatch(loginActions.setPassword(value))
  }, [dispatch])

  return (
        <div className={classNames(cls.LoginContainer, {}, [className])}>
            <HStack gap={'24'} justify={'between'} max>
                <Icon Svg={AiPbxIcon} width={200} height={50} className={cls.logoIcon}/>
                <LangSwitcher short={isMobile} className={cls.lang} />
            </HStack>
            <form className={cls.formWrapper}>
                <Card max padding={'48'} border={'partial'} className={cls.loginCard}>
                    <VStack max gap={'24'}>
                    <VStack gap={'4'} align={'center'}>
                        <Text title={t('Вход в облачную AI PBX')} align={'center'}/>
                        <Text text={t('Голосовые ассистенты для бизнеса')} align={'center'}/>
                    </VStack>
                        {
                            loginError &&
                            isLoginError &&
                            <Text text={t('Неправильные имя пользователя или пароль')} variant={'error'}/>
                        }
                        {isLoginSuccess &&
                            <Text text={t('Авторизация прошла успешно')}/>
                        }
                        {isLoginLoading &&
                            <Loader className={cls.loginLoader}/>
                        }
                        <Input
                            type="text"
                            className={cls.input}
                            placeholder={t('Электронная почта') ?? ''}
                            onChange={onChangeEmail}
                            autoComplete={'username'}
                            value={email}
                        />
                        <Input
                            type={!isToggleShowPassword ? 'password' : 'text'}
                            className={cls.input}
                            placeholder={t('Пароль') ?? ''}
                            autoComplete={'current-password'}
                            onChange={onChangePassword}
                            value={password}
                            addonRight={password
                              ? <Button variant={'clear'}>
                                    {!isToggleShowPassword
                                      ? <VisibilityIcon
                                            fontSize={'small'}
                                            onClick={togglePasswordVisibility}
                                            className={cls.visibilityIcon}
                                        />
                                      : <VisibilityOffIcon
                                            fontSize={'small'}
                                            onClick={togglePasswordVisibility}
                                            className={cls.visibilityIcon}
                                        />
                                    }
                                </Button>
                              : ''}
                        />
                        <Button
                            variant={'clear'}
                            className={cls.linkButton}
                        >
                            {t('Забыли пароль?')}
                        </Button>
                        <Button
                            variant={'clear'}
                            className={cls.linkButton}
                        >
                            {t('Регистрация')}
                        </Button>
                        <Button
                            variant={'outline'}
                            className={cls.loginBtn}
                            onClick={onLoginClick}
                            disabled={isLoginLoading}
                        >
                            {t('Вход')}
                        </Button>
                    </VStack>
                </Card>
            </form>
        </div>
  )
})
