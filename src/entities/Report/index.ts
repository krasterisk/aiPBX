export type {
  AllReports,
  Report,
  ReportEvent,
  ReportDialog,
  ReportFilters,
  BillingRecord,
  AIAnalyticsResponse,
  AggregatedAIMetrics,
  AnalyticsMetrics,
  Analytics,
  StoredMetricMeta,
  TimeSeriesPoint,
  AssistantMetric,
  TopIssue,
  CdrSource,
  OperatorMetrics,
  OperatorAnalysisResult,
  OperatorAnalysisStatus,
  OperatorCdrResponse,
  OperatorDashboardResponse,
  OperatorTopicStats,
  OperatorAggregatedMetrics,
  OperatorInsight,
  OperatorInsightsResponse,
  InsightPriority,
  InsightType,
  AgentScorecard,
  OperatorEvidenceItem,
  OperatorEvidenceMetric,
  OperatorEvidenceResponse,
  TagStat,
  BatchUploadResponse,
  BatchStatusResponse,
  BatchItemStatus,
  OperatorProject,
  OperatorApiToken,
  MetricDefinition,
  MetricOverrideInput,
  TagDefinition,
  DefaultMetricKey,
  MetricPolarity,
  WidgetType,
  DashboardWidget,
  DashboardConfig,
  WebhookEvent,
  ProjectTemplate,
  DigestConfig,
  DigestSchedule,
  DigestReportWindow,
  AlertConfig,
  AlertRuleCsatDrop,
  AlertRuleNegativeSpike,
  AlertRuleBudgetExceeded,
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
export { MetricOverridePanel } from './ui/ReportShowAnalytics/MetricOverridePanel'

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
  useLazyGetOperatorCdrs,
  useGetOperatorDashboard,
  useGetOperatorProjects,
  useCreateOperatorProject,
  useDeleteOperatorProject,
  useUpdateOperatorProject,
  useSendOperatorProjectDigest,
  useSendOperatorProjectAlertTest,
  useGenerateMetricsFromPrompt,
  useGenerateOperatorApiToken,
  useListOperatorApiTokens,
  useRevokeOperatorApiToken,
  useDeleteOperatorApiToken,
  useCreateCallAnalytics,
  useRegenerateOperatorAnalytics,
  useLazyGetBatchStatus,
  useLazyGetActiveBatches,
  useLazyGetOperatorInsights,
  useGetOperatorEvidence,
  WITHOUT_PROJECT_FILTER,
  useLazyGetReports,
  useUpdateCallTags,
  useSaveMetricOverrides,
  useDeleteMetricOverride,
} from './api/reportApi'

export { ReportExpandedPanel } from './ui/ReportExpandedPanel/ReportExpandedPanel'
export { ReportShowAnalytics } from './ui/ReportShowAnalytics/ReportShowAnalytics'
export { ReportShowDialog } from './ui/ReportShowDialog/ReportShowDialog'
export {
  CallTagChips,
  resolveTagDisplayName,
  resolveTagColor,
  slugifyTagId,
} from './ui/CallTagChips'
export type { CallTagChipsProps, CallTagChipsEditConfig } from './ui/CallTagChips'
export { useReportFilters } from './lib/useReportFilters'
export { useBatchProgress } from './lib/useBatchProgress'
export type {
  SingleBatchState,
  MultiBatchState,
  UseBatchProgressOptions,
  UseBatchProgressReturn,
} from './lib/useBatchProgress'
export { reportDisplayMoneyInput } from './lib/reportDisplayMoneyInput'
export { isOperatorAnalyticsSource, OPERATOR_CDR_SOURCE } from './lib/isOperatorAnalyticsSource'
export {
  serializeCsatFilter,
  isCsatFilterActive,
  CSAT_SCORE_VALUES,
} from './lib/csatFilter'
export type { CsatFilterValue } from './lib/csatFilter'

// ── Project Wizard Redux ──────────────────────────────────────────────────────
export type { ProjectWizardSchema, MetricMethod } from './model/types/projectWizardSchema'
export { DEFAULT_DIGEST_CONFIG, DEFAULT_ALERT_CONFIG, mergeAlertConfig } from './model/types/projectWizardSchema'
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
  getWizardSuccessPrompt,
  getWizardCustomMetrics,
  getWizardVisibleDefaultMetrics,
  getWizardCallTaxonomy,
  getWizardSingleTopic,
  getWizardWebhookUrl,
  getWizardWebhookHeaders,
  getWizardWebhookEvents,
  getWizardSelectedTemplateId,
  getWizardShowWebhooks,
  getWizardDigestConfig,
  getWizardShowDigest,
  getWizardAlertConfig,
} from './model/selectors/projectWizardSelectors'

export { CallPhone } from './ui/CallPhone/CallPhone'

export { useGetCallJournalQuery, useLazyGetCallJournalQuery, useGetCallJournalOptionsQuery } from './api/journalApi'
export type { JournalQuery, JournalPersonOption } from './api/journalApi'
export { useGetQualityDetailQuery, useGetQualityHistoryQuery, useGetQualityRulesQuery, useSaveQualityRulesMutation } from './api/qualityApi'
export { publishedQuality, formatQualityScore, JOURNAL_METRIC_LABELS } from './model/types/quality'
export type { QualityRule, QualityConfig, QualityDetail, QualityHistoryItem } from './model/types/quality'

export { useAnalyzeQualityPreviewMutation, useQualityJournalQuery, useLazyQualityJournalQuery, useSaveQualityPreviewOverridesMutation, useDeleteQualityPreviewOverrideMutation } from './api/qualityPreviewApi'

export { useRegenerateCallFreeMutation } from './api/qualityPreviewApi'
