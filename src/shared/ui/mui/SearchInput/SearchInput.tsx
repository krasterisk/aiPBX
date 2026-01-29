import { memo } from 'react'
import { TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface SearchInputProps {
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    className?: string
}

export const SearchInput = memo((props: SearchInputProps) => {
    const { value, onChange, placeholder, className } = props

    return (
        <TextField
            size="small"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                    </InputAdornment>
                )
            }}
        />
    )
})
