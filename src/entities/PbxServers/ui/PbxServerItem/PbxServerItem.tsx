import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServerItem.module.scss'
import React, { HTMLAttributeAnchorTarget, memo } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { ContentView } from '@/entities/Content'
import { Check } from '@/shared/ui/mui/Check'
import { PbxServer } from '../../model/types/pbxServers'
import { getRoutePbxServerEdit } from '@/shared/const/router'
import { AppLink } from '@/shared/ui/redesigned/AppLink'

interface PbxServerItemProps {
  className?: string
  pbxServer: PbxServer
  onEdit?: (id: string) => void
  view?: ContentView
  target?: HTMLAttributeAnchorTarget
  checkedItems?: string[]
  onChangeChecked?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const PbxServerItem = memo((props: PbxServerItemProps) => {
  const {
    className,
    pbxServer,
    view = 'SMALL',
    checkedItems,
    onChangeChecked
  } = props

  if (view === 'BIG') {
    return (
            <Card
                padding={'16'}
                max
                className={classNames(cls.PbxServerItem, {}, [className, cls[view]])}
            >
              <HStack gap={'24'} wrap={'wrap'} justify={'start'} max>
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
                <AppLink to={getRoutePbxServerEdit(pbxServer.id || '')}>
                    <Text title={pbxServer.name}/>
                    <Text text={pbxServer.sip_host}/>
                    <Text text={pbxServer.location}/>
                    {pbxServer.comment ? <HStack><Text text={pbxServer.comment}/></HStack> : ''}
                </AppLink>
              </HStack>
            </Card>
    )
  }

  return (
          <Card
              padding={'24'}
              border={'partial'}
              className={classNames(cls.PbxServerItem, {}, [className, cls[view]])}
          >
            <VStack
                gap={'8'}
                justify={'start'}
                max
            >

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
              <AppLink to={getRoutePbxServerEdit(pbxServer.id || '')}>
                  <Text title={pbxServer.name}/>
                  <Text text={pbxServer.sip_host}/>
                  <Text text={pbxServer.location}/>
                  {pbxServer.comment ? <HStack><Text text={pbxServer.comment}/></HStack> : ''}
              </AppLink>
            </VStack>
          </Card>
  )
}
)
