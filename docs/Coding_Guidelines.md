# Coding Guidelines: Pomodoro Timer Web App

## 1. Project Structure

```
src/
├── components/           # Reusable React components
│   ├── ui/              # Primitive UI components (Button, Input, Modal)
│   ├── timer/           # Timer-specific components
│   └── layout/          # Layout components (Header, Footer)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and helpers
│   ├── audio.ts         # Audio notification logic
│   ├── storage.ts       # localStorage utilities
│   └── utils.ts         # General utilities
├── types/               # TypeScript type definitions
├── context/             # React Context providers
│   └── TimerContext.tsx # Timer state management
├── pages/               # Page components (if using routing)
├── styles/              # Global styles and CSS-in-JS
└── App.tsx              # Main application component
```

## 2. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files (components) | PascalCase | `TimerDisplay.tsx` |
| Files (utilities) | camelCase | `formatTime.ts` |
| Components | PascalCase | `TimerControls` |
| Variables | camelCase | `remainingTime` |
| Constants | UPPER_SNAKE | `DEFAULT_WORK_DURATION` |
| Types/Interfaces | PascalCase | `TimerSettings` |
| CSS Classes | kebab-case | `timer-display` |
| Test Files | camelCase.test.tsx | `timerDisplay.test.tsx` |

## 3. Component Patterns

### 3.1 Functional Components (Default)
```tsx
// src/components/timer/TimerDisplay.tsx
import { useContext } from 'react'
import { TimerContext } from '@/context/TimerContext'

export function TimerDisplay() {
  const { state } = useContext(TimerContext)
  
  return (
    <div className="timer-display">
      <span className="time">{formatTime(state.remainingTime)}</span>
    </div>
  )
}
```

### 3.2 Custom Hooks for Logic
```tsx
// src/hooks/useTimer.ts
import { useState, useEffect, useRef } from 'react'

export function useTimer(initialTime: number) {
  const [time, setTime] = useState(initialTime)
  const intervalRef = useRef<number>()

  const start = () => {
    intervalRef.current = setInterval(() => {
      setTime(prev => Math.max(0, prev - 1))
    }, 1000)
  }

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return { time, start, stop, setTime }
}
```

### 3.3 Context for State Management
```tsx
// src/context/TimerContext.tsx
import React, { createContext, useContext, useReducer } from 'react'
import { timerReducer, initialState } from './timerReducer'

const TimerContext = createContext(undefined)

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, initialState)

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimerContext() {
  const context = useContext(TimerContext)
  if (context === undefined) {
    throw new Error('useTimerContext must be used within TimerProvider')
  }
  return context
}
```

## 4. TypeScript Patterns

### 4.1 Strict Type Definitions
```tsx
// src/types/timer.ts
export interface TimerSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  audioEnabled: boolean
}

export type SessionType = 'work' | 'shortBreak' | 'longBreak'

export interface TimerState {
  isActive: boolean
  isPaused: boolean
  currentSessionType: SessionType
  remainingTime: number
  settings: TimerSettings
  completedSessions: number
}
```

### 4.2 Utility Types
```tsx
// src/types/utils.ts
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type TimerAction =
  | { type: 'START_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'SET_SESSION_TYPE'; payload: SessionType }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<TimerSettings> }
```

## 5. Audio Handling

### 5.1 Web Audio API Wrapper
```tsx
// src/lib/audio.ts
export class AudioPlayer {
  private audioContext: AudioContext | null = null
  private oscillator: OscillatorNode | null = null

  async playNotification(type: 'start' | 'end') {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      this.oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      this.oscillator.type = 'sine'
      this.oscillator.frequency.setValueAtTime(
        type === 'start' ? 800 : 400,
        this.audioContext.currentTime
      )

      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.5
      )

      this.oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      this.oscillator.start()
      this.oscillator.stop(this.audioContext.currentTime + 0.5)
    } catch (error) {
      console.warn('Audio playback failed:', error)
    }
  }
}
```

## 6. Storage Patterns

### 6.1 localStorage Wrapper
```tsx
// src/lib/storage.ts
export class StorageManager {
  private static readonly PREFIX = 'pomodoro_timer_'

  static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(
        `${this.PREFIX}${key}`,
        JSON.stringify(value)
      )
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`${this.PREFIX}${key}`)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return defaultValue
    }
  }
}
```

## 7. Error Handling

### 7.1 Global Error Boundary
```tsx
// src/components/layout/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>Please refresh the page and try again.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

## 8. Testing Guidelines

### 8.1 Component Testing
```tsx
// src/components/timer/TimerDisplay.test.tsx
import { render, screen } from '@testing-library/react'
import { TimerProvider } from '@/context/TimerContext'
import { TimerDisplay } from './TimerDisplay'

const renderWithProvider = (initialState?: Partial<TimerState>) => {
  return render(
    <TimerProvider>
      <TimerDisplay />
    </TimerProvider>
  )
}

describe('TimerDisplay', () => {
  it('displays formatted time correctly', () => {
    renderWithProvider({ remainingTime: 1500 })
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })

  it('shows session type indicator', () => {
    renderWithProvider({ currentSessionType: 'work' })
    expect(screen.getByText('Work')).toBeInTheDocument()
  })
})
```

### 8.2 Hook Testing
```tsx
// src/hooks/useTimer.test.ts
import { renderHook, act } from '@testing-library/react'
import { useTimer } from './useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should start and stop timer correctly', () => {
    const { result } = renderHook(() => useTimer(60))
    
    act(() => {
      result.current.start()
    })
    
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    
    expect(result.current.time).toBe(55)
    
    act(() => {
      result.current.stop()
    })
  })
})
```

## 9. Performance Guidelines

### 9.1 Memoization
```tsx
// Use memoization for expensive calculations
import { useMemo, useCallback } from 'react'

export function TimerDisplay() {
  const { state } = useContext(TimerContext)
  
  const formattedTime = useMemo(() => {
    return formatTime(state.remainingTime)
  }, [state.remainingTime])

  const handleStart = useCallback(() => {
    // Start timer logic
  }, [])

  return (
    <div>
      <span>{formattedTime}</span>
      <button onClick={handleStart}>Start</button>
    </div>
  )
}
```

### 9.2 Image Optimization
```tsx
// Use optimized images and lazy loading
import { lazy, Suspense } from 'react'

const LazyComponent = lazy(() => import('./HeavyComponent'))

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
```

## 10. Git Commit Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat(timer): add audio notification support`
- `fix(ui): fix timer display on mobile devices`
- `refactor(context): simplify timer state management`
- `test(hooks): add comprehensive timer hook tests`

## 11. Code Quality Standards

### 11.1 ESLint Rules
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### 11.2 Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 12. Accessibility Guidelines

### 12.1 ARIA Labels
```tsx
<button
  aria-label="Start timer"
  onClick={handleStart}
>
  Start
</button>
```

### 12.2 Keyboard Navigation
```tsx
<div
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleStart()
    }
  }}
>
  Start Timer
</div>
```

### 12.3 Screen Reader Support
```tsx
<span className="sr-only">
  {state.isActive ? 'Timer active' : 'Timer inactive'}
</span>
