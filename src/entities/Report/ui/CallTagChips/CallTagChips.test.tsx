import { render, screen, fireEvent } from '@testing-library/react'
import { CallTagChips, slugifyTagId } from './CallTagChips'
import type { TagDefinition } from '../../model/types/report'

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, opts?: { name?: string, count?: number }) => {
            if (key.includes('{{name}}') && opts?.name) {
                return key.replace('{{name}}', opts.name)
            }
            if (key.includes('{{count}}') && opts?.count != null) {
                return key.replace('{{count}}', String(opts.count))
            }
            return key
        },
        i18n: { language: 'ru', changeLanguage: jest.fn() },
    }),
}))

const taxonomy: TagDefinition[] = [
    { id: 'billing', name: 'Счета', aliases: ['счёт'], color: '#ff0000' },
    { id: 'returns', name: 'Возвраты', aliases: ['возврат'] },
    { id: 'delivery', name: 'Доставка', aliases: ['курьер'] },
    { id: 'complaints', name: 'Жалобы', aliases: ['жалоба'] },
    { id: 'upsell', name: 'Апселл', aliases: ['допродажа'] },
]

describe('CallTagChips', () => {
    it('renders nothing in read-only mode when there are no tags', () => {
        const { container } = render(<CallTagChips tagIds={[]} taxonomy={taxonomy} />)
        expect(container).toBeEmptyDOMElement()
        expect(screen.queryByText('Темы не найдены')).not.toBeInTheDocument()
    })

    it('shows add controls for empty editable chips', () => {
        const onAdd = jest.fn()
        render(
            <CallTagChips
                tagIds={[]}
                taxonomy={taxonomy}
                editable={{
                    onRemove: jest.fn(),
                    onAdd,
                    availableTags: [taxonomy[0]],
                }}
            />,
        )

        fireEvent.click(screen.getByTestId('call-tag-chips-add'))
        fireEvent.click(screen.getByTestId('call-tag-chips-picker-option-billing'))
        expect(onAdd).toHaveBeenCalledWith('billing')
    })

    it('allows free-form custom tags when allowCustom is set', () => {
        const onAddCustom = jest.fn()
        render(
            <CallTagChips
                tagIds={[]}
                editable={{
                    onRemove: jest.fn(),
                    onAdd: jest.fn(),
                    availableTags: [],
                    allowCustom: true,
                    onAddCustom,
                }}
            />,
        )

        fireEvent.click(screen.getByTestId('call-tag-chips-add'))
        fireEvent.change(screen.getByTestId('call-tag-chips-custom-input'), {
            target: { value: 'Своя тема' },
        })
        fireEvent.submit(screen.getByTestId('call-tag-chips-custom-form'))
        expect(onAddCustom).toHaveBeenCalledWith('Своя тема')
    })

    it('slugifies free-form labels', () => {
        expect(slugifyTagId('  Hello World  ')).toBe('hello-world')
        expect(slugifyTagId('Счета / возврат')).toBe('счета-возврат')
    })

    it('renders one chip for a single tag', () => {
        render(
            <CallTagChips
                tagIds={['billing']}
                tagNames={{ billing: 'Счета' }}
                taxonomy={taxonomy}
            />,
        )
        expect(screen.getByTestId('call-tag-chips-chip-billing')).toHaveTextContent('Счета')
    })

    it('renders three chips plus overflow chip in bounded mode', () => {
        render(
            <CallTagChips
                mode="bounded"
                tagIds={['billing', 'returns', 'delivery', 'complaints', 'upsell']}
                tagNames={{
                    billing: 'Счета',
                    returns: 'Возвраты',
                    delivery: 'Доставка',
                    complaints: 'Жалобы',
                    upsell: 'Апселл',
                }}
                taxonomy={taxonomy}
            />,
        )

        expect(screen.getByTestId('call-tag-chips-chip-billing')).toBeInTheDocument()
        expect(screen.getByTestId('call-tag-chips-chip-returns')).toBeInTheDocument()
        expect(screen.getByTestId('call-tag-chips-chip-delivery')).toBeInTheDocument()
        expect(screen.queryByTestId('call-tag-chips-chip-complaints')).not.toBeInTheDocument()
        expect(screen.getByTestId('call-tag-chips-overflow')).toHaveTextContent('+2')
    })

    it('exposes the full tag list in hover text in bounded mode', () => {
        render(
            <CallTagChips
                mode="bounded"
                tagIds={['billing', 'returns', 'delivery', 'complaints']}
                tagNames={{
                    billing: 'Счета',
                    returns: 'Возвраты',
                    delivery: 'Доставка',
                    complaints: 'Жалобы',
                }}
                taxonomy={taxonomy}
            />,
        )

        expect(screen.getByTestId('call-tag-chips')).toHaveAttribute(
            'title',
            'Счета, Возвраты, Доставка, Жалобы',
        )
    })

    it('renders all chips in unbounded mode', () => {
        render(
            <CallTagChips
                mode="unbounded"
                tagIds={['billing', 'returns', 'delivery', 'complaints', 'upsell']}
                tagNames={{
                    billing: 'Счета',
                    returns: 'Возвраты',
                    delivery: 'Доставка',
                    complaints: 'Жалобы',
                    upsell: 'Апселл',
                }}
                taxonomy={taxonomy}
            />,
        )

        expect(screen.getByTestId('call-tag-chips-chip-upsell')).toBeInTheDocument()
        expect(screen.queryByTestId('call-tag-chips-overflow')).not.toBeInTheDocument()
    })

    it('falls back to taxonomy then identifier when snapshot name is missing', () => {
        const { rerender } = render(
            <CallTagChips tagIds={['returns']} taxonomy={taxonomy} />,
        )
        expect(screen.getByTestId('call-tag-chips-chip-returns')).toHaveTextContent('Возвраты')

        rerender(
            <CallTagChips tagIds={['unknown-id']} taxonomy={taxonomy} />,
        )
        expect(screen.getByTestId('call-tag-chips-chip-unknown-id')).toHaveTextContent('unknown-id')
    })

    it('prefers snapshot name over taxonomy name', () => {
        render(
            <CallTagChips
                tagIds={['billing']}
                tagNames={{ billing: 'Archived billing label' }}
                taxonomy={taxonomy}
            />,
        )
        expect(screen.getByTestId('call-tag-chips-chip-billing')).toHaveTextContent('Archived billing label')
    })

    it('renders optional color dot and never accent-fills the chip', () => {
        render(
            <CallTagChips
                tagIds={['billing']}
                tagNames={{ billing: 'Счета' }}
                taxonomy={taxonomy}
            />,
        )

        const chip = screen.getByTestId('call-tag-chips-chip-billing')
        expect(chip.querySelector('[aria-hidden="true"]')).toBeTruthy()
        expect(chip.className).toMatch(/chip/)
    })

    it('renders remove and add controls only in editable mode', () => {
        const onRemove = jest.fn()
        const onAdd = jest.fn()

        const { rerender } = render(
            <CallTagChips
                tagIds={['billing', 'returns']}
                tagNames={{ billing: 'Счета', returns: 'Возвраты' }}
                taxonomy={taxonomy}
            />,
        )

        expect(screen.queryByTestId('call-tag-chips-remove-billing')).not.toBeInTheDocument()
        expect(screen.queryByTestId('call-tag-chips-add')).not.toBeInTheDocument()

        rerender(
            <CallTagChips
                tagIds={['billing']}
                tagNames={{ billing: 'Счета' }}
                taxonomy={taxonomy}
                editable={{
                    onRemove,
                    onAdd,
                    availableTags: [taxonomy[1]],
                }}
            />,
        )

        fireEvent.click(screen.getByTestId('call-tag-chips-remove-billing'))
        expect(onRemove).toHaveBeenCalledWith('billing')

        fireEvent.click(screen.getByText('+ Добавить тему'))
        fireEvent.click(screen.getByTestId('call-tag-chips-picker-option-returns'))
        expect(onAdd).toHaveBeenCalledWith('returns')
    })

    it('invokes onTagClick with id and display name for journal filtering', () => {
        const onTagClick = jest.fn()
        render(
            <CallTagChips
                tagIds={['billing']}
                tagNames={{ billing: 'Счета' }}
                taxonomy={taxonomy}
                onTagClick={onTagClick}
            />,
        )

        fireEvent.click(screen.getByTestId('call-tag-chips-chip-billing'))
        expect(onTagClick).toHaveBeenCalledWith('billing', 'Счета')
    })
})
