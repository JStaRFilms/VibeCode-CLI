import { getAgentStatuses, displayStatuses, waitForCompletion } from '../lib/status.js';

interface StatusOptions {
    watch?: boolean;
    interval: string;
}

/**
 * Handle the status command
 * vibecode status [--watch] [--interval 3]
 */
export async function statusCommand(options: StatusOptions): Promise<void> {
    if (options.watch) {
        const interval = parseInt(options.interval, 10) || 3;
        await waitForCompletion(interval);
    } else {
        const statuses = getAgentStatuses();
        displayStatuses(statuses);
    }
}
