import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantSipAccount.module.scss'
import { memo, useCallback, useState, useEffect, ChangeEvent } from 'react'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { PbxServerSelect, useCreateSipUri, PbxServerOptions } from '@/entities/PbxServers'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/redesigned/Input'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { Loader } from '@/shared/ui/Loader'
import { Textarea } from '@/shared/ui/mui/Textarea'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

export interface AssistantSipAccountProps {
  className?: string
  show: boolean
  onClose: () => void
  onSuccess?: (sipUri: string, ipAddress: string, serverId: string) => void
  assistantId?: string
  initialPbxId?: string
  initialIpAddress?: string
  initialSipUri?: string
}

const AssistantSipAccount = memo((props: AssistantSipAccountProps) => {
  const {
    className,
    show,
    onClose,
    onSuccess,
    assistantId,
    initialPbxId,
    initialIpAddress,
    initialSipUri
  } = props
  const { t } = useTranslation('assistants')
  const [createSip, { isLoading }] = useCreateSipUri()

  const [selectedPbx, setSelectedPbx] = useState<PbxServerOptions | null>(null)
  const [ipAddress, setIpAddress] = useState<string>('')
  const [sipUri, setSipUri] = useState<string>('')

  const handleIpAddressChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setIpAddress(event.target.value)
  }, [])

  useEffect(() => {
    if (show) {
      if (initialPbxId) {
        setSelectedPbx({ id: initialPbxId, name: '' }) // Name will be handled by PbxServerSelect if it fetches data
      }
      if (initialIpAddress) {
        setIpAddress(initialIpAddress)
      }
    } else {
      // Clear on close
      if (!initialPbxId) setSelectedPbx(null)
      if (!initialIpAddress) setIpAddress('')
      setSipUri('')
    }
  }, [show, initialPbxId, initialIpAddress])

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.info(t('Скопировано в буфер обмена') || 'Copied to clipboard')
      })
      .catch((err) => {
        toast.error(getErrorMessage(err))
      })
  }, [t])

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
          onSuccess?.(result.sipUri, ipAddress, selectedPbx.id)
          onClose()
        }
      } catch (e) {
        // Error toast handled by global toastMiddleware
      }
    }
  }, [assistantId, createSip, ipAddress, selectedPbx, onClose, onSuccess])

  return (
    <Modal isOpen={show} onClose={onClose} lazy className={className}>
      <VStack gap={'24'} max className={cls.AssistantSipAccount}>
        <Text title={t('SIP URI') || ''} />

        {sipUri && (
          <VStack gap={'8'} max>
            <Text text={t('Ваш SIP URI:') || ''} bold />
            <HStack gap={'8'} align={'center'} max wrap={'wrap'}>
              <Text text={sipUri} variant={'accent'} size={'l'} className={cls.sipUri} />
              <Button onClick={() => handleCopy(sipUri)} variant={'clear'}>
                <ContentCopyIcon fontSize={'small'} />
              </Button>
            </HStack>
          </VStack>
        )}

        <VStack gap={'24'} max>
          {initialPbxId ? (
            <VStack gap={'8'} max>
              <HStack gap={'8'} align={'center'} max wrap={'wrap'}>
                <Text text={initialSipUri || ''} bold className={cls.sipUri} />
                <Button onClick={() => handleCopy(initialSipUri || '')} variant={'clear'}>
                  <ContentCopyIcon fontSize={'small'} />
                </Button>
              </HStack>
            </VStack>
          ) : (
            <PbxServerSelect
              label={t('Выберите сервер') || ''}
              value={selectedPbx}
              onChangePbxServer={(_, val) => setSelectedPbx(val)}
            />
          )}
          <Textarea
            label={t('Ваш IP Адрес') || ''}
            value={ipAddress}
            onChange={handleIpAddressChange}
          />
        </VStack>

        {isLoading && (
          <div className={cls.loaderWrapper}>
            <Loader />
          </div>
        )}

        <HStack max justify={'end'} gap={'16'} wrap={'wrap'}>
          <Button
            onClick={onClose}
            color={'error'}
            variant={'clear'}
          >
            {t('Закрыть')}
          </Button>
          <Button
            onClick={handleCreate}
            color={'success'}
            variant={'filled'}
            disabled={!selectedPbx || !ipAddress || isLoading}
          >
            {initialPbxId ? t('Сохранить') : t('Создать')}
          </Button>
        </HStack>
      </VStack>
    </Modal>
  )
})

export default AssistantSipAccount
