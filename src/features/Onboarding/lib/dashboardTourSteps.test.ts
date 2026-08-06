import { resolveVisibleTourSteps, DASHBOARD_TOUR_STEPS, placeTourCard } from './dashboardTourSteps'

describe('dashboardTourSteps', () => {
    describe('resolveVisibleTourSteps', () => {
        it('keeps required steps even when the target is missing', () => {
            const visible = resolveVisibleTourSteps(DASHBOARD_TOUR_STEPS, () => false)
            expect(visible.map(s => s.id)).toEqual(['oa-upload-entry', 'oa-stats', 'oa-scorecard'])
        })

        it('includes optional steps only when their targets exist', () => {
            const present = new Set(['oa-insights', 'oa-topics', 'oa-metrics'])
            const visible = resolveVisibleTourSteps(
                DASHBOARD_TOUR_STEPS,
                id => present.has(id) || id === 'oa-upload-entry' || id === 'oa-stats' || id === 'oa-scorecard',
            )
            expect(visible.map(s => s.id)).toEqual([
                'oa-upload-entry',
                'oa-stats',
                'oa-insights',
                'oa-metrics',
                'oa-topics',
                'oa-scorecard',
            ])
        })
    })

    describe('placeTourCard', () => {
        it('places the card below the spotlight when there is room', () => {
            const result = placeTourCard(
                { top: 40, left: 20, width: 200, height: 80 },
                { width: 1200, height: 900 },
                { width: 360, height: 200 },
            )
            expect(result.placement).toBe('below')
            expect(result.top).toBe(40 + 80 + 16)
            expect(result.left).toBe(20)
        })

        it('flips the card above when the spotlight is near the bottom', () => {
            const result = placeTourCard(
                { top: 700, left: 100, width: 300, height: 120 },
                { width: 1200, height: 800 },
                { width: 360, height: 220 },
            )
            expect(result.placement).toBe('above')
            expect(result.top).toBeLessThan(700)
        })

        it('clamps the card into the viewport horizontally', () => {
            const result = placeTourCard(
                { top: 40, left: 1000, width: 200, height: 80 },
                { width: 1100, height: 900 },
                { width: 360, height: 200 },
            )
            expect(result.left + 360).toBeLessThanOrEqual(1100 - 16)
            expect(result.left).toBeGreaterThanOrEqual(16)
        })
    })
})
