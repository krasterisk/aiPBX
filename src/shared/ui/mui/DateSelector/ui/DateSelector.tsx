import React, { memo } from 'react'
import { DatePicker, LocalizationProvider, DatePickerProps } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/ru'

interface DateSelectorProps extends DatePickerProps<any> {
  className?: string
}

const acStyles = {
  // Wrapper
  '& .MuiPickersInputBase-root, & .MuiPickersOutlinedInput-root': {
    color: 'var(--text-redesigned) !important',
    backgroundColor: 'var(--light-bg-redesigned) !important',
    borderRadius: 'var(--radius-lg) !important',
  },

  // Container for date sections
  '& .MuiPickersInputBase-sectionsContainer, & .MuiPickersSectionList-root': {
    color: 'var(--text-redesigned) !important',
  },

  // Actual numbers (year, month, day)
  '& .MuiPickersInputBase-sectionContent, & .MuiPickersSectionList-sectionContent': {
    color: 'var(--text-redesigned) !important',
    WebkitTextFillColor: 'var(--text-redesigned) !important',
    fontWeight: '500',
  },

  // Separators (-)
  '& .MuiPickersInputBase-separator, & .MuiPickersInputBase-sectionAfter, & .MuiPickersInputBase-sectionBefore': {
    color: 'var(--text-redesigned) !important',
    opacity: 0.6,
  },

  // Label colors
  '& .MuiFormLabel-root, & .MuiInputLabel-root': {
    color: 'var(--text-redesigned) !important',
    '&.Mui-focused': {
      color: 'var(--accent-redesigned) !important',
    }
  },

  // Icon color
  '& .MuiSvgIcon-root, & .MuiInputAdornment-root .MuiIconButton-root': {
    color: 'var(--icon-redesigned) !important'
  },

  // BORDERS
  '& .MuiPickersOutlinedInput-notchedOutline, & .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(94, 211, 243, 0.2) !important',
    borderRadius: 'var(--radius-lg) !important',
    transition: 'var(--transition-colors)',
  },
  '&:hover .MuiPickersOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(94, 211, 243, 0.4) !important',
  },
  '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--accent-redesigned) !important',
    borderWidth: '1px !important',
    boxShadow: '0 0 0 3px rgba(94, 211, 243, 0.1)',
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
