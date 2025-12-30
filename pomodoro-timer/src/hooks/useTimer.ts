import { useEffect, useCallback } from 'react'
import { useTimerContext } from '../context/useTimerContext'
import { audioPlayer } from '../lib/audio'

export function useTimer() {
    const { state, dispatch, resetTimer } = useTimerContext()

    const tick = useCallback(() => {
        if (state.isRunning && state.timeLeft > 0) {
            dispatch({ type: 'SET_TIME_LEFT', payload: state.timeLeft - 1 })
        } else if (state.isRunning && state.timeLeft === 0) {
            // Session completed
            dispatch({ type: 'INCREMENT_SESSIONS' })

            if (state.audioEnabled) {
                audioPlayer.playEndSound()
            }

            // Auto-switch to next session
            if (state.currentSession === 'work') {
                // After work, switch to short break
                dispatch({ type: 'SET_SESSION_TYPE', payload: 'shortBreak' })
            } else {
                // After break, switch to work
                dispatch({ type: 'SET_SESSION_TYPE', payload: 'work' })
            }
        }
    }, [state.isRunning, state.timeLeft, state.currentSession, state.audioEnabled, dispatch])

    useEffect(() => {
        let interval: number | null = null

        if (state.isRunning && state.timeLeft > 0) {
            interval = window.setInterval(tick, 1000)
        }

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [tick, state.isRunning, state.timeLeft])

    // Resume audio context on user interaction
    useEffect(() => {
        const handleUserInteraction = () => {
            audioPlayer.resume()
            // Remove the event listeners after first interaction
            document.removeEventListener('click', handleUserInteraction)
            document.removeEventListener('keydown', handleUserInteraction)
            document.removeEventListener('touchstart', handleUserInteraction)
        }

        document.addEventListener('click', handleUserInteraction)
        document.addEventListener('keydown', handleUserInteraction)
        document.addEventListener('touchstart', handleUserInteraction)

        return () => {
            document.removeEventListener('click', handleUserInteraction)
            document.removeEventListener('keydown', handleUserInteraction)
            document.removeEventListener('touchstart', handleUserInteraction)
        }
    }, [])

    const { startTimer, pauseTimer } = useTimerContext()

    return {
        ...state,
        resetTimer,
        startTimer,
        pauseTimer,
    }
}