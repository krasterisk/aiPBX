import { Slider as MuiSlider, SliderProps as MuiSliderProps } from '@mui/material'
import { memo } from 'react'

interface SliderProps extends Omit<MuiSliderProps, 'onChange'> {
    value?: number
    onChange?: (value: number) => void
    min?: number
    max?: number
    step?: number
    label?: string
    className?: string
}

export const Slider = memo((props: SliderProps) => {
    const {
        value,
        onChange,
        min = 0,
        max = 100,
        step = 1,
        label,
        className,
        ...otherProps
    } = props

    const handleChange = (_event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            onChange?.(newValue)
        }
    }

    return (
        <MuiSlider
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            valueLabelDisplay="auto"
            className={className}
            {...otherProps}
        />
    )
})
