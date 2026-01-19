import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { AssistantOptions } from '../../model/types/assistants'
import { useAssistantsAll } from '../../api/assistantsApi'

interface AssistantSelectSingleProps {
    label?: string
    value?: AssistantOptions | null
    className?: string
    onChangeAssistant?: (event: any, newValue: AssistantOptions | null) => void
    userId?: string
}

export const AssistantSelectSingle = memo((props: AssistantSelectSingleProps) => {
    const {
        className,
        label,
        value,
        onChangeAssistant,
        userId,
        ...otherProps
    } = props

    const {
        data: assistants
    } = useAssistantsAll(
        { userId }
    )

    const onChangeHandler = (event: any, newValue: AssistantOptions | null) => {
        onChangeAssistant?.(event, newValue)
    }

    return (
        <Combobox
            id={'assistantSelectSingleBox'}
            label={label}
            autoComplete
            options={assistants || []}
            value={value}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={onChangeHandler}
            getOptionLabel={(option) => option.name}
            {...otherProps}
        />
    )
})
