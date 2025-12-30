import type { LocalStorageValue, StorageKey } from '../types/utils'

const STORAGE_PREFIX = 'pomodoro-timer:'

export function setItem<T>(key: StorageKey, value: T): void {
    try {
        const storageValue: LocalStorageValue<T> = {
            value,
            timestamp: Date.now(),
        }
        localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(storageValue))
    } catch (error) {
        console.error('Failed to save to localStorage:', error)
    }
}

export function getItem<T>(key: StorageKey): T | null {
    try {
        const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
        if (!stored) return null

        const storageValue: LocalStorageValue<T> = JSON.parse(stored)
        return storageValue.value
    } catch (error) {
        console.error('Failed to read from localStorage:', error)
        return null
    }
}

export function removeItem(key: StorageKey): void {
    try {
        localStorage.removeItem(`${STORAGE_PREFIX}${key}`)
    } catch (error) {
        console.error('Failed to remove from localStorage:', error)
    }
}

export function clearAll(): void {
    try {
        Object.values(['timer-settings', 'timer-state'] as StorageKey[]).forEach(key => {
            removeItem(key)
        })
    } catch (error) {
        console.error('Failed to clear localStorage:', error)
    }
}