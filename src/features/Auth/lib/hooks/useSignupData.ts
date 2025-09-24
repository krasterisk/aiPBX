import { useSelector } from 'react-redux'
import { getSignupEmail } from '../../model/selectors/signup/getSignupEmail/getSignupEmail'
import {
  AuthData,
  useGoogleSignupUser,
  useSignupUser,
  userActions,
  useTelegramSignupUser, useActivateUser
} from '@/entities/User'
import { getRouteDashboard, getRouteLogin } from '@/shared/const/router'
import { ChangeEvent, useCallback, useState } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useNavigate } from 'react-router-dom'
import { signupActions } from '../../model/slice/signupSlice'
import {
  getSignupActivationCode
} from '../../model/selectors/signup/getSignupActivationCode/getSignupActivationCode'
import { useGoogleLogin } from '@/shared/lib/hooks/useGoogleLogin/useGoogleLogin'
import { useTelegramLogin } from '@/shared/lib/hooks/useTelegramLogin/useTelegramLogin'

export function useSignupData () {
  const dispatch = useAppDispatch()
  const email = useSelector(getSignupEmail)
  const activationSignupCode = useSelector(getSignupActivationCode)
  const [isSignupError, setSignupError] = useState<boolean>(false)
  const [isSignupActivation, setIsSignupActivation] = useState<boolean>(false)
  const navigate = useNavigate()
  const [userSignup, { isLoading: isSignupLoading }] = useSignupUser()
  const [googleSignup, { isLoading: isGoogleLoading }] = useGoogleSignupUser()
  const [telegramSignup, { isLoading: isTelegramLoading }] = useTelegramSignupUser()
  const [signupActivateUser,
    {
      isError: isSignupActivateError,
      isLoading: isSignupActivateLoading,
      error: signupActivationError
    }
  ] = useActivateUser()

  const handleGoogleSignupSuccess = (idToken: string) => {
    googleSignup({ id_token: idToken })
      .unwrap()
      .then((data) => {
        dispatch(userActions.setToken(data))
        navigate(getRouteDashboard())
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
        navigate(getRouteDashboard())
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
    signupActivateUser({ email, activationCode: activationSignupCode })
      .unwrap()
      .then((data) => {
        dispatch(userActions.setToken(data))
        navigate(getRouteDashboard())
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
