import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UserItem.module.scss'
import React, { HTMLAttributeAnchorTarget, memo, useState } from 'react'
import { User } from '../../model/types/user'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { ContentView } from '@/entities/Content'
import { Avatar } from '@/shared/ui/redesigned/Avatar'
import { Check } from '@/shared/ui/mui/Check'

interface UserItemProps {
  className?: string
  user: User
  onEdit?: (id: string) => void
  view?: ContentView
  target?: HTMLAttributeAnchorTarget
  checkedItems?: string[]
  onChangeChecked?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const UserItem = memo((props: UserItemProps) => {
  const {
    className,
    user,
    checkedItems,
    onChangeChecked,
    view = 'BIG'
  } = props

  const isAdmin = user?.roles?.some(role => role.value === 'ADMIN')
  const isClient = !user.vpbx_user_id && !isAdmin
  const checkedSrc = user.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${__STATIC__}/${user.avatar}`)
    : ''

  const userInfo = (
    <HStack gap={'16'} wrap={'wrap'}>
      <Avatar
        size={48}
        src={checkedSrc}
        alt={user.name}
        username={user.name}
      />
      {
        user.vpbxUser &&
        <Text text={String(user.vpbxUser?.name)} variant={'accent'} />
      }
    </HStack>
  )

  if (view === 'BIG') {
    return (
      <Card
        padding={'16'}
        max
        border={'partial'}
        className={classNames(cls.UserItem, {
          [cls.isAdmin]: isAdmin,
          [cls.isClient]: isClient
        }, [className, cls[view]])}
        onClick={() => props.onEdit?.(user.id)}
      >
        <HStack max justify={'start'} gap={'16'}>
          <div onClick={(e) => e.stopPropagation()}>
            <Check
              key={String(user.id)}
              className={classNames('', {
                [cls.uncheck]: !checkedItems?.includes(String(user.id)),
                [cls.check]: checkedItems?.includes(String(user.id))
              }, [])}
              value={String(user.id)}
              size={'small'}
              checked={checkedItems?.includes(String(user.id))}
              onChange={onChangeChecked}
            />
          </div>
          <HStack wrap={'wrap'} gap={'16'} justify={'between'} max>
            {userInfo}
            {user.email && <Text text={user.email} />}
          </HStack>
        </HStack>
      </Card>
    )
  }

  return (
    <Card
      padding={'24'}
      border={'partial'}
      className={classNames(cls.UserItem, {
        [cls.isAdmin]: isAdmin,
        [cls.isClient]: isClient
      }, [className, cls[view]])}
      onClick={() => props.onEdit?.(user.id)}
    >
      <VStack
        gap={'8'}
        justify={'start'}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <Check
            key={String(user.id)}
            className={classNames('', {
              [cls.uncheck]: !checkedItems?.includes(String(user.id)),
              [cls.check]: checkedItems?.includes(String(user.id))
            }, [])}
            value={String(user.id)}
            size={'small'}
            checked={checkedItems?.includes(String(user.id))}
            onChange={onChangeChecked}
          />
        </div>
        {userInfo}
        {user.email ? <Text text={user.email} /> : ''}
        <div className={cls.footer}></div>
      </VStack>
    </Card>
  )
})
