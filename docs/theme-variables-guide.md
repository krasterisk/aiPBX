# Theme-Aware CSS Variables - Справочник

Справочник по CSS переменным, которые адаптируются под тему проекта.

## 🎨 Основные переменные

### Фоновые цвета

```scss
// Темный фон (самый темный/светлый в зависимости от темы)
background: var(--dark-bg-redesigned);
// Светлая: #fff, Темная: #090f11

// Основной фон
background: var(--bg-redesigned);
// Светлая: #eff5f6, Темная: #0c1214

// Светлый фон (для карточек, inputs)
background: var(--light-bg-redesigned);
// Светлая: #e2eef1, Темная: #151c1f

// Фон для карточек
background: var(--card-bg);
// Светлая: #fff, Темная: #090f11
```

### Текстовые цвета

```scss
// Основной текст
color: var(--text-redesigned);
// Светлая: #141c1f, Темная: #dbdbdb

// Подсказки, placeholder
color: var(--hint-redesigned);
// Светлая: #adbcc0, Темная: #555
```

### Акцентные цвета

```scss
// Акцентный цвет (одинаковый для обеих тем!)
color: var(--accent-redesigned);
// Светлая: #00c8ff, Темная: #5ed3f3

// Иконки
color: var(--icon-redesigned);
// Светлая: #5ed3f3, Темная: #74a2b2

// Сохранить/Success
color: var(--save-redesigned);
// Светлая: #62de85, Темная: #6cd98b

// Отмена/Danger
color: var(--cancel-redesigned);
// Светлая: #f77, Темная: #d95757
```

---

## ✅ Рекомендуемые паттерны

### Input / Form элементы

```scss
.input {
    background: var(--light-bg-redesigned);
    color: var(--text-redesigned);
    border: 1px solid rgba(94, 211, 243, 0.2);
    
    &::placeholder {
        color: var(--hint-redesigned);
    }
    
    &:hover {
        background: var(--card-bg);
        border-color: rgba(94, 211, 243, 0.4);
    }
    
    &:focus {
        background: var(--card-bg);
        border-color: var(--accent-redesigned);
        box-shadow: 0 0 0 3px rgba(94, 211, 243, 0.1);
    }
}
```

### Карточки

```scss
.card {
    background: var(--card-bg);
    color: var(--text-redesigned);
    border: 1px solid rgba(94, 211, 243, 0.2);
    border-radius: var(--radius-lg);
    
    &:hover {
        border-color: rgba(94, 211, 243, 0.4);
    }
}
```

### Кнопки

```scss
.button {
    background: var(--accent-redesigned);
    color: #fff;
    
    &:hover {
        background: var(--accent-redesigned);
        opacity: 0.9;
    }
    
    &.secondary {
        background: var(--light-bg-redesigned);
        color: var(--text-redesigned);
        border: 1px solid rgba(94, 211, 243, 0.2);
    }
}
```

### Dropdown / Menu

```scss
.dropdown {
    background: var(--card-bg);
    border: 1px solid rgba(94, 211, 243, 0.2);
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
    
    .item {
        color: var(--text-redesigned);
        
        &:hover {
            background: var(--light-bg-redesigned);
        }
        
        &.selected {
            background: var(--light-bg-redesigned);
            color: var(--accent-redesigned);
        }
    }
}
```

---

## ❌ НЕ используйте

### Статические переменные из design-system.scss

```scss
// ❌ НЕ ИСПОЛЬЗОВАТЬ для фонов
background: var(--input-bg);
background: var(--glass-bg-primary);
background: var(--glass-overlay-medium);

// ❌ НЕ ИСПОЛЬЗОВАТЬ для границ
border: var(--input-border);

// ❌ НЕ ИСПОЛЬЗОВАТЬ для placeholder
color: var(--input-placeholder);

// ❌ НЕ ИСПОЛЬЗОВАТЬ для shadows в формах
box-shadow: var(--shadow-accent-sm);
```

### Hardcoded цвета

```scss
// ❌ НЕ ИСПОЛЬЗОВАТЬ
background: #fff;
background: #0c1214;
color: #141c1f;
color: #dbdbdb;
```

---

## ✅ Правильные примеры

### Пример 1: Input component

```scss
.InputWrapper {
    background: var(--light-bg-redesigned);  // ✅
    color: var(--text-redesigned);            // ✅
    border: 1px solid rgba(94, 211, 243, 0.2); // ✅
    
    &:hover {
        background: var(--card-bg);            // ✅
    }
    
    &:focus {
        border-color: var(--accent-redesigned); // ✅
    }
}
```

### Пример 2: Card component

```scss
.Card {
    background: var(--card-bg);               // ✅
    color: var(--text-redesigned);            // ✅
}
```

### Пример 3: Modal/Dialog

```scss
.Modal {
    background: var(--dark-bg-redesigned);    // ✅ для overlay
    
    .content {
        background: var(--card-bg);            // ✅ для контента
        color: var(--text-redesigned);         // ✅
    }
}
```

---

## 🎯 Таблица соответствия

| Элемент | Светлая тема | Темная тема | Переменная |
|---------|--------------|-------------|------------|
| **Основной фон страницы** | #eff5f6 | #0c1214 | `--bg-redesigned` |
| **Input фон** | #e2eef1 | #151c1f | `--light-bg-redesigned` |
| **Карточка фон** | #fff | #090f11 | `--card-bg` |
| **Текст** | #141c1f | #dbdbdb | `--text-redesigned` |
| **Placeholder** | #adbcc0 | #555 | `--hint-redesigned` |
| **Акцент** | #00c8ff | #5ed3f3 | `--accent-redesigned` |
| **Иконки** | #5ed3f3 | #74a2b2 | `--icon-redesigned` |

---

## 🔍 Как проверить

### Проверка в коде

1. Откройте файл стилей
2. Найдите все `background:` и `color:`
3. Убедитесь, что используются переменные из таблицы выше
4. Проверьте обе темы

### Тестирование

```tsx
import { useTheme } from '@/shared/lib/hooks/useTheme/useTheme'

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div>
      <button onClick={toggleTheme}>
        Переключить тему: {theme}
      </button>
      
      {/* Ваш компонент */}
      <MyComponent />
    </div>
  )
}
```

---

## 💡 Pro Tips

### 1. Прозрачность для границ

Используйте rgba с низкой прозрачностью для универсальных границ:

```scss
border: 1px solid rgba(94, 211, 243, 0.2); // Работает в обеих темах
```

### 2. Box-shadow для фокуса

```scss
box-shadow: 0 0 0 3px rgba(94, 211, 243, 0.1); // Subtle focus эффект
```

### 3. Hover состояния

```scss
&:hover {
    background: var(--card-bg);
    border-color: rgba(94, 211, 243, 0.4); // Чуть ярче
}
```

### 4. Disabled состояния

```scss
&:disabled {
    opacity: 0.6;
    background: var(--bg-redesigned);
    cursor: not-allowed;
}
```

---

## 🚀 Checklist

Перед коммитом проверьте:

- [ ] Используете `var(--*-redesigned)` переменные
- [ ] НЕ используете статические переменные из design-system
- [ ] НЕ используете hardcoded цвета
- [ ] Протестировали в светлой теме
- [ ] Протестировали в темной теме
- [ ] Границы видны в обеих темах
- [ ] Текст читаем в обеих темах
- [ ] Hover эффекты работают

---

**Актуально на**: 04.02.2026  
**Версия**: 1.1.0
