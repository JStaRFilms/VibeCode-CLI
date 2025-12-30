import type { TimerState, TimerAction } from '../types/timer'

export const initialState: TimerState = {
    isRunning: false,
    isPaused: false,
    currentSession: 'work',
    timeLeft: 25 * 60, // 25 minutes in seconds
    workDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    sessionsCompleted: 0,
    audioEnabled: true,
}

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
    switch (action.type) {
        case 'START':
            return {
                ...state,
                isRunning: true,
                isPaused: false,
            }
        case 'PAUSE':
            return {
                ...state,
                isRunning: false,
                isPaused: true,
            }
        case 'RESET':
            return {
                ...state,
                isRunning: false,
                isPaused: false,
                timeLeft: state.currentSession === 'work'
                    ? state.workDuration
                    : state.currentSession === 'shortBreak'
                        ? state.shortBreakDuration
                        : state.longBreakDuration,
            }
        case 'SET_SESSION_TYPE': {
            const newTimeLeft = action.payload === 'work'
                ? state.workDuration
                : action.payload === 'shortBreak'
                    ? state.shortBreakDuration
                    : state.longBreakDuration

            return {
                ...state,
                currentSession: action.payload,
                timeLeft: newTimeLeft,
                isRunning: false,
                isPaused: false,
            }
        }
        case 'SET_TIME_LEFT':
            return {
                ...state,
                timeLeft: action.payload,
            }
        case 'SET_DURATION': {
            const { type, duration } = action.payload
            const newState = {
                ...state,
                [type === 'work' ? 'workDuration' : type === 'shortBreak' ? 'shortBreakDuration' : 'longBreakDuration']: duration * 60,
            }

            // Update timeLeft if current session is being modified
            if (state.currentSession === type) {
                newState.timeLeft = duration * 60
            }

            return newState
        }
        case 'INCREMENT_SESSIONS':
            return {
                ...state,
                sessionsCompleted: state.sessionsCompleted + 1,
            }
        case 'RESET_SESSIONS':
            return {
                ...state,
                sessionsCompleted: 0,
            }
        case 'TOGGLE_AUDIO':
            return {
                ...state,
                audioEnabled: !state.audioEnabled,
            }
        case 'SET_AUDIO':
            return {
                ...state,
                audioEnabled: action.payload,
            }
        case 'LOAD_SETTINGS':
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}