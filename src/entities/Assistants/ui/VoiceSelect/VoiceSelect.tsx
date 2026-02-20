import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { AutocompleteInputChangeReason, IconButton } from '@mui/material'
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
  fullWidth?: boolean
  required?: boolean
}

const GPT_VOICES = ['alloy', 'ash', 'ballad', 'cedar', 'coral', 'echo', 'sage', 'shimmer', 'marin', 'verse']

const QWEN_VOICES = [
  'Cherry', 'Serena', 'Ethan', 'Chelsie', 'Momo', 'Vivian', 'Moon', 'Maia', 'Kai', 'Nofish',
  'Bella', 'Jennifer', 'Ryan', 'Katerina', 'Aiden', 'Eldric Sage', 'Mia', 'Mochi', 'Bellona',
  'Vincent', 'Bunny', 'Neil', 'Elias', 'Arthur', 'Nini', 'Ebona', 'Seren', 'Pip', 'Stella',
  'Bodega', 'Sonrisa', 'Alek', 'Dolce', 'Sohee', 'Ono Anna', 'Lenn', 'Emilien', 'Andre',
  'Radio Gol', 'Jada', 'Dylan', 'Li', 'Marcus', 'Roy', 'Peter', 'Sunny', 'Eric', 'Rocky', 'Kiki'
]

const YANDEX_VOICES = [
  'alena', 'filipp', 'ermil', 'jane', 'omazh', 'zahar',
  'dasha', 'julia', 'lera', 'masha', 'marina',
  'alexander', 'kirill', 'anton',
  'madi_ru', 'saule_ru', 'zamira_ru', 'zhanar_ru', 'yulduz_ru'
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

  const topics = useMemo(() => {
    const voiceArray = model?.startsWith('qwen')
? QWEN_VOICES
      : model?.startsWith('yandex')
? YANDEX_VOICES
        : model?.startsWith('gpt')
? GPT_VOICES
          : GPT_VOICES

    return voiceArray.map(voice => ({ id: voice, name: voice }))
  }, [model])

  const selectedValue = useMemo(
    () => topics.find(item => item.id === value) ?? null,
    [topics, value]
  )

  const onChangeHandler = (event: any, newValue: typeof topics[number] | null) => {
    if (newValue) {
      onChangeValue?.(event, newValue.id)
    } else {
      onChangeValue?.(event, '')
    }
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
      options={topics}
      value={selectedValue}
      onChange={onChangeHandler}
      className={className}
      getOptionLabel={(option: { id: string, name: string }) => option.name}
      isOptionEqualToValue={(option: { id: string }, value: { id: string }) => option.id === value.id}
      renderOption={(props: any, option: any) => {
        const isPlaying = playingVoice === option.id
        return (
          <li {...props}>
            <div className={cls.option} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span className={cls.voiceName}>{option.name}</span>
              <IconButton
                size="small"
                onClick={(e) => { handlePlayStop(option.id, e) }}
                className={cls.playButton}
              >
                {isPlaying
? (
                  <StopIcon fontSize="small" className={cls.icon} />
                )
: (
                  <PlayArrowIcon fontSize="small" className={cls.icon} />
                )}
              </IconButton>
            </div>
          </li>
        )
      }}
      {...otherProps}
    />
  )
})
