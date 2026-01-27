import { memo, useCallback, useRef, useState } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { AutocompleteInputChangeReason } from '@mui/material'
import { IconButton } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import cls from './VoiceSelect.module.scss'

interface VoiceSelectProps {
  label?: string
  value?: string
  className?: string
  model?: string
  onChangeValue?: (event: any, newValue: string) => void
  onInputChange?: (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => void
  inputValue?: string
}

const GPT_VOICES = ['alloy', 'ash', 'ballad', 'cedar', 'coral', 'echo', 'sage', 'shimmer', 'marin', 'verse']

const QWEN_VOICES = [
  'Cherry', 'Serena', 'Ethan', 'Chelsie', 'Momo', 'Vivian', 'Moon', 'Maia', 'Kai', 'Nofish',
  'Bella', 'Jennifer', 'Ryan', 'Katerina', 'Aiden', 'Eldric Sage', 'Mia', 'Mochi', 'Bellona',
  'Vincent', 'Bunny', 'Neil', 'Elias', 'Arthur', 'Nini', 'Ebona', 'Seren', 'Pip', 'Stella',
  'Bodega', 'Sonrisa', 'Alek', 'Dolce', 'Sohee', 'Ono Anna', 'Lenn', 'Emilien', 'Andre',
  'Radio Gol', 'Jada', 'Dylan', 'Li', 'Marcus', 'Roy', 'Peter', 'Sunny', 'Eric', 'Rocky', 'Kiki'
]

const getVoicePreviewUrl = (voice: string, model?: string): string => {
  if (model?.startsWith('qwen')) {
    return `https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/en-US/20250804/beuyzk/${voice}.wav`
  }
  // Default to GPT
  return `https://cdn.openai.com/API/voice-previews/${voice}.flac`
}

export const VoiceSelect = memo((props: VoiceSelectProps) => {
  const {
    className,
    label,
    value,
    inputValue,
    model,
    onChangeValue,
    onInputChange,
    ...otherProps
  } = props

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)

  let topics: string[] = []

  if (model?.startsWith('gpt')) {
    topics = GPT_VOICES
  } else if (model?.startsWith('qwen')) {
    topics = QWEN_VOICES
  } else {
    topics = GPT_VOICES
  }

  const selectedValue = topics.find(item => item === value) ?? null

  const onChangeHandler = (event: any, newValue: string) => {
    onChangeValue?.(event, newValue)
  }

  const handlePlayStop = useCallback((voice: string, event: React.MouseEvent) => {
    event.stopPropagation()

    if (playingVoice === voice && audioRef.current) {
      // Stop playing
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setPlayingVoice(null)
    } else {
      // Start playing
      if (audioRef.current) {
        audioRef.current.pause()
      }

      const url = getVoicePreviewUrl(voice, model)
      const audio = new Audio(url)
      audioRef.current = audio

      audio.play().catch(error => {
        console.error('Error playing audio:', error)
        setPlayingVoice(null)
      })

      audio.onended = () => {
        setPlayingVoice(null)
      }

      setPlayingVoice(voice)
    }
  }, [playingVoice, model])

  return (
    <Combobox
      label={label}
      autoComplete={true}
      clearOnBlur={false}
      options={topics}
      value={selectedValue}
      onChange={onChangeHandler}
      inputValue={inputValue}
      onInputChange={onInputChange}
      freeSolo={false}
      className={className}
      renderOption={(props, option) => {
        const isPlaying = playingVoice === option
        return (
          <li {...props} className={cls.option}>
            <span className={cls.voiceName}>{option}</span>
            <IconButton
              size="small"
              onClick={(e) => handlePlayStop(option, e)}
              className={cls.playButton}
            >
              {isPlaying ? (
                <StopIcon fontSize="small" className={cls.icon} />
              ) : (
                <PlayArrowIcon fontSize="small" className={cls.icon} />
              )}
            </IconButton>
          </li>
        )
      }}
      {...otherProps}
    />
  )
})
