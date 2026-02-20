import { useSelector } from 'react-redux'
import { getSignupEmail } from '../../model/selectors/signup/getSignupEmail/getSignupEmail'
import {
  AuthData,
  useGoogleSignupUser,
  useSignupUser,
  userActions,
  useTelegramSignupUser, useActivateUser
} from '@/entities/User'
import { getRouteAssistants, getRouteLogin } from '@/shared/const/router'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useNavigate } from 'react-router-dom'
import { signupActions } from '../../model/slice/signupSlice'
import {
  getSignupActivationCode
} from '../../model/selectors/signup/getSignupActivationCode/getSignupActivationCode'
import { useGoogleLogin } from '@/shared/lib/hooks/useGoogleLogin/useGoogleLogin'
import { useTelegramLogin } from '@/shared/lib/hooks/useTelegramLogin/useTelegramLogin'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'

export function useSignupData () {
  const { t } = useTranslation('login')
  const dispatch = useAppDispatch()
  const email = useSelector(getSignupEmail)
  const activationSignupCode = useSelector(getSignupActivationCode)
  const [signupError, setSignupError] = useState<string | null>(null)
  const [isSignupActivation, setIsSignupActivation] = useState<boolean>(false)
  const navigate = useNavigate()
  const [userSignup, { isLoading: isSignupLoading }] = useSignupUser()
  const [googleSignup, { isLoading: isGoogleLoading }] = useGoogleSignupUser()
  const [resendTimer, setResendTimer] = useState<number>(0)
  const [telegramSignup, { isLoading: isTelegramLoading }] = useTelegramSignupUser()
  const [signupActivateUser,
    {
      isError: isSignupActivateError,
      isLoading: isSignupActivateLoading,
      error: signupActivationError
    }
  ] = useActivateUser()

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev: number) => (prev > 0 ? prev - 1 : 0))
      }, 1000)

      return () => { clearInterval(timer) }
    }
  }, [resendTimer, setResendTimer])

  const handleGoogleSignupSuccess = (idToken: string) => {
    setSignupError(null)
    googleSignup({ id_token: idToken })
      .unwrap()
      .then((data) => {
        localStorage.setItem('onboarding_is_signup', 'true')
        dispatch(userActions.setToken(data))
        navigate(getRouteAssistants())
      })
      .catch((e) => {
        setSignupError(t(getErrorMessage(e)))
      })
  }

  const onGoogleSignupClick = useGoogleLogin(handleGoogleSignupSuccess)

  const handleTelegramSignupSuccess = (data: AuthData) => {
    setSignupError(null)
    telegramSignup(data)
      .unwrap()
      .then((response) => {
        localStorage.setItem('onboarding_is_signup', 'true')
        dispatch(userActions.setToken(response))
        navigate(getRouteAssistants())
      })
      .catch((e) => {
        setSignupError(t(getErrorMessage(e)))
      })
  }

  const onTelegramSignupClick = useTelegramLogin(handleTelegramSignupSuccess)

  const onSignupClick = useCallback(() => {
    setSignupError(null)
    if (!email) {
      setSignupError(t('Введите email'))
      return
    }

    userSignup({ email })
      .unwrap()
      .then(() => {
        setSignupError(null)
        setIsSignupActivation(true)
        dispatch(signupActions.setActivationCode(''))
        setResendTimer(60)
      })
      .catch((e) => {
        setSignupError(t(getErrorMessage(e)))
      })
  }, [dispatch, email, userSignup])

  const onChangeActivationCode = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    dispatch(signupActions.setActivationCode(value))
  }, [dispatch])

  const onSignupActivateClick = useCallback(() => {
    setSignupError(null)
    if (!activationSignupCode || !email) {
      setSignupError(t('Заполните все поля'))
      return
    }
    signupActivateUser({ email, activationCode: activationSignupCode, type: 'signup' })
      .unwrap()
      .then((data) => {
        localStorage.setItem('onboarding_is_signup', 'true')
        dispatch(userActions.setToken(data))
        navigate(getRouteAssistants())
      })
      .catch((e) => {
        setSignupError(getErrorMessage(e))
      })
  }, [activationSignupCode, email, signupActivateUser, dispatch, navigate])

  const onChangeEmail = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const email = event.target.value
    dispatch(signupActions.setEmail(email))
  }, [dispatch])

  const onLogin = useCallback(() => {
    navigate(getRouteLogin())
  }, [navigate])

  return {
    email,
    activationSignupCode,
    signupActivationError,
    resendTimer,
    signupError,
    isGoogleLoading,
    isSignupLoading,
    isTelegramLoading,
    isSignupActivateError,
    isSignupActivateLoading,
    isSignupActivation,
    onChangeEmail,
    onTelegramSignupClick,
    onSignupClick,
    onGoogleSignupClick,
    onLogin,
    onSignupActivateClick,
    onChangeActivationCode
  }
}
