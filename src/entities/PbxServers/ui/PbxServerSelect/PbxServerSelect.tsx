import { memo, useMemo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { PbxServerOptions } from '../../model/types/pbxServers'
import { usePbxServersAll, usePbxServersCloud, usePbxServersCloudAndUser } from '../../api/pbxServersApi'

interface PbxServerSelectProps {
  label?: string
  value?: PbxServerOptions | null
  PbxServerId?: string
  className?: string
  onChangePbxServer?: (event: any, newValue: PbxServerOptions | null) => void
  userId?: string
  fullWidth?: boolean
  fetchType?: 'all' | 'cloud' | 'cloud-and-user'
}

export const PbxServerSelect = memo((props: PbxServerSelectProps) => {
  const {
    className,
    label,
    value,
    onChangePbxServer,
    PbxServerId,
    userId,
    fetchType = 'all',
    ...otherProps
  } = props

  const { data: pbxServersAll } = usePbxServersAll(null, { skip: fetchType !== 'all' })
  const { data: pbxServersCloud } = usePbxServersCloud(null, { skip: fetchType !== 'cloud' })
  const { data: pbxServersCloudAndUser } = usePbxServersCloudAndUser(null, { skip: fetchType !== 'cloud-and-user' })

  const PbxServers = useMemo(() => {
    if (fetchType === 'cloud') return pbxServersCloud
    if (fetchType === 'cloud-and-user') return pbxServersCloudAndUser
    return pbxServersAll
  }, [fetchType, pbxServersAll, pbxServersCloud, pbxServersCloudAndUser])

  const onChangeHandler = (event: any, newValue: PbxServerOptions | PbxServerOptions[] | null) => {
    if (!Array.isArray(newValue)) {
      onChangePbxServer?.(event, newValue)
    }
  }

  const options = useMemo(() => {
    if (!PbxServers) return []
    return [...PbxServers]
      .filter(s => s.id && s.name)
      .sort((a, b) => (a.location || '').localeCompare(b.location || '')) as PbxServerOptions[]
  }, [PbxServers])

  return (
    <Combobox
      label={label}
      options={options}
      value={value || null}
      onChange={onChangeHandler}
      className={className}
      getOptionLabel={(option: PbxServerOptions) => option.name || ''}
      isOptionEqualToValue={(option: PbxServerOptions, value: PbxServerOptions) => option.id === value.id}
      {...otherProps}
    />
  )
})
