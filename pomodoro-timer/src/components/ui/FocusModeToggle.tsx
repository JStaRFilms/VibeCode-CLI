import 'react'
import { Switch } from './Switch'
import { useFocusStore } from '../../store/useFocusStore'

export function FocusModeToggle() {
  const { isFocusMode, toggleFocusMode } = useFocusStore()

  return (
    <div className="flex items-center justify-center" title="Toggle Focus Mode">
      <Switch
        checked={isFocusMode}
        onChange={toggleFocusMode}
        label="Focus Mode"
      />
    </div>
  )
}
