import cls from './KnowledgeBaseFormModal.module.scss'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { KnowledgeBase } from '../../model/types/knowledgeBase'
import { useCreateKnowledgeBase, useUpdateKnowledgeBase } from '../../api/knowledgeBaseApi'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

interface KnowledgeBaseFormModalProps {
  isOpen: boolean
  editingKb: KnowledgeBase | null
  onClose: () => void
}

export const KnowledgeBaseFormModal = memo((props: KnowledgeBaseFormModalProps) => {
  const { isOpen, editingKb, onClose } = props
  const { t } = useTranslation('knowledgeBases')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const [createKb, { isLoading: isCreating }] = useCreateKnowledgeBase()
  const [updateKb, { isLoading: isUpdating }] = useUpdateKnowledgeBase()

  const isEdit = Boolean(editingKb)
  const isSubmitting = isCreating || isUpdating

  useEffect(() => {
    if (editingKb) {
      setName(editingKb.name)
      setDescription(editingKb.description ?? '')
    } else {
      setName('')
      setDescription('')
    }
  }, [editingKb, isOpen])

  const onSubmit = useCallback(async () => {
    if (!name.trim()) return

    if (isEdit && editingKb) {
      await updateKb({
        id: editingKb.id,
        name: name.trim(),
        description: description.trim() || undefined
      })
    } else {
      await createKb({
        name: name.trim(),
        description: description.trim() || undefined
      })
    }
    onClose()
  }, [name, description, isEdit, editingKb, createKb, updateKb, onClose])

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
        {isEdit ? t('Редактировать базу знаний') : t('Создать базу знаний')}
      </DialogTitle>
      <DialogContent sx={{ paddingTop: '12px !important' }}>
        <VStack gap="16" max className={cls.KnowledgeBaseFormModal}>
          <Textarea
            label={t('Название')}
            value={name}
            onChange={(e) => { setName(e.target.value) }}
            placeholder={t('Введите название') ?? ''}
            required
            autoFocus
          />
          <Textarea
            label={t('Описание')}
            value={description}
            onChange={(e) => { setDescription(e.target.value) }}
            placeholder={t('Введите описание') ?? ''}
            multiline
            minRows={3}
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
