import { mergeFeature, removeWorktree, hasCommits } from '../lib/worktree.js';
import { rmSync, existsSync } from 'fs';
import { join } from 'path';

interface MergeOptions {
    cleanup: boolean;
}

/**
 * Handle the merge command
 * vibecode merge <feature> [--no-cleanup]
 */
export async function mergeCommand(feature: string, options: MergeOptions): Promise<void> {
    console.log('');
    console.log('🔀 VibeCode Merge');
    console.log('=================');

    try {
        // Check if feature has commits
        console.log(`\n📋 Checking feature: ${feature}`);

        if (!hasCommits(feature)) {
            console.log('  ⚠️  No new commits found on this feature branch');
        }

        // Merge the feature
        console.log(`\n🔀 Merging...`);
        const success = mergeFeature(feature);

        if (!success) {
            console.error('');
            console.error('❌ Merge failed. Resolve conflicts manually, then run:');
            console.error(`   git merge feat-${feature} --continue`);
            console.error('');
            process.exit(1);
        }

        // Cleanup if requested
        if (options.cleanup) {
            console.log(`\n🧹 Cleaning up...`);
            removeWorktree(feature, true);

            // Also clean up status file
            const statusFile = join(process.cwd(), '.agent-logs', `${feature}-status.json`);
            if (existsSync(statusFile)) {
                rmSync(statusFile);
                console.log('  Removed status file');
            }
        }

        console.log('');
        console.log('✅ Feature merged successfully!');
        console.log('');

    } catch (error) {
        console.error('');
        console.error('❌ Error:', error instanceof Error ? error.message : error);
        console.error('');
        process.exit(1);
    }
}
