import { render, screen, fireEvent } from '@testing-library/react'
import { TaxonomyEditor } from './TaxonomyEditor'
import { TagDefinition } from '@/entities/Report'

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, opts?: { name?: string }) => {
            if (key.includes('{{name}}') && opts?.name) {
                return key.replace('{{name}}', opts.name)
            }
            return key
        },
        i18n: { language: 'ru', changeLanguage: jest.fn() },
    }),
}))

describe('TaxonomyEditor', () => {
    const baseTheme: TagDefinition = {
        id: 'returns',
        name: 'Возвраты',
        aliases: ['возврат'],
    }

    it('renders one row per theme with name and synonym fields', () => {
        render(
            <TaxonomyEditor
                taxonomy={[baseTheme, { id: 'delivery', name: 'Доставка', aliases: ['курьер'] }]}
                onChange={jest.fn()}
            />,
        )

        expect(screen.getByDisplayValue('Возвраты')).toBeInTheDocument()
        expect(screen.getByDisplayValue('возврат')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Доставка')).toBeInTheDocument()
        expect(screen.getByDisplayValue('курьер')).toBeInTheDocument()
    })

    it('appends an empty row when adding a theme', () => {
        const onChange = jest.fn()
        render(<TaxonomyEditor taxonomy={[baseTheme]} onChange={onChange} />)

        fireEvent.click(screen.getByText('Добавить тему'))

        expect(onChange).toHaveBeenCalledWith([
            baseTheme,
            expect.objectContaining({ name: '', aliases: [] }),
        ])
    })

    it('derives theme id from the display name', () => {
        const onChange = jest.fn()
        render(<TaxonomyEditor taxonomy={[baseTheme]} onChange={onChange} />)

        fireEvent.change(screen.getByDisplayValue('Возвраты'), { target: { value: 'Complaints' } })

        expect(onChange).toHaveBeenCalledWith([
            expect.objectContaining({ id: 'complaints', name: 'Complaints' }),
        ])
    })

    it('reports trimmed synonym list with empty entries dropped', () => {
        const onChange = jest.fn()
        render(<TaxonomyEditor taxonomy={[baseTheme]} onChange={onChange} />)

        fireEvent.change(screen.getByDisplayValue('возврат'), { target: { value: ' a , , b ,  ' } })

        expect(onChange).toHaveBeenCalledWith([
            expect.objectContaining({ aliases: ['a', 'b'] }),
        ])
    })

    it('opens confirmation when delete is activated and does not remove yet', () => {
        const onChange = jest.fn()
        render(<TaxonomyEditor taxonomy={[baseTheme]} onChange={onChange} />)

        fireEvent.click(screen.getByText('Удалить'))

        expect(screen.getByText('Удалить тему «Возвраты»?')).toBeInTheDocument()
        expect(onChange).not.toHaveBeenCalled()
    })

    it('removes the row after confirmation', () => {
        const onChange = jest.fn()
        render(<TaxonomyEditor taxonomy={[baseTheme]} onChange={onChange} />)

        fireEvent.click(screen.getByText('Удалить'))
        fireEvent.click(screen.getByText('Удалить тему'))

        expect(onChange).toHaveBeenCalledWith([])
    })

    it('leaves the list unchanged when the dialog is dismissed', () => {
        const onChange = jest.fn()
        render(<TaxonomyEditor taxonomy={[baseTheme]} onChange={onChange} />)

        fireEvent.click(screen.getByText('Удалить'))
        fireEvent.click(screen.getByText('Отмена'))

        expect(onChange).not.toHaveBeenCalled()
    })

    it('shows guidance when no themes are configured', () => {
        render(<TaxonomyEditor taxonomy={[]} onChange={jest.fn()} />)

        expect(screen.getByText('Добавьте темы и ключевые слова — звонки начнут размечаться при следующем анализе.')).toBeInTheDocument()
    })
})
