import { execSync, exec } from 'child_process';
import { existsSync, copyFileSync, cpSync } from 'fs';
import { join, dirname, basename } from 'path';

export interface WorktreeInfo {
    path: string;
    branch: string;
    feature: string;
}

/**
 * Create a git worktree for isolated development
 */
export function createWorktree(featureName: string): WorktreeInfo {
    const projectDir = process.cwd();
    const branchName = `feat-${featureName}`;
    const parentDir = dirname(projectDir);
    const projectName = basename(projectDir);
    const worktreePath = join(parentDir, `${projectName}-${branchName}`);

    if (existsSync(worktreePath)) {
        console.log(`  Worktree already exists: ${worktreePath}`);
        return { path: worktreePath, branch: branchName, feature: featureName };
    }

    // Create branch if needed
    const branchList = execSync(`git branch --list ${branchName}`, { encoding: 'utf-8' });
    if (!branchList.trim()) {
        console.log(`  Creating branch: ${branchName}`);
        execSync(`git branch ${branchName}`, { stdio: 'pipe' });
    }

    // Create worktree
    console.log(`  Creating worktree: ${worktreePath}`);
    execSync(`git worktree add "${worktreePath}" ${branchName}`, { stdio: 'pipe' });

    // Copy config files
    const configFiles = ['.env', '.env.local', '.env.development.local', '.env.production.local'];
    for (const configFile of configFiles) {
        if (existsSync(join(projectDir, configFile))) {
            copyFileSync(join(projectDir, configFile), join(worktreePath, configFile));
            console.log(`  Copied: ${configFile}`);
        }
    }

    // Copy prisma directory if exists
    const prismaDir = join(projectDir, 'prisma');
    if (existsSync(prismaDir)) {
        cpSync(prismaDir, join(worktreePath, 'prisma'), { recursive: true });
        console.log(`  Copied: prisma/`);
    }

    return { path: worktreePath, branch: branchName, feature: featureName };
}

/**
 * Remove a worktree and optionally its branch
 */
export function removeWorktree(featureName: string, deleteBranch = true): void {
    const projectDir = process.cwd();
    const branchName = `feat-${featureName}`;
    const parentDir = dirname(projectDir);
    const projectName = basename(projectDir);
    const worktreePath = join(parentDir, `${projectName}-${branchName}`);

    if (existsSync(worktreePath)) {
        console.log(`  Removing worktree: ${worktreePath}`);
        try {
            execSync(`git worktree remove "${worktreePath}" --force`, { stdio: 'pipe' });
        } catch (error) {
            // Force remove if git worktree remove fails
            try {
                execSync(`rmdir /s /q "${worktreePath}"`, { stdio: 'pipe' });
                execSync('git worktree prune', { stdio: 'pipe' });
            } catch (err) {
                console.log(`  ⚠️  Could not remove worktree folder. It may be open in another terminal.`);
                console.log(`     Manuall delete: ${worktreePath}`);
            }
        }
    }

    if (deleteBranch) {
        try {
            execSync(`git branch -d ${branchName} -f`, { stdio: 'pipe' });
            console.log(`  Deleted branch: ${branchName}`);
        } catch {
            // Branch might not exist or have unmerged changes
        }
    }
}

/**
 * Merge a feature branch into current branch
 */
export function mergeFeature(featureName: string): boolean {
    const branchName = `feat-${featureName}`;

    try {
        console.log(`  Merging ${branchName}...`);
        execSync(`git merge ${branchName} --no-edit`, { stdio: 'pipe' });
        console.log(`  ✓ Merged successfully`);
        return true;
    } catch (error) {
        console.error(`  ✗ Merge failed - manual resolution required`);
        return false;
    }
}

/**
 * Check if a feature branch has commits ahead of current
 */
export function hasCommits(featureName: string): boolean {
    const branchName = `feat-${featureName}`;

    try {
        const result = execSync(`git log HEAD..${branchName} --oneline`, { encoding: 'utf-8' });
        return result.trim().length > 0;
    } catch {
        return false;
    }
}
