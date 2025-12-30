import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';

export interface SpawnOptions {
    workDir: string;
    approvalMode: 'yolo' | 'auto_edit' | 'default';
    useTerminal: boolean;
    featureName?: string;
}

/**
 * Spawn a Gemini CLI agent with the given prompt
 */
export async function spawnGeminiAgent(prompt: string, options: SpawnOptions): Promise<void> {
    const { workDir, approvalMode, useTerminal, featureName } = options;
    const projectDir = process.cwd();

    // Create logs directory
    const logsDir = join(projectDir, '.agent-logs');
    if (!existsSync(logsDir)) {
        mkdirSync(logsDir, { recursive: true });
    }

    const agentName = featureName || 'agent';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const logFilePath = join(logsDir, `${agentName}-${timestamp}.log`);
    const statusFilePath = join(logsDir, `${agentName}-status.json`);

    // Write initial status
    const status = {
        status: 'running',
        started: new Date().toISOString(),
        agent: agentName
    };
    writeFileSync(statusFilePath, JSON.stringify(status, null, 2));

    // Escape prompt for command line
    const escapedPrompt = prompt.replace(/'/g, "''");

    // Build the temp script
    const tempScriptPath = join(process.env.TEMP || '/tmp', `gemini-agent-${Date.now()}.ps1`);

    const scriptContent = `
Set-Location '${workDir}'

# Initialize status (use .NET to write UTF-8 without BOM)
$status = @{ status = 'running'; started = '${new Date().toISOString()}'; agent = '${agentName}' } | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText('${statusFilePath}', $status)

Write-Host '===========================================' -ForegroundColor Cyan
Write-Host ' VibeCode Agent Starting...' -ForegroundColor Cyan
Write-Host ' Agent: ${agentName}' -ForegroundColor Gray
Write-Host ' Mode: ${approvalMode}' -ForegroundColor Gray
Write-Host ' Log: ${logFilePath}' -ForegroundColor Gray
Write-Host '===========================================' -ForegroundColor Cyan
Write-Host ''

$prompt = @'
${escapedPrompt}
'@

# Run gemini with Tee-Object to capture output
gemini --approval-mode ${approvalMode} --output-format stream-json $prompt 2>&1 | Tee-Object -FilePath '${logFilePath}'

# Update status on completion
$finalStatus = @{ status = 'complete'; started = '${new Date().toISOString()}'; completed = (Get-Date -Format 'o'); agent = '${agentName}' } | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText('${statusFilePath}', $finalStatus)

Write-Host ''
Write-Host '===========================================' -ForegroundColor Green
Write-Host ' Agent Complete!' -ForegroundColor Green
Write-Host '===========================================' -ForegroundColor Green
`;

    writeFileSync(tempScriptPath, scriptContent, 'utf-8');

    if (useTerminal) {
        // Spawn in new Windows Terminal tab
        const title = `VibeCode: ${agentName}`;
        spawn('wt', [
            '-w', '0',
            'new-tab',
            '--title', title,
            '-d', workDir,
            'powershell', '-NoExit', '-ExecutionPolicy', 'Bypass', '-File', tempScriptPath
        ], { detached: true, stdio: 'ignore' }).unref();

        console.log(`  Agent spawned in new terminal tab`);
        console.log(`  Log: ${logFilePath}`);
        console.log(`  Status: ${statusFilePath}`);
    } else {
        // Run in background
        spawn('powershell', ['-ExecutionPolicy', 'Bypass', '-File', tempScriptPath], {
            detached: true,
            stdio: 'ignore',
            cwd: workDir
        }).unref();

        console.log(`  Agent spawned in background`);
        console.log(`  Log: ${logFilePath}`);
    }
}
