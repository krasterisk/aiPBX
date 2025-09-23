import { classNames, Mods } from '@/shared/lib/classNames/classNames'
import cls from './Signup.module.scss'
import { useTranslation } from 'react-i18next'
import React, { ChangeEvent, memo, useCallback, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useSelector } from 'react-redux'
import {
  useSignupUser,
  User,
  userActions,
  useGoogleSignupUser,
  useTelegramSignupUser,
  AuthData,
  useActivateUser
} from '@/entities/User'
import { getSignupPassword } from '../../model/selectors/signup/getSignupPassword/getSignupPassword'
import { getSignupEmail } from '../../model/selectors/signup/getSignupEmail/getSignupEmail'
import { signupActions } from '../../model/slice/signupSlice'
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
import { getRouteDashboard, getRouteLogin } from '@/shared/const/router'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@/shared/lib/hooks/useGoogleLogin/useGoogleLogin'
import { useTelegramLogin } from '@/shared/lib/hooks/useTelegramLogin/useTelegramLogin'
import { getActivationCode } from '../../model/selectors/getActivationCode/getActivationCode'

interface SignupFormProps {
  className?: string
}

export const Signup = memo((props: SignupFormProps) => {
  const {
    className
  } = props

  const { t } = useTranslation('login')

  const dispatch = useAppDispatch()
  const password = useSelector(getSignupPassword)
  const email = useSelector(getSignupEmail)
  const activationCode = useSelector(getActivationCode)
  const [isFormError, setFormError] = useState<boolean>(false)
  const [isActivation, setIsActivation] = useState<boolean>(false)
  const [isToggleShowPassword, setToggleShowPassword] = useState<boolean>(false)
  const isMobile = useMediaQuery('(max-width:768px)')
  const navigate = useNavigate()

  const togglePasswordVisibility = useCallback(() => {
    setToggleShowPassword(!isToggleShowPassword)
  }, [isToggleShowPassword])

  const [userSignup, { isLoading: isSignupLoading }] = useSignupUser()
  const [googleSignup, { isLoading: isGoogleLoading }] = useGoogleSignupUser()
  const [telegramSignup, { isLoading: isTelegramLoading }] = useTelegramSignupUser()
  const [activateUser,
    {
      isError: isActivateError,
      isLoading: isActivateLoading,
      error: activationError
    }
  ] = useActivateUser()

  const handleGoogleSuccess = (idToken: string) => {
    googleSignup({ id_token: idToken })
      .unwrap()
      .then((data) => {
        dispatch(userActions.setToken(data))
        navigate(getRouteDashboard())
      })
      .catch(() => {
        setFormError(true)
      })
  }

  const onGoogleSignupClick = useGoogleLogin(handleGoogleSuccess)

  const handleTelegramSuccess = (data: AuthData) => {
    telegramSignup(data)
      .unwrap()
      .then((response) => {
        dispatch(userActions.setToken(response))
        navigate(getRouteDashboard())
      })
      .catch(() => {
        setFormError(true)
      })
  }

  const onTelegramSignupClick = useTelegramLogin(handleTelegramSuccess)

  const onSignupClick = useCallback(() => {
    setFormError(false)
    if (!email || !password) {
      setFormError(true)
      return
    }
    const user: User = {
      id: '',
      password,
      email
    }
    userSignup(user)
      .unwrap()
      .then(() => {
        setFormError(false)
        setIsActivation(true)
        dispatch(signupActions.setActivationCode(''))
      })
      .catch(() => {
        setFormError(true)
      })
  }, [dispatch, email, password, userSignup])

  const onChangeActivationCode = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    dispatch(signupActions.setActivationCode(value))
  }, [dispatch])

  const onActivateClick = useCallback(() => {
    setFormError(false)
    if (!activationCode || !email || !password) {
      setFormError(true)
      return
    }
    activateUser({ email, password, activationCode })
      .unwrap()
      .then((data) => {
        dispatch(userActions.setToken(data))
        navigate(getRouteDashboard())
      })
      .catch((e) => {
        setFormError(true)
      })
  }, [activationCode, email, password, activateUser, dispatch, navigate])

  const onChangeEmail = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const email = event.target.value
    dispatch(signupActions.setEmail(email))
  }, [dispatch])

  const onLogin = useCallback(() => {
    navigate(getRouteLogin())
  }, [navigate])

  const onChangePassword = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const password = event.target.value
    dispatch(signupActions.setPassword(password))
  }, [dispatch])

  const mods: Mods = {
    [cls.SignupContainerDesktop]: !isMobile
  }

  return (
      <div className={classNames(cls.SignupContainer, mods, [className])}>
            <HStack gap={'16'} justify={'end'} max>
                 {/* <Icon Svg={AiPbxIcon} width={200} height={50} className={cls.logoIcon}/> */}
                <LangSwitcher short={isMobile} className={cls.lang}/>
            </HStack>
            <HStack max gap={'0'}>
                <form className={cls.formWrapper}>
                    <Card max padding={'48'} border={'partial'} className={cls.signupCard}>
                        <VStack max gap={'16'}>
                            <VStack gap={'4'} justify={'center'} align={'center'} max>
                                <Text title={t('Регистрация в AI PBX')} />
                                <Text text={t('Голосовые ассистенты для бизнеса')} />
                            </VStack>
                            {isFormError &&
                                <HStack max justify={'center'} align={'center'}>
                                    <Text text={t('Ошибка при создании пользователя')} variant={'error'} />
                                </HStack>
                            }
                            {isActivateError &&
                                <Text
                                    text={t('Ошибка активации, пожалуйста, попробуйте позже') +
                                        String(activationError)}
                                    variant={'error'}
                                />
                            }
                            {(isSignupLoading || isGoogleLoading || isTelegramLoading || isActivateLoading) &&
                                <HStack max justify={'center'}>
                                    <Loader className={cls.signupLoader}/>
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
                                                    className={cls.visibilityIcon}/>)
                                  }
                                }}
                            />
                            {isActivation
                              ? <VStack max>
                                    <Text
                                        text={t('Введите код активации из почты') + ':'}
                                        bold
                                    />
                                    <Textarea
                                        type="text"
                                        className={cls.input}
                                        placeholder={t('Код активации') ?? ''}
                                        onChange={onChangeActivationCode}
                                        value={activationCode}
                                        fullWidth
                                    />
                                    <Button
                                        variant={'filled'}
                                        fullWidth
                                        className={cls.signupBtn}
                                        onClick={() => {
                                          onActivateClick()
                                        }}
                                        disabled={isActivateLoading}
                                    >
                                        {t('Вход')}
                                    </Button>
                                </VStack>
                              : <Button
                                    variant={'filled'}
                                    fullWidth
                                    className={cls.signupBtn}
                                    onClick={() => {
                                      onSignupClick()
                                    }}
                                    disabled={isSignupLoading}
                                >
                                    {t('Регистрация')}
                                </Button>
                            }
                            <Divider>{t('или')}</Divider>
                            <VStack gap={'0'} max>
                                <Button
                                    variant={'filled'}
                                    fullWidth
                                    className={cls.signupBtn}
                                    onClick={onGoogleSignupClick}
                                    disabled={isSignupLoading}
                                    addonLeft={<GoogleIcon/>}
                                >
                                    {t('Продолжить с Google')}
                                </Button>
                                 <Button
                                    variant={'filled'}
                                    fullWidth
                                    className={cls.signupBtn}
                                    onClick={onTelegramSignupClick}
                                    disabled={isSignupLoading}
                                    addonLeft={<TelegramIcon />}
                                 >
                                    {t('Продолжить с Telegram')}
                                 </Button>
                            </VStack>
                            <HStack max justify={'center'}>
                                <Text text={t('Уже есть аккаунт?')}/>
                                <Button
                                    variant={'clear'}
                                    className={cls.linkButton}
                                    onClick={onLogin}
                                >
                                    {t('Вход')}
                                </Button>
                            </HStack>
                        </VStack>
                    </Card>
                </form>
            </HStack>
      </div>
  )
})
