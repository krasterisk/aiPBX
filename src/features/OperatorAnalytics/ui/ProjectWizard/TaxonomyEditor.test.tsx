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
        description: 'Клиент просит вернуть товар',
    }

    it('renders name, description, and optional phrase fields', () => {
        render(
            <TaxonomyEditor
                taxonomy={[baseTheme, { id: 'delivery', name: 'Доставка', aliases: ['курьер'] }]}
                onChange={jest.fn()}
            />,
        )

        expect(screen.getByDisplayValue('Возвраты')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Клиент просит вернуть товар')).toBeInTheDocument()
        expect(screen.getByDisplayValue('возврат')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Доставка')).toBeInTheDocument()
        expect(screen.getByDisplayValue('курьер')).toBeInTheDocument()
        expect(screen.getAllByText('TAXONOMY_NAME_HINT')).toHaveLength(2)
        expect(screen.getAllByText('TAXONOMY_DESCRIPTION_HINT')).toHaveLength(2)
        expect(screen.getAllByText('TAXONOMY_KEYWORDS_HINT')).toHaveLength(2)
    })

    it('appends an empty row when adding a theme', () => {
        const onChange = jest.fn()
        render(<TaxonomyEditor taxonomy={[baseTheme]} onChange={onChange} />)

        fireEvent.click(screen.getByText('Добавить тему'))

        expect(onChange).toHaveBeenCalledWith([
            baseTheme,
            expect.objectContaining({ name: '', aliases: [], description: '' }),
        ])
    })

    it('keeps a stable theme id when the display name changes', () => {
        const onChange = jest.fn()
        render(<TaxonomyEditor taxonomy={[baseTheme]} onChange={onChange} />)

        fireEvent.change(screen.getByDisplayValue('Возвраты'), { target: { value: 'Complaints' } })

        expect(onChange).toHaveBeenCalledWith([
            expect.objectContaining({ id: 'returns', name: 'Complaints' }),
        ])
    })

    it('updates description independently of name', () => {
        const onChange = jest.fn()
        render(<TaxonomyEditor taxonomy={[baseTheme]} onChange={onChange} />)

        fireEvent.change(screen.getByDisplayValue('Клиент просит вернуть товар'), {
            target: { value: 'Возврат или обмен' },
        })

        expect(onChange).toHaveBeenCalledWith([
            expect.objectContaining({ id: 'returns', description: 'Возврат или обмен' }),
        ])
    })

    it('preserves in-progress phrase typing including trailing separators', () => {
        const onChange = jest.fn()
        render(<TaxonomyEditor taxonomy={[baseTheme]} onChange={onChange} />)

        const input = screen.getByDisplayValue('возврат')
        fireEvent.change(input, { target: { value: 'возврат, отказ, ' } })

        expect(input).toHaveValue('возврат, отказ, ')
        expect(onChange).toHaveBeenCalledWith([
            expect.objectContaining({ aliases: ['возврат', 'отказ'] }),
        ])
    })

    it('reports trimmed phrase list with empty entries dropped', () => {
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

        expect(screen.getByText('Добавьте темы - звонки начнут размечаться при следующем анализе.')).toBeInTheDocument()
        expect(screen.getByText(
            'Темы - метки для звонков. При анализе ИИ выбирает подходящие темы из справочника по смыслу разговора.',
        )).toBeInTheDocument()
    })
})
