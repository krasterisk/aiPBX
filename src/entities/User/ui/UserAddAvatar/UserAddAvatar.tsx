import { useTranslation } from 'react-i18next'
import { ChangeEvent, memo, useCallback, useEffect, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { AppImage } from '@/shared/ui/redesigned/AppImage'
import noUser from '../../../../shared/assets/icons/user-filled.svg'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Text } from '@/shared/ui/redesigned/Text'
import { Loader } from '@/shared/ui/Loader'
import { User } from '../../model/types/user'
import { useUpdateUser, useUploadAvatarUser } from '../../api/usersApi'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CloseIcon from '@mui/icons-material/Close'
import cls from './UserAddAvatar.module.scss'

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

  return (
    <Modal isOpen={show} onClose={onClose}>
      <VStack gap="24" align="center" className={cls.modalContent}>
        <button className={cls.closeIcon} onClick={handleOnClose} type="button">
          <CloseIcon fontSize="small" />
        </button>

        <Text title={user?.name} size="l" bold />

        <div className={cls.imageContainer}>
          {isLoading
            ? <VStack align="center" justify="center" className={cls.loaderWrap}><Loader /></VStack>
            : <AppImage
              width="100%"
              height={280}
              fallback={fallback}
              errorFallback={errorFallback}
              src={image}
              className={cls.avatarImage}
            />
          }
        </div>

        {isError && <Text text={t('Ошибка загрузки')} variant="error" />}

        <HStack gap="12" justify="center" max className={cls.actions}>
          <label className={cls.uploadBtn}>
            <CloudUploadIcon fontSize="small" />
            <span>{t('Добавить')}</span>
            <input
              type="file"
              accept="image/*"
              name="images[]"
              onChange={onChangeUserAvatarHandler}
              className={cls.hiddenInput}
            />
          </label>

          <button
            className={cls.deleteIconBtn}
            onClick={() => { handleUserClearAvatar(user as User) }}
            type="button"
          >
            <DeleteOutlineIcon fontSize="small" />
          </button>
        </HStack>
      </VStack>
    </Modal>
  )
})
