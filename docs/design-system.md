# Дизайн-система aiPBX

## Обзор

Система глобальных переменных и миксинов для создания единообразного, премиального дизайна приложения в стиле Glassmorphism с плавными анимациями и микро-взаимодействиями.

## Структура

```
src/app/styles/
├── variables/
│   ├── global.scss           # Шрифты, размеры, z-index
│   ├── design-system.scss    # Переменные дизайн-системы
│   └── mixins.scss           # Переиспользуемые миксины
├── themes/
│   ├── normal.scss           # Светлая тема
│   └── dark.scss             # Тёмная тема
└── index.scss                # Главный файл
```

## CSS Переменные

### Glassmorphism эффекты

```scss
// Фоновые градиенты
--glass-bg-primary      // Основной glassmorphism
--glass-bg-secondary    // Вторичный (более яркий)
--glass-bg-tertiary     // Третичный (более тонкий)

// Blur эффекты
--glass-blur-sm         // 10px
--glass-blur-md         // 20px
--glass-blur-lg         // 30px
--glass-blur-xl         // 40px

// Границы
--glass-border-primary   // Основная граница
--glass-border-secondary // Вторичная
--glass-border-accent    // Акцентная (голубая)
--glass-border-subtle    // Тонкая
```

**Пример использования:**
```scss
.my-card {
    background: var(--glass-bg-primary);
    backdrop-filter: var(--glass-blur-md);
    border: var(--glass-border-primary);
}
```

### Тени и глубина

```scss
// Обычные тени
--shadow-xs, --shadow-sm, --shadow-md, --shadow-lg, --shadow-xl

// Цветные тени (glow эффекты)
--shadow-accent-sm, --shadow-accent-md, --shadow-accent-lg

// Glow эффекты для статусов
--glow-success   // Зелёный
--glow-error     // Красный
--glow-warning   // Оранжевый
--glow-info      // Синий
--glow-accent    // Голубой (акцент)
```

**Пример:**
```scss
.card:hover {
    box-shadow: var(--shadow-lg), var(--shadow-accent-md);
}
```

### Border Radius

```scss
--radius-xs   // 4px
--radius-sm   // 8px
--radius-md   // 12px
--radius-lg   // 16px
--radius-xl   // 20px
--radius-2xl  // 24px
--radius-full // 9999px (круглый)
```

### Transitions & Animations

```scss
// Timing functions
--ease-spring     // Пружинистый эффект (рекомендуется для карточек)
--ease-bounce     // Bounce эффект
--ease-in-out     // Стандартный

// Durations
--duration-fast   // 0.15s
--duration-normal // 0.2s
--duration-medium // 0.3s
--duration-slow   // 0.4s

// Готовые комбинации
--transition-fast
--transition-normal
--transition-slow
--transition-transform
--transition-opacity
--transition-colors
```

### Hover эффекты

```scss
// Подъём элемента
--hover-lift-sm   // translateY(-2px)
--hover-lift-md   // translateY(-4px)
--hover-lift-lg   // translateY(-6px)
--hover-lift-xl   // translateY(-8px)

// Масштабирование
--hover-scale-sm  // scale(1.02)
--hover-scale-md  // scale(1.05)
--hover-scale-lg  // scale(1.1)

// Комбинированные
--hover-card-primary  // Подъём + небольшое увеличение
--hover-button        // scale(1.05)
--hover-icon          // scale(1.1)
```

### Цвета статусов

```scss
// Success (Успех)
--status-success
--status-success-bg
--status-success-border

// Error (Ошибка)
--status-error
--status-error-bg
--status-error-border

// Warning (Предупреждение)
--status-warning
--status-warning-bg
--status-warning-border

// Info (Информация)
--status-info
--status-info-bg
--status-info-border

// Neutral (Нейтральный)
--status-neutral
--status-neutral-bg
--status-neutral-border
```

## SCSS Миксины

### Glassmorphism карточки

```scss
@import '@/app/styles/variables/mixins';

.my-card {
    @include glass-card-primary;    // Основная карточка
    @include glass-card-secondary;  // Вторичная
    @include glass-card-tertiary;   // Третичная
}
```

### Hover эффекты для карточек

```scss
.my-card {
    @include glass-card-primary;
    @include hover-lift-card;  // Подъём + тени + изменение границы
}
```

Эффект при наведении:
- Поднимается на 6px
- Добавляется большая тень и акцентный glow
- Граница становится голубой

### Интерактивные элементы

```scss
// Базовая интерактивность
.button {
    @include interactive-element;  // Курсор, opacity при hover, scale при click
}

// Готовые стили кнопок
.primary-button {
    @include button-primary;
}

.outline-button {
    @include button-outline;
}

// Hover эффекты
.icon {
    @include hover-icon;  // Увеличение + смена цвета
}

.simple-card {
    @include hover-lift-simple;  // Простой подъём
}

.scalable-element {
    @include hover-scale;  // Увеличение
}
```

### Разделители (Dividers)

```scss
.divider {
    @include divider-gradient;  // Градиентный разделитель
    @include divider-solid;     // Сплошной
    @include divider-vertical;  // Вертикальный
}
```

### Индикаторы статусов

```scss
// Статусная точка
.status-dot {
    @include status-dot(var(--status-success), 8px);
}

// Бейдж
.badge {
    @include status-badge(var(--status-success-bg), var(--status-success-border));
}

// Chip (таблетка)
.chip {
    @include chip-base;
}
```

### Контейнеры для иконок

```scss
// Иконка в контейнере
.icon-wrapper {
    @include icon-container(30px, var(--icon-bg-primary));
}

// Аватар с иконкой
.avatar {
    @include icon-avatar(44px);
}
```

### Текстовые стили

```scss
// Градиентный текст
.gradient-text {
    @include text-gradient;
}

// Обрезка текста
.truncated {
    @include text-truncate;  // ... в конце
}

.clamped {
    @include text-clamp(3);  // Показать 3 строки, остальное ...
}
```

### Формы

```scss
// Input поле
input[type="text"] {
    @include input-base;
}

// Textarea
textarea {
    @include textarea-base;
}
```

### Код блоки

```scss
pre code {
    @include code-block;
}
```

### Responsive миксины

```scss
.element {
    padding: 24px;
    
    @include tablet {
        padding: 16px;  // На планшетах и меньше
    }
    
    @include mobile {
        padding: 12px;  // На мобильных
    }
}
```

Доступные: `@include mobile`, `@include tablet`, `@include desktop`, `@include large-desktop`

### Layout helpers

```scss
.centered {
    @include flex-center;  // display: flex + center всё
}

.between {
    @include flex-between;  // justify-content: space-between
}

.absolute-centered {
    @include absolute-center;  // Абсолютное центрирование
}

.full {
    @include full-size;  // width: 100%, height: 100%
}
```

### Анимации

```scss
// Shimmer эффект для скелетонов
.skeleton {
    @include skeleton-shimmer;
}

// Pulsing анимация
.loading-dot {
    @include pulse-animation;
}

// Spinning (вращение)
.spinner {
    @include spin-animation;
}
```

### Accessibility

```scss
// Фокус для клавиатурной навигации
.button {
    @include focus-visible;
}

// Screen-reader only (скрыть визуально, но доступно для скрин-ридеров)
.sr-only {
    @include sr-only;
}
```

## Примеры применения

### Пример 1: Glassmorphism карточка с hover эффектом

```scss
.PublishWidgetsItem {
    @include glass-card-primary;
    @include hover-lift-card;
    
    .content {
        padding: var(--card-padding-md);
    }
    
    .divider {
        @include divider-gradient;
    }
    
    .status-badge {
        @include chip-base;
        
        &.active {
            .status-dot {
                @include status-dot(var(--status-success));
            }
        }
    }
    
    .icon-wrapper {
        @include icon-container(30px);
    }
}
```

### Пример 2: Список с карточками

```scss
.CardList {
    display: grid;
    gap: var(--space-6);
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    
    @include tablet {
        grid-template-columns: 1fr;
        gap: var(--space-4);
    }
}

.Card {
    @include glass-card-primary;
    @include hover-lift-card;
    
    .header {
        @include flex-between;
        margin-bottom: var(--space-4);
    }
    
    .avatar {
        @include icon-avatar(48px);
        @include hover-scale;
    }
}
```

### Пример 3: Форма с input полями

```scss
.Form {
    @include glass-card-secondary;
    padding: var(--card-padding-lg);
    
    .input {
        @include input-base;
        margin-bottom: var(--space-4);
    }
    
    .textarea {
        @include textarea-base;
    }
    
    .submit-button {
        @include button-primary;
        @include hover-scale;
    }
}
```

### Пример 4: Статус индикаторы

```scss
.StatusIndicator {
    @include flex-center;
    gap: var(--space-2);
    
    .dot {
        @include status-dot(var(--status-success));
        
        &.error {
            @include status-dot(var(--status-error));
        }
        
        &.loading {
            @include status-dot(var(--status-neutral));
            @include pulse-animation;
        }
    }
}
```

## Best Practices

### 1. Использование переменных вместо hardcode

❌ **Плохо:**
```scss
.card {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}
```

✅ **Хорошо:**
```scss
.card {
    @include glass-card-primary;
}
```

### 2. Использование миксинов для повторяющихся паттернов

❌ **Плохо:**
```scss
.card1 {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    }
}

.card2 {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    }
}
```

✅ **Хорошо:**
```scss
.card1, .card2 {
    @include hover-lift-card;
}
```

### 3. Использование spacing переменных

❌ **Плохо:**
```scss
.content {
    padding: 24px;
    gap: 16px;
    margin-bottom: 32px;
}
```

✅ **Хорошо:**
```scss
.content {
    padding: var(--card-padding-md);
    gap: var(--space-4);
    margin-bottom: var(--space-8);
}
```

### 4. Responsive дизайн через миксины

❌ **Плохо:**
```scss
.card {
    padding: 24px;
}

@media (max-width: 800px) {
    .card {
        padding: 16px;
    }
}
```

✅ **Хорошо:**
```scss
.card {
    padding: var(--card-padding-md);
    
    @include tablet {
        padding: var(--card-padding-sm);
    }
}
```

### 5. Семантические имена статусов

✅ **Хорошо:**
```scss
.status {
    &.success {
        @include status-dot(var(--status-success));
    }
    
    &.error {
        @include status-dot(var(--status-error));
    }
}
```

## Обновление существующих компонентов

Для приведения существующего компонента к дизайн-системе:

1. Импортируйте миксины:
```scss
@import '@/app/styles/variables/mixins';
```

2. Замените hardcoded значения на переменные:
```scss
// Было
background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
border-radius: 20px;

// Стало
background: var(--glass-bg-primary);
border-radius: var(--radius-xl);
```

3. Используйте миксины для общих паттернов:
```scss
// Было
position: relative;
background: linear-gradient(...);
backdrop-filter: blur(20px);
border: 1px solid rgba(...);
// ... много кода

// Стало
@include glass-card-primary;
```

## Заключение

Данная дизайн-система позволяет:
- ✅ Быстро создавать красивые, единообразные компоненты
- ✅ Легко поддерживать и обновлять дизайн глобально
- ✅ Избегать дублирования кода
- ✅ Обеспечивать премиальный внешний вид с Glassmorphism
- ✅ Плавные анимации и микро-взаимодействия out-of-the-box
