import { memo, useCallback, useMemo, useRef, useState, ReactNode } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { AutocompleteInputChangeReason, IconButton } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import { useGetAllModels } from '../../api/aiModelApi'
import {
    getVoicesForRealtimeModel,
    resolveRealtimeVendor,
} from '../../model/lib/realtimeVoices'
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
  error?: boolean
  helperText?: ReactNode
  'data-testid'?: string
}

const getVoicePreviewUrl = (voice: string, vendor: string): string => {
  if (vendor === 'qwen') {
    return `https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/en-US/20250804/beuyzk/${voice}.wav`
  }
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
  const { data: catalog } = useGetAllModels(null)

  const catalogVendor = useMemo(() => {
    const item = catalog?.find(m => m.name === model)
    return item?.realtimeVendor ?? null
  }, [catalog, model])

  const vendor = useMemo(
    () => resolveRealtimeVendor(model, catalogVendor),
    [model, catalogVendor]
  )

  const topics = useMemo(
    () => getVoicesForRealtimeModel(model, catalogVendor).map(voice => ({ id: voice, name: voice })),
    [model, catalogVendor]
  )

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

      const url = getVoicePreviewUrl(voice, vendor)
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
  }, [playingVoice, vendor])

  return (
    <Combobox
      key={vendor}
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
