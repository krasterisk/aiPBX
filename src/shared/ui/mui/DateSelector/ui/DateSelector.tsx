import React, { memo } from 'react'
import { DatePicker, LocalizationProvider, DatePickerProps } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/ru'

interface DateSelectorProps extends DatePickerProps<any> {
  className?: string
}

const acStyles = {
  '& .MuiInputBase-root': {
    color: 'var(--text-redesigned) !important'
  },
  '& .MuiPickersOutlinedInput-root': {
    color: 'var(--text-redesigned) !important',
    WebkitTextFillColor: 'var(--text-redesigned) !important'
  },
  '& input': {
    color: 'var(--text-redesigned) !important',
    WebkitTextFillColor: 'var(--text-redesigned) !important'
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: '2px solid var(--icon-redesigned)',
      borderRadius: '48px'
    },
    '&:hover fieldset': {
      borderColor: 'var(--accent-redesigned)'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--accent-redesigned)'
    }
  },
  '& .MuiFormLabel-root': {
    color: 'var(--text-redesigned) !important'
  },
  '& .MuiInputLabel-root': {
    color: 'var(--text-redesigned) !important'
  },
  '& .MuiSvgIcon-root': {
    color: 'var(--icon-redesigned)'
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'var(--text-redesigned)'
  },
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
      dateFormats={{ fullDate: 'YYYY-MM-DD' }}
    >
      <DatePicker
        format={'YYYY-MM-DD'}
        sx={acStyles}
        closeOnSelect
        slotProps={{
          textField: {
            sx: acStyles
          },
          actionBar: {
            actions: ['clear']
          },
          popper: {
            sx: {
              zIndex: 12000,
              '& .MuiPaper-root': {
                backgroundColor: 'var(--bg-redesigned)',
                color: 'var(--text-redesigned)'
              },
              '& .MuiPickersDay-root': {
                color: 'var(--text-redesigned)'
              },
              '& .MuiDayCalendar-weekDayLabel': {
                color: 'var(--text-redesigned)'
              },
              '& .MuiPickersCalendarHeader-label': {
                color: 'var(--text-redesigned)'
              },
              '& .MuiTypography-root': {
                color: 'var(--text-redesigned)'
              },
              '& .MuiSvgIcon-root': {
                color: 'var(--icon-redesigned)'
              }
            }
          }
        }}
        {...otherProps}
      />
    </LocalizationProvider>
  )
})
