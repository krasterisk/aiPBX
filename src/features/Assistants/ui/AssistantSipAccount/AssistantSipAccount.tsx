import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantSipAccount.module.scss'
import { memo, useCallback, useState } from 'react'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { PbxServerSelect, useCreateSipUri, PbxServerOptions } from '@/entities/PbxServers'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/redesigned/Input'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'

export interface AssistantSipAccountProps {
  className?: string
  show: boolean
  onClose: () => void
  assistantId?: string
}

const AssistantSipAccount = memo((props: AssistantSipAccountProps) => {
  const {
    className,
    show,
    onClose,
    assistantId
  } = props
  const { t } = useTranslation('assistants')
  const [createSip, { isLoading }] = useCreateSipUri()

  const [selectedPbx, setSelectedPbx] = useState<PbxServerOptions | null>(null)
  const [ipAddress, setIpAddress] = useState<string>('')
  const [sipUri, setSipUri] = useState<string>('')

  const handleCreate = useCallback(async () => {
    if (assistantId && selectedPbx?.id && ipAddress) {
      try {
        const result = await createSip({
          assistantId,
          serverId: selectedPbx.id,
          ipAddress
        }).unwrap()

        if (result.success && result.sipUri) {
          setSipUri(result.sipUri)
        }
      } catch (e) {
        toast.error(getErrorMessage(e))
      }
    }
  }, [assistantId, createSip, ipAddress, selectedPbx])

  return (
    <Modal isOpen={show} onClose={onClose} lazy className={classNames(cls.AssistantSipAccount, {}, [className])}>
      <VStack gap={'24'} max>
        <Text title={t('SIP URI') || ''} />

        {sipUri && (
          <VStack gap={'8'} max>
            <Text text={t('Ваш SIP URI:') || ''} bold />
            <Text text={sipUri} variant={'accent'} size={'l'} />
          </VStack>
        )}

        <VStack gap={'16'} max>
          <PbxServerSelect
            label={t('Выберите сервер') || ''}
            value={selectedPbx}
            onChangePbxServer={(_, val) => setSelectedPbx(val)}
          />
          <Input
            label={t('Ваш IP Адрес') || ''}
            value={ipAddress}
            onChange={setIpAddress}
          />
        </VStack>

        <HStack max justify={'end'} gap={'16'}>
          <Button onClick={onClose} color={'error'} variant={'outline'}>
            {t('Закрыть')}
          </Button>
          <Button
            onClick={handleCreate}
            color={'success'}
            disabled={!selectedPbx || !ipAddress || isLoading}
          >
            {isLoading ? String(t('Создание...')) : (sipUri ? String(t('Обновить')) : String(t('Создать')))}
          </Button>
        </HStack>
      </VStack>
    </Modal>
  )
})

export default AssistantSipAccount
