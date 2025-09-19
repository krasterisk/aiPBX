import { memo, useEffect } from 'react'
import { userActions, useTelegramSignupUser } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useNavigate } from 'react-router-dom'
import { getRouteDashboard, getRouteForbidden, getRouteSignup } from '@/shared/const/router'
import { Loader } from '@/shared/ui/Loader'
import { VStack } from '@/shared/ui/redesigned/Stack'

interface TelegramProps {
  className?: string
}

export const TelegramSignup = memo((props: TelegramProps) => {
  const {
    className
  } = props

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [telegramSignup, { isLoading }] = useTelegramSignupUser()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const telegramData: Record<string, string> = {}

    params.forEach((value, key) => {
      telegramData[key] = value
    })

    console.log(telegramData)
    // Отправляем query-параметры на свой NestJS
    telegramSignup(telegramData)
      .unwrap()
      .then((res) => {
        if (res.token) {
          dispatch(userActions.setToken(res.token))
          navigate(getRouteDashboard())
        } else {
          navigate(getRouteSignup())
        }
      })
      .catch(() => {
        navigate(getRouteForbidden())
      })
  }, [navigate, telegramSignup, dispatch])

  return (
        <VStack max justify={'center'} align={'center'}>
            {isLoading &&
                <Loader/>
            }
        </VStack>
  )
})
