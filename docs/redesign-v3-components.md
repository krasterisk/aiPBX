# Redesign V3 Components

## Button

Новый компонент кнопки, соответствующий дизайн-системе.

### Расположение
`src/shared/ui/redesign-v3/Button`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'outline' \| 'clear' \| 'accent' | 'primary' | Визуальный стиль |
| size | 'm' \| 'l' \| 'xl' | 'm' | Размер |
| color | 'normal' \| 'success' \| 'error' | 'normal' | Цветовая схема |
| square | boolean | false | Квадратная кнопка (для иконок) |
| fullWidth | boolean | false | Растянуть на всю ширину |
| addonLeft | ReactNode | - | Слот слева |
| addonRight | ReactNode | - | Слот справа |

### Пример использования

```tsx
import { Button } from '@/shared/ui/redesign-v3/Button'

// Basic
<Button>Click me</Button>

// Outline
<Button variant="outline">Secondary</Button>

// With Icon
<Button addonLeft={<Icon />}>With Icon</Button>

// Square Icon Button
<Button variant="clear" square>
  <Icon />
</Button>
```

## Combobox

Компонент выбора с поддержкой поиска и множественного выбора.

### Расположение
`src/shared/ui/redesign-v3/Combobox`

### Пример использования (Multi-select)

```tsx
<Combobox
  multiple
  value={selectedItems} // Array
  onChange={setSelectedItems}
  options={options}
  placeholder="Select items..."
/>
```
