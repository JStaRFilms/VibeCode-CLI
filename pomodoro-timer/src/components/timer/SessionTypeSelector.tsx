import 'react'
import { Button } from '../../components/ui/Button'

interface SessionTypeSelectorProps {
    currentSession: 'work' | 'shortBreak' | 'longBreak'
    onSessionChange: (session: 'work' | 'shortBreak' | 'longBreak') => void
}

export function SessionTypeSelector({ currentSession, onSessionChange }: SessionTypeSelectorProps) {
    return (
        <div className="flex gap-2 justify-center">
            <Button
                variant={currentSession === 'work' ? 'primary' : 'ghost'}
                size="md"
                onClick={() => onSessionChange('work')}
                className="flex-1"
            >
                Work
            </Button>
            <Button
                variant={currentSession === 'shortBreak' ? 'primary' : 'ghost'}
                size="md"
                onClick={() => onSessionChange('shortBreak')}
                className="flex-1"
            >
                Short Break
            </Button>
            <Button
                variant={currentSession === 'longBreak' ? 'primary' : 'ghost'}
                size="md"
                onClick={() => onSessionChange('longBreak')}
                className="flex-1"
            >
                Long Break
            </Button>
        </div>
    )
}