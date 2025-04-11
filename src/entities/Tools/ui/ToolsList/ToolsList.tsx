import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolsList.module.scss'
import React, { useCallback, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Tool, ToolsListProps } from '../../model/types/tools'
import { ToolsListHeader } from '../ToolsListHeader/ToolsListHeader'
import { ErrorGetData } from '../../../ErrorGetData'
import { ContentView, ContentListItemSkeleton } from '../../../Content'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { ToolItem } from '../Tooltem/ToolItem'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { Button } from '@/shared/ui/redesigned/Button'
import { useDeleteTool } from '../../api/toolsApi'
import { Loader } from '@/shared/ui/Loader'

export const ToolsList = (props: ToolsListProps) => {
  const {
    className,
    isToolsError,
    isToolsLoading,
    tools,
    target,
    view = 'BIG'
  } = props

  const { t } = useTranslation('tools')

  const [checkedBox, setCheckedBox] = useState<string[]>([])
  const [indeterminateBox, setIndeterminateBox] = useState<boolean>(false)

  const [toolDeleteMutation, { isError, isLoading }] = useDeleteTool()

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setIndeterminateBox(newChecked.length > 0 && newChecked.length < tools?.count)
      }
      return newChecked
    })
  }

  const handleCheckAll = useCallback(() => {
    if (indeterminateBox && tools?.count && checkedBox.length > 0) {
      setCheckedBox(tools?.rows.map(tool => String(tool.id)))
      setIndeterminateBox(false)
    }

    if (!indeterminateBox && tools?.count && checkedBox.length === 0) {
      setCheckedBox(tools?.rows.map(tool => String(tool.id)))
      setIndeterminateBox(false)
    }

    if (!indeterminateBox && checkedBox.length > 0) {
      setCheckedBox([])
    }
  }, [tools?.count, tools?.rows, checkedBox.length, indeterminateBox])

  const getSkeletons = (view: ContentView) => {
    return new Array(view === 'SMALL' ? 9 : 4)
      .fill(0)
      .map((item, index) => (
                <ContentListItemSkeleton className={cls.card} key={index} view={view}/>
      ))
  }

  const handlerDeleteAll = useCallback(() => {
    checkedBox.forEach(item => {
      toolDeleteMutation(item).unwrap()
    })
    setCheckedBox([])
    setIndeterminateBox(false)
  }, [toolDeleteMutation, checkedBox])

  if (isToolsError && isError) {
    return (
            <ErrorGetData/>
    )
  }

  if (isLoading) {
    return (
            <VStack gap={'16'} align={'center'} className={cls.loader}>
                <Loader/>
            </VStack>
    )
  }

  const checkedButtons = (
        <HStack
            gap={'16'}
            wrap={'wrap'}
            className={classNames('', {
              [cls.uncheckButtons]: checkedBox.length === 0,
              [cls.checkButton]: checkedBox.length > 0
            }, [])}
        >
            <Button
                variant={'clear'}
                onClick={handlerDeleteAll}
            >
                <Text text={t('Удалить выбранные')} variant={'error'}/>
            </Button>
        </HStack>
  )

  const renderContent = (tool: Tool) => {
    return (
            <ToolItem
                key={tool.id}
                tool={tool}
                checkedItems={checkedBox}
                onChangeChecked={handleCheckChange}
                view={view}
                target={target}
                className={cls.caskItem}
            />
    )
  }

  return (
        <VStack gap={'16'} max>
            <ToolsListHeader />
            <Card max className={classNames(cls.ToolsToolBar, {}, [className])}>
                <HStack wrap={'nowrap'} justify={'end'} gap={'24'}>
                    <Check
                        className={classNames(cls.ToolsList, {
                          [cls.uncheck]: checkedBox.length === 0,
                          [cls.check]: checkedBox.length > 0
                        }, [])}
                        indeterminate={indeterminateBox}
                        checked={checkedBox.length === tools?.count}
                        onChange={handleCheckAll}
                    />
                    {checkedButtons}
                    {
                        checkedBox.length > 0
                          ? <Text text={t('Выбрано') + ': ' + String(checkedBox.length) + t(' из ') + String(tools?.count)}/>
                          : <Text text={t('Всего') + ': ' + String(tools?.count || 0)}/>
                    }
                </HStack>
            </Card>

            {tools?.rows.length
              ? <HStack wrap={'wrap'} gap={'16'} align={'start'} max>
                    {tools.rows.map(renderContent)}
                </HStack>
              : <HStack
                    justify={'center'} max
                    className={classNames('', {}, [className, cls[view]])}
                >
                    <Text align={'center'} text={t('Данные не найдены')}/>
                </HStack>
            }
            {isToolsLoading && getSkeletons(view)}
        </VStack>
  )
}
