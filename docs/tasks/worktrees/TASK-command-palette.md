# 🎯 Task: Command Palette

**Objective**: Implement a global "Command Palette" (Cmd+K) to allow keyboard-driven control of the timer, sessions, and application settings.
**Type**: ✨ Feature
**Priority**: Medium
**Estimated Complexity**: Medium

---

## 📋 Requirements

### Functional Requirements
- **[REQ-001]**: User can open the Command Palette by pressing `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) from anywhere in the app.
  - Acceptance: Pressing the shortcut opens a modal overlay centered on screen.
- **[REQ-002]**: User can search for actions by typing.
  - Acceptance: Typing "Start" filters the list to show "Start Timer".
- **[REQ-003]**: User can execute timer actions via the palette.
  - Actions: Start Timer, Pause Timer, Reset Timer.
  - Acceptance: Selecting "Start Timer" actually starts the countdown.
- **[REQ-004]**: User can switch session modes via the palette.
  - Actions: Set to Work, Set to Short Break, Set to Long Break.
  - Acceptance: Selecting a mode changes the active session type immediately.
- **[REQ-005]**: User can toggle global settings.
  - Actions: Toggle Audio, Toggle Theme (Light/Dark).
  - Acceptance: Selecting "Toggle Theme" switches between light/dark mode.

### Technical Requirements
- **[TECH-001]**: Use `cmdk` library for the headless command menu primitives.
- **[TECH-002]**: Use `lucide-react` for icons within the menu items.
- **[TECH-003]**: Component must be fully accessible (aria-label, keyboard navigation).
- **[TECH-004]**: Style using Tailwind CSS to match the existing design system (using `card` or `surface` colors).

### Out of Scope
- Complex nested menus (keep it single level for now).
- Changing specific duration values (just mode switching).

---

## 🏗️ Implementation Plan

### Phase 1: Setup & Dependencies
- [ ] Install dependencies: `npm install cmdk lucide-react`
- [ ] Create component file: `src/components/ui/CommandPalette.tsx`

### Phase 2: Core Implementation
- [ ] Implement the `cmdk` primitives (`Command.Dialog`, `Command.Input`, `Command.List`, `Command.Item`).
- [ ] Style the component to match the app's theme (dark/light mode aware).
- [ ] Add the `useEffect` hook to listen for `keydown` (Meta+K / Ctrl+K) to toggle open state.

### Phase 3: Integration
- [ ] Import `CommandPalette` in `src/App.tsx` (or main layout).
- [ ] Connect `useTimer` hook actions (start, pause, reset, setMode).
- [ ] Connect `useTheme` hook actions (toggle).
- [ ] Connect `useAudio` context/store (toggle audio).

### Phase 4: Polish
- [ ] Add icons to each command using `lucide-react`.
- [ ] Add "Empty" state (e.g., "No results found.").
- [ ] Ensure the modal closes automatically after an action is selected.

---

## 📂 Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/ui/CommandPalette.tsx` | CREATE | The main command menu component |
| `src/App.tsx` | MODIFY | Mount the CommandPalette globally |
| `package.json` | MODIFY | Add `cmdk` and `lucide-react` |

---

## 🔗 Dependencies

**Depends On**:
- `src/hooks/useTimer.ts` — To control the timer.
- `src/hooks/useTheme.ts` — To control the theme.

**Used By**:
- Global App (available on all screens).

---

## ✅ Success Criteria

### Code Quality
- [ ] Component uses Tailwind classes for all styling.
- [ ] No layout shift when opening/closing.
- [ ] Clean integration with existing hooks (no duplicated logic).

### Functionality
- [ ] Cmd+K opens/closes the menu.
- [ ] All listed actions (Timer, Mode, Theme) function correctly.
- [ ] Search filtering works as expected.

### Verification
- [ ] Build passes: `npm run build`
- [ ] Manual test: Open menu -> Start Timer -> Verify timer runs.
- [ ] Manual test: Open menu -> Toggle Theme -> Verify theme changes.

---

## 🚀 Getting Started

1. Install `cmdk` and `lucide-react`.
2. Create `src/components/ui/CommandPalette.tsx`.
3. Copy the basic styling from `cmdk` docs or existing Tailwind styles (use `bg-white dark:bg-gray-800` for the modal).
4. Hook up the `useTimer` actions.
5. Mount in `App.tsx`.

---

## 📝 Notes

- `cmdk` is unstyled by default. You will need to provide standard Tailwind classes to make it look good.
- Refer to `docs/features/pomodoro_redesign.md` for context on existing Timer hooks.
