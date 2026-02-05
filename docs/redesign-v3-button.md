# Компонент Button (Redesign V3)

Универсальный компонент кнопки, полностью поддерживающий темы приложения без необходимости дополнительной кастомизации.

## Расположение
`src/shared/ui/redesign-v3/Button`

## Основные возможности

### Варианты (variant)
- **`primary`** - Основная кнопка с заливкой
- **`outline`** - Кнопка с обводкой без заливки
- **`clear`** - Прозрачная кнопка
- **`accent`** - Акцентная кнопка с заливкой

### Цвета (color)
- **`normal`** - Стандартный цвет (по умолчанию)
- **`success`** - Зеленый цвет для успешных действий
- **`error`** - Красный цвет для опасных действий
- **`accent`** - Акцентный цвет (голубой)

### Размеры (size)
- **`m`** - 40px (по умолчанию)
- **`l`** - 48px
- **`xl`** - 56px

### Дополнительные props
- `square` - Квадратная кнопка (для иконок)
- `fullWidth` - Растянуть на всю ширину
- `disabled` - Отключенное состояние
- `addonLeft` - Элемент слева (обычно иконка)
- `addonRight` - Элемент справа

## Примеры использования

### Основная кнопка
```tsx
<Button variant="primary">
    Сохранить
</Button>
```

### Outline кнопка с акцентным цветом
```tsx
<Button variant="outline" color="accent">
    Создать
</Button>
```

### Кнопка с иконкой
```tsx
<Button 
    variant="outline" 
    color="accent"
    addonLeft={<Plus size={20} />}
>
    Создать ассистента
</Button>
```

### Success кнопка
```tsx
<Button variant="primary" color="success">
    Подтвердить
</Button>
```

### Error кнопка
```tsx
<Button variant="outline" color="error">
    Удалить
</Button>
```

### Квадратная кнопка для иконки
```tsx
<Button variant="clear" square>
    <Settings size={20} />
</Button>
```

## Комбинации variant + color

Компонент поддерживает комбинации вариантов и цветов:

| variant | color | Описание |
|---------|--------|----------|
| `primary` | `normal` | Стандартная основная кнопка |
| `primary` | `success` | Зеленая кнопка с заливкой |
| `primary` | `error` | Красная кнопка с заливкой |
| `primary` | `accent` | Голубая акцентная кнопка |
| `outline` | `normal` | Обводка серого цвета |
| `outline` | `success` | Обводка зеленого цвета |
| `outline` | `error` | Обводка красного цвета |
| `outline` | `accent` | **Обводка с акцентным цветом и легким фоном** |
| `clear` | любой | Прозрачная кнопка |
| `accent` | любой | Акцентная кнопка (используется variant) |

## Поддержка тем

Компонент **автоматически адаптируется** к светлой и темной темам приложения, используя CSS-переменные из:
- `src/app/styles/themes/normal.scss` - для светлой темы
- `src/app/styles/themes/dark.scss` - для темной темы

### Используемые переменные

Кнопка использует следующие переменные из тем:
- `--accent-redesigned` - Акцентный цвет
- `--accent-dark` - Темнее акцентный цвет (для hover)
- `--text-redesigned` - Цвет текста
- `--button-primary-bg` - Фон основной кнопки
- `--button-primary-border` - Граница основной кнопки
- `--button-outline-bg` - Фон outline кнопки
- `--button-outline-border` - Граница outline кнопки
- `--button-outline-hover-bg` - Фон при наведении
- `--glass-border-accent` - Акцентная граница (для outline + accent)
- `--icon-bg-primary` - Фон для акцентной outline кнопки
- `--icon-bg-secondary` - Фон при наведении для акцентной outline
- `--status-success` - Цвет успеха
- `--status-error` - Цвет ошибки

## Миграция с кастомных стилей

### ❌ Старый подход (не рекомендуется)
```tsx
// AssistantsListHeader.tsx
<Button 
    variant="outline"
    className={cls.createBtn}  // Кастомные стили
>
    Создать
</Button>

// AssistantsListHeader.module.scss
.createBtn {
    border: 1px solid rgba(94, 211, 243, 0.2) !important;
    background: rgba(94, 211, 243, 0.05) !important;
    // ... много кастомных стилей
}
```

### ✅ Новый подход (рекомендуется)
```tsx
// AssistantsListHeader.tsx
<Button 
    variant="outline"
    color="accent"  // Автоматически применит правильные цвета для темы
>
    Создать
</Button>

// Никаких дополнительных стилей не требуется!
```

## Преимущества

1. **Автоматическая поддержка тем** - Не нужно вручную настраивать цвета для каждой темы
2. **Переиспользуемость** - Один компонент для всех случаев
3. **Консистентность** - Единый стиль по всему приложению
4. **Простота использования** - Достаточно указать `variant` и `color`
5. **Легкая поддержка** - Стили централизованы в одном месте

## Типы (TypeScript)

```typescript
export type ButtonVariant = 'primary' | 'outline' | 'clear' | 'accent'
export type ButtonSize = 'm' | 'l' | 'xl'
export type ButtonColor = 'normal' | 'success' | 'error' | 'accent'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    color?: ButtonColor
    square?: boolean
    fullWidth?: boolean
    disabled?: boolean
    addonLeft?: ReactNode
    addonRight?: ReactNode
}
```
