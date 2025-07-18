import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UserItem.module.scss'
import React, { HTMLAttributeAnchorTarget, memo, useState } from 'react'
import { User } from '../../model/types/user'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { ContentView } from '@/entities/Content'
import { UserMenu } from '../UserMenu/UserMenu'
import { Button } from '@/shared/ui/redesigned/Button'
import { Avatar } from '@/shared/ui/redesigned/Avatar'
import { UserAddAvatar } from '../UserAddAvatar/UserAddAvatar'
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
  const [isUserAvatarOpen, setIsUserAvatarOpen] = useState<boolean>(false)
  const checkedSrc = user.avatar ? __STATIC__ + String(user.avatar) : ''

  const userInfo = (
        <HStack gap={'16'} wrap={'wrap'}>
            <UserAddAvatar
                user={user}
                show={isUserAvatarOpen}
                onClose={() => {
                  setIsUserAvatarOpen(false)
                }}
            />
            <Button
                variant={'clear'}
                onClick={() => {
                  setIsUserAvatarOpen(true)
                }}
            >
                <Avatar
                    size={48}
                    src={checkedSrc}
                    alt={user.name}
                    username={user.name}
                />
            </Button>
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
                border={'round'}
                className={classNames(cls.UserItem, {
                  [cls.isAdmin]: isAdmin,
                  [cls.isClient]: isClient
                }, [className, cls[view]])}
            >
                <HStack max justify={'start'} gap={'16'}>
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
                    <HStack wrap={'wrap'} gap={'16'} justify={'between'} max>
                        {userInfo}
                        {user.email && <Text text={user.email}/>}
                    </HStack>
                    <UserMenu id={user.id} className={cls.menu}/>
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
        >
            <VStack
                gap={'8'}
                justify={'start'}
            >
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
                    {userInfo}
                    {user.email ? <Text text={user.email}/> : ''}
                    <UserMenu id={user.id} className={cls.menu}/>
                    <div className={cls.footer}></div>
            </VStack>
        </Card>
  )
})
