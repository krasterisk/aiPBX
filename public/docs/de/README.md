# AI PBX — Complete Platform Documentation

> **AI PBX** is a cloud platform for creating intelligent voice assistants powered by large language models (LLM). Assistants can conduct live phone conversations, take orders, schedule appointments, consult clients — all without a human operator.

---

## Contents

| #  | Section | Description |
|----|---------|-------------|
| 1  | [Getting Started](./01-getting-started.md) | Registration, your first assistant in 5 minutes, key concepts |
| 2  | [Assistants](./02-assistants.md) | Creation, configuration, prompts, models, voices, parameters |
| 3  | [Tools (Functions)](./03-tools.md) | Function Calling, Webhook, MCP — connecting external systems |
| 4  | [MCP Servers](./04-mcp-servers.md) | Composio integrations, Telegram, Gmail, CRM and hundreds more |
| 5  | [Playground](./05-playground.md) | Real-time assistant testing |
| 6  | [Dashboards & Analytics](./06-dashboards.md) | Overview, AI Analytics, Call Records, charts, export |
| 7  | [Publish & Integration](./07-publish.md) | SIP URI, WebRTC widgets, PBX servers, Asterisk |
| 8  | [Payments & Billing](./08-payments.md) | Balance, top-up, limits, history, organizations |

---

## Platform Architecture

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">AI PBX Architecture</div>
  <div class="form-mockup-section-title">Clients</div>
  <div class="form-mockup-row" style="justify-content: center;">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Phone</div>
      <div class="card-desc">SIP</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Website</div>
      <div class="card-desc">WebRTC</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Messengers</div>
      <div class="card-desc">Telegram, WhatsApp</div>
    </div>
  </div>
  <div class="form-mockup-divider"></div>
  <div class="form-mockup-section-title">Platform</div>
  <div class="form-mockup-row" style="justify-content: center;">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Assistants</div>
      <div class="card-desc">LLM</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Functions</div>
      <div class="card-desc">Webhook</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">MCP Servers</div>
      <div class="card-desc">Composio</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Playground</div>
      <div class="card-desc">Testing</div>
    </div>
  </div>
  <div class="form-mockup-card" style="text-align: center; margin-top: 8px;">
    <div class="card-title">AI Engine (GPT / Qwen / Yandex)</div>
    <div class="card-desc">Voice → Text → LLM → Text → Voice</div>
  </div>
  <div class="form-mockup-row" style="justify-content: center; margin-top: 8px;">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Dashboards</div>
      <div class="card-desc">Charts</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Reports</div>
      <div class="card-desc">History</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Payments</div>
      <div class="card-desc">Balance</div>
    </div>
  </div>
</div>

---

## Key Concepts

| Term | Definition |
|------|-----------|
| **Assistant** | A virtual voice operator powered by AI. One assistant = one "role" (pizzeria operator, clinic receptionist, etc.) |
| **Prompt (Instructions)** | A text instruction that defines the assistant's behavior. Like a job description for an employee |
| **Function (Tool)** | An action the assistant can perform during a conversation: register a client, check an order, send a notification |
| **MCP Server** | An external service (Telegram, Gmail, Google Calendar, etc.) connected via the MCP protocol |
| **SIP URI** | An address for connecting the assistant to a phone network (VoIP) |
| **WebRTC Widget** | A "Call" button on your website — the call goes directly from the browser |
| **Playground** | A safe environment for testing the assistant before launching in production |
| **VAD** | Voice Activity Detection — technology that determines when a person is speaking and when they are silent |
| **Tokens** | Units of text processing by the AI model. The more text in a dialog, the more tokens used |

---

*Last updated: February 2026*
