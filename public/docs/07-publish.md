# Публикация и интеграция

> После тестирования ассистента в Песочнице, его нужно **опубликовать** — подключить к реальному каналу связи. AI PBX поддерживает три способа: SIP (телефония), WebRTC виджеты (сайт) и прямое подключение к PBX серверу (Asterisk).

---

## Содержание

1. [Способы публикации — обзор](#способы-публикации-обзор)
2. [SIPs — VoIP интеграция](#sips-voip-интеграция)
3. [Виджеты — WebRTC для сайта](#виджеты-webrtc-для-сайта)
4. [PBXs — подключение Asterisk](#pbxs-подключение-asterisk)
5. [Настройка Asterisk](#настройка-asterisk)

---

## Способы публикации — обзор

| Способ | Для кого | Как работает | Сложность |
|--------|---------|-------------|-----------|
| **SIP URI** | Компании с VoIP-телефонией | Ассистент получает SIP-адрес, звонки идут через VoIP | Средняя |
| **WebRTC Виджет** | Владельцы сайтов | Кнопка «Позвонить» на вашем сайте, звонок из браузера | Простая |
| **PBX Сервер** | Компании с Asterisk | Прямое подключение к вашему серверу Asterisk | Высокая |

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Каналы публикации</div>
  <div class="form-mockup-row" style="justify-content: center; text-align: center;">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">AI PBX Cloud</div>
      <div class="card-desc">Ассистент</div>
    </div>
  </div>
  <div class="form-mockup-row" style="justify-content: center; text-align: center; margin-top: 8px;">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">SIP URI</div>
      <div class="card-desc">VoIP-звонок</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">WebRTC</div>
      <div class="card-desc">Браузер / Сайт</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Asterisk</div>
      <div class="card-desc">Офисная АТС</div>
    </div>
  </div>
</div>

---

## SIPs — VoIP интеграция

SIP (Session Initiation Protocol) — это стандарт интернет-телефонии. С помощью SIP URI вы можете подключить ассистента к любой VoIP-линии.

### Создание SIP URI

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">SIPs</div>
  <div class="form-mockup-list-item">
    <span class="item-name">support-bot</span>
    <span class="item-detail">sip:support-bot@sip.aipbx.com</span>
  </div>
  <div class="form-mockup-card">
    <div class="card-desc">Бот поддержки клиентов</div>
  </div>
  <div class="form-mockup-list-item">
    <span class="item-name">pizza-order</span>
    <span class="item-detail">sip:pizza-order@sip.aipbx.com</span>
  </div>
  <div class="form-mockup-card">
    <div class="card-desc">Оператор пиццерии</div>
  </div>
</div>

### Форма SIP

<div class="form-mockup">
  <div class="form-mockup-title">Создать SIP URI</div>
  <div class="form-mockup-field" data-required>
    <label>SIP URI</label>
    <div class="form-mockup-input">support-bot</div>
    <div class="card-meta" style="margin-top: 4px;">→ sip:support-bot@sip.aipbx.com</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>Пароль</label>
    <div class="form-mockup-input">••••••••••</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>Ассистент</label>
    <div class="form-mockup-select">Бот поддержки клиентов ▾</div>
  </div>
  <div class="form-mockup-field">
    <label>Контекст (Dialplan)</label>
    <div class="form-mockup-input">assistant-in</div>
  </div>
  <div class="form-mockup-field">
    <label>Комментарий</label>
    <div class="form-mockup-input">Основная линия техподдержки</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Сохранить</div>
  </div>
</div>

### Поля SIP формы

| Поле | Описание |
|------|----------|
| **SIP URI** | Уникальный идентификатор. Будет частью SIP-адреса: `sip:{ваш-id}@sip.aipbx.com` |
| **Пароль** | Пароль для SIP-регистрации |
| **Ассистент** | Какой ассистент будет отвечать на звонки по этой линии |
| **Контекст** | Контекст диалплана Asterisk. Обычно `assistant-in` |
| **Комментарий** | Внутренняя заметка |

### Как использовать SIP URI

1. **Создайте SIP URI** в AI PBX
2. **Настройте маршрутизацию** на вашей АТС — входящие звонки направляйте на SIP-адрес ассистента
3. **Тестируйте** — позвоните на настроенный номер

> Примечание: SIP URI работает с любой VoIP-системой, поддерживающей стандарт SIP: Asterisk, FreePBX, 3CX, Yeastar и др.

---

## Виджеты — WebRTC для сайта

Виджет — это кнопка «Позвонить», встроенная в ваш сайт. Клиент нажимает — и начинает разговор с ассистентом прямо из браузера, без установки приложений и без регистрации.

### Создание виджета

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Виджеты</div>
  <div class="form-mockup-list-item">
    <span class="item-name">Виджет сайта — ТехноМастер</span>
    <span class="item-detail">ID: widget-abc123</span>
  </div>
  <div class="form-mockup-card">
    <div class="card-desc">Бот поддержки клиентов</div>
  </div>
</div>

### Форма виджета

<div class="form-mockup">
  <div class="form-mockup-title">Создать виджет</div>
  <div class="form-mockup-field" data-required>
    <label>Наименование</label>
    <div class="form-mockup-input">Виджет для сайта ТехноМастер</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>Ассистент</label>
    <div class="form-mockup-select">Бот поддержки клиентов ▾</div>
  </div>
  <div class="form-mockup-field">
    <label>SIP URI для WebRTC</label>
    <div class="form-mockup-input">support-webrtc</div>
  </div>
  <div class="form-mockup-field">
    <label>Код для встраивания</label>
    <div class="form-mockup-textarea" style="min-height: 50px; font-family: monospace; font-size: 13px;">&lt;script src="https://aipbx.com/widget/widget-abc123.js"&gt;&lt;/script&gt;</div>
  </div>
  <div class="form-mockup-field">
    <label>Комментарий</label>
    <div class="form-mockup-input">Для главной страницы сайта</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Сохранить</div>
  </div>
</div>

### Как встроить виджет на сайт

1. **Создайте виджет** в AI PBX, выберите ассистента
2. **Скопируйте код** из поля «Код для встраивания»
3. **Вставьте код** в HTML вашего сайта перед закрывающим тегом `</body>`:

```html
<!-- AI PBX Widget -->
<script src="https://aipbx.com/widget/widget-abc123.js"></script>
```

4. **Готово!** На сайте появится кнопка вызова

> Совет: Виджет работает через WebRTC — нужен только браузер и микрофон. Никаких плагинов или установок.

---

## PBXs — подключение Asterisk

Если у вас собственный сервер **Asterisk**, вы можете подключить его напрямую к AI PBX. Это даёт полный контроль над маршрутизацией звонков.

### Создание PBX подключения

<div class="form-mockup">
  <div class="form-mockup-title">Создать PBX</div>
  <div class="form-mockup-field" data-required>
    <label>Наименование</label>
    <div class="form-mockup-input">Офис Москва</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>WebSocket URL (WSS)</label>
    <div class="form-mockup-input">wss://your-asterisk.com:8089/ws</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>ARI URL</label>
    <div class="form-mockup-input">https://your-asterisk.com:8089</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>ARI Логин</label>
    <div class="form-mockup-input">asterisk</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>ARI Пароль</label>
    <div class="form-mockup-input">••••••••</div>
  </div>
  <div class="form-mockup-field">
    <label>Контекст (Dialplan)</label>
    <div class="form-mockup-input">assistant-in</div>
  </div>
  <div class="form-mockup-field">
    <label>Комментарий</label>
    <div class="form-mockup-input">Основной офис</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Сохранить</div>
  </div>
</div>

### Поля PBX формы

| Поле | Описание |
|------|----------|
| **WebSocket URL** | WSS-адрес вашего Asterisk для двусторонней связи. Формат: `wss://host:8089/ws` |
| **ARI URL** | HTTP-адрес Asterisk REST Interface для управления звонками |
| **ARI Логин/Пароль** | Учётные данные ARI (настраиваются в Asterisk) |
| **Контекст** | Контекст диалплана, который обрабатывает входящие звонки к ассистенту |

---

## Настройка Asterisk

> Этот раздел для системных администраторов, знакомых с Asterisk.

### 1. Настройка ARI (`ari.conf`)

ARI (Asterisk REST Interface) — это HTTP API для управления звонками. AI PBX использует ARI для получения аудио и отправки ответов.

```ini
; /etc/asterisk/ari.conf

[general]
enabled = yes
pretty = yes

[username]
type = user
read_only = no
password = your_password
password_format = plain
```

### 2. Настройка HTTP (`http.conf`)

Включите HTTP-сервер и WebSocket:

```ini
; /etc/asterisk/http.conf

[general]
enabled = yes
bindaddr = 0.0.0.0
bindport = 8088
tlsenable = yes
tlsbindaddr = 0.0.0.0:8089
tlscertfile = /etc/asterisk/keys/asterisk.pem
tlsprivatekey = /etc/asterisk/keys/asterisk.pem
```

> Примечание: TLS обязателен! WebSocket работает через WSS (WebSocket Secure).

### 3. Настройка PJSIP (`pjsip.conf`)

Создайте WebSocket транспорт и endpoint:

```ini
; /etc/asterisk/pjsip.conf

[transport-wss]
type = transport
protocol = wss
bind = 0.0.0.0

[endpoint-name]
type = endpoint
context = from-external
disallow = all
allow = ulaw,alaw,opus
webrtc = yes
dtls_auto_self_generated = yes
```

### 4. Настройка Dialplan (`extensions.conf`)

Создайте контекст для обработки звонков ассистентом:

```ini
; /etc/asterisk/extensions.conf

[assistant-in]
exten => 100,1,NoOp()
same => n,Set(__fname=/usr/records/assistants/${UNIQUEID})
same => n,MixMonitor(${fname}.wav)
same => n,Stasis(aiPBXBot,${ASSISTANTID})
same => n,Hangup()
```

**Что делает каждая строка:**

| Строка | Действие |
|--------|---------|
| `NoOp()` | Пустая операция (для логирования) |
| `Set(__fname=...)` | Устанавливает путь для записи |
| `MixMonitor(...)` | Включает запись разговора |
| `Stasis(aiPBXBot,...)` | Передаёт звонок в ARI-приложение AI PBX |
| `Hangup()` | Завершает звонок после обработки |

### 5. Записи разговоров

Записи доступны по URL:

```text
https://{{PBX_ADDRESS}}/records/{{ASSISTANTID}}/{{UNIQUEID}}.{{FORMAT}}
```

| Переменная | Описание |
|-----------|----------|
| `PBX_ADDRESS` | Адрес вашего PBX сервера |
| `ASSISTANTID` | ID ассистента в AI PBX |
| `UNIQUEID` | Уникальный ID звонка (генерируется Asterisk) |
| `FORMAT` | Формат файла: `wav` или `mp3` |

> Важно: Убедитесь, что директория `/usr/records/assistants/` существует и имеет права на запись для пользователя Asterisk.

---

## Быстрый чек-лист публикации

### Вариант A: Виджет на сайт (30 секунд)
- [ ] Перейти в «Виджеты» → Создать
- [ ] Выбрать ассистента
- [ ] Скопировать код
- [ ] Вставить на сайт
- [ ] Готово!

### Вариант B: SIP (5 минут)
- [ ] Перейти в «SIPs» → Создать
- [ ] Указать SIP URI и пароль
- [ ] Выбрать ассистента
- [ ] Настроить маршрутизацию на АТС
- [ ] Готово!

### Вариант C: Asterisk PBX (30 минут)
- [ ] Настроить ari.conf
- [ ] Настроить http.conf с TLS
- [ ] Настроить pjsip.conf
- [ ] Создать контекст в extensions.conf
- [ ] Создать PBX в AI PBX с WSS и ARI адресами
- [ ] Протестировать звонок
- [ ] Готово!

---

*Предыдущий раздел: [Dashboards](./06-dashboards.md) · Следующий раздел: [Оплата и биллинг →](./08-payments.md)*
