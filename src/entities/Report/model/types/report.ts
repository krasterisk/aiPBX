import { HTMLAttributeAnchorTarget } from 'react'

export interface AllReports {
  count: number
  totalCost: number
  /** Sum in tenant currency (RUB on aipbx.ru); null on USD tenants */
  totalAmountCurrency?: number | null
  rows: Report[]
}

export type CdrSource = 'call' | 'widget' | 'playground'

export interface Report {
  id: string
  callerId: string
  channelId: string
  assistantName?: string
  assistantId?: string
  tokens?: number
  cost?: number
  costCurrency?: string | null
  amountCurrency?: number | null
  duration?: number
  recordUrl?: string
  events?: ReportEvent[]
  createdAt: string
  userId: string
  analytics?: Analytics
  billingRecords?: BillingRecord[]
  source?: CdrSource
  transcription?: string
  transcriptionQuality?: 'ok' | 'low' | 'unusable' | string | null
  transcriptionConfidence?: number | null
  detectedLanguage?: string | null
  qualityReasons?: string[] | null
}

export interface ReportsListProps {
  className?: string
  target?: HTMLAttributeAnchorTarget
  isReportsLoading?: boolean
  isReportsError?: boolean
  reports?: AllReports
}

export interface ReportFilters {
  userId?: string
  terminalId?: string | null
  tab?: string
  chartData?: ChartData[]
  allCount?: number
  allTokensCount?: number
  allDurationCount?: number
  allCost?: number
  startDate?: string | null
  endDate?: string | null
}

export interface ChartData {
  label?: string[]
  allCount?: number[]
  tokensCount?: number[]
  durationCount?: number[]
  amount?: number[]
}
export interface ReportEvent {
  channelId?: string
  callerId?: string
  type?: string
  event_id?: string
  timestamp?: string
  transcript?: string
  response?: {
    output?: any
    usage?: {
      total_tokens?: number
    }
  }
}

export interface ReportDialog {
  channelId: string
  timestamp: string
  role: 'User' | 'Assistant' | 'Function' | 'Call' | 'Error' | 'System'
  text: string
}

export interface BillingRecord {
  id: number
  channelId: string
  type: 'realtime' | 'analytic' | 'analytic_regen' | string
  audioTokens: number
  textTokens: number
  /** LLM input/prompt tokens (nullable; null for legacy records) */
  textTokensIn?: number | null
  /** LLM output/completion tokens (nullable; null for legacy records) */
  textTokensOut?: number | null
  totalTokens: number
  audioCost: number
  textCost: number
  totalCost: number
  currency?: string
  amountCurrency?: number | null
  sttCost?: number
  createdAt: string
}

export interface BusinessImpact {
  automation_rate?: number
  escalation_rate?: number
  cost_savings_estimated?: number
}

export interface ScenarioAnalysis {
  success?: boolean
  summary?: string
  escalation_reason?: string | null
  top_fallback_intents?: string[]
}

export interface UserSatisfaction {
  csat?: number
  sentiment?: string
  bail_out_rate?: boolean
  frustration_detected?: boolean
}

export interface AccuracyAndEfficiency {
  average_turns?: number
  dialog_completion_rate?: number
  entity_extraction_rate?: number
  context_retention_score?: number
  intent_recognition_rate?: number
}

export interface SpeechAndInteractionQuality {
  mos?: number
  wer_estimated?: number
  self_recovery_rate?: number
  response_latency_score?: number
}

export interface AnalyticsMetrics {
  // Nested bot-call metrics
  business_impact?: BusinessImpact
  scenario_analysis?: ScenarioAnalysis
  user_satisfaction?: UserSatisfaction
  accuracy_and_efficiency?: AccuracyAndEfficiency
  speech_and_interaction_quality?: SpeechAndInteractionQuality
  // Flat operator metrics (from file-upload analytics)
  greeting_quality?: number
  script_compliance?: number
  politeness_empathy?: number
  active_listening?: number
  objection_handling?: number
  product_knowledge?: number
  problem_resolution?: number
  speech_clarity_pace?: number
  closing_quality?: number
  customer_sentiment?: string
  summary?: string
  success?: boolean
  csat?: number
  custom_metrics?: Record<string, unknown>
  _quality?: {
    quality?: 'ok' | 'low' | 'unusable' | string
    confidence?: number
    reasons?: string[]
  }
  /** Per-metric reasoning: why the model assigned each score (+ supporting quote) */
  _assessments?: Record<string, { rationale?: string, quote?: string }>
  /** Legacy: bare supporting quotes (pre-assessments records) */
  _evidence?: Record<string, string>
  /** Snapshot of custom metric definitions used at analysis time */
  _custom_meta?: Record<string, StoredMetricMeta>
  _model?: { name?: string, promptVersion?: string }
  /** Project schema version captured at analysis time */
  _schema_version?: number
  /** Custom metric keys whose LLM values failed schema validation */
  _custom_invalid?: string[]
  /** Keyword spotting hits (compliance / competitor mentions) */
  _topics?: { keywords?: string[] }
}

export interface Analytics {
  id?: number
  channelId: string
  metrics?: AnalyticsMetrics
  summary?: string | null
  sentiment?: string | null
  csat?: number | null
  cost?: number
  tokens?: number
  createdAt?: string
  updatedAt?: string
}

// AI Analytics Dashboard Types

export interface AIAnalyticsResponse {
  totalCalls: number
  totalCost: number
  totalTokens: number
  metrics: AggregatedAIMetrics
  timeSeries: TimeSeriesPoint[]
  assistantMetrics: AssistantMetric[]
  topIssues: TopIssue[]
}

export interface AggregatedAIMetrics {
  // NLU Metrics (0-100)
  avgIntentRecognitionRate: number
  avgEntityExtractionRate: number
  dialogCompletionRate: number // 0-1 (convert to %)
  avgContextRetentionScore: number
  avgTurns: number

  // Speech Quality
  avgWerEstimated: number // 0-100
  avgResponseLatencyScore: number // 0-100
  avgMos: number // 1-5
  selfRecoveryRate: number // 0-1 (convert to %)

  // Business Impact
  escalationRate: number // 0-1 (convert to %)
  automationRate: number // 0-1 (convert to %)
  avgCostSavingsEstimated: number // 0-1 (convert to %)

  // Sentiment
  avgCsat: number // 1-5
  sentimentDistribution: {
    positive: number // %
    neutral: number // %
    negative: number // %
  }
  frustrationDetectedRate: number // %
  bailOutRate: number // %
}

export interface TimeSeriesPoint {
  label: string // Date or period label
  callsCount: number
  avgCsat: number
  avgMos: number
  automationRate: number
  totalCost: number
  totalTokens: number
}

export interface AssistantMetric {
  assistantId: string
  assistantName: string
  callsCount: number
  avgCsat: number
  automationRate: number
  totalCost: number
}

export interface TopIssue {
  intent: string
  count: number
}

// Operator Analytics Types

export interface OperatorMetrics {
  greeting_quality: number
  script_compliance: number
  politeness_empathy: number
  active_listening: number
  objection_handling: number
  product_knowledge: number
  problem_resolution: number
  speech_clarity_pace: number
  closing_quality: number
  customer_sentiment: 'Positive' | 'Neutral' | 'Negative'
  summary?: string
  success?: boolean
}

export type OperatorAnalysisStatus = 'processing' | 'completed' | 'error'

export interface OperatorAnalysisResult {
  id: string
  filename: string
  status: OperatorAnalysisStatus
  source?: 'frontend' | 'api'
  duration?: number
  cost?: number
  llmCost?: number
  sttCost?: number
  tokens?: number
  createdAt: string
  operatorName?: string
  clientPhone?: string
  language?: string
  transcription?: string
  recordUrl?: string
  metrics?: OperatorMetrics
  customMetrics?: Record<string, any>
  summary?: string
  success?: boolean
  projectId?: string
  project?: OperatorProject
}

export interface OperatorCdrResponse {
  data: OperatorAnalysisResult[]
  total: number
  page: number
  limit: number
}

export interface OperatorAggregatedMetrics {
  greeting_quality: number
  script_compliance: number
  politeness_empathy: number
  active_listening: number
  objection_handling: number
  product_knowledge: number
  problem_resolution: number
  speech_clarity_pace: number
  closing_quality: number
}

export interface OperatorDashboardResponse {
  totalAnalyzed: number
  /** Display total: RUB sum on RU tenant, else USD */
  totalCost: number
  /** Sum of amountCurrency on aiCdr (RU tenant) */
  totalAmountCurrency?: number | null
  avgCost?: number
  averageDuration: number
  averageScore: number
  successRate: number
  aggregatedMetrics: OperatorAggregatedMetrics
  sentimentDistribution: {
    positive: number
    neutral: number
    negative: number
  }
  timeSeries: {
    monthly: Array<{
      label: string
      callsCount: number
      avgScore: number
      avgDuration: number
    }>
    daily: Array<{
      label: string
      callsCount: number
      avgScore: number
      avgDuration: number
    }>
  }
  insightsAvailable: boolean
  customMetricsAggregated?: Record<string, {
    type: MetricDefinition['type']
    value?: number
    distribution?: Record<string, number>
  }>
  excludedLowQualityCount?: number
  agentScorecards?: AgentScorecard[]
}

export type InsightPriority = 'high' | 'medium' | 'low'
export type InsightType = 'strength' | 'gap' | 'trend' | 'outlier' | 'quality'

export interface OperatorInsightEvidence {
  metric?: string
  value?: number
  operators?: string[]
  periodLabel?: string
}

export interface OperatorInsight {
  priority: InsightPriority
  type: InsightType
  title: string
  observation: string
  recommendation: string
  evidence: OperatorInsightEvidence
}

export interface OperatorInsightsResponse {
  insights: OperatorInsight[]
  generatedAt: string
  promptVersion: string
  sampleSize: number
  lowConfidence: boolean
  factsDigest?: string
}

export interface AgentScorecard {
  operatorName: string
  callsCount: number
  averageScore: number
  successRate: number
  avgCsat: number | null
  negativeRate: number
}

export interface BatchUploadResponse {
  batchId: string
  total: number
  items: Array<{
    id: string
    filename: string
    status: OperatorAnalysisStatus
  }>
}

export type OperatorUploadResponse = BatchUploadResponse | Pick<OperatorAnalysisResult, 'id' | 'filename' | 'status'>

export type BatchItemStatus = 'pending' | 'processing' | 'completed' | 'error'

export interface BatchStatusResponse {
  batchId: string
  total: number
  completed: number
  failed: number
  progress: number
  items: Array<{
    id: string
    filename: string
    status: BatchItemStatus
  }>
  startedAt: string
  finishedAt: string | null
}

// ─── Metric / Dashboard types ─────────────────────────────────────────────────

export type MetricPolarity = 'positive' | 'negative' | 'neutral'

export interface MetricDefinition {
  id: string // snake_case
  name: string // "Попытка апселла"
  type: 'boolean' | 'number' | 'enum' | 'string'
  description: string // Instruction for LLM (max 500 chars)
  enumValues?: string[]
  min?: number // number scale minimum (default 0)
  max?: number // number scale maximum (default 100)
  unit?: string // display suffix, e.g. "/10", "%"
  polarity?: MetricPolarity // coloring semantics
}

/** Snapshot of a custom metric definition stored with an analysis result */
export interface StoredMetricMeta {
  name?: string
  type: 'boolean' | 'number' | 'enum' | 'string'
  min?: number
  max?: number
  unit?: string
  polarity?: MetricPolarity
  enumValues?: string[]
}

export type DefaultMetricKey =
  | 'greeting_quality' | 'script_compliance' | 'politeness_empathy'
  | 'active_listening' | 'objection_handling' | 'product_knowledge'
  | 'problem_resolution' | 'speech_clarity_pace' | 'closing_quality'

export type WidgetType = 'stat-card' | 'bar-chart' | 'line-chart' | 'pie-chart'
  | 'tag-cloud' | 'sparkline' | 'heatmap'

export interface DashboardWidget {
  id: string
  title: string
  source: 'default' | 'custom'
  metricId: string
  widgetType: WidgetType
  size: 'sm' | 'md' | 'lg'
  position: number
}

export interface DashboardConfig {
  widgets: DashboardWidget[]
  maxWidgets: number
}

export type WebhookEvent = 'analysis.completed' | 'analysis.error' | 'budget.exceeded' | 'anomaly.detected'

// ─── Human-in-the-loop metric overrides ───────────────────────────────────────

export type MetricOverrideOrigin = 'default' | 'custom' | 'summary'

/** Supervisor correction of an LLM metric value (stored separately from LLM output). */
export interface MetricOverride {
  id: number
  channelId: string
  userId: string
  actorUserId: string
  metricId: string
  origin: MetricOverrideOrigin
  numValue?: number | null
  boolValue?: boolean | null
  strValue?: string | null
  note?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface MetricOverrideInput {
  metricId: string
  origin?: MetricOverrideOrigin
  numValue?: number | null
  boolValue?: boolean | null
  strValue?: string | null
  note?: string | null
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface OperatorProject {
  id: string
  name: string
  description?: string
  createdAt: string
  isDefault?: boolean
  systemPrompt?: string
  customMetricsSchema?: MetricDefinition[]
  currentSchemaVersion?: number
  visibleDefaultMetrics?: DefaultMetricKey[]
  dashboardConfig?: DashboardConfig
  webhookUrl?: string
  webhookHeaders?: Record<string, string>
  webhookEvents?: WebhookEvent[]
  monthlyBudgetUsd?: number | null
  budgetAlertEmails?: string[] | null
}

// ─── Project Template ─────────────────────────────────────────────────────────

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  icon: string
  systemPrompt: string
  customMetricsSchema: MetricDefinition[]
  visibleDefaultMetrics: DefaultMetricKey[]
}

// ─── API Token ────────────────────────────────────────────────────────────────

export interface OperatorApiToken {
  id: string
  name: string
  preview: string
  createdAt: string
  lastUsedAt?: string
  isActive: boolean
  projectId?: string
  projectName?: string
}
