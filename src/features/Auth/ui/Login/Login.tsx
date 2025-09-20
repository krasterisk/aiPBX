import { classNames, Mods } from '@/shared/lib/classNames/classNames'
import cls from './Login.module.scss'
import { useTranslation } from 'react-i18next'
import React, { ChangeEvent, memo, useCallback, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useSelector } from 'react-redux'
import { getUserAuthData, useGoogleLoginUser, useLoginUser, userActions, useTelegramLoginUser } from '@/entities/User'
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
import { getRouteDashboard, getRouteSignup } from '@/shared/const/router'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@/shared/lib/hooks/useGoogleLogin/useGoogleLogin'
import { useTelegramLogin } from '@/shared/lib/hooks/useTelegramLogin/useTelegramLogin'

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
  const authData = useSelector(getUserAuthData)

  const togglePasswordVisibility = useCallback(() => {
    setToggleShowPassword(!isToggleShowPassword)
  }, [isToggleShowPassword])

  const [userLogin, { isLoading: isLoginLoading }] = useLoginUser()
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginUser()
  const [telegramLogin, { isLoading: isTelegramLoading }] = useTelegramLoginUser()

  const handleGoogleSuccess = (idToken: string) => {
    googleLogin({ id_token: idToken })
      .unwrap()
      .then((data) => {
        if (data.token) {
          dispatch(userActions.setToken(data.token))
        }
      })
      .catch((e) => {
        setFormError(true)
      })
  }

  const onGoogleLoginClick = useGoogleLogin(handleGoogleSuccess)

  const handleTelegramSuccess = useCallback((data: any) => {
    telegramLogin(data)
      .unwrap()
      .then((response) => {
        if (response.token) {
          dispatch(userActions.setToken(response.token))
          console.log(authData)
          // navigate(getRouteDashboard())
        }
      })
      .catch(() => {
        setFormError(true)
      })
  }, [telegramLogin, dispatch, authData])

  const onTelegramLoginClick = useTelegramLogin(handleTelegramSuccess)

  const onLoginClick = useCallback(() => {
    if (!email || !password) {
      setFormError(true)
      return
    }
    userLogin({ email, password })
      .unwrap()
      .then((data) => {
        const token = data.token
        if (token) {
          dispatch(userActions.setToken(token))
        }
        navigate(getRouteDashboard())
      })
      .catch(() => {
        setFormError(true)
      })
  }, [dispatch, email, navigate, password, userLogin])

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
            <HStack max gap={'0'}>
            <form className={cls.formWrapper}>
                <Card max padding={'48'} border={'partial'} className={cls.loginCard}>
                    <VStack max gap={'16'}>
                    <VStack gap={'4'} justify={'center'} align={'center'} max>
                        <Text title={t('Вход в облачную AI PBX')} />
                        <Text text={t('Голосовые ассистенты для бизнеса')} />
                    </VStack>
                        {
                            isFormError &&
                            <HStack max justify={'center'} align={'center'}>
                            <Text text={t('Неправильные имя пользователя или пароль')} variant={'error'} />
                            </HStack>
                        }
                        {(isLoginLoading || isGoogleLoading || isTelegramLoading) &&
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
                            onClick={onGoogleLoginClick}
                            disabled={isLoginLoading}
                            addonLeft={<GoogleIcon />}
                        >
                            {t('Вход через Google')}
                        </Button>
                        <Button
                            variant={'filled'}
                            fullWidth
                            className={cls.loginBtn}
                            onClick={onTelegramLoginClick}
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
            </HStack>
        </div>
  )
})
