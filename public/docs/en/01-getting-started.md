# Getting Started

> This guide will help you create your first voice assistant in 5 minutes — even if you've never worked with AI or telephony before.

---

## What is AI PBX?

**AI PBX** (Artificial Intelligence Private Branch Exchange) is a cloud platform that combines artificial intelligence with telephony. Simply put: you create a virtual operator that **answers calls, handles conversations with clients, and performs actions** — schedules appointments, takes orders, provides consultations — all without a human operator.

### Who is this for?

- **Small businesses** — if you run a pizzeria, clinic, auto service, beauty salon — an assistant takes calls when you're busy
- **Medium and large businesses** — automation of the first line call center, 24/7 support
- **Developers** — API for integrating an AI operator into any product

### How is AI PBX different from traditional IVR?

| | Traditional IVR | AI PBX |
|---|---|---|
| **Communication** | "Press 1 for…" | Natural voice conversation |
| **Understanding** | Recognizes only digits | Understands natural speech |
| **Actions** | Only call routing | Books, orders, and notifies |
| **Setup** | Requires a programmer | Write a text instruction |
| **Languages** | 1 language | Dozens of languages simultaneously |

---

## Your first assistant in 5 minutes

### Step 1. Registration and Login

1. Open the AI PBX platform
2. Click **"Sign Up"** and fill in the form:

<div class="form-mockup">
  <div class="form-mockup-title">Sign Up</div>
  <div class="form-mockup-field" data-required>
    <label>Email</label>
    <div class="form-mockup-input">your@email.com</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>Name</label>
    <div class="form-mockup-input">John</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>Password</label>
    <div class="form-mockup-input">••••••••</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Sign Up</div>
  </div>
</div>

3. After registration, you'll be guided through the initial setup wizard (**onboarding**)

### Step 2. Onboarding — Initial Setup Wizard

On your first login, the system will offer a step-by-step wizard:

<div class="form-mockup">
  <div class="form-mockup-title">Welcome to AI PBX!</div>
  <div class="form-mockup-subtitle">Voice assistants for your business</div>
  <p style="text-align: center; color: var(--text-redesigned); opacity: 0.85; margin: 16px 0;">
    Let's create your first assistant to see how it works!
  </p>
  <div class="form-mockup-actions" style="justify-content: center; border: none;">
    <div class="form-mockup-btn form-mockup-btn-primary">Let's go! →</div>
  </div>
  <p style="text-align: center; font-size: 13px; color: var(--hint-redesigned); margin-top: 12px;">
    Skip and set up later
  </p>
</div>

#### 2a. Choose your business type

Select the template closest to your business:

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Select Business Type</div>
  <div class="form-mockup-chips">
    <span class="form-mockup-chip selected">Tech Repair</span>
    <span class="form-mockup-chip">Pizza / Delivery</span>
    <span class="form-mockup-chip">Clinic</span>
    <span class="form-mockup-chip">Real Estate</span>
    <span class="form-mockup-chip">Hotel</span>
    <span class="form-mockup-chip">Auto Service</span>
    <span class="form-mockup-chip">Fitness Club</span>
    <span class="form-mockup-chip">Beauty Salon</span>
    <span class="form-mockup-chip">Custom</span>
  </div>
  <div class="form-mockup-section-title">Template Features</div>
  <div class="form-mockup-card">
    <div class="card-desc">✅ Client registration for repairs<br>✅ Clarifying the type of equipment and issue<br>✅ Sending notifications to the technician</div>
  </div>
  <div class="form-mockup-field">
    <label>Or add your own</label>
    <div class="form-mockup-row">
      <div class="form-mockup-input">Enter a feature...</div>
      <div class="form-mockup-btn form-mockup-btn-secondary" style="flex: 0; padding: 10px 16px;">＋</div>
    </div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-secondary">← Back</div>
    <div class="form-mockup-btn form-mockup-btn-primary">Create Assistant →</div>
  </div>
</div>

Each template includes:
- **Ready-made prompt** — a text instruction adapted for the specific business
- **Feature list** — what the assistant can do "out of the box"
- **Editable** — add and remove features to fit your business

> 💡 **Tip:** If your business doesn't match any template, choose "Custom" and enter a description in free form.

#### 2b. Setting up notifications (Telegram)

After creating the assistant, the wizard will offer to connect notifications:

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Integrations & Notifications</div>
  <div class="form-mockup-subtitle">Integration options are unlimited: messengers, email, CRM and hundreds more.</div>
  <div class="form-mockup-card">
    <div class="card-title">AI PBX Bot — Telegram</div>
    <div class="card-desc">
      Connect the bot to receive notifications about new requests directly in Telegram.
    </div>
    <div class="card-meta">Example notification: "New request! Client: John Smith, +1 555-123-4567, washing machine not spinning"</div>
  </div>
  <div class="form-mockup-section-title">Connection in 2 steps</div>
  <p style="font-size: 13px; color: var(--text-redesigned); margin-bottom: 12px;">
    1. Open <strong>@aipbx_bot</strong> in Telegram and press /start<br>
    2. Paste the received Chat ID:
  </p>
  <div class="form-mockup-field">
    <label>Chat ID</label>
    <div class="form-mockup-input">123456789</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-secondary">← Back</div>
    <div class="form-mockup-btn form-mockup-btn-primary">Connect</div>
  </div>
</div>

> 📌 **How to find your Chat ID?** Open @aipbx_bot in Telegram, press /start — the bot will show your Chat ID.

### Step 3. Done!

After completing the onboarding, you'll be on the main page with your created assistant. You can:

- **Test** the assistant in the Playground
- **Connect** it to a phone via SIP
- **Embed** it on a website via a widget
- **Set up** integrations with CRM, calendars, and messengers

---

## Platform Navigation

After logging in, you'll see the sidebar menu on the left:

<div class="form-mockup">
  <div class="form-mockup-title">AI PBX — Navigation</div>
  <div class="form-mockup-list-item"><span class="item-name">Assistants</span><span class="item-detail">Manage assistants</span></div>
  <div class="form-mockup-list-item"><span class="item-name">Dashboards</span><span class="item-detail">Analytics and charts</span></div>
  <div class="form-mockup-list-item"><span class="item-name">Playground</span><span class="item-detail">Voice testing</span></div>
  <div class="form-mockup-list-item"><span class="item-name">Functions</span><span class="item-detail">Function Calling</span></div>
  <div class="form-mockup-list-item"><span class="item-name">MCP Servers</span><span class="item-detail">External integrations</span></div>
  <div class="form-mockup-list-item"><span class="item-name">Publish</span><span class="item-detail">SIPs / Widgets / PBXs</span></div>
  <div class="form-mockup-list-item"><span class="item-name">Payments</span><span class="item-detail">Balance and invoices</span></div>
  <div class="form-mockup-list-item"><span class="item-name">Documentation</span><span class="item-detail">This documentation</span></div>
</div>

Each section is described in detail in its corresponding documentation file.

---

## Quick Launch Checklist

- [ ] Register on the platform
- [ ] Create an assistant (via onboarding or manually)
- [ ] Write instructions (prompt) for the assistant
- [ ] Test in the Playground
- [ ] Set up functions (bookings, orders, notifications)
- [ ] Connect Telegram for notifications
- [ ] Publish: SIP for phones or widget for website
- [ ] Top up your balance

---

*Next section: [Assistants →](./02-assistants.md)*
