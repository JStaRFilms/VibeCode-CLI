# Builder Prompt: Pomodoro Timer Web App

## Your Mission
You are building a clean, minimalist Pomodoro Timer Web App - a web-based productivity tool that helps users manage their time using the Pomodoro Technique. The app should be simple, responsive, and distraction-free.

## Technical Stack
- **Framework**: React 18 with TypeScript
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Context API
- **Audio**: Web Audio API
- **Storage**: localStorage
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## Phase 1: Foundation (Build First)

### 1.1 Project Setup
1. Initialize project with `npm create vite@latest pomodoro-timer -- --template react-ts`
2. Install dependencies:
   - `npm install react react-dom`
   - `npm install -D @types/react @types/react-dom`
   - `npm install tailwindcss postcss autoprefixer --save-dev`
   - `npm install vitest @testing-library/react @testing-library/jest-dom`
3. Configure Tailwind CSS with custom design tokens
4. Set up TypeScript strict configuration
5. Configure ESLint and Prettier with recommended rules

### 1.2 Project Structure
Create the following directory structure:
```
src/
├── components/
│   ├── ui/              # Button, Input, Modal, etc.
│   ├── timer/           # TimerDisplay, TimerControls, ProgressRing
│   └── layout/          # Header, Footer
├── hooks/               # useTimer, useLocalStorage, useAudio
├── lib/                 # audio.ts, storage.ts, utils.ts
├── types/               # timer.ts, utils.ts
├── context/             # TimerContext.tsx
├── styles/              # globals.css
└── App.tsx
```

### 1.3 Core Infrastructure
1. Create TypeScript type definitions for timer state and settings
2. Set up React Context for timer state management
3. Implement localStorage utilities for settings persistence
4. Create audio notification system using Web Audio API
5. Set up global error boundary component

## Phase 2: Core Features (Build in Order)

### Feature 1: Core Timer Functionality (Priority: P0)
**Files to create:**
- `src/components/timer/TimerDisplay.tsx`
- `src/components/timer/TimerControls.tsx`
- `src/hooks/useTimer.ts`
- `src/lib/utils.ts` (time formatting)

**API endpoints:** None (client-side only)

**Components:**
- Timer display showing MM:SS format
- Start/Pause/Reset buttons
- Session type buttons (Work/Short Break/Long Break)
- Progress ring showing time remaining

**Acceptance:**
- [ ] 25-minute work session timer
- [ ] 5-minute short break timer
- [ ] 15-minute long break timer
- [ ] Pause/resume functionality
- [ ] Reset functionality
- [ ] Visual progress indicator

### Feature 2: Session Management (Priority: P0)
**Files to create:**
- `src/components/timer/SessionStats.tsx`
- `src/hooks/useSessionStats.ts`

**Components:**
- Session counter display
- Session count persistence
- Manual reset option

**Acceptance:**
- [ ] Track completed work sessions
- [ ] Display current session count
- [ ] Persist count across browser sessions
- [ ] Manual reset functionality

### Feature 3: Customizable Timer Settings (Priority: P1)
**Files to create:**
- `src/components/settings/SettingsPanel.tsx`
- `src/components/settings/DurationControls.tsx`
- `src/hooks/useSettings.ts`

**Components:**
- Settings modal/page
- Duration input controls (1-60 minutes for work/long break, 1-30 for short break)
- Audio toggle switch
- Settings persistence

**Acceptance:**
- [ ] Custom work duration (1-60 minutes)
- [ ] Custom short break duration (1-30 minutes)
- [ ] Custom long break duration (1-60 minutes)
- [ ] Audio enable/disable
- [ ] Settings persistence
- [ ] Input validation

### Feature 4: Responsive UI (Priority: P0)
**Files to create:**
- `src/styles/globals.css`
- `src/components/layout/AppLayout.tsx`

**Components:**
- Responsive grid layout
- Mobile-friendly touch controls
- Clean, minimalist design
- Neutral color palette

**Acceptance:**
- [ ] Fully responsive design
- [ ] Touch-friendly mobile controls
- [ ] Clean minimalist aesthetic
- [ ] Prominent timer display
- [ ] Intuitive controls

### Feature 5: Audio Notifications (Priority: P1)
**Files to create:**
- `src/lib/audio.ts`
- `src/hooks/useAudio.ts`

**Components:**
- Audio notification system
- Audio settings integration

**Acceptance:**
- [ ] Audio on session start
- [ ] Audio on session end
- [ ] Audio settings persistence
- [ ] Audio enable/disable toggle

## Coding Rules (MUST FOLLOW)

### 1. React Patterns
- Use functional components with hooks
- Prefer custom hooks for reusable logic
- Use Context API for state management (no external state libraries)
- Implement proper cleanup in useEffect hooks
- Use memoization for expensive calculations

### 2. TypeScript Strictness
- No `any` types allowed
- Strict null checks enabled
- Proper type definitions for all props and state
- Use utility types for complex type transformations
- Interface over type alias for object shapes

### 3. Performance
- Optimize render cycles with memoization
- Use virtualization for long lists (if needed)
- Implement proper image optimization
- Minimize bundle size with code splitting
- Use lazy loading for heavy components

### 4. Accessibility
- WCAG 2.1 AA compliance
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Respect reduced motion preferences

### 5. Code Quality
- ESLint errors must be fixed
- Prettier formatting applied
- Component props properly typed
- No console.log in production builds
- Proper error handling

## Design Tokens
```css
:root {
  --color-primary: #3B82F6;     /* Blue for primary actions */
  --color-secondary: #64748B;   /* Gray for secondary elements */
  --color-background: #FFFFFF;  /* White background */
  --color-text: #1E293B;        /* Dark text */
  --color-accent: #10B981;      /* Green for success/completed */
  --radius: 12px;               /* Rounded corners */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

## Component Architecture

### Timer Context Structure
```typescript
interface TimerContextValue {
  state: TimerState
  dispatch: React.Dispatch<TimerAction>
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  setSessionType: (type: SessionType) => void
}
```

### Key Hooks
```typescript
// useTimer - Core timer logic
// useSettings - Settings management with localStorage
// useSessionStats - Session tracking
// useAudio - Audio notification system
// useLocalStorage - Generic localStorage wrapper
```

## Testing Requirements

### Unit Tests
- Timer hook functionality
- Utility functions (time formatting)
- Audio player behavior
- Storage utilities

### Integration Tests
- Timer display updates
- Session state transitions
- Settings persistence
- Audio notifications

### Component Tests
- Timer controls interaction
- Settings panel functionality
- Responsive behavior
- Accessibility features

## Definition of Done

- [ ] All MUS features implemented (P0 features complete)
- [ ] TypeScript compilation without errors
- [ ] No console errors in browser
- [ ] Responsive on mobile/desktop/tablet
- [ ] Core user flows tested and working
- [ ] Audio notifications functional
- [ ] Settings persistence working
- [ ] Session tracking accurate
- [ ] Code passes linting and formatting
- [ ] Basic test coverage implemented

## Success Criteria

1. **Functionality**: All P0 features working correctly
2. **Performance**: Page loads under 3 seconds
3. **Accessibility**: WCAG 2.1 AA compliant
4. **User Experience**: Intuitive and distraction-free
5. **Code Quality**: Clean, maintainable, well-tested code
6. **Cross-Platform**: Works on all modern browsers and devices

## Next Steps After Completion

1. Deploy to Vercel or Netlify
2. Add basic analytics (optional)
3. Consider adding dark theme
4. Add more advanced statistics
5. Implement keyboard shortcuts
6. Add browser extension version