import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServerItem.module.scss'
import React, { HTMLAttributeAnchorTarget, memo, useCallback } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { PbxServer } from '../../model/types/pbxServers'
import { getRoutePbxServerEdit } from '@/shared/const/router'
import { ContentView } from '../../../Content'
import { useNavigate } from 'react-router-dom'
import { usePbxServerStatus } from '../../api/pbxServersApi'
import { Server, Globe, Activity, Info } from 'lucide-react'
import { Button } from '@/shared/ui/redesigned/Button'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { toast } from 'react-toastify'

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
              <div className={cls.chip}>
                <div className={classNames(cls.dot, {}, [cls.cloud])} />
                <Text text={t('CLOUD')} size="xs" bold />
              </div>
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
          <div className={cls.avatar}>
            <Server size={24} />
          </div>
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

        <div className={cls.detailsGrid}>
          <HStack gap="12" align="start">
            <div className={cls.detailIcon}>
              <Globe size={14} />
            </div>
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
              <div className={cls.detailIcon}>
                <Activity size={14} />
              </div>
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
              <div className={cls.detailIcon}>
                <Globe size={14} />
              </div>
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
              <div className={cls.detailIcon}>
                <Activity size={14} />
              </div>
              <VStack max>
                <Text text={t('Контекст')} variant="accent" size="xs" />
                <Text text={pbxServer.context} className={cls.urlText} />
              </VStack>
            </HStack>
          )}
        </div>

        {pbxServer.comment && (
          <HStack gap="8" className={cls.commentWrapper} align="start">
            <div className={cls.commentIcon}>
              <Info size={12} />
            </div>
            <Text text={pbxServer.comment} size="xs" className={cls.comment} bold />
          </HStack>
        )}
      </VStack>
    </Card>
  )
})
