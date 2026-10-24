import { fireEvent, render, screen } from '@testing-library/react'
import { PreviewDatePresets } from './PreviewDatePresets'
import { datePreset } from './datePresets'

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

it('applies a preset and validates the custom date form before notifying the page', () => {
    const onChange = jest.fn()
    render(<PreviewDatePresets value={datePreset('week')} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'preset_yesterday' }))
    expect(onChange).toHaveBeenCalledWith(datePreset('yesterday'))
    fireEvent.click(screen.getByRole('button', { name: 'preset_custom' }))
    fireEvent.change(screen.getByLabelText('dateFrom'), { target: { value: '2026-10-24' } })
    fireEvent.change(screen.getByLabelText('dateTo'), { target: { value: '2026-10-23' } })
    expect(screen.getByRole('button', { name: 'applyDates' })).toBeDisabled()
    fireEvent.change(screen.getByLabelText('dateTo'), { target: { value: '2026-10-25' } })
    fireEvent.click(screen.getByRole('button', { name: 'applyDates' }))
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(new Date(onChange.mock.calls[1][0].endDate).getHours()).toBe(23)
})

it('moves the selected period backward and forward through arrow controls', () => {
    const onChange = jest.fn()
    const value = datePreset('week', new Date(2026, 9, 24))
    render(<PreviewDatePresets value={value} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'previousPeriod' }))
    expect(new Date(onChange.mock.calls[0][0].startDate).getDate()).toBe(12)
    fireEvent.click(screen.getByRole('button', { name: 'nextPeriod' }))
    expect(new Date(onChange.mock.calls[1][0].startDate).getDate()).toBe(26)
})
