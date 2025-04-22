import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantEditCard.module.scss'
import React, { ChangeEvent, memo, useCallback, useEffect } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import {
  Assistant,
  assistantsPageActions,
  getAssistantsEditFormFields,
  ModelSelect,
  useAssistant,
  VoiceSelect
} from '@/entities/Assistants'
import { AssistantEditCardHeader } from '../AssistantEditCardHeader/AssistantEditCardHeader'
import { useSelector } from 'react-redux'
import { ClientOptions, ClientSelect, getUserAuthData, isUserAdmin } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { Tool, toolsPageActions, ToolsSelect } from '@/entities/Tools'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Text } from '@/shared/ui/redesigned/Text'

interface UserEditCardProps {
  className?: string
  isError?: boolean
  onEdit?: (data: Assistant) => void
  assistantId: string
  error?: FetchBaseQueryError | SerializedError | undefined
  onDelete?: (id: string) => void
}

export const AssistantEditCard = memo((props: UserEditCardProps) => {
  const {
    className,
    onEdit,
    assistantId,
    onDelete,
    error
  } = props

  const { data, isError, isLoading } = useAssistant(assistantId, {
    skip: !assistantId
  })

  const { t } = useTranslation('assistants')
  const isAdmin = useSelector(isUserAdmin)
  const clientData = useSelector(getUserAuthData)
  const formFields = useSelector(getAssistantsEditFormFields)
  const dispatch = useAppDispatch()

  const userId = isAdmin ? formFields?.userId : clientData?.id

  useEffect(() => {
    if (data) {
      dispatch(assistantsPageActions.updateAssistantsEditForm(data))
    }
  }, [data, dispatch])

  const onChangeToolsHandler = useCallback((
    event: any,
    value: Tool[]) => {
    const updatedFields = {
      ...formFields,
      tools: value
    }
    dispatch(assistantsPageActions.updateAssistantsEditForm(updatedFields))
  }, [dispatch, formFields])

  const onChangeClientHandler = useCallback((
    event: any,
    newValue: ClientOptions | null) => {
    if (newValue) {
      const updateForm = {
        ...formFields,
        user: {
          id: newValue.id,
          name: newValue.name
        },
        userId: newValue.id
      }
      dispatch(assistantsPageActions.updateAssistantsEditForm(updateForm))
      dispatch(assistantsPageActions.setUser(newValue))
    } else {
      const updateForm = {
        ...formFields,
        user: {
          id: '',
          name: ''
        },
        userId: ''
      }
      dispatch(assistantsPageActions.updateAssistantsEditForm(updateForm))
      dispatch(toolsPageActions.setUser({ id: '', name: '' }))
    }
  }, [dispatch, formFields])

  const onChangeSelectHandler = (field: keyof Assistant) => (
    event: any,
    newValue: string
  ) => {
    const updatedFields = {
      ...formFields,
      [field]: newValue
    }
    dispatch(assistantsPageActions.updateAssistantsEditForm(updatedFields))
  }

  const onTextChangeHandler = (field: keyof Assistant) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      const updatedFields = {
        ...formFields,
        [field]: value
      }
      dispatch(assistantsPageActions.updateAssistantsEditForm(updatedFields))
    }

  const IsAdminOptions = (
      <>
        <ModelSelect
            label={String(t('Модель'))}
            value={formFields.model || ''}
            onChangeValue={onChangeSelectHandler('model')}
        />
        <Textarea
            label={t('Температура') ?? ''}
            onChange={onTextChangeHandler('temperature')}
            data-testid={'AssistantCardEdit.temperature'}
            value={formFields.temperature || ''}
        />
        <Textarea
            label={t('Ограничитель токенов') ?? ''}
            onChange={onTextChangeHandler('max_response_output_tokens')}
            data-testid={'AssistantCardEdit.max_response_output_tokens'}
            value={formFields.max_response_output_tokens || ''}
        />
        <Text text={'Синтез и распознавание речи'} bold />
        <Textarea
            label={t('Модель распознавания речи') ?? ''}
            onChange={onTextChangeHandler('input_audio_transcription_model')}
            data-testid={'AssistantCardEdit.input_audio_transcription_model'}
            value={formFields.input_audio_transcription_model || ''}
        />
        <Textarea
            label={t('Язык распознавания речи') ?? ''}
            onChange={onTextChangeHandler('input_audio_transcription_language')}
            data-testid={'AssistantCardEdit.input_audio_transcription_language'}
            value={formFields.input_audio_transcription_language || ''}
        />
        <Textarea
            label={t('Модель синтеза речи') ?? ''}
            onChange={onTextChangeHandler('output_audio_transcription_model')}
            data-testid={'AssistantCardEdit.output_audio_transcription_model'}
            value={formFields.output_audio_transcription_model || ''}
        />
        <Text text={'Аудио потоки'} bold />
        <Textarea
            label={t('Формат входящего аудио') ?? ''}
            onChange={onTextChangeHandler('input_audio_format')}
            data-testid={'AssistantCardEdit.input_audio_format'}
            value={formFields.input_audio_format || ''}
        />
        <Textarea
            label={t('Формат исходящего аудио') ?? ''}
            onChange={onTextChangeHandler('output_audio_format')}
            data-testid={'AssistantCardEdit.output_audio_format'}
            value={formFields.output_audio_format || ''}
        />
        <Textarea
            label={t('Тип определения шума (none, near_field, far_field)') ?? ''}
            onChange={onTextChangeHandler('input_audio_noise_reduction')}
            data-testid={'AssistantCardEdit.input_audio_noise_reduction'}
            value={formFields.input_audio_noise_reduction || ''}
        />
        <Text text={t('Автоматическое обнаружение голоса (VAD)')} bold />
        <Textarea
            label={t('Тип VAD') ?? ''}
            onChange={onTextChangeHandler('turn_detection_type')}
            data-testid={'AssistantCardEdit.turn_detection_type'}
            value={formFields.turn_detection_type || ''}
        />
        <Textarea
            label={t('Порог обнаружения голосовой активности, мс') ?? ''}
            onChange={onTextChangeHandler('turn_detection_threshold')}
            data-testid={'AssistantCardEdit.turn_detection_threshold'}
            value={formFields.turn_detection_threshold || ''}
        />
        <Textarea
            label={t('Длительность включаемого в поток звука, мс') ?? ''}
            onChange={onTextChangeHandler('turn_detection_prefix_padding_ms')}
            data-testid={'AssistantCardEdit.turn_detection_prefix_padding_ms'}
            value={formFields.turn_detection_prefix_padding_ms || ''}
        />
        <Textarea
            label={t('Продолжительность тишины, мс') ?? ''}
            onChange={onTextChangeHandler('turn_detection_silence_duration_ms')}
            data-testid={'AssistantCardEdit.turn_detection_silence_duration_ms'}
            value={formFields.turn_detection_silence_duration_ms || ''}
        />
        <Textarea
            label={t('Семантический VAD(Auto, Low, Medium, High)') ?? ''}
            onChange={onTextChangeHandler('semantic_eagerness')}
            data-testid={'AssistantCardEdit.semantic_eagerness'}
            value={formFields.semantic_eagerness || ''}
        />
      </>
  )

  const editHandler = useCallback(() => {
    onEdit?.(formFields)
  }, [formFields, onEdit])

  if (isLoading) {
    return (
        <VStack gap={'16'} max>
          <Card max>
            <Skeleton width='100%' border='8px' height='44px'/>
          </Card>
          <Skeleton width='100%' border='8px' height='80px'/>
          <Skeleton width='100%' border='8px' height='80px'/>
          <Skeleton width='100%' border='8px' height='80px'/>
        </VStack>
    )
  }

  return (
      <VStack
          gap={'8'}
          max
          className={classNames(cls.AssistantEditCard, {}, [className])}
      >
        <AssistantEditCardHeader
            onEdit={editHandler}
            onDelete={onDelete}
            assistantId={assistantId}
        />
          {isError
            ? <ErrorGetData
                  title={t('Ошибка при обновлении ассистента') || ''}
                  text={
                      error && 'data' in error
                        ? String(t((error.data as { message: string }).message))
                        : String(t('Проверьте заполняемые поля и повторите ещё раз'))
                  }
              />
            : ''}
        <Card
            max
            padding={'8'}
            border={'partial'}
        >
            <VStack gap={'16'} max>
                {isAdmin
                  ? <ClientSelect
                        value={formFields?.user as ClientOptions}
                        onChangeClient={onChangeClientHandler}
                        label={String(t('Клиент'))}
                         className={cls.client}
                        data-testid={'AssistantEditCard.ClientSelect'}
                    />
                  : <Text title={clientData?.name}/>
                }
                <Textarea
                    label={t('Наименование ассистента') ?? ''}
                    onChange={onTextChangeHandler('name')}
                    data-testid={'AssistantCardEdit.name'}
                    value={formFields.name}
                />
                <Textarea
                    label={t('Приветственная фраза') ?? ''}
                    onChange={onTextChangeHandler('greeting')}
                    data-testid={'AssistantCardCreate.greeting'}
                    value={formFields.greeting}
                />
                <Text text={'Параметры LLM модели'} bold />
                {isAdmin && IsAdminOptions}
                <Textarea
                    label={t('Инструкции для ассистента') ?? ''}
                    onChange={onTextChangeHandler('instruction')}
                    data-testid={'AssistantCardEdit.instruction'}
                    value={formFields.instruction || ''}
                    minRows={5}
                    multiline
                />
                <VoiceSelect
                    label={String(t('Голос'))}
                    value={formFields.voice || ''}
                    onChangeValue={onChangeSelectHandler('voice')}
                />
                <ToolsSelect
                    value={formFields.tools}
                    label={t('Функции') || ''}
                    userId={userId}
                    onChangeCask={onChangeToolsHandler}
                />
                <Textarea
                    label={t('Комментарий') ?? ''}
                    onChange={onTextChangeHandler('comment')}
                    data-testid={'AssistantCardEdit.comment'}
                    value={formFields.comment || ''}
                />
            </VStack>
        </Card>
          <AssistantEditCardHeader onEdit={editHandler} />
      </VStack>
  )
})
