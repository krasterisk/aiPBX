import { memo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { userActions, useTelegramLoginUser } from '@/entities/User'
import { getRouteDashboard, getRouteForbidden, getRouteLogin } from '@/shared/const/router'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Loader } from '@/shared/ui/Loader'

interface TelegramLoginProps {
  className?: string

}

export const TelegramLogin = memo((props: TelegramLoginProps) => {
  const {
    className
  } = props
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [telegramLogin, { isLoading }] = useTelegramLoginUser()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const telegramData: Record<string, string> = {}

    params.forEach((value, key) => {
      telegramData[key] = value
    })

    console.log(telegramData)
    // Отправляем query-параметры на свой NestJS
    telegramLogin(telegramData)
      .unwrap()
      .then((res) => {
        if (res.token) {
          dispatch(userActions.setToken(res.token))
          navigate(getRouteDashboard())
        } else {
          navigate(getRouteLogin())
        }
      })
      .catch(() => {
        navigate(getRouteForbidden())
      })
  }, [navigate, telegramLogin, dispatch])

  return (
      <VStack max justify={'center'} align={'center'}>
        {isLoading &&
            <Loader/>
        }
      </VStack>
  )
})
