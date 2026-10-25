import type { Analytics, Report, MetricOverrideInput } from './report'

export interface QualityRule {
    id: string
    origin: 'default' | 'custom'
    name: string
    type: 'number' | 'boolean' | 'enum' | 'string'
    included: boolean
    weight: number
    critical: 'none' | 'flag' | 'fail'
    normalization: { kind: 'linear', min: number, max: number, inverted?: boolean } | { kind: 'points', values: Record<string, number>, maxPoints: number } | { kind: 'none' }
}
export interface QualityConfig {
    minimumCoverage?: number
    criteria?: Record<string, Partial<Pick<QualityRule, 'included' | 'weight' | 'critical' | 'normalization'>>>
}
export interface QualityCriterion {
    id: string
    origin: 'default' | 'custom'
    status: 'assessed' | 'not_applicable' | 'insufficient_evidence' | 'missing' | 'invalid'
    source: 'model' | 'human' | 'legacy'
    value: number | boolean | string | null
    normalized: number | null
    included: boolean
    weight: number
    rationale?: string
    quote?: string
}
export interface QualityResult {
    score: number | null
    candidateScore: number | null
    status: 'scored' | 'needs_review' | 'unscorable'
    coverage: number
    formulaVersion: string
    contextIncomplete: boolean
    criticalStatus: 'pass' | 'fail' | 'unknown'
    criteria: QualityCriterion[]
}
export interface QualityDetail {
    corrections?: MetricOverrideInput[]
    record: Report
    analytics: Analytics | null
    evaluation: { id: string, previousRunId: string | null, result: QualityResult, kind: string, createdAt: string, scorecardRevisionId: string } | null
    criteria: QualityRule[]
    minimumCoverage: number | null
}
export interface QualityHistoryItem {
    id: string
    kind: string
    score: number | null
    status: QualityResult['status']
    coverage: number
    formulaVersion: string
    contextIncomplete: boolean
    createdAt: string
    scorecardRevisionId: string
}
export interface QualityRulesResponse {
    enabled: boolean
    revisionId: string
    minimumCoverage: number
    criteria: QualityRule[]
    config: QualityConfig
}

/** The browser formats published results; it never implements the scoring formula. */
export function publishedQuality(analytics?: Pick<Analytics, 'qualityStatus' | 'qualityScore'> | null): number | null {
    const score = analytics?.qualityScore
    return analytics?.qualityStatus === 'scored' && typeof score === 'number' && Number.isFinite(score) ? score : null
}
export function formatQualityScore(score?: number | null): string {
    return score == null || !Number.isFinite(score) ? '—' : String(Number(score.toFixed(1)))
}

export const JOURNAL_METRIC_LABELS: Record<string, string> = {
    greeting_quality: 'Качество приветствия',
script_compliance: 'Следование скрипту',
    politeness_empathy: 'Вежливость и эмпатия',
active_listening: 'Активное слушание',
    objection_handling: 'Работа с возражениями',
product_knowledge: 'Знание продукта',
    problem_resolution: 'Решение проблемы',
speech_clarity_pace: 'Темп речи',
closing_quality: 'Качество завершения'
}
