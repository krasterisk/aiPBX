import { publishedQuality, formatQualityScore } from './quality'
it('reads the published result including zero; never computes or substitutes missing/unpublishable scores', () => {
    expect(publishedQuality({ qualityScore: 0, qualityStatus: 'scored' })).toBe(0)
    expect(publishedQuality({ qualityScore: 81.25, qualityStatus: 'scored' })).toBe(81.25)
    expect(publishedQuality({ qualityScore: 90, qualityStatus: 'needs_review' })).toBeNull()
    expect(publishedQuality({ qualityScore: null, qualityStatus: 'unscorable' })).toBeNull()
    expect(publishedQuality()).toBeNull()
    expect(formatQualityScore(69.99999999999999)).toBe('70')
    expect(formatQualityScore(86.25)).toBe('86.3')
    expect(formatQualityScore(null)).toBe('—')
})
