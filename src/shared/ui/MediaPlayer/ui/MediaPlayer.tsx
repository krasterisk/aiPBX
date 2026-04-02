import { memo, useCallback } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { HStack } from '../../redesigned/Stack'
import { Headphones } from 'lucide-react'
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

  const onPlay = useCallback(() => {
    window.open(
      src,
      'audio_player',
      'width=520,height=200,menubar=no,toolbar=no,location=no,status=no,resizable=yes'
    )
  }, [src])

  return (
    <HStack max className={classNames(cls.MediaPlayer, {}, [className])}>
      <button className={cls.playButton} onClick={onPlay} type="button">
        <Headphones size={18} className={cls.playButtonIcon} />
        {/* eslint-disable-next-line i18next/no-literal-string */}
        <span>Прослушать запись</span>
      </button>
    </HStack>
  )
})
