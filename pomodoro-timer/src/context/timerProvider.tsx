import React, { useReducer, useEffect, useCallback } from 'react'
import type { TimerContextValue, TimerState } from '../types/timer'
import { audioPlayer } from '../lib/audio'
import * as storage from '../lib/storage'
import { initialState, timerReducer } from './timerReducer'
import { TimerContext } from './timerContext'

export function TimerProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(timerReducer, initialState)

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = storage.getItem<TimerState>('timer-settings')
        if (savedSettings) {
            dispatch({ type: 'LOAD_SETTINGS', payload: savedSettings })
        }
    }, [])

    // Save settings to localStorage when they change
    useEffect(() => {
        storage.setItem('timer-settings', {
            workDuration: state.workDuration,
            shortBreakDuration: state.shortBreakDuration,
            longBreakDuration: state.longBreakDuration,
            audioEnabled: state.audioEnabled,
        })
    }, [state.workDuration, state.shortBreakDuration, state.longBreakDuration, state.audioEnabled])

    const startTimer = useCallback(() => {
        dispatch({ type: 'START' })
        audioPlayer.playButtonSound()
    }, [])

    const pauseTimer = useCallback(() => {
        dispatch({ type: 'PAUSE' })
        audioPlayer.playButtonSound()
    }, [])

    const resetTimer = useCallback(() => {
        dispatch({ type: 'RESET' })
        audioPlayer.playButtonSound()
    }, [])

    const setSessionType = useCallback((type: 'work' | 'shortBreak' | 'longBreak') => {
        dispatch({ type: 'SET_SESSION_TYPE', payload: type })
        audioPlayer.playButtonSound()
    }, [])

    const setDuration = useCallback((type: 'work' | 'shortBreak' | 'longBreak', duration: number) => {
        dispatch({ type: 'SET_DURATION', payload: { type, duration } })
        audioPlayer.playButtonSound()
    }, [])

    const toggleAudio = useCallback(() => {
        dispatch({ type: 'TOGGLE_AUDIO' })
    }, [])

    const resetSessions = useCallback(() => {
        dispatch({ type: 'RESET_SESSIONS' })
    }, [])

    const value: TimerContextValue = {
        state,
        dispatch,
        startTimer,
        pauseTimer,
        resetTimer,
        setSessionType,
        setDuration,
        toggleAudio,
        resetSessions,
    }

    return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
}

// Export the context provider as a separate component to avoid the linting error
export const TimerContextProvider = TimerProvider