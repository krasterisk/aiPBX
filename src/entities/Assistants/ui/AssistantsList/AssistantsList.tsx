import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantsList.module.scss'
import React, { useCallback, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Assistant, AssistantsListProps } from '../../model/types/assistants'
import { AssistantsListHeader } from '../AssistantsListHeader/AssistantsListHeader'
import { ErrorGetData } from '../../../ErrorGetData'
import { ContentListItemSkeleton } from '../../../Content'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { AssistantItem } from '../AssistantItem/AssistantItem'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { Button } from '@/shared/ui/redesigned/Button'
import { useDeleteAssistant } from '../../api/assistantsApi'
import { Loader } from '@/shared/ui/Loader'

export const AssistantsList = (props: AssistantsListProps) => {
  const {
    className,
    isAssistantsError,
    isAssistantsLoading,
    assistants,
    target
  } = props

  const { t } = useTranslation('assistants')

  const [checkedBox, setCheckedBox] = useState<string[]>([])
  const [indeterminateBox, setIndeterminateBox] = useState<boolean>(false)

  const [assistantDeleteMutation, { isError, isLoading }] = useDeleteAssistant()

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
      if (assistants?.count) {
        setIndeterminateBox(newChecked.length > 0 && newChecked.length < assistants?.count)
      }
      return newChecked
    })
  }

  const handleCheckAll = useCallback(() => {
    if (indeterminateBox && assistants?.count && checkedBox.length > 0) {
      setCheckedBox(assistants?.rows.map(assistant => String(assistant.id)))
      setIndeterminateBox(false)
    }

    if (!indeterminateBox && assistants?.count && checkedBox.length === 0) {
      setCheckedBox(assistants?.rows.map(assistant => String(assistant.id)))
      setIndeterminateBox(false)
    }

    if (!indeterminateBox && checkedBox.length > 0) {
      setCheckedBox([])
    }
  }, [assistants?.count, assistants?.rows, checkedBox.length, indeterminateBox])

  const getSkeletons = () => {
    return new Array(4)
      .fill(0)
      .map((item, index) => (
        <ContentListItemSkeleton className={cls.card} key={index} view={'BIG'} />
      ))
  }

  const handlerDeleteAll = useCallback(() => {
    checkedBox.forEach(item => {
      assistantDeleteMutation(item).unwrap()
    })
    setCheckedBox([])
    setIndeterminateBox(false)
  }, [assistantDeleteMutation, checkedBox])

  if (isAssistantsError && isError) {
    return (
      <ErrorGetData />
    )
  }

  if (isLoading) {
    return (
      <VStack gap={'16'} align={'center'} className={cls.loader}>
        <Loader />
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
        <Text text={t('Удалить выбранные')} variant={'error'} />
      </Button>
    </HStack>
  )

  const renderContent = (assistant: Assistant) => {
    return (
      <AssistantItem
        key={assistant.id}
        assistant={assistant}
        checkedItems={checkedBox}
        onChangeChecked={handleCheckChange}
        view={'BIG'}
        target={target}
        className={cls.caskItem}
      />
    )
  }

  return (
    <VStack gap={'16'} max>
      <AssistantsListHeader />
      <Card max className={cls.controlsCard} padding={'0'}>
        <HStack wrap={'nowrap'} justify={'between'} align={'center'} max className={cls.controls}>
          <HStack gap={'16'}>
            <Check
              className={classNames(cls.checkbox, {
                [cls.uncheck]: checkedBox.length === 0,
                [cls.check]: checkedBox.length > 0
              }, [])}
              indeterminate={indeterminateBox}
              checked={assistants?.count ? checkedBox.length === assistants?.count : false}
              onChange={handleCheckAll}
            />
            {checkedBox.length > 0 ? (
              <HStack gap={'16'}>
                <Text
                  text={t('Выбрано') + ': ' + String(checkedBox.length) + t(' из ') + String(assistants?.count)}
                  bold
                />
                {checkedButtons}
              </HStack>
            ) : (
              <Text text={t('Всего') + ': ' + String(assistants?.count || 0)} variant={'accent'} />
            )}
          </HStack>
        </HStack>
      </Card>

      {assistants?.rows.length
        ? <HStack wrap={'wrap'} gap={'16'} align={'start'} max>
          {assistants.rows.map(renderContent)}
        </HStack>
        : <HStack
          justify={'center'} max
          className={classNames('', {}, [className, cls.BIG])}
        >
          <Text align={'center'} text={t('Данные не найдены')} />
        </HStack>
      }
      {isAssistantsLoading && getSkeletons()}
    </VStack>
  )
}
