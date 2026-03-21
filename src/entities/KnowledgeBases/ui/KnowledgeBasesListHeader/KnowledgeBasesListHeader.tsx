import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './KnowledgeBasesListHeader.module.scss'
import { memo } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Plus } from 'lucide-react'
import { SearchInput } from '@/shared/ui/mui/SearchInput'

interface KnowledgeBasesListHeaderProps {
  className?: string
  search?: string
  onChangeSearch?: (value: string) => void
  onCreateClick?: () => void
}

export const KnowledgeBasesListHeader = memo((props: KnowledgeBasesListHeaderProps) => {
  const { className, search, onChangeSearch, onCreateClick } = props
  const { t } = useTranslation('knowledgeBases')

  return (
    <VStack gap="16" max className={classNames(cls.KnowledgeBasesListHeader, {}, [className])}>
      <HStack max justify="between" align="center" gap="16" wrap="wrap">
        <VStack gap="4">
          <Text title={t('Базы знаний')} size="l" bold />
          <Text text={t('Управление базами знаний для ваших ассистентов')} size="s" variant="accent" />
        </VStack>

        <HStack gap="16" wrap="nowrap" className={cls.headerActions}>
          <SearchInput
            data-testid="KnowledgeBaseSearch"
            className={cls.searchInput}
            placeholder={t('Поиск') ?? ''}
            onChange={onChangeSearch}
            value={search}
            fullWidth={false}
          />

          <Button
            variant="outline"
            className={cls.createBtn}
            addonLeft={<Plus size={20} />}
            onClick={onCreateClick}
          >
            {t('Создать')}
          </Button>
        </HStack>
      </HStack>
    </VStack>
  )
})
