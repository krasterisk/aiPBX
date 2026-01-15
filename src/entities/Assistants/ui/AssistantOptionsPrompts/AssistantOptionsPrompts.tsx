import { useTranslation } from 'react-i18next'
import React, { ChangeEvent, memo, useCallback, useState } from 'react'
import { Assistant } from '../../model/types/assistants'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { useSelector } from 'react-redux'
import { getAssistantFormData } from '../../model/selectors/assistantFormSelectors'
import { Button } from '@/shared/ui/redesigned/Button'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { Popover } from '@mui/material'
import { useGeneratePrompt } from '../../api/assistantsApi'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'

interface AssistantOptionsPromptsProps {
  className?: string
  onTextChangeHandler?: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export const AssistantOptionsPrompts = memo((props: AssistantOptionsPromptsProps) => {
  const {
    className,
    onTextChangeHandler
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
    if (!formFields?.id || !userPrompt.trim()) {
      return
    }

    try {
      const result = await generatePrompt({
        assistantId: formFields.id,
        prompt: userPrompt
      }).unwrap()

      if (result.success) {
        // Update the form fields with generated content
        if (result.greeting && onTextChangeHandler) {
          const greetingEvent = {
            target: { value: result.greeting }
          } as ChangeEvent<HTMLTextAreaElement>
          onTextChangeHandler('greeting')(greetingEvent)
        }

        if (result.instruction && onTextChangeHandler) {
          const instructionEvent = {
            target: { value: result.instruction }
          } as ChangeEvent<HTMLTextAreaElement>
          onTextChangeHandler('instruction')(instructionEvent)
        }

        toast.success(t('Промпты успешно сгенерированы') || 'Prompts generated successfully')
        setUserPrompt('')
        handleClosePopover()
      }
    } catch (e) {
      toast.error(getErrorMessage(e))
    }
  }, [formFields?.id, userPrompt, generatePrompt, onTextChangeHandler, t, handleClosePopover])

  const open = Boolean(anchorEl)

  return (
    <>
      <VStack max gap={'16'} className={className}>
        <HStack max justify={'end'} align={'end'}>
          <Button
            onClick={handleOpenPopover}
            variant={'clear'}
            disabled={!formFields?.id}
          >
            <HStack gap={'8'} align={'center'}>
              <AutoAwesomeIcon fontSize={'small'} />
              <span>{t('Сгенерировать')}</span>
            </HStack>
          </Button>
        </HStack>

        {/* <Textarea
          label={t('Приветственная фраза или инструкция') ?? ''}
          onChange={onTextChangeHandler?.('greeting')}
          data-testid={'AssistantCard.greeting'}
          value={formFields?.greeting || ''}
          minRows={5}
          multiline
          required
        /> */}
        <Textarea
          label={t('Инструкция для ассистента') ?? ''}
          onChange={onTextChangeHandler?.('instruction')}
          data-testid={'AssistantCard.instruction'}
          value={formFields?.instruction || ''}
          minRows={5}
          multiline
          required
        />
      </VStack>

      <Popover
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
      >
        <VStack gap={'16'} max style={{ padding: '16px', width: '320px', maxWidth: 'calc(100vw - 32px)' }}>
          <Textarea
            label={t('Что вы хотите чтобы сделал ассистент?') || ''}
            value={userPrompt}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setUserPrompt(e.target.value)}
            placeholder={t('Например: помощник для записи на приём к врачу') || ''}
            minRows={3}
            multiline
          />

          <HStack max justify={'end'} gap={'8'}>
            <Button
              onClick={handleGenerate}
              color={'success'}
              disabled={!userPrompt.trim() || isLoading}
              size={'m'}
            >
              {isLoading ? String(t('Генерация...')) : String(t('Сгенерировать'))}
            </Button>
          </HStack>
        </VStack>
      </Popover>
    </>
  )
})

