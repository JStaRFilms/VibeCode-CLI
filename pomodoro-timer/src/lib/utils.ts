import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function secondsToMinutes(seconds: number): number {
    return Math.ceil(seconds / 60)
}

export function minutesToSeconds(minutes: number): number {
    return minutes * 60
}

export function validateDuration(value: number, min: number, max: number): number {
    const num = Math.floor(value)
    if (num < min) return min
    if (num > max) return max
    return num
}

export function getSessionColor(sessionType: string): string {
    switch (sessionType) {
        case 'work':
            return 'text-primary-600'
        case 'shortBreak':
            return 'text-accent-600'
        case 'longBreak':
            return 'text-secondary-600'
        default:
            return 'text-text-50'
    }
}

export function getSessionLabel(sessionType: string): string {
    switch (sessionType) {
        case 'work':
            return 'Work'
        case 'shortBreak':
            return 'Short Break'
        case 'longBreak':
            return 'Long Break'
        default:
            return ''
    }
}
