import { Fragment, ReactNode, useEffect, useState } from 'react'
import { Listbox as HListBox } from '@headlessui/react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { HStack } from '../../../../redesigned/Stack'
import { Button } from '../../../Button/Button'
import cls from './ListBox.module.scss'
import { DropdownDirection } from '@/shared/types/ui'
import { mapDirectionClass } from '../../styles/consts'
import popupCls from '../../styles/popup.module.scss'
import ArrowIcon from '@/shared/assets/icons/arrow-bottom.svg'
import CheckIcon from '@/shared/assets/icons/check.svg'
import { Icon } from '../../../Icon'

export interface ListBoxItem<T extends string> {
  value: T
  content: ReactNode
  disabled?: boolean
}

interface ListBoxProps<T extends string> {
  items?: Array<ListBoxItem<T>>
  className?: string
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  readonly?: boolean
  direction?: DropdownDirection
  label?: string
  multiple?: boolean
}

export function ListBox<T extends string> (props: ListBoxProps<T>) {
  const {
    className,
    items,
    value,
    defaultValue,
    onChange,
    readonly,
    direction = 'bottom-left',
    label,
    multiple
  } = props

  const optionsClasses = [mapDirectionClass[direction], popupCls.menu]

  const initItem = value ? value.split(',') as T[] : (items && items.length > 0 ? [items[0].value] : [])

  const [selectedItems, setSelectedItems] = useState<T[]>(initItem)

  useEffect(() => {
    const newSelectedItems = value ? (value.split(',') as T[]).filter(item => item !== defaultValue) : []
    setSelectedItems(newSelectedItems)
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
    return <>{values.join(', ')}</>
  }

  return (
        <HStack gap="4">
            {label && <span>{`${label}>`}</span>}
            <HListBox
                disabled={readonly}
                as="div"
                className={classNames(cls.ListBox, {}, [className, popupCls.popup])}
                value={selectedItems}
                onChange={handleOnChange}
                multiple={multiple}
            >
                <HListBox.Button as={'div'} className={cls.trigger}>
                    <Button disabled={readonly} variant="filled" addonRight={<Icon Svg={ArrowIcon}/>}>
                        {multiple && selectedItems.length > 0
                          ? (
                                <SelectedItems values={selectedItems}/>
                            )
                          : (
                              value || defaultValue
                            )}
                    </Button>
                </HListBox.Button>
                <HListBox.Options className={classNames(cls.options, {}, optionsClasses)}>
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
                                        [popupCls.selected]: selectedItems.includes(item.value)
                                      }
                                    )}
                                >
                                    {selected &&
                                        <Icon className={cls.checked} Svg={CheckIcon} width={'16'} height={'16'}/>
                                    }
                                    {selectedItems.includes(item.value) &&
                                        <Icon className={cls.checked} Svg={CheckIcon} width={'16'} height={'16'}/>
                                    }
                                    {item.value}
                                </li>
                            )}
                        </HListBox.Option>
                    ))}
                </HListBox.Options>
            </HListBox>
        </HStack>
  )
}
