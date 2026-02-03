import { memo, useState, useCallback } from 'react'
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material'
import { Eye, EyeOff } from 'lucide-react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from '../../Input/ui/Input.module.scss'

export type InputPasswordProps = TextFieldProps & {
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

export const InputPassword = memo((props: InputPasswordProps) => {
    const { slotProps, className, ...otherProps } = props
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev)
    }, [])

    return (
        <div className={classNames(cls.Input, {}, [className])}>
            <TextField
                fullWidth
                sx={inputStyles}
                {...otherProps}
                type={showPassword ? 'text' : 'password'}
                slotProps={{
                    ...slotProps,
                    input: {
                        ...slotProps?.input,
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                    size="small"
                                    sx={{ color: 'var(--icon-redesigned)' }}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }
                }}
            />
        </div>
    )
})
