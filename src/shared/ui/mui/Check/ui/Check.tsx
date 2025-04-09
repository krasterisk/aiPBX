import { memo } from 'react'
import { Checkbox, CheckboxProps, FormControlLabel } from '@mui/material'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from '../../Combobox/ui/Combobox.module.scss'

interface CheckProps extends CheckboxProps {
  className?: string
  label?: string

}

export const Check = memo((props: CheckProps) => {
  const {
    className,
    label,
    ...otherProps
  } = props

  return (
      <FormControlLabel
          label={label}
          control={<Checkbox
              className={classNames(cls.Check, {}, [className])}
              {...otherProps}
          />}
      />
  )
})
