# План рефакторинга AssistantsPage

## Цель
Переработать раздел AssistantsPage с фокусом на удобство редактирования промпта и унификацию дизайна.

## Проблемы текущей реализации
1. ❌ Используется TabsPanel (устаревший подход)
2. ❌ Промпт не на первом плане
3. ❌ Параметры разбросаны по табам
4. ❌ Нет четкого разграничения прав доступа в UI
5. ❌ Стили не унифицированы с дизайн-системой
6. ❌ Textareas для числовых параметров (должны быть слайдеры)

## Новая архитектура

### Структура компонентов (FSD)

```
features/Assistants/
├── ui/
│   ├── AssistantForm/                    [NEW] Главная форма
│   │   ├── AssistantForm.tsx
│   │   ├── AssistantForm.module.scss
│   │   └── components/
│   │       ├── PromptSection/            [NEW] Секция промпта
│   │       │   ├── PromptSection.tsx
│   │       │   └── PromptSection.module.scss
│   │       ├── ParametersSection/        [NEW] Секция параметров
│   │       │   ├── ParametersSection.tsx
│   │       │   └── ParametersSection.module.scss
│   │       ├── VADParametersCard/        [NEW] VAD параметры
│   │       │   ├── VADParametersCard.tsx
│   │       │   └── VADParametersCard.module.scss
│   │       └── SpeechSettingsCard/       [NEW] Речевые настройки
│   │           ├── SpeechSettingsCard.tsx
│   │           └── SpeechSettingsCard.module.scss
│   ├── AssistantCard/                    [MODIFY] Упростить
│   ├── AssistantCreateCardHeader/        [KEEP]
│   └── AssistantEditCardHeader/          [KEEP]

entities/Assistants/
├── ui/
│   ├── AssistantOptionsMain/             [REMOVE] -> в PromptSection
│   ├── AssistantOptionsModel/            [REMOVE] -> в ParametersSection
│   └── AssistantOptionsPrompts/          [KEEP но modify]
```

### Layout структура

####Left Column (60-70% ширины) - ПРИОРИТЕТ
1. **Основная информация**
   - Клиент (только админ)
   - Наименование ассистента
   - Модель
   - Голос
   - Функции (Tools)
   - Комментарий

2. **Промпт** (главный акцент!)
   - System instructions
   - Large textarea с syntax highlighting
   - Автосохранение черновика

#### Right Column (30-40% ширины)
1. **Параметры модели**
   - Температура (slider 0-2)
   - Ограничитель токенов (slider)

2. **VAD Параметры** (для пользователей)
   - Threshold (slider)
   - Audio duration (slider ms)
   - Silence duration (slider ms)
   - Idle timeout (slider ms)

3. **Расширенные настройки** (только админ, collapsible)
   - Синтез и распознавание речи
   - Тип VAD
   - Семантический VAD
   - Аудио потоки

### Адаптивность

**Desktop (>1024px)**: 2 колонки
**Tablet (800-1024px)**: 2 колонки, меньше padding
**Mobile (<800px)**: 1 колонка, промпт сверху

## Компоненты для создания

### 1. AssistantForm.tsx
```typescript
interface AssistantFormProps {
  assistantId?: string
  onCreate?: (data: Assistant) => void
  onEdit?: (data: Assistant) => void
  onDelete?: (id: string) => void
}
```

**Layout**:
- contentWrapper (flex row -> column на mobile)
- leftColumn (flex: 1)
- rightColumn (width: 400px -> 100% на mobile)

### 2. PromptSection.tsx
Объединяет:
- AssistantOptionsMain (основные поля)
- AssistantOptionsPrompts (промпт)

**Fields**:
- name (input)
- model (select)
- voice (select)
- tools (multiselect)
- comment (textarea)
- instructions (large textarea с акцентом)

### 3. ParametersSection.tsx
**Карточки**:
1. Model Parameters Card
   - temperature (Slider 0-2, step 0.1)
   - max_tokens (Slider 100-4000)

2. VAD Parameters Card (пользователям)
   - threshold (Slider 0-1, step 0.01)
   - prefix_padding_ms (Slider 0-1000)
   - silence_duration_ms (Slider 100-5000)
   - idle_timeout_ms (Slider 100-10000)

3. Advanced Settings Card (только админ, collapsible)
   - Speech synthesis/recognition
   - VAD type
   - Semantic VAD
   - Audio formats

### 4. VADParametersCard.tsx
```typescript
interface VADParameter {
  field: keyof Assistant
  label: string
  min: number
  max: number
  step: number
  unit?: string
  adminOnly?: boolean
}
```

Use MUI Slider component

### 5. SpeechSettingsCard.tsx
Collapsible card (только для админов)
- input_audio_transcription_model
- input_audio_transcription_language
- output_audio_transcription_model
- input_audio_format
- output_audio_format
- input_audio_noise_reduction
- turn_detection_type
- semantic_eagerness

## i18n Translations

### Namespace: `assistants`

```json
{
  "sections": {
    "main": "Основная информация",
    "prompt": "Инструкции и промпт",
    "parameters": "Параметры",
    "vad": "VAD Параметры",
    "advanced": "Расширенные настройки",
    "speech": "Синтез и распознавание речи"
  },
  "fields": {
    "client": "Клиент",
    "name": "Наименование ассистента",
    "model": "Модель",
    "voice": "Голос",
    "tools": "Функции",
    "comment": "Комментарий",
    "instructions": "Системные инструкции",
    "temperature": "Температура",
    "maxTokens": "Ограничитель токенов",
    "vadThreshold": "Порог обнаружения",
    "audioDuration": "Длительность аудио",
    "silenceDuration": "Тишина",
    "idleTimeout": "Время простоя",
    "vadType": "Тип VAD",
    "semanticVAD": "Семантический VAD"
  },
  "placeholders": {
    "instructions": "Введите системный промпт для ассистента...",
    "name": "Название вашего ассистента",
    "comment": "Добавьте комментарий (необязательно)"
  },
  "hints": {
    "temperature": "Чем выше, тем креативнее ответы",
    "vadThreshold": "Чувствительность определения голоса",
    "adminOnly": "Доступно только администраторам"
  }
}
```

## Дизайн система

### Компоненты
- `@include glass-card-secondary` для всех секций
- `@include glass-card-tertiary` для карточек параметров
- Unified spacing: `var(--space-*)` 
- Transitions: `var(--transition-normal)`
- Hover effects из переменных

### Colors
- Accent для активных элементов
- Status colors для индикаторов
- Glass effects для карточек

## Этапы реализации

### Phase 1: Создание новых компонентов ✅
1. AssistantForm
2. PromptSection  
3. ParametersSection (с подкомпонентами)

### Phase 2: SCSS унификация
1. Все новые компоненты с дизайн-системой
2. Responsive миксины
3. Hover effects

### Phase 3: i18n
1. Создание переводов (ru, en, uz, kk)
2. Замена всех текстов

### Phase 4: Integration
1. Обновить AssistantCard
2. Удалить старые компоненты
3. Тестирование

### Phase 5: Testing
1. Визуальное тестирование
2. Responsive тестирование
3. Права доступа

---

*Создано: 2026-02-04*
*Статус: In Progress*
