import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, parse } from 'path';
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
    // 1. Search up the directory tree for 'docs/VibeCode-Agents'
    let currentDir = process.cwd();
    const root = parse(currentDir).root;

    while (true) {
        const potentialDir = join(currentDir, 'docs', 'VibeCode-Agents');
        if (existsSync(potentialDir)) {
            return potentialDir;
        }

        if (currentDir === root) {
            break;
        }
        currentDir = dirname(currentDir);
    }

    // 2. Fall back to package's bundled agents
    const packageAgentsDir = join(__dirname, '..', '..', 'agents');
    if (existsSync(packageAgentsDir) && readdirSync(packageAgentsDir).length > 0) {
        return packageAgentsDir;
    }

    throw new Error('No agents directory found. Please ensure you are inside a project with "docs/VibeCode-Agents".');
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
- **CRITICAL:** When you are finished:
  1. Verify everything works (build/test)
  2. Git add and commit your changes: \`git add . && git commit -m "feat: <description>"\`
  3. STOP immediately. Do not ask for feedback. Do not try to merge. Just commit and stop.

START NOW.
`;
}
