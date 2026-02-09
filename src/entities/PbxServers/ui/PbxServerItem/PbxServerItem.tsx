import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServerItem.module.scss'
import React, { HTMLAttributeAnchorTarget, memo, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { PbxServer } from '../../model/types/pbxServers'
import { getRoutePbxServerEdit } from '@/shared/const/router'
import { ContentView } from '../../../Content'
import { useNavigate } from 'react-router-dom'
import { usePbxServerStatus } from '../../api/pbxServersApi'
import { Server, Globe, Activity, Info, User as UserIcon } from 'lucide-react'
import { Button } from '@/shared/ui/redesigned/Button'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { toast } from 'react-toastify'
import { AsteriskInstructionsModal } from '../AsteriskInstructionsModal/AsteriskInstructionsModal'
import { isUserAdmin } from '@/entities/User'

interface PbxServerItemProps {
  className?: string
  pbxServer: PbxServer
  onEdit?: (id: string) => void
  target?: HTMLAttributeAnchorTarget
  view?: ContentView
}

export const PbxServerItem = memo((props: PbxServerItemProps) => {
  const {
    className,
    pbxServer,
    view = 'BIG',
  } = props

  const { t } = useTranslation('pbx')
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false)
  const isAdmin = useSelector(isUserAdmin)

  const clientDisplayName = pbxServer.user?.name || pbxServer.user?.email || ''

  const { data: statusData, isLoading: isStatusLoading } = usePbxServerStatus(pbxServer.uniqueId!, {
    skip: !pbxServer.uniqueId,
    pollingInterval: 60000,
  })

  const navigate = useNavigate()

  const onCopyValue = useCallback((value: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(value)
    toast.success(t('Скопировано в буфер обмена'))
  }, [t])

  const onOpenEdit = useCallback(() => {
    navigate(getRoutePbxServerEdit(pbxServer.id || ''))
  }, [navigate, pbxServer.id])

  const onOpenInstructions = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsInstructionsModalOpen(true)
  }, [])

  const onCloseInstructions = useCallback(() => {
    setIsInstructionsModalOpen(false)
  }, [])

  return (
    <Card
      padding={'0'}
      max
      border={'partial'}
      variant={'outlined'}
      className={classNames(cls.PbxServerItem, {}, [className, cls[view]])}
      onClick={onOpenEdit}
    >
      <VStack className={cls.content} max gap="12">
        <HStack max justify="end" align="center">
          <HStack gap="8">
            {pbxServer.cloudPbx && (
              <HStack gap="4" align="center" className={cls.chip}>
                <div className={classNames(cls.dot, {}, [cls.cloud])} />
                <Text text={t('CLOUD')} size="xs" bold />
              </HStack>
            )}
            {pbxServer.ari_url && (
              <Text text="ARI" size="xs" bold variant="accent" className={cls.chip} />
            )}
            {pbxServer.wss_url && (
              <Text text="WebRTC" size="xs" bold variant="accent" className={cls.chip} />
            )}
          </HStack>
        </HStack>

        <HStack gap={'16'} max align="center">
          <VStack justify="center" align="center" className={cls.avatar}>
            <Server size={24} />
          </VStack>
          <VStack max gap="4">
            <Text title={pbxServer.name} size={'m'} bold className={cls.title} />
            <HStack gap="8" align="center">
              <div
                className={classNames(cls.statusDot, {
                  [cls.online]: statusData?.online,
                  [cls.offline]: statusData && !statusData.online,
                  [cls.loading]: isStatusLoading
                })}
              />
              <Text
                text={isStatusLoading ? t('Загрузка...') : (statusData?.online ? t('В сети') : t('Не в сети'))}
                size="xs"
                className={classNames(cls.statusText, { [cls.inactive]: statusData && !statusData.online })}
              />
            </HStack>
          </VStack>
        </HStack>

        <div className={cls.divider} />

        <VStack gap="16" max className={cls.detailsStack}>
          {isAdmin && clientDisplayName && (
            <HStack gap="12" align="start">
              <VStack align="center" justify="center" className={cls.detailIcon}>
                <UserIcon size={14} />
              </VStack>
              <VStack max>
                <Text text={t('Клиент')} variant="accent" size="s" />
                <Text text={clientDisplayName} className={cls.urlText} />
              </VStack>
            </HStack>
          )}

          <HStack gap="12" align="start">
            <VStack align="center" justify="center" className={cls.detailIcon}>
              <Globe size={14} />
            </VStack>
            <VStack max>
              <Text text={t('Адрес')} variant="accent" size="xs" />
              <HStack gap="8" max align="start">
                <Text text={pbxServer.sip_host} className={cls.urlText} />
                <Button variant="clear" onClick={onCopyValue(pbxServer.sip_host || '')} className={cls.smallCopyBtn}>
                  <ContentCopyIcon sx={{ fontSize: 14 }} />
                </Button>
              </HStack>
            </VStack>
          </HStack>

          {pbxServer.ari_url && (
            <HStack gap="12" align="start">
              <VStack align="center" justify="center" className={cls.detailIcon}>
                <Activity size={14} />
              </VStack>
              <VStack max>
                <Text text={t('ARI URL')} variant="accent" size="xs" />
                <HStack gap="8" max align="start">
                  <Text text={pbxServer.ari_url} className={cls.urlText} />
                  <Button variant="clear" onClick={onCopyValue(pbxServer.ari_url)} className={cls.smallCopyBtn}>
                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                  </Button>
                </HStack>
              </VStack>
            </HStack>
          )}

          {pbxServer.wss_url && (
            <HStack gap="12" align="start">
              <VStack align="center" justify="center" className={cls.detailIcon}>
                <Globe size={14} />
              </VStack>
              <VStack max>
                <Text text={t('WSS URL')} variant="accent" size="xs" />
                <HStack gap="8" max align="start">
                  <Text text={pbxServer.wss_url} className={cls.urlText} />
                  <Button variant="clear" onClick={onCopyValue(pbxServer.wss_url)} className={cls.smallCopyBtn}>
                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                  </Button>
                </HStack>
              </VStack>
            </HStack>
          )}

          {pbxServer.context && (
            <HStack gap="12" align="start">
              <VStack align="center" justify="center" className={cls.detailIcon}>
                <Activity size={14} />
              </VStack>
              <VStack max>
                <Text text={t('Контекст')} variant="accent" size="xs" />
                <Text text={pbxServer.context} className={cls.urlText} />
              </VStack>
            </HStack>
          )}
        </VStack>
        {pbxServer.comment && (
          <HStack gap="8" className={cls.commentWrapper} align="start">
            <VStack align="center" justify="center" className={cls.commentIcon}>
              <Info size={12} />
            </VStack>
            <Text text={pbxServer.comment} size="xs" className={cls.comment} bold />
          </HStack>
        )}

        <Button variant="clear" onClick={onOpenInstructions} className={cls.instructionsBtn}>
          <HStack gap="4" align="center">
            <Info size={14} />
            <Text text={t('Инструкции')} size="s" bold variant="accent" />
          </HStack>
        </Button>
      </VStack>
      <AsteriskInstructionsModal
        isOpen={isInstructionsModalOpen}
        onClose={onCloseInstructions}
      />
    </Card>
  )
})
