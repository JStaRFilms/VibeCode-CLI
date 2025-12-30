import { useCallback } from 'react'
import { audioPlayer } from '../lib/audio'

export function useAudio() {
    const playStartSound = useCallback(async () => {
        if (audioPlayer) {
            await audioPlayer.playStartSound()
        }
    }, [])

    const playEndSound = useCallback(async () => {
        if (audioPlayer) {
            await audioPlayer.playEndSound()
        }
    }, [])

    const playButtonSound = useCallback(async () => {
        if (audioPlayer) {
            await audioPlayer.playButtonSound()
        }
    }, [])

    const resumeAudio = useCallback(() => {
        if (audioPlayer) {
            audioPlayer.resume()
        }
    }, [])

    return {
        playStartSound,
        playEndSound,
        playButtonSound,
        resumeAudio,
    }
}