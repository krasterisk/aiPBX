import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolCreateCardHeader.module.scss'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'
import { Card, CardVariant } from '@/shared/ui/redesigned/Card'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteTools } from '@/shared/const/router'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack } from '@/shared/ui/redesigned/Stack'

interface ToolCreateCardHeaderProps {
  className?: string
  onCreate?: () => void
  variant?: CardVariant
}

export const ToolCreateCardHeader = memo((props: ToolCreateCardHeaderProps) => {
  const {
    className,
    variant,
    onCreate
  } = props
  const { t } = useTranslation('tools')

  const headerButtons = (
        <HStack gap="8" align={'end'}>
            <AppLink to={getRouteTools()}>
                <Button
                    title={t('Закрыть') ?? ''}
                    variant={'outline'}
                    color={'error'}
                >
                    {t('Закрыть')}
                </Button>
            </AppLink>
            <Button
                title={t('Создать') ?? ''}
                variant={'outline'}
                color={'success'}
                onClick={onCreate}
            >
                {t('Создать')}
            </Button>
        </HStack>
  )

  return (
        <Card
            className={classNames(cls.ToolCreateCardHeader, {}, [className])}
            variant={variant}
            padding={'8'}
            border={'partial'}
            max
        >
            {variant !== 'diviner-bottom'
              ? <HStack max justify={'between'} wrap={'wrap'}>
                    <Text title={t('Новая функция')}/>
                    {headerButtons}
                </HStack>
              : <HStack max justify={'end'} wrap={'wrap'}>
                    {headerButtons}
                </HStack>
            }
        </Card>
  )
})
