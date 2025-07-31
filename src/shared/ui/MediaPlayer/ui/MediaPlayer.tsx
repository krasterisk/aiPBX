import { memo } from 'react'
import { HStack } from '../../redesigned/Stack'

interface MediaPlayerProps {
  className?: string
  src: string
}

export const MediaPlayer = memo((props: MediaPlayerProps) => {
  const {
    className,
    src
  } = props

  // const audioRef = useRef<HTMLAudioElement>(null)
  //
  // const handlePlay = useCallback(() => {
  //   audioRef.current?.play()
  // }, [])
  //
  // const handlePause = useCallback(() => {
  //   audioRef.current?.pause()
  // }, [])
  //   {/*<div className={classNames(cls.MediaPlayer, {}, [className])}>*/}
  //   {/*<audio ref={audioRef} src={src} preload="auto" />*/}
  //   {/*<div className={cls.nav}>*/}
  //   {/*  <button onClick={handlePlay}>▶</button>*/}
  //   {/*  <button onClick={handlePause}>❚❚</button>*/}
  //   {/*</div>*/}
  // {/*</div>*/}

  return (

        <HStack max>
            <audio controls src={src} preload="auto" className={className}>
                Your browser does not support the audio element.
            </audio>
        </HStack>
  )
})
