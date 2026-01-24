import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServerEditCardHeader.module.scss'
import { memo, useCallback } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import { Card, CardVariant } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePbxServers } from '@/shared/const/router'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'

interface PbxServerEditCardHeaderProps {
  className?: string
  onEdit?: () => void
  pbxServerId?: string
  error?: FetchBaseQueryError | SerializedError | undefined
  onDelete?: (id: string) => void
  variant?: CardVariant
}

export const PbxServerEditCardHeader = memo((props: PbxServerEditCardHeaderProps) => {
  const {
    className,
    pbxServerId,
    onEdit,
    onDelete,
    variant
  } = props
  const { t } = useTranslation('pbx')

  const deleteHandler = useCallback(() => {
    if (pbxServerId) {
      onDelete?.(pbxServerId)
    }
  }, [pbxServerId, onDelete])

  const actions = (
    <HStack gap="8" justify="end" wrap="wrap">
      {onDelete && (
        <Button
          variant="outline"
          color="error"
          onClick={deleteHandler}
          addonLeft={<DeleteIcon />}
        >
          {t('Удалить')}
        </Button>
      )}
      <Button
        variant="outline"
        color="success"
        onClick={onEdit}
        addonLeft={<SaveIcon />}
      >
        {t('Сохранить')}
      </Button>
      <AppLink to={getRoutePbxServers()}>
        <Button
          variant="outline"
          addonLeft={<CloseIcon />}
        >
          {t('Закрыть')}
        </Button>
      </AppLink>
    </HStack>
  )

  return (
    <HStack max justify={'between'} wrap={'wrap'} gap={'8'}>
      <Text title={t('Редактировать')} />
      {actions}
    </HStack>
  )
})
