import { useTranslation } from 'react-i18next'
import React, { ChangeEvent, memo } from 'react'
import { Assistant } from '../../model/types/assistants'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { useSelector } from 'react-redux'
import {
  getAssistantsCreateFormFields,
  getAssistantsEditFormFields
} from '../../model/selectors/assistantsPageSelectors'

interface AssistantOptionsPromptsProps {
  className?: string
  isEdit: boolean
  onTextChangeHandler?: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export const AssistantOptionsPrompts = memo((props: AssistantOptionsPromptsProps) => {
  const {
    className,
    onTextChangeHandler,
    isEdit
  } = props

  const { t } = useTranslation('assistants')
  const editFields = useSelector(getAssistantsEditFormFields)
  const createFields = useSelector(getAssistantsCreateFormFields)
  const formFields = isEdit ? editFields : createFields

  return (
        <VStack max gap={'16'} className={className}>
            <Textarea
                label={t('Приветственная фраза или инструкция') ?? ''}
                onChange={onTextChangeHandler?.('greeting')}
                data-testid={'AssistantCard.greeting'}
                value={formFields.greeting || ''}
                minRows={5}
                multiline
                required
            />
            <Textarea
                label={t('Основная инструкция для ассистента') ?? ''}
                onChange={onTextChangeHandler?.('instruction')}
                data-testid={'AssistantCard.instruction'}
                value={formFields.instruction || ''}
                minRows={5}
                multiline
                required
            />
        </VStack>
  )
})
