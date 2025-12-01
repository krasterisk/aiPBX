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
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: '1px solid var(--icon-redesigned)', // Цвет по умолчанию
        borderRadius: '8px'
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
    },
    // --- СТИЛИ ДЛЯ MULTIPLE CHIP-ЭЛЕМЕНТОВ ---
    '& .MuiChip-root': {
      backgroundColor: 'var(--hint-redesigned)', // фон выбранного элемента
      color: 'var(--text-redesigned)', // цвет текста внутри чипа
      borderRadius: '6px',
      '& .MuiChip-label': {
        fontWeight: 500
      },
      '& .MuiChip-deleteIcon': {
        color: 'var(--light-bg-redesigned)',
        '&:hover': {
          color: 'var(--icon-redesigned)'
        }
      }
    },
    '& .MuiAutocomplete-inputRoot.MuiOutlinedInput-root.Mui-focused .MuiChip-root': {
      backgroundColor: 'var(--hint-redesigned)' // цвет при фокусе
    }
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
