import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServersList.module.scss'
import React, { useCallback, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { PbxServer, PbxServerListProps } from '../../model/types/pbxServers'
import { PbxServersListHeader } from '../PbxServersListHeader/PbxServersListHeader'
import { ErrorGetData } from '../../../ErrorGetData'
import { ContentListItemSkeleton } from '../../../Content'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { PbxServerItem } from '../PbxServerItem/PbxServerItem'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { Button } from '@/shared/ui/redesigned/Button'
import { useDeletePbxServers } from '../../api/pbxServersApi'
import { Loader } from '@/shared/ui/Loader'

export const PbxServersList = (props: PbxServerListProps) => {
  const {
    className,
    isPbxServersError,
    isPbxServersLoading,
    pbxServers,
    target
  } = props

  const { t } = useTranslation('pbx')

  const [checkedBox, setCheckedBox] = useState<string[]>([])
  const [indeterminateBox, setIndeterminateBox] = useState<boolean>(false)

  const [pbxServerDeleteMutation, { isError, isLoading }] = useDeletePbxServers()

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
      if (pbxServers?.count) {
        setIndeterminateBox(newChecked.length > 0 && newChecked.length < pbxServers?.count)
      }
      return newChecked
    })
  }

  const handleCheckAll = useCallback(() => {
    if (indeterminateBox && pbxServers?.count && checkedBox.length > 0) {
      setCheckedBox(pbxServers?.rows.map(pbx => String(pbx.id)))
      setIndeterminateBox(false)
    }

    if (!indeterminateBox && pbxServers?.count && checkedBox.length === 0) {
      setCheckedBox(pbxServers?.rows.map(pbxServer => String(pbxServer.id)))
      setIndeterminateBox(false)
    }

    if (!indeterminateBox && checkedBox.length > 0) {
      setCheckedBox([])
    }
  }, [pbxServers?.count, pbxServers?.rows, checkedBox.length, indeterminateBox])

  const getSkeletons = () => {
    return new Array(4)
      .fill(0)
      .map((item, index) => (
        <ContentListItemSkeleton className={cls.card} key={index} view={'BIG'} />
      ))
  }

  const handlerDeleteAll = useCallback(() => {
    checkedBox.forEach(item => {
      pbxServerDeleteMutation(item).unwrap()
    })
    setCheckedBox([])
    setIndeterminateBox(false)
  }, [pbxServerDeleteMutation, checkedBox])

  if (isPbxServersError && isError) {
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

  const renderContent = (pbxServer: PbxServer) => {
    return (
      <PbxServerItem
        key={pbxServer.id}
        pbxServer={pbxServer}
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
      <PbxServersListHeader />
      <Card max className={classNames(cls.PbxServersList, {}, [className])}>
        <HStack wrap={'nowrap'} justify={'end'} gap={'24'}>
          <Check
            className={classNames(cls.PbxServersList, {
              [cls.uncheck]: checkedBox.length === 0,
              [cls.check]: checkedBox.length > 0
            }, [])}
            indeterminate={indeterminateBox}
            checked={checkedBox.length === pbxServers?.count}
            onChange={handleCheckAll}
          />
          {checkedButtons}
          {
            checkedBox.length > 0
              ? <Text text={t('Выбрано') + ': ' + String(checkedBox.length) + t(' из ') + String(pbxServers?.count)} />
              : <Text text={t('Всего') + ': ' + String(pbxServers?.count || 0)} />
          }
        </HStack>
      </Card>

      {pbxServers?.rows.length
        ? <HStack wrap={'wrap'} gap={'16'} align={'start'} max>
          {pbxServers.rows.map(renderContent)}
        </HStack>
        : <HStack
          justify={'center'} max
          className={classNames('', {}, [className, cls.BIG])}
        >
          <Text align={'center'} text={t('Данные не найдены')} />
        </HStack>
      }
      {isPbxServersLoading && getSkeletons()}
    </VStack>
  )
}
