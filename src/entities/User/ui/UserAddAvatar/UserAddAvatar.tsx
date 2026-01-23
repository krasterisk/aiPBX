import { useTranslation } from 'react-i18next'
import { ChangeEvent, memo, useCallback, useEffect, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { AppImage } from '@/shared/ui/redesigned/AppImage'
import noUser from '../../../../shared/assets/icons/user-filled.svg'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Text } from '@/shared/ui/redesigned/Text'
import { Loader } from '@/shared/ui/Loader'
import { Button as ButtonMui, styled } from '@mui/material'
import { User } from '../../model/types/user'
import { useUpdateUser, useUploadAvatarUser } from '../../api/usersApi'

interface UserAddAvatarProps {
  user?: User
  className?: string
  show: boolean
  onClose?: () => void
  onAvatarUploaded?: (avatar: string) => void
}

export const UserAddAvatar = memo((props: UserAddAvatarProps) => {
  const {
    user,
    show,
    onClose,
    onAvatarUploaded
  } = props

  const { t } = useTranslation('profile')

  const [image, setImage] = useState('')

  useEffect(() => {
    if (user?.avatar) {
      const initImage = user.avatar.startsWith('http') ? user.avatar : `${__STATIC__}/${user.avatar}`
      setImage(initImage)
    }
  }, [user?.avatar])

  const [userUpdateMutation] = useUpdateUser()
  const [uploadAvatarUser, { isError, isLoading }] = useUploadAvatarUser()

  const onChangeUserAvatarHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const formData = new FormData()
    if (file) {
      if (user?.id) {
        formData.append('id', user.id)
      }
      formData.append('image', file)
      uploadAvatarUser({ formData, id: user?.id })
        .unwrap()
        .then((res) => {
          if (res.avatar) {
            const initImage = res.avatar.startsWith('http') ? res.avatar : `${__STATIC__}/${res.avatar}`
            setImage(initImage)
            onAvatarUploaded?.(res.avatar)
          }
        })
    }
    // onClose?.(false)
  }, [uploadAvatarUser, user?.id, onAvatarUploaded])

  const handleUserClearAvatar = useCallback((data: User) => {
    if (data.id) {
      const updatedUser = {
        ...data,
        avatar: ''
      }
      userUpdateMutation(updatedUser).unwrap()
    }
    setImage('')
    onAvatarUploaded?.('')
  }, [userUpdateMutation, onAvatarUploaded])

  const handleOnClose = useCallback(() => {
    onClose?.()
  }, [onClose])

  const errorFallback = <Icon width={128} height={128} Svg={noUser} />
  const fallback = <Skeleton width={128} height={128} border={'50%'} />

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
  })

  const AddToAvatarButton = (
    <ButtonMui
      component="label"
      role={undefined}
      variant="text"
      size={'large'}
      tabIndex={-1}
    // startIcon={<Icon Svg={noUser} width={'50'} height={'50'}/>}
    >{t('Добавить')}
      <VisuallyHiddenInput
        type="file"
        multiple
        accept={'image/*'}
        name={'images[]'}
        onChange={onChangeUserAvatarHandler}
      />
    </ButtonMui>
  )

  return (
    <Modal isOpen={show} onClose={onClose}>
      <VStack gap={'24'} align={'center'}>
        <Text title={user?.name} />
        {isLoading
          ? <Loader />
          : <AppImage
            width={'100%'}
            height={300}
            fallback={fallback}
            errorFallback={errorFallback}
            src={image}
          />
        }
        {isError ? <Text text={t('Ошибка загрузки')} variant={'error'} /> : ''}
        {AddToAvatarButton}
        <HStack gap={'16'} justify={'start'}>
          <Button onClick={() => {
            handleUserClearAvatar(user as User)
          }} variant={'clear'}>
            {t('Убрать фото')}
          </Button>
          <Button onClick={handleOnClose} variant={'outline'} color={'error'}>
            {t('Закрыть')}
          </Button>
        </HStack>
      </VStack>
    </Modal>

  )
})
