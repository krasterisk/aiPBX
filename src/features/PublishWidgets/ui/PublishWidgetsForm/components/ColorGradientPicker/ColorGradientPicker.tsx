import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import cls from './ColorGradientPicker.module.scss'

interface ColorGradientPickerProps {
    className?: string
    label: string
    value: string
    onChange: (value: string) => void
    presets?: string[]
}

const DEFAULT_PRESETS = [
    '#007AFF', // Blue
    '#34C759', // Green
    '#5856D6', // Indigo
    '#FF2D55', // Rose
    '#FF9500', // Orange
    '#AF52DE', // Purple
    '#5AC8FA', // Sky Blue
    '#32936F', // Mint
]

export const ColorGradientPicker = memo(({ className, label, value, onChange, presets = DEFAULT_PRESETS }: ColorGradientPickerProps) => {
    const { t } = useTranslation('publish-widgets')

    return (
        <VStack gap="8" className={classNames(cls.ColorGradientPicker, {}, [className])}>
            <Text text={label} size="s" />

            <HStack gap="8" align="center" wrap="wrap">
                <div className={cls.inputWrapper}>
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => { onChange(e.target.value) }}
                        className={cls.colorInput}
                    />
                    <div
                        className={cls.colorPreview}
                        style={{ backgroundColor: value }}
                    />
                </div>

                <div className={cls.hexCode}>{value.toUpperCase()}</div>

                <HStack gap="4" className={cls.presets} wrap="wrap">
                    {presets.map((preset) => (
                        <div
                            key={preset}
                            className={classNames(cls.preset, { [cls.active]: value.toLowerCase() === preset.toLowerCase() })}
                            style={{ backgroundColor: preset }}
                            onClick={() => { onChange(preset) }}
                        />
                    ))}
                </HStack>
            </HStack>
        </VStack>
    )
})
