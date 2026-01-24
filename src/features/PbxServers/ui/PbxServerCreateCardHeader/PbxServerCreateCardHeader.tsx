import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServerCreateCardHeader.module.scss'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'
import { Card, CardVariant } from '@/shared/ui/redesigned/Card'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePbxServers } from '@/shared/const/router'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'

import { Button } from '@/shared/ui/redesigned/Button'

interface PbxServerCreateCardHeaderProps {
  className?: string
  onCreate?: () => void
  variant?: CardVariant
}

export const PbxServerCreateCardHeader = memo((props: PbxServerCreateCardHeaderProps) => {
  const {
    className,
    variant,
    onCreate
  } = props
  const { t } = useTranslation('pbx')

  const actions = (
    <HStack gap="8" justify="end" wrap="wrap">
      <Button
        variant="outline"
        color="success"
        onClick={onCreate}
        addonLeft={<SaveIcon />}
      >
        {t('Создать')}
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
    <Card
      className={classNames(cls.PbxServerCreateCardHeader, {}, [className])}
      variant={variant}
      padding={'8'}
      border={'partial'}
      max
    >
      {variant !== 'diviner-bottom'
        ? <HStack max justify={'between'} wrap={'wrap'} gap={'8'}>
          <Text title={t('Новый сервер')} />
          {actions}
        </HStack>
        : <HStack max justify={'end'} wrap={'wrap'}>
          {actions}
        </HStack>
      }
    </Card>
  )
})
