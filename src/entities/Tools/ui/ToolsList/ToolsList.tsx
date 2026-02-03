import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolsList.module.scss'
import React, { useCallback, useState, memo } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Tool, ToolsListProps } from '../../model/types/tools'
import { ToolsListHeader } from '../ToolsListHeader/ToolsListHeader'
import { ErrorGetData } from '../../../ErrorGetData'
import { ContentListItemSkeleton } from '../../../Content'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { ToolItem } from '../ToolItem/ToolItem'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { Button } from '@/shared/ui/redesigned/Button'
import { useDeleteTool } from '../../api/toolsApi'
import { Loader } from '@/shared/ui/Loader'
import { Icon } from '@/shared/ui/redesigned/Icon'
import SearchIcon from '@/shared/assets/icons/search.svg'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'

export const ToolsList = memo((props: ToolsListProps) => {
  const {
    className,
    isToolsError,
    isToolsLoading,
    tools,
    onRefetch
  } = props

  const { t } = useTranslation('tools')
  const [checkedBox, setCheckedBox] = useState<string[]>([])
  const [indeterminateBox, setIndeterminateBox] = useState<boolean>(false)

  const [deleteTool, { isLoading: isDeleting }] = useDeleteTool()

  const handleCheckChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setCheckedBox((prev) => {
      const currentIndex = prev.indexOf(value)
      const newChecked = [...prev]
      if (currentIndex === -1) {
        newChecked.push(value)
      } else {
        newChecked.splice(currentIndex, 1)
      }
      if (tools?.count) {
        setIndeterminateBox(newChecked.length > 0 && newChecked.length < tools.count)
      }
      return newChecked
    })
  }, [tools?.count])

  const handleCheckAll = useCallback(() => {
    if (indeterminateBox && tools?.count && checkedBox.length > 0) {
      setCheckedBox(tools.rows.map(tool => String(tool.id)))
      setIndeterminateBox(false)
    } else if (!indeterminateBox && tools?.count && checkedBox.length === 0) {
      setCheckedBox(tools.rows.map(tool => String(tool.id)))
      setIndeterminateBox(false)
    } else if (!indeterminateBox && checkedBox.length > 0) {
      setCheckedBox([])
    }
  }, [tools, checkedBox.length, indeterminateBox])

  const handleDeleteAll = useCallback(async () => {
    if (!window.confirm(t('Вы уверены, что хотите удалить выбранные функции?') || '')) return

    try {
      await Promise.all(checkedBox.map(id => deleteTool(id).unwrap()))
      toast.success(t('Выбранные функции успешно удалены'))
      setCheckedBox([])
      setIndeterminateBox(false)
    } catch (e) {
      toast.error(getErrorMessage(e))
    }
  }, [checkedBox, deleteTool, t])

  const getSkeletons = () => {
    return new Array(4)
      .fill(0)
      .map((_, index) => (
        <ContentListItemSkeleton className={cls.card} key={index} view={'BIG'} />
      ))
  }

  if (isToolsError) {
    return <ErrorGetData onRefetch={onRefetch} />
  }

  if (isDeleting) {
    return (
      <VStack gap="16" align="center" justify="center" className={cls.loader}>
        <Loader />
      </VStack>
    )
  }

  const checkedButtons = (
    <HStack
      gap="16"
      wrap="wrap"
      className={classNames('', {
        [cls.uncheckButtons]: checkedBox.length === 0,
        [cls.checkButton]: checkedBox.length > 0
      }, [])}
    >
      <Button variant="clear" onClick={handleDeleteAll}>
        <Text text={t('Удалить выбранные')} variant="error" />
      </Button>
    </HStack>
  )

  return (
    <VStack gap="16" max className={classNames(cls.ToolsList, {}, [className])}>
      <ToolsListHeader />

      <Card max className={cls.controlsCard} padding="0">
        <HStack wrap="nowrap" justify="between" align="center" max className={cls.controls}>
          <HStack gap="16">
            <Check
              className={classNames(cls.checkbox, {
                [cls.uncheck]: checkedBox.length === 0,
                [cls.check]: checkedBox.length > 0
              }, [])}
              indeterminate={indeterminateBox}
              checked={tools?.count ? checkedBox.length === tools.count : false}
              onChange={handleCheckAll}
            />
            {checkedBox.length > 0 ? (
              <HStack gap="16">
                <Text
                  text={t('Выбрано') + ': ' + String(checkedBox.length) + t(' из ') + String(tools?.count)}
                  bold
                />
                {checkedButtons}
              </HStack>
            ) : (
              <Text text={t('Всего') + ': ' + String(tools?.count || 0)} variant="accent" />
            )}
          </HStack>
        </HStack>
      </Card>

      {tools?.rows.length ? (
        <div className={cls.listWrapper}>
          {tools.rows.map((tool) => (
            <ToolItem
              key={tool.id}
              tool={tool}
              checkedItems={checkedBox}
              onChangeChecked={handleCheckChange}
            />
          ))}
        </div>
      ) : (
        <VStack justify="center" align="center" max className={cls.emptyState} gap="16">
          <Icon Svg={SearchIcon} width={48} height={48} />
          <Text align="center" text={t('Данные не найдены')} size="l" bold />
          <Text align="center" text={t('У вас пока нет активных функций')} />
        </VStack>
      )}

      {isToolsLoading && (
        <div className={cls.listWrapper}>
          {getSkeletons()}
        </div>
      )}
    </VStack>
  )
})
