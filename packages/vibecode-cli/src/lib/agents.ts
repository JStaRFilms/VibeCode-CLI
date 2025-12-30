import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse as parseYaml } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface AgentConfig {
    slug: string;
    name: string;
    description: string;
    roleDefinition: string;
    whenToUse: string;
    customInstructions: string;
}

/**
 * Get the agents directory path
 */
function getAgentsDir(): string {
    // Check for agents in project's docs/VibeCode-Agents first
    const projectAgentsDir = join(process.cwd(), 'docs', 'VibeCode-Agents');
    if (existsSync(projectAgentsDir)) {
        return projectAgentsDir;
    }

    // Fall back to package's bundled agents
    const packageAgentsDir = join(__dirname, '..', '..', 'agents');
    if (existsSync(packageAgentsDir)) {
        return packageAgentsDir;
    }

    throw new Error('No agents directory found. Create docs/VibeCode-Agents or install with bundled agents.');
}

/**
 * Load a specific agent by slug
 */
export async function loadAgent(slug: string): Promise<AgentConfig> {
    const agentsDir = getAgentsDir();
    const agentPath = join(agentsDir, `${slug}.yaml`);

    if (!existsSync(agentPath)) {
        throw new Error(`Agent not found: ${slug}. Try 'vibecode list' to see available agents.`);
    }

    const content = readFileSync(agentPath, 'utf-8');
    const parsed = parseYaml(content);

    // Handle the Kilo Code YAML format with customModes array
    const modeConfig = parsed.customModes?.[0] || parsed;

    return {
        slug: modeConfig.slug || slug,
        name: modeConfig.name || slug,
        description: modeConfig.description || '',
        roleDefinition: modeConfig.roleDefinition || '',
        whenToUse: modeConfig.whenToUse || '',
        customInstructions: modeConfig.customInstructions || ''
    };
}

/**
 * List all available agents
 */
export async function listAgents(): Promise<Array<{ slug: string; name: string }>> {
    const agentsDir = getAgentsDir();
    const files = readdirSync(agentsDir).filter(f => f.endsWith('.yaml'));

    const agents: Array<{ slug: string; name: string }> = [];

    for (const file of files) {
        try {
            const content = readFileSync(join(agentsDir, file), 'utf-8');
            const parsed = parseYaml(content);
            const modeConfig = parsed.customModes?.[0] || parsed;

            agents.push({
                slug: modeConfig.slug || file.replace('.yaml', ''),
                name: modeConfig.name || file.replace('.yaml', '')
            });
        } catch {
            // Skip invalid files
        }
    }

    return agents.sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Build the full agent prompt from config and task
 */
export function buildAgentPrompt(agent: AgentConfig, task: string): string {
    return `# ${agent.name}

${agent.roleDefinition}

---

${agent.customInstructions}

---

## YOUR TASK

${task}

---

## EXECUTION MODE

You are running as a Gemini CLI agent in YOLO mode.
- All actions are auto-approved
- Work autonomously and efficiently
- Commit your changes when done
- Use clear commit messages

START NOW.
`;
}
