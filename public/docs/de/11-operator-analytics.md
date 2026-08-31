# Operator Analytics

Speech analytics for call center recordings: upload audio, get transcripts, KPIs, and custom metrics. UI and API supported.

## Projects

Menu → **Analytics** → **Projects**. Create a project, upload files or use the API.

![Project wizard](/docs/screenshots/project-wizard.png)

## Project dashboard

![Operator dashboard](/docs/screenshots/operator-dashboard.png)

## API

Menu → **Analytics** → **API**. Generate a project-scoped token (`oa_...`).

![Analytics API](/docs/screenshots/analytics-api.png)

### For integrators

```
Authorization: Bearer oa_xxxxxxxx
POST /api/operator-analytics/analyze-url
POST /api/operator-analytics/analyze-file
```

Token is bound to one project at creation time.

<a id="oa-webhooks"></a>

## Webhooks

Configure under **Analytics → Projects → Settings → Webhooks**.

Every request is `POST` JSON:

```json
{
  "event": "analysis.completed",
  "projectId": 12,
  "timestamp": "2026-08-31T08:26:14.382Z",
  "data": {}
}
```

`analysis.completed` `data` includes the full call analysis: `recordId`, `filename`, `metrics`, `customMetrics`, `transcription`, `turns`, `assessments`, `topics`, quality and metadata. See the [English webhook reference](../en/11-operator-analytics.md#webhooks) for the complete field table.

Other events: `analysis.error`, `budget.exceeded`, `anomaly.detected`. Success = HTTP 2xx, timeout 10 s, up to 3 retries. No HMAC — use your own headers.

## See also

- [Calls](./09-calls.md)
- [Dashboards](./06-dashboards.md)
