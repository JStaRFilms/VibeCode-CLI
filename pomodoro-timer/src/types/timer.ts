export type SessionType = 'work' | 'shortBreak' | 'longBreak'

export interface TimerState {
    isRunning: boolean
    isPaused: boolean
    currentSession: SessionType
    timeLeft: number
    workDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    sessionsCompleted: number
    audioEnabled: boolean
}

export type TimerAction =
    | { type: 'START' }
    | { type: 'PAUSE' }
    | { type: 'RESET' }
    | { type: 'SET_SESSION_TYPE'; payload: SessionType }
    | { type: 'SET_TIME_LEFT'; payload: number }
    | { type: 'SET_DURATION'; payload: { type: SessionType; duration: number } }
    | { type: 'INCREMENT_SESSIONS' }
    | { type: 'RESET_SESSIONS' }
    | { type: 'TOGGLE_AUDIO' }
    | { type: 'SET_AUDIO'; payload: boolean }
    | { type: 'LOAD_SETTINGS'; payload: Partial<TimerState> }

export interface Settings {
    workDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    audioEnabled: boolean
}

export interface TimerContextValue {
    state: TimerState
    dispatch: React.Dispatch<TimerAction>
    startTimer: () => void
    pauseTimer: () => void
    resetTimer: () => void
    setSessionType: (type: SessionType) => void
    setDuration: (type: SessionType, duration: number) => void
    toggleAudio: () => void
    resetSessions: () => void
}