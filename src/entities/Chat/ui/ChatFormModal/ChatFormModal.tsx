import cls from './ChatFormModal.module.scss'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { Chat, CreateChatDto } from '../../model/types/chat'
import { useCreateChat, useUpdateChat } from '../../api/chatApi'
import { ToolsSelect } from '@/entities/Tools'
import type { Tool } from '@/entities/Tools'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Slider } from '@/shared/ui/mui/Slider/Slider'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

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
  const [selectedTools, setSelectedTools] = useState<Tool[]>([])

  const [createChat, { isLoading: isCreating }] = useCreateChat()
  const [updateChat, { isLoading: isUpdating }] = useUpdateChat()

  const isEdit = Boolean(editingChat)
  const isSubmitting = isCreating || isUpdating

  useEffect(() => {
    if (isOpen) {
      if (editingChat) {
        setName(editingChat.name || '')
        setModel(editingChat.model || 'qwen3:8b')
        setTemperature(parseFloat(editingChat.temperature) || 0.7)
        setInstruction(editingChat.instruction || '')
        setSelectedTools(editingChat.tools || [])
      } else {
        setName('')
        setModel('qwen3:8b')
        setTemperature(0.7)
        setInstruction('')
        setSelectedTools([])
      }
    }
  }, [editingChat, isOpen])

  const onSubmit = useCallback(async () => {
    if (!name.trim()) return

    const toolIds = selectedTools.map(t => String(t.id)).filter(Boolean)
    const data: CreateChatDto = {
      name: name.trim(),
      model,
      temperature: String(temperature),
      instruction: instruction.trim() || undefined,
      toolIds: toolIds.length > 0 ? toolIds : undefined
    }

    if (isEdit && editingChat) {
      await updateChat({ id: editingChat.id, ...data })
    } else {
      await createChat(data)
    }
    onClose()
  }, [name, model, temperature, instruction, selectedTools, isEdit, editingChat, createChat, updateChat, onClose])

  const handleToolsChange = useCallback((_event: any, newValue: Tool[]) => {
    setSelectedTools(newValue)
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

          <ToolsSelect
            label={t('Инструменты') as string}
            value={selectedTools}
            onChangeTool={handleToolsChange}
            fullWidth
          />
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
