import { createContext } from 'react'
import type { TimerContextValue } from '../types/timer'

export const TimerContext = createContext<TimerContextValue | null>(null)