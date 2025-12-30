import { useState } from 'react'
import { TimerContextProvider } from './context/timerProvider'
import { useTimerContext } from './context/useTimerContext'
import { useTimer } from './hooks/useTimer'
import { TimerDisplay } from './components/timer/TimerDisplay'
import { TimerControls } from './components/timer/TimerControls'
import { SessionTypeSelector } from './components/timer/SessionTypeSelector'
import { SessionStats } from './components/timer/SessionStats'
import { SettingsPanel } from './components/settings/SettingsPanel'
import { Button } from './components/ui/Button'
import { ThemeToggle } from './components/ThemeToggle'
import './index.css'

function AppContent() {
  const { state, setSessionType, setDuration, toggleAudio, resetSessions } = useTimerContext()
  const timer = useTimer()

  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="min-h-screen bg-background-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-50 dark:text-gray-100 mb-2">Pomodoro Timer</h1>
          <p className="text-secondary-600 dark:text-gray-400">Stay focused, take breaks, be productive</p>
        </header>

        <main className="space-y-8">
          {/* Timer Section */}
          <div className="card p-8">
            <TimerDisplay
              timeLeft={timer.timeLeft}
              currentSession={timer.currentSession}
              isRunning={timer.isRunning}
            />

            <div className="mt-8 space-y-6">
              <SessionTypeSelector
                currentSession={timer.currentSession}
                onSessionChange={setSessionType}
              />

              <TimerControls
                isRunning={timer.isRunning}
                onStart={timer.startTimer}
                onPause={timer.pauseTimer}
                onReset={timer.resetTimer}
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="card p-6">
            <SessionStats
              sessionsCompleted={timer.sessionsCompleted}
              onResetSessions={resetSessions}
            />
          </div>

          {/* Settings Toggle */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? 'Hide' : 'Show'} Settings
            </Button>
          </div>

          {/* Settings Section */}
          {showSettings && (
            <div className="card p-6">
              <SettingsPanel
                audioEnabled={state.audioEnabled}
                workDuration={state.workDuration / 60}
                shortBreakDuration={state.shortBreakDuration / 60}
                longBreakDuration={state.longBreakDuration / 60}
                onAudioToggle={toggleAudio}
                onDurationChange={setDuration}
              />
            </div>
          )}
        </main>

        <footer className="text-center text-sm text-secondary-600 mt-8">
          Built with React, TypeScript, and Tailwind CSS
        </footer>
      </div>
    </div>
  )
}

function App() {
  return (
    <TimerContextProvider>
      <AppContent />
    </TimerContextProvider>
  )
}

export default App
