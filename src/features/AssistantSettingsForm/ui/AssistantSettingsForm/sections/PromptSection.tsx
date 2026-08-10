import { memo, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Assistant, getAssistantFormData } from '@/entities/Assistants'
import cls from '../AssistantSettingsForm.module.scss'

interface PromptSectionProps {
    onChangeText: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export const PromptSection = memo((props: PromptSectionProps) => {
    const { onChangeText } = props
    const { t } = useTranslation('playground')
    const formFields = useSelector(getAssistantFormData)

    return (
        <div className={cls.fullWidth}>
            <Textarea
                label={t('Инструкция для ассистента') ?? ''}
                onChange={onChangeText('instruction')}
                data-testid="AssistantSettingsForm.instruction"
                value={formFields?.instruction || ''}
                placeholder={t('Введите инструкции для ИИ...') ?? ''}
                minRows={8}
                multiline
                required
                size="small"
                fullWidth
                className={cls.promptTextarea}
            />
        </div>
    )
})
