import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PageError.module.scss'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { memo } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface PageErrorProps {
  className?: string
}

export const PageError = memo(({ className }: PageErrorProps) => {
  const { t } = useTranslation()

  const reloadPage = () => {
    window.location.reload()
  }

  return (
    <div className={classNames(cls.PageError, {}, [className])}>
      <VStack gap="24" align="center" className={cls.card}>
        <div className={cls.iconWrapper}>
          <AlertTriangle size={32} />
        </div>
        <VStack gap="8" align="center">
          <Text
            title={t('Произошла непредвиденная ошибка')}
            bold
            size="l"
            align="center"
          />
          <Text
            text={t('Попробуйте обновить страницу')}
            size="s"
            align="center"
            className={cls.hint}
          />
        </VStack>
        <Button
          variant="glass-action"
          onClick={reloadPage}
          addonLeft={<RefreshCw size={16} />}
        >
          {t('Обновить')}
        </Button>
      </VStack>
    </div>
  )
})
