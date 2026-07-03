# Быстрый старт

> Этот раздел поможет вам создать первого голосового ассистента за 5 минут — даже если вы никогда не работали с ИИ или телефонией.

---

## Что такое AI PBX?

**AI PBX** (Artificial Intelligence Private Branch Exchange) — это облачная платформа, которая объединяет искусственный интеллект с телефонией. Проще говоря: вы создаёте виртуального оператора, который **отвечает на звонки, ведёт диалог с клиентом и выполняет действия** — записывает на приём, принимает заказы, консультирует — всё это без участия живого человека.

### Для кого это?

- **Малый бизнес** — если у вас пиццерия, клиника, автосервис, салон красоты — ассистент примет звонок, когда вы заняты
- **Средний и крупный бизнес** — автоматизация первой линии колл-центра, круглосуточная поддержка
- **Разработчики** — API для интеграции ИИ-оператора в любой продукт

### Чем AI PBX отличается от обычного IVR?

| | Старый IVR | AI PBX |
|---|---|---|
| **Общение** | «Нажмите 1 для…» | Живой диалог голосом |
| **Понимание** | Распознаёт только цифры | Понимает естественную речь |
| **Действия** | Только переключение | Записывает, заказывает, уведомляет |
| **Настройка** | Нужен программист | Написать текстовую инструкцию |
| **Языки** | 1 язык | Десятки языков одновременно |

---

## Ваш первый ассистент за 5 минут

### Шаг 1. Регистрация и вход

1. Откройте платформу AI PBX
2. Нажмите **«Регистрация»** и заполните форму:

<div class="form-mockup">
  <div class="form-mockup-title">Регистрация</div>
  <div class="form-mockup-field" data-required>
    <label>Email</label>
    <div class="form-mockup-input">your@email.com</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>Имя</label>
    <div class="form-mockup-input">Иван</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>Пароль</label>
    <div class="form-mockup-input">••••••••</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Зарегистрироваться</div>
  </div>
</div>

3. После регистрации вы попадёте в мастер начальной настройки (**онбординг**)

### Шаг 2. Онбординг — мастер начальной настройки

При первом входе система предложит пошаговый мастер:

<div class="form-mockup">
  <div class="form-mockup-title">Добро пожаловать в AI PBX!</div>
  <div class="form-mockup-subtitle">Голосовые помощники для вашего бизнеса</div>
  <p style="text-align: center; color: var(--text-redesigned); opacity: 0.85; margin: 16px 0;">
    Давайте создадим вашего первого ассистента, чтобы разобраться, как это работает!
  </p>
  <div class="form-mockup-actions" style="justify-content: center; border: none;">
    <div class="form-mockup-btn form-mockup-btn-primary">Поехали! →</div>
  </div>
  <p style="text-align: center; font-size: 13px; color: var(--hint-redesigned); margin-top: 12px;">
    Пропустить и настроить позже
  </p>
</div>

#### 2a. Выбор типа бизнеса

Выберите шаблон, наиболее близкий к вашему бизнесу:

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Выберите тип бизнеса</div>
  <div class="form-mockup-chips">
    <span class="form-mockup-chip selected">Ремонт техники</span>
    <span class="form-mockup-chip">Пицца / Доставка</span>
    <span class="form-mockup-chip">Клиника</span>
    <span class="form-mockup-chip">Недвижимость</span>
    <span class="form-mockup-chip">Отель</span>
    <span class="form-mockup-chip">Автосервис</span>
    <span class="form-mockup-chip">Фитнес клуб</span>
    <span class="form-mockup-chip">Салон красоты</span>
    <span class="form-mockup-chip">Своё</span>
  </div>
  <div class="form-mockup-section-title">Возможности шаблона</div>
  <div class="form-mockup-card">
    <div class="card-desc">✅ Запись клиентов на ремонт<br>✅ Уточнение типа техники и неисправности<br>✅ Отправка уведомлений мастеру</div>
  </div>
  <div class="form-mockup-field">
    <label>Или добавьте свои</label>
    <div class="form-mockup-row">
      <div class="form-mockup-input">Введите возможность...</div>
      <div class="form-mockup-btn form-mockup-btn-secondary" style="flex: 0; padding: 10px 16px;">＋</div>
    </div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-secondary">← Назад</div>
    <div class="form-mockup-btn form-mockup-btn-primary">Создать ассистента →</div>
  </div>
</div>

Каждый шаблон содержит:
- **Готовый промпт** — текстовая инструкция, адаптированная под конкретный бизнес
- **Список возможностей** — что ассистент умеет делать «из коробки»
- **Можно редактировать** — добавляйте и удаляйте возможности под свой бизнес

> 💡 **Совет:** Если ваш бизнес не совпадает ни с одним шаблоном, выберите «Своё» и введите описание в свободной форме.

#### 2b. Настройка уведомлений (Telegram)

После создания ассистента мастер предложит подключить уведомления:

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Интеграции и уведомления</div>
  <div class="form-mockup-subtitle">Варианты интеграций неограничены: мессенджеры, почта, CRM и сотни других.</div>
  <div class="form-mockup-card">
    <div class="card-title">AI PBX Bot — Telegram</div>
    <div class="card-desc">
      Подключите бота для получения уведомлений о новых заявках прямо в Telegram.
    </div>
    <div class="card-meta">Пример уведомления: «Новая заявка! Клиент: Иванов И.С., +7 900 123-45-67, стиральная машина не отжимает»</div>
  </div>
  <div class="form-mockup-section-title">Подключение за 2 шага</div>
  <p style="font-size: 13px; color: var(--text-redesigned); margin-bottom: 12px;">
    1. Откройте бота <strong>@aipbx_bot</strong> в Telegram и нажмите /start<br>
    2. Вставьте полученный Chat ID:
  </p>
  <div class="form-mockup-field">
    <label>Chat ID</label>
    <div class="form-mockup-input">123456789</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-secondary">← Назад</div>
    <div class="form-mockup-btn form-mockup-btn-primary">Подключить</div>
  </div>
</div>

> 📌 **Как узнать Chat ID?** Откройте @aipbx_bot в Telegram, нажмите /start — бот покажет ваш Chat ID.

### Шаг 3. Готово!

После завершения онбординга вы окажетесь на главной странице с созданным ассистентом. Вы можете:

- **Протестировать** ассистента в Песочнице
- **Подключить** его к телефону через SIP
- **Встроить** на сайт через виджет
- **Настроить** интеграции с CRM, календарями и мессенджерами

---

## Навигация по платформе

После входа в систему слева вы видите боковое меню:

<div class="form-mockup">
  <div class="form-mockup-title">AI PBX — Навигация</div>
  <div class="form-mockup-list-item"><span class="item-name">Ассистенты</span><span class="item-detail">Управление ассистентами</span></div>
  <div class="form-mockup-list-item"><span class="item-name">Dashboards</span><span class="item-detail">Аналитика и графики</span></div>
  <div class="form-mockup-list-item"><span class="item-name">Playground</span><span class="item-detail">Тестирование голосом</span></div>
  <div class="form-mockup-list-item"><span class="item-name">Функции</span><span class="item-detail">Function Calling</span></div>
  <div class="form-mockup-list-item"><span class="item-name">MCP Серверы</span><span class="item-detail">Внешние интеграции</span></div>
  <div class="form-mockup-list-item"><span class="item-name">Публикация</span><span class="item-detail">SIPs / Виджеты / PBXs</span></div>
  <div class="form-mockup-list-item"><span class="item-name">Оплата</span><span class="item-detail">Баланс и счета</span></div>
  <div class="form-mockup-list-item"><span class="item-name">Документация</span><span class="item-detail">Эта документация</span></div>
</div>

Каждый раздел подробно описан в соответствующем файле документации.

---

## Пользователи (для владельца аккаунта)

Если вы владелец организации (не администратор платформы), в меню может появиться пункт **«Пользователи»**.

**Зачем:** пригласить коллег, выдать доступ к ассистентам и аналитике без передачи пароля.

**Как открыть:** меню слева → **Пользователи**.

**Типовой сценарий:**
1. Нажмите **«Пригласить»** и укажите email сотрудника.
2. Выберите роль (оператор, аналитик и т.д. в рамках вашего тарифа).
3. Сотрудник получит письмо, задаст пароль и войдёт в тот же аккаунт.

**Частые вопросы:** приглашение не пришло — проверьте спам; нет пункта «Пользователи» — у вас роль не owner, обратитесь к владельцу аккаунта.

---

## Быстрый чек-лист запуска

- [ ] Зарегистрироваться на платформе
- [ ] Создать ассистента (через онбординг или вручную)
- [ ] Написать инструкцию (промпт) для ассистента
- [ ] Протестировать в Песочнице
- [ ] Настроить функции (записи, заказы, уведомления)
- [ ] Подключить Telegram для уведомлений
- [ ] Опубликовать: SIP для телефонов или виджет для сайта
- [ ] Пополнить баланс

---

*Следующий раздел: [Ассистенты →](./02-assistants.md)*
