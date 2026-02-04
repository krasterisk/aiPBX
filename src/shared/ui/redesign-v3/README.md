# Redesign v3 Components

Новая версия UI компонентов, созданная в соответствии с дизайн-системой проекта **aiPBX** без использования Material-UI или других внешних библиотек.

## Компоненты

### Input

Переиспользуемый компонент для ввода текста с поддержкой различных размеров, аддонов и состояний.

#### Использование:

```tsx
import { Input } from '@/shared/ui/redesign-v3/Input'
import { Search } from 'lucide-react'

// Базовое использование
<Input
  placeholder="Введите текст"
  value={value}
  onChange={setValue}
/>

// С аддонами
<Input
  placeholder="Поиск"
  value={search}
  onChange={setSearch}
  addonLeft={<Search size={18} />}
/>

// С лейблом и ошибкой
<Input
  label="Email"
  value={email}
  onChange={setEmail}
  error="Некорректный email"
  fullWidth
/>

// Различные размеры
<Input size="s" placeholder="Маленький" />
<Input size="m" placeholder="Средний (по умолчанию)" />
<Input size="l" placeholder="Большой" />
```

#### Свойства:

- `value?: string | number` - значение инпута
- `onChange?: (value: string) => void` - обработчик изменения
- `placeholder?: string` - плейсхолдер
- `label?: string` - лейбл над инпутом
- `error?: string` - текст ошибки
- `size?: 's' | 'm' | 'l'` - размер (по умолчанию 'm')
- `addonLeft?: ReactNode` - элемент слева (обычно иконка)
- `addonRight?: ReactNode` - элемент справа
- `readonly?: boolean` - только для чтения
- `disabled?: boolean` - отключен
- `autofocus?: boolean` - автофокус
- `fullWidth?: boolean` - на всю ширину контейнера

---

### Combobox

Полнофункциональный выпадающий список с поддержкой:
- Одиночного и множественного выбора
- Поиска
- Клавиатурной навигации
- Кастомного рендеринга опций

#### Использование:

```tsx
import { Combobox, ComboboxOption } from '@/shared/ui/redesign-v3/Combobox'

const options: ComboboxOption[] = [
  { id: '1', name: 'Вариант 1' },
  { id: '2', name: 'Вариант 2' },
  { id: '3', name: 'Вариант 3' }
]

// Одиночный выбор
<Combobox
  placeholder="Выберите вариант"
  options={options}
  value={selectedOption}
  onChange={setSelectedOption}
/>

// Множественный выбор
<Combobox
  multiple
  placeholder="Выберите варианты"
  options={options}
  value={selectedOptions}
  onChange={setSelectedOptions}
/>

// С поиском
<Combobox
  searchable
  placeholder="Поиск и выбор"
  options={options}
  value={value}
  onChange={setValue}
  noOptionsText="Ничего не найдено"
/>

// С кастомным рендерингом
<Combobox
  options={options}
  value={value}
  onChange={setValue}
  renderOption={(option, selected) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Avatar src={option.avatar} />
      <span>{option.name}</span>
      {selected && <Check size={16} />}
    </div>
  )}
/>
```

#### Свойства:

- `options: T[]` - массив опций (обязательно)
- `value?: T | T[] | null` - выбранное значение
- `onChange?: (value: T | T[] | null) => void` - обработчик изменения
- `multiple?: boolean` - множественный выбор
- `searchable?: boolean` - включить поиск (по умолчанию true)
- `clearable?: boolean` - возможность очистить выбор (по умолчанию true)
- `label?: string` - лейбл
- `placeholder?: string` - плейсхолдер
- `error?: string` - текст ошибки
- `disabled?: boolean` - отключен
- `fullWidth?: boolean` - на всю ширину
- `size?: 's' | 'm' | 'l'` - размер (по умолчанию 'm')
- `getOptionLabel?: (option: T) => string` - функция получения текста опции
- `getOptionKey?: (option: T) => string` - функция получения ключа опции
- `isOptionEqualToValue?: (option: T, value: T) => boolean` - функция сравнения опций
- `renderOption?: (option: T, selected: boolean) => ReactNode` - кастомный рендеринг опции
- `noOptionsText?: string` - текст когда нет опций

#### Клавиатурная навигация:

- `ArrowDown` - следующая опция
- `ArrowUp` - предыдущая опция
- `Enter` - выбрать опцию
- `Escape` - закрыть список
- `Tab` - закрыть список и перейти к следующему элементу

---

### ClientSelectV3

Специализированный компонент для выбора клиента, построенный на основе Combobox.

#### Использование:

```tsx
import { ClientSelectV3 } from '@/entities/User/ui/ClientSelectV3'

<ClientSelectV3
  clientId={selectedClientId}
  onChangeClient={setSelectedClientId}
  placeholder="Выберите клиента"
/>

// С лейблом
<ClientSelectV3
  label="Клиент"
  clientId={clientId}
  onChangeClient={handleClientChange}
  fullWidth
/>
```

#### Свойства:

- `clientId?: string` - ID выбранного клиента
- `onChangeClient?: (clientId: string) => void` - обработчик изменения
- `label?: string` -  лейбл
- `placeholder?: string` - плейсхолдер (по умолчанию "Выберите клиента")
- `fullWidth?: boolean` - на всю ширину (по умолчанию true)
- `size?: 's' | 'm' | 'l'` - размер (по умолчанию 'm')
- `error?: string` - текст ошибки
- `className?: string` - дополнительный класс

---

## Дизайн система

Все компоненты используют переменные и миксины из дизайн-системы проекта:

### Используемые миксины:

- `@include glass-card-secondary` - glassmorphism эффекты для выпадающего списка
- `@include flex-center` - центрирование элементов
- `@include interactive-element` - интерактивные элементы
- `@include chip-base` - стили для чипов (множественный выбор)
- `@include custom-scrollbar` - кастомный скроллбар
- `@include mobile`, `@include tablet` - адаптивность

### Используемые переменные:

- Цвета: `--text-redesigned`, `--accent-redesigned`, `--hint-redesigned`, `--icon-redesigned`
- Фоны: `--input-bg`, `--glass-overlay-medium`, `--glass-overlay-dark`
- Границы: `--input-border`, `--radius-lg`, `--radius-md`
- Отступы: `--space-1`, `--space-2`, `--space-4`, `--input-padding`
- Анимации: `--transition-colors`, `--transition-transform`, `--transition-fast`
- Тени: `--shadow-accent-sm`
- Z-index: `--z-dropdown`

## Особенности реализации

### Input

- **Glassmorphism эффекты** с полупрозрачным фоном и размытием
- **Плавные анимации** при фокусе и наведении
- **Адаптивный дизайн** для мобильных устройств
- **Поддержка аддонов** слева и справа (обычно иконки)
- **Состояния**: обычное, focused, readonly, disabled, error
- **Автофокус** с использованием useRef

### Combobox

- **Нативная реализация** без MUI или других библиотек
- **Виртуализация не требуется** для средних списков (до 1000 элементов)
- **Chips для множественного выбора** с анимацией появления/удаления
- **Click outside** для закрытия выпадающего списка
- **Автоматический скролл** к выделенной опции
- **Анимации**: slideDown для меню, checkIn для галочки выбора
- **Поиск по опциям** с debounce (можно добавить при необходимости)

### ClientSelectV3

- **Интеграция с RTK Query** через useGetAllUsers
- **Загрузка состояния** с соответствующим UI
- **Автоматическое преобразование** данных в формат ComboboxOption
- **Типобезопасность** с полной поддержкой TypeScript

## FSD Architecture

Компоненты строго следуют принципам Feature-Sliced Design:

```
shared/ui/redesign-v3/
├── Input/
│   ├── Input.tsx          # Компонент
│   ├── Input.module.scss  # Стили
│   └── index.ts           # Публичный API
├── Combobox/
│   ├── Combobox.tsx
│   ├── Combobox.module.scss
│   └── index.ts
└── index.ts               # Barrel export

entities/User/ui/
└── ClientSelectV3/
    ├── ClientSelectV3.tsx
    ├── index.ts
```

## Миграция с MUI

Чтобы мигрировать с MUI Combobox на новый компонент:

### Было (MUI):
```tsx
import { Autocomplete, TextField } from '@mui/material'

<Autocomplete
  options={options}
  value={value}
  onChange={(event, newValue) => setValue(newValue)}
  renderInput={(params) => <TextField {...params} label="Label" />}
/>
```

### Стало (redesign-v3):
```tsx
import { Combobox } from '@/shared/ui/redesign-v3/Combobox'

<Combobox
  label="Label"
  options={options}
  value={value}
  onChange={setValue}
/>
```

## Лучшие практики

1. **Используйте типизацию**: Всегда указывайте тип для Combobox: `Combobox<MyOptionType>`
2. **Мемоизируйте опции**: Используйте `useMemo` для массива опций, чтобы избежать пересоздания
3. **Обработчики через useCallback**: Оборачивайте onChange в useCallback для оптимизации
4. **Кастомные ключи**: При необходимости используйте `getOptionKey` и `getOptionLabel`
5. **Доступность**: Компоненты поддерживают клавиатурную навигацию и ARIA-атрибуты

## Примеры использования

См. реальные примеры в:
- `src/entities/Assistants/ui/AssistantsListHeaderV3/` - использование Input и ClientSelectV3
- `src/entities/User/ui/ClientSelectV3/` - обертка над Combobox для конкретного use case
