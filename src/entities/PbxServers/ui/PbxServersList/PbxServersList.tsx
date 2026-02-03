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
import { Icon } from '@/shared/ui/redesigned/Icon'
import SearchIcon from '@/shared/assets/icons/search.svg'

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

  const handleCheckChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setCheckedBox((prev) => {
      const isChecked = prev.includes(value)
      const newChecked = isChecked
        ? prev.filter(id => id !== value)
        : [...prev, value]

      const totalCount = pbxServers?.rows.length || 0
      if (totalCount > 0) {
        setIndeterminateBox(newChecked.length > 0 && newChecked.length < totalCount)
      }
      return newChecked
    })
  }, [pbxServers?.rows.length])

  const handleCheckAll = useCallback(() => {
    const totalIds = pbxServers?.rows.map(pbx => String(pbx.id)) || []

    if (checkedBox.length === totalIds.length && totalIds.length > 0) {
      setCheckedBox([])
      setIndeterminateBox(false)
    } else {
      setCheckedBox(totalIds)
      setIndeterminateBox(false)
    }
  }, [pbxServers?.rows, checkedBox.length])

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
    <VStack gap={'16'} max className={classNames(cls.PbxServersList, {}, [className])}>
      <PbxServersListHeader />
      <Card max className={cls.controlsCard} padding={'0'}>
        <HStack wrap={'nowrap'} justify={'between'} align={'center'} max className={cls.controls}>
          <HStack gap={'16'}>
            <Check
              className={classNames(cls.checkbox, {
                [cls.uncheck]: checkedBox.length === 0,
                [cls.check]: checkedBox.length > 0
              }, [])}
              indeterminate={indeterminateBox}
              checked={pbxServers?.count ? checkedBox.length === pbxServers?.count : false}
              onChange={handleCheckAll}
            />
            {checkedBox.length > 0 ? (
              <HStack gap={'16'}>
                <Text
                  text={t('Выбрано') + ': ' + String(checkedBox.length) + t(' из ') + String(pbxServers?.count)}
                  bold
                />
                {checkedButtons}
              </HStack>
            ) : (
              <Text text={t('Всего') + ': ' + String(pbxServers?.count || 0)} variant={'accent'} />
            )}
          </HStack>
        </HStack>
      </Card>

      {pbxServers?.rows.length ? (
        <div className={cls.listWrapper}>
          {pbxServers.rows.map(renderContent)}
        </div>
      ) : (
        <VStack justify={'center'} align={'center'} max className={cls.emptyState} gap={'16'}>
          <Icon Svg={SearchIcon} width={48} height={48} />
          <Text align={'center'} text={t('Данные не найдены')} size={'l'} bold />
        </VStack>
      )}
      {isPbxServersLoading && (
        <div className={cls.listWrapper}>
          {getSkeletons()}
        </div>
      )}
    </VStack>
  )
}
