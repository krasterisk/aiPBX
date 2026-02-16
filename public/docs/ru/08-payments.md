# Оплата и биллинг

> AI PBX работает по модели prepaid — вы пополняете баланс, а стоимость списывается за каждый обработанный звонок. В этом разделе вы узнаете, как устроен биллинг, как пополнить баланс, настроить уведомления и управлять организациями.

---

## Содержание

1. [Обзор баланса](#обзор-баланса)
2. [Как расходуется баланс](#как-расходуется-баланс)
3. [Пополнение баланса](#пополнение-баланса)
4. [Лимиты и уведомления](#лимиты-и-уведомления)
5. [История платежей](#история-платежей)
6. [Организации (юрлица)](#организации-юрлица)

---

## Обзор баланса

На главной странице раздела **«Оплата»** вы видите текущее состояние счёта:

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Оплата</div>
  <div class="form-mockup-row" style="align-items: flex-start;">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Баланс</div>
      <div class="card-desc" style="font-size: 32px; font-weight: 700;">$142.50</div>
      <div class="form-mockup-btn form-mockup-btn-primary" style="margin-top: 12px;">Пополнить</div>
    </div>
    <div class="form-mockup-card" style="flex: 2;">
      <div class="card-title">За текущий месяц</div>
      <div style="margin-top: 8px;">
        <div class="form-mockup-list-item"><span class="item-name">Звонков обработано</span><span class="item-detail">847</span></div>
        <div class="form-mockup-list-item"><span class="item-name">Использовано токенов</span><span class="item-detail">3.2M</span></div>
        <div class="form-mockup-list-item"><span class="item-name">Потрачено</span><span class="item-detail">$57.50</span></div>
        <div class="form-mockup-list-item"><span class="item-name">Средняя стоимость звонка</span><span class="item-detail">$0.07</span></div>
      </div>
    </div>
  </div>
  <div class="form-mockup-chips" style="margin-top: 12px;">
    <span class="form-mockup-chip selected">Обзор</span>
    <span class="form-mockup-chip">История</span>
    <span class="form-mockup-chip">Лимиты</span>
    <span class="form-mockup-chip">Организации</span>
  </div>
</div>

---

## Как расходуется баланс

Стоимость каждого звонка складывается из нескольких компонентов:

| Компонент | Что это | Пример |
|-----------|---------|--------|
| **Токены LLM** | Обработка текста языковой моделью. Чем длиннее диалог, тем больше токенов | $0.005 за 1K токенов |
| **Голосовой ввод** | Распознавание речи клиента (STT) | $0.006 за минуту |
| **Голосовой вывод** | Синтез речи ассистента (TTS) | $0.015 за минуту |
| **Аналитика** | Генерация AI-отчёта после звонка (если включена) | $0.002 за звонок |

### Пример расчёта стоимости звонка

Звонок длительностью 3 минуты:

| Компонент | Расчёт | Стоимость |
|-----------|--------|-----------|
| Токены LLM | 2,340 токенов × $0.005/1K | $0.012 |
| STT (вход) | 1.5 мин × $0.006/мин | $0.009 |
| TTS (вывод) | 1.5 мин × $0.015/мин | $0.023 |
| Аналитика | — | $0.002 |
| **Итого** | | **$0.046 (~3 руб.)** |

> Совет: Средний звонок (2-3 минуты) стоит $0.03–$0.07. Это значительно дешевле живого оператора.

### Стоимость по моделям

| Модель | Токены (вход) | Токены (выход) | Аудио |
|--------|--------------|---------------|-------|
| gpt-realtime | $0.005/1K | $0.02/1K | $0.006/мин (вход), $0.024/мин (выход) |
| qwen-realtime | $0.001/1K | $0.003/1K | $0.003/мин (вход), $0.008/мин (выход) |
| yandex-realtime | По запросу | По запросу | По запросу |

> Цены приведены для ориентира. Актуальные цены смотрите в разделе «Оплата» на платформе.

---

## Пополнение баланса

### Шаг 1. Нажмите «Пополнить»

<div class="form-mockup">
  <div class="form-mockup-title">Пополнение баланса</div>
  <div class="form-mockup-field" data-required>
    <label>Сумма пополнения ($)</label>
    <div class="form-mockup-input">50</div>
  </div>
  <div class="form-mockup-field">
    <label>Быстрый выбор</label>
    <div class="form-mockup-chips">
      <span class="form-mockup-chip">$10</span>
      <span class="form-mockup-chip">$25</span>
      <span class="form-mockup-chip selected">$50</span>
      <span class="form-mockup-chip">$100</span>
    </div>
  </div>
  <div class="form-mockup-field">
    <label>Организация (для счёта)</label>
    <div class="form-mockup-select">ООО «ТехноМастер» ▾</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Перейти к оплате</div>
  </div>
</div>

### Шаг 2. Оплата

После нажатия «Перейти к оплате» вы будете перенаправлены на страницу платёжной системы (Stripe / Robokassa). Поддерживаются:
- Банковские карты (Visa, Mastercard, МИР)
- Банковские переводы
- СБП (Система быстрых платежей)

### Шаг 3. Подтверждение

После успешной оплаты:
- Баланс обновляется **мгновенно**
- Вы получаете подтверждение на email
- Запись появляется в истории платежей

---

## Лимиты и уведомления

Настройте уведомления, чтобы не допустить неожиданного обнуления баланса.

<div class="form-mockup">
  <div class="form-mockup-title">Лимиты и уведомления</div>
  <div class="form-mockup-field">
    <label>Порог уведомления ($)</label>
    <div class="form-mockup-input">10</div>
    <div class="card-meta" style="margin-top: 4px;">Когда баланс упадёт ниже $10, вы получите уведомление</div>
  </div>
  <div class="form-mockup-field">
    <label>Максимальный расход в день ($)</label>
    <div class="form-mockup-input">20</div>
    <div class="card-meta" style="margin-top: 4px;">Если дневной расход превысит $20, обработка звонков будет приостановлена</div>
  </div>
  <div class="form-mockup-field">
    <label>Уведомлять по email</label>
    <div class="form-mockup-input">admin@technomaster.ru</div>
  </div>
  <div class="form-mockup-toggle active">
    <div class="toggle-track"><div class="toggle-thumb"></div></div>
    <span class="toggle-label">Уведомлять в Telegram</span>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Сохранить настройки</div>
  </div>
</div>

### Зачем нужны лимиты?

| Ситуация | Без лимитов | С лимитами |
|----------|-------------|-----------|
| Ботнет звонит на ваш номер | Баланс списывается полностью | Расход ограничен дневным лимитом |
| Забыли пополнить | Ассистент перестаёт работать без предупреждения | Получите уведомление заранее |
| Ошибка в промпте (длинные ответы) | Резкий рост расхода | Дневной лимит остановит расход |

---

## История платежей

Вкладка **«История»** показывает все транзакции:

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">История платежей</div>
  <div class="form-mockup-list-item"><span class="item-name"><strong>#</strong></span><span class="item-detail"><strong>Дата · Описание · Сумма · Статус</strong></span></div>
  <div class="form-mockup-list-item"><span class="item-name">#12</span><span class="item-detail">15.03.2026 · Пополнение (Stripe) · <span class="form-mockup-badge badge-success">+$50.00</span> · ✅</span></div>
  <div class="form-mockup-list-item"><span class="item-name">#11</span><span class="item-detail">14.03.2026 · Списание (Звонки) · <span class="form-mockup-badge badge-warning">-$3.25</span> · ✅</span></div>
  <div class="form-mockup-list-item"><span class="item-name">#10</span><span class="item-detail">13.03.2026 · Списание (Звонки) · <span class="form-mockup-badge badge-warning">-$4.10</span> · ✅</span></div>
  <div class="form-mockup-list-item"><span class="item-name">#9</span><span class="item-detail">12.03.2026 · Списание (Звонки) · <span class="form-mockup-badge badge-warning">-$2.85</span> · ✅</span></div>
  <div class="form-mockup-list-item"><span class="item-name">#8</span><span class="item-detail">10.03.2026 · Списание (Аналитика) · <span class="form-mockup-badge badge-warning">-$0.50</span> · ✅</span></div>
  <div class="form-mockup-list-item"><span class="item-name">#7</span><span class="item-detail">01.03.2026 · Пополнение (Stripe) · <span class="form-mockup-badge badge-success">+$100.00</span> · ✅</span></div>
</div>

Для каждой транзакции доступны:
- **Дата и время** операции
- **Тип** — пополнение или списание
- **Описание** — за что списано (звонки, аналитика) или способ пополнения
- **Сумма** — положительная (пополнение) или отрицательная (списание)
- **Статус** — Успешно, В обработке, Ошибка
- **Ссылка на детали** — для пополнений через Stripe/Robokassa

---

## Организации (юрлица)

Если вам нужны документы для бухгалтерии (счета, акты), добавьте организацию:

<div class="form-mockup">
  <div class="form-mockup-title">Добавить организацию</div>
  <div class="form-mockup-field" data-required>
    <label>Название</label>
    <div class="form-mockup-input">ООО «ТехноМастер»</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>ИНН</label>
    <div class="form-mockup-input">7701234567</div>
  </div>
  <div class="form-mockup-field">
    <label>КПП</label>
    <div class="form-mockup-input">770101001</div>
  </div>
  <div class="form-mockup-field">
    <label>Юридический адрес</label>
    <div class="form-mockup-input">г. Москва, ул. Примерная, д. 1</div>
  </div>
  <div class="form-mockup-field">
    <label>Расчётный счёт</label>
    <div class="form-mockup-input">40702810500000012345</div>
  </div>
  <div class="form-mockup-field">
    <label>БИК</label>
    <div class="form-mockup-input">044525225</div>
  </div>
  <div class="form-mockup-field">
    <label>Email для документов</label>
    <div class="form-mockup-input">buh@technomaster.ru</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Сохранить</div>
  </div>
</div>

### Зачем нужно

- **Счета на оплату** — формируются на выбранную организацию
- **Акты выполненных работ** — для бухгалтерского учёта
- **Несколько организаций** — если вы работаете с несколькими юрлицами, добавьте все и выбирайте нужное при оплате

### Управление организациями

1. Перейдите на вкладку **«Организации»** в разделе Оплата
2. Нажмите **＋ Добавить** для новой или выберите существующую для редактирования
3. При пополнении баланса выберите организацию из списка — счёт будет выставлен на неё

---

## Часто задаваемые вопросы

### Что происходит, когда баланс достигает 0?
Ассистенты **прекращают принимать звонки**. Входящие вызовы будут отклонены. Пополните баланс, чтобы возобновить работу.

### Можно ли установить автоплатёж?
На данный момент доступно ручное пополнение. Настройте уведомление о низком балансе, чтобы вовремя пополнять.

### Возвращаются ли деньги за неудачные звонки?
Если звонок длился менее 3 секунд (ошибка соединения), средства не списываются.

### Как снизить расходы?
1. Используйте модель **qwen-realtime** вместо gpt-realtime — она в 3-5 раз дешевле
2. Пишите **короткие, точные промпты** — меньше токенов
3. Включайте **аналитику** только для важных ассистентов
4. Настройте **дневной лимит** расхода

---

*Предыдущий раздел: [Публикация и интеграция](./07-publish.md) · [← Вернуться к оглавлению](./README.md)*
