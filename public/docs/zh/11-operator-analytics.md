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

在 **分析 → 项目 → 设置 → Webhooks** 中配置。

每次请求均为 `POST` JSON：

```json
{
  "event": "analysis.completed",
  "projectId": 12,
  "timestamp": "2026-08-31T08:26:14.382Z",
  "data": {}
}
```

`analysis.completed` 的 `data` 包含完整通话分析：`recordId`、`filename`、`metrics`、`customMetrics`、`transcription`、`turns`、`assessments`、`topics` 以及质量与元数据。完整字段表见 [英文文档](../en/11-operator-analytics.md#webhooks)。

其他事件：`analysis.error`、`budget.exceeded`、`anomaly.detected`。成功 = HTTP 2xx，超时 10 秒，最多重试 3 次。无 HMAC，请使用自定义请求头鉴权。

## See also

- [Calls](./09-calls.md)
- [Dashboards](./06-dashboards.md)
