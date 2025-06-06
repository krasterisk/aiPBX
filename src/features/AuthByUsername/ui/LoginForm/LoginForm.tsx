import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './LoginForm.module.scss'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { Input } from '@/shared/ui/redesigned/Input'
import { useSelector } from 'react-redux'
import React, { memo, useCallback, useState } from 'react'
import { loginActions, loginReducer } from '../../model/slice/loginSlice'
import { loginByUsername } from '../../model/services/loginByUsername/loginByUsername'
import { Text } from '@/shared/ui/redesigned/Text'
import { getLoginUsername } from '../../model/selectors/getLoginUsername/getLoginUsername'
import { getLoginPassword } from '../../model/selectors/getLoginPassword/getLoginPassword'
import { getLoginIsLoading } from '../../model/selectors/getLoginIsLoading/getLoginIsLoading'
import { getLoginError } from '../../model/selectors/getLoginError/getLoginError'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { getLoginEmail } from '../../model/selectors/getLoginEmail/getLoginEmail'
import { Loader } from '@/shared/ui/Loader'
import { User, useRegisterUser, useForgotPasswordUser } from '@/entities/User'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { getLoginName } from '../../model/selectors/getLoginName/getLoginName'

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
  const username = useSelector(getLoginUsername)
  const password = useSelector(getLoginPassword)
  const name = useSelector(getLoginName)
  const email = useSelector(getLoginEmail)
  const isLoading = useSelector(getLoginIsLoading)
  const error = useSelector(getLoginError)

  const [isLoginForm, setLoginForm] = useState<boolean>(true)
  const [isRegisterForm, setRegisterForm] = useState<boolean>(false)
  const [registerMessage, setRegisterMessage] = useState<string>('')
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string>('')
  const [isForgotPasswordForm, setForgotPasswordForm] = useState<boolean>(false)
  const [isFormInputError, setFormInputError] = useState<boolean>(false)
  const [isToggleShowPassword, setToggleShowPassword] = useState<boolean>(false)

  const [userRegisterMutation,
    {
      isError: isRegisterError,
      isLoading: isRegisterLoading,
      error: registerError,
      isSuccess: isRegisterSuccess
    }
  ] = useRegisterUser()

  const [userForgotPasswordMutation,
    {
      isError: isForgotPasswordError,
      isLoading: isForgotPasswordLoading,
      error: forgotPasswordError,
      isSuccess: isForgotPasswordSuccess
    }
  ] = useForgotPasswordUser()

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

  const onChangeUsername = useCallback((value: string) => {
    dispatch(loginActions.setUsername(value))
  }, [dispatch])

  const onChangeName = useCallback((value: string) => {
    dispatch(loginActions.setName(value))
  }, [dispatch])

  const onChangeEmail = useCallback((value: string) => {
    dispatch(loginActions.setEmail(value))
  }, [dispatch])

  const onChangePassword = useCallback((value: string) => {
    dispatch(loginActions.setPassword(value))
  }, [dispatch])

  const onLoginClick = useCallback(async () => {
    const login = await dispatch(loginByUsername({ username, password }))
    if (onSuccess && login.payload !== 'error') {
      onSuccess()
    }
  }, [dispatch, onSuccess, password, username])

  const onRegisterClick = useCallback(() => {
    setFormInputError(false)
    if (!username || !email || !password || !name) {
      setFormInputError(true)
      return
    }
    const user: User = {
      id: '',
      name,
      username,
      password,
      email
    }
    userRegisterMutation(user)
      .unwrap()
      .then(() => {
        setRegisterMessage(
          String(t('Для активации аккаунта, проверьте почту и перейдите по ссылке из письма'))
        )
      })
      .catch(() => {
        console.log('error:', registerError)
      })
  }, [email, name, password, registerError, t, userRegisterMutation, username])

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
      isForgotPasswordForm && onRegisterClick()
    }
  }, [isForgotPasswordForm, isLoginForm, isRegisterForm, onLoginClick, onRegisterClick])

  const loginContent = (
        <>
            <Text title={t('Авторизация')}></Text>
            {error && <Text text={t('Неправильные имя пользователя или пароль')} variant={'error'}/>}
            <Input
                type="text"
                className={cls.input}
                placeholder={t('Логин') ?? ''}
                onChange={onChangeUsername}
                value={username}
            />
            <Input
                type={!isToggleShowPassword ? 'password' : 'text'}
                className={cls.input}
                placeholder={t('Пароль') ?? ''}
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
                onClick={() => onLoginClick}
                disabled={isLoading}
            >
                {t('Вход')}
            </Button>
        </>
  )

  const registerContent = (
        <>
            <Text title={t('Регистрация')}></Text>
            {registerMessage && isRegisterSuccess &&
                <Text
                    title={t('Регистрация прошла успешно!')}
                    text={registerMessage} variant={'success'}
                />
            }
            {isRegisterError &&
                <Text
                    title={t('Ошибка при регистрации')}
                    text={
                        isRegisterError &&
                        registerError &&
                        typeof registerError === 'object' &&
                        'data' in registerError
                          ? Array.isArray(registerError.data)
                            ? registerError.data.join(', ')
                            : ''
                          : ''
                    }
                    variant={'error'}
                />
            }
            {!isRegisterSuccess &&
                <>
                    <Input
                        type="text"
                        className={cls.input}
                        placeholder={t('Наименование клиента') ?? ''}
                        onChange={onChangeName}
                        value={name}
                    />
                    <Input
                        type="text"
                        className={cls.input}
                        placeholder={t('Логин') ?? ''}
                        onChange={onChangeUsername}
                        value={username}
                    />
                    <Input
                        type="text"
                        className={cls.input}
                        placeholder={t('Электронная почта') ?? ''}
                        onChange={onChangeEmail}
                        value={email}
                    />
                    <Input
                        type={!isToggleShowPassword ? 'password' : 'text'}
                        className={cls.input}
                        placeholder={t('Пароль') ?? ''}
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
                </>
            }
            {!registerMessage
              ? <HStack max justify={'between'}>
                    <Button
                        addonRight={<ArrowBackIcon/>}
                        onClick={onBackClick}
                        variant={'clear'}
                    />
                    <Button
                        variant={'outline'}
                        className={cls.loginBtn}
                        onClick={onRegisterClick}
                        disabled={isLoading}
                    >
                        {t('Регистрация')}
                    </Button>

                </HStack>
              : <Button
                    variant={'outline'}
                    className={cls.loginBtn}
                    onClick={onCloseClick}
                    disabled={isLoading}
                >
                    {t('Закрыть')}
                </Button>
            }
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
                        disabled={isLoading}
                    >
                        {t('Восстановить')}
                    </Button>
                </HStack>
              : <Button
                    variant={'outline'}
                    className={cls.loginBtn}
                    onClick={onCloseClick}
                    disabled={isLoading}
                >
                    {t('Закрыть')}
                </Button>
            }
        </>
  )

  return (
        <VStack
            className={classNames(cls.LoginForm, {}, [className])} gap={'16'}
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
                        title={t('Ошибка. Пожалуйста, заполните все поля.')}
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
                        isForgotPasswordLoading ||
                        isLoading) &&
                    <Loader className={cls.loginLoader}/>
                }
                {isLoginForm && loginContent}
                {isRegisterForm && registerContent}
                {isForgotPasswordForm && forgotPasswordContent}
            </DynamicModuleLoader>
        </VStack>
  )
})

export default LoginForm
