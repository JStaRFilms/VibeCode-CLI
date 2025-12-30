import { describe, it, expect } from 'vitest'
import { cn, formatTime, secondsToMinutes, minutesToSeconds, validateDuration } from './utils'

describe('utils', () => {
    describe('cn', () => {
        it('merges class names correctly', () => {
            expect(cn('c-red', 'bg-blue')).toBe('c-red bg-blue')
        })

        it('handles conditional classes', () => {
            expect(cn('c-red', false && 'bg-blue', 'text-bold')).toBe('c-red text-bold')
        })

        it('merges tailwind classes (overrides)', () => {
            expect(cn('p-4', 'p-2')).toBe('p-2')
            expect(cn('px-2 py-1', 'p-4')).toBe('p-4')
        })
    })

    describe('formatTime', () => {
        it('formats seconds to mm:ss', () => {
            expect(formatTime(0)).toBe('00:00')
            expect(formatTime(59)).toBe('00:59')
            expect(formatTime(60)).toBe('01:00')
            expect(formatTime(65)).toBe('01:05')
            expect(formatTime(3600)).toBe('60:00')
        })
    })

    describe('secondsToMinutes', () => {
        it('converts seconds to minutes', () => {
            expect(secondsToMinutes(60)).toBe(1)
            expect(secondsToMinutes(90)).toBe(2) // Math.ceil used
            expect(secondsToMinutes(0)).toBe(0)
        })
    })

    describe('minutesToSeconds', () => {
        it('converts minutes to seconds', () => {
            expect(minutesToSeconds(1)).toBe(60)
            expect(minutesToSeconds(0)).toBe(0)
            expect(minutesToSeconds(1.5)).toBe(90)
        })
    })
    
    describe('validateDuration', () => {
        it('clamps values within range', () => {
            expect(validateDuration(10, 5, 20)).toBe(10)
            expect(validateDuration(1, 5, 20)).toBe(5)
            expect(validateDuration(100, 5, 20)).toBe(20)
        })
    })
})
