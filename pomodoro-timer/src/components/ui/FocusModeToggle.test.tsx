import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FocusModeToggle } from './FocusModeToggle'
import { useFocusStore } from '../../store/useFocusStore'

describe('FocusModeToggle', () => {
    beforeEach(() => {
        useFocusStore.setState({ isFocusMode: false })
    })

    it('renders correctly', () => {
        render(<FocusModeToggle />)
        expect(screen.getByText('Focus Mode')).toBeInTheDocument()
    })

    it('toggles focus mode state', () => {
        render(<FocusModeToggle />)
        const toggle = screen.getByRole('checkbox')
        
        // Initial state
        expect(useFocusStore.getState().isFocusMode).toBe(false)
        
        // Toggle on
        fireEvent.click(toggle)
        expect(useFocusStore.getState().isFocusMode).toBe(true)
        
        // Toggle off
        fireEvent.click(toggle)
        expect(useFocusStore.getState().isFocusMode).toBe(false)
    })
})
