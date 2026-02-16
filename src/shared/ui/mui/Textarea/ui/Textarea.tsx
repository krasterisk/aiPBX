import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Textarea.module.scss'
import { memo } from 'react'
import { TextField, TextFieldProps } from '@mui/material'

// Используем тип вместо интерфейса
type TextAreaProps = TextFieldProps & {
  className?: string
}

const areaStyles = {
  // '& .MuiInputBase-root': {
  //   overflow: 'auto',
  //   maxHeight: '200px' // или любая другая подходящая высота
  // },
  // Основной контейнер поля ввода
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'var(--light-bg-redesigned)',
    borderRadius: 'var(--radius-lg)',
    padding: '0 12px',
    transition: 'var(--transition-colors)',
    color: 'var(--icon-redesigned)', // Цвет для иконок (svg) по умолчанию
    display: 'flex',
    alignItems: 'center',
    minHeight: '44px',
    '& fieldset': {
      border: '1px solid rgba(94, 211, 243, 0.2)',
      transition: 'var(--transition-colors)',
    },
    '&:hover': {
      backgroundColor: 'var(--bg-color)',
      '& fieldset': {
        borderColor: 'rgba(94, 211, 243, 0.4) !important',
      },
    },
    '&.Mui-focused': {
      backgroundColor: 'var(--card-bg)',
      boxShadow: '0 0 0 3px rgba(94, 211, 243, 0.1)',
      '& fieldset': {
        borderColor: 'var(--accent-redesigned) !important',
        borderWidth: '1px !important',
      },
    },
    '&.MuiInputBase-multiline': {
      alignItems: 'flex-start',
      padding: '12px',
      minHeight: '80px',
    },
  },
  '& .MuiInputBase-input': {
    padding: '0 !important',
    color: 'var(--text-redesigned)',
    fontSize: 'var(--font-size-m) !important',
    fontWeight: '500 !important',
    '&::placeholder': {
      color: 'var(--hint-redesigned)',
      opacity: 1,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'var(--text-redesigned)',
    transform: 'translate(14px, 12px) scale(1)', // Центрируем по вертикали для высоты 44px
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)', // Позиция при фокусе (сверху)
    },
    '&.Mui-focused': {
      color: 'var(--text-redesigned)',
    },
  },
  '& .MuiSvgIcon-root': {
    color: 'var(--icon-redesigned)'
  },
  '& .MuiFormHelperText-root': {
    color: 'var(--text-redesigned)',
    opacity: 0.8
  }
}

export const Textarea = memo((props: TextAreaProps) => {
  const {
    className,
    sx,
    ...otherProps
  } = props
  return (
    <div className={classNames(cls.Textarea, {}, [className])}>
      <TextField
        fullWidth
        sx={[areaStyles, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
        {...otherProps}
      />
    </div>
  )
})
