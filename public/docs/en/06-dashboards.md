# Dashboards & Analytics

> Dashboards are your control center. Here you can see how many calls were processed, how long conversations lasted, how many tokens and funds were spent. Three sections — Overview, AI Analytics, and Call Records — give you a complete picture of your assistants' performance.

---

## Contents

1. [Overview — dashboard panel](#overview-dashboard-panel)
2. [AI Analytics — call analytics](#ai-analytics-call-analytics)
3. [Call Records — call history](#call-records-call-history)
4. [Filters and date range](#filters-and-date-range)
5. [Charts and visualizations](#charts-and-visualizations)
6. [Data export](#data-export)

---

## Overview — dashboard panel

The first Dashboard section shows **key metrics** for the selected period.

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Overview <span style="float: right; font-size: 13px; font-weight: 400; opacity: 0.7;">03/01 — 03/15/2026</span></div>
  <div class="form-mockup-row">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Calls</div>
      <div class="card-desc" style="font-size: 28px; font-weight: 700;">247</div>
      <div class="card-meta"><span class="form-mockup-badge badge-success">↑ 12%</span></div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Duration</div>
      <div class="card-desc" style="font-size: 28px; font-weight: 700;">18:32</div>
      <div class="card-meta"><span class="form-mockup-badge badge-warning">↓ 5%</span></div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Tokens</div>
      <div class="card-desc" style="font-size: 28px; font-weight: 700;">1.2M</div>
      <div class="card-meta"><span class="form-mockup-badge badge-success">↑ 8%</span></div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Spending</div>
      <div class="card-desc" style="font-size: 28px; font-weight: 700;">$42.50</div>
      <div class="card-meta"><span class="form-mockup-badge badge-success">↑ 3%</span></div>
    </div>
  </div>
  <div class="form-mockup-row" style="margin-top: 16px;">
    <div class="form-mockup-card" style="flex: 1;">
      <div class="card-title">Activity by Day</div>
      <div class="card-desc" style="font-style: italic; opacity: 0.6;">Line chart of call count</div>
    </div>
    <div class="form-mockup-card" style="flex: 1;">
      <div class="card-title">Distribution by Assistant</div>
      <div class="card-desc">
        <span class="form-mockup-badge badge-info" style="margin-right: 4px;">58%</span> Bot 1<br>
        <span class="form-mockup-badge badge-info" style="margin-right: 4px;">31%</span> Bot 2<br>
        <span class="form-mockup-badge badge-info" style="margin-right: 4px;">11%</span> Bot 3
      </div>
    </div>
  </div>
  <div class="form-mockup-row" style="margin-top: 8px;">
    <div class="form-mockup-card" style="flex: 1;">
      <div class="card-title">Average Duration</div>
      <div class="card-desc" style="font-style: italic; opacity: 0.6;">Trend over period</div>
    </div>
    <div class="form-mockup-card" style="flex: 1;">
      <div class="card-title">Spending by Day</div>
      <div class="card-desc" style="font-style: italic; opacity: 0.6;">Daily expenses</div>
    </div>
  </div>
</div>

### Top-level metrics

| Metric | Description |
|--------|-------------|
| **Calls** | Total number of processed calls for the period. Shows growth/decline (%) compared to the previous period |
| **Duration** | Average dialog duration (min:sec). Helps assess if the assistant is dragging out conversations |
| **Tokens** | Total number of processed tokens. 1 token ≈ 4 characters of text. Reflects the AI's "workload" |
| **Spending** | Total processing cost for the period. Consists of token cost + voice I/O |

---

## AI Analytics — call analytics

If the assistant has the **"Analytics"** option enabled in settings, after each call the AI automatically generates an analytical report.

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">AI Analytics <span style="float: right; font-size: 13px; font-weight: 400; opacity: 0.7;">03/01 — 03/15/2026</span></div>
  <div class="form-mockup-card">
    <div class="card-title">Call #247 <span style="float: right; font-weight: 400; opacity: 0.7;">03/15/2026 14:32</span></div>
    <div class="form-mockup-row" style="margin-top: 8px;">
      <span class="form-mockup-badge badge-success">Positive</span>
      <span class="form-mockup-badge badge-info">Appointment booking</span>
      <span class="form-mockup-badge badge-info">3:42</span>
      <span class="form-mockup-badge badge-success">Booked</span>
    </div>
    <div class="card-desc" style="margin-top: 12px;">
      <strong>Summary:</strong> Client called about a Samsung washing machine issue. Problem: spin cycle not working. Scheduled a technician visit for March 21 at 2:30 PM. Contact: +1 555-123-4567.
    </div>
    <div class="card-meta" style="margin-top: 8px;">Functions: check_schedule, book_appointment — all executed successfully ✅</div>
  </div>
  <div class="form-mockup-card">
    <div class="card-title">Call #246 <span style="float: right; font-weight: 400; opacity: 0.7;">03/15/2026 13:15</span></div>
    <div class="form-mockup-row" style="margin-top: 8px;">
      <span class="form-mockup-badge badge-warning">Neutral</span>
      <span class="form-mockup-badge badge-info">Price inquiry</span>
      <span class="form-mockup-badge badge-info">1:20</span>
    </div>
    <div class="card-desc" style="margin-top: 12px;">
      <strong>Summary:</strong> Client asked about the cost of refrigerator repair. The assistant explained that the cost is determined by the technician on-site. Client hasn't booked yet — said they'd call back.
    </div>
  </div>
</div>

### What AI Analytics generates

| Element | Description |
|---------|-------------|
| **Sentiment** | Positive / Neutral / Negative — emotional tone of the conversation |
| **Topic** | Automatically determined subject of the inquiry |
| **Summary** | Brief description of the conversation in 2-3 sentences |
| **Result** | Call outcome: booked, order placed, question resolved, will call back |
| **Functions** | Which functions were called and whether they were successful |

> Important: AI Analytics works ONLY if the **"Analytics"** checkbox is enabled in the assistant settings.

---

## Call Records — call history

Detailed history of all calls with the ability to listen to recordings and see full transcriptions.

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Call Records <span style="float: right; font-size: 13px; font-weight: 400; opacity: 0.7;">03/01 — 03/15/2026</span></div>
  <div class="form-mockup-list-item"><span class="item-name"><strong>#</strong></span><span class="item-detail"><strong>Date · Assistant · Duration · Status</strong></span></div>
  <div class="form-mockup-list-item"><span class="item-name">#247</span><span class="item-detail">03/15 14:32 · Support Bot · 3:42 · <span class="form-mockup-badge badge-success">OK</span></span></div>
  <div class="form-mockup-list-item"><span class="item-name">#246</span><span class="item-detail">03/15 13:15 · Support Bot · 1:20 · <span class="form-mockup-badge badge-success">OK</span></span></div>
  <div class="form-mockup-list-item"><span class="item-name">#245</span><span class="item-detail">03/15 11:08 · Pizzeria · 2:15 · <span class="form-mockup-badge badge-success">OK</span></span></div>
  <div class="form-mockup-list-item"><span class="item-name">#244</span><span class="item-detail">03/14 18:30 · Support Bot · 0:45 · <span class="form-mockup-badge badge-warning">Warn</span></span></div>
  <div class="form-mockup-list-item"><span class="item-name">#243</span><span class="item-detail">03/14 16:22 · Pizzeria · 4:10 · <span class="form-mockup-badge badge-success">OK</span></span></div>
  <p style="text-align: center; font-size: 13px; color: var(--hint-redesigned); margin-top: 12px;">Click a record to view details</p>
</div>

### Call details

Clicking on a record opens a detailed card:

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Call #247</div>
  <div class="form-mockup-row" style="align-items: flex-start;">
    <div style="flex: 2;">
      <div class="form-mockup-section-title">Information</div>
      <div class="form-mockup-list-item"><span class="item-name">Assistant</span><span class="item-detail">Support Bot</span></div>
      <div class="form-mockup-list-item"><span class="item-name">Channel ID</span><span class="item-detail">1a2b3c</span></div>
      <div class="form-mockup-list-item"><span class="item-name">Date</span><span class="item-detail">03/15/2026 14:32</span></div>
      <div class="form-mockup-list-item"><span class="item-name">Duration</span><span class="item-detail">3:42</span></div>
      <div class="form-mockup-list-item"><span class="item-name">Model</span><span class="item-detail">gpt-realtime</span></div>
      <div class="form-mockup-list-item"><span class="item-name">Tokens</span><span class="item-detail">2,340</span></div>
      <div class="form-mockup-list-item"><span class="item-name">Cost</span><span class="item-detail">$0.18</span></div>
    </div>
    <div style="flex: 3;">
      <div class="form-mockup-section-title">Transcription</div>
      <div class="form-mockup-card">
        <div class="card-desc" style="font-family: monospace; font-size: 13px; line-height: 1.8;">
          <strong>[14:32:01] Assistant:</strong> Hello! TechMaster repair center. How can I help you?<br>
          <strong>[14:32:05] Client:</strong> My washing machine broke, it won't spin.<br>
          <strong>[14:32:07] Assistant:</strong> Got it! Could you tell me the brand and model of your machine?<br>
          <strong>[14:32:15] Client:</strong> Samsung WW65.<br>
          <strong>[14:32:16]</strong> → check_schedule({"date": "2026-03-21"}) ✅<br>
          <strong>[14:32:18] Assistant:</strong> Great! We have availability on March 21 at 10:00 and 2:30 PM. Which time works better?<br>
          <strong>[14:32:25] Client:</strong> 2:30 PM.<br>
          ...
        </div>
      </div>
    </div>
  </div>
</div>

For each call, the following is available:
- **Audio recording** — if the assistant is connected via Asterisk with MixMonitor
- **Full transcription** — the entire dialogue in text form
- **Function calls** — which functions were called, with what parameters, and what result
- **Metadata** — model, tokens, cost, duration

---

## Filters and date range

All Dashboard sections support filtering:

| Filter | Description |
|--------|-------------|
| **Date range** | Data period: today, week, month, custom |
| **Assistant** | Show data only for a specific assistant |
| **Number/Channel ID** | Find a specific call |

---

## Charts and visualizations

Dashboard provides several chart types:

| Chart | What it shows |
|-------|---------------|
| **Activity by day** | Line chart of call count by day |
| **Average duration** | Trend of average conversation duration |
| **Spending by day** | Daily processing costs |
| **Distribution by assistant** | What percentage of calls goes to each assistant |
| **Tokens by day** | Computational resource consumption |

---

## Data export

Data from Call Records can be exported for further analysis:

1. Apply the needed filters (period, assistant)
2. Click **"Export"**
3. Select format: CSV

<div class="form-mockup">
  <div class="form-mockup-title">Data Export</div>
  <div class="form-mockup-list-item"><span class="item-name">Period</span><span class="item-detail">03/01 — 03/15/2026</span></div>
  <div class="form-mockup-list-item"><span class="item-name">Records</span><span class="item-detail">247</span></div>
  <div class="form-mockup-field">
    <label>Format</label>
    <div class="form-mockup-select">CSV (Excel compatible) ▾</div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Download</div>
  </div>
</div>

The exported file contains:
- Date and time of the call
- Assistant ID and name
- Channel ID
- Duration
- Number of tokens
- Cost
- Function status

---

*Previous section: [Playground](./05-playground.md) · Next section: [Publish & Integration →](./07-publish.md)*
