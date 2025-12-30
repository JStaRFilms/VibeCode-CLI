# VibeCode CLI

The official CLI for the VibeCode protocol. Orchestrate AI agents, parallelize development, and build standard-compliant projects autonomously.

## Installation

```bash
npm install -g vibecode
# or
pnpm add -g vibecode
```

## Usage

### 🚀 Spawn Agents

```bash
# Architect a new project
vibecode spawn vibe-architect "Analyze request: Build a crypto dashboard..."

# Orchestrate a full build (autonomous mode)
vibecode spawn vibe-orchestrator "Build a full stack Next.js SaaS..."
```

### 📋 List Available Agents

```bash
vibecode list
```

### 🛠️ Utilities

- `vibe-isolator`: Manage git worktrees for parallel agents
- `vibe-reviewer`: Run J-Star code quality checks
- `vibe-documentor`: Sync documentation with code

## Agents Included

- **Core**: `vibe-architect`, `vibe-builder`, `vibe-designer`
- **Orchestration**: `vibe-orchestrator` (The Brain)
- **Quality**: `vibe-reviewer`, `vibe-auditor`, `vibe-analyzer`
- **Support**: `vibe-primer`, `vibe-onboarder`, `vibe-spawner`

## Documentation

For full protocol documentation, see the [VibeCode Protocol](https://github.com/Start-With-Nothing/VibeCode).
