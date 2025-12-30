import 'react'
import { Button } from '../../components/ui/Button'
import { FocusModeToggle } from '../ui/FocusModeToggle'

interface TimerControlsProps {
    isRunning: boolean
    onStart: () => void
    onPause: () => void
    onReset: () => void
}

export function TimerControls({ isRunning, onStart, onPause, onReset }: TimerControlsProps) {
    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex gap-3 justify-center">
                {!isRunning ? (
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={onStart}
                        className="min-w-[120px]"
                    >
                        Start
                    </Button>
                ) : (
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={onPause}
                        className="min-w-[120px]"
                    >
                        Pause
                    </Button>
                )}

                <Button
                    variant="ghost"
                    size="lg"
                    onClick={onReset}
                    className="min-w-[120px]"
                >
                    Reset
                </Button>
            </div>
            <FocusModeToggle />
        </div>
    )
}