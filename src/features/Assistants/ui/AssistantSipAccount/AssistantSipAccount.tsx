import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantSipAccount.module.scss'
import { memo } from 'react'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { Divider } from '@/shared/ui/Divider'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { PbxServerSelect } from '@/entities/PbxServers'
import { useTranslation } from 'react-i18next'

export interface AssistantSipAccountProps {
  className?: string
  show: boolean
  onClose: () => void

}

const AssistantSipAccount = memo((props: AssistantSipAccountProps) => {
  const {
    className,
    show,
    onClose
  } = props
  const { t } = useTranslation('assistants')

  return (

        <Modal isOpen={show} onClose={onClose} lazy className={classNames(cls.AssistantSipAccount, {}, [className])}>
            <VStack gap={'24'} max>
                <VStack gap={'8'}>
                    <Text title={t('Публикация агента через SIP-транк')}/>
                    <Divider />
                </VStack>
                <PbxServerSelect label={t('Выберите сервер') || ''}/>
                <HStack max justify={'end'} gap={'16'}>
                    <Button onClick={onClose} color={'error'}>
                        {t('Закрыть')}
                    </Button>
                    <Button onClick={onClose} color={'success'}>
                        {t('Создать')}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
  )
})

export default AssistantSipAccount
