import { loadAgent, buildAgentPrompt } from '../lib/agents.js';
import { createWorktree } from '../lib/worktree.js';
import { spawnGeminiAgent } from '../lib/gemini.js';

interface SpawnOptions {
    worktree?: string;
    mode: 'yolo' | 'auto_edit' | 'default';
    terminal: boolean;
}

/**
 * Handle the spawn command
 * vibecode spawn <agent> "task" [--worktree name] [--mode yolo]
 */
export async function spawnCommand(
    agentSlug: string,
    task: string,
    options: SpawnOptions
): Promise<void> {
    console.log('');
    console.log('🚀 VibeCode Spawn');
    console.log('=================');

    try {
        // Load agent configuration
        console.log(`\n📦 Loading agent: ${agentSlug}`);
        const agent = await loadAgent(agentSlug);
        console.log(`  Found: ${agent.name}`);

        // Build the full prompt with agent protocol + task
        const fullPrompt = buildAgentPrompt(agent, task);
        console.log(`  Prompt size: ${fullPrompt.length} characters`);

        // Determine work directory
        let workDir = process.cwd();
        let featureName = options.worktree;

        if (options.worktree) {
            console.log(`\n📁 Creating worktree: ${options.worktree}`);
            const worktree = createWorktree(options.worktree);
            workDir = worktree.path;
            featureName = worktree.feature;
        }

        // Spawn the agent
        console.log(`\n⚡ Spawning agent...`);
        await spawnGeminiAgent(fullPrompt, {
            workDir,
            approvalMode: options.mode as 'yolo' | 'auto_edit' | 'default',
            useTerminal: options.terminal,
            featureName
        });

        console.log('');
        console.log('✅ Agent spawned successfully!');
        console.log('');
        console.log('Monitor progress:');
        console.log('  vibecode status --watch');
        console.log('');

        if (options.worktree) {
            console.log('When complete, merge with:');
            console.log(`  vibecode merge ${options.worktree}`);
            console.log('');
        }

    } catch (error) {
        console.error('');
        console.error('❌ Error:', error instanceof Error ? error.message : error);
        console.error('');
        process.exit(1);
    }
}
