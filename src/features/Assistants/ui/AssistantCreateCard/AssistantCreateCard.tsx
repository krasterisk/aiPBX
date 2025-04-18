import { useTranslation } from 'react-i18next'
import cls from './AssistantCreateCard.module.scss'
import React, { ChangeEvent, memo, useCallback, useEffect } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { classNames } from '@/shared/lib/classNames/classNames'
import {
  Assistant,
  assistantsPageActions,
  ModelSelect,
  VoiceSelect,
  getAssistantsCreateFormFields
} from '@/entities/Assistants'
import { useSelector } from 'react-redux'
import { ClientOptions, ClientSelect, getUserAuthData, isUserAdmin } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { AssistantCreateCardHeader } from '../AssistantCreateCardHeader/AssistantCreateCardHeader'
import { Tool, toolsPageActions, ToolsSelect } from '@/entities/Tools'

interface AssistantCreateCardProps {
  className?: string
  onCreate?: (data: Assistant) => void
  isError?: boolean
  error?: FetchBaseQueryError | SerializedError | undefined
}

export const AssistantCreateCard = memo((props: AssistantCreateCardProps) => {
  const {
    className,
    onCreate,
    isError,
    error
  } = props

  const { t } = useTranslation('assistants')
  const isAdmin = useSelector(isUserAdmin)
  const clientData = useSelector(getUserAuthData)
  const formFields = useSelector(getAssistantsCreateFormFields)
  const dispatch = useAppDispatch()

  const userId = isAdmin ? formFields?.userId : clientData?.id

  useEffect(() => {
    if (!isAdmin && clientData?.id && clientData.username) {
      const updateForm = {
        ...formFields,
        user: {
          id: clientData?.vpbx_user_id || clientData.id,
          name: clientData?.username
        },
        userId: clientData.id
      }
      dispatch(assistantsPageActions.updateAssistantsCreateForm(updateForm))
    }
  }, [clientData, dispatch, formFields, isAdmin])

  const onChangeToolsHandler = useCallback((
    event: any,
    value: Tool[]) => {
    const updatedFields = {
      ...formFields,
      tools: value
    }
    dispatch(assistantsPageActions.updateAssistantsCreateForm(updatedFields))
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
      dispatch(assistantsPageActions.updateAssistantsCreateForm(updateForm))
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
      dispatch(assistantsPageActions.updateAssistantsCreateForm(updateForm))
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
    dispatch(assistantsPageActions.updateAssistantsCreateForm(updatedFields))
  }

  const onTextChangeHandler = (field: keyof Assistant) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      const updatedFields = {
        ...formFields,
        [field]: value
      }
      dispatch(assistantsPageActions.updateAssistantsCreateForm(updatedFields))
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
                    data-testid={'AssistantCardCreate.temperature'}
                    value={formFields.temperature}
                />
                <Textarea
                    label={t('Ограничитель токенов') ?? ''}
                    onChange={onTextChangeHandler('max_response_output_tokens')}
                    data-testid={'AssistantCardCreate.max_response_output_tokens'}
                    value={formFields.max_response_output_tokens}
                />
                <Text text={'Синтез и распознавание речи'} bold />
                <Textarea
                    label={t('Модель распознавания речи') ?? ''}
                    onChange={onTextChangeHandler('input_audio_transcription_model')}
                    data-testid={'AssistantCardCreate.input_audio_transcription_model'}
                    value={formFields.input_audio_transcription_model}
                />
                <Textarea
                    label={t('Язык распознавания речи') ?? ''}
                    onChange={onTextChangeHandler('input_audio_transcription_language')}
                    data-testid={'AssistantCardCreate.input_audio_transcription_language'}
                    value={formFields.input_audio_transcription_language}
                />
                <Textarea
                    label={t('Модель синтеза речи') ?? ''}
                    onChange={onTextChangeHandler('output_audio_transcription_model')}
                    data-testid={'AssistantCardCreate.output_audio_transcription_model'}
                    value={formFields.output_audio_transcription_model}
                />
                <Text text={'Аудио потоки'} bold />
                <Textarea
                    label={t('Формат входящего аудио') ?? ''}
                    onChange={onTextChangeHandler('input_audio_format')}
                    data-testid={'AssistantCardCreate.input_audio_format'}
                    value={formFields.input_audio_format}
                />
                <Textarea
                    label={t('Формат исходящего аудио') ?? ''}
                    onChange={onTextChangeHandler('output_audio_format')}
                    data-testid={'AssistantCardCreate.output_audio_format'}
                    value={formFields.output_audio_format}
                />
                <Textarea
                    label={t('Тип определения шума (none, near_field, far_field)') ?? ''}
                    onChange={onTextChangeHandler('input_audio_noise_reduction')}
                    data-testid={'AssistantCardCreate.input_audio_noise_reduction'}
                    value={formFields.input_audio_noise_reduction}
                />
                <Text text={t('Автоматическое обнаружение голоса (VAD)')} bold />
                <Textarea
                    label={t('Тип VAD') ?? ''}
                    onChange={onTextChangeHandler('turn_detection_type')}
                    data-testid={'AssistantCardCreate.turn_detection_type'}
                    value={formFields.turn_detection_type}
                />
                <Textarea
                    label={t('Порог обнаружения голосовой активности, мс') ?? ''}
                    onChange={onTextChangeHandler('turn_detection_threshold')}
                    data-testid={'AssistantCardCreate.turn_detection_threshold'}
                    value={formFields.turn_detection_threshold}
                />
                <Textarea
                    label={t('Длительность включаемого в поток звука, мс') ?? ''}
                    onChange={onTextChangeHandler('turn_detection_prefix_padding_ms')}
                    data-testid={'AssistantCardCreate.turn_detection_prefix_padding_ms'}
                    value={formFields.turn_detection_prefix_padding_ms}
                />
                <Textarea
                    label={t('Продолжительность тишины, мс') ?? ''}
                    onChange={onTextChangeHandler('turn_detection_silence_duration_ms')}
                    data-testid={'AssistantCardCreate.turn_detection_silence_duration_ms'}
                    value={formFields.turn_detection_silence_duration_ms}
                />
                <Textarea
                    label={t('Семантический VAD(Auto, Low, Medium, High)') ?? ''}
                    onChange={onTextChangeHandler('semantic_eagerness')}
                    data-testid={'AssistantCardCreate.semantic_eagerness'}
                    value={formFields.semantic_eagerness}
                />
            </>
  )

  const createHandler = useCallback(() => {
    onCreate?.(formFields)
  }, [formFields, onCreate])

  return (
            <VStack
                gap={'8'}
                max
                className={classNames(cls.AssistantCreateCard, {}, [className])}
            >
                <AssistantCreateCardHeader onCreate={createHandler} variant={'diviner-top'}/>
                {isError
                  ? <ErrorGetData
                        title={t('Ошибка при создании ассистента') || ''}
                        text={
                            error && 'data' in error
                              ? String(t((error.data as { message: string }).message))
                              : String(t('Проверьте заполняемые поля и повторите ещё раз'))
                        }
                    />
                  : ''}
                <Card
                    max
                    padding={'16'}
                    border={'partial'}
                >
                    <VStack gap={'16'} max>
                        {isAdmin
                          ? <ClientSelect
                                value={formFields.user as ClientOptions}
                                onChangeClient={onChangeClientHandler}
                                label={String(t('Клиент'))}
                                className={cls.client}
                                data-testid={'AssistantCreateCard.ClientSelect'}
                            />
                          : <Text title={clientData?.name}/>
                        }
                        <Textarea
                            label={t('Наименование ассистента') ?? ''}
                            onChange={onTextChangeHandler('name')}
                            data-testid={'AssistantCardCreate.name'}
                            value={formFields.name}
                        />
                        <Text text={'Параметры LLM модели'} bold />
                        {isAdmin && IsAdminOptions}
                        <Textarea
                            label={t('Инструкции для ассистента') ?? ''}
                            onChange={onTextChangeHandler('instruction')}
                            data-testid={'AssistantCardCreate.instruction'}
                            value={formFields.instruction}
                            minRows={5}
                            multiline
                        />
                        <VoiceSelect
                            label={String(t('Голос'))}
                            value={formFields.voice || ''}
                            onChangeValue={onChangeSelectHandler('voice')}
                        />
                        <ToolsSelect
                            label={t('Функции') || ''}
                            userId={userId}
                            onChangeCask={onChangeToolsHandler}
                        />
                        <Textarea
                            label={t('Комментарий') ?? ''}
                            onChange={onTextChangeHandler('comment')}
                            data-testid={'AssistantCardCreate.comment'}
                            value={formFields.comment}
                        />
                    </VStack>
                </Card>
                <AssistantCreateCardHeader onCreate={createHandler} variant={'diviner-bottom'}/>
            </VStack>
  )
}
)
