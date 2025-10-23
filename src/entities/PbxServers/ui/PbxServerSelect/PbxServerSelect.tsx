import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Checkbox } from '@mui/material'
import { PbxServerOptions } from '../../model/types/pbxServers'
import { usePbxServersAll } from '../../api/pbxServersApi'

interface PbxServerSelectProps {
  label?: string
  value?: PbxServerOptions[]
  PbxServerId?: string[]
  className?: string
  onChangePbxServer?: (event: any, newValue: PbxServerOptions[]) => void
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

  const {
    data: PbxServers
  } = usePbxServersAll(null)

  const onChangeMultipleHandler = (event: any, newValue: PbxServerOptions[]) => {
    onChangePbxServer?.(event, newValue)
  }

  return (
        <Combobox
            id={'PbxServerSelectBox'}
            multiple
            label={label}
            autoComplete
            groupBy={(option) => option.group || ''}
            options={PbxServers || []}
            disableCloseOnSelect
            value={value}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option, { selected, inputValue, index }) => {
              const { ...otherProps } = props
              return (
                    <li {...otherProps}>
                        <Checkbox
                            // icon={icon}
                            // checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {String(option.name)}
                    </li>
              )
            }}
            onChange={onChangeMultipleHandler}
            getOptionLabel={(option) => option.name}
            {...otherProps}
        />
  )
})
