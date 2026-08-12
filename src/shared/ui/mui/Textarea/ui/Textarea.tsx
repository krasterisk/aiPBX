import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Textarea.module.scss'
import { memo } from 'react'
import { TextField, TextFieldProps } from '@mui/material'

// Используем тип вместо интерфейса
type TextAreaProps = TextFieldProps & {
  className?: string
}

const areaStyles = {
  // Основной контейнер поля ввода
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'var(--light-bg-redesigned)',
    borderRadius: 'var(--radius-lg)',
    padding: '0 12px',
    transition: 'var(--transition-colors)',
    color: 'var(--icon-redesigned)',
    display: 'flex',
    alignItems: 'center',
    minHeight: '44px',
    '& fieldset': {
      border: '1px solid rgba(94, 211, 243, 0.2)',
      transition: 'var(--transition-colors)',
    },
    '&:hover': {
      backgroundColor: 'var(--dark-bg-redesigned)',
      '& fieldset': {
        borderColor: 'rgba(94, 211, 243, 0.4) !important',
      },
    },
    '&.Mui-focused': {
      backgroundColor: 'var(--dark-bg-redesigned)',
      boxShadow: '0 0 0 3px rgba(94, 211, 243, 0.1)',
      '& fieldset': {
        borderColor: 'var(--accent-redesigned) !important',
        borderWidth: '1px !important',
      },
    },
    '&.Mui-disabled': {
      backgroundColor: 'var(--light-bg-redesigned)',
      opacity: 0.6,
    },
    '&.MuiInputBase-multiline': {
      alignItems: 'flex-start',
      // Extra top padding so first line never sits under the outline label
      padding: '24px 12px 12px',
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
    '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active': {
      WebkitTextFillColor: 'var(--text-redesigned)',
      WebkitBoxShadow: '0 0 0 1000px var(--light-bg-redesigned) inset !important',
      transition: 'background-color 5000s ease-in-out 0s',
      caretColor: 'var(--text-redesigned)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'var(--text-redesigned)',
    transform: 'translate(14px, 12px) scale(1)',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
    '&.Mui-focused': {
      color: 'var(--text-redesigned)',
    },
  },
  // size="small" otherwise overrides shrink position and leaves the label on the text
  '& .MuiInputLabel-sizeSmall.MuiInputLabel-shrink': {
    transform: 'translate(14px, -9px) scale(0.75)',
  },
  '& .MuiSvgIcon-root': {
    color: 'var(--icon-redesigned)',
  },
  '& .MuiFormHelperText-root': {
    color: 'var(--text-redesigned)',
    opacity: 0.8,
  },
}

export const Textarea = memo((props: TextAreaProps) => {
  const {
    className,
    sx,
    InputLabelProps,
    ...otherProps
  } = props

  // Always keep outline label in the notch for multiline (avoids overlap with content).
  const mergedLabelProps = {
    ...InputLabelProps,
    shrink: InputLabelProps?.shrink ?? true,
  }

  return (
    <div className={classNames(cls.Textarea, {}, [className])}>
      <TextField
        fullWidth
        sx={[areaStyles, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
        {...otherProps}
        InputLabelProps={mergedLabelProps}
      />
    </div>
  )
})
