import { memo } from 'react'
import { useGetOperatorProjects } from '@/entities/Report'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { OperatorProject } from '@/entities/Report'
import { useTranslation } from 'react-i18next'

interface ProjectSelectProps {
    label?: string
    value?: string
    className?: string
    onChange?: (projectId: string) => void
    required?: boolean
    disableClearable?: boolean
}

export const ProjectSelect = memo((props: ProjectSelectProps) => {
    const { className, label, value, onChange, required, disableClearable } = props
    const { t } = useTranslation('reports')
    const { data: projects = [] } = useGetOperatorProjects()

    const options = projects.map((p: OperatorProject) => ({
        id: p.id,
        name: p.name
    }))

    const selectedValue = options.find(o => o.id === value) || null

    const handleChange = (_: any, newValue: { id: string; name: string } | null) => {
        onChange?.(newValue?.id ?? '')
    }

    return (
        <Combobox
            className={className}
            label={label ?? String(t('Выбрать проект'))}
            options={options}
            value={selectedValue}
            onChange={handleChange}
            getOptionLabel={(o: { name: string }) => o.name}
            isOptionEqualToValue={(o: { id: string }, v: { id: string }) => o.id === v.id}
            required={required}
            disableClearable={disableClearable}
        />
    )
})
