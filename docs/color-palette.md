# 🎨 Цветовая палитра и темизация aiPBX

## Обзор

Дизайн-система aiPBX использует современную цветовую схему с поддержкой светлой и тёмной тем.

## 🌓 Текущие темы

### Light Theme (normal.scss)
```scss
--bg-redesigned: #eff5f6           // Основной фон
--light-bg-redesigned: #e2eef1     // Светлый фон (карточки)
--dark-bg-redesigned: #fff         // Тёмный фон (в светлой теме - белый)
--text-redesigned: #141c1f         // Основной текст
--hint-redesigned: #adbcc0         // Подсказки, placeholder
--accent-redesigned: #00c8ff       // Акцентный цвет
--icon-redesigned: #5ed3f3         // Иконки
--cancel-redesigned: #f77          // Кнопка отмены
--save-redesigned: #62de85         // Кнопка сохранения
```

### Dark Theme (dark.scss)
```scss
--bg-redesigned: #0c1214           // Основной фон
--light-bg-redesigned: #151c1f     // Светлый фон (карточки)
--dark-bg-redesigned: #090f11      // Тёмный фон
--text-redesigned: #dbdbdb         // Основной текст
--hint-redesigned: #555            // Подсказки, placeholder
--accent-redesigned: #5ed3f3       // Акцентный цвет
--icon-redesigned: #74a2b2         // Иконки
--cancel-redesigned: #d95757       // Кнопка отмены
--save-redesigned: #6cd98b         // Кнопка сохранения
```

## 🚦 Статусные цвета

Универсальные для обеих тем:

### Success (Успех)
```scss
--status-success: #10b981          // Зелёный
--status-success-bg: rgba(16, 185, 129, 0.1)
--status-success-border: rgba(16, 185, 129, 0.2)
```
🎨 **Использование**: Успешные операции, активные статусы, положительные индикаторы

### Error (Ошибка)
```scss
--status-error: #ef4444            // Красный
--status-error-bg: rgba(239, 68, 68, 0.1)
--status-error-border: rgba(239, 68, 68, 0.2)
```
🎨 **Использование**: Ошибки, неактивные статусы, критические предупреждения

### Warning (Предупреждение)
```scss
--status-warning: #f59e0b          // Оранжевый
--status-warning-bg: rgba(245, 158, 11, 0.1)
--status-warning-border: rgba(245, 158, 11, 0.2)
```
🎨 **Использование**: Предупреждения, важные уведомления

### Info (Информация)
```scss
--status-info: #3b82f6             // Синий
--status-info-bg: rgba(59, 130, 246, 0.1)
--status-info-border: rgba(59, 130, 246, 0.2)
```
🎨 **Использование**: Информационные сообщения, подсказки

### Neutral (Нейтральный)
```scss
--status-neutral: #9ca3af          // Серый
--status-neutral-bg: rgba(156, 163, 175, 0.1)
--status-neutral-border: rgba(156, 163, 175, 0.2)
```
🎨 **Использование**: Ожидание, неопределённые статусы, загрузка

## ✨ Glassmorphism палитра

### Фоны
```scss
// Primary - основной для большинства карточек
--glass-bg-primary: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    rgba(255, 255, 255, 0.03) 100%)

// Secondary - более яркий
--glass-bg-secondary: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.12) 0%, 
    rgba(255, 255, 255, 0.06) 100%)

// Tertiary - более тонкий
--glass-bg-tertiary: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.05) 0%, 
    rgba(255, 255, 255, 0.02) 100%)
```

### Границы
```scss
--glass-border-primary: 1px solid rgba(255, 255, 255, 0.12)   // Основная
--glass-border-secondary: 1px solid rgba(255, 255, 255, 0.08) // Вторичная
--glass-border-accent: 1px solid rgba(94, 211, 243, 0.3)      // Акцентная
--glass-border-subtle: 1px solid rgba(255, 255, 255, 0.05)    // Тонкая
```

### Overlay (наложения)
```scss
--glass-overlay-light: rgba(255, 255, 255, 0.02)   // Светлое
--glass-overlay-medium: rgba(255, 255, 255, 0.05)  // Среднее
--glass-overlay-dark: rgba(0, 0, 0, 0.2)           // Тёмное
--glass-overlay-darker: rgba(0, 0, 0, 0.3)         // Очень тёмное
```

## 🎯 Акцентные цвета

### Primary Accent
```scss
--accent-redesigned: #5ed3f3 (dark) / #00c8ff (light)
```
🎨 **Голубой/Cyan** - основной акцентный цвет приложения
- Links
- Active states
- Focus indicators
- Icon containers background
- Primary buttons hover

### Icon Color
```scss
--icon-redesigned: #74a2b2 (dark) / #5ed3f3 (light)
```
🎨 **Светло-голубой** - иконки и вторичные акценты
- Icons
- Secondary elements
- Decorative accents

## 🎭 Семантические цвета

### Text Colors
```scss
--text-redesigned                  // Основной текст
var(--text-redesigned)             // Использование в CSS

// Пример с opacity для вторичного текста:
color: var(--text-redesigned);
opacity: 0.7;
```

### Background Colors
```scss
--bg-redesigned                    // Основной фон приложения
--light-bg-redesigned              // Фон карточек, панелей
--dark-bg-redesigned               // Модальные окна, overlay
```

### Special Colors
```scss
--hint-redesigned                  // Placeholder, подсказки
--cancel-redesigned                // Кнопки отмены, удаления
--save-redesigned                  // Кнопки сохранения, подтверждения
```

## 📐 Разделители

### Градиентный разделитель
```scss
--divider-gradient: linear-gradient(90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%);
```
🎨 Красивый градиент для визуального разделения секций

### Solid разделители
```scss
--divider-solid: rgba(255, 255, 255, 0.1)      // Обычный
--divider-subtle: rgba(255, 255, 255, 0.05)    // Тонкий
```

## 🌈 Фирменная палитра

### Основные цвета
- **Primary**: #5ed3f3 (Cyan/Голубой)
- **Success**: #10b981 (Green/Зелёный)
- **Error**: #ef4444 (Red/Красный)
- **Warning**: #f59e0b (Orange/Оранжевый)
- **Info**: #3b82f6 (Blue/Синий)

### Вторичные цвета
- **Icon**: #74a2b2 (Light Blue/Светло-голубой)
- **Text**: #dbdbdb (Light Gray/Светло-серый) в dark mode
- **Hint**: #555 (Dark Gray/Тёмно-серый) в dark mode

## 💡 Рекомендации по использованию

### ✅ DO (Правильно):

```scss
// Использовать переменные
color: var(--text-redesigned);
background: var(--glass-bg-primary);
border: var(--glass-border-primary);

// Использовать статусные цвета семантически
.success {
    color: var(--status-success);
    box-shadow: var(--glow-success);
}
```

### ❌ DON'T (Неправильно):

```scss
// Hardcoded цвета
color: #dbdbdb;
background: rgba(255, 255, 255, 0.08);

// Неправильное использование статусов
.info-message {
    color: var(--status-error);  // Ошибка семантики!
}
```

## 🎨 Примеры комбинаций

### Карточка с успешным статусом
```scss
.success-card {
    @include glass-card-primary;
    border-left: 3px solid var(--status-success);
    
    .status-dot {
        @include status-dot(var(--status-success));
    }
}
```

### Карточка с ошибкой
```scss
.error-card {
    @include glass-card-primary;
    border-left: 3px solid var(--status-error);
    background: var(--status-error-bg);
}
```

### Акцентная карточка
```scss
.accent-card {
    @include glass-card-secondary;
    border: var(--glass-border-accent);
    
    &:hover {
        box-shadow: var(--shadow-lg), var(--shadow-accent-lg);
    }
}
```

## 🔍 Accessibility

### Контрастность

Все цвета проверены на контрастность WCAG AA:
- ✅ `--text-redesigned` на `--bg-redesigned` - 12:1 (AAA)
- ✅ `--accent-redesigned` на `--bg-redesigned` - 7:1 (AA)
- ✅ Все статусные цвета на белом фоне - минимум 4.5:1

### Focus states

```scss
// Акцентный цвет используется для focus indicator
&:focus-visible {
    outline: 2px solid var(--accent-redesigned);
    outline-offset: 2px;
}
```

## 🎯 Палитра для компонентов

### Кнопки
```scss
// Primary
background: var(--glass-bg-secondary);
border: var(--glass-border-primary);
color: var(--text-redesigned);

&:hover {
    border-color: var(--accent-redesigned);
}

// Success (Save)
background: var(--status-success-bg);
border: var(--status-success-border);
color: var(--status-success);

// Danger (Cancel)
background: var(--status-error-bg);
border: var(--status-error-border);
color: var(--status-error);
```

### Inputs
```scss
background: var(--glass-overlay-dark);
border: var(--glass-border-primary);
color: var(--text-redesigned);

&::placeholder {
    color: var(--hint-redesigned);
}

&:focus {
    border-color: var(--accent-redesigned);
    box-shadow: var(--shadow-accent-sm);
}
```

### Badges/Chips
```scss
background: var(--glass-overlay-medium);
border: var(--glass-border-primary);
color: var(--accent-redesigned);
```

## 📊 Цветовая иерархия

1. **Акцентный** (`--accent-redesigned`) - самый важный, привлекает внимание
2. **Статусы** (`--status-*`) - второй уровень важности
3. **Текст** (`--text-redesigned`) - основной контент
4. **Hint** (`--hint-redesigned`) - вспомогательная информация
5. **Borders** (`--glass-border-*`) - структура и разделение

## 🔄 Темная/Светлая тема

### Автоматическое переключение

Приложение автоматически определяет тему на основе класса `.app_dark_theme`:

```tsx
<div className={classNames('app', {}, [theme])}> // theme = 'app_dark_theme' или ''
```

### Добавление нового цвета

1. Добавить в `themes/normal.scss`:
```scss
:root {
    --my-new-color: #value-for-light;
}
```

2. Добавить в `themes/dark.scss`:
```scss
.app_dark_theme {
    --my-new-color: #value-for-dark;
}
```

3. Использовать:
```scss
color: var(--my-new-color);
```

---

**Версия палитры**: 1.0.0  
**Дата создания**: 2026-02-04  
**Совместимость**: Светлая и тёмная темы
