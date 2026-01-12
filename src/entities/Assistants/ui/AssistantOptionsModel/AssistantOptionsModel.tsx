import { useTranslation } from 'react-i18next'
import React, { ChangeEvent, memo } from 'react'
import { useSelector } from 'react-redux'

import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Assistant } from '../../model/types/assistants'
import { ModelSelect } from '../ModelSelect/ModelSelect'
import { getAssistantFormData } from '../../model/selectors/assistantFormSelectors'

interface AssistantOptionsModelProps {
  className?: string
  onTextChangeHandler?: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onChangeSelectHandler?: (field: keyof Assistant) => (event: any, newValue: string) => void
}

export const AssistantOptionsModel = memo((props: AssistantOptionsModelProps) => {
  const {
    className,
    onTextChangeHandler,
    onChangeSelectHandler
  } = props

  const { t } = useTranslation('assistants')
  const formFields = useSelector(getAssistantFormData)

  return (
        <VStack max gap={'16'} className={className}>
            <ModelSelect
                label={String(t('Модель'))}
                value={formFields?.model || ''}
                onChangeValue={onChangeSelectHandler?.('model')}
            />
            <Textarea
                label={t('Температура') ?? ''}
                onChange={onTextChangeHandler?.('temperature')}
                data-testid={'AssistantCard.temperature'}
                value={formFields?.temperature || ''}
            />
            <Textarea
                label={t('Ограничитель токенов') ?? ''}
                onChange={onTextChangeHandler?.('max_response_output_tokens')}
                data-testid={'AssistantCard.max_response_output_tokens'}
                value={formFields?.max_response_output_tokens || ''}
            />
            <Text text={'Синтез и распознавание речи'} bold/>
            <Textarea
                label={t('Модель распознавания речи') ?? ''}
                onChange={onTextChangeHandler?.('input_audio_transcription_model')}
                data-testid={'AssistantCardCreate.input_audio_transcription_model'}
                value={formFields?.input_audio_transcription_model || ''}
            />
            <Textarea
                label={t('Язык распознавания речи') ?? ''}
                onChange={onTextChangeHandler?.('input_audio_transcription_language')}
                data-testid={'AssistantCard.input_audio_transcription_language'}
                value={formFields?.input_audio_transcription_language || ''}
            />
            <Textarea
                label={t('Модель синтеза речи') ?? ''}
                onChange={onTextChangeHandler?.('output_audio_transcription_model')}
                data-testid={'AssistantCard.output_audio_transcription_model'}
                value={formFields?.output_audio_transcription_model || ''}
            />
            <Text text={'Аудио потоки'} bold/>
            <Textarea
                label={t('Формат входящего аудио') ?? ''}
                onChange={onTextChangeHandler?.('input_audio_format')}
                data-testid={'AssistantCard.input_audio_format'}
                value={formFields?.input_audio_format || ''}
            />
            <Textarea
                label={t('Формат исходящего аудио') ?? ''}
                onChange={onTextChangeHandler?.('output_audio_format')}
                data-testid={'AssistantCardCreate.output_audio_format'}
                value={formFields?.output_audio_format || ''}
            />
            <Textarea
                label={t('Тип определения шума (none, near_field, far_field)') ?? ''}
                onChange={onTextChangeHandler?.('input_audio_noise_reduction')}
                data-testid={'AssistantCardCreate.input_audio_noise_reduction'}
                value={formFields?.input_audio_noise_reduction || ''}
            />
            <Text text={t('Автоматическое обнаружение голоса (VAD)')} bold/>
            <Textarea
                label={t('Тип VAD') ?? ''}
                onChange={onTextChangeHandler?.('turn_detection_type')}
                data-testid={'AssistantCardCreate.turn_detection_type'}
                value={formFields?.turn_detection_type || ''}
            />
            <Textarea
                label={t('Порог обнаружения голосовой активности, мс') ?? ''}
                onChange={onTextChangeHandler?.('turn_detection_threshold')}
                data-testid={'AssistantCardCreate.turn_detection_threshold'}
                value={formFields?.turn_detection_threshold || ''}
            />
            <Textarea
                label={t('Длительность включаемого в поток звука, мс') ?? ''}
                onChange={onTextChangeHandler?.('turn_detection_prefix_padding_ms')}
                data-testid={'AssistantCardCreate.turn_detection_prefix_padding_ms'}
                value={formFields?.turn_detection_prefix_padding_ms || ''}
            />
            <Textarea
                label={t('Продолжительность тишины, мс') ?? ''}
                onChange={onTextChangeHandler?.('turn_detection_silence_duration_ms')}
                data-testid={'AssistantCardCreate.turn_detection_silence_duration_ms'}
                value={formFields?.turn_detection_silence_duration_ms || ''}
            />
            <Textarea
                label={t('Продолжительность простоя, мс') ?? ''}
                onChange={onTextChangeHandler?.('idle_timeout_ms')}
                data-testid={'AssistantCardCreate.idle_timeout_ms'}
                value={formFields?.idle_timeout_ms || ''}
            />
            <Textarea
                label={t('Семантический VAD(Auto, Low, Medium, High)') ?? ''}
                onChange={onTextChangeHandler?.('semantic_eagerness')}
                data-testid={'AssistantCardCreate.semantic_eagerness'}
                value={formFields?.semantic_eagerness || ''}
            />
        </VStack>
  )
})
