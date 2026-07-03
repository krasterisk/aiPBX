# Publish & Integration

> After testing the assistant in the Playground, you need to **publish** it — connect it to a real communication channel. AI PBX supports three methods: SIP (telephony), WebRTC widgets (website), and direct connection to a PBX server (Asterisk).

---

## Contents

1. [Publishing methods — overview](#publishing-methods-overview)
2. [SIPs — VoIP integration](#sips-voip-integration)
3. [Widgets — WebRTC for website](#widgets-webrtc-for-website)
4. [PBXs — Asterisk connection](#pbxs-asterisk-connection)
5. [Asterisk configuration](#asterisk-configuration)

---

## Publishing methods — overview

| Method | For whom | How it works | Complexity |
|--------|----------|-------------|------------|
| **SIP URI** | Companies with VoIP telephony | The assistant gets a SIP address, calls go through VoIP | Medium |
| **WebRTC Widget** | Website owners | A "Call" button on your website, calls from the browser | Easy |
| **PBX Server** | Companies with Asterisk | Direct connection to your Asterisk server | Advanced |

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Publishing Channels</div>
  <div class="form-mockup-row" style="justify-content: center; text-align: center;">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">AI PBX Cloud</div>
      <div class="card-desc">Assistant</div>
    </div>
  </div>
  <div class="form-mockup-row" style="justify-content: center; text-align: center; margin-top: 8px;">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">SIP URI</div>
      <div class="card-desc">VoIP Call</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">WebRTC</div>
      <div class="card-desc">Browser / Website</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Asterisk</div>
      <div class="card-desc">Office PBX</div>
    </div>
  </div>
</div>

---

## SIPs — VoIP integration

SIP (Session Initiation Protocol) is the internet telephony standard. Using a SIP URI, you can connect the assistant to any VoIP line.

### Creating a SIP URI

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">SIPs</div>
  <div class="form-mockup-list-item">
    <span class="item-name">support-bot</span>
    <span class="item-detail">sip:support-bot@sip.aipbx.com</span>
  </div>
  <div class="form-mockup-card">
    <div class="card-desc">Customer support bot</div>
  </div>
  <div class="form-mockup-list-item">
    <span class="item-name">pizza-order</span>
    <span class="item-detail">sip:pizza-order@sip.aipbx.com</span>
  </div>
  <div class="form-mockup-card">
    <div class="card-desc">Pizzeria operator</div>
  </div>
</div>

### SIP form

<div class="form-mockup">
  <div class="form-mockup-title">Create SIP URI</div>
  <div class="form-mockup-field" data-required>
    <label>SIP URI</label>
    <div class="form-mockup-input">support-bot</div>
    <div class="card-meta" style="margin-top: 4px;">→ sip:support-bot@sip.aipbx.com</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>Password</label>
    <div class="form-mockup-input">••••••••••</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>Assistant</label>
    <div class="form-mockup-select">Customer Support Bot ▾</div>
  </div>
  <div class="form-mockup-field">
    <label>Context (Dialplan)</label>
    <div class="form-mockup-input">assistant-in</div>
  </div>
  <div class="form-mockup-field">
    <label>Comment</label>
    <div class="form-mockup-input">Main tech support line</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Save</div>
  </div>
</div>

### SIP form fields

| Field | Description |
|-------|-------------|
| **SIP URI** | Unique identifier. Will be part of the SIP address: `sip:{your-id}@sip.aipbx.com` |
| **Password** | Password for SIP registration |
| **Assistant** | Which assistant will answer calls on this line |
| **Context** | Asterisk dialplan context. Usually `assistant-in` |
| **Comment** | Internal note |

### How to use SIP URI

1. **Create a SIP URI** in AI PBX
2. **Configure routing** on your PBX — direct incoming calls to the assistant's SIP address
3. **Test** — call the configured number

> Note: SIP URI works with any VoIP system that supports the SIP standard: Asterisk, FreePBX, 3CX, Yeastar, etc.

---

## Widgets — WebRTC for website

A widget is a "Call" button embedded in your website. The client clicks — and starts a conversation with the assistant directly from the browser, without installing apps or registering.

### Creating a widget

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Widgets</div>
  <div class="form-mockup-list-item">
    <span class="item-name">Website Widget — TechMaster</span>
    <span class="item-detail">ID: widget-abc123</span>
  </div>
  <div class="form-mockup-card">
    <div class="card-desc">Customer support bot</div>
  </div>
</div>

### Widget form

<div class="form-mockup">
  <div class="form-mockup-title">Create Widget</div>
  <div class="form-mockup-field" data-required>
    <label>Name</label>
    <div class="form-mockup-input">TechMaster website widget</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>Assistant</label>
    <div class="form-mockup-select">Customer Support Bot ▾</div>
  </div>
  <div class="form-mockup-field">
    <label>SIP URI for WebRTC</label>
    <div class="form-mockup-input">support-webrtc</div>
  </div>
  <div class="form-mockup-field">
    <label>Embed code</label>
    <div class="form-mockup-textarea" style="min-height: 50px; font-family: monospace; font-size: 13px;">&lt;script src="https://aipbx.com/widget/widget-abc123.js"&gt;&lt;/script&gt;</div>
  </div>
  <div class="form-mockup-field">
    <label>Comment</label>
    <div class="form-mockup-input">For the main page</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Save</div>
  </div>
</div>

### How to embed a widget on your website

1. **Create a widget** in AI PBX, select an assistant
2. **Copy the code** from the "Embed code" field
3. **Paste the code** into your website's HTML before the closing `</body>` tag:

```html
<!-- AI PBX Widget -->
<script src="https://aipbx.com/widget/widget-abc123.js"></script>
```

4. **Done!** A call button will appear on your website

> Tip: The widget works via WebRTC — only a browser and microphone are needed. No plugins or installations.

---

## PBXs — Asterisk connection

If you have your own **Asterisk** server, you can connect it directly to AI PBX. This gives you full control over call routing.

### Creating a PBX connection

<div class="form-mockup">
  <div class="form-mockup-title">Create PBX</div>
  <div class="form-mockup-field" data-required>
    <label>Name</label>
    <div class="form-mockup-input">Main Office</div>
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
    <label>ARI Login</label>
    <div class="form-mockup-input">asterisk</div>
  </div>
  <div class="form-mockup-field" data-required>
    <label>ARI Password</label>
    <div class="form-mockup-input">••••••••</div>
  </div>
  <div class="form-mockup-field">
    <label>Context (Dialplan)</label>
    <div class="form-mockup-input">assistant-in</div>
  </div>
  <div class="form-mockup-field">
    <label>Comment</label>
    <div class="form-mockup-input">Main office</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Save</div>
  </div>
</div>

### PBX form fields

| Field | Description |
|-------|-------------|
| **WebSocket URL** | WSS address of your Asterisk for bidirectional communication. Format: `wss://host:8089/ws` |
| **ARI URL** | HTTP address of Asterisk REST Interface for call management |
| **ARI Login/Password** | ARI credentials (configured in Asterisk) |
| **Context** | Dialplan context that handles incoming calls to the assistant |

---

## Asterisk configuration

> This section is for system administrators familiar with Asterisk.

### 1. Configuring ARI (`ari.conf`)

ARI (Asterisk REST Interface) is an HTTP API for call management. AI PBX uses ARI to receive audio and send responses.

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

### 2. Configuring HTTP (`http.conf`)

Enable the HTTP server and WebSocket:

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

> Note: TLS is required! WebSocket works through WSS (WebSocket Secure).

### 3. Configuring PJSIP (`pjsip.conf`)

Create a WebSocket transport and endpoint:

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

### 4. Configuring Dialplan (`extensions.conf`)

Create a context for handling assistant calls:

```ini
; /etc/asterisk/extensions.conf

[assistant-in]
exten => 100,1,NoOp()
same => n,Set(__fname=/usr/records/assistants/${UNIQUEID})
same => n,MixMonitor(${fname}.wav)
same => n,Stasis(aiPBXBot,${ASSISTANTID})
same => n,Hangup()
```

**What each line does:**

| Line | Action |
|------|--------|
| `NoOp()` | No operation (for logging) |
| `Set(__fname=...)` | Sets the path for recording |
| `MixMonitor(...)` | Enables call recording |
| `Stasis(aiPBXBot,...)` | Passes the call to the AI PBX ARI application |
| `Hangup()` | Ends the call after processing |

### 5. Call recordings

Recordings are available at URL:

```text
https://{{PBX_ADDRESS}}/records/{{ASSISTANTID}}/{{UNIQUEID}}.{{FORMAT}}
```

| Variable | Description |
|----------|-------------|
| `PBX_ADDRESS` | Address of your PBX server |
| `ASSISTANTID` | Assistant ID in AI PBX |
| `UNIQUEID` | Unique call ID (generated by Asterisk) |
| `FORMAT` | File format: `wav` or `mp3` |

> Important: Make sure the `/usr/records/assistants/` directory exists and has write permissions for the Asterisk user.

---

## Quick publishing checklist

### Option A: Widget on website (30 seconds)
- [ ] Go to "Widgets" → Create
- [ ] Select an assistant
- [ ] Copy the code
- [ ] Paste on website
- [ ] Done!

### Option B: SIP (5 minutes)
- [ ] Go to "SIPs" → Create
- [ ] Specify SIP URI and password
- [ ] Select an assistant
- [ ] Configure routing on PBX
- [ ] Done!

### Option C: Asterisk PBX (30 minutes)
- [ ] Configure ari.conf
- [ ] Configure http.conf with TLS
- [ ] Configure pjsip.conf
- [ ] Create context in extensions.conf
- [ ] Create PBX in AI PBX with WSS and ARI addresses
- [ ] Test a call
- [ ] Done!

---

*Previous section: [Dashboards](./06-dashboards.md) · Next section: [Payments & Billing →](./08-payments.md)*
