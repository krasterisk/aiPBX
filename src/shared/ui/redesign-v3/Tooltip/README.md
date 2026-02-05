# Tooltip Component

Адаптивный компонент подсказок, работающий на мобильных и десктопных устройствах.

## Особенности

✅ **Адаптивность** - автоматически определяет тип устройства
- **Desktop**: показывается при hover с задержкой 300ms
- **Mobile/Touch**: показывается при клике/тапе, закрывается при клике вне элемента

✅ **Позиционирование** - 4 варианта размещения: `top`, `bottom`, `left`, `right`

✅ **Дизайн-система** - использует переменные проекта и следует общему стилю

✅ **Доступность** - высокий z-index (99999) для отображения поверх всех элементов

✅ **Анимации** - плавное появление с fade-in эффектом

## Использование

```tsx
import { Tooltip } from '@/shared/ui/redesign-v3/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

// Базовое использование
<Tooltip title="Текст подсказки">
    <Button>Наведите меня</Button>
</Tooltip>

// С иконкой
<Tooltip title="Подсказка" placement="top">
    <HelpOutlineIcon fontSize="small" />
</Tooltip>

// Длинный текст
<Tooltip title="Это длинный текст подсказки, который автоматически переносится на несколько строк">
    <span>Элемент</span>
</Tooltip>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Элемент, к которому прикрепляется подсказка |
| `title` | `string \| ReactNode` | required | Содержимое подсказки |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Позиция подсказки |
| `className` | `string` | - | Дополнительный CSS класс |
| `disabled` | `boolean` | `false` | Отключает показ подсказки |

## Мобильная адаптация

На мобильных устройствах:
- Подсказка открывается по клику/тапу
- Закрывается при клике вне элемента
- Позиции `left` и `right` автоматически меняются на `top` для лучшей видимости
- Максимальная ширина уменьшена до 240px
- Стрелка и отступы оптимизированы для сенсорных экранов

## Стилизация

Использует переменные дизайн-системы:
- `--card-bg` - фон подсказки
- `--text-redesigned` - цвет текста
- `--accent-redesigned` - цвет границы
- `--shadow-lg`, `--shadow-accent-sm` - тени
- `--glass-blur-md` - эффект размытия
- `--radius-md` - скругление углов

## Примеры

### В форме с параметрами
```tsx
<HStack gap="8" align="center">
    <Typography>Температура</Typography>
    <Tooltip title={t('tooltip_temperature')} placement="top">
        <HelpOutlineIcon fontSize="small" className={cls.helpIcon} />
    </Tooltip>
</HStack>
```

### С кнопкой
```tsx
<Tooltip title="Сохранить изменения">
    <Button variant="primary">
        Сохранить
    </Button>
</Tooltip>
```

## Z-index

Tooltip имеет `z-index: 99999`, что гарантирует отображение поверх всех элементов интерфейса, включая модальные окна и dropdown'ы.
