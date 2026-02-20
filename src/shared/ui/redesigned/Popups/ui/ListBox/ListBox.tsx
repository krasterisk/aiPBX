import { Fragment, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Listbox as HListBox } from '@headlessui/react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Button } from '../../../Button/Button'
import cls from './ListBox.module.scss'
import { DropdownDirection } from '@/shared/types/ui'
import { mapDirectionClass } from '../../styles/consts'
import popupCls from '../../styles/popup.module.scss'
import ArrowIcon from '@/shared/assets/icons/arrow-bottom.svg'
import CheckIcon from '@/shared/assets/icons/check.svg'
import { Icon } from '../../../Icon'
import { VStack } from '../../../Stack'
import { Portal } from '../../../Portal/Portal'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/react'

export interface ListBoxItem<T extends string> {
  value: T
  content: ReactNode
  disabled?: boolean
}

interface ListBoxProps<T extends string> {
  items?: Array<ListBoxItem<T>>
  className?: string
  value?: T[]
  defaultValue?: T
  onChange?: (value: T) => void
  readonly?: boolean
  direction?: DropdownDirection
  label?: string
  multiple?: boolean
}

export function ListBox<T extends string>(props: ListBoxProps<T>) {
  const { t } = useTranslation()
  const {
    className,
    items,
    value,
    defaultValue,
    onChange,
    readonly,
    direction: baseDirection = 'bottom-left',
    label,
    multiple
  } = props

  const [direction, _setDirection] = useState<DropdownDirection>(baseDirection)
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 })
    ],
    whileElementsMounted: autoUpdate,
  })

  const optionsClasses = [mapDirectionClass[direction], popupCls.menu]

  const initItem = value || (items && items.length > 0 ? [items[0].value] : [])

  const [selectedItems, setSelectedItems] = useState<T[]>(initItem)

  useEffect(() => {
    if (value) {
      setSelectedItems(value)
    }
  }, [defaultValue, value])

  const handleOnChange = (values: T[]) => {
    if (multiple) {
      setSelectedItems(values.filter(item => item !== defaultValue))
      onChange?.(values.join(',') as T)
    } else {
      setSelectedItems(values)
      onChange?.(values as unknown as T)
    }
  }

  const SelectedItems = ({ values }: { values: string[] }) => {
    if (!Array.isArray(values)) {
      return null
    }
    const itemsContent = values.map(val => {
      const item = items?.find(item => item.value === val)
      return item ? item.content : t('Клиент')
    }).filter(Boolean)

    return <>{itemsContent.join(', ')}</>
  }

  return (
    <VStack gap="4">
      {label && <span>{`${label}:`}</span>}
      <HListBox
        disabled={readonly}
        as="div"
        className={classNames(cls.ListBox, {}, [className, popupCls.popup])}
        value={selectedItems}
        onChange={handleOnChange}
        multiple={multiple}
      >
        {({ open }) => {
          if (open !== isOpen) {
            setIsOpen(open)
          }

          return (
            <>
              <HListBox.Button as={Fragment}>
                <Button
                  variant="filled"
                  addonRight={<Icon Svg={ArrowIcon} />}
                  disabled={readonly}
                  ref={refs.setReference}
                >
                  {selectedItems.length > 0
                    ? <SelectedItems values={selectedItems} />
                    : ''
                  }
                </Button>
              </HListBox.Button>
              {open && (
                <Portal>
                  <div ref={refs.setFloating} style={floatingStyles}>
                    <HListBox.Options
                      static
                      className={classNames(cls.options, {}, [...optionsClasses, 'popup-z-index'])}
                    >
                      {items?.map((item) => (
                        <HListBox.Option
                          key={item.value}
                          value={item.value}
                          disabled={item.disabled}
                          as={Fragment}
                        >
                          {({
                            active,
                            selected
                          }) => (
                            <li
                              className={classNames(
                                cls.item,
                                {
                                  [popupCls.active]: active,
                                  [popupCls.disabled]: item.disabled,
                                  [popupCls.selected]: selectedItems.length > 0 ? selectedItems.includes(item.value) : false
                                }
                              )}
                            >
                              {selected &&
                                <Icon className={cls.checked} Svg={CheckIcon} width={'16'} height={'16'} />
                              }
                              {selectedItems.length > 0 && selectedItems.includes(item.value) &&
                                <Icon className={cls.checked} Svg={CheckIcon} width={'16'} height={'16'} />
                              }
                              {item.content}
                            </li>
                          )}
                        </HListBox.Option>
                      ))}
                    </HListBox.Options>
                  </div>
                </Portal>
              )}
            </>
          )
        }}
      </HListBox>
    </VStack>
  )
}
