import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Avatar.module.scss'
import { CSSProperties, useMemo } from 'react'
import { AppImage } from '../../redesigned/AppImage'
import { Skeleton } from '../Skeleton'
import UserIcon from '../../../assets/icons/user-filled.svg'
import { Icon } from '../Icon/Icon'
import { HStack } from '../Stack'
import { Text } from '../Text'

interface AvatarProps {
  className?: string
  src?: string
  size?: number
  alt?: string
  username?: string
  createdAt?: string
}

export const Avatar = ({
  className,
  src,
  size = 100,
  alt,
  username,
  createdAt
}: AvatarProps) => {
  const wrapperStyle = useMemo<CSSProperties>(() => ({
    '--avatar-size': `${size}px`,
  } as CSSProperties), [size])

  const errorFallback = <Icon
    width={size}
    height={size}
    Svg={UserIcon}
  />
  const fallback = <Skeleton width={size} height={size} border={'50%'} />

  return (
    <HStack gap={'8'} style={wrapperStyle}>
      <AppImage
        fallback={fallback}
        errorFallback={errorFallback}
        src={src}
        alt={alt}
        className={classNames(cls.Avatar, {}, [className])}
      />
      {username && <Text text={username} bold />}
      {createdAt && <Text text={createdAt.slice(0, 10)} size={'s'} />}
    </HStack>
  )
}

