import { memo, useMemo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { PbxServerOptions } from '../../model/types/pbxServers'
import { usePbxServersAll } from '../../api/pbxServersApi'
import { TextField } from '@mui/material'

interface PbxServerSelectProps {
  label?: string
  value?: PbxServerOptions | null
  PbxServerId?: string
  className?: string
  onChangePbxServer?: (event: any, newValue: PbxServerOptions | null) => void
  userId?: string
}

export const PbxServerSelect = memo((props: PbxServerSelectProps) => {
  const {
    className,
    label,
    value,
    onChangePbxServer,
    PbxServerId,
    userId,
    ...otherProps
  } = props

  const { data: PbxServers } = usePbxServersAll(null)

  const onChangeHandler = (event: any, newValue: PbxServerOptions | null) => {
    onChangePbxServer?.(event, newValue)
  }

  const options = useMemo(() => {
    if (!PbxServers) return []
    return [...PbxServers].sort((a, b) => (a.location || '').localeCompare(b.location || ''))
  }, [PbxServers])

  return (
    <Combobox
      id="PbxServerSelectBox"
      label={label}
      autoComplete
      options={options}
      value={value || null}
      groupBy={(option) => option.location || ''}
      isOptionEqualToValue={(option, value) => value?.id !== undefined && String(option.id) === String(value.id)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              readOnly: true // Disable keyboard on mobile
            }
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>{option.name}</li>
      )}
      onChange={onChangeHandler}
      getOptionLabel={(option) => option.name}
      {...otherProps}
    />
  )
})
