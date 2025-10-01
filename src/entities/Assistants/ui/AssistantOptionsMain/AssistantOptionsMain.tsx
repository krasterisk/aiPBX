import cls from './AssistantOptionsMain.module.scss'
import React, { ChangeEvent, memo } from 'react'
import { useSelector } from 'react-redux'
import {
  ClientOptions,
  ClientSelect,
  getUserAuthData,
  isUserAdmin
} from '../../../User'
import { useTranslation } from 'react-i18next'
import {
  getAssistantsCreateFormFields,
  getAssistantsEditFormFields
} from '../../model/selectors/assistantsPageSelectors'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Tool, ToolsSelect } from '@/entities/Tools'
import { VoiceSelect } from '../VoiceSelect/VoiceSelect'
import { Assistant } from '../../model/types/assistants'

interface AssistantOptionsMainProps {
  className?: string
  isEdit: boolean
  onChangeTextHandler?: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onChangeSelectHandler?: (field: keyof Assistant) => (event: any, newValue: string) => void
  onChangeClientHandler?: (event: any, newValue: ClientOptions | null) => void
  onChangeToolsHandler?: (event: any, value: Tool[]) => void
}

export const AssistantOptionsMain = memo((props: AssistantOptionsMainProps) => {
  const {
    className,
    isEdit,
    onChangeTextHandler,
    onChangeSelectHandler,
    onChangeClientHandler,
    onChangeToolsHandler
  } = props

  const { t } = useTranslation('assistants')
  const isAdmin = useSelector(isUserAdmin)
  const clientData = useSelector(getUserAuthData)
  const editFields = useSelector(getAssistantsEditFormFields)
  const createFields = useSelector(getAssistantsCreateFormFields)
  const formFields = isEdit ? editFields : createFields
  const userId = isAdmin ? formFields?.userId : clientData?.id

  return (
        <VStack max gap={'16'} className={className}>
            {isAdmin &&
              <ClientSelect
                    value={formFields.user as ClientOptions}
                    onChangeClient={onChangeClientHandler}
                    label={String(t('Клиент'))}
                    className={cls.client}
                    data-testid={'AssistantCard.ClientSelect'}
                />
            }

            <Textarea
                label={t('Наименование ассистента') ?? ''}
                onChange={onChangeTextHandler?.('name')}
                data-testid={'AssistantCard.name'}
                value={formFields.name || ''}
                required
            />
            <VoiceSelect
                label={String(t('Голос'))}
                value={formFields.voice ?? ''}
                onChangeValue={onChangeSelectHandler?.('voice')}
            />
            <ToolsSelect
                label={t('Функции') || ''}
                value={formFields.tools || []}
                userId={userId}
                onChangeTool={onChangeToolsHandler}
            />
          <Textarea
              label={t('Комментарий') ?? ''}
              onChange={onChangeTextHandler?.('comment')}
              data-testid={'AssistantCardCreate.comment'}
              value={formFields.comment || ''}
          />
        </VStack>
  )
})
