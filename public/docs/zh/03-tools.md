# Tools (Functions) — Connecting External Systems

> Functions allow the assistant to **perform real actions** during a conversation: register a client in a database, check order status, send notifications, transfer calls. Without functions, the assistant can only talk — with functions, it becomes a full-fledged operator.

---

## Contents

1. [What are functions and why are they needed?](#what-are-functions-and-why-are-they-needed)
2. [Function types](#function-types)
3. [Creating a function](#creating-a-function)
4. [Configuration form — full overview](#configuration-form-full-overview)
5. [JSON parameter schema](#json-parameter-schema)
6. [Authentication](#authentication)
7. [Built-in functions (hangup, transfer)](#built-in-functions)
8. [Function Calling examples](#function-calling-examples)
9. [Linking functions to an assistant](#linking-functions-to-an-assistant)

---

## What are functions and why are they needed?

Imagine: a client calls a pizzeria and says: "I'd like a Margherita 12-inch delivered to 5 Main Street."

**Assistant without functions:** "Great, your order is accepted!" — but nothing actually happened. The order wasn't created. The courier knows nothing.

**Assistant with functions:** "Great, your order is accepted!" — and simultaneously calls the `create_order` function, which:
- Creates an order in your CRM
- Sends a notification to the courier via Telegram
- Updates the status on the website

### Typical use cases

| Action | Function | What it does |
|--------|----------|-------------|
| Book an appointment | `book_appointment` | Creates an entry in Google Calendar or CRM |
| Check an order | `check_order_status` | Queries your database and returns the status |
| Send a notification | `send_notification` | Sends a message via Telegram, email, SMS |
| Check schedule | `check_schedule` | Checks available slots in the calendar |
| Create a ticket | `create_ticket` | Registers a request in the support system |
| End a call | `hangup_call` | Properly terminates the phone call |
| Transfer a call | `transfer_call` | Transfers to an operator or another number |

---

## Function types

AI PBX supports three types of functions:

### 1. Function (Webhook)

The most common type. The assistant calls your HTTP server (webhook) with data collected during the conversation.

**Flow:** Client speaks → AI understands → Calls your API → Gets response → Tells the client

**When to use:** You have your own server / API / CRM with HTTP/REST support.

**Example:**

```text
Assistant asked for name and phone →
  → POST https://your-server.com/api/book
  → { "name": "John Smith", "phone": "+15551234567", "date": "2026-03-15" }
  → Response: { "status": "ok", "message": "Booked for March 15" }
  → Assistant: "You're booked for March 15!"
```

### 2. MCP (Model Context Protocol)

Connection via the MCP protocol. An MCP server provides a set of tools that the assistant can call.

**When to use:** Integration with existing MCP servers (Composio, custom MCP servers).

More details in the [MCP Servers](./04-mcp-servers.md) section.

### 3. Built-in

System functions of the platform itself: ending a call, transferring a call. No webhook setup required.

---

## Creating a function

### The "Functions" page

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Functions</div>
  <div class="form-mockup-list-item">
    <span class="item-name">book_appointment</span>
    <span class="form-mockup-badge badge-info">function</span>
  </div>
  <div class="form-mockup-card">
    <div class="card-desc">Books a client appointment</div>
  </div>
  <div class="form-mockup-list-item">
    <span class="item-name">check_order_status</span>
    <span class="form-mockup-badge badge-info">function</span>
  </div>
  <div class="form-mockup-card">
    <div class="card-desc">Checks order status</div>
  </div>
  <div class="form-mockup-list-item">
    <span class="item-name">send_telegram_notification</span>
    <span class="form-mockup-badge badge-success">mcp</span>
  </div>
  <div class="form-mockup-card">
    <div class="card-desc">Sends a notification to Telegram</div>
  </div>
</div>

Click **＋** to create a new function.

---

## Configuration form — full overview

The function form is divided into **two columns**: basic settings (left) and parameter definition (right).

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Create Function</div>
  <div class="form-mockup-row" style="align-items: flex-start;">
    <div style="flex: 1;">
      <div class="form-mockup-section-title">Basic Settings</div>
      <div class="form-mockup-field" data-required>
        <label>Name</label>
        <div class="form-mockup-input">book_appointment</div>
      </div>
      <div class="form-mockup-field" data-required>
        <label>Type</label>
        <div class="form-mockup-select">function ▾</div>
      </div>
      <div class="form-mockup-field" data-required>
        <label>Description</label>
        <div class="form-mockup-textarea" style="min-height: 70px;">Books a client appointment. Called after collecting all information.</div>
      </div>
      <div class="form-mockup-field" data-required>
        <label>URL (webhook address)</label>
        <div class="form-mockup-input">https://api.example.com/book</div>
      </div>
      <div class="form-mockup-field" data-required>
        <label>Method</label>
        <div class="form-mockup-select">POST ▾</div>
      </div>
      <div class="form-mockup-field">
        <label>Authentication</label>
        <div class="form-mockup-select">Bearer Token ▾</div>
      </div>
      <div class="form-mockup-field">
        <label>API Key</label>
        <div class="form-mockup-input">sk-xxxxxxxxxxxxxxxx</div>
      </div>
    </div>
    <div style="flex: 1;">
      <div class="form-mockup-section-title">Function Definition</div>
      <div class="form-mockup-field">
        <label>Parameters (JSON Schema)</label>
        <div class="form-mockup-textarea" style="min-height: 200px;">{
  "type": "object",
  "properties": {
    "client_name": {
      "type": "string",
      "description": "Client's full name"
    },
    "phone": {
      "type": "string"
    }
  },
  "required": ["client_name", "phone"]
}</div>
      </div>
      <div class="form-mockup-toggle active">
        <div class="toggle-track"><div class="toggle-thumb"></div></div>
        <span class="toggle-label">Strict mode</span>
      </div>
    </div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Save</div>
    <div class="form-mockup-btn form-mockup-btn-secondary">Cancel</div>
  </div>
</div>

### Main card fields

| Field | Required | Description |
|-------|----------|-------------|
| **Name** | Yes | Technical function name (Latin characters, no spaces). This is the name the AI will call. Use `snake_case` format. Examples: `book_appointment`, `check_status` |
| **Type** | Yes | `function` — webhook, `mcp` — MCP protocol |
| **Description** | Yes | Text description for the AI: **when** and **why** to call the function. The AI reads this description to decide whether the function is needed at this point in the conversation. The more precise the description — the more correctly the AI calls the function |
| **URL** | Yes (for function) | Address of your webhook/API where the assistant will send the HTTP request |
| **Method** | Yes (for function) | HTTP method: GET, POST, PUT, DELETE. Usually POST |
| **Authentication** | No | Authentication type when accessing your server |
| **API Key** | No | Token or key for authentication (for Bearer/Basic) |

### Function definition (right card)

| Field | Description |
|-------|-------------|
| **Parameters (JSON Schema)** | JSON description of parameters that the AI must collect during the conversation. Uses the JSON Schema standard |
| **Strict mode** | When enabled — the AI must provide ALL required parameters. When disabled — it can call the function with partial data |

---

## JSON parameter schema

Parameters are described in **JSON Schema** format. This is the standard way to describe "what the function expects as input."

### Structure

```json
{
  "type": "object",
  "properties": {
    "parameter_name": {
      "type": "data_type",
      "description": "Description for AI — what this parameter is"
    }
  },
  "required": ["list", "of", "required", "parameters"]
}
```

### Data types

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text | Name, address, email |
| `number` | Number (with decimals) | Price, coordinate |
| `integer` | Integer | Quantity, age |
| `boolean` | Yes/No | Delivery: true/false |
| `array` | List of values | List of order items |
| `object` | Nested object | Address {street, building, apt} |

### Choice restriction (enum)

You can specify an exact list of allowed values:

```json
{
  "priority": {
    "type": "string",
    "enum": ["low", "medium", "high", "critical"],
    "description": "Request priority"
  }
}
```

The AI won't make up its own value — it will only choose from the list.

---

## Authentication

Your server may require authorization. AI PBX supports three types:

### 1. No authentication

Your webhook is accessible without a key. Suitable for internal servers or testing.

### 2. Bearer Token

The most common option. A header is added to each call:

```text
Authorization: Bearer sk-your-secret-key
```

### 3. Basic Auth

Used less frequently. Adds a header:

```text
Authorization: Basic base64(username:password)
```

> Important: Keep your keys secure. If a key is compromised — generate a new one.

---

## Built-in functions

AI PBX provides two system functions that **don't require webhook setup** — they work "out of the box" when connected via Asterisk (SIP):

### hangup_call — End call

The assistant calls this function when the dialogue is complete. The call is properly terminated on the PBX side.

```json
{
  "name": "hangup_call",
  "description": "Terminates the current phone call"
}
```

**How to use in the prompt:**

```text
When the conversation has come to an end and the client has said goodbye,
call the hangup_call function to end the call.
```

> Note: Works only via SIP (Asterisk). For WebRTC widgets, the client closes the window themselves.

### transfer_call — Transfer call

Transfers the current call to another number or internal extension.

```json
{
  "name": "transfer_call",
  "description": "Transfers the call to the specified number",
  "parameters": {
    "type": "object",
    "properties": {
      "extension": {
        "type": "string",
        "description": "Number or extension for transfer"
      },
      "context": {
        "type": "string",
        "description": "Asterisk dialplan context"
      }
    },
    "required": ["extension"]
  }
}
```

**How to use in the prompt:**

```text
If the client wants to speak with a live operator,
call transfer_call with extension "100" to transfer to a manager.
```

> Tip: You can configure the assistant to transfer calls to different numbers depending on the topic: tech support → 101, sales → 102, accounting → 103.

---

## Function Calling examples

### Example 1: Booking an appointment

**Scenario:** A clinic wants the assistant to book patients.

```json
{
  "name": "book_appointment",
  "description": "Books a client appointment. Called after collecting all necessary information.",
  "strict": true,
  "parameters": {
    "type": "object",
    "properties": {
      "client_name": {
        "type": "string",
        "description": "Client's full name"
      },
      "phone": {
        "type": "string",
        "description": "Client's phone number"
      },
      "date": {
        "type": "string",
        "description": "Appointment date in YYYY-MM-DD format"
      },
      "time": {
        "type": "string",
        "description": "Appointment time in HH:MM format"
      },
      "service_type": {
        "type": "string",
        "description": "Type of service: exam, consultation, procedure"
      }
    },
    "required": ["client_name", "phone", "date", "time"]
  }
}
```

**How this works in a conversation:**

```text
Assistant: Hello! This is Dental Plus. How can I help you?
Client:    I'd like to book a dental appointment.
Assistant: Of course! What's your name?
Client:    John Smith.
Assistant: Great, John! What date would you like?
Client:    Friday.
Assistant: Alright. There are available slots at 10:00 and 2:30 PM. Which time works better?
Client:    2:30 PM.
           ↓
     [AI calls book_appointment]
     { "client_name": "John Smith",
       "phone": "+15551234567",
       "date": "2026-03-21",
       "time": "14:30",
       "service_type": "exam" }
           ↓
     [Your server confirms the booking]
           ↓
Assistant: You're booked for March 21 at 2:30 PM. Don't forget your ID and insurance card!
```

### Example 2: Checking order status

```json
{
  "name": "check_order_status",
  "description": "Checks the order status by its number. Use when the client asks about their order.",
  "strict": false,
  "parameters": {
    "type": "object",
    "properties": {
      "order_id": {
        "type": "string",
        "description": "Order number (e.g., ORD-12345)"
      }
    },
    "required": ["order_id"]
  }
}
```

### Example 3: Creating a support ticket

```json
{
  "name": "create_ticket",
  "description": "Creates a ticket in the support system. Call if you cannot resolve the issue yourself.",
  "strict": true,
  "parameters": {
    "type": "object",
    "properties": {
      "user_email": {
        "type": "string",
        "description": "User's email for communication"
      },
      "subject": {
        "type": "string",
        "description": "Brief description of the problem"
      },
      "description": {
        "type": "string",
        "description": "Detailed description of the problem"
      },
      "priority": {
        "type": "string",
        "enum": ["low", "medium", "high", "critical"],
        "description": "Ticket priority"
      }
    },
    "required": ["user_email", "subject", "description"]
  }
}
```

---

## Linking functions to an assistant

Created functions need to be **linked to an assistant**. Without linking, the assistant doesn't know the functions exist.

### How to link:

1. Open the desired assistant
2. In the **Basic Settings** card, find the **"Functions"** field
3. Start typing the function name — a dropdown list will appear
4. Select the needed functions
5. Save the assistant

<div class="form-mockup">
  <div class="form-mockup-title">Linking Functions</div>
  <div class="form-mockup-field">
    <label>Functions</label>
    <div class="form-mockup-chips">
      <span class="form-mockup-chip selected">book_appointment ✕</span>
      <span class="form-mockup-chip selected">check_schedule ✕</span>
      <span class="form-mockup-chip selected">send_notification ✕</span>
    </div>
    <div class="form-mockup-input">Start typing...</div>
  </div>
</div>

> Tip: Don't forget to mention the linked functions in the assistant's prompt! For example: "Use the book_appointment function to book a client." This helps the AI understand when and why to call the function.

### How many functions can be connected?

There are no limits, but recommended:
- **3–7 functions** — optimal. The AI handles selection well
- **8–15 functions** — works, but requires thorough description of each function
- **More than 15** — may reduce selection accuracy. Consider splitting into multiple assistants

---

*Previous section: [Assistants](./02-assistants.md) · Next section: [MCP Servers →](./04-mcp-servers.md)*
