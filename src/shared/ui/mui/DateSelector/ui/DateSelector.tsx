import React, { memo } from 'react'
import { DatePicker, LocalizationProvider, DatePickerProps } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/ru'

interface DateSelectorProps extends DatePickerProps<any> {
  className?: string
}

const acStyles = {
  // Root text color
  '& .MuiInputBase-root': {
    color: 'var(--text-redesigned) !important'
  },
  '& input': {
    color: 'var(--text-redesigned) !important',
    WebkitTextFillColor: 'var(--text-redesigned) !important'
  },
  // Label colors
  '& .MuiFormLabel-root': {
    color: 'var(--text-redesigned) !important'
  },
  '& .MuiInputLabel-root': {
    color: 'var(--text-redesigned) !important'
  },
  // Icon color
  '& .MuiSvgIcon-root': {
    color: 'var(--icon-redesigned) !important'
  },
  // Placeholder
  '& .MuiInputBase-input::placeholder': {
    color: 'var(--text-redesigned) !important',
    opacity: 0.7
  },

  // BORDERS - Targeting notchedOutline directly (supporting both standard and Pickers specific classes)
  // 1. Default state
  '& .MuiOutlinedInput-notchedOutline, & .MuiPickersOutlinedInput-notchedOutline': {
    borderColor: 'var(--accent-redesigned) !important',
    borderRadius: 'var(--radius-lg) !important',
  },
  // 2. Hover state
  '&:hover .MuiOutlinedInput-notchedOutline, &:hover .MuiPickersOutlinedInput-notchedOutline': {
    borderColor: 'var(--accent-redesigned) !important',
    borderWidth: '2px !important'
  },
  // 3. Focused state
  '& .Mui-focused .MuiOutlinedInput-notchedOutline, & .Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
    borderColor: 'var(--accent-redesigned) !important',
    borderWidth: '2px !important'
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
                color: 'var(--text-redesigned)',
                border: '1px solid var(--accent-redesigned)',
                borderRadius: 'var(--radius-lg)'
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
