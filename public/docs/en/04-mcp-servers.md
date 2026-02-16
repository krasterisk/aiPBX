# MCP Servers — External Service Integrations

> MCP (Model Context Protocol) Servers allow the assistant to interact with **hundreds of external services** — Gmail, Google Calendar, Telegram, Bitrix24, Slack, Notion, and many more. Connect a service once, and the assistant can use its tools in conversation.

---

## Contents

1. [What is MCP?](#what-is-mcp)
2. [Integration gallery (Composio)](#integration-gallery-composio)
3. [Connecting an MCP server](#connecting-an-mcp-server)
4. [MCP server configuration form](#mcp-server-configuration-form)
5. [Managing tools](#managing-tools)
6. [Custom MCP server](#custom-mcp-server)
7. [Linking to an assistant](#linking-to-an-assistant)

---

## What is MCP?

**MCP (Model Context Protocol)** is an open standard that allows AI to connect to external services through a unified protocol. Think of MCP as "USB for AI" — a universal connector through which you can plug in any tool.

### How does it work?

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">MCP Architecture</div>
  <div class="form-mockup-row" style="justify-content: center; text-align: center;">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Assistant</div>
      <div class="card-desc">AI PBX</div>
    </div>
    <div style="display: flex; align-items: center; padding: 0 8px; color: var(--hint-redesigned); font-size: 20px;">→</div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">MCP Server</div>
      <div class="card-desc">Middleware</div>
    </div>
    <div style="display: flex; align-items: center; padding: 0 8px; color: var(--hint-redesigned); font-size: 20px;">→</div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Services</div>
      <div class="card-desc">Gmail, Calendar, Telegram...</div>
    </div>
  </div>
</div>

**Without MCP:** For each service, you need to write your own webhook, figure out the API, and handle responses.

**With MCP:** Connect a ready-made MCP server, and the assistant immediately gets a set of tools — send an email, create an event, write to a chat.

---

## Integration gallery (Composio)

AI PBX integrates with **Composio** — a platform that provides ready-made MCP servers for 250+ services.

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">MCP Servers — Gallery</div>
  <div class="form-mockup-chips">
    <span class="form-mockup-chip selected">Gmail — Connected</span>
    <span class="form-mockup-chip">Google Calendar</span>
    <span class="form-mockup-chip">Google Sheets</span>
    <span class="form-mockup-chip">Slack</span>
    <span class="form-mockup-chip">Notion</span>
    <span class="form-mockup-chip">Bitrix24</span>
    <span class="form-mockup-chip selected">Telegram — Connected</span>
    <span class="form-mockup-chip">WhatsApp</span>
    <span class="form-mockup-chip">Outlook</span>
  </div>
  <p style="text-align: center; font-size: 13px; color: var(--hint-redesigned); margin-top: 12px;">... and 250+ more services</p>
</div>

### Connection process via Composio

1. **Select a service** from the gallery (e.g., Gmail)
2. **Click "Connect"** — the service authorization window will open
3. **Authorize** in the service (Google asks you to sign in and grant permissions)
4. **Done!** — MCP server is created. Its tools are immediately available to the assistant

<div class="form-mockup">
  <div class="form-mockup-title">Connecting Gmail</div>
  <div class="form-mockup-card">
    <div class="card-title">Google wants to make sure it's you</div>
    <div class="card-desc">
      your@gmail.com<br><br>
      AI PBX wants access to:<br>
      ✅ Read mail<br>
      ✅ Send emails<br>
      ✅ Manage labels
    </div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-secondary">Cancel</div>
    <div class="form-mockup-btn form-mockup-btn-primary">Allow</div>
  </div>
</div>

---

## Connecting an MCP server

### Two ways to create

1. **From the Composio gallery** — select a ready-made service (Gmail, Slack, etc.)
2. **Manually** — specify the address of your own MCP server

### Creating manually

Click **"My Servers" → ＋** to create a new MCP server.

---

## MCP server configuration form

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">MCP Server — Configuration</div>
  <div class="form-mockup-row" style="align-items: flex-start;">
    <div style="flex: 1;">
      <div class="form-mockup-section-title">Basic Settings</div>
      <div class="form-mockup-field" data-required>
        <label>Name</label>
        <div class="form-mockup-input">My Telegram Bot</div>
      </div>
      <div class="form-mockup-field">
        <label>Description</label>
        <div class="form-mockup-textarea" style="min-height: 60px;">Sends notifications about new requests</div>
      </div>
    </div>
    <div style="flex: 1;">
      <div class="form-mockup-section-title">Connection</div>
      <div class="form-mockup-field" data-required>
        <label>Server address (SSE URL)</label>
        <div class="form-mockup-input">https://mcp.example.com/sse</div>
      </div>
      <div class="form-mockup-field">
        <label>Authentication type</label>
        <div class="form-mockup-select">Bearer Token ▾</div>
      </div>
      <div class="form-mockup-field">
        <label>API Key / Token</label>
        <div class="form-mockup-input">sk-xxxxxxxxxxxxx</div>
      </div>
      <div class="form-mockup-field">
        <label>Chat ID (for Telegram)</label>
        <div class="form-mockup-input">123456789</div>
      </div>
      <div class="form-mockup-actions" style="border: none;">
        <div class="form-mockup-btn form-mockup-btn-primary">Connect</div>
      </div>
      <div class="form-mockup-list-item">
        <span class="item-name">Status</span>
        <span class="form-mockup-badge badge-success">Connected</span>
      </div>
    </div>
  </div>
  <div class="form-mockup-divider"></div>
  <div class="form-mockup-section-title">Tools</div>
  <div class="form-mockup-toggle active">
    <div class="toggle-track"><div class="toggle-thumb"></div></div>
    <span class="toggle-label">send_message — Send a message to Telegram</span>
  </div>
  <div class="form-mockup-toggle active">
    <div class="toggle-track"><div class="toggle-thumb"></div></div>
    <span class="toggle-label">get_updates — Get new messages</span>
  </div>
  <div class="form-mockup-toggle">
    <div class="toggle-track"><div class="toggle-thumb"></div></div>
    <span class="toggle-label">edit_message — Edit a sent message</span>
  </div>
  <div class="form-mockup-toggle">
    <div class="toggle-track"><div class="toggle-thumb"></div></div>
    <span class="toggle-label">send_photo — Send a photo</span>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-secondary">Sync Tools</div>
    <div class="form-mockup-btn form-mockup-btn-primary">Save</div>
  </div>
</div>

### Form fields

| Field | Description |
|-------|-------------|
| **Name** | A clear name for internal use |
| **Description** | Description of the server's purpose |
| **Server address (SSE URL)** | URL of the MCP server. SSE (Server-Sent Events) protocol — for bidirectional communication |
| **Authentication type** | `None`, `Bearer Token`, `Basic Auth`, or `Chat ID` (for Telegram) |
| **API Key / Token** | Key or token for authorization |
| **Chat ID** | For Telegram — the chat ID where notifications will be sent |

---

## Managing tools

After connecting an MCP server, you see a list of **tools** it provides. Each tool is a specific action the assistant can perform.

### Synchronization

Click **"Sync Tools"** to load the current list of tools from the MCP server. This should be done:
- On first connection
- If tools have been added or changed on the server

### Enabling/disabling

Not all tools are needed by your assistant. Use toggles to mark only the ones it will need.

> Tip: The fewer tools connected simultaneously, the more accurately the AI selects the right one. Don't enable everything — only what's actually needed.

### Viewing tool details

Click on a tool to see its parameters:

<div class="form-mockup">
  <div class="form-mockup-title">send_message</div>
  <div class="form-mockup-card">
    <div class="card-desc">Sends a text message to the specified Telegram chat.</div>
  </div>
  <div class="form-mockup-section-title">Parameters</div>
  <div class="form-mockup-list-item"><span class="item-name">chat_id</span><span class="item-detail">string, required — Chat ID to send to</span></div>
  <div class="form-mockup-list-item"><span class="item-name">text</span><span class="item-detail">string, required — Message text</span></div>
  <div class="form-mockup-list-item"><span class="item-name">parse_mode</span><span class="item-detail">string, optional — HTML, Markdown, or plain text</span></div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Test Tool</div>
  </div>
</div>

### Testing a tool

You can test each tool directly from the interface without connecting it to an assistant:

<div class="form-mockup">
  <div class="form-mockup-title">Testing: send_message</div>
  <div class="form-mockup-field">
    <label>Input parameters (JSON)</label>
    <div class="form-mockup-textarea" style="min-height: 80px;">{
  "chat_id": "123456789",
  "text": "Test message!"
}</div>
  </div>
  <div class="form-mockup-actions" style="border: none;">
    <div class="form-mockup-btn form-mockup-btn-primary">Execute</div>
  </div>
  <div class="form-mockup-section-title">Result</div>
  <div class="form-mockup-card">
    <div class="card-title"><span class="form-mockup-badge badge-success" style="margin-right: 8px;">Success</span></div>
    <div class="card-desc"><code>{ "ok": true, "message_id": 42 }</code></div>
  </div>
</div>

---

## Custom MCP server

You can connect **your own MCP server** built using the MCP standard.

### Requirements

1. Server must support the **SSE (Server-Sent Events)** protocol
2. Have an accessible URL (HTTPS)
3. Provide a list of tools via the `tools/list` request
4. Handle tool calls via the `tools/call` request

### Example in Node.js

```javascript
// Minimal MCP server
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const server = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0"
});

// Register a tool
server.tool("get_weather", { city: "string" }, async ({ city }) => {
  const weather = await fetchWeather(city);
  return { content: [{ type: "text", text: JSON.stringify(weather) }] };
});

// Start SSE transport
const transport = new SSEServerTransport("/sse", response);
await server.connect(transport);
```

---

## Linking to an assistant

Created MCP servers are linked to an assistant the same way as functions:

1. Open the desired assistant
2. In the **Basic Settings** card, find the **"MCP Servers"** field
3. Select the needed servers from the list
4. Save

<div class="form-mockup">
  <div class="form-mockup-title">Linking MCP Servers</div>
  <div class="form-mockup-field">
    <label>MCP Servers</label>
    <div class="form-mockup-chips">
      <span class="form-mockup-chip selected">Telegram Bot ✕</span>
      <span class="form-mockup-chip selected">Google Calendar ✕</span>
    </div>
    <div class="form-mockup-input">Start typing...</div>
  </div>
</div>

Tools from all connected MCP servers automatically become available to the assistant.

---

## Example scenarios

### Scenario 1: Request notifications via Telegram

**Flow:** Client calls → Assistant records data → Telegram MCP server → `send_message` → Manager receives notification:

> New request! Client: John Smith, +1 555-123-4567. Issue: washing machine not spinning.

### Scenario 2: Booking in Google Calendar

**Flow:** Client wants to book → Assistant clarifies date → `check_availability` → "Available at 2:00 PM and 4:30 PM" → Client chooses → `create_event` → Event created.

### Scenario 3: Confirmation email via Gmail

**Flow:** Order placed → Assistant asks for email → `send_email` → Client receives an order confirmation email.

---

*Previous section: [Tools (Functions)](./03-tools.md) · Next section: [Playground →](./05-playground.md)*
