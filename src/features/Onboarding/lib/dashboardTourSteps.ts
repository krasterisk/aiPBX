export type DashboardTourTargetId =
    | 'oa-upload-entry'
    | 'oa-stats'
    | 'oa-insights'
    | 'oa-charts'
    | 'oa-metrics'
    | 'oa-topics'
    | 'oa-scorecard'

export interface DashboardTourStepDef {
    id: DashboardTourTargetId
    /** If false, step is omitted when the target is missing in the DOM. */
    required: boolean
    titleKey: string
    titleFallback: string
    descKey: string
    descFallback: string
}

/** Canonical tour catalog (top → bottom of OperatorDashboard). */
export const DASHBOARD_TOUR_STEPS: readonly DashboardTourStepDef[] = [
    {
        id: 'oa-upload-entry',
        required: true,
        titleKey: 'analytics_tour_upload_title',
        titleFallback: 'Проекты и загрузка',
        descKey: 'analytics_tour_upload_desc',
        descFallback:
            'Переключайте проекты сверху. Отсюда же - настройка дашборда и загрузка новых записей. Для потока из АТС используйте API.',
    },
    {
        id: 'oa-stats',
        required: true,
        titleKey: 'analytics_tour_stats_title',
        titleFallback: 'Сводка за период',
        descKey: 'analytics_tour_stats_desc',
        descFallback:
            'Ключевые KPI: число звонков, средняя оценка, AHT, доля успешных. Это быстрый снимок качества за выбранные даты.',
    },
    {
        id: 'oa-insights',
        required: false,
        titleKey: 'analytics_tour_insights_title',
        titleFallback: 'AI-инсайты',
        descKey: 'analytics_tour_insights_desc',
        descFallback:
            'Автоматические выводы: тренды, риски и рекомендации. Нажмите инсайт - откроются связанные операторы или звонки.',
    },
    {
        id: 'oa-charts',
        required: false,
        titleKey: 'analytics_tour_charts_title',
        titleFallback: 'Настроение и успех',
        descKey: 'analytics_tour_charts_desc',
        descFallback:
            'Круговые диаграммы показывают распределение. Нажмите на сегмент, чтобы открыть детализацию: список звонков по выбранной категории.',
    },
    {
        id: 'oa-metrics',
        required: false,
        titleKey: 'analytics_tour_metrics_title',
        titleFallback: 'Метрики качества',
        descKey: 'analytics_tour_metrics_desc',
        descFallback:
            'Оценки по критериям (приветствие, эмпатия и др.). Нажмите метрику - увидите разбор и доказательства по звонкам.',
    },
    {
        id: 'oa-topics',
        required: false,
        titleKey: 'analytics_tour_topics_title',
        titleFallback: 'Темы звонков',
        descKey: 'analytics_tour_topics_desc',
        descFallback:
            'Темы из таксономии проекта. Нажмите на карточку темы, чтобы открыть статистику и список разговоров.',
    },
    {
        id: 'oa-scorecard',
        required: true,
        titleKey: 'analytics_tour_scorecard_title',
        titleFallback: 'Рейтинг операторов',
        descKey: 'analytics_tour_scorecard_desc',
        descFallback:
            'Сравнение операторов по оценкам. Нажмите на строку, чтобы провалиться в детализацию: метрики, доказательства и конкретный звонок.',
    },
] as const

export function resolveVisibleTourSteps(
    steps: readonly DashboardTourStepDef[],
    hasTarget: (id: DashboardTourTargetId) => boolean,
): DashboardTourStepDef[] {
    return steps.filter(step => step.required || hasTarget(step.id))
}

export interface ViewportBox {
    top: number
    left: number
    width: number
    height: number
}

export interface TourCardPlacement {
    top: number
    left: number
    placement: 'below' | 'above'
}

/**
 * Place the tour card in viewport coordinates (overlay is position:fixed).
 * Prefer below the spotlight; flip above if there is not enough room.
 */
export function placeTourCard(
    spotlight: ViewportBox,
    viewport: { width: number, height: number },
    card: { width: number, height: number } = { width: 360, height: 240 },
    gap = 16,
    pad = 16,
): TourCardPlacement {
    const bottom = spotlight.top + spotlight.height
    let placement: 'below' | 'above' = 'below'
    let top = bottom + gap

    if (top + card.height > viewport.height - pad) {
        top = spotlight.top - card.height - gap
        placement = 'above'
    }
    if (top < pad) {
        top = pad
    }

    let left = spotlight.left
    if (left + card.width > viewport.width - pad) {
        left = viewport.width - card.width - pad
    }
    if (left < pad) {
        left = pad
    }

    return { top, left, placement }
}

export function spotlightFromElement(
    el: Element,
    padding = 8,
): ViewportBox {
    const box = el.getBoundingClientRect()
    return {
        top: box.top - padding,
        left: box.left - padding,
        width: box.width + padding * 2,
        height: box.height + padding * 2,
    }
}
