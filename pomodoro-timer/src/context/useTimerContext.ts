import { useContext } from 'react'
import { TimerContext } from './timerContext'
import type { TimerContextValue } from '../types/timer'

export function useTimerContext(): TimerContextValue {
    const context = useContext(TimerContext)
    if (!context) {
        throw new Error('useTimerContext must be used within a TimerProvider')
    }
    return context
}