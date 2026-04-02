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
    // Some PBX systems use '+' in filenames (e.g. 20260330-+796591.mp3).
    // The '+' may get URL-decoded to a space (%20) during transport.
    // Restore '+' signs that were mangled: replace literal spaces and %20 with '+' in the path portion.
    let fixedSrc = src
    try {
      const urlObj = new URL(src)
      // Only fix the pathname, leave query/hash untouched
      urlObj.pathname = urlObj.pathname.replace(/%20/g, '+').replace(/ /g, '+')
      fixedSrc = urlObj.toString()
    } catch {
      // If URL parsing fails, use as-is
      fixedSrc = src
    }
    window.open(
      fixedSrc,
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
