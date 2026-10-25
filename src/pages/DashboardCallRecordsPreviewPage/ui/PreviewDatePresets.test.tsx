import { fireEvent, render, screen } from '@testing-library/react'
import { PreviewDatePresets } from './PreviewDatePresets'
import { datePreset, shiftDateRange } from './datePresets'

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 9, 24, 12, 30))
})
afterEach(() => { jest.useRealTimers() })

it.each(['today', 'week', 'month', 'year'] as const)('stops %s navigation at the current calendar period', preset => {
    const onChange = jest.fn()
    const current = datePreset(preset)
    const view = render(<PreviewDatePresets value={current} onChange={onChange} />)
    const next = screen.getByRole('button', { name: 'nextPeriod' })
    expect(next).toBeDisabled()
    fireEvent.click(next)
    expect(onChange).not.toHaveBeenCalled()
    const previous = shiftDateRange(current, -1)
    fireEvent.click(screen.getByRole('button', { name: 'previousPeriod' }))
    expect(onChange).toHaveBeenLastCalledWith(previous)
    view.rerender(<PreviewDatePresets value={previous} onChange={onChange} />)
    expect(next).toBeEnabled()
    fireEvent.click(next)
    expect(onChange).toHaveBeenLastCalledWith(current)
    view.rerender(<PreviewDatePresets value={current} onChange={onChange} />)
    expect(next).toBeDisabled()
})

it('allows yesterday to advance to today and blocks a future arbitrary range', () => {
    const onChange = jest.fn()
    const view = render(<PreviewDatePresets value={datePreset('yesterday')} onChange={onChange} />)
    expect(screen.queryByRole('button', { name: 'preset_yesterday' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'preset_today' })).toHaveAttribute('aria-pressed', 'true')
    const next = screen.getByRole('button', { name: 'nextPeriod' })
    expect(next).toBeEnabled()
    fireEvent.click(next)
    expect(onChange).toHaveBeenCalledWith(datePreset('today'))
    view.rerender(<PreviewDatePresets value={datePreset('today', new Date(2026, 9, 25))} onChange={onChange} />)
    expect(next).toBeDisabled()
})

it('selects a calendar year and retains the Year preset when navigating to another year', () => {
    const onChange = jest.fn()
    const view = render(<PreviewDatePresets value={datePreset('week')} onChange={onChange} />)
    expect(screen.queryByRole('button', { name: 'preset_last30' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'preset_year' }))
    expect(onChange).toHaveBeenCalledWith(datePreset('year'))
    view.rerender(<PreviewDatePresets value={datePreset('year', new Date(2024, 5, 10))} onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'preset_year' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'preset_month' })).toHaveAttribute('aria-pressed', 'false')
})

it('uses the extended filter for custom dates without a duplicate custom button', () => {
 const onChange = jest.fn(); const onOpenFilters = jest.fn()
 render(<PreviewDatePresets value={datePreset('week')} onChange={onChange} onOpenFilters={onOpenFilters} />)
 expect(screen.queryByRole('button', { name: 'preset_custom' })).not.toBeInTheDocument()
 fireEvent.click(screen.getByRole('button', { name: 'filters' })); expect(onOpenFilters).toHaveBeenCalledTimes(1)
 fireEvent.click(screen.getByRole('button', { name: 'preset_today' })); expect(onChange).toHaveBeenCalledWith(datePreset('today'))
})

it('moves the selected period backward and forward through arrow controls', () => {
    const onChange = jest.fn()
    const value = datePreset('week', new Date(2026, 9, 17))
    render(<PreviewDatePresets value={value} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'previousPeriod' }))
    expect(new Date(onChange.mock.calls[0][0].startDate).getDate()).toBe(5)
    fireEvent.click(screen.getByRole('button', { name: 'nextPeriod' }))
    expect(new Date(onChange.mock.calls[1][0].startDate).getDate()).toBe(19)
})
