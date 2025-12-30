---
description: Spawn parallel Gemini CLI agents in YOLO mode for autonomous development
---

# Gemini CLI Orchestrator Workflow

This workflow spawns multiple Gemini CLI instances in parallel, each working on a separate feature in its own git worktree.

## Prerequisites

1. Gemini CLI installed and authenticated
2. Windows Terminal installed
3. Git repository initialized
4. Task prompts in `docs/tasks/worktrees/TASK-*.md`

---

## Quick Start: Single Agent

// turbo
1. Spawn a single agent for a quick task:
```powershell
.\scripts\spawn-gemini-agent.ps1 -Task "Create a hello world component" -WorktreeName "hello"
```

---

## Full Orchestration: Multiple Parallel Agents

### Step 1: Prepare Task Prompts

Create task files in `docs/tasks/worktrees/`:
```
docs/tasks/worktrees/
├── TASK-auth.md
├── TASK-dashboard.md
└── TASK-settings.md
```

Each task file should follow the VibeCode task prompt format.

### Step 2: Run the Orchestrator

// turbo
2. Execute the orchestrator:
```powershell
.\scripts\gemini-orchestrator.ps1 -TaskDir "docs/tasks/worktrees"
```

This will:
- Create a git worktree for each task
- Spawn a Gemini CLI agent in a new terminal tab for each
- All agents run in YOLO mode (full auto-approve)

### Step 3: Monitor Progress

Watch the terminal tabs. Each agent will:
1. Read its task prompt
2. Implement the feature
3. Commit changes to its feature branch

### Step 4: Merge Results

// turbo
3. After all agents complete, merge features:
```powershell
# From main project directory
git merge feat-auth --no-edit
git merge feat-dashboard --no-edit
git merge feat-settings --no-edit
```

// turbo
4. Clean up worktrees:
```powershell
git worktree remove ../project-feat-auth
git worktree remove ../project-feat-dashboard
git worktree remove ../project-feat-settings
```

---

## Configuration Options

### Approval Modes

| Mode | Description |
|------|-------------|
| `yolo` | Auto-approve ALL actions (default) |
| `auto_edit` | Auto-approve file edits only, prompt for terminal commands |
| `default` | Prompt for everything |

### Parallel Limit

```powershell
# Limit to 2 concurrent agents
.\scripts\gemini-orchestrator.ps1 -MaxParallel 2
```

---

## Troubleshooting

**Windows Terminal not opening tabs?**
- Ensure `wt` is in your PATH
- Try running from Windows Terminal directly

**Agents not finding task files?**
- Use relative paths from project root
- Verify task file naming: `TASK-{feature}.md`

**Merge conflicts?**
- Agents work on separate files when possible
- For conflicts, resolve manually then continue
