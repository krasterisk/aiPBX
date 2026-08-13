import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Input.module.scss'
import { memo } from 'react'
import { TextField, TextFieldProps } from '@mui/material'

export type InputProps = TextFieldProps & {
    className?: string
}

const inputStyles = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            border: '1px solid var(--icon-redesigned)',
            borderRadius: '8px'
        },
        '&:hover fieldset': {
            borderColor: 'var(--accent-redesigned)'
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--accent-redesigned)'
        },
        '&.Mui-error fieldset': {
            borderColor: 'var(--status-error) !important'
        }
    },
    '& .MuiInputBase-input': {
        color: 'var(--text-redesigned)',
        fontSize: '14px',
        fontWeight: 400
    },
    '& .MuiInputBase-input::placeholder': {
        color: 'var(--text-redesigned)'
    },
    '& .MuiInputLabel-root': {
        color: 'var(--text-redesigned)',
        fontSize: '14px'
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: 'var(--text-redesigned)'
    },
    '& .MuiInputLabel-root.Mui-error': {
        color: 'var(--status-error)'
    },
    '& .MuiFormHelperText-root.Mui-error': {
        color: 'var(--status-error)'
    },
    '& .MuiSvgIcon-root': {
        color: 'var(--icon-redesigned)'
    }
}

export const Input = memo((props: InputProps) => {
    const {
        className,
        ...otherProps
    } = props
    return (
        <div className={classNames(cls.Input, {}, [className])}>
            <TextField
                fullWidth
                sx={inputStyles}
                {...otherProps}
            />
        </div>
    )
})
