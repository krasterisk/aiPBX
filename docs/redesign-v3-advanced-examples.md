# Advanced Usage Examples - Redesign v3

Продвинутые примеры использования компонентов redesign-v3.

## 1. Combobox с кастомным рендерингом опций

### User Select с аватаром

```tsx
import { Combobox, ComboboxOption } from '@/shared/ui/redesign-v3/Combobox'
import { Avatar } from '@/shared/ui/redesigned/Avatar'
import { HStack } from '@/shared/ui/redesigned/Stack'

interface UserOption extends ComboboxOption {
  id: string
  name: string
  avatar?: string
  email: string
  role: string
}

const UserSelect = () => {
  const [selected, setSelected] = useState<UserOption | null>(null)
  
  return (
    <Combobox<UserOption>
      label="Выберите пользователя"
      options={users}
      value={selected}
      onChange={setSelected}
      renderOption={(user, isSelected) => (
        <HStack gap="12" max>
          <Avatar size={32} src={user.avatar} alt={user.name} />
          <VStack gap="2" align="start">
            <Text text={user.name} bold={isSelected} />
            <Text text={user.email} size="s" variant="secondary" />
          </VStack>
          {isSelected && <Check size={16} />}
        </HStack>
      )}
    />
  )
}
```

---

## 2. Множественный выбор с лимитом

```tsx
const TagSelect = () => {
  const [tags, setTags] = useState<ComboboxOption[]>([])
  const MAX_TAGS = 5
  
  const handleChange = useCallback((value: ComboboxOption | ComboboxOption[] | null) => {
    if (Array.isArray(value) && value.length <= MAX_TAGS) {
      setTags(value)
    }
  }, [])
  
  return (
    <Combobox
      multiple
      label={`Теги (макс. ${MAX_TAGS})`}
      options={availableTags}
      value={tags}
      onChange={handleChange}
      error={tags.length >= MAX_TAGS ? `Максимум ${MAX_TAGS} тегов` : undefined}
    />
  )
}
```

---

## 3. Асинхронная загрузка с debounce

```tsx
import { useDebouncedCallback } from 'use-debounce'

const AsyncSearch = () => {
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<ComboboxOption[]>([])
  const [loading, setLoading] = useState(false)
  
  const fetchOptions = useDebouncedCallback(async (searchQuery: string) => {
    if (!searchQuery) {
      setOptions([])
      return
    }
    
    setLoading(true)
    try {
      const results = await api.search(searchQuery)
      setOptions(results.map(r => ({ id: r.id, name: r.name })))
    } finally {
      setLoading(false)
    }
  }, 300)
  
  useEffect(() => {
    fetchOptions(query)
  }, [query, fetchOptions])
  
  return (
    <Combobox
      label="Поиск"
      placeholder={loading ? 'Загрузка...' : 'Введите запрос'}
      options={options}
      value={null}
      onChange={(value) => console.log(value)}
      searchable
      disabled={loading}
      noOptionsText={query ? 'Ничего не найдено' : 'Начните вводить'}
    />
  )
}
```

---

## 4. Input с валидацией

```tsx
const ValidatedInput = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)
  
  const validateEmail = useCallback((value: string) => {
    if (!value) {
      return 'Email обязателен'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Некорректный email'
    }
    return ''
  }, [])
  
  const handleChange = useCallback((value: string) => {
    setEmail(value)
    if (touched) {
      setError(validateEmail(value))
    }
  }, [touched, validateEmail])
  
  const handleBlur = useCallback(() => {
    setTouched(true)
    setError(validateEmail(email))
  }, [email, validateEmail])
  
  return (
    <Input
      label="Email"
      placeholder="example@mail.com"
      value={email}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched ? error : undefined}
      addonLeft={<Mail size={18} />}
    />
  )
}
```

---

## 5. Группированный Combobox

```tsx
interface GroupedOption extends ComboboxOption {
  id: string
  name: string
  group: string
}

const GroupedSelect = () => {
  const [value, setValue] = useState<GroupedOption | null>(null)
  
  // Группировка опций
  const groupedOptions = useMemo(() => {
    const groups = options.reduce((acc, option) => {
      if (!acc[option.group]) {
        acc[option.group] = []
      }
      acc[option.group].push(option)
      return acc
    }, {} as Record<string, GroupedOption[]>)
    
    // Flatten with group headers
    return Object.entries(groups).flatMap(([group, items]) => [
      { id: `group-${group}`, name: group, isGroup: true },
      ...items
    ])
  }, [options])
  
  return (
    <Combobox<GroupedOption>
      options={groupedOptions}
      value={value}
      onChange={setValue}
      renderOption={(option, selected) => {
        if (option.isGroup) {
          return (
            <Text 
              text={option.name} 
              bold 
              variant="secondary" 
              className={cls.groupHeader}
            />
          )
        }
        return (
          <HStack gap="8" className={cls.groupedOption}>
            <span>{option.name}</span>
            {selected && <Check size={16} />}
          </HStack>
        )
      }}
      isOptionEqualToValue={(opt, val) => 
        !opt.isGroup && !val.isGroup && opt.id === val.id
      }
    />
  )
}
```

---

## 6. Combobox с созданием новых опций

```tsx
const CreatableCombobox = () => {
  const [options, setOptions] = useState<ComboboxOption[]>(initialOptions)
  const [value, setValue] = useState<ComboboxOption | null>(null)
  const [inputValue, setInputValue] = useState('')
  
  const handleCreateOption = useCallback(() => {
    if (inputValue && !options.find(o => o.name === inputValue)) {
      const newOption: ComboboxOption = {
        id: `new-${Date.now()}`,
        name: inputValue
      }
      setOptions([...options, newOption])
      setValue(newOption)
      setInputValue('')
    }
  }, [inputValue, options])
  
  const filteredOptions = useMemo(() => {
    const filtered = inputValue
      ? options.filter(o => o.name.toLowerCase().includes(inputValue.toLowerCase()))
      : options
    
    // Add "Create" option if no exact match
    if (inputValue && !options.find(o => o.name === inputValue)) {
      return [
        ...filtered,
        { id: 'create-new', name: `Создать "${inputValue}"`, isCreate: true }
      ]
    }
    
    return filtered
  }, [options, inputValue])
  
  const handleChange = useCallback((newValue: ComboboxOption | null) => {
    if (newValue?.isCreate) {
      handleCreateOption()
    } else {
      setValue(newValue)
    }
  }, [handleCreateOption])
  
  return (
    <Combobox
      options={filteredOptions}
      value={value}
      onChange={handleChange}
      searchable
      renderOption={(option, selected) => {
        if (option.isCreate) {
          return (
            <HStack gap="8">
              <Plus size={16} />
              <Text text={option.name} variant="accent" />
            </HStack>
          )
        }
        return option.name
      }}
    />
  )
}
```

---

## 7. Input с автодополнением

```tsx
const AutocompleteInput = () => {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  useEffect(() => {
    if (value) {
      const filtered = allSuggestions.filter(s => 
        s.toLowerCase().startsWith(value.toLowerCase())
      )
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [value])
  
  return (
    <div className={cls.autocomplete}>
      <Input
        value={value}
        onChange={setValue}
        placeholder="Введите город"
        addonLeft={<MapPin size={18} />}
      />
      {showSuggestions && (
        <div className={cls.suggestions}>
          {suggestions.map(suggestion => (
            <div
              key={suggestion}
              className={cls.suggestion}
              onClick={() => {
                setValue(suggestion)
                setShowSuggestions(false)
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## 8. Controlled Input с форматированием

```tsx
const PhoneInput = () => {
  const [value, setValue] = useState('')
  
  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '')
    const match = digits.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/)
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`
    }
    return phone
  }
  
  const handleChange = useCallback((newValue: string) => {
    const digits = newValue.replace(/\D/g, '')
    if (digits.length <= 11) {
      setValue(formatPhone(digits))
    }
  }, [])
  
  return (
    <Input
      label="Телефон"
      placeholder="+7 (999) 999-99-99"
      value={value}
      onChange={handleChange}
      addonLeft={<Phone size={18} />}
    />
  )
}
```

---

## 9. Multi-step Form с валидацией

```tsx
const MultiStepForm = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: null as ComboboxOption | null,
    skills: [] as ComboboxOption[]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const validateStep = useCallback((currentStep: number) => {
    const newErrors: Record<string, string> = {}
    
    if (currentStep === 1) {
      if (!formData.name) newErrors.name = 'Имя обязательно'
      if (!formData.email) newErrors.email = 'Email обязателен'
    }
    
    if (currentStep === 2) {
      if (!formData.role) newErrors.role = 'Выберите роль'
      if (formData.skills.length === 0) newErrors.skills = 'Выберите навыки'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])
  
  const handleNext = useCallback(() => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }, [step, validateStep])
  
  return (
    <VStack gap="24">
      {step === 1 && (
        <>
          <Input
            label="Имя"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            error={errors.name}
          />
          <Input
            label="Email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            error={errors.email}
          />
        </>
      )}
      
      {step === 2 && (
        <>
          <Combobox
            label="Роль"
            options={roles}
            value={formData.role}
            onChange={(value) => setFormData({ ...formData, role: value as ComboboxOption | null })}
            error={errors.role}
          />
          <Combobox
            label="Навыки"
            multiple
            options={skills}
            value={formData.skills}
            onChange={(value) => setFormData({ ...formData, skills: value as ComboboxOption[] })}
            error={errors.skills}
          />
        </>
      )}
      
      <Button onClick={handleNext}>
        {step === 2 ? 'Отправить' : 'Далее'}
      </Button>
    </VStack>
  )
}
```

---

## 10. Dynamic Options Loading

```tsx
const DependentSelects = () => {
  const [country, setCountry] = useState<ComboboxOption | null>(null)
  const [city, setCity] = useState<ComboboxOption | null>(null)
  const [cities, setCities] = useState<ComboboxOption[]>([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (country) {
      setLoading(true)
      setCity(null)
      
      fetchCities(country.id)
        .then(data => setCities(data))
        .finally(() => setLoading(false))
    } else {
      setCities([])
    }
  }, [country])
  
  return (
    <VStack gap="16">
      <Combobox
        label="Страна"
        options={countries}
        value={country}
        onChange={setCountry}
        searchable
      />
      
      <Combobox
        label="Город"
        options={cities}
        value={city}
        onChange={setCity}
        disabled={!country || loading}
        placeholder={
          !country 
            ? 'Сначала выберите страну' 
            : loading 
            ? 'Загрузка...' 
            : 'Выберите город'
        }
        searchable
      />
    </VStack>
  )
}
```

---

## Полезные хуки

### useComboboxFilter

```tsx
const useComboboxFilter = <T extends ComboboxOption>(
  options: T[],
  searchFields: (keyof T)[] = ['name']
) => {
  const [query, setQuery] = useState('')
  
  const filtered = useMemo(() => {
    if (!query) return options
    
    const lowerQuery = query.toLowerCase()
    return options.filter(option =>
      searchFields.some(field =>
        String(option[field]).toLowerCase().includes(lowerQuery)
      )
    )
  }, [options, query, searchFields])
  
  return { filtered, query, setQuery }
}
```

### useFormField

```tsx
const useFormField = (initialValue: string = '', validator?: (value: string) => string) => {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)
  
  const handleChange = useCallback((newValue: string) => {
    setValue(newValue)
    if (touched && validator) {
      setError(validator(newValue))
    }
  }, [touched, validator])
  
  const handleBlur = useCallback(() => {
    setTouched(true)
    if (validator) {
      setError(validator(value))
    }
  }, [value, validator])
  
  return {
    value,
    error: touched ? error : '',
    onChange: handleChange,
    onBlur: handleBlur,
    reset: () => {
      setValue(initialValue)
      setError('')
      setTouched(false)
    }
  }
}
```

---

Эти примеры показывают расширенные возможности компонентов redesign-v3 и best practices их использования.
