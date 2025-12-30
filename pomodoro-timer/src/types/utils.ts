export interface LocalStorageValue<T> {
    value: T
    timestamp: number
}

export type StorageKey = 'timer-settings' | 'timer-state'