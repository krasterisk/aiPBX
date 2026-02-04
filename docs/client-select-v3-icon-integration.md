# Обновление: ClientSelectV3 с интегрированной иконкой

## ✅ Выполнено

Добавлена поддержка иконок внутри компонента `ClientSelectV3` и базового `Combobox`. Иконка Users теперь отображается внутри компонента, а не снаружи.

---

## 🔄 Изменения

### 1. Combobox - добавлена поддержка addonLeft/addonRight

**Файл**: `src/shared/ui/redesign-v3/Combobox/Combobox.tsx`

**Добавленные props:**
```tsx
interface ComboboxProps<T> {
    // ... существующие props
    addonLeft?: ReactNode   // ✅ Новое
    addonRight?: ReactNode  // ✅ Новое
}
```

**Рендеринг:**
```tsx
<div className={cls.control}>
    {/* Left addon icon */}
    {addonLeft && (
        <div className={cls.addonLeft}>
            {addonLeft}
        </div>
    )}
    
    {/* Input или chips */}
    
    {/* Right addon (optional) */}
    {addonRight && (
        <div className={cls.addonRight}>
            {addonRight}
        </div>
    )}
    
    {/* Indicators (clear, dropdown) */}
</div>
```

---

### 2. Combobox - стили для иконок

**Файл**: `src/shared/ui/redesign-v3/Combobox/Combobox.module.scss`

**Добавлено:**
```scss
.addonLeft,
.addonRight {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--icon-redesigned);  // Theme-aware
    transition: var(--transition-colors);

    svg {
        transition: var(--transition-colors);
    }
}

.addonLeft {
    margin-right: var(--space-2);
}

.addonRight {
    margin-left: var(--space-2);
}

// При фокусе иконка становится акцентной
.focused {
    .addonLeft,
    .addonRight {
        color: var(--accent-redesigned);

        svg {
            color: var(--accent-redesigned);
        }
    }
}
```

---

### 3. ClientSelectV3 - интеграция иконки

**Файл**: `src/entities/User/ui/ClientSelectV3/ClientSelectV3.tsx`

**Добавленные props:**
```tsx
interface ClientSelectProps {
    // ... существующие props
    addonLeft?: ReactNode   // ✅ Кастомная иконка
    showIcon?: boolean      // ✅ Показывать Users icon (по умолчанию true)
}
```

**Реализация:**
```tsx
import { Users } from 'lucide-react'

export const ClientSelectV3 = memo((props) => {
    const {
        addonLeft,
        showIcon = true,  // По умолчанию показываем иконку
        // ...
    } = props

    // Определяем иконку слева
    const leftAddon = addonLeft || (showIcon ? <Users size={18} /> : undefined)

    return (
        <Combobox
            // ...
            addonLeft={leftAddon}  // ✅ Передаем иконку
        />
    )
})
```

---

### 4. AssistantsListHeader - упрощение

**Файл**: `src/entities/Assistants/ui/AssistantsListHeader/AssistantsListHeader.tsx`

**Было:**
```tsx
{isAdmin && (
    <HStack gap="8" className={cls.clientSelectWrapper}>
        <div className={cls.iconCircle}>
            <Users size={18} className={cls.userIcon} />
        </div>
        <ClientSelectV3
            clientId={clientId}
            onChangeClient={handleClientChange}
            className={cls.clientSelect}
            placeholder="Все клиенты"
            size="m"
        />
    </HStack>
)}
```

**Стало:**
```tsx
{isAdmin && (
    <ClientSelectV3
        clientId={clientId}
        onChangeClient={handleClientChange}
        className={cls.clientSelect}
        placeholder="Все клиенты"
        size="m"
        // Иконка Users отображается автоматически!
    />
)}
```

---

## 🎨 Визуальные изменения

### До:
```
┌───────────────────────────────┐
│  ○   [Выберите клиента ▼]    │
│ icon  ↑ Combobox снаружи      │
└───────────────────────────────┘
```

### После:
```
┌───────────────────────────────┐
│  👥  Выберите клиента      ▼  │
│  ↑ Иконка внутри компонента   │
└───────────────────────────────┘
```

---

## 💡 Преимущества

1. **Инкапсуляция** - Иконка логически принадлежит компоненту
2. **Меньше кода** - Не нужны обертки HStack и дополнительные div
3. **Переиспользуемость** - Combobox теперь поддерживает иконки из коробки
4. **Консистентность** - Аналогично Input с addonLeft/addonRight
5. **Theme-aware** - Иконки автоматически адаптируются под тему
6. **Фокус эффект** - Иконка меняет цвет при фокусе

---

## 📋 Использование

### Базовое использование (с иконкой по умолчанию)
```tsx
<ClientSelectV3
    clientId={clientId}
    onChangeClient={setClientId}
    placeholder="Выберите клиента"
/>
// ✅ Автоматически отображает иконку Users
```

### Без иконки
```tsx
<ClientSelectV3
    clientId={clientId}
    onChangeClient={setClientId}
    placeholder="Выберите клиента"
    showIcon={false}
/>
// ✅ Без иконки
```

### С кастомной иконкой
```tsx
import { Building } from 'lucide-react'

<ClientSelectV3
    clientId={clientId}
    onChangeClient={setClientId}
    placeholder="Выберите компанию"
    addonLeft={<Building size={18} />}
/>
// ✅ Кастомная иконка
```

### Использование Combobox напрямую
```tsx
import { Search } from 'lucide-react'

<Combobox
    options={options}
    value={value}
    onChange={setValue}
    addonLeft={<Search size={18} />}
    addonRight={<CustomBadge />}
/>
```

---

## 🎯 Измененные файлы

✅ `src/shared/ui/redesign-v3/Combobox/Combobox.tsx` - добавлен addonLeft/addonRight  
✅ `src/shared/ui/redesign-v3/Combobox/Combobox.module.scss` - стили для иконок  
✅ `src/entities/User/ui/ClientSelectV3/ClientSelectV3.tsx` - интеграция Users icon  
✅ `src/entities/Assistants/ui/AssistantsListHeader/AssistantsListHeader.tsx` - упрощение  
✅ `src/entities/Assistants/ui/AssistantsListHeader/AssistantsListHeader.module.scss` - удаление ненужных стилей  

---

## 🔄 Обратная совместимость

✅ **Полностью обратно совместимо**
- Существующие Combobox без addonLeft/addonRight работают как прежде
- ClientSelectV3 по умолчанию показывает иконку Users
- Все существующие использования продолжают работать

---

**Дата**: 04.02.2026  
**Версия**: 1.2.0  
**Статус**: ✅ Интегрировано
