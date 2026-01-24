import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolEditCardHeader.module.scss'
import { memo, useCallback } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import { CardVariant } from '@/shared/ui/redesigned/Card'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteTools } from '@/shared/const/router'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'

interface ToolEditCardHeaderProps {
  className?: string
  onEdit?: () => void
  toolId?: string
  error?: FetchBaseQueryError | SerializedError | undefined
  onDelete?: (id: string) => void
  variant?: CardVariant
}

export const ToolEditCardHeader = memo((props: ToolEditCardHeaderProps) => {
  const {
    className,
    toolId,
    onEdit,
    onDelete,
    variant
  } = props
  const { t } = useTranslation('tools')

  const deleteHandler = useCallback(() => {
    if (toolId) {
      onDelete?.(toolId)
    }
  }, [toolId, onDelete])

  const actions = (
    <HStack gap="8" justify="end" wrap="wrap">
      {variant !== 'diviner-bottom' && onDelete &&
        <Button
          variant={'outline'}
          color={'error'}
          onClick={deleteHandler}
          addonLeft={<DeleteIcon />}
        >
          {t('Удалить')}
        </Button>
      }

      <Button
        variant={'outline'}
        color={'success'}
        onClick={onEdit}
        addonLeft={<SaveIcon />}
      >
        {t('Сохранить')}
      </Button>
      <AppLink
        to={getRouteTools()}
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
    <HStack max justify={'between'} wrap={'wrap'} gap={'8'} className={classNames(cls.ToolEditCardHeader, {}, [className])}>
      {variant !== 'diviner-bottom' && <Text title={t('Редактировать')} />}
      {actions}
    </HStack>
  )
})
