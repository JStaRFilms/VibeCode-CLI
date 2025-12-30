<#
.SYNOPSIS
    Spawn a single Gemini CLI agent in a new terminal tab

.DESCRIPTION
    Spawns a Gemini CLI instance in YOLO mode for a specific task.
    Optionally creates a git worktree for isolation.

.PARAMETER Task
    Task description or path to task file

.PARAMETER WorktreeName
    Optional worktree name (creates isolated environment)

.PARAMETER ApprovalMode
    Approval mode: "yolo", "auto_edit", or "default"

.EXAMPLE
    .\spawn-gemini-agent.ps1 -Task "Implement user authentication" -WorktreeName "auth"
    .\spawn-gemini-agent.ps1 -Task "docs/tasks/TASK-dashboard.md" -WorktreeName "dashboard"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$Task,
    
    [string]$WorktreeName = "",
    
    [ValidateSet("yolo", "auto_edit", "default")]
    [string]$ApprovalMode = "yolo",
    
    [string]$AgentMode = "vibe-builder",
    
    [switch]$IncludeMainProject
)

# Use Continue to avoid stopping on git's stderr output (which is informational)
$ErrorActionPreference = "Continue"
$ProjectDir = (Get-Location).Path

function Write-Status {
    param([string]$Status, [string]$Color = "Yellow")
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Status" -ForegroundColor $Color
}

# Determine if Task is a file path or direct prompt
$isTaskFile = (Test-Path $Task) -or ($Task -match "\.md$")

if ($isTaskFile -and (Test-Path $Task)) {
    $taskContent = Get-Content $Task -Raw
    $prompt = @"
You are a VibeCode $AgentMode agent.

Read and implement the following task:

---
$taskContent
---

CRITICAL INSTRUCTIONS:
1. Follow the implementation plan exactly
2. Create all files specified
3. Test your changes compile/build
4. Commit your changes when done

START NOW.
"@
} else {
    $prompt = @"
You are a VibeCode $AgentMode agent.

Your task: $Task

CRITICAL INSTRUCTIONS:
1. Plan before you code
2. Create clean, typed code
3. Test your changes
4. Commit when done

START NOW.
"@
}

# Create worktree if specified
$workDir = $ProjectDir
if ($WorktreeName) {
    $branchName = "feat-$WorktreeName"
    $worktreePath = Join-Path (Split-Path $ProjectDir -Parent) "$((Split-Path $ProjectDir -Leaf))-$branchName"
    
    if (-not (Test-Path $worktreePath)) {
        Write-Status "Creating worktree: $worktreePath" "Green"
        
        # Create branch if needed
        $existingBranch = git branch --list $branchName 2>$null
        if (-not $existingBranch) {
            git branch $branchName 2>$null
        }
        
        git worktree add $worktreePath $branchName 2>$null
        
        # Copy common config files that aren't in git
        $configFiles = @(
            ".env",
            ".env.local",
            ".env.development.local",
            ".env.production.local"
        )
        
        foreach ($configFile in $configFiles) {
            if (Test-Path $configFile) {
                Copy-Item $configFile (Join-Path $worktreePath $configFile)
                Write-Status "  Copied: $configFile" "Gray"
            }
        }
        
        # Copy prisma directory if it exists (for local SQLite DBs)
        if (Test-Path "prisma") {
            Copy-Item "prisma" (Join-Path $worktreePath "prisma") -Recurse -Force
            Write-Status "  Copied: prisma/" "Gray"
        }
    }
    
    $workDir = $worktreePath
}

# Build gemini command arguments
$geminiArgs = @("--approval-mode", $ApprovalMode, "--output-format", "stream-json")

if ($IncludeMainProject -and $WorktreeName) {
    $geminiArgs += @("--include-directories", $ProjectDir)
}

# Create logs directory and log file path
$logsDir = Join-Path $ProjectDir ".agent-logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$agentName = if ($WorktreeName) { $WorktreeName } else { "agent" }
$logFilePath = Join-Path $logsDir "$agentName-$timestamp.log"
$statusFilePath = Join-Path $logsDir "$agentName-status.json"

# Create a temp script file to avoid quote/newline escaping issues
$tempScriptPath = Join-Path $env:TEMP "gemini-agent-$(Get-Random).ps1"

# Escape the prompt for embedding in script
$escapedPrompt = $prompt -replace "'", "''"

$scriptContent = @"
Set-Location '$workDir'

# Initialize status file
@{ status = 'running'; started = '$(Get-Date -Format "o")'; agent = '$agentName' } | ConvertTo-Json | Out-File '$statusFilePath'

Write-Host '===========================================' -ForegroundColor Cyan
Write-Host ' Gemini Agent Starting...' -ForegroundColor Cyan
Write-Host ' Mode: $AgentMode' -ForegroundColor Gray
Write-Host ' Approval: $ApprovalMode' -ForegroundColor Gray
Write-Host ' Log: $logFilePath' -ForegroundColor Gray
Write-Host '===========================================' -ForegroundColor Cyan
Write-Host ''

`$prompt = @'
$escapedPrompt
'@

# Run gemini with Tee-Object to capture output to log file while showing in terminal
gemini $($geminiArgs -join ' ') `$prompt 2>&1 | Tee-Object -FilePath '$logFilePath'

# Update status file on completion
@{ status = 'complete'; started = '$(Get-Date -Format "o")'; completed = (Get-Date -Format 'o'); agent = '$agentName' } | ConvertTo-Json | Out-File '$statusFilePath'

Write-Host ''
Write-Host '===========================================' -ForegroundColor Green
Write-Host ' Agent Complete!' -ForegroundColor Green
Write-Host ' Log saved to: $logFilePath' -ForegroundColor Gray
Write-Host '===========================================' -ForegroundColor Green
"@

$scriptContent | Out-File -FilePath $tempScriptPath -Encoding utf8

# Spawn in Windows Terminal
Write-Status "Spawning Gemini agent..." "Green"
Write-Host "  Mode: $AgentMode" -ForegroundColor Gray
Write-Host "  Approval: $ApprovalMode" -ForegroundColor Gray
Write-Host "  Directory: $workDir" -ForegroundColor Gray
Write-Host "  Log File: $logFilePath" -ForegroundColor Cyan
Write-Host "  Status File: $statusFilePath" -ForegroundColor Cyan

$title = if ($WorktreeName) { "Agent: $WorktreeName" } else { "Gemini Agent" }

Start-Process -FilePath "wt" -ArgumentList @(
    "-w", "0",
    "new-tab",
    "--title", "`"$title`"",
    "-d", "`"$workDir`"",
    "powershell", "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$tempScriptPath`""
)

Write-Status "Agent spawned in new terminal tab!" "Green"
Write-Status "Track progress: Get-Content '$statusFilePath'" "Cyan"
