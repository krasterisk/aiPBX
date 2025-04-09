import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Textarea.module.scss'
import { memo } from 'react'
import { TextField, TextFieldProps } from '@mui/material'

// Используем тип вместо интерфейса
type TextAreaProps = TextFieldProps & {
  className?: string
}

const areaStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: '2px solid var(--icon-redesigned)', // Цвет по умолчанию
      borderRadius: '24px'
    },
    '&:hover fieldset': {
      borderColor: 'var(--accent-redesigned)' // Цвет рамки при наведении
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--accent-redesigned)' // Цвет рамки при фокусировке
    }
  },
  '& .MuiInputBase-input': {
    color: 'var(--text-redesigned)'
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'var(--text-redesigned)'
  },
  '& .MuiInputLabel-root': {
    color: 'var(--text-redesigned)'
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--text-redesigned)'
  },
  '& .MuiSvgIcon-root': {
    color: 'var(--icon-redesigned)'
  }
}

export const Textarea = memo((props: TextAreaProps) => {
  const {
    className,
    ...otherProps
  } = props
  return (
        <div className={classNames(cls.Textarea, {}, [className])}>
            <TextField
                fullWidth
                sx={areaStyles}
                {...otherProps}
            />
        </div>
  )
})
