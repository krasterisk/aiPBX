import { useSelector } from 'react-redux'
import { SelectControl, type SelectControlProps } from '@/shared/ui/redesign-v3'
import { useGetAllUsers } from '../../api/usersApi'
import { isUserAdmin } from '../../model/selectors/roleSelector'
export function ClientFilter({ value, onChange, label, messages }: { value: string, onChange: (id: string) => void, label: string, messages: SelectControlProps['messages'] }) {
    const admin = useSelector(isUserAdmin)
    const { data = [], isLoading } = useGetAllUsers(null, { skip: !admin })
    if (!admin) return null
    return <SelectControl label={label} multiple={false} disabled={isLoading} value={value ? [value] : []} onChange={ids => { onChange(ids[0] ?? '') }} options={data.map(item => ({ value: String(item.id), label: item.name || item.email || String(item.id) }))} messages={messages} />
}
