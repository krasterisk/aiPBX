import { HTMLAttributeAnchorTarget } from 'react'

export interface AllReports {
  count: number
  totalCost: number
  rows: Report[]
}

export interface Report {
  id: string
  callerId: string
  channelId: string
  assistantName?: string
  assistantId?: string
  tokens?: number
  cost?: number
  duration?: number
  recordUrl?: string
  events?: ReportEvent[]
  createdAt: string
  userId: string
  analytics?: Analytics
  billingRecords?: BillingRecord[]
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
  type: 'realtime' | 'analytic'
  audioTokens: number
  textTokens: number
  totalTokens: number
  audioCost: number
  textCost: number
  totalCost: number
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
  business_impact?: BusinessImpact
  scenario_analysis?: ScenarioAnalysis
  user_satisfaction?: UserSatisfaction
  accuracy_and_efficiency?: AccuracyAndEfficiency
  speech_and_interaction_quality?: SpeechAndInteractionQuality
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
