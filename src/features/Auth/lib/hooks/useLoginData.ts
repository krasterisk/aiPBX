import { useSelector } from 'react-redux'
import { getLoginEmail } from '../../model/selectors/login/getLoginEmail/getLoginEmail'
import {
  AuthData, useActivateUser,
  useGoogleLoginUser,
  useLoginUser,
  userActions,
  useTelegramLoginUser
} from '@/entities/User'
import { getRouteAssistants, getRouteSignup } from '@/shared/const/router'
import { useGoogleLogin } from '@/shared/lib/hooks/useGoogleLogin/useGoogleLogin'
import { useTelegramLogin } from '@/shared/lib/hooks/useTelegramLogin/useTelegramLogin'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useNavigate } from 'react-router-dom'
import { loginActions } from '../../model/slice/loginSlice'
import {
  getLoginActivationCode
} from '../../model/selectors/login/getLoginActivationCode/getLoginActivationCode'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { buildLegalAcceptanceItems } from '@/shared/lib/legal/versions'
import { normalizeEmail } from '@/shared/lib/functions/normalizeEmail'
import { isLoginConsentRequired } from '../getAuthLegalConsentLinks'

export function useLoginData () {
  const { t } = useTranslation('login')
  const email = useSelector(getLoginEmail)
  const activationLoginCode = useSelector(getLoginActivationCode)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoginActivation, setIsLoginActivation] = useState<boolean>(false)
  const [resendTimer, setResendTimer] = useState<number>(0)

  const [userLogin, { isLoading: isLoginLoading }] = useLoginUser()
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginUser()
  const [telegramLogin, { isLoading: isTelegramLoading }] = useTelegramLoginUser()
  const [loginActivateUser,
    {
      isError: isLoginActivateError,
      isLoading: isLoginActivateLoading,
      error: loginActivationError
    }
  ] = useActivateUser()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const legalAcceptance = isLoginConsentRequired() ? buildLegalAcceptanceItems() : undefined

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev: number) => (prev > 0 ? prev - 1 : 0))
      }, 1000)

      return () => { clearInterval(timer) }
    }
  }, [resendTimer, setResendTimer])

  const onChangeActivationCode = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    dispatch(loginActions.setActivationCode(value))
  }, [dispatch])

  const onLoginActivateClick = useCallback(() => {
    setLoginError(null)
    if (!activationLoginCode || !email) {
      setLoginError(t('Заполните все поля'))
      return
    }
    loginActivateUser({
      email: normalizeEmail(email),
      activationCode: activationLoginCode,
      type: 'login',
      legalAcceptance,
    })
      .unwrap()
      .then((data) => {
        dispatch(userActions.setToken(data))
        navigate(getRouteAssistants())
      })
      .catch((e) => {
        setLoginError(t(getErrorMessage(e)))
      })
  }, [activationLoginCode, email, loginActivateUser, dispatch, navigate])

  const onSignup = useCallback(() => {
    navigate(getRouteSignup())
  }, [navigate])

  const handleGoogleSuccess = (idToken: string) => {
    setLoginError(null)
    googleLogin({ id_token: idToken, legalAcceptance })
      .unwrap()
      .then((data) => {
        if (data.token && data.user) {
          dispatch(userActions.setToken(data))
          navigate(getRouteAssistants())
        }
      })
      .catch((e) => {
        setLoginError(t(getErrorMessage(e)))
      })
  }

  const onGoogleLoginClick = useGoogleLogin(handleGoogleSuccess)

  const handleTelegramSuccess = (data: AuthData) => {
    setLoginError(null)
    telegramLogin({ ...data, legalAcceptance })
      .unwrap()
      .then((response) => {
        dispatch(userActions.setToken(response))
        navigate(getRouteAssistants())
      })
      .catch((e) => {
        setLoginError(t(getErrorMessage(e)))
      })
  }

  const onTelegramLoginClick = useTelegramLogin(handleTelegramSuccess)

  const onLoginClick = useCallback(() => {
    setLoginError(null)
    if (!email) {
      setLoginError(t('Введите email'))
      return
    }
    userLogin({ email: normalizeEmail(email), legalAcceptance })
      .unwrap()
      .then(() => {
        setIsLoginActivation(true)
        setResendTimer(60)
      })
      .catch((e) => {
        setIsLoginActivation(false)
        setLoginError(t(getErrorMessage(e)))
      })
  }, [email, userLogin])

  const onChangeEmail = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const email = event.target.value
    dispatch(loginActions.setEmail(email))
  }, [dispatch])

  return {
    email,
    activationLoginCode,
    loginActivationError,
    resendTimer,
    loginError,
    isLoginActivation,
    isLoginActivateError,
    isLoginActivateLoading,
    isGoogleLoading,
    isLoginLoading,
    isTelegramLoading,
    onChangeActivationCode,
    onLoginActivateClick,
    onChangeEmail,
    onTelegramLoginClick,
    onLoginClick,
    onGoogleLoginClick,
    onSignup
  }
}
