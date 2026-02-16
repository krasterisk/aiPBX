import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Check } from '@/shared/ui/mui/Check'
import { McpServer } from '../../model/types/mcpTypes'
import { useMcpServersAll } from '../../api/mcpApi'

interface McpServerSelectProps {
    label?: string
    value?: McpServer[]
    className?: string
    onChangeMcpServers?: (event: any, newValue: McpServer[]) => void
    userId?: string
    fullWidth?: boolean
}

export const McpServerSelect = memo((props: McpServerSelectProps) => {
    const {
        className,
        label,
        value,
        onChangeMcpServers,
        userId,
        ...otherProps
    } = props

    const {
        data: servers
    } = useMcpServersAll(null)

    const onChangeMultipleHandler = (event: any, newValue: McpServer | McpServer[] | null) => {
        const arrayValue = Array.isArray(newValue) ? newValue : []
        onChangeMcpServers?.(event, arrayValue)
    }

    return (
        <Combobox
            multiple
            disableCloseOnSelect
            label={label}
            options={(servers || []).filter(s => s.id && s.name) as any[]}
            value={(value || []).filter(v => v.id && v.name) as any[]}
            onChange={onChangeMultipleHandler}
            className={className}
            getOptionLabel={(option: any) => option.name || ''}
            isOptionEqualToValue={(option: any, val: any) => Number(option.id) === Number(val.id)}
            renderOption={(props, option: any, { selected }) => (
                <li {...props}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Check
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {String(option.name)}
                    </div>
                </li>
            )}
            {...otherProps}
        />
    )
})
