import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantOptionsPublication.module.scss'
import { memo, useState } from 'react'
import { Button } from '@/shared/ui/redesigned/Button'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import AssistantSipAccount from '../AssistantSipAccount/AssistantSipAccount'

interface AssistantPublicationProps {
  className?: string
  isEdit: boolean
  assistantId?: string
}

export const AssistantOptionsPublication = memo((props: AssistantPublicationProps) => {
  const {
    className,
    isEdit,
    assistantId
  } = props

  const { t } = useTranslation('assistants')
  const [isCreateSipAccountOpen, setIsCreateSipAccountOpen] = useState<boolean>(false)

  return (
    <VStack
      className={classNames(cls.AssistantPublication, {}, [className])}
      gap={'16'}
      max
    >
      <AssistantSipAccount
        show={isCreateSipAccountOpen}
        onClose={() => {
          setIsCreateSipAccountOpen(false)
        }}
        assistantId={assistantId}
      />
      <Button onClick={() => { setIsCreateSipAccountOpen(true) }}>
        {t('Создать SIP аккаунт')}
      </Button>
      <Button>{t('Создать WebRTC скрипт для сайта')}</Button>
      <Button>{t('Создать переадресацию с внешнего номера')}</Button>
    </VStack>
  )
})
