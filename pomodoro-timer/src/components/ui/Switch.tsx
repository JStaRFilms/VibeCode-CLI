import 'react'

interface SwitchProps {
    checked: boolean
    onChange: (checked: boolean) => void
    label?: string
    disabled?: boolean
}

export function Switch({ checked, onChange, label, disabled = false }: SwitchProps) {
    return (
        <label className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                />
                <div
                    className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-gray-600'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${checked ? 'translate-x-4' : 'translate-x-0'
                        } ${disabled ? 'opacity-50' : ''}`}
                />
            </div>
            {label && (
                <span className="text-sm font-medium text-secondary-700 dark:text-gray-300">
                    {label}
                </span>
            )}
        </label>
    )
}