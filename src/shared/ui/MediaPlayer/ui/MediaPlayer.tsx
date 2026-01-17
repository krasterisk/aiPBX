import { memo } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { HStack } from '../../redesigned/Stack'
import cls from './MediaPlayer.module.scss'

interface MediaPlayerProps {
  className?: string
  src: string
}

export const MediaPlayer = memo((props: MediaPlayerProps) => {
  const {
    className,
    src
  } = props

  return (
    <HStack max className={classNames(cls.MediaPlayer, {}, [className])}>
      <audio controls src={src} preload="auto" className={cls.audio}>
        Your browser does not support the audio element.
      </audio>
    </HStack>
  )
})
