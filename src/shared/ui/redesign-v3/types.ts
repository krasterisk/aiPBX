/**
 * Type definitions for redesign-v3 components
 */

import { InputHTMLAttributes, ReactNode } from 'react'

// ============================================
// INPUT TYPES
// ============================================

export type InputSize = 's' | 'm' | 'l'

export interface InputProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'readOnly' | 'size'
> {
    className?: string
    value?: string | number
    label?: string
    onChange?: (value: string) => void
    autofocus?: boolean
    readonly?: boolean
    addonLeft?: ReactNode
    addonRight?: ReactNode
    size?: InputSize
    error?: string
    fullWidth?: boolean
}

// ============================================
// COMBOBOX TYPES
// ============================================

export type ComboboxSize = 's' | 'm' | 'l'

/**
 * Base interface for Combobox options
 * All options must have id and name fields
 * Additional fields can be added via index signature
 */
export interface ComboboxOption {
    id: string
    name: string
    [key: string]: any
}

/**
 * Props for Combobox component
 * Generic T extends ComboboxOption for type safety
 */
export interface ComboboxProps<T extends ComboboxOption = ComboboxOption> {
    className?: string
    label?: string
    placeholder?: string
    options: T[]
    value?: T | T[] | null
    onChange?: (value: T | T[] | null) => void
    multiple?: boolean
    disabled?: boolean
    error?: string
    fullWidth?: boolean
    searchable?: boolean
    clearable?: boolean
    size?: ComboboxSize
    getOptionLabel?: (option: T) => string
    getOptionKey?: (option: T) => string
    isOptionEqualToValue?: (option: T, value: T) => boolean
    renderOption?: (option: T, selected: boolean) => ReactNode
    noOptionsText?: string
}

// ============================================
// CLIENT SELECT TYPES
// ============================================

export interface ClientSelectV3Props {
    label?: string
    clientId?: string
    className?: string
    fullWidth?: boolean
    onChangeClient?: (clientId: string) => void
    size?: ComboboxSize
    error?: string
    placeholder?: string
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Helper type for extracting option type from Combobox value
 */
export type ExtractOptionType<T> = T extends ComboboxOption ? T : never

/**
 * Helper type for Combobox onChange handler based on multiple prop
 */
export type ComboboxChangeHandler<T extends ComboboxOption, Multiple extends boolean> =
    Multiple extends true
    ? (value: T[] | null) => void
    : (value: T | null) => void
