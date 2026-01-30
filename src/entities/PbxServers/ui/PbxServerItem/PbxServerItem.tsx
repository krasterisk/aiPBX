import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServerItem.module.scss'
import React, { HTMLAttributeAnchorTarget, memo, useCallback } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { PbxServer } from '../../model/types/pbxServers'
import { getRoutePbxServerEdit } from '@/shared/const/router'
import { ContentView } from '../../../Content'
import { useNavigate } from 'react-router-dom'

interface PbxServerItemProps {
  className?: string
  pbxServer: PbxServer
  onEdit?: (id: string) => void
  target?: HTMLAttributeAnchorTarget
  checkedItems?: string[]
  onChangeChecked?: (event: React.ChangeEvent<HTMLInputElement>) => void
  view?: ContentView
}

export const PbxServerItem = memo((props: PbxServerItemProps) => {
  const {
    className,
    pbxServer,
    checkedItems,
    onChangeChecked,
    view = 'BIG',
  } = props

  const navigate = useNavigate()

  const onOpenEdit = useCallback(() => {
    navigate(getRoutePbxServerEdit(pbxServer.id || ''))
  }, [navigate, pbxServer.id])

  const onCheckClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <Card
      padding={'16'}
      max
      border={'partial'}
      className={classNames(cls.PbxServerItem, {}, [className, cls[view]])}
      onClick={onOpenEdit}
    >
      <HStack gap={'24'} wrap={'wrap'} justify={'start'} max>
        <div onClick={onCheckClick}>
          <Check
            key={String(pbxServer.id)}
            className={classNames('', {
              [cls.uncheck]: !checkedItems?.includes(String(pbxServer.id)),
              [cls.check]: checkedItems?.includes(String(pbxServer.id))
            }, [])}
            value={String(pbxServer.id)}
            size={'small'}
            checked={checkedItems?.includes(String(pbxServer.id))}
            onChange={onChangeChecked}
          />
        </div>
        <VStack max gap={'4'}>
          <Text title={pbxServer.name} />
          <Text text={pbxServer.sip_host} />
          <Text text={pbxServer.location} />
          {pbxServer.comment ? <HStack><Text text={pbxServer.comment} /></HStack> : ''}
        </VStack>
      </HStack>
    </Card>
  )
})
