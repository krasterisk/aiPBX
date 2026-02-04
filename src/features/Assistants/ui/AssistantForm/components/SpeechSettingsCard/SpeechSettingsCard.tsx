import { memo, ChangeEvent, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { isUserAdmin } from '@/entities/User'
import { Assistant } from '@/entities/Assistants/model/types/assistants'
import { getAssistantFormData } from '@/entities/Assistants/model/selectors/assistantFormSelectors'
import { Collapse, IconButton } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SettingsIcon from '@mui/icons-material/Settings'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import cls from './SpeechSettingsCard.module.scss'

interface SpeechSettingsCardProps {
    className?: string
    onChangeTextHandler?: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export const SpeechSettingsCard = memo((props: SpeechSettingsCardProps) => {
    const {
        className,
        onChangeTextHandler
    } = props

    const { t } = useTranslation('assistants')
    const isAdmin = useSelector(isUserAdmin)
    const formFields = useSelector(getAssistantFormData)
    const [expanded, setExpanded] = useState(false)

    const handleExpandClick = useCallback(() => {
        setExpanded((prev) => !prev)
    }, [])

    if (!isAdmin) {
        return null
    }

    return (
        <div className={classNames(cls.SpeechSettingsCard, {}, [className])}>
            <HStack
                max
                justify="between"
                align="center"
                className={cls.header}
                onClick={handleExpandClick}
            >
                <HStack gap="8" align="center">
                    <AdminPanelSettingsIcon className={cls.adminIcon} fontSize="small" />
                    <Text
                        title={t('Расширенные настройки')}
                        className={cls.cardTitle}
                        bold
                    />
                </HStack>

                <IconButton
                    className={classNames(cls.expandButton, { [cls.expanded]: expanded })}
                    aria-expanded={expanded}
                    aria-label="показать больше"
                    size="small"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </HStack>

            <Text
                text={t('Доступно только администраторам')}
                className={cls.adminHint}
                size="s"
            />

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <VStack max gap="16" className={cls.content}>
                    {/* Model Parameters Section */}
                    <div className={cls.section}>
                        <HStack gap="8" align="center" className={cls.sectionHeader}>
                            <SettingsIcon className={cls.sectionIcon} fontSize="small" />
                            <Text
                                text={t('Параметры модели')}
                                className={cls.sectionTitle}
                                bold
                            />
                        </HStack>

                        <VStack max gap="12">
                            <Textarea
                                label={t('Максимальное количество токенов в ответе') ?? ''}
                                onChange={onChangeTextHandler?.('max_response_output_tokens')}
                                data-testid="AssistantForm.max_response_output_tokens"
                                value={formFields?.max_response_output_tokens || ''}
                                minRows={1}
                                placeholder="4096/inf"
                            />
                        </VStack>
                    </div>

                    {/* Speech Synthesis & Recognition Section */}
                    <div className={cls.section}>
                        <HStack gap="8" align="center" className={cls.sectionHeader}>
                            <Text
                                text={t('Синтез и распознавание речи')}
                                className={cls.sectionTitle}
                                bold
                            />
                        </HStack>

                        <VStack max gap="12">
                            <Textarea
                                label={t('Модель распознавания речи') ?? ''}
                                onChange={onChangeTextHandler?.('input_audio_transcription_model')}
                                data-testid="AssistantForm.input_audio_transcription_model"
                                value={formFields?.input_audio_transcription_model || ''}
                                minRows={1}
                            />

                            <Textarea
                                label={t('Язык распознавания речи') ?? ''}
                                onChange={onChangeTextHandler?.('input_audio_transcription_language')}
                                data-testid="AssistantForm.input_audio_transcription_language"
                                value={formFields?.input_audio_transcription_language || ''}
                                minRows={1}
                            />

                            <Textarea
                                label={t('Модель синтеза речи') ?? ''}
                                onChange={onChangeTextHandler?.('output_audio_transcription_model')}
                                data-testid="AssistantForm.output_audio_transcription_model"
                                value={formFields?.output_audio_transcription_model || ''}
                                minRows={1}
                            />
                        </VStack>
                    </div>

                    {/* Audio Streams Section */}
                    <div className={cls.section}>
                        <Text
                            text={t('Аудио потоки')}
                            className={cls.sectionTitle}
                            bold
                        />

                        <VStack max gap="12">
                            <Textarea
                                label={t('Формат входящего аудио') ?? ''}
                                onChange={onChangeTextHandler?.('input_audio_format')}
                                data-testid="AssistantForm.input_audio_format"
                                value={formFields?.input_audio_format || ''}
                                minRows={1}
                            />

                            <Textarea
                                label={t('Формат исходящего аудио') ?? ''}
                                onChange={onChangeTextHandler?.('output_audio_format')}
                                data-testid="AssistantForm.output_audio_format"
                                value={formFields?.output_audio_format || ''}
                                minRows={1}
                            />

                            <Textarea
                                label={t('Тип определения шума (none, near_field, far_field)') ?? ''}
                                onChange={onChangeTextHandler?.('input_audio_noise_reduction')}
                                data-testid="AssistantForm.input_audio_noise_reduction"
                                value={formFields?.input_audio_noise_reduction || ''}
                                minRows={1}
                            />
                        </VStack>
                    </div>

                    {/* Advanced VAD Section */}
                    <div className={cls.section}>
                        <Text
                            text={t('Автоматическое обнаружение голоса (VAD)')}
                            className={cls.sectionTitle}
                            bold
                        />

                        <VStack max gap="12">
                            <Textarea
                                label={t('Тип VAD') ?? ''}
                                onChange={onChangeTextHandler?.('turn_detection_type')}
                                data-testid="AssistantForm.turn_detection_type"
                                value={formFields?.turn_detection_type || ''}
                                minRows={1}
                            />

                            <Textarea
                                label={t('Семантический VAD') ?? ''}
                                onChange={onChangeTextHandler?.('semantic_eagerness')}
                                data-testid="AssistantForm.semantic_eagerness"
                                value={formFields?.semantic_eagerness || ''}
                                minRows={1}
                            />
                        </VStack>
                    </div>
                </VStack>
            </Collapse>
        </div>
    )
})
