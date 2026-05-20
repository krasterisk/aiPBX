import { parseNotifyEmails } from './parseNotifyEmails'

describe('parseNotifyEmails', () => {
    it('splits by newline, comma, semicolon and whitespace', () => {
        expect(parseNotifyEmails('a@b.com, c@test.com\nd@e.com;f@g.com')).toEqual([
            'a@b.com',
            'c@test.com',
            'd@e.com',
            'f@g.com',
        ])
    })

    it('deduplicates and lowercases', () => {
        expect(parseNotifyEmails('  A@B.COM \n A@b.com ')).toEqual(['a@b.com'])
    })

    it('returns empty array for blank input', () => {
        expect(parseNotifyEmails('   \n,;  ')).toEqual([])
    })
})
