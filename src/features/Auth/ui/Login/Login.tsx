import { classNames, Mods } from '@/shared/lib/classNames/classNames'
import cls from './Login.module.scss'
import { useTranslation } from 'react-i18next'
import React, { ChangeEvent, memo, useCallback, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useSelector } from 'react-redux'
import { useLoginUser, userActions } from '@/entities/User'
import { getLoginPassword } from '../../model/selectors/login/getLoginPassword/getLoginPassword'
import { getLoginEmail } from '../../model/selectors/login/getLoginEmail/getLoginEmail'
import { loginActions } from '../../model/slice/loginSlice'
import { Card } from '@/shared/ui/redesigned/Card'
import { Loader } from '@/shared/ui/Loader'
import { LangSwitcher } from '@/entities/LangSwitcher'
import { useMediaQuery } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import GoogleIcon from '@/shared/assets/icons/googleIcon.svg'
import TelegramIcon from '@mui/icons-material/Telegram'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Divider } from '@/shared/ui/Divider'
import { getRouteSignup } from '@/shared/const/router'
import { useNavigate } from 'react-router-dom'

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
  const isMobile = useMediaQuery('(max-width:768px)')
  const navigate = useNavigate()

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

  const onLoginClick = useCallback(() => {
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

  const onChangeEmail = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const email = event.target.value
    dispatch(loginActions.setEmail(email))
  }, [dispatch])

  const onSignup = useCallback(() => {
    navigate(getRouteSignup())
  }, [navigate])

  const onChangePassword = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const password = event.target.value
    dispatch(loginActions.setPassword(password))
  }, [dispatch])

  const mods: Mods = {
    [cls.LoginContainerDesktop]: !isMobile
  }

  return (
        <div className={classNames(cls.LoginContainer, mods, [className])}>
            <HStack gap={'16'} justify={'end'} max>
                {/* <Icon Svg={AiPbxIcon} width={200} height={50} className={cls.logoIcon}/> */}
                <LangSwitcher short={isMobile} className={cls.lang} />
            </HStack>
            <form className={cls.formWrapper}>
                <Card max padding={'48'} border={'partial'} className={cls.loginCard}>
                    <VStack max gap={'16'}>
                    <VStack gap={'4'} justify={'center'} align={'center'} max>
                        <Text title={t('Вход в облачную AI PBX')} />
                        <Text text={t('Голосовые ассистенты для бизнеса')} />
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
                            <HStack max justify={'center'}>
                            <Loader className={cls.loginLoader}/>
                            </HStack>
                        }
                        <Textarea
                            type={'email'}
                            label={t('Электронная почта') ?? ''}
                            onChange={onChangeEmail}
                            autoComplete={'email'}
                            value={email}
                            fullWidth
                            required
                        />
                        <Textarea
                            type={!isToggleShowPassword ? 'password' : 'text'}
                            label={t('Пароль') ?? ''}
                            autoComplete={'current-password'}
                            onChange={onChangePassword}
                            value={password}
                            required
                            fullWidth
                            slotProps={{
                              input: {
                                endAdornment: (
                                  isToggleShowPassword
                                    ? <VisibilityOffIcon
                                            fontSize={'small'}
                                            onClick={togglePasswordVisibility}
                                            className={cls.visibilityIcon}
                                        />
                                    : <VisibilityIcon
                                            fontSize={'small'}
                                            onClick={togglePasswordVisibility}
                                            className={cls.visibilityIcon} />)
                              }
                            }}
                        />
                        <Button
                            variant={'filled'}
                            fullWidth
                            className={cls.loginBtn}
                            onClick={() => { onLoginClick() }}
                            disabled={isLoginLoading}
                        >
                            {t('Вход')}
                        </Button>
                        <HStack max justify={'center'} gap={'0'}>
                        <Button
                            variant={'clear'}
                            className={cls.linkButton}
                        >
                            {t('Забыли пароль?')}
                        </Button>
                        </HStack>
                        <Divider>{t('или')}</Divider>
                        <VStack gap={'0'} max>
                        <Button
                            variant={'filled'}
                            fullWidth
                            className={cls.loginBtn}
                            onClick={() => { onLoginClick() }}
                            disabled={isLoginLoading}
                            addonLeft={<GoogleIcon />}
                        >
                            {t('Вход через Google')}
                        </Button>
                        <Button
                            variant={'filled'}
                            fullWidth
                            className={cls.loginBtn}
                            onClick={() => { onLoginClick() }}
                            disabled={isLoginLoading}
                            addonLeft={<TelegramIcon />}
                        >
                            {t('Вход через Telegram')}
                        </Button>
                        </VStack>
                        <HStack max justify={'center'}>
                            <Text text={t('Ещё нет аккаунта?')} />
                            <Button
                                variant={'clear'}
                                className={cls.linkButton}
                                onClick={onSignup}
                            >
                                {t('Регистрация')}
                            </Button>
                        </HStack>
                    </VStack>
                </Card>
            </form>
        </div>
  )
})
