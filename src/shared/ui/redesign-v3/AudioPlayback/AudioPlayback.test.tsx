import { fireEvent, render, screen } from '@testing-library/react'
import { AudioPlayback } from './AudioPlayback'

test.each([true, false])('opens recording directly in a separate window (iconOnly=%s)', iconOnly => {
    const open = jest.spyOn(window, 'open').mockReturnValue(null)
    try {
        const { container } = render(<AudioPlayback src="https://recordings.example/call-%20number.mp3?token=a%20b" label="Listen" iconOnly={iconOnly} />)
        fireEvent.click(screen.getByRole('button', { name: 'Listen' }))
        expect(open).toHaveBeenCalledWith('https://recordings.example/call-+number.mp3?token=a%20b', '_blank', 'popup,width=520,height=200,resizable=yes,noopener,noreferrer')
        expect(container.querySelector('audio')).toBeNull()
    } finally { open.mockRestore() }
})
