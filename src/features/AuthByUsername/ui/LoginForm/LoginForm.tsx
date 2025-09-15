import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './LoginForm.module.scss'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { Input } from '@/shared/ui/redesigned/Input'
import { useSelector } from 'react-redux'
import React, { memo, useCallback, useState } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { getLoginPassword } from '../../model/selectors/getLoginPassword/getLoginPassword'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { getLoginEmail } from '../../model/selectors/getLoginEmail/getLoginEmail'
import { Loader } from '@/shared/ui/Loader'
import { User, useRegisterUser, useForgotPasswordUser, useActivateUser, useLoginUser, userActions } from '@/entities/User'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { getActivationCode } from '../../model/selectors/getActivationCode/getActivationCode'
import { getErrorMessage } from '../../helpers/getErrorMessage'
import { loginActions, loginReducer } from '../../model/slice/loginSlice'

export interface LoginFormProps {
  className?: string
  onSuccess: () => void
}

const initialReducers: ReducersList = {
  loginForm: loginReducer
}

const LoginForm = memo(({ className, onSuccess }: LoginFormProps) => {
  const { t } = useTranslation('login')
  const dispatch = useAppDispatch()
  const password = useSelector(getLoginPassword)
  const email = useSelector(getLoginEmail)
  const activationCode = useSelector(getActivationCode)

  const [isLoginForm, setLoginForm] = useState<boolean>(true)
  const [isRegisterForm, setRegisterForm] = useState<boolean>(false)
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string>('')
  const [isForgotPasswordForm, setForgotPasswordForm] = useState<boolean>(false)
  const [isFormInputError, setFormInputError] = useState<boolean>(false)
  const [isToggleShowPassword, setToggleShowPassword] = useState<boolean>(false)
  const [isActivateForm, setActivateForm] = useState<boolean>(false)

  const [userRegisterMutation,
    {
      isError: isRegisterError,
      isLoading: isRegisterLoading,
      error: registerError,
      isSuccess: isRegisterSuccess
    }
  ] = useRegisterUser()

  const [userActivateMutation,
    {
      isError: isActivateError,
      isLoading: isActivateLoading,
      error: activateError,
      isSuccess: isActivateSuccess
    }
  ] = useActivateUser()

  const [userForgotPasswordMutation,
    {
      isError: isForgotPasswordError,
      isLoading: isForgotPasswordLoading,
      error: forgotPasswordError,
      isSuccess: isForgotPasswordSuccess
    }
  ] = useForgotPasswordUser()

  const [userLoginMutation,
    {
      isError: isLoginError,
      isLoading: isLoginLoading,
      error: loginError,
      isSuccess: isLoginSuccess
    }
  ] = useLoginUser()

  const togglePasswordVisibility = useCallback(() => {
    setToggleShowPassword(!isToggleShowPassword)
  }, [isToggleShowPassword])

  const onForgotPassword = useCallback(() => {
    setLoginForm(false)
    setRegisterForm(false)
    setForgotPasswordForm(true)
  }, [])

  const onRegister = useCallback(() => {
    setLoginForm(false)
    setForgotPasswordForm(false)
    setRegisterForm(true)
  }, [])

  const onCloseClick = useCallback(() => {
    onSuccess()
  }, [onSuccess])

  const onBackClick = useCallback(() => {
    setLoginForm(true)
    setForgotPasswordForm(false)
    setRegisterForm(false)
  }, [])

  const onActivateClick = useCallback(() => {
    if (!activationCode) {
      setFormInputError(true)
      return
    }
    userActivateMutation(activationCode)
      .unwrap()
      .then(() => {
        setActivateForm(false)
        setFormInputError(false)
        setLoginForm(true)
      })
  }, [activationCode, userActivateMutation])

  const onRegisterClick = useCallback(() => {
    setFormInputError(false)
    if (!email || !password) {
      setFormInputError(true)
      return
    }
    const user: User = {
      id: '',
      password,
      email
    }
    userRegisterMutation(user)
      .unwrap()
      .then(() => {
        setRegisterForm(false)
        setActivateForm(true)
      })
      .catch(() => {
        console.log('error:', registerError)
      })
  }, [email, password, registerError, userRegisterMutation])

  const onChangeEmail = useCallback((value: string) => {
    dispatch(loginActions.setEmail(value))
  }, [dispatch])

  const onChangePassword = useCallback((value: string) => {
    dispatch(loginActions.setPassword(value))
  }, [dispatch])

  const onChangeActivationCode = useCallback((value: string) => {
    dispatch(loginActions.setActivationCode(value))
  }, [dispatch])

  const onLoginClick = useCallback(async () => {
    setFormInputError(false)
    if (!email || !password) {
      setFormInputError(true)
      return
    }
    userLoginMutation({ email, password })
      .unwrap()
      .then((data) => {
        const token = data.token
        if (token) {
          dispatch(userActions.setToken(token))
          onSuccess()
        }
      })
      .catch(() => {
        setFormInputError(true)
      })
    // const login = await dispatch(loginByUsername({ email, password }))
    // if (onSuccess && login.payload !== 'error') {
    //   onSuccess()
    // }
  }, [dispatch, email, onSuccess, password, userLoginMutation])

  const onForgotPasswordClick = useCallback(() => {
    setFormInputError(false)
    if (!email) {
      setFormInputError(true)
      return
    }

    const user: User = {
      id: '',
      username: '',
      name: '',
      email
    }

    userForgotPasswordMutation(user)
      .unwrap()
      .then(() => {
        setForgotPasswordMessage(
          String(t('Для восстановления пароля, проверьте почту и перейдите по ссылке из письма'))
        )
      })
      .catch(() => {
      })
  }, [email, t, userForgotPasswordMutation])

  const handleKeypress = useCallback((e: string) => {
    if (e === 'Enter') {
      isLoginForm && onLoginClick()
      isRegisterForm && onRegisterClick()
      isForgotPasswordForm && onForgotPasswordClick()
      isActivateForm && onActivateClick()
    }
  }, [
    isActivateForm,
    isForgotPasswordForm,
    isLoginForm,
    isRegisterForm,
    onActivateClick,
    onForgotPasswordClick,
    onLoginClick,
    onRegisterClick
  ])

  const loginContent = (
        <>
            <Text title={t('Авторизация')}></Text>
            {
                loginError &&
                isLoginError &&
                isFormInputError &&
                <Text text={t('Неправильные имя пользователя или пароль')} variant={'error'}/>
            }
            {isActivateSuccess &&
                <Text text={t('Вы успешно зарегистрированы')}/>
            }
            {isLoginSuccess &&
                <Text text={t('Авторизация прошла успешно')}/>
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
                                className={cls.icon}
                            />
                          : <VisibilityOffIcon
                                fontSize={'small'}
                                onClick={togglePasswordVisibility}
                                className={cls.icon}
                            />
                        }
                    </Button>
                  : ''}
            />
            <VStack>
                <Button
                    variant={'clear'}
                    onClick={onForgotPassword}
                >
                    {t('Забыли пароль?')}
                </Button>
                <Button
                    variant={'clear'}
                    onClick={onRegister}
                >
                    {t('Регистрация')}
                </Button>
            </VStack>
            <Button
                variant={'outline'}
                className={cls.loginBtn}
                onClick={() => {
                  onLoginClick()
                }}
                disabled={isLoginLoading}
            >
                {t('Вход')}
            </Button>
        </>
  )

  const activationContent = (
        <>
            <Text title={t('Активация')}
                  text={t('Мы отправили на указанную вами почту код активации,введите его ниже')}
            />
            <Input
                type="text"
                className={cls.input}
                placeholder={t('Код активации') ?? ''}
                onChange={onChangeActivationCode}
                value={activationCode}
            />
            <Button
                variant={'outline'}
                className={cls.loginBtn}
                onClick={onActivateClick}
                disabled={isLoginLoading}
            >
                {t('Завершить')}
            </Button>
        </>
  )

  const registerContent = (
        <>
            <Text title={t('Регистрация')}></Text>
            {isRegisterError && registerError && (
                <Text
                    text={getErrorMessage(registerError)}
                    variant="error"
                />
            )}
            <Input
                type="text"
                className={cls.input}
                placeholder={t('Электронная почта') ?? ''}
                autoComplete={'username'}
                onChange={onChangeEmail}
                value={email}
            />
            <Input
                type={!isToggleShowPassword ? 'password' : 'text'}
                className={cls.input}
                placeholder={t('Пароль') ?? ''}
                onChange={onChangePassword}
                value={password}
                autoComplete={'new-password'}
                addonRight={password
                  ? <Button variant={'clear'}>
                        {!isToggleShowPassword
                          ? <VisibilityIcon
                                fontSize={'small'}
                                onClick={togglePasswordVisibility}
                                className={cls.icon}
                            />
                          : <VisibilityOffIcon
                                fontSize={'small'}
                                onClick={togglePasswordVisibility}
                                className={cls.icon}
                            />
                        }
                    </Button>
                  : ''}
            />
            <HStack max justify={'between'}>
                <Button
                    addonRight={<ArrowBackIcon/>}
                    onClick={onBackClick}
                    variant={'clear'}
                />
                <Button
                    variant={'outline'}
                    className={cls.loginBtn}
                    onClick={onRegisterClick}
                    disabled={isLoginLoading}
                >
                    {t('Продолжить')}
                </Button>
            </HStack>
        </>
  )

  const forgotPasswordContent = (
        <>
            <Text title={t('Восстановить пароль')}></Text>
            {forgotPasswordMessage && <Text text={forgotPasswordMessage} variant={'accent'}/>}
            {isForgotPasswordError &&
                <Text
                    title={t('Email не найден')}
                    text={
                        isForgotPasswordError &&
                        forgotPasswordError &&
                        typeof forgotPasswordError === 'object' &&
                        'data' in forgotPasswordError
                          ? Array.isArray(forgotPasswordError.data)
                            ? forgotPasswordError.data.join(', ')
                            : ''
                          : ''
                    }
                    variant={'error'}
                />
            }
            {!isForgotPasswordSuccess &&
                <>
                    <Input
                        type="text"
                        className={cls.input}
                        placeholder={t('Электронная почта') ?? ''}
                        autoComplete={'username'}
                        onChange={onChangeEmail}
                        value={email}
                    />
                </>
            }
            {!forgotPasswordMessage
              ? <HStack max justify={'between'}>
                    <Button
                        addonRight={<ArrowBackIcon/>}
                        onClick={onBackClick}
                        variant={'clear'}
                    />
                    <Button
                        variant={'outline'}
                        className={cls.loginBtn}
                        onClick={onForgotPasswordClick}
                        disabled={isLoginLoading}
                    >
                        {t('Восстановить')}
                    </Button>
                </HStack>
              : <Button
                    variant={'outline'}
                    className={cls.loginBtn}
                    onClick={onCloseClick}
                    disabled={isLoginLoading}
                >
                    {t('Закрыть')}
                </Button>
            }
        </>
  )

  return (
        <form className={classNames(cls.LoginForm, {}, [className])}>
            <VStack
                gap={'16'}
                onKeyDown={(e) => {
                  handleKeypress(e.key)
                }}
            >
                <DynamicModuleLoader
                    removeAfterUnmount
                    reducers={initialReducers}
                >
                    {isFormInputError &&
                        <Text
                            title={t('Ошибка!')}
                            text={
                                registerError &&
                                !isRegisterError &&
                                typeof registerError === 'object' &&
                                'data' in registerError
                                  ? Array.isArray(registerError.data)
                                    ? registerError.data.join('\n')
                                    : ''
                                  : ''
                            }
                            variant={'error'}
                        />
                    }
                    {
                        (isRegisterLoading ||
                            isActivateLoading ||
                            isForgotPasswordLoading ||
                            isLoginLoading) &&
                        <Loader className={cls.loginLoader}/>
                    }
                    {isLoginForm && loginContent}
                    {isRegisterForm && registerContent}
                    {isActivateForm && activationContent}
                    {isForgotPasswordForm && forgotPasswordContent}
                </DynamicModuleLoader>
            </VStack>
        </form>
  )
})

export default LoginForm
