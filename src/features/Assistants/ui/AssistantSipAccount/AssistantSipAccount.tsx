import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantSipAccount.module.scss'
import { memo } from 'react'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { PbxServerSelect } from '@/entities/PbxServers'

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
  return (

          <Modal isOpen={show} onClose={onClose} lazy className={classNames(cls.AssistantSipAccount, {}, [className])}>
            <VStack gap={'24'} max>
              <HStack gap={'16'} max justify={'center'}>
                    <PbxServerSelect />
              </HStack>
            </VStack>
          </Modal>
  )
})

export default AssistantSipAccount
