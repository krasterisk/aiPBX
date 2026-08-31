# Operator Analytics

> Upload agent call recordings, get a transcript, quality scores, and custom metrics. Use the web UI or the API to ingest files from your PBX.

---

## Contents

1. [Analytics projects](#analytics-projects)
2. [Upload and project dashboard](#upload-and-project-dashboard)
3. [Analytics API](#analytics-api)
4. [For integrators](#for-integrators)
5. [Webhooks](#webhooks)

---

## Analytics projects

**Why:** one project = one analysis scope (for example “Sales floor” or “L1 support”). Each project has its own recordings, metrics, and dashboard.

**Where:** menu → **Analytics** → **Projects**.

![Project wizard](/docs/screenshots/project-wizard.png)

**Flow:**
1. Create a project in the wizard.
2. Upload one or more audio files (MP3, WAV) or connect the API (below).
3. Wait until analysis completes, then open the project dashboard.

---

## Upload and project dashboard

![Operator dashboard](/docs/screenshots/operator-dashboard.png)

On the project dashboard you will see:
- Call KPIs (volume, average duration, sentiment).
- **AI Insights** — short findings with a drill-down into the [call log](./09-calls.md).
- **Widget builder** — add your own metrics (tags, custom metrics).

Upload files with **Upload recording** inside the project, or drop files onto the import zone.

![Upload](/docs/screenshots/upload.png)

The [Call analytics dashboard](./06-dashboards.md) is a roll-up across projects; this page is one project in detail.

---

## Analytics API

**Why:** send recordings from your PBX without manual upload.

**Where:** menu → **Analytics** → **API**. Create a token bound to a **specific project**.

![Analytics API](/docs/screenshots/analytics-api.png)

1. Create a token for the project.
2. Send it as `Authorization: Bearer oa_...`.
3. POST a file or a recording URL (see the integrator section).

A token cannot be moved to another project — issue a new token for a new project.

---

## For integrators

### Authentication

```
Authorization: Bearer oa_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Analyze by URL (one file, synchronous)

`POST /api/operator-analytics/analyze-url`

```json
{
  "url": "https://storage.example.com/call.mp3",
  "operatorName": "Ivan",
  "language": "en"
}
```

### URL batch (background)

Send an `urls` array instead of `url` — you get a `batchId`; poll status separately.

### File upload

`POST /api/operator-analytics/analyze-file` — multipart field `file`, same Authorization header.

### Webhooks

After each analyzed call the platform can POST the full JSON to your HTTPS endpoint. Configure it under **Project settings → Webhooks**. Payload format: [Webhooks](#webhooks).

The API token is bound to a project at creation time. Every call submitted with that token lands in that project.

---

<a id="oa-webhooks"></a>

## Webhooks

**Why:** your CRM, BI, or internal service receives the call analysis when it finishes — no polling.

**How to enable:** menu → **Analytics** → **Projects** → project → **Settings** → **Webhooks**.

1. Set an `https://...` URL.
2. Optionally add headers (for example `Authorization: Bearer ...`).
3. Select events. For the full call analysis you need **`analysis.completed`**.

The in-app “Test webhook” button does not send a real request — the first live analysis is the real check.

### Transport

| | |
|---|---|
| Method | `POST` |
| Body | JSON, `Content-Type: application/json` |
| Headers | your project headers (plus `Content-Type`) |
| Timeout | 10 seconds |
| Retries | up to 3 attempts (1 s then 2 s backoff) |
| Success | any HTTP 2xx |
| Signature | no HMAC — authenticate with your own headers |

The request is sent only if the URL is set and the event type is enabled on the project. A webhook failure does not roll back the analysis.

Respond quickly: if the endpoint does not return 2xx within 10 s, the request is retried. Make the handler idempotent on `(event, recordId)`, or `(event, projectId, month)` for budget alerts.

### Envelope

Every request is one JSON object:

```json
{
  "event": "analysis.completed",
  "projectId": 12,
  "timestamp": "2026-08-31T08:26:14.382Z",
  "data": {}
}
```

| Field | Type | Description |
|---|---|---|
| `event` | string | `analysis.completed` \| `analysis.error` \| `budget.exceeded` \| `anomaly.detected` |
| `projectId` | number | Project ID |
| `timestamp` | string | Send time, ISO-8601 UTC |
| `data` | object | Event payload |

`projectId` is a number on the backend, not a string.

---

### `analysis.completed` — full call analysis

Sent after a successful file / URL / batch analysis, after regenerate, and after hash-based deduplication.

`data` includes identifiers, transcript, scores, custom metrics, rationales, and topics.

```json
{
  "event": "analysis.completed",
  "projectId": 12,
  "timestamp": "2026-08-31T08:26:14.382Z",
  "data": {
    "recordId": 4512,
    "filename": "call-20260831.wav",
    "metrics": {
      "greeting_quality": 82,
      "script_compliance": 71,
      "politeness_empathy": 90,
      "active_listening": 75,
      "objection_handling": 60,
      "product_knowledge": 88,
      "problem_resolution": 70,
      "speech_clarity_pace": 80,
      "closing_quality": 65,
      "customer_sentiment": "Positive",
      "csat": 4,
      "summary": "The customer asked about the plan and accepted an upgrade.",
      "success": true
    },
    "customMetrics": {
      "upsell_attempt": true,
      "nps_hint": 8,
      "tier": "high"
    },
    "transcription": "operator: Good afternoon\ncustomer: Hi, I want to change my plan",
    "turns": [
      { "speaker": "operator", "text": "Good afternoon", "start": 0.2, "end": 1.1 },
      { "speaker": "customer", "text": "Hi, I want to change my plan", "start": 1.3, "end": 4.0 }
    ],
    "duration": 142.5,
    "operatorName": "Anna Ivanova",
    "clientPhone": "+15551234567",
    "language": "en",
    "detectedLanguage": "en",
    "recordUrl": "https://storage.example.com/call.wav",
    "sttProvider": "openai",
    "quality": { "quality": "ok", "confidence": 0.91, "reasons": [] },
    "assessments": {
      "greeting_quality": {
        "rationale": "The agent greeted the customer and named the company.",
        "quote": "Good afternoon, this is Acme, Anna speaking"
      },
      "csat": {
        "rationale": "The customer thanked the agent at the end.",
        "quote": "Thank you so much"
      }
    },
    "customMetricsMeta": {
      "upsell_attempt": { "name": "Upsell attempt", "type": "boolean", "polarity": "positive" },
      "nps_hint": { "name": "NPS", "type": "number", "min": 0, "max": 10, "unit": "/10" },
      "tier": { "name": "Segment", "type": "enum", "enumValues": ["low", "high"] }
    },
    "topics": {
      "tags": ["plan_change"],
      "tag_names": { "plan_change": "Plan change" },
      "keywords": ["upgrade"]
    },
    "analysisConfidence": 0.88,
    "insufficientContent": false,
    "schemaVersion": 2,
    "promptVersion": "2026-08-12.1",
    "model": "gpt-4.1-mini",
    "diarizationSource": "channel",
    "customMetricsInvalid": null
  }
}
```

#### `data` fields

| Field | Type | Description |
|---|---|---|
| `recordId` | number | Analytics record ID |
| `filename` | string | Original filename |
| `metrics` | object | Enabled default scores plus call outcome |
| `customMetrics` | object \| null | Custom metric values; keys are schema `id`s |
| `transcription` | string \| null | Full text; if diarized, lines of `speaker: text` |
| `turns` | array \| null | `{ speaker, text, start?, end? }`; `speaker` is `operator` or `customer` |
| `duration` | number \| null | Audio length in seconds |
| `operatorName` | string \| null | Agent name, if provided on upload |
| `clientPhone` | string \| null | Customer phone, if provided |
| `language` | string \| null | STT language hint (`en`, `auto`, …) |
| `detectedLanguage` | string \| null | Language detected by STT |
| `recordUrl` | string \| null | Recording URL when analysis was started from a link |
| `sttProvider` | string \| null | Speech-to-text provider |
| `quality` | object \| null | `quality`: `ok` \| `low` \| `unusable`; `confidence` 0–1; `reasons` codes |
| `assessments` | object \| null | Rationale + quote per metric and for `csat` / `customer_sentiment` / `success` |
| `customMetricsMeta` | object \| null | Snapshot of the custom-metric schema (type, range, enum) |
| `topics` | object \| null | `tags` (ids), `tag_names`, `keywords` |
| `analysisConfidence` | number \| null | LLM confidence, 0–1 |
| `insufficientContent` | boolean \| null | Too little content for a stable score |
| `schemaVersion` | number \| null | Custom-metrics schema version at analysis time |
| `promptVersion` | string \| null | Prompt / rubric version |
| `model` | string \| null | Model that scored the call |
| `diarizationSource` | string \| null | `channel` \| `channel_energy` \| `channel_llm` \| `llm` |
| `customMetricsInvalid` | string[] \| null | Custom metric ids whose values were invalid (`null` in `customMetrics`) |
| `regenerated` | true | Present only on re-analysis |
| `deduplicatedFrom` | number | Source record id when the result was copied from a duplicate |

#### `metrics`

Only **enabled** default metrics for the project (all 9 if you did not hide any), plus the outcome fields:

| Key | Type | Scale |
|---|---|---|
| `greeting_quality` | integer | 0–100 |
| `script_compliance` | integer | 0–100 |
| `politeness_empathy` | integer | 0–100 |
| `active_listening` | integer | 0–100 |
| `objection_handling` | integer | 0–100 |
| `product_knowledge` | integer | 0–100 |
| `problem_resolution` | integer | 0–100 |
| `speech_clarity_pace` | integer | 0–100 |
| `closing_quality` | integer | 0–100 |
| `customer_sentiment` | string | `Positive` \| `Neutral` \| `Negative` |
| `csat` | integer | 1–5 |
| `summary` | string | Short summary in the call language |
| `success` | boolean | Request resolved successfully |

The audio file is **not** attached. Cost and token counts are not sent.

---

### `analysis.error`

Background analysis or URL download failed.

```json
{
  "event": "analysis.error",
  "projectId": 12,
  "timestamp": "2026-08-31T08:26:14.382Z",
  "data": {
    "recordId": 4512,
    "error": "Request failed with status code 404"
  }
}
```

---

### `budget.exceeded`

Project monthly spend reached the USD cap (at most once per UTC calendar month).

```json
{
  "event": "budget.exceeded",
  "projectId": 12,
  "timestamp": "2026-08-31T08:26:14.382Z",
  "data": {
    "projectId": 12,
    "projectName": "Sales floor",
    "monthlyBudgetUsd": 100,
    "spentUsd": 105.123456,
    "month": "2026-08",
    "alertEmails": ["ops@example.com"]
  }
}
```

---

### `anomaly.detected`

Once a day the platform compares a recent window to the previous one (CSAT drop / negativity spike).

```json
{
  "event": "anomaly.detected",
  "projectId": 12,
  "timestamp": "2026-08-31T04:00:01.120Z",
  "data": {
    "projectId": 12,
    "projectName": "Sales floor",
    "windowDays": 7,
    "recent": { "count": 20, "avgCsat": 3.5, "negativeRate": 15.2 },
    "baseline": { "count": 18, "avgCsat": 4.2, "negativeRate": 8.1 },
    "triggers": {
      "csatDrop": 16.67,
      "negativeSpike": 7.1
    }
  }
}
```

`csatDrop` is the CSAT drop versus baseline in percent; `negativeSpike` is the negativity increase in percentage points. A trigger that did not fire is `null`.

---

## See also

- [Calls](./09-calls.md)
- [Dashboards](./06-dashboards.md)
