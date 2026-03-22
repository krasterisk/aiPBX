import cls from './ChatFormModal.module.scss'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { Chat, CreateChatDto } from '../../model/types/chat'
import { useCreateChat, useUpdateChat } from '../../api/chatApi'
import { useToolsAll } from '@/entities/Tools'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Slider } from '@/shared/ui/mui/Slider/Slider'
import { Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel } from '@mui/material'

interface ChatFormModalProps {
  isOpen: boolean
  editingChat: Chat | null
  onClose: () => void
}

const MODEL_OPTIONS = ['qwen3:8b', 'llama3.1:8b', 'mistral', 'gemma3:12b']

export const ChatFormModal = memo((props: ChatFormModalProps) => {
  const { isOpen, editingChat, onClose } = props
  const { t } = useTranslation('aichat')

  const [name, setName] = useState('')
  const [model, setModel] = useState('qwen3:8b')
  const [temperature, setTemperature] = useState(0.7)
  const [instruction, setInstruction] = useState('')
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([])

  const [createChat, { isLoading: isCreating }] = useCreateChat()
  const [updateChat, { isLoading: isUpdating }] = useUpdateChat()
  const { data: tools, isLoading: toolsLoading } = useToolsAll(null)

  const isEdit = Boolean(editingChat)
  const isSubmitting = isCreating || isUpdating

  useEffect(() => {
    if (isOpen) {
      if (editingChat) {
        setName(editingChat.name || '')
        setModel(editingChat.model || 'qwen3:8b')
        setTemperature(parseFloat(editingChat.temperature) || 0.7)
        setInstruction(editingChat.instruction || '')
        setSelectedToolIds(editingChat.tools?.map(t => String(t.id)) || [])
      } else {
        setName('')
        setModel('qwen3:8b')
        setTemperature(0.7)
        setInstruction('')
        setSelectedToolIds([])
      }
    }
  }, [editingChat, isOpen])

  const onSubmit = useCallback(async () => {
    if (!name.trim()) return

    const data: CreateChatDto = {
      name: name.trim(),
      model,
      temperature: String(temperature),
      instruction: instruction.trim() || undefined,
      toolIds: selectedToolIds.length > 0 ? selectedToolIds : undefined
    }

    if (isEdit && editingChat) {
      await updateChat({ id: editingChat.id, ...data })
    } else {
      await createChat(data)
    }
    onClose()
  }, [name, model, temperature, instruction, selectedToolIds, isEdit, editingChat, createChat, updateChat, onClose])

  const handleToolToggle = useCallback((toolId: string) => {
    setSelectedToolIds(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    )
  }, [])

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          background: 'var(--card-bg)',
          color: 'var(--text-redesigned)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border-subtle)'
        }
      }}
    >
      <DialogTitle>
        {isEdit ? t('Редактировать чат') : t('Создать чат')}
      </DialogTitle>
      <DialogContent sx={{ paddingTop: '12px !important' }}>
        <VStack gap="16" max className={cls.ChatFormModal}>
          <Textarea
            label={t('Название')}
            value={name}
            onChange={(e) => { setName(e.target.value) }}
            placeholder={t('Введите название') ?? ''}
            required
            autoFocus
          />

          <Combobox
            freeSolo
            options={MODEL_OPTIONS}
            value={model}
            onInputChange={(_, value) => { setModel(value) }}
            label={t('Модель') ?? ''}
          />

          <VStack gap="8" max>
            <Text text={`${t('Температура')}: ${temperature.toFixed(1)}`} size="s" />
            <Slider
              value={temperature}
              onChange={(value: number) => { setTemperature(value) }}
              min={0}
              max={2}
              step={0.1}
            />
          </VStack>

          <Textarea
            label={t('Инструкция (System Prompt)')}
            value={instruction}
            onChange={(e) => { setInstruction(e.target.value) }}
            placeholder={t('Введите инструкцию') ?? ''}
            multiline
            minRows={3}
          />

          <VStack gap="8" max className={cls.toolsSection}>
            <Text text={t('Инструменты')} bold size="s" />

            {!toolsLoading && tools && tools.length > 0 && (
              <VStack gap="4" max className={cls.toolsList}>
                {tools.map((tool) => (
                  <FormControlLabel
                    key={tool.id}
                    control={
                      <Checkbox
                        checked={selectedToolIds.includes(String(tool.id))}
                        onChange={() => { handleToolToggle(String(tool.id!)) }}
                        size="small"
                        sx={{
                          color: 'var(--icon-redesigned)',
                          '&.Mui-checked': { color: 'var(--accent-redesigned)' }
                        }}
                      />
                    }
                    label={
                      <HStack gap="4" align="center">
                        <Text text={tool.name} size="s" />
                        {tool.description && (
                          <Text text={`— ${tool.description}`} size="xs" variant="accent" />
                        )}
                      </HStack>
                    }
                    sx={{
                      marginLeft: 0,
                      '& .MuiFormControlLabel-label': {
                        color: 'var(--text-redesigned)'
                      }
                    }}
                  />
                ))}
              </VStack>
            )}

            {!toolsLoading && (!tools || tools.length === 0) && (
              <Text text={t('Нет доступных инструментов')} size="s" variant="accent" />
            )}

            <Text
              text={t('Инструменты загружаются из раздела «Инструменты»')}
              size="xs"
              variant="accent"
            />
          </VStack>
        </VStack>
      </DialogContent>
      <DialogActions>
        <Button variant="glass-action" onClick={onClose} disabled={isSubmitting}>
          {t('Отмена')}
        </Button>
        <Button
          variant="glass-action"
          onClick={onSubmit}
          disabled={isSubmitting || !name.trim()}
        >
          {isEdit ? t('Сохранить') : t('Создать')}
        </Button>
      </DialogActions>
    </Dialog>
  )
})
