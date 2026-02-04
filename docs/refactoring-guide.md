# Руководство по рефакторингу компонентов

## Общий подход

При рефакторинге компонента для использования дизайн-системы следуйте этим шагам:

### Шаг 1: Импортируйте миксины

В начало SCSS модуля компонента добавьте:

```scss
@import '@/app/styles/variables/mixins';
```

### Шаг 2: Анализ текущих стилей

Определите, какие паттерны используются:
- Glassmorphism эффекты?
- Hover анимации?
- Статус индикаторы?
- Разделители?
- Иконки в контейнерах?

### Шаг 3: Замена на переменные и миксины

Замените hardcoded значения на переменные дизайн-системы.

## Пример рефакторинга: ToolItem

### До рефакторинга

```scss
.ToolItem {
    position: relative;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 20px;
    width: 100%;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.2);
    
    &:hover {
        cursor: pointer;
        transform: translateY(-6px);
        box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.25),
            0 0 20px rgba(94, 211, 243, 0.1);
        border-color: rgba(94, 211, 243, 0.3);
        
        .avatar {
            transform: scale(1.05);
        }
    }
    
    .content {
        position: relative;
        z-index: 10;
        width: 100%;
        padding: 24px;
    }
    
    .avatar {
        width: 44px;
        height: 44px;
        background: rgba(94, 211, 243, 0.15);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--accent-redesigned);
        transition: transform 0.3s ease;
        flex-shrink: 0;
    }
    
    .divider {
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 100%);
        margin: 20px 0;
    }
    
    .chip {
        border: 1px solid var(--accent-redesigned);
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
    }
}
```

### После рефакторинга

```scss
@import '@/app/styles/variables/mixins';

.ToolItem {
    @include glass-card-primary;
    @include hover-lift-card;
    
    &:hover {
        .avatar {
            @include hover-scale;
        }
    }
    
    .content {
        position: relative;
        z-index: 10;
        width: 100%;
        padding: var(--card-padding-md);
    }
    
    .avatar {
        @include icon-avatar(44px);
    }
    
    .divider {
        @include divider-gradient;
    }
    
    .chip {
        @include chip-base;
    }
}
```

### Преимущества:
- Сократили ~70 строк до ~25
- Улучшили читабельность
- Единообразие с другими компонентами
- Легче поддерживать

## Чеклист для рефакторинга компонента

### Основная карточка
- [ ] Заменить glassmorphism стили на `@include glass-card-primary`
- [ ] Заменить hover эффекты на `@include hover-lift-card`
- [ ] Использовать `var(--card-padding-md)` для padding

### Разделители
- [ ] Заменить на `@include divider-gradient` или `@include divider-solid`

### Иконки и аватары
- [ ] Контейнеры иконок: `@include icon-container()`
- [ ] Аватары: `@include icon-avatar()`

### Статусы
- [ ] Точки статусов: `@include status-dot()`
- [ ] Бейджи: `@include status-badge()`
- [ ] Chips: `@include chip-base`

### Интерактивные элементы
- [ ] Кнопки: `@include button-primary` или `@include button-outline`
- [ ] Hover на иконках: `@include hover-icon`
- [ ] Базовая интерактивность: `@include interactive-element`

### Текст
- [ ] Обрезка: `@include text-truncate`
- [ ] Градиент: `@include text-gradient`

### Responsive
- [ ] Использовать `@include mobile`, `@include tablet` вместо media queries

### Spacing
- [ ] Заменить hardcoded padding/margin на переменные:
  - `24px` → `var(--card-padding-md)`
  - `16px` → `var(--space-4)`
  - `8px` → `var(--space-2)`

### Анимации
- [ ] Transitions: `var(--transition-normal)`, `var(--transition-slow)`
- [ ] Transform: `var(--hover-lift-md)`, `var(--hover-scale-md)`

## Приоритетные компоненты для рефакторинга

Согласно анализу, следующие компоненты уже частично используют Glassmorphism и должны быть приведены к единой системе:

### Высокий приоритет (уже используют Glassmorphism, нужна унификация):

1. **PublishWidgetsItem** - уже использует Glassmorphism
2. **PublishSipUrisItem** - уже использует Glassmorphism
3. **PbxServerItem** - уже использует Glassmorphism
4. **ToolItem** - нужно добавить Glassmorphism

### Средний приоритет (списки и заголовки):

5. **PublishWidgetsList**
6. **PublishSipUrisList**
7. **PbxServersList**
8. **ToolsList**
9. **ToolsListHeader**
10. **PbxServersListHeader**

### Формы:

11. **PublishWidgetsForm**
12. **PublishWidgetsFormHeader**
13. **PublishSipUrisForm**

## Пример полного рефакторинга компонента

### Исходный компонент (пример)

```scss
.MyComponent {
    position: relative;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 24px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.2);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    
    &:hover {
        cursor: pointer;
        transform: translateY(-6px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
        border-color: rgba(94, 211, 243, 0.3);
    }
    
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
    }
    
    .avatar {
        width: 44px;
        height: 44px;
        background: rgba(94, 211, 243, 0.15);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--accent-redesigned);
        transition: transform 0.3s ease;
        
        &:hover {
            transform: scale(1.05);
        }
    }
    
    .divider {
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 100%);
        margin: 20px 0;
    }
    
    .status {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #10b981;
            box-shadow: 0 0 8px #10b981;
        }
    }
    
    .badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid var(--accent-redesigned);
    }
    
    input[type="text"] {
        width: 100%;
        padding: 12px 16px;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        color: var(--text-redesigned);
        transition: all 0.2s ease;
        
        &:focus {
            outline: none;
            border-color: var(--accent-redesigned);
            box-shadow: 0 0 10px rgba(94, 211, 243, 0.1);
        }
    }
}

@media (max-width: 600px) {
    .MyComponent {
        padding: 16px;
        
        .header {
            flex-direction: column;
            gap: 12px;
        }
    }
}
```

### Рефакторенный компонент

```scss
@import '@/app/styles/variables/mixins';

.MyComponent {
    @include glass-card-primary;
    @include hover-lift-card;
    padding: var(--card-padding-md);
    
    .header {
        @include flex-between;
        margin-bottom: var(--space-4);
    }
    
    .avatar {
        @include icon-avatar(44px);
        
        &:hover {
            @include hover-scale;
        }
    }
    
    .divider {
        @include divider-gradient;
    }
    
    .status {
        @include flex-center;
        gap: var(--space-2);
        
        .dot {
            @include status-dot(var(--status-success));
        }
    }
    
    .badge {
        @include chip-base;
    }
    
    input[type="text"] {
        @include input-base;
    }
    
    @include mobile {
        padding: var(--card-padding-sm);
        
        .header {
            flex-direction: column;
            gap: var(--space-3);
        }
    }
}
```

### Результат:
- **Было:** ~90 строк
- **Стало:** ~35 строк
- **Сокращение:** ~60%
- **Читабельность:** значительно улучшена
- **Поддерживаемость:** легче менять глобально

## Советы по рефакторингу

### 1. Начинайте с простого
Не пытайтесь переписать всё сразу. Начните с одного-двух компонентов.

### 2. Тестируйте визуально
После рефакторинга проверьте компонент в браузере, убедитесь, что визуально ничего не изменилось.

### 3. Используйте Git
Делайте коммиты после каждого рефакторенного компонента.

### 4. Документируйте изменения
Если нашли edge case или особенность, добавьте комментарий.

### 5. Консистентность превыше всего
Если в дизайн-системе нет нужного миксина, лучше создайте его, чем hardcode.

## Частые ошибки

### ❌ Не делайте так:

```scss
// Смешивание старого и нового подхода
.card {
    @include glass-card-primary;
    background: rgba(255, 255, 255, 0.1); // Перезаписывает миксин!
}
```

### ✅ Делайте так:

```scss
// Используйте переменную или создайте новый миксин
.card {
    @include glass-card-secondary; // Более светлый фон
}
```

### ❌ Не делайте так:

```scss
.element {
    padding: 24px;
    margin: 16px;
    gap: 8px;
}
```

### ✅ Делайте так:

```scss
.element {
    padding: var(--card-padding-md);
    margin: var(--space-4);
    gap: var(--space-2);
}
```

## Заключение

Рефакторинг в направлении единой дизайн-системы:
- Улучшает читабельность кода
- Упрощает поддержку (изменения в одном месте)
- Обеспечивает визуальную консистентность
- Уменьшает объём кода
- Упрощает онбординг новых разработчиков
