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

## See also

- [Calls](./09-calls.md)
- [Dashboards](./06-dashboards.md)
