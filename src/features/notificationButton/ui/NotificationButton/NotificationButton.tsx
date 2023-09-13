import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './NotificationButton.module.scss'
import React, { memo, useCallback, useState } from 'react'
import { Popover as PopoverDeprecated } from '@/shared/ui/deprecated/Popups'
import { Button as ButtonDeprecated, ButtonTheme } from '@/shared/ui/deprecated/Button'
import { Icon as IconDeprecated } from '@/shared/ui/deprecated/Icon'
import NotificationIconDeprecated from '@/shared/assets/icons/notification-20-20.svg'
import NotificationIcon from '@/shared/assets/icons/notification.svg'
import { NotificationList } from '@/entities/Notification'
import { Drawer } from '@/shared/ui/redesigned/Drawer'
import { useDevice } from '@/shared/lib/hooks/useDevice/useDevice'
import { ToggleFeatures } from '@/shared/lib/features'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Popover } from '@/shared/ui/redesigned/Popups'

interface NotificationButtonProps {
  className?: string

}

export const NotificationButton = memo((props: NotificationButtonProps) => {
  const {
    className
  } = props
  const [isOpen, setIsOpen] = useState(false)

  const onOpenDrawer = useCallback(() => {
    setIsOpen(true)
  }, [])

  const onCloseDrawer = useCallback(() => {
    setIsOpen(false)
  }, [])

  const trigger = (
      <ToggleFeatures feature={'isAppRedesigned'}
                      on={
                          <Icon Svg={NotificationIcon} clickable onClick={onOpenDrawer} />
                      }
                      off={
                        <ButtonDeprecated onClick={onOpenDrawer} theme={ButtonTheme.CLEAR}>
                          <IconDeprecated Svg={NotificationIcon} inverted/>
                        </ButtonDeprecated>

                      }
      />
  )

  const isMobile = useDevice()

  return (
        <div>
            {isMobile
              ? <>
                    <ButtonDeprecated onClick={onOpenDrawer} theme={ButtonTheme.CLEAR}>
                        <IconDeprecated Svg={NotificationIconDeprecated} inverted/>
                    </ButtonDeprecated>
                    <Drawer isOpen={isOpen} onClose={onCloseDrawer}>
                        <NotificationList className={cls.notifications}/>
                    </Drawer>
                </>
              : <ToggleFeatures
                    feature={'isAppRedesigned'}
                    on={
                        <Popover
                            className={classNames(cls.NotificationButton, {}, [className])}
                            trigger={trigger}
                            direction="bottom-left"
                        >
                            <NotificationList className={cls.notifications}/>
                        </Popover>

                    }
                    off={
                        <PopoverDeprecated
                            className={classNames(cls.NotificationButton, {}, [className])}
                            trigger={trigger}
                            direction="bottom-left"
                        >
                            <NotificationList className={cls.notifications}/>
                        </PopoverDeprecated>
                    }
                />
            }

        </div>
  )
})
