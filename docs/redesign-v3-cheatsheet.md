# Redesign v3 - Шпаргалка разработчика

## 📦 Импорты

```tsx
// Компоненты
import { Input, Combobox } from '@/shared/ui/redesign-v3'
import { ClientSelectV3 } from '@/entities/User'

// Типы
import type { 
  ComboboxOption, 
  InputProps, 
  ComboboxProps 
} from '@/shared/ui/redesign-v3'

// Иконки
import { Search, Mail, Users, Plus } from 'lucide-react'
```

---

## 🔤 Input - Шпаргалка

### Базовый
```tsx
<Input value={val} onChange={setVal} placeholder="..." />
```

### С иконкой
```tsx
<Input 
  value={val} 
  onChange={setVal}
  addonLeft={<Search size={18} />}
/>
```

### Размеры
```tsx
<Input size="s" />  // маленький
<Input size="m" />  // средний (default)
<Input size="l" />  // большой
```

### С ошибкой
```tsx
<Input 
  value={email}
  onChange={setEmail}
  error="Некорректный email"
/>
```

### На всю ширину
```tsx
<Input value={val} onChange={setVal} fullWidth />
```

### Состояния
```tsx
<Input readonly />
<Input disabled />
<Input autofocus />
```

---

## 📋 Combobox - Шпаргалка

### Формат данных
```tsx
const options: ComboboxOption[] = [
  { id: '1', name: 'Вариант 1' },
  { id: '2', name: 'Вариант 2' }
]
// id и name - обязательны!
```

### Одиночный выбор
```tsx
const [value, setValue] = useState<ComboboxOption | null>(null)

<Combobox
  options={options}
  value={value}
  onChange={setValue}
/>
```

### Множественный выбор
```tsx
const [values, setValues] = useState<ComboboxOption[]>([])

<Combobox
  multiple
  options={options}
  value={values}
  onChange={setValues}
/>
```

### С поиском (default: true)
```tsx
<Combobox
  searchable
  options={options}
  value={value}
  onChange={setValue}
/>
```

### Размеры
```tsx
<Combobox size="s" />  // маленький
<Combobox size="m" />  // средний (default)
<Combobox size="l" />  // большой
```

### Кастомный рендеринг
```tsx
<Combobox
  options={users}
  renderOption={(user, selected) => (
    <div>
      <Avatar src={user.avatar} />
      <span>{user.name}</span>
      {selected && <Check />}
    </div>
  )}
/>
```

### Custom getters
```tsx
<Combobox
  getOptionLabel={(opt) => opt.fullName}
  getOptionKey={(opt) => opt.userId}
  isOptionEqualToValue={(a, b) => a.userId === b.userId}
/>
```

---

## 👤 ClientSelectV3 - Шпаргалка

### Базовый
```tsx
const [clientId, setClientId] = useState('')

<ClientSelectV3
  clientId={clientId}
  onChangeClient={setClientId}
/>
```

### С параметрами
```tsx
<ClientSelectV3
  label="Клиент"
  clientId={clientId}
  onChangeClient={setClientId}
  placeholder="Выберите клиента"
  size="m"
  fullWidth
/>
```

---

## ⌨️ Горячие клавиши Combobox

| Клавиша | Действие |
|---------|----------|
| `↓` | Следующая опция |
| `↑` | Предыдущая опция |
| `Enter` | Выбрать текущую |
| `Esc` | Закрыть меню |
| `Tab` | Закрыть и перейти дальше |
| Печать | Автопоиск |

---

## 🎨 Доступные props

### Input
```tsx
interface InputProps {
  value?: string | number
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  size?: 's' | 'm' | 'l'
  addonLeft?: ReactNode
  addonRight?: ReactNode
  readonly?: boolean
  disabled?: boolean
  autofocus?: boolean
  fullWidth?: boolean
  type?: string  // 'text' | 'password' | 'email' | ...
}
```

### Combobox
```tsx
interface ComboboxProps<T extends ComboboxOption> {
  options: T[]
  value?: T | T[] | null
  onChange?: (value: T | T[] | null) => void
  placeholder?: string
  label?: string
  error?: string
  size?: 's' | 'm' | 'l'
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  disabled?: boolean
  fullWidth?: boolean
  noOptionsText?: string
  getOptionLabel?: (opt: T) => string
  getOptionKey?: (opt: T) => string
  isOptionEqualToValue?: (a: T, b: T) => boolean
  renderOption?: (opt: T, selected: boolean) => ReactNode
}
```

### ClientSelectV3
```tsx
interface ClientSelectV3Props {
  clientId?: string
  onChangeClient?: (clientId: string) => void
  label?: string
  placeholder?: string
  size?: 's' | 'm' | 'l'
  error?: string
  fullWidth?: boolean
  className?: string
}
```

---

## 🚨 Частые ошибки

### ❌ НЕПРАВИЛЬНО
```tsx
// Event в onChange
<Input onChange={(e) => setVal(e.target.value)} />
<Combobox onChange={(e, val) => setVal(val)} />

// Неправильный формат опций
<Combobox options={[{ userId: '1', userName: 'John' }]} />
```

### ✅ ПРАВИЛЬНО
```tsx
// Прямое значение
<Input onChange={setVal} />
<Combobox onChange={setVal} />

// { id, name } формат
<Combobox options={[{ id: '1', name: 'John' }]} />
```

---

## 💡 Типичные паттерны

### Валидация
```tsx
const [value, setValue] = useState('')
const [error, setError] = useState('')

const handleChange = (val: string) => {
  setValue(val)
  setError(validate(val))
}

<Input value={value} onChange={handleChange} error={error} />
```

### Контролируемый state
```tsx
const [selected, setSelected] = useState<ComboboxOption | null>(null)

useEffect(() => {
  console.log('Selected:', selected)
}, [selected])

<Combobox options={opts} value={selected} onChange={setSelected} />
```

### Множественный с лимитом
```tsx
const handleChange = (vals: ComboboxOption[]) => {
  if (vals.length <= 5) {
    setSelected(vals)
  }
}

<Combobox multiple onChange={handleChange} />
```

---

## 📐 CSS Переменные

Все компоненты используют:

```scss
// Цвета
--text-redesigned
--accent-redesigned
--hint-redesigned
--icon-redesigned

// Фоны
--input-bg
--glass-bg-primary
--glass-overlay-medium

// Эффекты
--glass-blur-md
--shadow-accent-sm
--transition-colors

// Spacing
--space-{1,2,4,8,16}
--input-padding

// Радиусы
--radius-{sm,md,lg,xl}
```

---

## 🎯 Best Practices

### ✅ DO
- Используйте `useCallback` для onChange handlers
- Мемоизируйте опции через `useMemo`
- Валидируйте данные перед передачей
- Используйте TypeScript типы
- Указывайте `fullWidth` явно

### ❌ DON'T
- Не передавайте event в onChange
- Не используйте неправильный формат опций
- Не забывайте про проверку на null
- Не игнорируйте TypeScript ошибки

---

## 🔗 Полезные ссылки

- **Quick Start**: `docs/redesign-v3-quick-start.md`
- **Full Docs**: `src/shared/ui/redesign-v3/README.md`
- **Advanced**: `docs/redesign-v3-advanced-examples.md`
- **Migration**: `docs/migration-mui-to-v3.md`

---

## 🆘 Помощь

### Проблема: Не работает onChange
✅ Проверьте, что передаете функцию напрямую, без event

### Проблема: Опции не показываются
✅ Проверьте формат: `{ id: string, name: string }`

### Проблема: Стили не применяются
✅ Убедитесь, что импортированы миксины: `@import '@/app/styles/variables/mixins'`

### Проблема: TypeScript ошибки
✅ Используйте Generic типы: `Combobox<MyOptionType>`

---

*Актуально на: 04.02.2026*
