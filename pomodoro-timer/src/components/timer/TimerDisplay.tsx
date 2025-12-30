import 'react'
import { formatTime, getSessionColor, getSessionLabel } from '../../lib/utils'

interface TimerDisplayProps {
    timeLeft: number
    currentSession: 'work' | 'shortBreak' | 'longBreak'
    isRunning: boolean
}

export function TimerDisplay({ timeLeft, currentSession, isRunning }: TimerDisplayProps) {
    const timeString = formatTime(timeLeft)
    const sessionLabel = getSessionLabel(currentSession)
    const sessionColor = getSessionColor(currentSession)

    return (
        <div className="text-center space-y-4">
            <div className="space-y-2">
                <div className={`text-sm font-medium uppercase tracking-wide ${sessionColor}`}>
                    {sessionLabel}
                </div>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl font-bold text-text-50 font-mono">
                            {timeString}
                        </div>
                    </div>
                    <svg className="w-64 h-64 mx-auto" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="4"
                            className="opacity-50"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray="283"
                            strokeDashoffset={isRunning ? 283 - (283 * timeLeft) / (currentSession === 'work' ? 1500 : currentSession === 'shortBreak' ? 300 : 900) : 0}
                            className="transition-all duration-1000 ease-linear"
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                </div>
            </div>
        </div>
    )
}