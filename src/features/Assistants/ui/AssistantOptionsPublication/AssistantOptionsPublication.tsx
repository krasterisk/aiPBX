import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantOptionsPublication.module.scss'
import { memo, useCallback, useState, useMemo } from 'react'
import { Button } from '@/shared/ui/redesigned/Button'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import AssistantSipAccount from '../AssistantSipAccount/AssistantSipAccount'
import { Table } from '@/shared/ui/redesigned/Table'
import { useDeleteSipUri } from '@/entities/PbxServers'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { Loader } from '@/shared/ui/Loader'
import { useSelector } from 'react-redux'
import { getAssistantFormData, assistantFormActions } from '@/entities/Assistants'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

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
  const dispatch = useAppDispatch()
  const formFields = useSelector(getAssistantFormData)
  const sipAccount = formFields?.sipAccount

  const [isSipModalOpen, setIsSipModalOpen] = useState<boolean>(false)
  const [deleteSip, { isLoading: isDeleting }] = useDeleteSipUri()

  const handleSipSuccess = useCallback((sipUri: string, ipAddress: string, serverId: string) => {
    dispatch(assistantFormActions.updateForm({
      sipAccount: {
        id: serverId, // Simplified, as we only have one
        sipUri,
        ipAddress,
        pbxId: serverId
      }
    }))
    toast.success(t('SIP URI обновлен') || 'SIP URI updated')
  }, [dispatch, t])

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.info(t('Скопировано в буфер обмена') || 'Copied to clipboard')
      })
      .catch((err) => {
        toast.error(getErrorMessage(err))
      })
  }, [t])

  const handleDelete = useCallback(async () => {
    if (!assistantId) return
    if (!window.confirm(t('Вы уверены, что хотите удалить SIP URI?')
      || 'Are you sure you want to delete SIP URI?')) return

    try {
      const result = await deleteSip({ assistantId }).unwrap()
      if (result.success) {
        dispatch(assistantFormActions.updateForm({ sipAccount: undefined }))
        toast.success(t('SIP URI удален') || 'SIP URI deleted')
      }
    } catch (e) {
      toast.error(getErrorMessage(e))
    }
  }, [assistantId, deleteSip, dispatch, t])

  const columns = useMemo(() => [
    {
      header: t('SIP URI'),
      accessorKey: 'sipUri',
      cell: (info: any) => (
        <HStack gap={'8'} align={'center'}>
          <code>{info.getValue()}</code>
          <Button variant={'clear'} onClick={() => handleCopy(info.getValue())}>
            <ContentCopyIcon fontSize={'small'} />
          </Button>
        </HStack>
      )
    },
    {
      header: t('IP Адрес'),
      accessorKey: 'ipAddress',
      cell: (info: any) => info.getValue()
    },
    {
      header: '',
      id: 'actions',
      cell: () => (
        <HStack gap={'8'}>
          <Button variant={'clear'} onClick={() => setIsSipModalOpen(true)}>
            <EditIcon fontSize={'small'} />
          </Button>
          <Button variant={'clear'} onClick={handleDelete} color={'error'}>
            <DeleteIcon fontSize={'small'} />
          </Button>
        </HStack>
      )
    }
  ], [handleDelete, t])

  const tableData = useMemo(() => {
    return sipAccount ? [sipAccount] : []
  }, [sipAccount])

  return (
    <VStack
      className={classNames(cls.AssistantPublication, {}, [className])}
      gap={'24'}
      max
    >
      {sipAccount && (
        <VStack gap={'8'} max>
          <HStack gap={'8'} align={'center'}>
            {isDeleting && <Loader />}
          </HStack>
          <Table
            data={tableData}
            columns={columns}
          />
        </VStack>
      )}

      <AssistantSipAccount
        show={isSipModalOpen}
        onClose={() => setIsSipModalOpen(false)}
        onSuccess={handleSipSuccess}
        assistantId={assistantId}
        initialPbxId={sipAccount?.pbxId}
        initialIpAddress={sipAccount?.ipAddress}
        initialSipUri={sipAccount?.sipUri}
      />
      <HStack gap={'16'} wrap={'wrap'}>
        {!sipAccount &&
          <Button onClick={() => setIsSipModalOpen(true)}>
            {t('Создать SIP URI')}
          </Button>
        }
        <Button>{t('Создать WebRTC скрипт для сайта')}</Button>
      </HStack>
    </VStack>
  )
})
