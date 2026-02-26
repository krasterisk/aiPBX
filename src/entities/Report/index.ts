export type {
  AllReports,
  Report,
  ReportEvent,
  ReportFilters,
  BillingRecord,
  AIAnalyticsResponse,
  AggregatedAIMetrics,
  TimeSeriesPoint,
  AssistantMetric,
  TopIssue,
  CdrSource,
  OperatorMetrics,
  OperatorAnalysisResult,
  OperatorAnalysisStatus,
  OperatorCdrResponse,
  OperatorDashboardResponse,
  OperatorAggregatedMetrics,
  BatchUploadResponse,
  OperatorProject,
  OperatorApiToken,
  MetricDefinition,
  DefaultMetricKey,
  WidgetType,
  DashboardWidget,
  DashboardConfig,
  WebhookEvent,
  ProjectTemplate
} from './model/types/report'
export type { ReportsPageSchema } from './model/types/reportsPageSchema'
export {
  getReportsHasMore,
  getReportsInited,
  getReportsPageLimit,
  getReportsPageNum,
  getReportsTab,
  getReportsPageSearch,
  getReportsPageView
} from './model/selectors/reportSelectors'

export { initReportsPage } from './model/service/initReportsPage/initReportsPage'

export { useReportDialog } from './hooks/useReportDialog'

export {
  reportsPageSlice,
  reportsPageReducer,
  reportsPageActions
} from './model/slices/reportsPageSlice'

export {
  reportApi,
  useDeleteReport,
  useGetAllReports,
  useGetReport,
  useGetReports,
  useSetReports,
  useUpdateReport,
  useGetReportEvents,
  useGetReportDialogs,
  useDashboard,
  useGetAIAnalyticsDashboard,
  useUploadOperatorFiles,
  useGetOperatorAnalysis,
  useGetOperatorCdrs,
  useGetOperatorDashboard,
  useGetOperatorProjects,
  useCreateOperatorProject,
  useDeleteOperatorProject,
  useUpdateOperatorProject,
  useGenerateMetricsFromPrompt,
  useGenerateOperatorApiToken,
  useListOperatorApiTokens,
  useRevokeOperatorApiToken,
  useDeleteOperatorApiToken
} from './api/reportApi'

export { useReportFilters } from './lib/useReportFilters'

// ── Project Wizard Redux ──────────────────────────────────────────────────────
export type { ProjectWizardSchema, MetricMethod } from './model/types/projectWizardSchema'
export {
  projectWizardActions,
  projectWizardReducer
} from './model/slices/projectWizardSlice'
export {
  getWizardIsOpen,
  getWizardEditProjectId,
  getWizardMethod,
  getWizardMethodStepDone,
  getWizardName,
  getWizardDescription,
  getWizardSystemPrompt,
  getWizardCustomMetrics,
  getWizardVisibleDefaultMetrics,
  getWizardWebhookUrl,
  getWizardWebhookHeaders,
  getWizardWebhookEvents,
  getWizardSelectedTemplateId,
  getWizardShowWebhooks,
} from './model/selectors/projectWizardSelectors'

