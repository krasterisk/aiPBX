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
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useNavigate } from 'react-router-dom'
import { signupActions } from '../../model/slice/signupSlice'
import {
  getSignupActivationCode
} from '../../model/selectors/signup/getSignupActivationCode/getSignupActivationCode'
import { useGoogleLogin } from '@/shared/lib/hooks/useGoogleLogin/useGoogleLogin'
import { useTelegramLogin } from '@/shared/lib/hooks/useTelegramLogin/useTelegramLogin'

export function useSignupData() {
  const dispatch = useAppDispatch()
  const email = useSelector(getSignupEmail)
  const activationSignupCode = useSelector(getSignupActivationCode)
  const [isSignupError, setSignupError] = useState<boolean>(false)
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
    googleSignup({ id_token: idToken })
      .unwrap()
      .then((data) => {
        dispatch(userActions.setToken(data))
        navigate(getRouteAssistants())
      })
      .catch(() => {
        setSignupError(true)
      })
  }

  const onGoogleSignupClick = useGoogleLogin(handleGoogleSignupSuccess)

  const handleTelegramSignupSuccess = (data: AuthData) => {
    telegramSignup(data)
      .unwrap()
      .then((response) => {
        dispatch(userActions.setToken(response))
        navigate(getRouteAssistants())
      })
      .catch(() => {
        setSignupError(true)
      })
  }

  const onTelegramSignupClick = useTelegramLogin(handleTelegramSignupSuccess)

  const onSignupClick = useCallback(() => {
    setSignupError(false)
    if (!email) {
      setSignupError(true)
      return
    }

    userSignup({ email })
      .unwrap()
      .then(() => {
        setSignupError(false)
        setIsSignupActivation(true)
        dispatch(signupActions.setActivationCode(''))
        setResendTimer(60)
      })
      .catch(() => {
        setSignupError(true)
      })
  }, [dispatch, email, userSignup])

  const onChangeActivationCode = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    dispatch(signupActions.setActivationCode(value))
  }, [dispatch])

  const onSignupActivateClick = useCallback(() => {
    setSignupError(false)
    if (!activationSignupCode || !email) {
      setSignupError(true)
      return
    }
    signupActivateUser({ email, activationCode: activationSignupCode, type: 'signup' })
      .unwrap()
      .then((data) => {
        dispatch(userActions.setToken(data))
        navigate(getRouteAssistants())
      })
      .catch((e) => {
        setSignupError(true)
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
    isSignupError,
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
