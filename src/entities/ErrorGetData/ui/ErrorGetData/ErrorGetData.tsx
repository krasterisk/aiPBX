import { useTranslation } from 'react-i18next'
import React, { memo, useEffect } from 'react'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { useNavigate } from 'react-router-dom'
import { getRouteLogin } from '@/shared/const/router'

interface ErrorGetDataProps {
  title?: string
  text?: string
  onRefetch?: () => void
}

export const ErrorGetData = memo(({ title, text, onRefetch }: ErrorGetDataProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    if (text === 'TokenExpiredError') {
      navigate(getRouteLogin())
    }
  }, [navigate, text])

  return (
            <HStack
                justify={'center'}
                max
            >
                <Text
                    variant={'error'}
                    title={title || t('Ошибка получения данных!')}
                    text={text || t('Попробуйте обновить страницу')}
                    align={'center'}
                />
            </HStack>
  )
})
