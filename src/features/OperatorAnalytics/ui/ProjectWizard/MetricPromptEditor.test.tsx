import { fireEvent, render, screen, within } from '@testing-library/react'
import { MetricPromptEditor } from './MetricPromptEditor'

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, options?: { name?: string }) => `${key}${options?.name ? ` ${options.name}` : ''}`,
    }),
}))

describe('MetricPromptEditor', () => {
    it('edits a long prompt in a dialog and applies the full text', () => {
        const onChange = jest.fn()
        render(<MetricPromptEditor name="Обращение к клиенту" value="Исходный промпт" onChange={onChange} />)
        fireEvent.click(screen.getByRole('button', { name: 'METRIC_PROMPT_EXPAND Обращение к клиенту' }))
        const dialog = screen.getByRole('dialog')
        expect(dialog).toHaveAccessibleName('METRIC_PROMPT_TITLE Обращение к клиенту')
        const input = within(dialog).getByRole('textbox')
        expect(input).toHaveValue('Исходный промпт')
        expect(input).toHaveFocus()
        const longPrompt = 'Обращение по имени или имени и отчеству.\n'.repeat(100)
        fireEvent.change(input, { target: { value: longPrompt } })
        expect(onChange).not.toHaveBeenCalled()
        fireEvent.click(within(dialog).getByRole('button', { name: 'Применить' }))
        expect(onChange).toHaveBeenCalledWith(longPrompt)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'METRIC_PROMPT_EXPAND Обращение к клиенту' })).toHaveFocus()
    })

    it('cancels the draft and opens with the latest saved form value', () => {
        const onChange = jest.fn()
        const { rerender } = render(<MetricPromptEditor name="Метрика" value="Первый текст" onChange={onChange} />)
        fireEvent.click(screen.getByRole('button', { name: 'METRIC_PROMPT_EXPAND Метрика' }))
        fireEvent.change(within(screen.getByRole('dialog')).getByRole('textbox'), { target: { value: 'Отменённый текст' } })
        fireEvent.click(screen.getByRole('button', { name: 'Отмена' }))
        expect(onChange).not.toHaveBeenCalled()
        rerender(<MetricPromptEditor name="Метрика" value="Новый текст формы" onChange={onChange} />)
        fireEvent.click(screen.getByRole('button', { name: 'METRIC_PROMPT_EXPAND Метрика' }))
        expect(within(screen.getByRole('dialog')).getByRole('textbox')).toHaveValue('Новый текст формы')
    })

    it('keeps keyboard focus inside the dialog and Escape cancels only this editor', () => {
        const onChange = jest.fn()
        const backgroundKeyDown = jest.fn()
        render(<div onKeyDown={backgroundKeyDown}>
            <MetricPromptEditor name="Метрика" value="Текст" onChange={onChange} />
        </div>)
        fireEvent.click(screen.getByRole('button', { name: 'METRIC_PROMPT_EXPAND Метрика' }))
        const dialog = screen.getByRole('dialog')
        const input = within(dialog).getByRole('textbox')
        fireEvent.keyDown(input, { key: 'Tab', shiftKey: true })
        const apply = within(dialog).getByRole('button', { name: 'Применить' })
        expect(apply).toHaveFocus()
        fireEvent.keyDown(apply, { key: 'Tab' })
        expect(input).toHaveFocus()
        backgroundKeyDown.mockClear()
        fireEvent.keyDown(input, { key: 'Escape' })
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(onChange).not.toHaveBeenCalled()
        expect(backgroundKeyDown).not.toHaveBeenCalled()
    })
})
