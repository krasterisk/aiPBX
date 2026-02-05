import { memo } from 'react'
import { TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface SearchInputProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    className?: string
    fullWidth?: boolean
}

export const SearchInput = memo((props: SearchInputProps) => {
    const { value, onChange, placeholder, className, fullWidth } = props

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value)
    }

    const searchStyles = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--light-bg-redesigned)',
            borderRadius: 'var(--radius-lg)',
            padding: '4px 12px',
            transition: 'var(--transition-colors)',
            color: 'var(--icon-redesigned)',
            height: '42px',
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
        '& .MuiInputBase-input': {
            color: 'var(--text-redesigned)',
            fontSize: 'var(--font-size-m)',
            fontWeight: '500',
            padding: '8px 0',
            '&::placeholder': {
                color: 'var(--hint-redesigned)',
                opacity: 1,
            },
        },
        '& .MuiInputAdornment-root': {
            color: 'var(--icon-redesigned)',
            marginRight: '8px',
        },
    }

    return (
        <TextField
            fullWidth={fullWidth}
            size="small"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={className}
            sx={searchStyles}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: 'var(--icon-redesigned)' }} />
                    </InputAdornment>
                )
            }}
        />
    )
})
