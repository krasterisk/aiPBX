import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Combobox.module.scss'
import { memo, ReactNode } from 'react'
import { Autocomplete, AutocompleteProps, TextField } from '@mui/material'

export interface ComboBoxProps extends Omit<AutocompleteProps<any, any, any, any>, 'renderInput'> {
  className?: string
  label?: string
  renderInput?: (params: any) => ReactNode
}

export const Combobox = memo((props: ComboBoxProps) => {
  const {
    className,
    label,
    renderInput,
    options,
    ...otherProps
  } = props

  const renderInputProp = renderInput || ((params) => <TextField {...params} label={label} />)

  const acStyles = {
    // Основной контейнер поля ввода
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'var(--light-bg-redesigned)',
      borderRadius: 'var(--radius-lg)',
      padding: '4px 12px',
      transition: 'var(--transition-colors)',
      color: 'var(--icon-redesigned)', // Цвет для иконок (svg) по умолчанию
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
    },

    // Текст внутри поля
    '& .MuiInputBase-input': {
      color: 'var(--text-redesigned)',
      fontSize: 'var(--font-size-m)',
      fontWeight: '500',
      '&::placeholder': {
        color: 'var(--hint-redesigned)',
        opacity: 1,
      },
    },

    // Лейбл (если есть, хотя в редизайне часто внешний лейбл)
    '& .MuiInputLabel-root': {
      color: 'var(--hint-redesigned)',
      '&.Mui-focused': {
        color: 'var(--accent-redesigned)',
      },
    },

    // Иконка стрелки выпадающего списка
    '& .MuiAutocomplete-popupIndicator': {
      color: 'var(--icon-redesigned)',
      transition: 'var(--transition-transform)',
      '&:hover': {
        backgroundColor: 'transparent',
        color: 'var(--accent-redesigned)',
      },
    },
    '& .MuiAutocomplete-popupIndicatorOpen': {
      transform: 'rotate(180deg)',
    },

    // Иконка очистки (крестик)
    '& .MuiAutocomplete-clearIndicator': {
      color: 'var(--icon-redesigned)',
      '&:hover': {
        color: 'var(--status-error)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
      },
    },

    // --- СТИЛИ ДЛЯ ВЫПАДАЮЩЕГО СПИСКА (PAPER) ---
    '& + .MuiAutocomplete-popper .MuiAutocomplete-paper': {
      backgroundColor: 'var(--card-bg)',
      color: 'var(--text-redesigned)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid rgba(94, 211, 243, 0.2)',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
      marginTop: '4px',
      '& .MuiAutocomplete-listbox': {
        padding: 'var(--space-2)',
        '& .MuiAutocomplete-option': {
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          fontSize: 'var(--font-size-m)',
          color: 'var(--text-redesigned)',
          '&:hover': {
            backgroundColor: 'rgba(94, 211, 243, 0.1) !important',
            transform: 'translateX(2px)',
            transition: 'all 0.2s ease',
          },
          '&[aria-selected="true"]': {
            backgroundColor: 'rgba(94, 211, 243, 0.15) !important',
            fontWeight: '600',
            '&:hover': {
              backgroundColor: 'rgba(94, 211, 243, 0.2) !important',
            },
          },
        },
      },
    },

    // --- СТИЛИ ДЛЯ MULTIPLE CHIP-ЭЛЕМЕНТОВ ---
    '& .MuiChip-root': {
      backgroundColor: 'rgba(94, 211, 243, 0.15)',
      border: '1px solid rgba(94, 211, 243, 0.3)',
      color: 'var(--text-redesigned)',
      borderRadius: 'var(--radius-sm)',
      height: '24px',
      '&:hover': {
        backgroundColor: 'rgba(94, 211, 243, 0.25)',
        borderColor: 'var(--accent-redesigned)',
      },
      '& .MuiChip-label': {
        fontSize: 'var(--font-size-s)',
        fontWeight: 500,
        paddingLeft: '8px',
        paddingRight: '8px',
      },
      '& .MuiChip-deleteIcon': {
        color: 'var(--icon-redesigned)',
        fontSize: '16px',
        marginRight: '2px',
        '&:hover': {
          color: 'var(--status-error)',
        },
      },
    },
  }

  return (
    <Autocomplete
      fullWidth
      className={classNames(cls.Combobox, {}, [className])}
      renderInput={renderInputProp}
      sx={acStyles}
      size={'medium'}
      options={options}
      {...otherProps}
    />
  )
})
