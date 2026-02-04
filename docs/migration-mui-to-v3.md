# Миграция с MUI на Redesign v3

Пошаговое руководство по замене MUI компонентов на новые redesign-v3 компоненты.

## Combobox Migration

### Было (MUI Autocomplete):

```tsx
import { Autocomplete, TextField, AutocompleteInputChangeReason } from '@mui/material'
import { Combobox } from '@/shared/ui/mui/Combobox'

interface Props {
  value?: ClientOptions | null
  clientId?: string
  onChangeClient?: (event: any, newValue: ClientOptions) => void
  onInputChange?: (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => void
  inputValue?: string
}

<Combobox
  label={label}
  autoComplete={true}
  clearOnBlur={false}
  options={clientItems}
  value={value || selectedUserValue || null}
  onChange={onChangeHandler}
  inputValue={inputValue}
  getOptionKey={option => option.id}
  isOptionEqualToValue={(option, value) => 
    value === undefined || value === '' || option.id === value.id
  }
  getOptionLabel={(option) => option.id ? option.name : ''}
  onInputChange={onInputChange}
  renderInput={(params) => (
    <TextField
      {...params}
      label={label}
      slotProps={{
        htmlInput: {
          ...params.inputProps,
          readOnly: true
        }
      }}
    />
  )}
/>
```

### Стало (Redesign v3):

```tsx
import { Combobox, ComboboxOption } from '@/shared/ui/redesign-v3/Combobox'

interface Props {
  clientId?: string
  onChangeClient?: (clientId: string) => void
  placeholder?: string
}

<Combobox
  label={label}
  placeholder={placeholder || 'Выберите клиента'}
  options={clientItems} // ComboboxOption[]
  value={selectedClient} // ComboboxOption | null
  onChange={(value) => {
    if (!value || Array.isArray(value)) {
      onChangeClient?.('')
    } else {
      onChangeClient?.(value.id)
    }
  }}
  searchable={true}
  clearable={true}
  fullWidth
/>
```

### Изменения:

1. **Убрано**: `AutocompleteInputChangeReason`, `TextField`, `renderInput`
2. **Упрощено**: Не нужен `inputValue` и `onInputChange` - поиск работает автоматически
3. **Callback**: Возвращает напрямую `ComboboxOption | null` вместо `(event, value)`
4. **Тип данных**: Все опции должны соответствовать `ComboboxOption` интерфейсу

---

## Input Migration (если использовался MUI TextField)

### Было:

```tsx
import { TextField } from '@mui/material'

<TextField
  label="Поиск"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  InputProps={{
    startAdornment: <Search size={18} />
  }}
  variant="outlined"
  fullWidth
/>
```

### Стало:

```tsx
import { Input } from '@/shared/ui/redesign-v3/Input'
import { Search } from 'lucide-react'

<Input
  label="Поиск"
  placeholder="Введите запрос"
  value={search}
  onChange={setSearch} // напрямую строку, не event
  addonLeft={<Search size={18} />}
  fullWidth
/>
```

### Изменения:

1. **Callback изменен**: `onChange` получает строку напрямую, а не event
2. **Аддоны**: `InputProps.startAdornment` → `addonLeft`, `endAdornment` → `addonRight`
3. **Variant убран**: Стиль фиксированный (glassmorphism)

---

## ClientSelect Migration

### Было (entities/User/ui/ClientSelect):

```tsx
import { ClientSelect } from '@/entities/User'

<ClientSelect
  label="Клиент"
  clientId={clientId}
  onChangeClient={(event, newValue) => {
    setClientId(newValue.id)
  }}
/>
```

### Стало (entities/User/ui/ClientSelectV3):

```tsx
import { ClientSelectV3 } from '@/entities/User'

<ClientSelectV3
  label="Клиент"
  clientId={clientId}
  onChangeClient={(newClientId) => {
    setClientId(newClientId)
  }}
  placeholder="Выберите клиента"
/>
```

### Изменения:

1. **Callback упрощен**: `onChangeClient` получает напрямую `string` (clientId), а не event и объект
2. **Типизация**: Более строгая типизация с TypeScript

---

## Checklist для миграции компонента

- [ ] Найти все использования MUI `Autocomplete`
- [ ] Заменить импорты на `redesign-v3/Combobox`
- [ ] Изменить интерфейс props (убрать event из callbacks)
- [ ] Преобразовать данные в формат `ComboboxOption[]`
- [ ] Удалить `renderInput` props
- [ ] Убрать зависимости от `@mui/material`
- [ ] Протестировать функциональность
- [ ] Проверить responsive дизайн
- [ ] Проверить accessibility (клавиатурная навигация)

---

## Типы данных

### ComboboxOption interface:

```typescript
export interface ComboboxOption {
  id: string
  name: string
  [key: string]: any // дополнительные поля
}
```

Все ваши данные должны быть преобразованы в этот формат:

```typescript
// Пример преобразования
const clientItems: ComboboxOption[] = data?.map(item => ({
  id: item.id,
  name: String(item.name),
  // дополнительные поля если нужны
  email: item.email,
  role: item.role
})) || []
```

---

## Общие ошибки при миграции

### ❌ Ошибка 1: Передача event в onChange

```tsx
// НЕПРАВИЛЬНО
onChange={(event, value) => handleChange(event, value)}

// ПРАВИЛЬНО
onChange={(value) => handleChange(value)}
```

### ❌ Ошибка 2: Неправильный формат опций

```tsx
// НЕПРАВИЛЬНО
options={[{ userId: '1', userName: 'John' }]}

// ПРАВИЛЬНО
options={[{ id: '1', name: 'John' }]}
```

### ❌ Ошибка 3: Использование renderInput

```tsx
// НЕПРАВИЛЬНО (это MUI API)
renderInput={(params) => <TextField {...params} />}

// ПРАВИЛЬНО (используйте label)
label="Выберите вариант"
```

---

## Преимущества после миграции

✅ **Меньший bundle size** - нет зависимости от MUI  
✅ **Единый дизайн** - соответствие дизайн-системе  
✅ **Проще API** - меньше props, проще использование  
✅ **Лучшая типизация** - строгие TypeScript типы  
✅ **Glassmorphism** - премиальный внешний вид  
✅ **Производительность** - оптимизированные transitions

---

## Пример: Полная миграция компонента

### Было (с MUI):

```tsx
import { Combobox } from '@/shared/ui/mui/Combobox'
import { TextField } from '@mui/material'

export const MyComponent = () => {
  const [value, setValue] = useState<ClientOptions | null>(null)
  const [inputValue, setInputValue] = useState('')
  
  const handleChange = (event: any, newValue: ClientOptions) => {
    setValue(newValue)
  }
  
  const handleInputChange = (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    setInputValue(value)
  }
  
  return (
    <Combobox
      options={options}
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      renderInput={(params) => <TextField {...params} label="Выбор" />}
      getOptionLabel={(option) => option.name}
    />
  )
}
```

### Стало (с redesign-v3):

```tsx
import { Combobox, ComboboxOption } from '@/shared/ui/redesign-v3/Combobox'

export const MyComponent = () => {
  const [value, setValue] = useState<ComboboxOption | null>(null)
  
  return (
    <Combobox
      label="Выбор"
      options={options}
      value={value}
      onChange={setValue}
      searchable
      fullWidth
    />
  )
}
```

**Результат:**
- Меньше кода
- Проще логика
- Нет зависимости от MUI
- Автоматический поиск
- Соответствие дизайн-системе

---

## Заключение

Миграция на redesign-v3 компоненты упрощает код, улучшает производительность и обеспечивает единообразный дизайн всего приложения.
