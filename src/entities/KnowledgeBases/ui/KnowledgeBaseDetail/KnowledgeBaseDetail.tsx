import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './KnowledgeBaseDetail.module.scss'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { KnowledgeBase, KnowledgeDocument, SearchResult } from '../../model/types/knowledgeBase'
import { useNavigate } from 'react-router-dom'
import { getRouteKnowledgeBases } from '@/shared/const/router'
import {
  ArrowLeft,
  Upload,
  Link,
  FileText,
  Trash2,
  Search,
  Loader,
  CheckCircle,
  XCircle,
  Pencil
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  useDocuments,
  useUploadDocument,
  useAddUrl,
  useDeleteDocument,
  useDeleteKnowledgeBase,
  useLazySearchKnowledgeBase,
  useUpdateKnowledgeBase
} from '../../api/knowledgeBaseApi'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { KnowledgeBaseFormModal } from '../KnowledgeBaseFormModal/KnowledgeBaseFormModal'
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material'

interface KnowledgeBaseDetailProps {
  className?: string
  knowledgeBase: KnowledgeBase
}

export const KnowledgeBaseDetail = memo((props: KnowledgeBaseDetailProps) => {
  const { className, knowledgeBase } = props
  const { t } = useTranslation('knowledgeBases')
  const navigate = useNavigate()

  const { data: documents, refetch: refetchDocs } = useDocuments(knowledgeBase.id, {
    refetchOnMountOrArgChange: true
  })
  const [uploadDoc, { isLoading: isUploading }] = useUploadDocument()
  const [addUrlMutation, { isLoading: isAddingUrl }] = useAddUrl()
  const [deleteDoc] = useDeleteDocument()
  const [triggerSearch, { data: searchResults, isFetching: isSearching }] = useLazySearchKnowledgeBase()

  const [urlValue, setUrlValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [deleteKb] = useDeleteKnowledgeBase()

  // Polling for processing documents
  useEffect(() => {
    const hasProcessing = documents?.some((doc) => doc.status === 'processing')
    if (hasProcessing) {
      const interval = setInterval(() => {
        refetchDocs()
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [documents, refetchDocs])

  const onGoBack = useCallback(() => {
    navigate(getRouteKnowledgeBases())
  }, [navigate])

  const onFileSelect = useCallback(async (files: FileList | null) => {
    if (!files?.length) return
    for (let i = 0; i < files.length; i++) {
      await uploadDoc({ kbId: knowledgeBase.id, file: files[i] })
    }
  }, [knowledgeBase.id, uploadDoc])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    onFileSelect(e.dataTransfer.files)
  }, [onFileSelect])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const onDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const onAddUrl = useCallback(async () => {
    if (!urlValue.trim()) return
    await addUrlMutation({ kbId: knowledgeBase.id, url: urlValue.trim() })
    setUrlValue('')
  }, [urlValue, knowledgeBase.id, addUrlMutation])

  const onDeleteDocument = useCallback(async (docId: number) => {
    await deleteDoc({ kbId: knowledgeBase.id, docId })
  }, [knowledgeBase.id, deleteDoc])

  const onSearch = useCallback(() => {
    if (!searchQuery.trim()) return
    triggerSearch({ kbId: knowledgeBase.id, query: searchQuery.trim(), limit: 5 })
  }, [searchQuery, knowledgeBase.id, triggerSearch])

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle size={16} color="var(--success-redesigned)" />
      case 'processing':
        return <Loader size={16} className={cls.spinner} />
      case 'error':
        return <XCircle size={16} color="var(--error-redesigned)" />
      default:
        return null
    }
  }

  return (
    <VStack gap="24" max className={classNames(cls.KnowledgeBaseDetail, {}, [className])}>
      {/* Header */}
      <VStack gap="8" max className={cls.headerCard}>
        <HStack max justify="between" align="center" gap="16" wrap="wrap">
          <HStack gap="12" align="center">
            <HStack
              gap="4"
              align="center"
              className={cls.backBtn}
              onClick={onGoBack}
            >
              <ArrowLeft size={20} />
              <Text text={t('Назад')} size="s" />
            </HStack>
          </HStack>
          <HStack gap="8">
            <Button
              variant="glass-action"
              size="s"
              onClick={() => setIsEditOpen(true)}
              addonLeft={<Pencil size={14} />}
            >
              {t('Изменить')}
            </Button>
            <Button
              variant="glass-action"
              color="error"
              size="s"
              onClick={() => setShowDeleteConfirm(true)}
              addonLeft={<Trash2 size={14} />}
            >
              {t('Удалить')}
            </Button>
          </HStack>
        </HStack>

        <VStack gap="4">
          <Text title={knowledgeBase.name} size="l" bold />
          {knowledgeBase.description && (
            <Text text={knowledgeBase.description} size="s" variant="accent" />
          )}
        </VStack>
      </VStack>

      {/* Upload Zone */}
      <VStack
        gap="12"
        align="center"
        max
        className={classNames(cls.uploadZone, { [cls.dragOver]: dragOver })}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={32} />
        <Text text={t('Перетащите файл сюда или')} align="center" />
        <Button variant="glass-action" size="s" disabled={isUploading}>
          {isUploading ? t('Загрузка...') : t('Выбрать файл')}
        </Button>
        <Text text={t('Поддерживаемые форматы: PDF, DOCX, TXT, MD')} size="xs" variant="accent" align="center" />
        <Text text={t('Макс. размер: 10 МБ')} size="xs" variant="accent" align="center" />
        <input
          ref={fileInputRef}
          type="file"
          className={cls.uploadInput}
          accept=".pdf,.docx,.txt,.md"
          onChange={(e) => onFileSelect(e.target.files)}
        />
      </VStack>

      {/* URL Input */}
      <HStack gap="8" max align="center" wrap="wrap">
        <Link size={18} />
        <HStack gap="8" max className={cls.urlInput}>
          <Textarea
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder={t('Введите URL') ?? ''}
            size="small"
          />
        </HStack>
        <Button
          variant="glass-action"
          onClick={onAddUrl}
          disabled={isAddingUrl || !urlValue.trim()}
        >
          {t('Добавить URL')}
        </Button>
      </HStack>

      {/* Documents List */}
      <VStack gap="12" max className={cls.documentsSection}>
        <Text
          title={`${t('Документы')} (${documents?.length ?? 0})`}
          size="m"
          bold
        />
        {documents?.length
          ? (
            <VStack gap="8" max>
              {documents.map((doc) => (
                <VStack
                  key={doc.id}
                  max
                  gap="8"
                  className={cls.documentRow}
                >
                  <HStack max justify="between" align="center" gap="8">
                    <HStack gap="8" align="center" className={cls.docName}>
                      {doc.sourceUrl ? <Link size={16} /> : <FileText size={16} />}
                      <Text text={doc.sourceUrl ?? doc.fileName} size="s" bold />
                    </HStack>
                    <Button
                      variant="clear"
                      color="error"
                      onClick={() => onDeleteDocument(doc.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </HStack>
                  <HStack gap="16" align="center" wrap="wrap">
                    <Text text={formatFileSize(doc.fileSize)} size="xs" variant="accent" />
                    <Text text={`${doc.chunksCount} ${t('чанков')}`} size="xs" variant="accent" />
                    <HStack gap="4" align="center">
                      {getStatusIcon(doc.status)}
                      {doc.status === 'processing' && (
                        <Text text={t('Обработка...')} size="xs" variant="accent" />
                      )}
                      {doc.status === 'error' && doc.errorMessage && (
                        <Text text={doc.errorMessage} size="xs" variant="error" />
                      )}
                    </HStack>
                  </HStack>
                </VStack>
              ))}
            </VStack>
          )
          : (
            <Text text={t('Пока нет документов')} size="s" variant="accent" />
          )}
      </VStack>

      {/* Test Search */}
      <VStack gap="12" max className={cls.searchSection}>
        <Text title={t('Тестовый поиск')} size="m" bold />
        <HStack gap="8" max wrap="wrap">
          <HStack gap="8" max className={cls.urlInput}>
            <Textarea
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Введите вопрос для проверки...') ?? ''}
              size="small"
            />
          </HStack>
          <Button
            variant="glass-action"
            onClick={onSearch}
            disabled={isSearching || !searchQuery.trim()}
            addonLeft={<Search size={16} />}
          >
            {t('Искать')}
          </Button>
        </HStack>

        {searchResults && searchResults.length > 0 && (
          <VStack gap="8" max>
            {searchResults.map((result, index) => (
              <HStack key={index} gap="12" max align="start" className={cls.searchResult}>
                <Text
                  text={`${Math.round(result.similarity * 100)}%`}
                  className={cls.similarity}
                  size="s"
                />
                <Text text={result.content} size="s" />
              </HStack>
            ))}
          </VStack>
        )}

        {searchResults && searchResults.length === 0 && (
          <Text text={t('Релевантных результатов не найдено')} size="s" variant="accent" />
        )}
      </VStack>

      <KnowledgeBaseFormModal
        isOpen={isEditOpen}
        editingKb={knowledgeBase}
        onClose={() => setIsEditOpen(false)}
      />

      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        PaperProps={{
          sx: {
            background: 'var(--card-bg)',
            color: 'var(--text-redesigned)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--glass-border-subtle)'
          }
        }}
      >
        <DialogTitle>{t('Удалить базу знаний')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'var(--text-redesigned)', opacity: 0.8 }}>
            {t('Вы уверены? Все документы и данные будут удалены безвозвратно.')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="glass-action" onClick={() => setShowDeleteConfirm(false)}>
            {t('Отмена')}
          </Button>
          <Button
            variant="glass-action"
            color="error"
            onClick={async () => {
              await deleteKb(knowledgeBase.id)
              navigate(getRouteKnowledgeBases())
            }}
          >
            {t('Удалить')}
          </Button>
        </DialogActions>
      </Dialog>
    </VStack>
  )
})
