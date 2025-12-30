# 🎯 Task: Editor Core Implementation

**Objective**: Implement the core Markdown Editor interface for VibeNotes, allowing users to create, edit, and preview notes with a distraction-free UI.
**Type**: Feature
**Priority**: High
**Estimated Complexity**: Medium

---

## 📋 Requirements

### Functional Requirements
- **[REQ-001]**: User can input text in a Markdown-supported area.
  - Acceptance: Typing updates the content state immediately.
- **[REQ-002]**: User can toggle between "Edit" and "Preview" modes (or see split view).
  - Acceptance: Clicking preview renders the markdown as HTML.
- **[REQ-003]**: User can set a title for the note.
  - Acceptance: Title input is separate from body and updates state.
- **[REQ-004]**: Editor auto-saves content to local state/storage (debounce).
  - Acceptance: Reloading page retains content (using localStorage for MVP).
- **[REQ-005]**: Toolbar provides basic formatting (Bold, Italic, List).
  - Acceptance: Selecting text and clicking "Bold" wraps it in `**`.

### Technical Requirements
- **[TECH-001]**: Use **Feature-Sliced Design** (`src/features/editor`).
- **[TECH-002]**: Minimize client-side bundle; use server components where possible, but Editor will be a Client Component (`'use client'`).
- **[TECH-003]**: Use `lucide-react` for icons.
- **[TECH-004]**: Accessibility: Editor must be keyboard navigable.

### Out of Scope
- Image uploads (text only for v1).
- Collaborative editing.
- Slash commands (Notion style) - keep it simple first.
- Database integration (focus on UI/State first).

---

## 🏗️ Implementation Plan

### Phase 1: Setup & Feature Shell
- [ ] Create feature directory: `src/features/editor`.
- [ ] Install dependencies: `npm install react-markdown remark-gfm`.
- [ ] Create feature entry point: `src/features/editor/index.ts`.

### Phase 2: Core Components
- [ ] Implement `EditorLayout.tsx`: Container for Title + Editor area.
- [ ] Implement `MarkdownEditor.tsx`: The textarea input with auto-resize.
- [ ] Implement `MarkdownPreview.tsx`: The renderer using `react-markdown`.
- [ ] Implement `EditorToolbar.tsx`: Formatting buttons.

### Phase 3: State & Logic
- [ ] Implement `useEditor.ts` hook:
    - Manage content state.
    - Handle local storage persistence (`localStorage`).
    - Handle keyboard shortcuts (Ctrl+B, Ctrl+I).

### Phase 4: Integration & Polish
- [ ] Create page route: `src/app/editor/page.tsx` (or similar).
- [ ] Add loading states.
- [ ] Style with Tailwind CSS (Typography plugin recommended).

---

## 📂 Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/features/editor/index.ts` | CREATE | Public API for the feature |
| `src/features/editor/components/Editor.tsx` | CREATE | Main container component |
| `src/features/editor/components/Toolbar.tsx` | CREATE | Formatting tools |
| `src/features/editor/hooks/useEditor.ts` | CREATE | Logic and state management |
| `src/app/editor/page.tsx` | CREATE | Route to access the editor |

---

## 🔗 Dependencies

**Depends On**:
- `react`
- `tailwind-merge` (for styling classes)
- `lucide-react` (icons)

**Used By**:
- Main App Layout

---

## ✅ Success Criteria

### Code Quality
- [ ] Components are typed strictly (TypeScript).
- [ ] `'use client'` usage is limited to the interactive editor components.
- [ ] Code follows the 200-line rule.

### Functionality
- [ ] User can write markdown and see it rendered correctly.
- [ ] Content persists after refresh.
- [ ] Basic formatting shortcuts work.

### Verification
- [ ] Manual test: Write a complex markdown note (lists, headers, bold).
- [ ] Manual test: Refresh page and verify content returns.

---

## 🚀 Getting Started

1. Create the feature folder structure.
2. Install `react-markdown`.
3. Build the `Editor` component with a simple textarea first.
4. Add the Preview layer.
5. Add Persistence.

---

## 📝 Notes

- Consider using `@tailwindcss/typography` (`prose` class) for the preview styling to save time.
- Keep the `Editor` state local to the feature for now; do not over-engineer global state yet.
