import React from 'react'
import { Input } from '../../components/ui/Input'

interface DurationControlsProps {
    workDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    onDurationChange: (type: 'work' | 'shortBreak' | 'longBreak', duration: number) => void
}

export function DurationControls({
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    onDurationChange,
}: DurationControlsProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-text-50 dark:text-gray-100 mb-4">Session Durations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        label="Work Session (minutes)"
                        type="number"
                        min="1"
                        max="60"
                        value={workDuration}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDurationChange('work', parseInt(e.target.value) || 25)}
                        className="w-full"
                    />
                    <Input
                        label="Short Break (minutes)"
                        type="number"
                        min="1"
                        max="30"
                        value={shortBreakDuration}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDurationChange('shortBreak', parseInt(e.target.value) || 5)}
                        className="w-full"
                    />
                    <Input
                        label="Long Break (minutes)"
                        type="number"
                        min="1"
                        max="60"
                        value={longBreakDuration}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onDurationChange('longBreak', parseInt(e.target.value) || 15)}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    )
}