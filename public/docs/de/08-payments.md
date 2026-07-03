# Payments & Billing

> AI PBX works on a prepaid model — you top up your balance, and the cost is deducted for each processed call. In this section, you'll learn how billing works, how to top up your balance, set up notifications, and manage organizations.

---

## Contents

1. [Balance overview](#balance-overview)
2. [How balance is spent](#how-balance-is-spent)
3. [Topping up balance](#topping-up-balance)
4. [Limits and notifications](#limits-and-notifications)
5. [Payment history](#payment-history)
6. [Organizations (legal entities)](#organizations-legal-entities)

---

## Balance overview

On the main page of the **"Payments"** section, you can see the current account status:

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Payments</div>
  <div class="form-mockup-row" style="align-items: flex-start;">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Balance</div>
      <div class="card-desc" style="font-size: 32px; font-weight: 700;">$142.50</div>
      <div class="form-mockup-btn form-mockup-btn-primary" style="margin-top: 12px;">Top Up</div>
    </div>
    <div class="form-mockup-card" style="flex: 2;">
      <div class="card-title">Current Month</div>
      <div style="margin-top: 8px;">
        <div class="form-mockup-list-item"><span class="item-name">Calls processed</span><span class="item-detail">847</span></div>
        <div class="form-mockup-list-item"><span class="item-name">Tokens used</span><span class="item-detail">3.2M</span></div>
        <div class="form-mockup-list-item"><span class="item-name">Spent</span><span class="item-detail">$57.50</span></div>
        <div class="form-mockup-list-item"><span class="item-name">Average cost per call</span><span class="item-detail">$0.07</span></div>
      </div>
    </div>
  </div>
  <div class="form-mockup-chips" style="margin-top: 12px;">
    <span class="form-mockup-chip selected">Overview</span>
    <span class="form-mockup-chip">History</span>
    <span class="form-mockup-chip">Limits</span>
    <span class="form-mockup-chip">Organizations</span>
  </div>
</div>

---

## How balance is spent

The cost of each call consists of several components:

| Component | What it is | Example |
|-----------|-----------|---------|
| **LLM Tokens** | Text processing by the language model. Longer dialogues = more tokens | $0.005 per 1K tokens |
| **Voice input** | Client speech recognition (STT) | $0.006 per minute |
| **Voice output** | Assistant speech synthesis (TTS) | $0.015 per minute |
| **Analytics** | AI report generation after a call (if enabled) | $0.002 per call |

### Example call cost calculation

A 3-minute call:

| Component | Calculation | Cost |
|-----------|------------|------|
| LLM Tokens | 2,340 tokens × $0.005/1K | $0.012 |
| STT (input) | 1.5 min × $0.006/min | $0.009 |
| TTS (output) | 1.5 min × $0.015/min | $0.023 |
| Analytics | — | $0.002 |
| **Total** | | **$0.046** |

> Tip: An average call (2-3 minutes) costs $0.03–$0.07. This is significantly cheaper than a live operator.

### Cost by model

| Model | Tokens (input) | Tokens (output) | Audio |
|-------|----------------|-----------------|-------|
| gpt-realtime | $0.005/1K | $0.02/1K | $0.006/min (input), $0.024/min (output) |
| qwen-realtime | $0.001/1K | $0.003/1K | $0.003/min (input), $0.008/min (output) |
| yandex-realtime | On request | On request | On request |

> Prices are provided for reference. Check the "Payments" section on the platform for current prices.

---

## Topping up balance

### Step 1. Click "Top Up"

<div class="form-mockup">
  <div class="form-mockup-title">Top Up Balance</div>
  <div class="form-mockup-field" data-required>
    <label>Top-up amount ($)</label>
    <div class="form-mockup-input">50</div>
  </div>
  <div class="form-mockup-field">
    <label>Quick select</label>
    <div class="form-mockup-chips">
      <span class="form-mockup-chip">$10</span>
      <span class="form-mockup-chip">$25</span>
      <span class="form-mockup-chip selected">$50</span>
      <span class="form-mockup-chip">$100</span>
    </div>
  </div>
  <div class="form-mockup-field">
    <label>Organization (for invoice)</label>
    <div class="form-mockup-select">TechMaster LLC ▾</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Proceed to Payment</div>
  </div>
</div>

### Step 2. Payment

After clicking "Proceed to Payment," you'll be redirected to the payment system page (Stripe / Robokassa). Supported methods:
- Credit/debit cards (Visa, Mastercard, MIR)
- Bank transfers
- Fast Payment System (SBP)

### Step 3. Confirmation

After successful payment:
- Balance is updated **instantly**
- You receive a confirmation email
- The transaction appears in payment history

---

## Limits and notifications

Set up notifications to prevent unexpected balance depletion.

<div class="form-mockup">
  <div class="form-mockup-title">Limits & Notifications</div>
  <div class="form-mockup-field">
    <label>Notification threshold ($)</label>
    <div class="form-mockup-input">10</div>
    <div class="card-meta" style="margin-top: 4px;">When the balance drops below $10, you'll receive a notification</div>
  </div>
  <div class="form-mockup-field">
    <label>Maximum daily spend ($)</label>
    <div class="form-mockup-input">20</div>
    <div class="card-meta" style="margin-top: 4px;">If daily spend exceeds $20, call processing will be paused</div>
  </div>
  <div class="form-mockup-field">
    <label>Notify via email</label>
    <div class="form-mockup-input">admin@techmaster.com</div>
  </div>
  <div class="form-mockup-toggle active">
    <div class="toggle-track"><div class="toggle-thumb"></div></div>
    <span class="toggle-label">Notify via Telegram</span>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Save Settings</div>
  </div>
</div>

### Why limits are important

| Situation | Without limits | With limits |
|-----------|---------------|-------------|
| Botnet calls your number | Balance is completely drained | Spending is limited by daily cap |
| Forgot to top up | Assistant stops working without warning | You receive a notification in advance |
| Prompt error (long responses) | Sharp spike in spending | Daily limit stops the spending |

---

## Payment history

The **"History"** tab shows all transactions:

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Payment History</div>
  <div class="form-mockup-list-item"><span class="item-name"><strong>#</strong></span><span class="item-detail"><strong>Date · Description · Amount · Status</strong></span></div>
  <div class="form-mockup-list-item"><span class="item-name">#12</span><span class="item-detail">03/15/2026 · Top-up (Stripe) · <span class="form-mockup-badge badge-success">+$50.00</span> · ✅</span></div>
  <div class="form-mockup-list-item"><span class="item-name">#11</span><span class="item-detail">03/14/2026 · Deduction (Calls) · <span class="form-mockup-badge badge-warning">-$3.25</span> · ✅</span></div>
  <div class="form-mockup-list-item"><span class="item-name">#10</span><span class="item-detail">03/13/2026 · Deduction (Calls) · <span class="form-mockup-badge badge-warning">-$4.10</span> · ✅</span></div>
  <div class="form-mockup-list-item"><span class="item-name">#9</span><span class="item-detail">03/12/2026 · Deduction (Calls) · <span class="form-mockup-badge badge-warning">-$2.85</span> · ✅</span></div>
  <div class="form-mockup-list-item"><span class="item-name">#8</span><span class="item-detail">03/10/2026 · Deduction (Analytics) · <span class="form-mockup-badge badge-warning">-$0.50</span> · ✅</span></div>
  <div class="form-mockup-list-item"><span class="item-name">#7</span><span class="item-detail">03/01/2026 · Top-up (Stripe) · <span class="form-mockup-badge badge-success">+$100.00</span> · ✅</span></div>
</div>

For each transaction, the following is available:
- **Date and time** of the operation
- **Type** — top-up or deduction
- **Description** — what was charged (calls, analytics) or payment method
- **Amount** — positive (top-up) or negative (deduction)
- **Status** — Successful, Processing, Error
- **Details link** — for top-ups via Stripe/Robokassa

---

## Organizations (legal entities)

If you need documents for accounting (invoices, completion certificates), add an organization:

<div class="form-mockup">
  <div class="form-mockup-title">Add Organization</div>
  <div class="form-mockup-field" data-required>
    <label>Name</label>
    <div class="form-mockup-input">TechMaster LLC</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>Tax ID</label>
    <div class="form-mockup-input">7701234567</div>
  </div>
  <div class="form-mockup-field">
    <label>Tax Registration Code</label>
    <div class="form-mockup-input">770101001</div>
  </div>
  <div class="form-mockup-field">
    <label>Legal address</label>
    <div class="form-mockup-input">123 Main Street, New York, NY</div>
  </div>
  <div class="form-mockup-field">
    <label>Bank account</label>
    <div class="form-mockup-input">40702810500000012345</div>
  </div>
  <div class="form-mockup-field">
    <label>Bank code</label>
    <div class="form-mockup-input">044525225</div>
  </div>
  <div class="form-mockup-field">
    <label>Email for documents</label>
    <div class="form-mockup-input">accounting@techmaster.com</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Save</div>
  </div>
</div>

### Why you need this

- **Invoices** — issued to the selected organization
- **Completion certificates** — for accounting purposes
- **Multiple organizations** — if you work with multiple legal entities, add all of them and select the needed one when paying

### Managing organizations

1. Go to the **"Organizations"** tab in the Payments section
2. Click **＋ Add** for a new one, or select an existing one to edit
3. When topping up the balance, select an organization from the list — the invoice will be issued to it

---

## Frequently asked questions

### What happens when the balance reaches 0?
Assistants **stop accepting calls**. Incoming calls will be rejected. Top up the balance to resume operation.

### Can I set up automatic payments?
Currently, manual top-up is available. Set up a low balance notification to top up in time.

### Are funds refunded for failed calls?
If a call lasted less than 3 seconds (connection error), funds are not deducted.

### How to reduce costs?
1. Use the **qwen-realtime** model instead of gpt-realtime — it's 3-5 times cheaper
2. Write **short, precise prompts** — fewer tokens
3. Enable **analytics** only for important assistants
4. Set a **daily spending limit**

---

*Previous section: [Publish & Integration](./07-publish.md) · [← Back to Table of Contents](./README.md)*
