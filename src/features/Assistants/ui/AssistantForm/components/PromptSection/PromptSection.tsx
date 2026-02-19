import { memo, useCallback, ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { Assistant } from '@/entities/Assistants/model/types/assistants'
import { getAssistantFormData } from '@/entities/Assistants/model/selectors/assistantFormSelectors'
import { useGeneratePrompt } from '@/entities/Assistants/api/assistantsApi'
import { Popover } from '@mui/material'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import cls from './PromptSection.module.scss'

interface PromptSectionProps {
    className?: string
    onChangeTextHandler?: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export const PromptSection = memo((props: PromptSectionProps) => {
    const {
        className,
        onChangeTextHandler
    } = props

    const { t } = useTranslation('assistants')
    const formFields = useSelector(getAssistantFormData)
    const [generatePrompt, { isLoading }] = useGeneratePrompt()

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const [userPrompt, setUserPrompt] = useState('')

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }, [])

    const handleClosePopover = useCallback(() => {
        setAnchorEl(null)
    }, [])

    const handleGenerate = useCallback(async () => {
        if (!userPrompt.trim()) {
            return
        }

        try {
            const result = await generatePrompt({
                prompt: userPrompt
            }).unwrap()

            if (result.success) {
                if (result.instruction && onChangeTextHandler) {
                    const instructionEvent = {
                        target: { value: result.instruction }
                    } as ChangeEvent<HTMLTextAreaElement>
                    onChangeTextHandler('instruction')(instructionEvent)
                }

                toast.success(t('Промпты успешно сгенерированы') || 'Prompts generated successfully')
                setUserPrompt('')
                handleClosePopover()
            }
        } catch (e) {
            // Error toast handled by global toastMiddleware
        }
    }, [userPrompt, generatePrompt, onChangeTextHandler, t, handleClosePopover])

    const open = Boolean(anchorEl)
    const popoverId = open ? 'prompt-generator-popover' : undefined

    return (
        <>
            <div className={classNames(cls.PromptSection, {}, [className])}>
                <HStack max justify="between" align="center" wrap={'wrap'} className={cls.promptHeader}>
                    <Text
                        title={t('Системные инструкции')}
                        className={cls.sectionTitle}
                        bold
                    />

                    <Button
                        aria-describedby={popoverId}
                        onClick={handleOpenPopover}
                        variant="clear"
                        size="m"
                        className={cls.generateBtn}
                        addonLeft={<AutoAwesomeIcon fontSize="small" />}
                    >
                        {t('Сгенерировать')}
                    </Button>
                </HStack>

                <Textarea
                    label={t('Инструкция для ассистента') ?? ''}
                    onChange={onChangeTextHandler?.('instruction')}
                    data-testid="AssistantForm.instruction"
                    value={formFields?.instruction || ''}
                    placeholder={t('Введите системный промпт для ассистента...') ?? ''}
                    minRows={20}
                    multiline
                    required
                    className={cls.promptTextarea}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'var(--light-bg-redesigned)',
                            '&:hover': {
                                backgroundColor: 'var(--bg-redesigned)',
                            },
                            '&.Mui-focused': {
                                backgroundColor: 'var(--bg-redesigned)',
                            },
                        },
                    }}
                />
            </div>

            {/* AI Generator Popover */}
            <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                className={cls.popover}
            >
                <VStack gap="16" max className={cls.popoverContent}>
                    <Text
                        text={t('Генератор промпта')}
                        bold
                    />

                    <Textarea
                        label={t('Задача ассистента') || ''}
                        value={userPrompt}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setUserPrompt(e.target.value)}
                        placeholder={t('Например: помощник для записи на приём к врачу') || ''}
                        minRows={3}
                        multiline
                    />

                    <HStack max justify="end" gap="8">
                        <Button
                            onClick={handleClosePopover}
                            variant="clear"
                            size="m"
                        >
                            {t('Отмена')}
                        </Button>
                        <Button
                            onClick={handleGenerate}
                            variant="outline"
                            disabled={!userPrompt.trim() || isLoading}
                            size="m"
                        >
                            {isLoading ? String(t('Генерация...')) : String(t('Сгенерировать'))}
                        </Button>
                    </HStack>
                </VStack>
            </Popover>
        </>
    )
})
