import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantSipAccount.module.scss'
import { memo } from 'react'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
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
                <Text text={t('Выберите сервер')}/>
                <PbxServerSelect/>
                <HStack max justify={'end'}>
                    <Button>
                        {t('Закрыть')}
                    </Button>
                    <Button onClick={onClose}>
                        {t('Создать')}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
  )
})

export default AssistantSipAccount
