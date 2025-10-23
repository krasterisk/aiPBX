import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantOptionsPublication.module.scss'
import { memo, useState } from 'react'
import { Button } from '@/shared/ui/redesigned/Button'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { AssistantSipAccountAsync } from '../AssistantSipAccount/AssistantSipAccount.async'

interface AssistantPublicationProps {
  className?: string
  isEdit: boolean
}

export const AssistantOptionsPublication = memo((props: AssistantPublicationProps) => {
  const {
    className,
    isEdit
  } = props

  const { t } = useTranslation('assistants')
  const [isCreateSipAccountOpen, setIsCreateSipAccountOpen] = useState<boolean>(false)

  return (
        <VStack
            className={classNames(cls.AssistantPublication, {}, [className])}
            gap={'16'}
        >
            <AssistantSipAccountAsync
                show={isCreateSipAccountOpen}
                onClose={() => {
                  setIsCreateSipAccountOpen(false)
                }}
            />
          {/* eslint-disable-next-line react/jsx-no-undef */}
            <Button>{t('Создать SIP аккаунт')}</Button>
            <Button>{t('Создать WebRTC скрипт для сайта')}</Button>
            <Button>{t('Создать переадресацию с внешнего номера')}</Button>
        </VStack>
  )
})
