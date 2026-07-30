import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SidePanel } from './SidePanel'

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'ru', changeLanguage: jest.fn() },
    }),
}))

describe('SidePanel', () => {
    it('renders no panel content when closed', () => {
        render(
            <SidePanel isOpen={false} onClose={jest.fn()} title="Test panel">
                <div data-testid="panel-body">Body</div>
            </SidePanel>,
        )

        expect(screen.queryByText('Test panel')).not.toBeInTheDocument()
        expect(screen.queryByTestId('panel-body')).not.toBeInTheDocument()
    })

    it('renders title and close control with accessible label when open', () => {
        render(
            <SidePanel isOpen onClose={jest.fn()} title="Operator breakdown">
                <div>Body</div>
            </SidePanel>,
        )

        expect(screen.getByText('Operator breakdown')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Закрыть панель' })).toBeInTheDocument()
    })

    it('calls onClose when close control is activated', async () => {
        const onClose = jest.fn()
        const user = userEvent.setup()

        render(
            <SidePanel isOpen onClose={onClose} title="Panel">
                <div>Body</div>
            </SidePanel>,
        )

        await user.click(screen.getByRole('button', { name: 'Закрыть панель' }))

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when Escape is pressed', async () => {
        const onClose = jest.fn()
        const user = userEvent.setup()

        render(
            <SidePanel isOpen onClose={onClose} title="Panel">
                <div>Body</div>
            </SidePanel>,
        )

        await user.keyboard('{Escape}')

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not render back control when onBack is omitted', () => {
        render(
            <SidePanel isOpen onClose={jest.fn()} title="Panel">
                <div>Body</div>
            </SidePanel>,
        )

        expect(screen.queryByRole('button', { name: 'Назад' })).not.toBeInTheDocument()
    })

    it('renders back control and calls onBack without calling onClose', async () => {
        const onClose = jest.fn()
        const onBack = jest.fn()
        const user = userEvent.setup()

        render(
            <SidePanel
                isOpen
                onClose={onClose}
                onBack={onBack}
                backLabel="Назад к Иван"
                title="Panel"
            >
                <div>Body</div>
            </SidePanel>,
        )

        await user.click(screen.getByRole('button', { name: 'Назад к Иван' }))

        expect(onBack).toHaveBeenCalledTimes(1)
        expect(onClose).not.toHaveBeenCalled()
    })

    it('does not invoke onBack when Escape is pressed', async () => {
        const onBack = jest.fn()
        const onClose = jest.fn()
        const user = userEvent.setup()

        render(
            <SidePanel
                isOpen
                onClose={onClose}
                onBack={onBack}
                backLabel="Назад к metric"
                title="Panel"
            >
                <div>Body</div>
            </SidePanel>,
        )

        await user.keyboard('{Escape}')

        expect(onBack).not.toHaveBeenCalled()
        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('labels the panel surface with the title for assistive technology', () => {
        render(
            <SidePanel isOpen onClose={jest.fn()} title="Score breakdown">
                <div>Body</div>
            </SidePanel>,
        )

        expect(screen.getByLabelText('Score breakdown')).toBeInTheDocument()
    })
})
