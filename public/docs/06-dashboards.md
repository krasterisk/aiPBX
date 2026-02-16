# Dashboards и аналитика

> Dashboards — это ваш центр управления. Здесь вы видите сколько звонков обработано, как долго длились диалоги, сколько потрачено токенов и средств. Три раздела — Overview, AI Analytics и Call Records — дают полную картину работы ваших ассистентов.

---

## Содержание

1. [Overview — обзорная панель](#overview-обзорная-панель)
2. [AI Analytics — аналитика по звонкам](#ai-analytics-аналитика-по-звонкам)
3. [Call Records — история звонков](#call-records-история-звонков)
4. [Фильтры и диапазон дат](#фильтры-и-диапазон-дат)
5. [Графики и визуализации](#графики-и-визуализации)
6. [Экспорт данных](#экспорт-данных)

---

## Overview — обзорная панель

Первый раздел Dashboard показывает **ключевые метрики** за выбранный период.

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Overview <span style="float: right; font-size: 13px; font-weight: 400; opacity: 0.7;">01.03 — 15.03.2026</span></div>
  <div class="form-mockup-row">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Звонки</div>
      <div class="card-desc" style="font-size: 28px; font-weight: 700;">247</div>
      <div class="card-meta"><span class="form-mockup-badge badge-success">↑ 12%</span></div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Длительность</div>
      <div class="card-desc" style="font-size: 28px; font-weight: 700;">18:32</div>
      <div class="card-meta"><span class="form-mockup-badge badge-warning">↓ 5%</span></div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Токены</div>
      <div class="card-desc" style="font-size: 28px; font-weight: 700;">1.2M</div>
      <div class="card-meta"><span class="form-mockup-badge badge-success">↑ 8%</span></div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Расход</div>
      <div class="card-desc" style="font-size: 28px; font-weight: 700;">$42.50</div>
      <div class="card-meta"><span class="form-mockup-badge badge-success">↑ 3%</span></div>
    </div>
  </div>
  <div class="form-mockup-row" style="margin-top: 16px;">
    <div class="form-mockup-card" style="flex: 1;">
      <div class="card-title">Активность по дням</div>
      <div class="card-desc" style="font-style: italic; opacity: 0.6;">Линейный график количества звонков</div>
    </div>
    <div class="form-mockup-card" style="flex: 1;">
      <div class="card-title">Распределение по ассистентам</div>
      <div class="card-desc">
        <span class="form-mockup-badge badge-info" style="margin-right: 4px;">58%</span> Бот 1<br>
        <span class="form-mockup-badge badge-info" style="margin-right: 4px;">31%</span> Бот 2<br>
        <span class="form-mockup-badge badge-info" style="margin-right: 4px;">11%</span> Бот 3
      </div>
    </div>
  </div>
  <div class="form-mockup-row" style="margin-top: 8px;">
    <div class="form-mockup-card" style="flex: 1;">
      <div class="card-title">Средняя длительность</div>
      <div class="card-desc" style="font-style: italic; opacity: 0.6;">Тренд за период</div>
    </div>
    <div class="form-mockup-card" style="flex: 1;">
      <div class="card-title">Расходы по дням</div>
      <div class="card-desc" style="font-style: italic; opacity: 0.6;">Ежедневные затраты</div>
    </div>
  </div>
</div>

### Метрики верхнего уровня

| Метрика | Описание |
|---------|----------|
| **Звонки** | Общее количество обработанных звонков за период. Показывает рост/падение (%) по сравнению с предыдущим периодом |
| **Длительность** | Средняя длительность диалога (мин:сек). Помогает оценить, не затягивает ли ассистент разговор |
| **Токены** | Суммарное количество обработанных токенов. 1 токен ≈ 4 символа текста. Отражает «объём работы» ИИ |
| **Расход** | Общая стоимость обработки за период. Складывается из стоимости токенов + голосового ввода/вывода |

---

## AI Analytics — аналитика по звонкам

Если у ассистента включена опция **«Аналитика»** в настройках, после каждого звонка ИИ автоматически генерирует аналитический отчёт.

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">AI Analytics <span style="float: right; font-size: 13px; font-weight: 400; opacity: 0.7;">01.03 — 15.03.2026</span></div>
  <div class="form-mockup-card">
    <div class="card-title">Звонок #247 <span style="float: right; font-weight: 400; opacity: 0.7;">15.03.2026 14:32</span></div>
    <div class="form-mockup-row" style="margin-top: 8px;">
      <span class="form-mockup-badge badge-success">Позитивный</span>
      <span class="form-mockup-badge badge-info">Запись на приём</span>
      <span class="form-mockup-badge badge-info">3:42</span>
      <span class="form-mockup-badge badge-success">Записан</span>
    </div>
    <div class="card-desc" style="margin-top: 12px;">
      <strong>Резюме:</strong> Клиент обратился с жалобой на стиральную машину Samsung. Проблема: не работает отжим. Записан на выезд мастера на 21 марта в 14:30. Контакт: +7 900 123-45-67.
    </div>
    <div class="card-meta" style="margin-top: 8px;">Функции: check_schedule, book_appointment — все выполнены успешно ✅</div>
  </div>
  <div class="form-mockup-card">
    <div class="card-title">Звонок #246 <span style="float: right; font-weight: 400; opacity: 0.7;">15.03.2026 13:15</span></div>
    <div class="form-mockup-row" style="margin-top: 8px;">
      <span class="form-mockup-badge badge-warning">Нейтральный</span>
      <span class="form-mockup-badge badge-info">Вопрос о ценах</span>
      <span class="form-mockup-badge badge-info">1:20</span>
    </div>
    <div class="card-desc" style="margin-top: 12px;">
      <strong>Резюме:</strong> Клиент спросил стоимость ремонта холодильника. Ассистент объяснил, что стоимость определяет мастер на месте. Клиент пока не записался — сказал, что перезвонит.
    </div>
  </div>
</div>

### Что генерирует AI Analytics

| Элемент | Описание |
|---------|----------|
| **Тональность** | Позитивный / Нейтральный / Негативный — эмоциональный окрас разговора |
| **Тема** | Автоматически определённая тема обращения |
| **Резюме** | Краткое описание разговора в 2-3 предложения |
| **Результат** | Итог звонка: записан, заказ оформлен, вопрос решён, перезвонит |
| **Функции** | Какие функции были вызваны и успешно ли |

> Важно: AI Analytics работает ТОЛЬКО если в настройках ассистента включен чекбокс **«Аналитика»**.

---

## Call Records — история звонков

Подробная история всех звонков с возможностью прослушать запись и увидеть полную транскрипцию.

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Call Records <span style="float: right; font-size: 13px; font-weight: 400; opacity: 0.7;">01.03 — 15.03.2026</span></div>
  <div class="form-mockup-list-item"><span class="item-name"><strong>#</strong></span><span class="item-detail"><strong>Дата · Ассистент · Длит. · Статус</strong></span></div>
  <div class="form-mockup-list-item"><span class="item-name">#247</span><span class="item-detail">15.03 14:32 · Бот поддержки · 3:42 · <span class="form-mockup-badge badge-success">OK</span></span></div>
  <div class="form-mockup-list-item"><span class="item-name">#246</span><span class="item-detail">15.03 13:15 · Бот поддержки · 1:20 · <span class="form-mockup-badge badge-success">OK</span></span></div>
  <div class="form-mockup-list-item"><span class="item-name">#245</span><span class="item-detail">15.03 11:08 · Пиццерия · 2:15 · <span class="form-mockup-badge badge-success">OK</span></span></div>
  <div class="form-mockup-list-item"><span class="item-name">#244</span><span class="item-detail">14.03 18:30 · Бот поддержки · 0:45 · <span class="form-mockup-badge badge-warning">Warn</span></span></div>
  <div class="form-mockup-list-item"><span class="item-name">#243</span><span class="item-detail">14.03 16:22 · Пиццерия · 4:10 · <span class="form-mockup-badge badge-success">OK</span></span></div>
  <p style="text-align: center; font-size: 13px; color: var(--hint-redesigned); margin-top: 12px;">Нажмите на запись для просмотра деталей</p>
</div>

### Детали звонка

При нажатии на запись открывается подробная карточка:

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Звонок #247</div>
  <div class="form-mockup-row" style="align-items: flex-start;">
    <div style="flex: 2;">
      <div class="form-mockup-section-title">Информация</div>
      <div class="form-mockup-list-item"><span class="item-name">Ассистент</span><span class="item-detail">Бот поддержки</span></div>
      <div class="form-mockup-list-item"><span class="item-name">Channel ID</span><span class="item-detail">1a2b3c</span></div>
      <div class="form-mockup-list-item"><span class="item-name">Дата</span><span class="item-detail">15.03.2026 14:32</span></div>
      <div class="form-mockup-list-item"><span class="item-name">Длительность</span><span class="item-detail">3:42</span></div>
      <div class="form-mockup-list-item"><span class="item-name">Модель</span><span class="item-detail">gpt-realtime</span></div>
      <div class="form-mockup-list-item"><span class="item-name">Токены</span><span class="item-detail">2,340</span></div>
      <div class="form-mockup-list-item"><span class="item-name">Стоимость</span><span class="item-detail">$0.18</span></div>
    </div>
    <div style="flex: 3;">
      <div class="form-mockup-section-title">Транскрипция</div>
      <div class="form-mockup-card">
        <div class="card-desc" style="font-family: monospace; font-size: 13px; line-height: 1.8;">
          <strong>[14:32:01] Ассистент:</strong> Здравствуйте! Сервисный центр «ТехноМастер». Чем могу помочь?<br>
          <strong>[14:32:05] Клиент:</strong> Стиральная машина сломалась, не отжимает.<br>
          <strong>[14:32:07] Ассистент:</strong> Понял! Подскажите, какая марка и модель вашей машины?<br>
          <strong>[14:32:15] Клиент:</strong> Samsung WW65.<br>
          <strong>[14:32:16]</strong> → check_schedule({"date": "2026-03-21"}) ✅<br>
          <strong>[14:32:18] Ассистент:</strong> Отлично! У нас свободно 21 марта в 10:00 и 14:30. Какое время удобнее?<br>
          <strong>[14:32:25] Клиент:</strong> В 14:30.<br>
          ...
        </div>
      </div>
    </div>
  </div>
</div>

Для каждого звонка доступно:
- **Аудиозапись** — если ассистент подключён через Asterisk с MixMonitor
- **Полная транскрипция** — весь диалог в текстовом виде
- **Вызовы функций** — какие функции вызваны, с какими параметрами, какой результат
- **Метаданные** — модель, токены, стоимость, длительность

---

## Фильтры и диапазон дат

Все разделы Dashboard поддерживают фильтрацию:

| Фильтр | Описание |
|--------|----------|
| **Диапазон дат** | Период данных: сегодня, неделя, месяц, произвольный |
| **Ассистент** | Показать данные только для конкретного ассистента |
| **Номер/Channel ID** | Найти конкретный звонок |

---

## Графики и визуализации

Dashboard предоставляет несколько типов графиков:

| График | Что показывает |
|--------|---------------|
| **Активность по дням** | Линейный график количества звонков по дням |
| **Средняя длительность** | Тренд средней длительности разговора |
| **Расходы по дням** | Ежедневные затраты на обработку |
| **Распределение по ассистентам** | Какой процент звонков приходится на каждого ассистента |
| **Токены по дням** | Потребление вычислительных ресурсов |

---

## Экспорт данных

Данные из Call Records можно экспортировать для дальнейшего анализа:

1. Примените нужные фильтры (период, ассистент)
2. Нажмите **«Экспорт»**
3. Выберите формат: CSV

<div class="form-mockup">
  <div class="form-mockup-title">Экспорт данных</div>
  <div class="form-mockup-list-item"><span class="item-name">Период</span><span class="item-detail">01.03 — 15.03.2026</span></div>
  <div class="form-mockup-list-item"><span class="item-name">Записей</span><span class="item-detail">247</span></div>
  <div class="form-mockup-field">
    <label>Формат</label>
    <div class="form-mockup-select">CSV (совместим с Excel) ▾</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Скачать</div>
  </div>
</div>

Экспортированный файл содержит:
- Дата и время звонка
- ID ассистента и его имя
- Channel ID
- Длительность
- Количество токенов
- Стоимость
- Статус функций

---

*Предыдущий раздел: [Песочница](./05-playground.md) · Следующий раздел: [Публикация и интеграция →](./07-publish.md)*
