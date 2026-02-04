# Дизайн-система aiPBX - Quick Start

> Быстрый старт для использования дизайн-системы в проекте aiPBX

## 🚀 Начало работы (2 минуты)

### 1. Импортируйте миксины

В начале вашего `.module.scss` файла:

```scss
@import '@/app/styles/variables/mixins';
```

### 2. Используйте готовые миксины

```scss
.MyCard {
    @include glass-card-primary;    // Glassmorphism карточка
    @include hover-lift-card;        // Hover эффект
    padding: var(--card-padding-md); // Отступы
}
```

## 🎯 Самые популярные миксины

```scss
// Карточки
@include glass-card-primary;      // Основная glassmorphism карточка
@include glass-card-secondary;    // Вторичная (чуть ярче)
@include glass-card-tertiary;     // Третичная (subtle)

// Hover эффекты
@include hover-lift-card;         // Подъём + тени + граница
@include hover-scale;             // Масштабирование
@include hover-icon;              // Для иконок

// Разделители
@include divider-gradient;        // Красивый градиентный
@include divider-solid;           // Простой

// Иконки
@include icon-container(30px);    // Контейнер для иконки
@include icon-avatar(44px);       // Аватар с иконкой

// Статусы
@include status-dot($color);      // Статусная точка с glow
@include chip-base;               // Chip/badge

// Кнопки
@include button-primary;          // Основная кнопка
@include button-outline;          // Outline кнопка

// Формы
@include input-base;              // Input поле
@include textarea-base;           // Textarea

// Responsive
@include mobile { ... }           // @media (max-width: 600px)
@include tablet { ... }           // @media (max-width: 800px)
```

## 🎨 Самые популярные переменные

```scss
// Glassmorphism
var(--glass-bg-primary)           // Фон карточки
var(--glass-blur-md)              // Blur эффект
var(--glass-border-primary)       // Граница

// Spacing
var(--space-2)    // 8px
var(--space-4)    // 16px
var(--space-6)    // 24px
var(--space-8)    // 32px

var(--card-padding-sm)            // 16px
var(--card-padding-md)            // 24px
var(--card-padding-lg)            // 32px

// Border radius
var(--radius-sm)  // 8px
var(--radius-md)  // 12px
var(--radius-lg)  // 16px
var(--radius-xl)  // 20px

// Shadows
var(--shadow-md)                  // Средняя тень
var(--shadow-lg)                  // Большая тень
var(--shadow-accent-md)           // Цветная тень (glow)

// Transitions
var(--transition-normal)          // all 0.2s ease-in-out
var(--transition-slow)            // all 0.4s spring
var(--transition-transform)       // transform 0.3s spring

// Hover эффекты
var(--hover-lift-md)              // translateY(-4px)
var(--hover-scale-md)             // scale(1.05)

// Статусы
var(--status-success)             // #10b981
var(--status-error)               // #ef4444
var(--status-warning)             // #f59e0b
var(--status-info)                // #3b82f6
```

## 📦 Типичные паттерны

### Карточка с hover эффектом

```scss
.Card {
    @include glass-card-primary;
    @include hover-lift-card;
    padding: var(--card-padding-md);
    
    .divider {
        @include divider-gradient;
    }
}
```

### Список карточек

```scss
.List {
    display: grid;
    gap: var(--space-6);
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    
    @include tablet {
        grid-template-columns: 1fr;
        gap: var(--space-4);
    }
}
```

### Иконка с контейнером

```scss
.IconWrapper {
    @include icon-container(30px);
    
    &:hover {
        @include hover-scale;
    }
}
```

### Статус индикатор

```scss
.Status {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    
    .dot {
        @include status-dot(var(--status-success));
        
        &.error {
            @include status-dot(var(--status-error));
        }
    }
}
```

### Форма

```scss
.Form {
    @include glass-card-secondary;
    padding: var(--card-padding-lg);
    
    input {
        @include input-base;
        margin-bottom: var(--space-4);
    }
    
    button {
        @include button-primary;
    }
}
```

## 📝 Чеклист для нового компонента

- [ ] Импортировать `@import '@/app/styles/variables/mixins';`
- [ ] Использовать `@include glass-card-primary` для карточки
- [ ] Добавить `@include hover-lift-card` для интерактивности
- [ ] Использовать `var(--card-padding-md)` вместо hardcoded padding
- [ ] Использовать `var(--space-*)` для gap/margin
- [ ] Использовать `@include divider-gradient` для разделителей
- [ ] Использовать `@include icon-container()` для иконок
- [ ] Добавить responsive с `@include mobile`, `@include tablet`

## 🔗 Полная документация

- 📖 [Полное руководство](./design-system.md)
- 🔧 [Руководство по рефакторингу](./refactoring-guide.md)
- 📊 [Анализ компонентов](./components-analysis.md)
- 📋 [Итоговая сводка](./DESIGN_SYSTEM_SUMMARY.md)

## ❓ FAQ

**Q: Какой миксин использовать для карточки?**  
A: `@include glass-card-primary` - основной выбор для большинства карточек.

**Q: Как добавить hover эффект?**  
A: `@include hover-lift-card` - для карточек, `@include hover-scale` - для кнопок/иконок.

**Q: Какие отступы использовать?**  
A: `var(--card-padding-md)` для padding карточек, `var(--space-4)` для gap между элементами.

**Q: Как сделать разделитель?**  
A: `@include divider-gradient` - красивый градиентный разделитель.

**Q: Нужно ли всё переписывать на дизайн-систему?**  
A: Нет, начните с новых компонентов, постепенно рефакторите существующие.

## 💡 Примеры из проекта

Посмотрите на эти компоненты как референс:
- `PublishWidgetsItem` - отличный пример glassmorphism карточки
- `PublishSipUrisItem` - статус индикаторы и chips
- `PbxServerItem` - контейнеры иконок и hover эффекты

---

**Happy coding! 🚀**

