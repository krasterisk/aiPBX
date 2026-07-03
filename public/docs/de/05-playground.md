# Playground — Assistant Testing

> The Playground is a safe environment where you can **call the assistant directly from your browser**, hear their voice, check the dialogue logic, and adjust parameters — all without publishing to production.

---

## Contents

1. [Why do you need the Playground?](#why-do-you-need-the-playground)
2. [Playground interface](#playground-interface)
3. [How to run a test](#how-to-run-a-test)
4. [Testing settings](#testing-settings)
5. [Reading logs and debugging](#reading-logs-and-debugging)
6. [Use case scenarios](#use-case-scenarios)
7. [Testing tips](#testing-tips)

---

## Why do you need the Playground?

Before publishing an assistant (SIP, widget), **always test it** in the Playground. Here's why:

| Without testing | With testing |
|---|---|
| Prompt may not work as intended | You'll verify every scenario |
| Functions may be called at the wrong time | Verify the AI collects all data before calling |
| Voice may not be suitable | Listen and replace |
| Clients will encounter errors | You'll find and fix them |

---

## Playground interface

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Playground</div>
  <div class="form-mockup-row" style="align-items: flex-start;">
    <div style="flex: 2;">
      <div class="form-mockup-section-title">Settings</div>
      <div class="form-mockup-field">
        <label>Assistant</label>
        <div class="form-mockup-select">Support Bot ▾</div>
      </div>
      <div class="form-mockup-field">
        <label>Model</label>
        <div class="form-mockup-select">gpt-realtime ▾</div>
      </div>
      <div class="form-mockup-field">
        <label>Voice</label>
        <div class="form-mockup-select">alloy ▾</div>
      </div>
      <div class="form-mockup-field">
        <label>Temperature: 0.8</label>
        <div class="form-mockup-slider">
          <div class="slider-track">
            <div class="slider-fill" style="width: 40%;"></div>
            <div class="slider-thumb" style="left: 40%;"></div>
          </div>
        </div>
      </div>
      <div class="form-mockup-field">
        <label>VAD threshold: 0.5</label>
        <div class="form-mockup-slider">
          <div class="slider-track">
            <div class="slider-fill" style="width: 50%;"></div>
            <div class="slider-thumb" style="left: 50%;"></div>
          </div>
        </div>
      </div>
      <div class="form-mockup-field">
        <label>Idle timeout: 30</label>
        <div class="form-mockup-slider">
          <div class="slider-track">
            <div class="slider-fill" style="width: 22%;"></div>
            <div class="slider-thumb" style="left: 22%;"></div>
          </div>
        </div>
      </div>
      <div class="form-mockup-field">
        <label>Instructions (prompt)</label>
        <div class="form-mockup-textarea" style="min-height: 80px;">You are a customer service operator for "TechMaster" repair center...</div>
      </div>
      <div class="form-mockup-actions" style="border: none;">
        <div class="form-mockup-btn form-mockup-btn-secondary">Reset</div>
      </div>
    </div>
    <div style="flex: 3;">
      <div class="form-mockup-section-title">Conversation</div>
      <div class="form-mockup-card">
        <div class="card-desc">
          <strong>Assistant:</strong> Hello! TechMaster repair center. How can I help you?<br><br>
          <strong>You:</strong> My washing machine broke, it won't spin<br><br>
          <strong>Assistant:</strong> Got it! Could you tell me the brand and model of your washing machine?<br><br>
          <strong>You:</strong> Samsung WW65...<br><br>
          <strong>Assistant:</strong> Samsung WW65, spinning issue. When would be convenient for a technician visit?
        </div>
      </div>
      <div class="form-mockup-section-title">Logs</div>
      <div class="form-mockup-card">
        <div class="card-meta" style="font-family: monospace; font-size: 12px;">
          [14:32:01] Session started<br>
          [14:32:02] STT: "My washing machine broke..."<br>
          [14:32:03] LLM response<br>
          [14:32:15] STT: "Samsung..."<br>
          [14:32:16] Function call: check_schedule(...)
        </div>
      </div>
      <div class="form-mockup-actions" style="justify-content: center; border: none;">
        <div class="form-mockup-btn form-mockup-btn-primary">Start Conversation</div>
      </div>
    </div>
  </div>
</div>

---

## How to run a test

### Step 1. Select an assistant

In the **"Assistant"** dropdown, select the one you want to test. All its settings (prompt, functions, parameters) will load automatically.

### Step 2. Adjust parameters (optional)

You can change settings **directly in the Playground** without editing the assistant:
- Switch models to compare quality
- Change the voice
- Adjust the temperature
- Edit the prompt "on the fly"

> Tip: Changes in the Playground **are not saved** to the assistant card. This is a safe environment for experimentation.

### Step 3. Start the conversation

Click **"Start Conversation"**. The browser will request microphone access — allow it.

<div class="form-mockup">
  <div class="form-mockup-title">Microphone Access</div>
  <div class="form-mockup-card">
    <div class="card-desc" style="text-align: center;">
      aipbx.com wants to access your microphone
    </div>
  </div>
  <div class="form-mockup-actions" style="justify-content: center;">
    <div class="form-mockup-btn form-mockup-btn-secondary">Deny</div>
    <div class="form-mockup-btn form-mockup-btn-primary">Allow</div>
  </div>
</div>

After connecting:
1. The assistant will say the **greeting** (if specified in the prompt)
2. Speak into the microphone like a regular client
3. The assistant will respond with voice
4. In the logs area, you'll see the entire process: speech recognition, AI responses, function calls

### Step 4. Check key moments

- Does the assistant introduce itself correctly?
- Does it understand questions?
- Does it call functions at the right time?
- Does it collect all data before calling a function?
- Does it end the conversation properly?
- Does it follow the constraints from the prompt?

### Step 5. Reset and repeat

Click **"Reset"** to start a new conversation from scratch. This is equivalent to a new incoming call.

---

## Testing settings

| Setting | Description | What to change for testing |
|---------|-------------|----------------------------|
| **Assistant** | Select assistant from the list | Compare different assistants |
| **Model** | Language model | Try gpt-realtime vs qwen-realtime with the same prompt |
| **Voice** | Voice persona | Listen to which voice fits better |
| **Temperature** | Response creativity | Increase to 1.0 to see variability |
| **VAD threshold** | Speech sensitivity | If the assistant "interrupts" — increase it |
| **Idle timeout** | Silence timeout | Decrease for faster tests |
| **Instructions** | Prompt text | Edit and immediately verify |

---

## Reading logs and debugging

At the bottom of the conversation area, **log entries** are displayed — a technical session journal:

```text
[14:32:01] Session started
[14:32:01] TTS: "Hello! TechMaster repair center."
[14:32:05] STT: "My washing machine broke won't spin"
[14:32:06] LLM: Processing...
[14:32:07] TTS: "Got it! Tell me the brand and model..."
[14:32:15] STT: "Samsung WW65"
[14:32:16] LLM: Processing...
[14:32:16] Function call: check_schedule({"date": "2026-03-21"})
[14:32:17] Function result: {"slots": ["10:00", "14:30"]}
[14:32:18] TTS: "There are available slots at 10:00 and 14:30..."
```

### What the entries mean:

| Type | Description |
|------|-------------|
| **Session** | Session start/end |
| **STT** | Speech recognition (what the assistant heard) |
| **LLM** | Language model processing |
| **TTS** | Speech synthesis (what the assistant said) |
| **Function** | Function call (with parameters) |
| **Result** | Function call result |
| **Error** | Error (function unavailable, timeout, etc.) |

---

## Use case scenarios

### 1. Prompt debugging

**Goal:** ensure the assistant correctly understands its role

- Test 1: Regular client → Assistant greets and leads the conversation ✅
- Test 2: Off-topic question → Assistant responds "This is outside my area of expertise" ✅
- Test 3: Aggressive client → Assistant remains polite ✅
- Test 4: Client gives incomplete data → Assistant asks follow-up questions ✅

### 2. Function testing

**Goal:** ensure functions are called correctly

- Test 1: Client provides all data → Function called with complete parameters ✅
- Test 2: Client provides only name → Assistant asks for missing data ✅
- Test 3: Webhook unavailable → Assistant reports an error ⚠️

### 3. Voice selection

**Goal:** find a voice suitable for a clinic

- shimmer — soft, caring → suitable ✅
- echo — deep, calm → suitable ✅
- ash — energetic → not suitable for a clinic ❌

### 4. Model comparison

**Goal:** choose the model with the best price/quality balance

Test: same prompt, one question "I'd like to book a dental appointment for tomorrow"

**gpt-realtime:** Clarified the time, asked about the reason, checked the schedule. Latency ~0.8 sec ✅

**qwen-realtime:** Clarified the time, booked. Didn't ask about the reason for the visit. Latency ~0.5 sec ⚠️

---

## Testing tips

1. **Speak like a real client.** Don't speak perfectly — mumble, pause, interrupt. This tests the assistant's robustness

2. **Test edge cases:**
   - What if the client is silent?
   - What if they speak in another language?
   - What if they ask a question with no answer?

3. **Test functions for errors:**
   - Disable the webhook and see how the assistant handles the error
   - Provide incomplete data and make sure the assistant doesn't call the function prematurely

4. **Record results.** After each test, note what works and what needs fixing. Iterative prompt debugging is a normal process

5. **Test after every change.** Changed the prompt → tested. Added a function → tested. Don't accumulate changes

---

*Previous section: [MCP Servers](./04-mcp-servers.md) · Next section: [Dashboards & Analytics →](./06-dashboards.md)*
