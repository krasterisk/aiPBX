import React, { memo } from 'react'
import { DatePicker, LocalizationProvider, DatePickerProps } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/ru'

interface DateSelectorProps extends DatePickerProps<any> {
  className?: string
}

const acStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: '2px solid var(--icon-redesigned)', // Цвет по умолчанию
      borderRadius: '48px'
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

export const DateSelector = memo((props: DateSelectorProps) => {
  const {
    className,
    ...otherProps
  } = props
  return (
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={'ru'}
            dateFormats={{ fullDate: 'YYYY-mm-dd' }}
        >
            <DatePicker
                format={'YYYY-MM-DD'}
                sx={acStyles}
                closeOnSelect
                slotProps={{
                  actionBar: {
                    actions: ['clear']
                  }
                }}
                {...otherProps}
            />
        </LocalizationProvider>
  )
})
