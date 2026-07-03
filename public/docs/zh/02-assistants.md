# Assistants — Complete Guide

> An assistant is your virtual employee. It answers calls, conducts conversations with clients, and performs actions. In this section, you'll learn how to create, configure, and publish the perfect assistant for your business.

---

## Contents

1. [Creating an assistant](#creating-an-assistant)
2. [Configuration form — overview](#configuration-form-overview)
3. [Instructions (prompt) — the heart of the assistant](#instructions-prompt-the-heart-of-the-assistant)
4. [Basic settings](#basic-settings)
5. [AI model — which one to choose?](#ai-model-which-one-to-choose)
6. [Voice — how your assistant sounds](#voice-how-your-assistant-sounds)
7. [Model parameters and VAD](#model-parameters-and-vad)
8. [Guide to writing prompts](#guide-to-writing-prompts)
9. [Ready-made prompt examples](#ready-made-prompt-examples)

---

## Creating an assistant

On the **"Assistants"** page, you'll see a list of all your assistants. Click the **"＋"** button in the top-right corner to create a new one.

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Assistants</div>
  <div class="form-mockup-list-item">
    <span class="item-name">Customer Support Bot</span>
    <span class="form-mockup-badge badge-success">Active</span>
  </div>
  <div class="form-mockup-card">
    <div class="card-desc">gpt-realtime · alloy · 3 functions</div>
    <div class="card-meta">Main bot for handling incoming calls</div>
  </div>
  <div class="form-mockup-list-item">
    <span class="item-name">Pizzeria Operator</span>
    <span class="form-mockup-badge badge-warning">Draft</span>
  </div>
  <div class="form-mockup-card">
    <div class="card-desc">gpt-realtime · shimmer · 2 functions</div>
    <div class="card-meta">Takes orders and clarifies addresses</div>
  </div>
</div>

You can also use a **ready-made template** when creating. If the URL contains a `?template=repair` parameter (e.g., from onboarding), the system will automatically load the template prompt.

---

## Configuration form — overview

The assistant form is divided into **two columns**:

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Assistant Configuration</div>
  <div class="form-mockup-row" style="align-items: flex-start;">
    <div style="flex: 3;">
      <div class="form-mockup-section-title">Instructions (prompt)</div>
      <div class="form-mockup-textarea" style="min-height: 180px;">You are a customer service operator for "TechMaster" repair center.

Your task:
1. Greet the client
2. Identify the problem
3. Record the details
...</div>
      <div style="margin-top: 12px;">
        <span class="form-mockup-btn form-mockup-btn-secondary">Generate</span>
      </div>
    </div>
    <div style="flex: 2;">
      <div class="form-mockup-section-title">Basic Settings</div>
      <div class="form-mockup-field" data-required>
        <label>Name</label>
        <div class="form-mockup-input">Support Bot</div>
      </div>
      <div class="form-mockup-field" data-required>
        <label>Model</label>
        <div class="form-mockup-select">gpt-realtime ▾</div>
      </div>
      <div class="form-mockup-field" data-required>
        <label>Voice</label>
        <div class="form-mockup-select">alloy ▾</div>
      </div>
      <div class="form-mockup-field">
        <label>Functions</label>
        <div class="form-mockup-chips">
          <span class="form-mockup-chip selected">book_appointment ✕</span>
          <span class="form-mockup-chip selected">check_status ✕</span>
        </div>
      </div>
      <div class="form-mockup-toggle active">
        <div class="toggle-track"><div class="toggle-thumb"></div></div>
        <span class="toggle-label">Analytics</span>
      </div>
      <div class="form-mockup-field">
        <label>Comment</label>
        <div class="form-mockup-input">For the sales department</div>
      </div>
      <div class="form-mockup-divider"></div>
      <div class="form-mockup-section-title">Model Parameters</div>
      <div class="form-mockup-field">
        <label>Temperature: 0.8</label>
        <div class="form-mockup-slider">
          <div class="slider-track">
            <div class="slider-fill" style="width: 40%;"></div>
            <div class="slider-thumb" style="left: 40%;"></div>
          </div>
          <div class="slider-labels"><span>0.6</span><span>1.2</span></div>
        </div>
      </div>
      <div class="form-mockup-field">
        <label>Idle timeout: 30 sec</label>
        <div class="form-mockup-slider">
          <div class="slider-track">
            <div class="slider-fill" style="width: 22%;"></div>
            <div class="slider-thumb" style="left: 22%;"></div>
          </div>
          <div class="slider-labels"><span>5</span><span>120</span></div>
        </div>
      </div>
      <div class="form-mockup-field">
        <label>VAD threshold: 0.5</label>
        <div class="form-mockup-slider">
          <div class="slider-track">
            <div class="slider-fill" style="width: 50%;"></div>
            <div class="slider-thumb" style="left: 50%;"></div>
          </div>
          <div class="slider-labels"><span>0.0</span><span>1.0</span></div>
        </div>
      </div>
    </div>
  </div>
</div>

On mobile devices, columns are stacked vertically — instructions first, then settings.

---

## Instructions (prompt) — the heart of the assistant

**Instructions** (also known as "system prompt") — this is the most important field when setting up an assistant. This text defines HOW your assistant will conduct conversations.

### What is it and why?

Imagine you're hiring a new employee. You don't just say "work" — you give them a **job description**: who they are, what they do, what tasks they perform, what they shouldn't do. The prompt is that very "job description" for your AI operator.

The AI model receives this text **before every conversation** and builds all its behavior based on it.

### The "Generate" button

Don't know what to write? Click the **"Generate"** button:

<div class="form-mockup">
  <div class="form-mockup-title">Prompt Generation</div>
  <div class="form-mockup-field">
    <label>Describe the task in free form</label>
    <div class="form-mockup-textarea" style="min-height: 80px;">Pizzeria operator, takes orders, clarifies address and pizza size, suggests drinks, announces the total</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Generate Prompt</div>
  </div>
</div>

The AI will transform your description into a professional, structured prompt with role, tasks, constraints, and tone.

---

## Basic settings

### Main card fields table

| Field | Description | Example |
|-------|-------------|---------|
| **Name** | Assistant name for internal identification. Displayed in the assistant list, reports, and filters. Choose a clear name. | `Customer Support Bot` |
| **Model** | AI language model. It determines the quality of understanding, response speed, and cost. More details below. | `gpt-realtime` |
| **Voice** | Voice persona — how the assistant sounds. Different voices differ in tone, gender, and accent. | `alloy`, `shimmer`, `echo` |
| **Functions** | List of connected tools (functions). The assistant can call these functions during a conversation. | `book_appointment`, `check_status` |
| **MCP Servers** | Connected MCP servers (Telegram, Gmail, etc.). Allow the assistant to interact with external services. | `Telegram Bot`, `Google Calendar` |
| **Analytics** | When enabled — after each call, AI automatically generates analytics: conversation sentiment, brief summary, topic. | Enabled |
| **Comment** | Internal note for your team. Does not affect the assistant's behavior but helps organize work. | `Test, do not publish` |

---

## AI model — which one to choose?

The model is the "brain" of your assistant. The choice of model determines how smart, fast, and expensive your operator will be.

### Available models

| Model | Provider | Pros | Cons | Best for |
|-------|----------|------|------|----------|
| **gpt-realtime** | OpenAI | Deep context understanding, complex dialogues, native voice I/O | More expensive, slightly slower | Complex scenarios: healthcare, legal, finance |
| **qwen-realtime** | Alibaba | Faster, significantly cheaper, good CJK support | Less "creative" | Simple tasks, high call volume |
| **yandex-realtime** | Yandex | Excellent Russian language support, servers in Russia, Federal Law 152-FZ compliance | Limited to Russian/English | Users in Russia, government agencies, data localization requirements |

### How to choose?

<div class="form-mockup">
  <div class="form-mockup-title">Model Selection Decision Tree</div>
  <div class="form-mockup-card">
    <div class="card-title">Is your scenario complex? (healthcare, legal, tech support)</div>
    <div class="card-desc">→ <strong>gpt-realtime</strong></div>
  </div>
  <div class="form-mockup-card">
    <div class="card-title">Standard tasks: appointments, orders, FAQ</div>
    <div class="card-desc">
      Saving money is important? → <strong>qwen-realtime</strong><br>
      Quality is important? → <strong>gpt-realtime</strong>
    </div>
  </div>
  <div class="form-mockup-card">
    <div class="card-title">Data must be stored in Russia?</div>
    <div class="card-desc">→ <strong>yandex-realtime</strong></div>
  </div>
</div>

> Tip: Start with gpt-realtime for prompt debugging, then switch to a cheaper model (qwen-realtime) if the quality is satisfactory.

### Important: changing the model resets the voice

When changing the model, the "Voice" field is cleared because different models support different voices. Select a voice again after changing the model.

---

## Voice — how your assistant sounds

The voice defines the "personality" of your assistant during conversation. It's **not a robot** — voices sound natural, with intonation and pauses.

### How to choose a voice?

The set of available voices depends on the selected model. Here's a guide:

| Voice | Characteristics | Suitable for |
|-------|----------------|-------------|
| **alloy** | Neutral, universal | Tech support, business calls |
| **echo** | Deep, calm | Banks, legal services |
| **shimmer** | Soft, friendly | Beauty salons, clinics |
| **ash** | Energetic, young | Delivery, entertainment |
| **coral** | Warm, female | Reception, hotels |

> Tip: Test several voices in the Playground — you can switch voices and hear the difference instantly.

---

## Model parameters and VAD

These settings affect the "character" of the assistant and the quality of speech recognition.

### Parameters card

<div class="form-mockup">
  <div class="form-mockup-title">Model Parameters</div>
  <div class="form-mockup-field">
    <label>Temperature: 0.8</label>
    <div class="form-mockup-slider">
      <div class="slider-track">
        <div class="slider-fill" style="width: 40%;"></div>
        <div class="slider-thumb" style="left: 40%;"></div>
      </div>
      <div class="slider-labels"><span>0.6 (precise)</span><span>1.2 (creative)</span></div>
    </div>
  </div>
  <div class="form-mockup-field">
    <label>Idle timeout (sec): 30</label>
    <div class="form-mockup-slider">
      <div class="slider-track">
        <div class="slider-fill" style="width: 22%;"></div>
        <div class="slider-thumb" style="left: 22%;"></div>
      </div>
      <div class="slider-labels"><span>5</span><span>120</span></div>
    </div>
  </div>
  <div class="form-mockup-divider"></div>
  <div class="form-mockup-section-title">VAD (Voice Activity Detection)</div>
  <div class="form-mockup-field">
    <label>Speech detection threshold: 0.5</label>
    <div class="form-mockup-slider">
      <div class="slider-track">
        <div class="slider-fill" style="width: 50%;"></div>
        <div class="slider-thumb" style="left: 50%;"></div>
      </div>
      <div class="slider-labels"><span>0.0 (sensitive)</span><span>1.0 (strict)</span></div>
    </div>
  </div>
  <div class="form-mockup-field">
    <label>Prefix padding duration: 300 ms</label>
    <div class="form-mockup-slider">
      <div class="slider-track">
        <div class="slider-fill" style="width: 30%;"></div>
        <div class="slider-thumb" style="left: 30%;"></div>
      </div>
      <div class="slider-labels"><span>0</span><span>1000</span></div>
    </div>
  </div>
  <div class="form-mockup-field">
    <label>Silence duration: 500 ms</label>
    <div class="form-mockup-slider">
      <div class="slider-track">
        <div class="slider-fill" style="width: 26%;"></div>
        <div class="slider-thumb" style="left: 26%;"></div>
      </div>
      <div class="slider-labels"><span>100</span><span>2000</span></div>
    </div>
  </div>
</div>

### Detailed description of each parameter

| Parameter | What it does | Recommendation | Range |
|-----------|-------------|----------------|-------|
| **Temperature** | Controls the "creativity" of responses. Low = precise, predictable answers. High = varied but less stable. | **0.8** for most tasks. 0.6 for healthcare/finance, 1.0 for creative tasks | 0.6 — 1.2 |
| **Idle timeout** | After how many seconds of silence the session will automatically end. If the client doesn't speak for 30 seconds — the conversation is over. | **30 sec** for regular calls, 60+ for complex consultations | 5 — 120 |
| **VAD threshold** | Minimum system "confidence" that a person has started speaking. High threshold = fewer false positives (background noise not recognized as speech). | **0.5** — golden mean | 0.0 — 1.0 |
| **Prefix padding** | How many milliseconds of audio BEFORE the VAD trigger to include in recognition. Helps not "swallow" the beginning of the client's phrase. | **300 ms** | 0 — 1000 |
| **Silence duration** | How many milliseconds of silence to wait after the end of speech to understand: the client has finished speaking. Too little — the assistant "interrupts". Too much — unnatural pauses. | **500 ms** | 100 — 2000 |

### What is VAD and why is it needed?

**VAD** (Voice Activity Detection) is a technology that determines when a person **starts speaking** and when they **go silent**. Without VAD, the assistant wouldn't know when to listen and when to respond.

Imagine a conversation between two people: one speaks, the other listens and waits for a pause to respond. VAD does the same thing — it listens to the audio stream and identifies moments of speech and silence.

**Examples of problems with poorly configured VAD:**
- Threshold too low → background noise (TV, street) is perceived as speech → assistant "interrupts"
- Threshold too high → quiet speech is not heard → assistant doesn't react
- Silence too short → assistant starts responding while the client is still thinking
- Silence too long → unnatural pauses, client thinks the connection is lost

---

---

## Guide to writing prompts

### Structure of an ideal prompt

Every good prompt contains **5 elements**:

<div class="form-mockup">
  <div class="form-mockup-title">Prompt Structure</div>
  <div class="form-mockup-card">
    <div class="card-title">1. Role</div>
    <div class="card-desc">Who are you? — "You are a pizzeria operator"</div>
  </div>
  <div class="form-mockup-card">
    <div class="card-title">2. Context</div>
    <div class="card-desc">Where do you work? — "Bella Pizza, New York"</div>
  </div>
  <div class="form-mockup-card">
    <div class="card-title">3. Tasks</div>
    <div class="card-desc">What do you do? — Numbered list</div>
  </div>
  <div class="form-mockup-card">
    <div class="card-title">4. Constraints</div>
    <div class="card-desc">What you DON'T do? — Clear boundaries of competence</div>
  </div>
  <div class="form-mockup-card">
    <div class="card-title">5. Tone</div>
    <div class="card-desc">How do you communicate? — Formal / friendly</div>
  </div>
</div>

### 10 rules for a good prompt

1. **Be specific.** Instead of "help clients" write "help schedule an appointment by asking for date, time, and name"
2. **Number your tasks.** This helps the model execute them sequentially
3. **Specify constraints.** An assistant without constraints will answer ANY question — even off-topic ones
4. **Mention functions.** If functions are connected (book_appointment, etc.), mention them by name in the prompt
5. **Define the tone.** Formal or friendly? 
6. **Specify the greeting.** How should the assistant start the conversation? "Hello, Bella Pizza!"
7. **Write an "I don't know" scenario.** What to do if the question is off-topic?
8. **Add data.** Address, business hours, prices — everything that might be needed
9. **Specify when to end.** "After booking, say goodbye and end the call"
10. **Test and improve.** Every prompt needs to be checked in the Playground

---

## Ready-made prompt examples

### Example 1: Tech Repair Service Center

```text
You are a customer service operator for "TechMaster" home appliance repair center.

Your task:
1. Greet the client and find out which appliance broke down.
2. Clarify the brand and model of the device.
3. Ask about the nature of the malfunction (won't turn on, making noise, leaking, etc.).
4. Suggest a convenient time for a technician visit.
5. Record the client's contact details (name, phone, address).

Constraints:
- Don't quote repair costs — say the technician will determine it on-site.
- If the appliance is older than 15 years, politely suggest considering buying a new one.
- Work only with home appliances. For other questions — "This is outside my area of expertise."

Tone: friendly, professional. Use formal address.
```

### Example 2: Pizza delivery

```text
You are an operator for "Bella Pizza" pizzeria. You take orders by phone.

Your task:
1. Greet the client.
2. Take the order: ask which pizza, size (10" / 12" / 14"), quantity.
3. Suggest extras: drinks, sauces, desserts.
4. Clarify the delivery method: delivery or pickup.
5. For delivery — ask for address, apartment, floor, intercom code.
6. Announce the total amount and estimated wait time.

Menu (use the get_menu function for the current menu).

Constraints:
- Minimum delivery order — $15.
- Delivery radius — 3 miles. If the address is farther, suggest pickup.
- Delivery time: 40-60 minutes.

Tone: cheerful, energetic. Use casual address.
```

### Example 3: Dental clinic

```text
You are the receptionist of "Dental Plus" dental clinic.

Your task:
1. Find out if this is a first or follow-up visit.
2. Clarify the reason for the visit (pain, preventive check, whitening, etc.).
3. Suggest available dates and times (use the check_schedule function).
4. Book the patient (use the book_appointment function).
5. Remind them to bring their ID and insurance card.

Important:
- If the patient describes acute pain — offer the nearest available time slot.
- Don't diagnose or give medical recommendations.
- If asked about prices — give a range, specify that the exact cost will be determined by the doctor.

Tone: calm, caring, professional.
```

### Example 4: Hotel reception

```text
You are the reception bot for "Grand Palace Hotel".

Your task:
1. Greet the guest and find out the purpose of the call.
2. For booking — ask for check-in/check-out dates, number of guests, room type.
3. Check availability (use the check_availability function).
4. Announce the cost for the period and conditions.
5. Process the booking (use the create_booking function).

Room types:
- Standard (from $90/night)
- Comfort (from $130/night)
- Suite (from $240/night)

Constraints:
- Check-in from 2:00 PM, check-out by 12:00 PM.
- Children under 7 — free on existing bedding.
- Free cancellation up to 48 hours in advance.

Tone: elegant, hospitable. Use formal address.
```

### Example 5: SaaS Technical Support

```text
You are a first-line support specialist for the "CloudBase" SaaS platform.

Your task:
1. Identify the user (request account email).
2. Find out the issue.
3. Try to resolve common problems:
   - Can't log in → offer password reset (function reset_password).
   - Slow performance → ask about the browser, suggest clearing cache.
   - Payment error → check payment status (function check_payment).
4. If the problem is non-standard — create a ticket (function create_ticket).

Constraints:
- You don't have access to user passwords.
- You can't cancel subscriptions — only transfer to the sales department.
- Ticket response time: up to 24 hours on business days.

Tone: patient, technically competent. Avoid complex terminology.
```

---

*Previous section: [Getting Started](./01-getting-started.md) · Next section: [Tools (Functions) →](./03-tools.md)*
