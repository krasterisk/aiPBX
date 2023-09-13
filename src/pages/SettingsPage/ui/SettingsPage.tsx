import { classNames } from '@/shared/lib/classNames/classNames'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { UiDesignSwitcher } from '@/features/uiDesignSwitcher'

interface SettingsPageProps {
  className?: string
}

export const SettingsPage = memo((props: SettingsPageProps) => {
  const { className } = props
  const { t } = useTranslation()

  return (
        <Page className={classNames('', {}, [className])}>
            <VStack gap={'16'}>
                <Text text={t('Настройки пользователя')} />
                <UiDesignSwitcher />
            </VStack>
        </Page>
  )
})

export default SettingsPage
