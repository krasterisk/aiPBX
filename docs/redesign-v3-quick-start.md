# Quick Start - Redesign v3 Components

Быстрое руководство по началу работы с новыми компонентами.

## 🚀 Установка

Компоненты уже установлены в проект. Импортируйте из `@/shared/ui/redesign-v3`:

```tsx
import { Input, Combobox } from '@/shared/ui/redesign-v3'
import type { ComboboxOption } from '@/shared/ui/redesign-v3'
```

---

## 📦 Основные компоненты

### 1. Input - быстрый старт

```tsx
import { Input } from '@/shared/ui/redesign-v3'
import { Search } from 'lucide-react'

// Простой input
<Input 
  placeholder="Введите текст"
  value={value}
  onChange={setValue}
/>

// С иконкой
<Input
  placeholder="Поиск"
  value={search}
  onChange={setSearch}
  addonLeft={<Search size={18} />}
/>
```

**Props:**
- `value` - значение
- `onChange(value: string)` - обработчик (получает строку напрямую!)
- `placeholder` - плейсхолдер
- `size` - 's' | 'm' | 'l' (по умолчанию 'm')
- `addonLeft/addonRight` - иконки
- `error` - текст ошибки
- `disabled/readonly` - состояния

---

### 2. Combobox - быстрый старт

```tsx
import { Combobox, ComboboxOption } from '@/shared/ui/redesign-v3'

const options: ComboboxOption[] = [
  { id: '1', name: 'Вариант 1' },
  { id: '2', name: 'Вариант 2' },
  { id: '3', name: 'Вариант 3' }
]

// Одиночный выбор
<Combobox
  placeholder="Выберите вариант"
  options={options}
  value={selected}
  onChange={setSelected}
/>

// Множественный выбор
<Combobox
  multiple
  placeholder="Выберите варианты"
  options={options}
  value={selectedMultiple}
  onChange={setSelectedMultiple}
/>
```

**Props:**
- `options` - массив опций (обязательно!)
- `value` - T | T[] | null
- `onChange(value)` - обработчик (получает опцию напрямую!)
- `multiple` - множественный выбор
- `searchable` - включить поиск (по умолчанию true)
- `clearable` - кнопка очистки (по умолчанию true)

---

### 3. ClientSelectV3 - быстрый старт

```tsx
import { ClientSelectV3 } from '@/entities/User'

<ClientSelectV3
  clientId={selectedClientId}
  onChangeClient={setSelectedClientId}
  placeholder="Выберите клиента"
/>
```

**Props:**
- `clientId` - ID клиента (string)
- `onChangeClient(id: string)` - обработчик (получает ID напрямую!)
- `placeholder` - плейсхолдер

---

## ⚡ 5-минутный пример

Создайте форму за 5 минут:

```tsx
import { Input, Combobox } from '@/shared/ui/redesign-v3'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Mail, User } from 'lucide-react'

const QuickForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(null)
  
  const roles = [
    { id: '1', name: 'Admin' },
    { id: '2', name: 'User' },
    { id: '3', name: 'Manager' }
  ]
  
  const handleSubmit = () => {
    console.log({ name, email, role })
  }
  
  return (
    <VStack gap="16" max>
      <Input
        label="Имя"
        value={name}
        onChange={setName}
        addonLeft={<User size={18} />}
        fullWidth
      />
      
      <Input
        label="Email"
        value={email}
        onChange={setEmail}
        addonLeft={<Mail size={18} />}
        fullWidth
      />
      
      <Combobox
        label="Роль"
        options={roles}
        value={role}
        onChange={setRole}
        fullWidth
      />
      
      <Button onClick={handleSubmit}>
        Отправить
      </Button>
    </VStack>
  )
}
```

**Готово!** 🎉

---

## 🎨 Встроенные стили

Все компоненты автоматически используют:
- ✅ Glassmorphism эффекты
- ✅ Плавные анимации
- ✅ Адаптивный дизайн
- ✅ Тёмную тему
- ✅ Акцентный цвет проекта

Никакой дополнительной стилизации не требуется!

---

## 🔑 Ключевые отличия от MUI

### ❌ Было (MUI):
```tsx
onChange={(event, newValue) => setValue(newValue)}
renderInput={(params) => <TextField {...params} />}
```

### ✅ Стало (redesign-v3):
```tsx
onChange={setValue}
label="Лейбл"
```

**Проще и понятнее!**

---

## 📱 Адаптивность

Компоненты автоматически адаптируются:

```tsx
// На десктопе - полная ширина
<Input fullWidth />

// На мобильном - автоматически сжимается
// Ничего дополнительного делать не нужно!
```

---

## 🎯 Типичные use cases

### Поиск
```tsx
<Input
  placeholder="Поиск..."
  value={search}
  onChange={setSearch}
  addonLeft={<Search size={18} />}
/>
```

### Выбор из списка
```tsx
<Combobox
  placeholder="Выберите опцию"
  options={options}
  value={selected}
  onChange={setSelected}
/>
```

### Множественный выбор
```tsx
<Combobox
  multiple
  placeholder="Выберите несколько"
  options={options}
  value={selected}
  onChange={setSelected}
/>
```

### Выбор клиента (для admin)
```tsx
<ClientSelectV3
  clientId={clientId}
  onChangeClient={setClientId}
/>
```

---

## ⌨️ Горячие клавиши

### Combobox:
- `↓` / `↑` - навигация по опциям
- `Enter` - выбрать опцию
- `Escape` - закрыть список
- `Tab` - перейти к следующему элементу
- Начните печатать - автопоиск

---

## 🐛 Частые ошибки

### ❌ НЕ ДЕЛАЙТЕ ТАК:

```tsx
// Ожидание event в onChange
<Input onChange={(e) => setValue(e.target.value)} />

// Неправильный формат опций
<Combobox options={[{ userId: '1', userName: 'John' }]} />

// Event в Combobox onChange
<Combobox onChange={(event, value) => setValue(value)} />
```

### ✅ ПРАВИЛЬНО:

```tsx
// Прямое значение
<Input onChange={setValue} />

// Правильный формат: { id, name }
<Combobox options={[{ id: '1', name: 'John' }]} />

// Прямое значение
<Combobox onChange={setValue} />
```

---

## 📚 Дальнейшее изучение

- **Полная документация**: `src/shared/ui/redesign-v3/README.md`
- **Advanced примеры**: `docs/redesign-v3-advanced-examples.md`
- **Миграция с MUI**: `docs/migration-mui-to-v3.md`
- **Demo страница**: `src/pages/Redesignv3Demo`

---

## 💡 Подсказки

### Валидация
```tsx
const [email, setEmail] = useState('')
const [error, setError] = useState('')

<Input
  value={email}
  onChange={(val) => {
    setEmail(val)
    setError(val.includes('@') ? '' : 'Некорректный email')
  }}
  error={error}
/>
```

### Кастомные опции
```tsx
<Combobox
  options={users}
  getOptionLabel={(user) => `${user.name} (${user.email})`}
  renderOption={(user, selected) => (
    <div>
      <Avatar src={user.avatar} />
      <span>{user.name}</span>
      {selected && <Check size={16} />}
    </div>
  )}
/>
```

---

## 🚀 Готово к использованию!

Теперь вы знаете достаточно, чтобы начать работу с новыми компонентами.

**Happy coding!** 🎉
