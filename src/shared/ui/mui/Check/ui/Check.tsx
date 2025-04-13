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

  const style = {
    color: 'var(--icon-redesigned)',
    '&.Mui-checked': {
      color: 'var(--icon-redesigned)'
    }
  }

  return (
      <FormControlLabel
          label={label}
          control={<Checkbox
              className={classNames(cls.Check, {}, [className])}
              sx={style}
              {...otherProps}
          />}
      />
  )
})
