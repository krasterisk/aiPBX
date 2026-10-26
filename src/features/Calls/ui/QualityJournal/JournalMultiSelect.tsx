import { useTranslation } from 'react-i18next'
import { SelectControl, type SelectOption } from '@/shared/ui/redesign-v3'
export function JournalMultiSelect(props: { label: string, options: SelectOption[], value: string[], onChange: (value: string[]) => void, disabled?: boolean, multiple?: boolean }) {
    const { t } = useTranslation('quality-journal')
    return <SelectControl {...props} messages={{ all: String(t('all')), selected: count => String(t('selectedCount', { count })), search: String(t('findIn', { label: props.label })), clear: String(t('clearSelection')), empty: String(t('noOptions')), unknown: String(t('selectedValue')) }} />
}
