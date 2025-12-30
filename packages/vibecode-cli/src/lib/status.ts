import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

export interface AgentStatus {
    status: 'running' | 'complete' | 'error';
    started?: string;
    completed?: string;
    agent: string;
    error?: string;
}

/**
 * Get the logs directory path
 */
function getLogsDir(): string {
    return join(process.cwd(), '.agent-logs');
}

/**
 * Get status of all agents
 */
export function getAgentStatuses(): AgentStatus[] {
    const logsDir = getLogsDir();

    if (!existsSync(logsDir)) {
        return [];
    }

    const statusFiles = readdirSync(logsDir).filter(f => f.endsWith('-status.json'));
    const statuses: AgentStatus[] = [];

    for (const file of statusFiles) {
        try {
            const content = readFileSync(join(logsDir, file), 'utf-8');
            const status = JSON.parse(content) as AgentStatus;
            statuses.push(status);
        } catch (error) {
            statuses.push({
                status: 'error',
                agent: file.replace('-status.json', ''),
                error: String(error)
            });
        }
    }

    return statuses;
}

/**
 * Display agent statuses
 */
export function displayStatuses(statuses: AgentStatus[]): void {
    console.log('');
    console.log('===========================================');
    console.log(' VIBECODE AGENT STATUS');
    console.log(` ${new Date().toLocaleTimeString()}`);
    console.log('===========================================');
    console.log('');

    if (statuses.length === 0) {
        console.log('  No agents running. Use `vibecode spawn` to start one.');
        console.log('');
        return;
    }

    for (const status of statuses) {
        const icon = status.status === 'running' ? '[...]'
            : status.status === 'complete' ? '[OK]'
                : '[ERR]';

        const color = status.status === 'running' ? '\x1b[33m'  // Yellow
            : status.status === 'complete' ? '\x1b[32m' // Green
                : '\x1b[31m';                               // Red

        console.log(`  ${color}${icon} ${status.agent} - ${status.status}\x1b[0m`);

        if (status.started) {
            console.log(`       Started: ${status.started}`);
        }
        if (status.completed) {
            console.log(`       Completed: ${status.completed}`);
        }
        if (status.error) {
            console.log(`       Error: ${status.error}`);
        }
    }

    console.log('');

    const running = statuses.filter(s => s.status === 'running').length;
    const complete = statuses.filter(s => s.status === 'complete').length;

    console.log(`Summary: ${complete}/${statuses.length} complete, ${running} running`);
    console.log('');
}

/**
 * Wait for all agents to complete
 */
export async function waitForCompletion(intervalSeconds: number): Promise<AgentStatus[]> {
    return new Promise((resolve) => {
        const check = () => {
            const statuses = getAgentStatuses();
            displayStatuses(statuses);

            const running = statuses.filter(s => s.status === 'running').length;

            if (running === 0 && statuses.length > 0) {
                console.log('All agents complete!');
                resolve(statuses);
            } else {
                console.log(`Refreshing in ${intervalSeconds} seconds... (Ctrl+C to stop)`);
                setTimeout(check, intervalSeconds * 1000);
            }
        };

        check();
    });
}
