import { fireEvent, render, screen } from '@testing-library/react'
import { CallPhone } from './CallPhone'

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

describe('CallPhone', () => {
    it.each([undefined, null, 'incoming'] as const)('shows legacy/default direction %s', callType => {
        render(<CallPhone phone="+79991234567" callType={callType} />)
        expect(screen.getByText('+79991234567')).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'Входящий' })).toBeInTheDocument()
        expect(screen.queryByText('Входящий')).not.toBeInTheDocument()
        expect(screen.queryByText('Исходящий')).not.toBeInTheDocument()
    })

    it('shows outgoing next to the phone with a decorative icon', () => {
        render(<CallPhone phone="221" callType="outgoing" />)
        const direction = screen.getByRole('img', { name: 'Исходящий' })
        expect(direction.parentElement?.parentElement).toContainElement(screen.getByText('221'))
        expect(direction.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    })

    it('shows internal calls explicitly', () => {
        render(<CallPhone phone="221" callType="internal" />)
        expect(screen.getByRole('img', { name: 'Внутренний' })).toHaveAttribute('data-direction', 'internal')
        expect(screen.queryByText('Входящий')).not.toBeInTheDocument()
    })

    it('shows the type only in the tooltip on hover', async () => {
        render(<CallPhone phone="221" callType="outgoing" />)
        expect(screen.queryByText('Исходящий')).not.toBeInTheDocument()
        fireEvent.mouseEnter(screen.getByRole('img', { name: 'Исходящий' }).parentElement!)
        expect(await screen.findByRole('tooltip')).toHaveTextContent('Исходящий')
    })
})
