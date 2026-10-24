import { fireEvent, render, screen } from '@testing-library/react'
import { FiltersGroup } from './FiltersGroup'

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
jest.mock('@/entities/PeriodPicker', () => ({ PeriodPicker: () => <div>original-period-picker</div> }))
jest.mock('@/features/PeriodExtendedFilter', () => ({ PeriodExtendedFilters: ({ show }: any) => <div data-testid="extended-filter">{String(show)}</div> }))
const props: any = { onChangeTab: jest.fn(), onChangeAssistant: jest.fn(), onChangeUserId: jest.fn(), onChangeStartDate: jest.fn(), onChangeEndDate: jest.fn(), onChangeSource: jest.fn() }

it('keeps the existing period picker when the preview does not provide a slot', () => {
    render(<FiltersGroup {...props} />)
    expect(screen.getByText('original-period-picker')).toBeInTheDocument()
})

it('only replaces the picker when requested and retains access to extended filters', () => {
    render(<FiltersGroup {...props} periodControl={open => <button onClick={open}>preview-presets</button>} />)
    expect(screen.queryByText('original-period-picker')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'preview-presets' }))
    expect(screen.getByTestId('extended-filter')).toHaveTextContent('true')
})
