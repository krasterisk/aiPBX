import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantEditCardHeader.module.scss'
import { memo, useCallback } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteAssistants } from '@/shared/const/router'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'

interface AssistantEditCardHeaderProps {
  className?: string
  onEdit?: () => void
  assistantId?: string
  assistantName?: string
  error?: FetchBaseQueryError | SerializedError | undefined
  onDelete?: (id: string) => void
}

export const AssistantEditCardHeader = memo((props: AssistantEditCardHeaderProps) => {
  const {
    className,
    assistantId,
    assistantName,
    onEdit,
    onDelete
  } = props
  const { t } = useTranslation('assistants')

  const deleteHandler = useCallback(() => {
    if (assistantId) {
      onDelete?.(assistantId)
    }
  }, [assistantId, onDelete])

  const actions = (
    <HStack gap="8" justify="end" wrap="wrap">
      {onDelete && (
        <Button
          variant={'outline'}
          color={'error'}
          onClick={deleteHandler}
          addonLeft={<DeleteIcon />}
        >
          {t('Удалить')}
        </Button>
      )}
      <Button
        variant={'outline'}
        color={'success'}
        onClick={onEdit}
        addonLeft={<SaveIcon />}
      >
        {t('Сохранить')}
      </Button>
      <AppLink
        to={getRouteAssistants()}
      >
        <Button
          variant={'outline'}
          addonLeft={<CloseIcon />}
        >
          {t('Закрыть')}
        </Button>
      </AppLink>
    </HStack>
  )

  return (
    <HStack max justify={'between'} wrap={'wrap'} gap={'8'} className={classNames(cls.AssistantEditCardHeader, {}, [className])}>
      <Text title={assistantName || t('Редактировать')} />
      {actions}
    </HStack>
  )
})
