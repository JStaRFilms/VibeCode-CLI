import 'react'
import { Button } from '../../components/ui/Button'

interface SessionStatsProps {
    sessionsCompleted: number
    onResetSessions: () => void
}

export function SessionStats({ sessionsCompleted, onResetSessions }: SessionStatsProps) {
    return (
        <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-text-50 dark:text-gray-100">
                {sessionsCompleted} sessions
            </div>
            <div className="text-sm text-secondary-600 dark:text-gray-400">
                Completed
            </div>
            <Button
                variant="ghost"
                size="sm"
                onClick={onResetSessions}
                className="mt-2"
            >
                Reset Count
            </Button>
        </div>
    )
}