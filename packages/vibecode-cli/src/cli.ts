#!/usr/bin/env node

import { Command } from 'commander';
import { spawnCommand } from './commands/spawn.js';
import { statusCommand } from './commands/status.js';
import { mergeCommand } from './commands/merge.js';

const program = new Command();

program
    .name('vibecode')
    .description('VibeCode CLI - Orchestrate AI agents for autonomous development')
    .version('0.2.3');

// vibecode spawn <agent> "task" [--worktree name]
program
    .command('spawn')
    .description('Spawn a VibeCode agent to work on a task')
    .argument('<agent>', 'Agent type (e.g., vibe-builder, vibe-architect)')
    .argument('<task>', 'Task description or prompt')
    .option('-w, --worktree <name>', 'Create isolated git worktree for this task')
    .option('-m, --mode <mode>', 'Approval mode: yolo, auto_edit, or default', 'yolo')
    .option('--no-terminal', 'Run in background instead of new terminal tab')
    .action(spawnCommand);

// vibecode status [--watch]
program
    .command('status')
    .description('Check status of spawned agents')
    .option('-w, --watch', 'Continuously monitor agent status')
    .option('-i, --interval <seconds>', 'Poll interval for watch mode', '3')
    .action(statusCommand);

// vibecode merge <feature>
program
    .command('merge')
    .description('Merge a completed feature branch and cleanup')
    .argument('<feature>', 'Feature/worktree name to merge')
    .option('--no-cleanup', 'Keep worktree after merge')
    .action(mergeCommand);

// vibecode list
program
    .command('list')
    .description('List available agents')
    .action(async () => {
        const { listAgents } = await import('./lib/agents.js');
        const agents = await listAgents();
        console.log('\nAvailable VibeCode Agents:\n');
        for (const agent of agents) {
            console.log(`  • ${agent.slug} - ${agent.name}`);
        }
        console.log('');
    });

program.parse();
