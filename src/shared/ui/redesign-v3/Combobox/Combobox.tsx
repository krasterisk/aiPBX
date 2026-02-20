import React, { memo, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { classNames, Mods } from '@/shared/lib/classNames/classNames'
import cls from './Combobox.module.scss'
import { ChevronDown, X, Check } from 'lucide-react'
import { VStack } from '../../redesigned/Stack'
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useDismiss,
    useInteractions,
    FloatingPortal,
    size as floatingSize
} from '@floating-ui/react'

export interface ComboboxOption {
    id: string
    name: string
    [key: string]: any
}

interface ComboboxProps<T extends ComboboxOption = ComboboxOption> {
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
    size?: 's' | 'm' | 'l'
    getOptionLabel?: (option: T) => string
    getOptionKey?: (option: T) => string
    isOptionEqualToValue?: (option: T, value: T) => boolean
    renderOption?: (option: T, selected: boolean) => ReactNode
    noOptionsText?: string
    addonLeft?: ReactNode
    addonRight?: ReactNode
}

export const Combobox = memo(<T extends ComboboxOption = ComboboxOption>(props: ComboboxProps<T>) => {
    const {
        className,
        label,
        placeholder = 'Выберите...',
        options = [],
        value = null,
        onChange,
        multiple = false,
        disabled = false,
        error,
        fullWidth = false,
        searchable = true,
        clearable = true,
        size = 'm',
        getOptionLabel = (option) => option.name,
        getOptionKey = (option) => option.id,
        isOptionEqualToValue = (option, val) => getOptionKey(option) === getOptionKey(val),
        renderOption,
        noOptionsText = 'Нет опций',
        addonLeft,
        addonRight
    } = props

    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    // Floating UI setup
    const { refs, floatingStyles, context, isPositioned } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(4),
            flip({ padding: 10 }),
            shift({ padding: 10 }),
            floatingSize({
                apply ({ rects, elements, availableHeight }) {
                    Object.assign(elements.floating.style, {
                        width: `${rects.reference.width}px`,
                        maxHeight: `${Math.min(availableHeight, 300)}px`
                    })
                },
                padding: 10
            })
        ]
    })

    const dismiss = useDismiss(context)
    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss])

    // Filter options based on search query
    const filteredOptions = searchable && searchQuery
        ? options.filter(option =>
            getOptionLabel(option).toLowerCase().includes(searchQuery.toLowerCase())
        )
        : options

    // Check if option is selected
    const isSelected = useCallback((option: T): boolean => {
        if (!value) return false
        if (multiple && Array.isArray(value)) {
            return value.some(v => isOptionEqualToValue(option, v))
        }
        return !Array.isArray(value) && isOptionEqualToValue(option, value)
    }, [value, multiple, isOptionEqualToValue])

    // Handle option selection
    const handleSelectOption = useCallback((option: T) => {
        if (multiple) {
            const currentValue = (value as T[]) || []
            const newValue = isSelected(option)
                ? currentValue.filter(v => !isOptionEqualToValue(option, v))
                : [...currentValue, option]
            onChange?.(newValue.length > 0 ? newValue : null)
        } else {
            onChange?.(option)
            setIsOpen(false)
            setSearchQuery('')
        }
    }, [multiple, value, isSelected, onChange, isOptionEqualToValue])

    // Handle remove option (for multiple select)
    const handleRemoveOption = useCallback((option: T, e: React.MouseEvent) => {
        e.stopPropagation()
        if (multiple && Array.isArray(value)) {
            const newValue = value.filter(v => !isOptionEqualToValue(option, v))
            onChange?.(newValue.length > 0 ? newValue : null)
        }
    }, [multiple, value, onChange, isOptionEqualToValue])

    // Handle clear all
    const handleClear = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        onChange?.(null)
        setSearchQuery('')
    }, [onChange])

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (disabled) return

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setIsOpen(true)
                setHighlightedIndex(prev =>
                    prev < filteredOptions.length - 1 ? prev + 1 : prev
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0))
                break
            case 'Enter':
                e.preventDefault()
                if (isOpen && filteredOptions[highlightedIndex]) {
                    handleSelectOption(filteredOptions[highlightedIndex])
                } else {
                    setIsOpen(true)
                }
                break
            case 'Escape':
                e.preventDefault()
                setIsOpen(false)
                setSearchQuery('')
                break
            case 'Tab':
                setIsOpen(false)
                break
        }
    }, [disabled, isOpen, filteredOptions, highlightedIndex, handleSelectOption])

    // Scroll highlighted option into view
    useEffect(() => {
        if (isOpen && listRef.current) {
            const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ block: 'nearest' })
            }
        }
    }, [highlightedIndex, isOpen])

    // Reset highlighted index when options change
    useEffect(() => {
        setHighlightedIndex(0)
    }, [searchQuery])

    // Get display value
    const getDisplayValue = (): string => {
        if (!value) return ''
        if (multiple && Array.isArray(value)) {
            return value.map(v => getOptionLabel(v)).join(', ')
        }
        return !Array.isArray(value) ? getOptionLabel(value) : ''
    }

    const hasValue = multiple ? (Array.isArray(value) && value.length > 0) : Boolean(value)

    const mods: Mods = {
        [cls.open]: isOpen,
        [cls.disabled]: disabled,
        [cls.error]: Boolean(error),
        [cls.fullWidth]: fullWidth,
        [cls.hasValue]: hasValue
    }

    return (
        <VStack gap="4" max={fullWidth} className={classNames(cls.Combobox, {}, [className])}>
            {label && <label className={cls.label}>{label}</label>}

            <div
                ref={refs.setReference}
                {...getReferenceProps()}
                className={classNames(cls.container, mods, [cls[size]])}
            >
                <div
                    className={cls.control}
                    onClick={(e) => {
                        // Не переключать, если клик был на input или кнопках
                        if (
                            disabled ||
                            (e.target as HTMLElement).tagName === 'INPUT' ||
                            (e.target as HTMLElement).closest('button')
                        ) {
                            return
                        }
                        setIsOpen(!isOpen)
                    }}
                    onKeyDown={handleKeyDown}
                    tabIndex={disabled ? -1 : 0}
                >
                    {/* Left addon icon */}
                    {addonLeft && (
                        <div className={cls.addonLeft}>
                            {addonLeft}
                        </div>
                    )}

                    {/* Multiple selected values as chips */}
                    {multiple && Array.isArray(value) && value.length > 0 ? (
                        <div className={cls.valueContainer}>
                            {value.map((option) => (
                                <div key={getOptionKey(option)} className={cls.chip}>
                                    <span className={cls.chipLabel}>{getOptionLabel(option)}</span>
                                    <button
                                        type="button"
                                        className={cls.chipRemove}
                                        onClick={(e) => { handleRemoveOption(option, e) }}
                                        aria-label={`Remove ${getOptionLabel(option)}`}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Search input or display value */}
                            {searchable ? (
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className={cls.input}
                                    placeholder={hasValue ? getDisplayValue() : placeholder}
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        if (!isOpen) {
                                            setIsOpen(true)
                                        }
                                    }}
                                    onFocus={() => {
                                        if (!isOpen) {
                                            setIsOpen(true)
                                        }
                                    }}
                                    onClick={(e) => {
                                        // Предотвратить всплытие к control div
                                        e.stopPropagation()
                                        if (!isOpen) {
                                            setIsOpen(true)
                                        }
                                    }}
                                    disabled={disabled}
                                    readOnly={!isOpen}
                                />
                            ) : (
                                <div className={cls.singleValue}>
                                    {hasValue ? getDisplayValue() : placeholder}
                                </div>
                            )}
                        </>
                    )}

                    {/* Right addon (optional) */}
                    {addonRight && (
                        <div className={cls.addonRight}>
                            {addonRight}
                        </div>
                    )}

                    {/* Icons */}
                    <div className={cls.indicators}>
                        {clearable && hasValue && !disabled && (
                            <button
                                type="button"
                                className={cls.clearButton}
                                onClick={handleClear}
                                aria-label="Clear selection"
                            >
                                <X size={16} />
                            </button>
                        )}
                        <div className={cls.separator} />
                        <div className={cls.dropdownIndicator}>
                            <ChevronDown size={18} />
                        </div>
                    </div>
                </div>

                {/* Dropdown menu */}
                {isOpen && (
                    <FloatingPortal>
                        <div
                            className={cls.menu}
                            ref={refs.setFloating}
                            style={{
                                ...floatingStyles,
                                right: 'auto', // Reset right to prevent conflict with absolute positioning in SCSS
                                opacity: isPositioned ? 1 : 0,
                                zIndex: 9999 // Ensure it's above everything including modals
                            }}
                            {...getFloatingProps()}
                        >
                            <div ref={listRef}>
                                {filteredOptions.length > 0
? (
                                    filteredOptions.map((option, index) => {
                                        const selected = isSelected(option)
                                        const highlighted = index === highlightedIndex

                                        return (
                                            <div
                                                key={getOptionKey(option)}
                                                className={classNames(cls.option, {
                                                    [cls.selected]: selected,
                                                    [cls.highlighted]: highlighted
                                                })}
                                                onClick={() => { handleSelectOption(option) }}
                                                onMouseEnter={() => { setHighlightedIndex(index) }}
                                            >
                                                {renderOption
? (
                                                    renderOption(option, selected)
                                                )
: (
                                                    <>
                                                        <span className={cls.optionLabel}>{getOptionLabel(option)}</span>
                                                        {selected && (
                                                            <div className={cls.checkIcon}>
                                                                <Check size={16} />
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )
                                    })
                                )
: (
                                    <div className={cls.noOptions}>{noOptionsText}</div>
                                )}
                            </div>
                        </div>
                    </FloatingPortal>
                )}
            </div>

            {error && <span className={cls.errorText}>{error}</span>}
        </VStack>
    )
}) as <T extends ComboboxOption = ComboboxOption>(props: ComboboxProps<T>) => JSX.Element
