import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { PbxServerOptions } from '../../model/types/pbxServers'
import { usePbxServersAll } from '../../api/pbxServersApi'

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
    ...otherProps
  } = props

  const { data: PbxServers } = usePbxServersAll(null)

  const onChangeHandler = (event: any, newValue: PbxServerOptions | null) => {
    onChangePbxServer?.(event, newValue)
  }

  return (
        <Combobox
            id="PbxServerSelectBox"
            label={label}
            autoComplete
            options={PbxServers || []}
            value={value}
            groupBy={(option) => option.location || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => (
                <li {...props}>{option.name}</li>
            )}
            onChange={onChangeHandler}
            getOptionLabel={(option) => option.name}
            {...otherProps}
        />
  )
})
