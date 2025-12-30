import 'react'
import { Switch } from '../../components/ui/Switch'
import { DurationControls } from './DurationControls'

interface SettingsPanelProps {
    audioEnabled: boolean
    workDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    onAudioToggle: () => void
    onDurationChange: (type: 'work' | 'shortBreak' | 'longBreak', duration: number) => void
}

export function SettingsPanel({
    audioEnabled,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    onAudioToggle,
    onDurationChange,
}: SettingsPanelProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-text-50 mb-4">Settings</h2>
                <div className="card p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-text-50">Audio Notifications</h3>
                                <p className="text-sm text-secondary-600">
                                    Enable sound effects for timer events
                                </p>
                            </div>
                            <Switch
                                checked={audioEnabled}
                                onChange={onAudioToggle}
                                label=""
                            />
                        </div>
                    </div>
                </div>
            </div>

            <DurationControls
                workDuration={workDuration}
                shortBreakDuration={shortBreakDuration}
                longBreakDuration={longBreakDuration}
                onDurationChange={onDurationChange}
            />
        </div>
    )
}