import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServersList.module.scss'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { PbxServer, PbxServerListProps } from '../../model/types/pbxServers'
import { PbxServersListHeader } from '../PbxServersListHeader/PbxServersListHeader'
import { ErrorGetData } from '../../../ErrorGetData'
import { ContentListItemSkeleton } from '../../../Content'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { PbxServerItem } from '../PbxServerItem/PbxServerItem'
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

  const getSkeletons = () => {
    return new Array(4)
      .fill(0)
      .map((item, index) => (
        <ContentListItemSkeleton className={cls.card} key={index} view={'BIG'} />
      ))
  }

  if (isPbxServersError) {
    return (
      <ErrorGetData />
    )
  }

  const renderContent = (pbxServer: PbxServer) => {
    return (
      <PbxServerItem
        key={pbxServer.id}
        pbxServer={pbxServer}
        view={'BIG'}
        target={target}
        className={cls.caskItem}
      />
    )
  }

  return (
    <VStack gap={'16'} max className={classNames(cls.PbxServersList, {}, [className])}>
      <PbxServersListHeader />

      {pbxServers?.rows.length ? (
        <div className={cls.listWrapper}>
          {pbxServers.rows.map(renderContent)}
        </div>
      ) : (
        <VStack justify={'center'} align={'center'} max className={cls.emptyState} gap={'16'}>
          <Icon Svg={SearchIcon} width={48} height={48} />
          <Text align={'center'} text={t('Данные не найдены')} size={'l'} bold />
          <Text align={'center'} text={t('У вас пока нет АТС')} />
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
